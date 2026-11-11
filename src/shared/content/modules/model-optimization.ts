import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const modelOptimizationMeta: ModuleMeta = {
  id: 'model-optimization-inference',
  title: {
    ru: 'Оптимизация инференса и сжатие моделей',
    en: 'Model Serving, Compression & Inference Optimization',
  },
  description: {
    ru: 'Инженерия экстремального ускорения инференса: квантование весов и активаций (INT8, FP4, AWQ, GPTQ, PTQ и QAT), дистилляция знаний (Knowledge Distillation), компиляция графов (ONNX Runtime, NVIDIA TensorRT с Kernel Fusion) и специализированные LLM-серверы (PagedAttention, vLLM, Speculative Decoding).',
    en: 'High-performance inference engineering: quantization (INT8, FP4, AWQ, GPTQ, PTQ & QAT), knowledge distillation, computational graph compilation (ONNX Runtime, TensorRT with kernel fusion), and specialized LLM engines (PagedAttention, vLLM, speculative decoding).',
  },
  order: 19,
  icon: 'model-optimization-inference',
  estimatedMinutes: 95,
  isPlaceholder: false,
};

export const modelOptimizationLessons: Lesson[] = [
  {
    id: 'opt-1-quantization-ptq-qat',
    moduleId: 'model-optimization-inference',
    title: {
      ru: 'Квантование нейросетей: PTQ, QAT и форматы LLM (AWQ, GPTQ, GGUF)',
      en: 'Neural Network Quantization: PTQ, QAT & LLM Formats (AWQ, GPTQ, GGUF)',
    },
    order: 1,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Зачем сжимать модели: бутылочное горлышко памяти

В процессе инференса нейросетей (особенно LLM) узким горлышком является не вычислительная мощность тензорных ядер (FLOPS), а **пропускная способность видеопамяти (Memory Bandwidth Bound)**.
- Веса FP32 занимают 4 байта на параметр (модель 70B = 280 GB VRAM).
- Веса FP16/BF16 занимают 2 байта на параметр (модель 70B = 140 GB VRAM).
- Квантование до INT8 (1 байт) сокращает размер в 2 раза (70 GB VRAM).
- Квантование до 4-бит INT4/FP4 (0.5 байта) сжимает модель в 4 раза (35 GB VRAM), позволяя запускать 70B модель на одной доступной GPU!

---

### Математика равномерного квантования

Квантование маппит вещественные числа высокой точности $x \\in [x_{\\min}, x_{\\max}]$ в дискретные целочисленные сетки $q \\in [q_{\\min}, q_{\\max}]$ (для INT8: $[-128, 127]$):

#### 1. Аффинное (асимметричное) квантование
$$q = \\text{clip}\\left(\\left\\lfloor \\frac{x}{S} \\right\\rceil + Z, \\; q_{\\min}, \\; q_{\\max}\\right)$$
- **Масштаб (Scale $S$):** $S = \\frac{x_{\\max} - x_{\\min}}{q_{\\max} - q_{\\min}}$
- **Точка нуля (Zero-point $Z$):** $Z = \\text{round}\\left(\\frac{-x_{\\min}}{S}\\right) + q_{\\min}$
- Деквантование обратно в вещественные числа: $\\tilde{x} = S \\cdot (q - Z)$.

#### 2. Симметричное квантование
Используется, когда распределение весов центрировано относительно нуля ($Z = 0$):
$$S = \\frac{\\max(|x_{\\min}|, |x_{\\max}|)}{q_{\\max}}, \\quad q = \\text{clip}\\left(\\left\\lfloor \\frac{x}{S} \\right\\rceil, \\; -q_{\\max}, \\; q_{\\max}\\right)$$

---

### Стратегии калибровки: PTQ vs QAT

#### 1. Post-Training Quantization (PTQ, квантование после обучения)
Веса уже обученной модели напрямую переводятся в целочисленный формат без запуска градиентного спуска.
- Для весов квантование тривиально, но для **активаций** (выходов слоев) диапазон зависит от входных данных.
- Требуется небольшой репрезентативный **калибровочный датасет (Calibration set, 100-500 примеров)**.
- Определение границ $[x_{\\min}, x_{\\max}]$ проводится не по абсолютным экстремумам (чтобы не испортить масштаб случайным шумом), а через минимизацию дивергенции Кульбака-Лейблера (KL-divergence) гистограммы распределения.

#### 2. Quantization-Aware Training (QAT, дообучение с учетом квантования)
Если модель чувствительна и PTQ приводит к падению метрик (особенно для мелких сетей < 1B), применяется QAT:
- В вычислительный граф вставляются операторы **Fake-Quantization**: числа квантуются и тут же деквантуются обратно в FP32, имитируя шум дискретизации на прямом проходе.
- Операция округления $\\lfloor \\cdot \\rceil$ имеет нулевую производную почти везде. Чтобы градиенты могли течь обратно к весам, используется **Straight-Through Estimator (STE)**:
  $$\\frac{\\partial \\lfloor x \\rceil}{\\partial x} = 1 \\quad \\text{при } x_{\\min} \\le x \\le x_{\\max}$$
- Сеть адаптирует параметры к целочисленной сетке, сохраняя 99% качества исходной FP32 модели.

---

### Современные форматы квантования LLM

В трансформерах $0.1\\%$ скрытых каналов содержат аномальные всплески амплитуды (**Activation Outliers**, значения в 100 раз выше нормы). Наивное квантование активаций приводит к краху перплексии.

1. **AWQ (Activation-aware Weight Quantization, Lin et al., 2023):**
   Квантует только веса до 4-бит, анализируя важность весов по величине соответствующих активаций. Для $1\\%$ самых важных весов применяется защитное масштабирование, сохраняя точность без необходимости квантовать активации.
2. **GPTQ (Frantar et al., 2023):**
   Построчный алгоритм квантования весов с использованием обратной матрицы Гессиана второго порядка (Taylor expansion). Квантуя одну колонку матрицы весов, алгоритм тут же корректирует оставшиеся некалиброванные веса, компенсируя накопленную ошибку.
3. **GGUF (llama.cpp):**
   Бинарный формат для эффективного инференса на CPU и Apple Silicon (Metal) с поддержкой гибридных квантований k-quants (например, Q4_K_M — критические слои внимания сохраняются в 5-6 бит, остальные в 4 бита).`,
    commonMistakes: [
      'Попытка использовать калибровочный датасет с синтетическим шумом для PTQ: калибровочные сэмплы обязаны точно повторять реальное распределение рабочих запросов.',
      'Ожидание ускорения от квантования только весов (Weight-only INT4/INT8) при пакетной обработке с большим батчем: при больших батчах инференс становится Compute-bound, и без квантования активаций тензорные ядра не смогут выполнять целочисленное умножение INT8 GEMM.',
      'Отказ от калибровки через KL-дивергенцию в пользу банального min/max: единичный выброс растягивает шаг квантования S, превращая все полезные веса в единицы и нули.',
    ],
    checkpointQuiz: [
      {
        id: 'opt-cp-1-1',
        question: 'Какую главную задачу решает Straight-Through Estimator (STE) в алгоритме Quantization-Aware Training (QAT)?',
        options: [
          'Ускоряет чтение файлов с жесткого диска',
          'Позволяет градиентам протекать через операцию дискретного округления, заменяя ее производную на единицу при обратном проходе',
          'Автоматически удаляет 50% наименее важных весов модели',
          'Переводит модель с языка Python на язык C++',
        ],
        correctAnswer: 1,
        explanation: 'Операция округления round() имеет производную 0 везде, что блокирует обратное распространение ошибки. STE заменяет производную округления на 1.',
      },
      {
        id: 'opt-cp-1-2',
        question: 'В чем заключается принципиальная идея метода AWQ (Activation-aware Weight Quantization)?',
        options: [
          'Все слои модели удаляются, кроме первого и последнего',
          'Веса квантуются в 4 бита, но 1% наиболее критичных весов определяются по величине входящих активаций и защищаются от искажений масштабированием',
          'Модель обучается заново с нуля на терабайте текстов',
          'Используется только для моделей компьютерного зрения',
        ],
        correctAnswer: 1,
        explanation: 'AWQ замечает, что не все веса одинаково важны: веса, умножающиеся на аномально крупные активации (outliers), защищаются от ошибки квантования.',
      },
      {
        id: 'opt-cp-1-3',
        question: 'Зачем при Post-Training Quantization (PTQ) калибровочные границы активаций подбирают через дивергенцию Кульбака-Лейблера (KL), а не по абсолютному min/max?',
        options: [
          'Абсолютный min/max крайне чувствителен к редким случайным выбросам, которые растягивают шаг квантования и разрушают точность нормальных значений',
          'KL-дивергенция гарантирует нулевой расход оперативной памяти',
          'Формула min/max не поддерживается современными видеокартами',
          'Чтобы сделать модель мультипликативной',
        ],
        correctAnswer: 0,
        explanation: 'Единичный экстремальный выброс при min/max калибровке приведет к тому, что 99.9% полезного распределения спрессуется в пару квантов. KL-дивергенция находит порог с минимальной потерей энтропии.',
      },
    ],
  },
  {
    id: 'opt-2-knowledge-distillation-pruning',
    moduleId: 'model-optimization-inference',
    title: {
      ru: 'Дистилляция знаний (Knowledge Distillation) и прунинг нейросетей',
      en: 'Knowledge Distillation & Neural Network Pruning Techniques',
    },
    order: 2,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Дистилляция знаний (Knowledge Distillation)

Классическая концепция дистилляции (Geoffrey Hinton, Oriol Vinyals, Jeff Dean, 2015) переносит знания из тяжелой модели-учителя (**Teacher**, огромная нейросеть или ансамбль) в компактную быструю модель-ученика (**Student**).

#### В чем феномен «Темных знаний» (Dark Knowledge)?
Обычная hard-разметка (one-hot вектор: класс "BMW" = $[1, 0, 0]$) говорит лишь о правильном классе.
Учитель же генерирует мягкие вероятности (Soft Targets): класс "BMW" = $0.85$, "Mercedes" = $0.14$, "Морковь" = $0.00001$.
В этих крошечных фоновых вероятностях содержится **богатая топология пространства признаков**: модель знает, что BMW очень похож на Mercedes и не имеет ничего общего с морковью.

#### Формула температуры Softmax
Для проявления темных знаний логиты $z_i$ масштабируются температурой $T > 1$:
$$q_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}$$
- При $T=1$ распределение стремится к one-hot вектору.
- При $T > 1$ распределение сглаживается, проявляя скрытые корреляции.

#### Функция потерь дистилляции (Loss Function)
Ученик обучается одновременно повторять предсказания учителя и попадать в истинные метки:
$$\\mathcal{L}_{\\text{total}} = \\alpha \\cdot T^2 \\cdot \\mathcal{L}_{\\text{KL}}(q_{\\text{student}}, \\; q_{\\text{teacher}}) + (1 - \\alpha) \\cdot \\mathcal{L}_{\\text{CE}}(y_{\\text{true}}, \\; p_{\\text{student}})$$
*Множитель $T^2$:* производная софтмакса с температурой $T$ масштабируется как $1/T^2$. Умножение на $T^2$ балансирует градиенты мягкого лосса с жестким лоссом Cross-Entropy.

---

### Продвинутые формы дистилляции

1. **Feature-based Distillation (FitNets, Romero et al.):**
   Ученик учится повторять не только финальные вероятности, но и промежуточные тензоры скрытых слоев учителя:
   $$\\mathcal{L}_{\\text{feat}} = \\|W_{\\text{proj}} h_{\\text{student}} - h_{\\text{teacher}}\\|^2_2$$
2. **Дистилляция в LLM (Sequence-Level KD, Kim & Rush):**
   Учитель (например, GPT-4) генерирует сотни тысяч цепочек рассуждений (Chain-of-Thought), на которых обучается маленькая открытая модель 3B/7B (Supervised Fine-Tuning на синтетических данных учителя).

---

### Прунинг (Pruning): прореживание весов

Прунинг удаляет из сети избыточные синапсы и нейроны, обнуляя их веса.

#### 1. Неструктурированный прунинг (Unstructured / Weight Pruning)
Обнуляются отдельные веса матрицы с наименьшей абсолютной величиной $|w_{ij}| < \\theta$.
- *Плюс:* можно без потери качества удалить до $80-90\\%$ параметров.
- *Минус:* матрица становится разреженной (Sparse). Стандартные библиотеки плотной линейной алгебры (cuBLAS) не получают ускорения без специализированных аппаратных блоков (например, NVIDIA Sparse Tensor Cores с шаблоном 2:4 sparsity).

#### 2. Структурированный прунинг (Structured Pruning)
Удаляются целые каналы сверток, строки матриц весов или головы внимания Transformer.
- *Плюс:* физически уменьшаются размерности матриц. Ускорение инференса достигается «из коробки» на любом оборудовании и в любом стандартном фреймворке без поддержки разреженности.
- *Минус:* сильнее снижает точность при высоких коэффициентах сжатия (> 40%).

#### Гипотеза лотерейного билета (Lottery Ticket Hypothesis, Frankle & Carbin, 2018)
> В любой случайно инициализированной плотной нейросети существует изолированная разреженная подсеть («выигрышный лотерейный билет»), которая при обучении с теми же начальными весами $w_0$ способна достичь той же точности за то же число эпох, что и полная сеть.`,
    commonMistakes: [
      'Забывание коэффициента T^2 перед KL-дивергенцией в функции потерь дистилляции: градиенты мягких целей оказываются подавлены в T^2 раз по сравнению с hard cross-entropy.',
      'Ожидание ускорения инференса на CPU от неструктурированного прунинга весов без компиляции под специальный формат разреженных матриц (CSR/CSC).',
      'Обучение модели-ученика со слишком низкой температурой (T=1): теряются ключевые скрытые корреляции между классами.',
    ],
    checkpointQuiz: [
      {
        id: 'opt-cp-2-1',
        question: 'Зачем в функции потерь дистилляции Хинтона слагаемое KL-дивергенции умножается на T^2?',
        options: [
          'Чтобы перевести лосс из шкалы Цельсия в шкалу Кельвина',
          'Потому что градиенты функции Softmax с температурой масштабируются как 1/T^2, и умножение на T^2 сохраняет баланс между мягким и жестким лоссом',
          'Это эмпирическое правило для работы с библиотекой PyTorch',
          'Чтобы лосс гарантированно стал отрицательным числом',
        ],
        correctAnswer: 1,
        explanation: 'Деление логитов на T уменьшает амплитуду градиентов пропорционально 1/T^2. Умножение на T^2 математически стабилизирует величину шага оптимизатора.',
      },
      {
        id: 'opt-cp-2-2',
        question: 'В чем ключевое практическое преимущество структурированного прунинга (Structured Pruning) перед неструктурированным?',
        options: [
          'Он физически удаляет целые каналы и строки матриц, обеспечивая реальное аппаратное ускорение на любых стандартных GPU без специальных библиотек разреженности',
          'Он позволяет обучать модель без видеокарты',
          'Он гарантирует 100% точность классификации',
          'Он шифрует веса модели',
        ],
        correctAnswer: 0,
        explanation: 'Неструктурированный прунинг создает дыры в матрицах, требуя разреженных вычислений. Структурированный прунинг уменьшает сами размеры тензоров, ускоряя стандартные плотные GEMM операции.',
      },
      {
        id: 'opt-cp-2-3',
        question: 'Что утверждает гипотеза лотерейного билета (Lottery Ticket Hypothesis)?',
        options: [
          'Вероятность переобучения модели можно рассчитать по формуле лотереи',
          'В плотной случайно инициализированной сети существует разреженная подсеть, которая с исходной инициализацией обучается до той же точности, что и полная сеть',
          'Нейросети неприменимы для предсказания случайных процессов',
          'Квантование весов является стохастической лотереей',
        ],
        correctAnswer: 1,
        explanation: 'Франкл и Карбин доказали, что избыточные параметры сети служат лишь для облегчения оптимизации, а итоговая полезная репрезентация содержится в компактной подсети.',
      },
    ],
  },
  {
    id: 'opt-3-onnx-tensorrt-compilation',
    moduleId: 'model-optimization-inference',
    title: {
      ru: 'Графовые компиляторы: ONNX Runtime и ускорение на NVIDIA TensorRT',
      en: 'Graph Compilers: ONNX Runtime & NVIDIA TensorRT Acceleration',
    },
    order: 3,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Изъяны сред разработки в продакшене (The PyTorch Overhead)

Фреймворк PyTorch спроектирован для максимальной гибкости исследований (Eager Execution). Но в продакшене гибкость оборачивается серьезным оверхедом:
1. **Интерпретатор Python и GIL:** каждый вызов слоя проходит через слой CPython.
2. **Частые запуски мелких ядер (Kernel Launch Overhead):** если сеть состоит из 100 слоев, GPU запускает сотни микро-ядер. Запуск каждого ядра занимает $3-5$ микросекунд.
3. **Бутылочное горлышко VRAM DRAM:** после каждого отдельного слоя (Conv $\\to$ BatchNorm $\\to$ ReLU) промежуточный тензор записывается в глобальную память видеокарты, а затем следующим ядром считывается обратно. Пропускная способность шины памяти расходуется вхолостую!

---

### Формат ONNX (Open Neural Network Exchange)

**ONNX** — открытый стандарт описания графов вычислений машинного обучения.
- Модель сериализуется в единый бинарный файл протокола Protocol Buffers (\`.onnx\`), включающий топологию графа и веса.
- Не зависит от фреймворка: модель из PyTorch можно запустить на C++, C#, Java, JavaScript.

\`\`\`python
import torch

# Экспорт с поддержкой динамического батча
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    opset_version=17,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={
        "input": {0: "batch_size"},
        "output": {0: "batch_size"}
    }
)
\`\`\`

#### Среда выполнения ONNX Runtime (ORT)
Высокопроизводительный движок Microsoft, который оптимизирует граф перед запуском:
- **Constant Folding (Сворачивание констант):** статические выражения вычисляются на этапе загрузки.
- **Node Elimination:** удаление неиспользуемых узлов (Dead code).
- **Execution Providers (EP):** прозрачное перенаправление графа на нужное железо (\`CUDAExecutionProvider\`, \`TensorrtExecutionProvider\`, \`CoreMLExecutionProvider\`).

---

### NVIDIA TensorRT: максимальная производительность на GPU

**TensorRT** — проприетарный оптимизатор и runtime от NVIDIA, компилирующий модель в низкоуровневый исполняемый план (**Engine / Plan file**) под конкретную микроархитектуру чипа.

#### 4 ключевые оптимизации TensorRT:

1. **Kernel / Layer Fusion (Слияние слоев и ядер):**
   TensorRT находит цепочки операций в графе и объединяет их в одно специализированное CUDA-ядро:
   - *Вертикальное слияние:* \`Conv + Bias + ReLU\` сливаются в одно монолитное ядро (данные остаются в сверхбыстрых регистрах и кэше L1 кристалла GPU, не выходя в глобальную память VRAM!).
   - *Горизонтальное слияние:* параллельные ветки вычислений с одинаковыми операциями объединяются в один запуск.
2. **Auto-Tuning алгоритмов (Kernel Selection):**
   TensorRT физически бенчмаркает десятки реализаций сверток и матричных умножений (Direct GEMM, FFT, Winograd) непосредственно на целевой видеокарте при компиляции плана, выбирая наибыстрейшую для конкретных размерностей.
3. **Dynamic Shapes & Optimization Profiles:**
   Для работы с переменным размером батча или длины текста задаются профили оптимизации:
   \`profile.set_shape("input", min=(1, 3, 224, 224), opt=(8, 3, 224, 224), max=(32, 3, 224, 224))\`.
   Движок настраивает параметры размещения блоков CUDA под точку \`opt\`.
4. **FP16 и INT8 калибровка под Tensor Cores:**
   Автоматическая утилизация тензорных ядер с аппаратным ускорением целочисленных инструкций DP4A.`,
    commonMistakes: [
      'Попытка перенести скомпилированный файл `.engine` TensorRT на другой сервер с другой моделью видеокарты: движок привязан к конкретной микроархитектуре GPU и не запустится на другом поколении чипа.',
      'Экспорт в ONNX со статическими размерностями батча без указания `dynamic_axes`: сервер падает с ошибкой несоответствия формы при попытке обработать запрос с другим размером батча.',
      'Игнорирование версий Opset при экспорте сложных операций трансформеров: старые версии опсетов не поддерживают современные операторы вроде ScaledDotProductAttention.',
    ],
    checkpointQuiz: [
      {
        id: 'opt-cp-3-1',
        question: 'Что такое "Kernel Fusion" (слияние ядер) в оптимизаторе NVIDIA TensorRT?',
        options: [
          'Удаление всех сверточных слоев из нейросети',
          'Объединение последовательности слоев (например, Conv + Bias + ReLU) в одно общее скомпилированное GPU-ядро, исключающее холостую запись промежуточных тензоров в глобальную VRAM',
          'Объединение нескольких физических видеокарт одним кабелем',
          'Слияние обучающего и валидационного датасета',
        ],
        correctAnswer: 1,
        explanation: 'Kernel Fusion оставляет промежуточные результаты вычислений в регистрах потоковых мультипроцессоров (SM), избегая задержек медленной шины глобальной видеопамяти.',
      },
      {
        id: 'opt-cp-3-2',
        question: 'Можно ли запустить бинарный файл движка TensorRT (.engine), скомпилированный на NVIDIA RTX 3090, на сервере с NVIDIA H100?',
        options: [
          'Да, файл .engine является универсальным кроссплатформенным байткодом',
          'Нет, план TensorRT компилируется под конкретную микроархитектуру и вычислительные возможности (Compute Capability) целевого GPU',
          'Да, но только если операционная система — Windows',
          'Да, если размер батча равен 1',
        ],
        correctAnswer: 1,
        explanation: 'TensorRT генерирует машинный код под конкретный кристалл GPU. При смене видеокарты движок необходимо пересобрать из исходного ONNX файла.',
      },
      {
        id: 'opt-cp-3-3',
        question: 'Зачем при экспорте модели PyTorch в формат ONNX используется параметр dynamic_axes?',
        options: [
          'Чтобы разрешить модели динамически менять размер батча или длину входной последовательности во время инференса',
          'Чтобы автоматически повернуть изображение на 90 градусов',
          'Чтобы включить квантование в 1 бит',
          'Чтобы защитить модель от взлома паролем',
        ],
        correctAnswer: 0,
        explanation: 'Без dynamic_axes ONNX зафиксирует размерности тензора (например, batch=1, length=128), и инференс с другими формами будет завершаться ошибкой.',
      },
    ],
  },
  {
    id: 'opt-4-llm-engines-vllm-speculative',
    moduleId: 'model-optimization-inference',
    title: {
      ru: 'Высоконагруженный сервинг LLM: PagedAttention (vLLM) и Спекулятивное декодирование',
      en: 'High-Throughput LLM Serving: PagedAttention (vLLM) & Speculative Decoding',
    },
    order: 4,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: `### Почему стандартный PyTorch не масштабируется для LLM

Авторегрессионная генерация текста генерирует токены по одному. При одновременном обслуживании десятков пользователей возникают 2 критические проблемы:
1. **Катастрофическая фрагментация памяти KV-кэша:**
   Чтобы сохранить ключи и значения $K, V$ для каждого пользователя, наивные серверы аллоцируют непрерывный кусок памяти под максимальный контекст (\`max_model_len = 8192\`). Если пользователь задал короткий вопрос на 50 токенов, **$99\\%$ зарезервированной памяти простаивает впустую**. В итоге видеокарта вмещает всего 2-4 параллельных запроса.
2. **Пузыри ожидания (Static Batching Bubbles):**
   При классическом батчинге батч не может вернуть ответ, пока не догенерирует токен **самый длинный** запрос в группе. Короткие запросы блокируются и ждут.

---

### Революция vLLM: алгоритм PagedAttention (Kwon et al., 2023)

Вдохновившись механизмом **виртуальной памяти и страниц операционных систем (OS Paging)**, исследователи из UC Berkeley разработали **PagedAttention**:

\`\`\`
Логический KV-кэш запроса:
[Токены 0-3] -> [Токены 4-7] -> [Токены 8-11]
      │               │               │
Таблица страниц (Page Table):
  Блок 0         -> Физический блок VRAM #12
  Блок 1         -> Физический блок VRAM #3
  Блок 2         -> Физический блок VRAM #47
\`\`\`

- Память под ключи и значения выделяется небольшими дискретными блоками фиксированного размера (например, по 16 токенов).
- Физические блоки располагаются в VRAM **не непрерывно**, а там, где есть свободные слоты.
- **Нулевая внешняя фрагментация:** память запрашивается по мере генерации новых токенов.
- **Copy-on-Write при параллельном сэмплировании:** если для одного промпта генерируется 5 вариантов ответов (Beam Search или n=5), токены промпта делят одну физическую страницу памяти, копируясь только в момент расхождения генерации!
- *Результат:* увеличение пропускной способности сервера (Throughput) в **2–4 раза** на том же оборудовании.

---

### Continuous Batching (Итерационный / клеточный батчинг)

В отличие от статического батчинга, **Continuous Batching** работает на уровне итерации генерации одного токена:
- Как только любой запрос в батче генерирует токен \`<EOS>\`, он мгновенно завершается и возвращается клиенту.
- В освободившийся физический слот на следующей же итерации подсаживается новый входящий запрос из очереди без ожидания.

---

### Спекулятивное декодирование (Speculative Decoding, Leviathan et al., 2023)

Генерация одного токена на большой модели (например, LLaMA-3 70B) ограничена скоростью вычитки весов из VRAM (Memory Bandwidth). Время уходит на чтение гигабайтов весов, а сами ядра GPU загружены на $5\\%$.

#### Принцип работы:
1. **Драфт-модель (Draft Model):** маленькая и быстрая модель того же семейства (например, LLaMA-3 1B) авторегрессионно генерирует $K$ токенов-кандидатов (например, $K=5$).
2. **Параллельная верификация (Verification):** большая целевая модель (Target Model 70B) принимает все $K$ кандидатов за **один-единственный параллельный проход (Forward pass)**!
3. **Rejection Sampling:** целевая модель сравнивает свои распределения вероятностей с драфтом и принимает первые $M \\le K$ корректных токенов.

*Магический результат:*
- Ускорение генерации в **2–3 раза**!
- Математическое распределение выходов целевой модели сохраняется **совершенно строго и без малейшей потери качества** (Proof of Exact Distribution Match).`,
    commonMistakes: [
      'Аллокация статического буфера под максимальный контекст (8k/32k) для каждого потока в FastAPI: приводит к Out-Of-Memory (OOM) уже на 3 параллельных пользователях.',
      'Использование в качестве драфт-модели для спекулятивного декодирования модели с совершенно другим словарем токенизатора: токенизаторы драфта и целевой модели обязаны быть строго идентичными.',
      'Попытка использовать спекулятивное декодирование при максимальной нагрузке и огромных батчах: при батче > 64 сервер уже Compute-bound, и оверхед драфт-модели начинает замедлять общую пропускную способность.',
    ],
    checkpointQuiz: [
      {
        id: 'opt-cp-4-1',
        question: 'За счет чего алгоритм PagedAttention в движке vLLM предотвращает исчерпание видеопамяти при обслуживании многих пользователей?',
        options: [
          'Удаляет все гласные буквы из текста',
          'Разбивает непрерывный KV-кэш на небольшие блоки страниц фиксированного размера в неконтигуальной памяти, практически полностью устраняя фрагментацию VRAM',
          'Запрещает пользователям задавать вопросы длиннее 10 слов',
          'Переносит вычисления на жесткий диск',
        ],
        correctAnswer: 1,
        explanation: 'По аналогии с виртуальной памятью ОС, PagedAttention выделяет слоты памяти под 16 токенов динамически по мере необходимости, избавляя от бронирования 8k токенов впрок.',
      },
      {
        id: 'opt-cp-4-2',
        question: 'Теряется ли качество или точность генерации целевой большой модели при использовании Спекулятивного декодирования (Speculative Decoding)?',
        options: [
          'Да, точность падает примерно на 15%',
          'Нет, математический алгоритм Rejection Sampling строго гарантирует, что итоговое распределение токенов в точности совпадает с автономным запуском целевой модели',
          'Да, модель начинает генерировать грамматические ошибки',
          'Качество сохраняется только для математических задач',
        ],
        correctAnswer: 1,
        explanation: 'Спекулятивное декодирование использует статистический фильтр Rejection Sampling, гарантируя строгое соответствие теоретическому распределению вероятностей большой модели.',
      },
      {
        id: 'opt-cp-4-3',
        question: 'В чем ключевое отличие Continuous Batching от классического статического батчинга в серверах инференса LLM?',
        options: [
          'Continuous Batching работает на уровне генерации отдельных токенов, позволяя завершать выполнившиеся запросы и сразу встраивать новые без ожидания самого длинного текста',
          'Continuous Batching требует перезагрузки сервера после каждого пользователя',
          'Continuous Batching использует только один поток процессора',
          'Continuous Batching отключает кэширование токенов',
        ],
        correctAnswer: 0,
        explanation: 'При Continuous Batching батч динамически обновляется на каждом шаге генерации токена, исключая простои GPU из-за неравномерной длины ответов.',
      },
    ],
  },
];

export const modelOptimizationCards: Card[] = [
  {
    id: 'opt-card-1',
    moduleId: 'model-optimization-inference',
    lessonId: 'opt-1-quantization-ptq-qat',
    type: 'flip',
    front: {
      ru: 'В чем разница между Post-Training Quantization (PTQ) и Quantization-Aware Training (QAT)?',
      en: 'What is the distinction between Post-Training Quantization (PTQ) and Quantization-Aware Training (QAT)?',
    },
    back: {
      ru: 'PTQ квантует уже обученную модель с минимальной калибровкой без градиентного спуска. QAT эмулирует шум квантования во время дообучения через Straight-Through Estimator (STE), адаптируя веса к целочисленной сетке без потери качества.',
      en: 'PTQ quantizes pretrained weights using simple calibration without backprop. QAT simulates quantization noise during training using Straight-Through Estimators (STE), allowing the network to adapt to integer rounding.',
    },
    tags: ['quantization', 'ptq', 'qat'],
  },
  {
    id: 'opt-card-2',
    moduleId: 'model-optimization-inference',
    lessonId: 'opt-2-knowledge-distillation-pruning',
    type: 'cloze',
    clozeText: {
      ru: 'Для проявления «темных знаний» учителя в Softmax дистилляции логиты масштабируются параметром {{c1::температуры (T > 1)}}.',
      en: 'To reveal the teacher\'s dark knowledge in distillation softmax, logits are scaled by the {{c1::temperature parameter (T > 1)}}.',
    },
    answer: {
      ru: 'температуры (T > 1)',
      en: 'temperature parameter (T > 1)',
    },
    tags: ['distillation', 'dark-knowledge', 'softmax'],
  },
  {
    id: 'opt-card-3',
    moduleId: 'model-optimization-inference',
    lessonId: 'opt-3-onnx-tensorrt-compilation',
    type: 'flip',
    front: {
      ru: 'Какую выгоду дает Kernel Fusion в NVIDIA TensorRT?',
      en: 'What performance benefit does Kernel Fusion offer in NVIDIA TensorRT?',
    },
    back: {
      ru: 'Слияние цепочки слоев (Conv + Bias + ReLU) в одно CUDA-ядро устраняет холостые записи и чтения промежуточных тензоров в глобальную память VRAM DRAM, удерживая данные в быстрых регистрах и L1-кэше кристалла.',
      en: 'Fusing layer sequences (Conv + Bias + ReLU) into a single monolithic CUDA kernel eliminates intermediate roundtrips to global VRAM DRAM, maintaining data in fast chip registers and L1 cache.',
    },
    tags: ['tensorrt', 'kernel-fusion', 'cuda'],
  },
  {
    id: 'opt-card-4',
    moduleId: 'model-optimization-inference',
    lessonId: 'opt-4-llm-engines-vllm-speculative',
    type: 'flip',
    front: {
      ru: 'Как Спекулятивное декодирование (Speculative Decoding) ускоряет генерацию LLM без потери качества?',
      en: 'How does Speculative Decoding accelerate LLM generation without compromising output quality?',
    },
    back: {
      ru: 'Маленькая драфт-модель быстро генерирует K токенов-кандидатов, а большая целевая модель верифицирует их за один параллельный прогон через Rejection Sampling, гарантируя строгое сохранение оригинального распределения вероятностей.',
      en: 'A fast draft model speculatively generates K candidate tokens, verified by the large target model in a single parallel forward pass via Rejection Sampling, preserving the exact probability distribution.',
    },
    tags: ['vllm', 'speculative-decoding', 'serving'],
  },
];

export const modelOptimizationQuiz: QuizQuestion[] = [
  {
    id: 'opt-q-1',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Почему квантование моделей типа LLaMA 70B до 4-бит (AWQ / GPTQ) кардинально ускоряет инференс при малых размерах батча?',
      en: 'Why does 4-bit quantization (AWQ / GPTQ) of large models like LLaMA 70B drastically accelerate inference for small batch sizes?',
    },
    options: [
      {
        ru: 'Потому что инференс при малом батче упирается в пропускную способность памяти (Memory Bandwidth), и 4-кратное сжатие весов сокращает объем вычитываемых из VRAM байтов на каждый токен',
        en: 'Because small-batch inference is strictly memory bandwidth bound, and 4x weight compression reduces bytes fetched from VRAM per generated token',
      },
      {
        ru: 'Потому что 4-битные числа быстрее летают по оптоволоконной сети',
        en: 'Because 4-bit numbers travel faster over fiber optic connections',
      },
      {
        ru: 'Квантование автоматически отключает слои внимания трансформера',
        en: 'Quantization automatically removes Transformer attention layers',
      },
      {
        ru: 'Оно заменяет вычисления на GPU запуском на процессоре Intel Celeron',
        en: 'It replaces GPU execution with an Intel Celeron CPU',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'При батче 1 генерация каждого токена требует прокачать все веса модели через шину видеопамяти. Сжатие в 4 раза пропорционально ускоряет доставку весов в вычислительные ядра.',
      en: 'In autoregressive decoding at batch size 1, arithmetic intensity is low; throughput is limited by VRAM bandwidth. 4x compression delivers proportional speedups.',
    },
    tag: 'memory-bandwidth-bound',
  },
  {
    id: 'opt-q-2',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Какую главную архитектурную проблему решает PagedAttention в движке vLLM?',
      en: 'What primary architectural bottleneck does PagedAttention resolve in vLLM?',
    },
    options: [
      {
        ru: 'Удаляет необходимость токенизации текста',
        en: 'Eliminates the requirement for text tokenization',
      },
      {
        ru: 'Устраняет внутреннюю и внешнюю фрагментацию видеопамяти при хранении KV-кэша, динамически выделяя блоки фиксированного размера аналогично виртуальной памяти ОС',
        en: 'Eliminates VRAM internal and external fragmentation for KV-cache by allocating fixed-size memory pages dynamically like an OS virtual memory table',
      },
      {
        ru: 'Позволяет обучать нейросети без использования обратного распространения ошибки',
        en: 'Enables training neural networks without backpropagation',
      },
      {
        ru: 'Переводит модель на другой язык программирования',
        en: 'Transpiles the model into an alternative programming language',
      },
    ],
    correctAnswer: 1,
    explanation: {
      ru: 'Классические серверы резервируют непрерывную память под максимальный контекст для каждого запроса, растрачивая 60-80% VRAM. PagedAttention выделяет страницы по 16 токенов по мере надобности.',
      en: 'Standard engines pre-allocate contiguous chunks for maximum context lengths, wasting 60-80% of VRAM. PagedAttention allocates 16-token pages on demand.',
    },
    tag: 'paged-attention-kv-cache',
  },
  {
    id: 'opt-q-3',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Что происходит с распределением вероятностей Softmax при увеличении температуры T >> 1 в дистилляции знаний?',
      en: 'What happens to the Softmax probability distribution when temperature T >> 1 is increased in knowledge distillation?',
    },
    options: [
      {
        ru: 'Все вероятности становятся равными единице',
        en: 'All probabilities become exactly equal to one',
      },
      {
        ru: 'Распределение сглаживается, выравнивая контраст между мажорным классом и фоновыми классами, обнажая скрытые знания (Dark Knowledge) о схожести объектов',
        en: 'The distribution flattens, softening the gap between the dominant class and background classes to reveal hidden Dark Knowledge about category similarities',
      },
      {
        ru: 'Распределение превращается в жесткий one-hot вектор',
        en: 'The distribution collapses into a strict one-hot vector',
      },
      {
        ru: 'Логиты модели обнуляются',
        en: 'Model logits are reset to zero',
      },
    ],
    correctAnswer: 1,
    explanation: {
      ru: 'Высокая температура сглаживает распределение экспонент, позволяя модели-ученику перенимать не только доминирующий класс, но и тонкие связи между всеми остальными классами.',
      en: 'Elevated temperatures soften peaked exponentials, exposing secondary probability mass that encodes rich semantic relationships between non-target classes.',
    },
    tag: 'distillation-temperature',
  },
  {
    id: 'opt-q-4',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Почему при компиляции модели в NVIDIA TensorRT файл .engine нельзя напрямую перенести на GPU другой архитектуры (например, с Turing RTX 2080 на Hopper H100)?',
      en: 'Why can a compiled NVIDIA TensorRT .engine plan not be directly ported to a GPU of a different architecture (e.g. from Turing to Hopper)?',
    },
    options: [
      {
        ru: 'Потому что файл .engine содержит низкоуровневый скомпилированный машинный код, оптимизированный под конкретное число потоковых мультипроцессоров, размер регистрового файла и тензорные ядра целевого чипа',
        en: 'Because the .engine file contains low-level binary machine code custom-tuned to the exact number of SMs, register file sizes, and specific Tensor Core generation of the target chip',
      },
      {
        ru: 'Из-за ограничений лицензии MIT',
        en: 'Due to legal constraints in the MIT license',
      },
      {
        ru: 'Потому что формат ONNX запрещает запуск на видеокартах H100',
        en: 'Because ONNX specifications prohibit execution on H100 GPUs',
      },
      {
        ru: 'Файл .engine удаляется сразу после первого запуска',
        en: 'The .engine file self-deletes immediately upon first launch',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'TensorRT компилирует ядро непосредственно под аппаратные особенности микроархитектуры GPU. Для нового типа чипа план компилируется заново из промежуточного ONNX файла.',
      en: 'TensorRT generates microarchitecture-specific machine kernels. Cross-generation migration requires recompiling the engine from the source ONNX representation.',
    },
    tag: 'tensorrt-architecture-lock',
  },
];
