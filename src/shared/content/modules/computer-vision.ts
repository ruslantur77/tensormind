import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const computerVisionMeta: ModuleMeta = {
  id: 'computer-vision',
  title: {
    ru: 'Компьютерное зрение: от сверток и ResNet до YOLO, DETR и ViT',
    en: 'Computer Vision: from Convolutions & ResNet to YOLO, DETR & ViT',
  },
  description: {
    ru: 'Полный фундаментальный курс CV для собеседований: виды сверток (Dilated, Depthwise, Pointwise, Transposed), im2col и Receptive Field, архитектуры ResNet, MobileNet, EfficientNet и Vision Transformer (ViT). Детекция объектов: метрики mAP@0.5:0.95, NMS, Anchor boxes, FPN, RoI Align, One-stage (YOLO) vs Two-stage (Faster R-CNN) и венгерский алгоритм в DETR.',
    en: 'Comprehensive interview-grade CV: convolution types (Dilated, Depthwise, Pointwise, Transposed), im2col & Receptive Field, ResNet, MobileNet, EfficientNet & Vision Transformer (ViT). Object detection: mAP@0.5:0.95, NMS, Anchors, FPN, RoI Align, YOLO vs Faster R-CNN, and Hungarian Matching in DETR.',
  },
  order: 22,
  icon: 'computer-vision',
  estimatedMinutes: 110,
  isPlaceholder: false,
};

export const computerVisionLessons: Lesson[] = [
  {
    id: 'cv-1-convolutions-receptive-field',
    moduleId: 'computer-vision',
    title: {
      ru: 'Операции свертки: виды (Dilated, Depthwise, Transposed), im2col и Receptive Field',
      en: 'Convolution Operations: Types (Dilated, Depthwise, Transposed), im2col & Receptive Field',
    },
    order: 1,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Анатомия классической 2D-свертки

В отличие от полносвязного слоя (Dense), где каждый вход соединен со всеми выходами ($O(H \\cdot W \\cdot C_{\\text{in}} \\cdot C_{\\text{out}})$ параметров), сверточный слой обладает двумя ключевыми свойствами:
1. **Локальная связность (Local Connectivity):** нейрон смотрит только на локальное окно ядра $K_h \\times K_w$.
2. **Разделение весов (Weight Sharing / Translation Equivariance):** одно и то же ядро скользит по всему изображению, сдвигая признак вместе с объектом ($f(g(x)) = g(f(x))$).

Формула размера выходного тензора при входе $W \\times H$, ядре $K$, шаге $S$ (Stride) и дополнении $P$ (Padding):
$$W_{\\text{out}} = \\left\\lfloor \\frac{W - K + 2P}{S} \\right\\rfloor + 1$$

---

### Специальные виды сверток

#### 1. Расширенная свертка (Dilated / Atrous Convolution)
Между элементами ядра вставляются «дыры» с шагом дилатации $d$ ($d=1$ — обычная свертка):
- Эффективный размер ядра: $K_{\\text{eff}} = K + (K - 1)(d - 1)$.
- **Зачем нужна:** экспоненциально увеличивает поле восприятия (**Receptive Field**) без добавления обучаемых параметров и без потери пространственного разрешения (не требует MaxPooling). Критична в сегментации (DeepLab) и обработке звука (WaveNet).

#### 2. Depthwise Separable Convolution (MobileNet)
Разбивает стандартную тяжелую свертку на два дешевых этапа:
1. **Depthwise Convolution:** каждый входной канал фильтруется своим независимым пространственным ядром $K \\times K \\times 1$ (каналы не смешиваются).
2. **Pointwise Convolution ($1 \\times 1$):** линейная комбинация каналов для получения нужного числа выходных каналов $C_{\\text{out}}$.

**Вычислительный выигрыш:**
$$\\frac{\\text{FLOPs}_{\\text{DepthwiseSeparable}}}{\\text{FLOPs}_{\\text{Standard}}} = \\frac{D_K^2 \\cdot D_F^2 \\cdot M + M \\cdot N \\cdot D_F^2}{D_K^2 \\cdot M \\cdot N \\cdot D_F^2} = \\frac{1}{N} + \\frac{1}{D_K^2}$$
Для стандартного ядра $3 \\times 3$ вычисления сокращаются **в 8–9 раз** при минимальной потере точности!

#### 3. Транспонированная свертка (Transposed Convolution / Deconvolution)
Операция повышения разрешения (Upsampling) с обучаемыми весами (в автоэнкодерах, GAN, U-Net).
Математически является транспонированием матрицы стандартной свертки на прямом проходе.
*Артефакт:* часто создает шахматный артефакт (**Checkerboard Artifact**). В продакшене чаще заменяется на \`Bilinear / Nearest Upsample + обычная Conv 3x3\`.

---

### Представление свертки как матричного умножения: алгоритм \`im2col\` + GEMM

В GPU нет аппаратной инструкции «скользить окном по картинке». Все свертки сводятся к сверхбыстрому перемножению матриц (**GEMM — General Matrix Multiply**) через алгоритм **im2col**:
1. Входной тензор $C_{\\text{in}} \\times H \\times W$ разворачивается: каждое локальное окно $K \\times K \\times C_{\\text{in}}$ вытягивается в столбец матрицы $X_{\\text{col}}$ размерности $(C_{\\text{in}} K^2) \\times (H_{\\text{out}} W_{\\text{out}})$.
2. Веса ядра вытягиваются в матрицу $W_{\\text{row}}$ размерности $C_{\\text{out}} \\times (C_{\\text{in}} K^2)$.
3. Вычисляется одно матричное умножение: $Y = W_{\\text{row}} \\cdot X_{\\text{col}}$.
4. Результат решейпится операцией \`col2im\` в выходной тензор $C_{\\text{out}} \\times H_{\\text{out}} \\times W_{\\text{out}}$.

---

### Поле восприятия (Receptive Field)

**Receptive Field (RF)** — область исходного входного изображения, пиксели которой влияют на активацию конкретного выходного нейрона.

#### Формула индуктивного расчета Receptive Field для слоя $l$:
$$RF_l = RF_{l-1} + (k_l - 1) \\cdot J_{l-1}$$
где $J_{l-1} = \\prod_{i=1}^{l-1} S_i$ — суммарный шаг (Cumulative Stride) предыдущих слоев, а $k_l$ — размер ядра текущего слоя ($RF_0 = 1, J_0 = 1$).

*Важный вывод для собеседования:* два последовательных слоя сверток $3 \\times 3$ имеют то же поле восприятия $5 \\times 5$, но содержат $2 \\cdot (3^2) = 18$ параметров вместо $5^2 = 25$ параметров (экономия 28% весов) и вносят две нелинейности ReLU вместо одной!`,
    commonMistakes: [
      'Путаница между Pooling и Strided Convolution: свертка со страйдом S=2 содержит обучаемые веса и сама учится адаптивно сжимать признаки, тогда как MaxPool детерминирован.',
      'Утверждение, что Transposed Convolution является математически обратной операцией к свертке (инверсией матрицы): она лишь восстанавливает исходную размерность формы тензора, но не исходные значения.',
      'Игнорирование роста шага (cumulative stride) при расчете Receptive Field: добавление свертки после пулинга со страйдом 2 увеличивает RF в два раза быстрее.',
    ],
    checkpointQuiz: [
      {
        id: 'cv-cp-1-1',
        question: {
          ru: 'Во сколько примерно раз Depthwise Separable Convolution с ядром 3x3 сокращает вычислительную сложность по сравнению со стандартной сверткой при большом числе выходных каналов?',
          en: 'By roughly what factor does a Depthwise Separable Convolution with 3x3 kernel reduce FLOPs compared to a standard convolution?',
        },
        options: [
          { ru: 'Примерно в 8–9 раз (пропорционально k^2 = 3^2)', en: 'Roughly 8-9 times (proportional to k^2 = 3^2)' },
          { ru: 'В 2 раза', en: 'By 2 times' },
          { ru: 'Сложность не меняется', en: 'FLOPs remain identical' },
          { ru: 'В 100 раз', en: 'By 100 times' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Формула сокращения FLOPs равна 1/N + 1/K^2. При K=3 и большом N слагаемое 1/N стремится к нулю, а выигрыш составляет 1/9 (ускорение почти в 9 раз).',
          en: 'The ratio is 1/N + 1/K^2. For K=3 and large N, 1/K^2 dominates, giving approximately a 9x computational reduction.',
        },
      },
      {
        id: 'cv-cp-1-2',
        question: {
          ru: 'Какое поле восприятия (Receptive Field) имеет стек из трех последовательных сверток 3x3 со страйдом 1 и без пулинга?',
          en: 'What is the Receptive Field of a stack of three consecutive 3x3 convolutions with stride 1 and no pooling?',
        },
        options: [
          { ru: '7x7', en: '7x7' },
          { ru: '9x9', en: '9x9' },
          { ru: '3x3', en: '3x3' },
          { ru: '5x5', en: '5x5' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Слой 1: 3x3. Слой 2: 3 + (3-1) = 5x5. Слой 3: 5 + (3-1) = 7x7. Стек из трех слоев 3x3 покрывает область 7x7 при значительно меньшем числе весов.',
          en: 'Layer 1: 3. Layer 2: 3 + 2 = 5. Layer 3: 5 + 2 = 7. A 3-layer 3x3 stack achieves a 7x7 receptive field.',
        },
      },
      {
        id: 'cv-cp-1-3',
        question: {
          ru: 'В чем заключается суть алгоритма im2col при вычислении сверток на GPU?',
          en: 'What is the core concept of the im2col algorithm when executing convolutions on GPU?',
        },
        options: [
          { ru: 'Развертывание скользящих пространственных окон входного тензора в плоскую матрицу для сведения свертки к одному быстрому матричному умножению GEMM', en: 'Unrolling sliding receptive windows into a 2D matrix to cast convolution as a single fast GEMM multiplication' },
          { ru: 'Сжатие картинок в формат JPEG перед подачей в сеть', en: 'Compressing images to JPEG format prior to feeding the network' },
          { ru: 'Удаление всех отрицательных значений градиентов', en: 'Purging negative gradient entries' },
          { ru: 'Квантование весов в 8 бит', en: 'Quantizing weights to 8 bits' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'im2col дублирует пиксели окон в столбцы матрицы X_col, после чего вызов оптимизированного ядра cuBLAS GEMM вычисляет свертку за одну параллельную операцию.',
          en: 'im2col copies receptive fields into columns of a 2D matrix, allowing hardware-accelerated cuBLAS GEMM to execute the convolution in one shot.',
        },
      },
    ],
  },
  {
    id: 'cv-2-architectures-resnet-mobilenet-vit',
    moduleId: 'computer-vision',
    title: {
      ru: 'Архитектуры CV: ResNet (Residuals & Bottleneck), MobileNet, EfficientNet и Vision Transformer (ViT)',
      en: 'CV Architectures: ResNet (Residuals & Bottleneck), MobileNet, EfficientNet & ViT',
    },
    order: 2,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Революция ResNet: остаточные связи (He et al., 2015)

До появления ResNet попытка обучить сеть глубже 20 слоев приводила к **проблеме деградации (Degradation Problem)**: даже на *обучающей выборке* ошибка 56-слойной сети была выше, чем 20-слойной (это не переобучение, а невозможность оптимизировать глубокий стек).

#### Остаточный блок (Residual Block):
Вместо аппроксимации целевого отображения $\\mathcal{H}(x)$ блок учится аппроксимировать остаток $\\mathcal{F}(x) = \\mathcal{H}(x) - x$:
$$y = \\mathcal{F}(x, \\{W_i\\}) + x$$

#### Почему именно сложение (+), а не конкатенация?
1. **Градиентный хайвей (Gradient Highway):**
   При обратном проходе производная по входу равна:
   $$\\frac{\\partial \\mathcal{E}}{\\partial x} = \\frac{\\partial \\mathcal{E}}{\\partial y} \\cdot \\left( \\frac{\\partial \\mathcal{F}}{\\partial x} + I \\right)$$
   Благодаря слагаемому $+I$ (единичная матрица) градиент $\\frac{\\partial \\mathcal{E}}{\\partial y}$ перетекает напрямую на ранние слои без затухания, даже если веса $\\mathcal{F}$ близки к нулю!
2. **Память:** Конкатенация (как в DenseNet) раздувала бы число каналов с каждым слоем как $O(L \\cdot C)$, взрывая VRAM.

#### BasicBlock vs BottleneckBlock:
- **BasicBlock (ResNet-18, 34):** два слоя \`Conv 3x3 -> Conv 3x3\`.
- **BottleneckBlock (ResNet-50, 101, 152):** для глубоких сетей вычисления оптимизируются триадой:
  1. \`Conv 1x1\`: сжатие каналов в 4 раза (например, $256 \\to 64$).
  2. \`Conv 3x3\`: пространственная фильтрация в дешевом сжатом пространстве ($64 \\to 64$).
  3. \`Conv 1x1\`: восстановление и расширение каналов ($64 \\to 256$).

---

### Семейство MobileNet и EfficientNet

#### MobileNetV1–V3:
- **V1:** Depthwise Separable Convolutions.
- **V2 (Inverted Residuals & Linear Bottlenecks):** наоборот расширяет каналы внутри блока ($1 \\times 1$ expand $\\to$ depthwise $3 \\times 3$ $\\to 1 \\times 1$ projection) и убирает нелинейность ReLU на выходе (линейный слой), так как ReLU разрушает информацию в узких низкоразмерных пространствах.
- **V3:** добавление легковесного механизма внимания Squeeze-and-Excitation (SE-blocks) и функции активации Hard-Swish.

#### EfficientNet: составное масштабирование (Compound Scaling)
Традиционно сети масштабировали случайно: делали глубже ($d$), шире ($w$) или повышали разрешение ($r$).
Mingxing Tan & Quoc Le (2019) вывели принцип сбалансированного масштабирования под коэффициент ресурсов $\\phi$:
$$\\text{Depth: } d = \\alpha^\\phi, \\quad \\text{Width: } w = \\beta^\\phi, \\quad \\text{Resolution: } r = \\gamma^\\phi \\quad \\text{при } \\alpha \\cdot \\beta^2 \\cdot \\gamma^2 \\approx 2$$

---

### Vision Transformer (ViT, Dosovitskiy et al., 2020)

ViT полностью отказался от сверток в пользу стандартного Transformer Encoder!

#### Пайплайн ViT:
1. **Чанкинг на патчи:** изображение $H \\times W \\times C$ нарезается на сетку неперекрывающихся патчей размера $P \\times P$ (например, $16 \\times 16$). Число патчей $N = \\frac{HW}{P^2}$.
2. **Linear Projection:** каждый патч вытягивается в вектор длины $P^2 C$ ($16 \\times 16 \\times 3 = 768$) и умножается на обучаемую матрицу проекции, превращаясь в эмбеддинг размерности $D$.
3. **[CLS] Token:** в начало последовательности дописывается фиктивный обучаемый токен классификации (аналогично BERT).
4. **2D Positional Embeddings:** к токенам прибавляются обучаемые 1D/2D позиционные эмбеддинги для сохранения пространственных координат сетки.
5. **Transformer Encoder:** стандартные блоки Pre-LN Multi-Head Self-Attention.
6. Выходной [CLS]-токен подается в MLP-head для классификации.

*Сравнение CNN vs ViT:*
- CNN имеет жесткое **индуктивное смещение (Inductive Bias)**: локальность и инвариантность к сдвигу вшиты в архитектуру. CNN отлично учатся на малых датасетах.
- ViT **не имеет индуктивного смещения**: связи между любыми пикселями равноправны с 1-го слоя. На малых данных ViT переобучается, но при предобучении на гигантских выборках (JFT-300M, ImageNet-21k) ViT превосходит любые CNN!`,
    commonMistakes: [
      'Путаница: считать, что ResNet устраняет затухание градиентов благодаря ReLU. Нет, затухание устраняет именно аддитивное сквозное соединение identity mapping x + F(x).',
      'Попытка обучить базовый Vision Transformer (ViT-B/16) с нуля на маленьком датасете (10 000 картинок): модель покажет результат хуже простой сверточной сети из-за отсутствия индуктивного смещения локальности.',
      'Использование нелинейности ReLU после сжатия в узком бутылочном горлышке MobileNetV2: это зануляет ценные многомерные многообразия признаков.',
    ],
    checkpointQuiz: [
      {
        id: 'cv-cp-2-1',
        question: {
          ru: 'Почему в Residual блоках ResNet для соединения входа и выхода используется операция сложения x + F(x), а не конкатенация [x, F(x)]?',
          en: 'Why do ResNet residual blocks use addition x + F(x) rather than concatenation [x, F(x)]?',
        },
        options: [
          { ru: 'Сложение создает сквозной градиентный хайвей с единичной производной и не увеличивает число каналов (не раздувает память VRAM)', en: 'Addition creates an identity gradient highway with unit derivative without growing channel count and VRAM' },
          { ru: 'Конкатенация не поддерживается видеокартами NVIDIA', en: 'Concatenation is unsupported on NVIDIA GPUs' },
          { ru: 'Сложение гарантирует неотрицательность весов', en: 'Addition guarantees non-negative weights' },
          { ru: 'Операция конкатенации работает только с одномерным текстом', en: 'Concatenation is restricted to 1D text' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Производная d(x + F(x))/dx = I + dF/dx. Слагаемое I гарантирует беспрепятственное прохождение градиента до самых первых слоев, сохраняя постоянную размерность тензора.',
          en: 'The derivative d(x+F(x))/dx contains the identity matrix I, allowing backprop gradients to flow undiminished to early layers without channel explosion.',
        },
      },
      {
        id: 'cv-cp-2-2',
        question: {
          ru: 'Как Vision Transformer (ViT) преобразует двумерное изображение в последовательность токенов для Transformer Encoder?',
          en: 'How does Vision Transformer (ViT) convert a 2D image into token sequences for Transformer Encoder?',
        },
        options: [
          { ru: 'Разбивает изображение на неперекрывающиеся патчи (например, 16x16), расплющивает их и проецирует линейным слоем в плотные эмбеддинги', en: 'Splits images into non-overlapping patches (e.g. 16x16), flattens them, and linearly projects into dense embeddings' },
          { ru: 'Пропускает картинку через ResNet-152 и берет логиты', en: 'Passes images through ResNet-152 logits' },
          { ru: 'Переводит пиксели в ASCII-код символов', en: 'Converts pixels to ASCII strings' },
          { ru: 'Считает гистограмму цветов RGB', en: 'Computes RGB color histograms' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Картинка режется на N патчей PxP, каждый патч умножается на матрицу линейной проекции, после чего к ним добавляются обучаемые позиционные эмбеддинги и [CLS] токен.',
          en: 'The image is sliced into N patches of size PxP, flattened and multiplied by a linear projection matrix alongside positional embeddings and a [CLS] token.',
        },
      },
      {
        id: 'cv-cp-2-3',
        question: {
          ru: 'В чем заключается суть Compound Scaling в семействе моделей EfficientNet?',
          en: 'What is the core premise of Compound Scaling in EfficientNet models?',
        },
        options: [
          { ru: 'Совместное и сбалансированное масштабирование глубины, ширины сети и разрешения входного изображения по единому экспоненциальному коэффициенту', en: 'Joint, balanced scaling of network depth, width, and image resolution driven by a unified compound coefficient' },
          { ru: 'Увеличение только размера батча до 10 000', en: 'Scaling batch size to 10,000 only' },
          { ru: 'Замена сверток на полносвязные слои', en: 'Replacing convolutions with fully connected layers' },
          { ru: 'Использование двух видеокарт одновременно', en: 'Running on two GPUs concurrently' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Авторы доказали, что масштабирование только одного параметра быстро упирается в насыщение; максимальный прирост точности дает одновременное согласованное увеличение глубины, ширины и разрешения.',
          en: 'Tan & Le demonstrated that scaling only depth or width saturates quickly; coordinated scaling of depth, width, and resolution optimizes accuracy per FLOP.',
        },
      },
    ],
  },
  {
    id: 'cv-3-detection-metrics-nms-fpn',
    moduleId: 'computer-vision',
    title: {
      ru: 'Задачи детекции: метрики (mAP@0.5:0.95), NMS, Anchor boxes, FPN и RoI Align',
      en: 'Detection Tasks: Metrics (mAP@0.5:0.95), NMS, Anchors, FPN & RoI Align',
    },
    order: 3,
    estimatedMinutes: 30,
    draft: false,
    theoryMarkdown: `### Формулировка задачи Object Detection

В отличие от классификации (где ищется ответ *что* на картинке), детекция отвечает на вопросы *что* и *где*.
Выход модели для каждого объекта — вектор $\\mathbf{b} = (c, p_c, x_{\\text{center}}, y_{\\text{center}}, w, h)$.

---

### Метрики качества детекции: IoU и mAP

#### 1. Intersection over Union (IoU / Коэффициент Жаккара):
$$\\text{IoU} = \\frac{\\text{Area of Overlap}}{\\text{Area of Union}} = \\frac{|B_{\\text{pred}} \\cap B_{\\text{gt}}|}{|B_{\\text{pred}} \\cup B_{\\text{gt}}|}$$
Предсказание считается **True Positive (TP)**, если $\\text{IoU} \\ge \\text{threshold}$ (обычно $0.5$) и класс угадан верно.

#### 2. Average Precision (AP) и mAP:
- Предсказания сортируются по убыванию уверенности $p_c$.
- Строится кривая точности-полноты (**Precision-Recall Curve**).
- **AP (Average Precision):** площадь под интерполированной PR-кривой для одного класса:
  $$\\text{AP} = \\int_0^1 p_{\\text{interp}}(r) \\, dr$$
- **mAP (mean Average Precision):** среднее AP по всем классам датасета.

#### Стандарты mAP на собеседованиях:
- **mAP@0.5 (PASCAL VOC):** порог $\\text{IoU} = 0.5$. Мягкая метрика, прощающая неидеальную подгонку границ рамки.
- **mAP@0.5:0.95 (COCO metric):** среднее значение mAP при 10 различных порогах IoU от $0.50$ до $0.95$ с шагом $0.05$. Главный промышленный бенчмарк: требует как точного нахождения объекта, так и идеального совпадения геометрии рамок.

---

### Non-Maximum Suppression (NMS)

Детекторы генерируют тысячи перекрывающихся рамок вокруг одного и того же объекта. **NMS** отбирает одну наилучшую:

#### Алгоритм Greedy NMS:
1. Отфильтровать все рамки с уверенностью $p_c < \\text{conf\\_thresh}$.
2. Выбрать рамку $B_{\\text{max}}$ с максимальной уверенностью, добавить ее в финальный список.
3. Вычислить $\\text{IoU}(B_{\\text{max}}, B_i)$ со всеми оставшимися рамками того же класса.
4. Если $\\text{IoU} > \\text{nms\\_thresh}$ (обычно $0.45-0.6$), **удалить** рамку $B_i$ как дубликат.
5. Повторять шаги 2–4, пока остались нерассмотренные рамки.

*Soft-NMS:* вместо жесткого удаления рамки ее уверенность плавно занижается пропорционально перекрытию $p_i \\leftarrow p_i \\cdot e^{-\\frac{\\text{IoU}^2}{\\sigma}}$ (помогает при плотном скоплении людей).

---

### Feature Pyramid Networks (FPN)

Ранние слои сети имеют высокое пространственное разрешение, но слабую семантику (видят линии и углы). Глубокие слои имеют сильную семантику, но низкое разрешение из-за пулингов (мелкие объекты полностью растворяются).

**FPN строит пирамиду признаков с боковыми связями (Lateral Connections):**
1. **Bottom-up pathway:** стандартный прямой проход CNN ($C_2, C_3, C_4, C_5$).
2. **Top-down pathway:** глубокие семантические карты увеличиваются в 2 раза (Upsample) и складываются с боковыми картами через $1 \\times 1$ conv.
3. *Результат:* детекция ведется на нескольких масштабах: мелкие объекты ищутся на слое $P_3$, средние на $P_4$, крупные на $P_5$.

---

### RoI Pooling vs RoI Align

Когда Two-stage детектор находит область-кандидат произвольного размера, ее нужно привести к фиксированному размеру (например, $7 \\times 7$) для полносвязного классификатора:

- **RoI Pooling (Fast R-CNN):** дважды округляет непрерывные вещественные координаты до целых пикселей ($x/16$). Возникает **ошибка квантования (Quantization Error)**, смещающая рамку на несколько пикселей (фатально для сегментации и точных рамок).
- **RoI Align (Mask R-CNN, He et al., 2017):** **никакого округления!** Координаты сохраняются как float. Внутри каждого бина выбираются 4 точки с вычислением значений через билинейную интерполяцию. Точность детекции и сегментации масок вырастает кардинально!`,
    commonMistakes: [
      'Путаница между mAP@0.5 и mAP@0.5:0.95: mAP@0.5:0.95 всегда численно существенно ниже (например, 42% на COCO против 65% на VOC), так как требует высокой точности границ на строгих порогах IoU=0.85-0.95.',
      'Применение NMS без разделения по классам (Class-agnostic NMS в неподходящих задачах): рамка более уверенного стула может случайно подавить рамку человека, сидящего на нем.',
      'Использование RoI Pooling вместо RoI Align при работе с масками Mask R-CNN: грубое целочисленное округление ломает гладкие границы сегментации.',
    ],
    checkpointQuiz: [
      {
        id: 'cv-cp-3-1',
        question: {
          ru: 'В чем ключевое преимущество RoI Align перед классическим RoI Pooling?',
          en: 'What is the primary advantage of RoI Align over classical RoI Pooling?',
        },
        options: [
          { ru: 'RoI Align исключает округление вещественных координат сетки, используя билинейную интерполяцию для устранения пространственного смещения', en: 'RoI Align avoids integer coordinate quantization, using bilinear interpolation to eliminate spatial misalignment' },
          { ru: 'RoI Align сжимает модель в 10 раз', en: 'RoI Align compresses the model by 10x' },
          { ru: 'RoI Align работает без видеокарты', en: 'RoI Align executes without GPUs' },
          { ru: 'RoI Align объединяет все классы в один', en: 'RoI Align merges all classes into one' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'RoI Pooling округляет координаты до целых чисел сетки страйда, вызывая ошибку квантования. RoI Align сэмплирует точки непрерывно через билинейную интерполяцию.',
          en: 'RoI Pooling rounds float box coordinates to integer bins, causing spatial quantization drift. RoI Align samples continuous locations via bilinear interpolation.',
        },
      },
      {
        id: 'cv-cp-3-2',
        question: {
          ru: 'Что означает метрика mAP@[0.5:0.95] в бенчмарке COCO?',
          en: 'What does the mAP@[0.5:0.95] metric denote in the COCO benchmark?',
        },
        options: [
          { ru: 'Усреднение значений mAP по 10 порогам IoU от 0.50 до 0.95 с шагом 0.05', en: 'Average of mAP values across 10 IoU thresholds ranging from 0.50 to 0.95 with a 0.05 step' },
          { ru: 'Точность модели ровно в 95% случаев', en: 'Model accuracy strictly in 95% of cases' },
          { ru: 'Детекция только объектов, размер которых от 50 до 95 пикселей', en: 'Detection restricted to objects between 50 and 95 pixels' },
          { ru: 'Вероятность ложного срабатывания менее 5%', en: 'False positive rate below 5%' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'COCO mAP усредняет точность по сетке IoU = 0.50, 0.55, ..., 0.95, стимулируя модели выдавать предельно плотно подогнанные рамки.',
          en: 'COCO mAP averages AP over IoU thresholds from 0.50 to 0.95 with step 0.05, rewarding high-precision spatial bounding box localization.',
        },
      },
      {
        id: 'cv-cp-3-3',
        question: {
          ru: 'Зачем в архитектуре Feature Pyramid Network (FPN) комбинируются прямые и обратные пути (Bottom-up и Top-down)?',
          en: 'Why does Feature Pyramid Network (FPN) combine Bottom-up and Top-down pathways?',
        },
        options: [
          { ru: 'Чтобы объединить богатое пространственное разрешение ранних слоев с сильной высокоуровневой семантикой глубоких слоев для детекции разномасштабных объектов', en: 'To fuse rich spatial resolution from shallow layers with strong semantic context from deep layers for multiscale detection' },
          { ru: 'Чтобы повернуть изображение вверх ногами', en: 'To invert image orientation' },
          { ru: 'Чтобы уменьшить число параметров до нуля', en: 'To reduce parameters to zero' },
          { ru: 'Чтобы обучать сеть без функции потерь', en: 'To train networks without loss functions' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'FPN позволяет мелким объектам детектироваться на картах высокого разрешения с добавленным глубоким семантическим контекстом, переданным сверху вниз.',
          en: 'FPN equips high-resolution shallow layers with rich high-level semantic context, drastically improving small object detection.',
        },
      },
    ],
  },
  {
    id: 'cv-4-detection-models-yolo-faster-detr',
    moduleId: 'computer-vision',
    title: {
      ru: 'Модели детекции: One-stage (YOLO) vs Two-stage (Faster R-CNN) и венгерский алгоритм в DETR',
      en: 'Detection Models: One-stage (YOLO) vs Two-stage (Faster R-CNN) & Hungarian Matching in DETR',
    },
    order: 4,
    estimatedMinutes: 30,
    draft: false,
    theoryMarkdown: `### Дихотомия: Two-stage vs One-stage детекторы

| Критерий | Two-stage (Faster R-CNN) | One-stage (семейство YOLO, SSD, RetinaNet) |
| :--- | :--- | :--- |
| **Принцип** | Сначала генерация предложений регионов (RPN), затем их классификация и уточнение | Прямое предсказание рамок и классов по сетке за один проход |
| **Скорость** | Медленнее ($10-30$ FPS), тяжело на edge-устройствах | Ультра-быстро ($60-200+$ FPS в real-time) |
| **Точность** | Традиционно выше на мелких объектах и плотных сценах | В современных версиях (YOLOv8–v11) догнала и перегнала two-stage |
| **Проблема** | Естественно сбалансирован: RPN отсекает фон | Дисбаланс классов: $99.9\\%$ кандидатов — пустой фон (решается Focal Loss) |

---

### Архитектура Faster R-CNN (Two-stage)

1. **Backbone + FPN:** извлечение карт признаков (ResNet).
2. **Region Proposal Network (RPN):**
   - Скользящее окно генерирует для каждого пикселя $k$ якорных рамок (**Anchor Boxes**) разной площади и соотношения сторон.
   - Предсказывает бинарный score (объект / фон) и дельты координат.
   - Отбираются топ-2000 предложений (после NMS остается $\\sim 300$).
3. **RoI Align:** вырезает участки признаков $7 \\times 7$ под каждый регион.
4. **Fast R-CNN Head:** классифицирует класс объекта и выполняет финальную регрессию координат.

---

### Эволюция семейства YOLO (You Only Look Once)

1. **YOLOv1 (Redmon, 2016):** сетка $S \\times S$. Каждая ячейка отвечает за объект, центр которого попал в нее.
2. **YOLOv3–v5:** переход на Anchor-based подход с 3 масштабами и темным остовом DarkNet.
3. **Прорыв Focal Loss (RetinaNet, Lin et al.):**
   $$\\text{FL}(p_t) = -\\alpha_t (1 - p_t)^\\gamma \\log(p_t)$$
   Динамически подавляет градиенты от легко определяемых простых примеров фона ($p_t \\to 1$), фокусируя обучение на сложных редких объектах.
4. **YOLOv8–v11 (Anchor-Free):**
   Отказ от ручного подбора якорных рамок! Модель напрямую предсказывает расстояние от центра ячейки до 4 границ ($l, r, t, b$) через Distribution Focal Loss (DFL).
   - Разделенные головы (**Decoupled Head**): ветка классификации и ветка регрессии координат разведены на независимые слои.
   - Задача назначения меток (**Task-Aligned Assigner**): сопоставление ground-truth рамок с предиктами на основе взвешенной метрики $t = s^\\alpha \\times \\text{IoU}^\\beta$.

---

### Трансформеры в детекции: DETR (Carion et al., 2020)

DETR (DEtection TRansformer) отменил все костыли классического зрения: **в нем нет ни якорных рамок (Anchor-free), ни NMS!**

#### Как устроен DETR:
1. Картинка пропускается через CNN Backbone (ResNet) $\\to$ 2D карта признаков вытягивается в токены.
2. Transformer Encoder обогащает токены глобальным контекстом сцены.
3. **Object Queries:** на вход Transformer Decoder подается фиксированный набор обучаемых векторных запросов (например, $N = 100$ запросов). Каждый запрос ищет один объект на картинке через Cross-Attention.
4. Декодер одновременно выдает ровно 100 предсказаний (класс + координаты). Если объектов меньше 100, выдается специальный класс $\\varnothing$ («нет объекта»).

#### Двудольное сопоставление и Венгерский алгоритм (Hungarian Matching)
В отличие от YOLO, где одна ground-truth рамка может активировать несколько ячеек, в DETR действует строгое **взаимно-однозначное соответствие (Bipartite Matching)**:
Находится перестановка $\\hat{\\sigma} \\in \\mathfrak{S}_N$, минимизирующая суммарную стоимость сопоставления между истинными и предсказанными объектами:
$$\\hat{\\sigma} = \\arg\\min_{\\sigma} \\sum_{i=1}^N \\mathcal{L}_{\\text{match}}(y_i, \\; \\hat{y}_{\\sigma(i)})$$
где $\\mathcal{L}_{\\text{match}} = -\\mathbb{I}_{\\{c_i \\neq \\varnothing\\}} \\hat{p}_{\\sigma(i)}(c_i) + \\mathcal{L}_{\\text{box}}(b_i, \\hat{b}_{\\sigma(i)})$.

Оптимальное назначение за $O(N^3)$ находит классический комбинаторный **Венгерский алгоритм (Hungarian Algorithm)**.
*Результат:* модель обучается выдавать ровно одно предсказание на один реальный объект, благодаря чему операция NMS становится полностью ненужной!`,
    commonMistakes: [
      'Утверждение, что DETR требует NMS на этапе пост-процессинга: DETR обучается через двудольное сопоставление (Bipartite Matching), поэтому дубликаты не генерируются в принципе.',
      'Попытка использовать Focal Loss в задачах с идеально сбалансированными классами: Focal Loss специально спроектирован для подавления лавины легких отрицательных примеров фона в One-stage детекторах.',
      'Забывание о разнице координат bbox в форматах Pascal VOC [xmin, ymin, xmax, ymax], COCO [xmin, ymin, width, height] и YOLO [xcenter, ycenter, width, height] (нормализованные от 0 до 1).',
    ],
    checkpointQuiz: [
      {
        id: 'cv-cp-4-1',
        question: {
          ru: 'Почему в модели DETR (DEtection TRansformer) отсутствует необходимость в операции Non-Maximum Suppression (NMS)?',
          en: 'Why does DETR (DEtection TRansformer) not require Non-Maximum Suppression (NMS)?',
        },
        options: [
          { ru: 'Благодаря функции потерь на основе двудольного сопоставления (Hungarian Matching), которая строго сопоставляет каждой истинной рамке ровно одно предсказание', en: 'Due to bipartite matching loss (Hungarian Matching) that enforces a strict 1-to-1 assignment between targets and predictions' },
          { ru: 'Потому что DETR детектирует только один объект на изображении', en: 'Because DETR detects only one object per image' },
          { ru: 'Потому что NMS встроен прямо в тензорные ядра видеокарты', en: 'Because NMS is integrated into GPU tensor cores' },
          { ru: 'DETR работает только с черно-белыми фотографиями', en: 'DETR only processes monochrome imagery' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Венгерский алгоритм на этапе обучения штрафует модель за дублирование рамок, принуждая декодер выдавать ровно один уникальный box на один физический объект.',
          en: 'Hungarian bipartite matching penalizes redundant proposals during training, compelling queries to make unique, non-overlapping predictions.',
        },
      },
      {
        id: 'cv-cp-4-2',
        question: {
          ru: 'Какую главную задачу решает функция потерь Focal Loss в One-stage детекторах (RetinaNet, YOLO)?',
          en: 'What primary problem does Focal Loss solve in One-stage detectors (RetinaNet, YOLO)?',
        },
        options: [
          { ru: 'Подавляет вклад огромного количества легко классифицируемых фоновых примеров (easy negatives), фокусируя градиенты на редких и сложных объектах', en: 'Down-weights the massive deluge of easy negative background samples, focusing gradient updates on hard positive objects' },
          { ru: 'Ускоряет чтение файлов с SSD', en: 'Accelerates SSD read throughput' },
          { ru: 'Увеличивает разрешение изображения в 2 раза', en: 'Upscales image resolution by 2x' },
          { ru: 'Устраняет шум в аудиодорожке', en: 'Removes acoustic noise' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Фактор (1 - p_t)^gamma стремится к нулю для хорошо распознанных фоновых пикселей, предотвращая затопление градиента миллионами пустых ячеек.',
          en: 'The modulating factor (1 - p_t)^gamma diminishes to zero for well-classified background regions, preventing easy negatives from overwhelming the gradient.',
        },
      },
      {
        id: 'cv-cp-4-3',
        question: {
          ru: 'В чем различие между форматами координат рамок COCO и YOLO?',
          en: 'What is the distinction between COCO and YOLO bounding box coordinate conventions?',
        },
        options: [
          { ru: 'COCO использует абсолютные пиксели [xmin, ymin, w, h], а YOLO — относительные нормализованные [0..1] координаты центра и размеров [xcenter, ycenter, w, h]', en: 'COCO uses absolute pixel values [xmin, ymin, w, h], while YOLO uses normalized [0..1] center coordinates and dimensions [xcenter, ycenter, w, h]' },
          { ru: 'YOLO не использует координаты рамок', en: 'YOLO does not use coordinate boxes' },
          { ru: 'COCO хранит координаты в радианах', en: 'COCO records angles in radians' },
          { ru: 'Форматы абсолютно идентичны', en: 'The coordinate formats are identical' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В COCO координаты привязаны к верхнему левому углу в пикселях [xmin, ymin, width, height]. В YOLO координаты делятся на ширину/высоту картинки и отсчитываются от центра [x_center, y_center, width, height].',
          en: 'COCO expresses boxes as absolute top-left offsets [xmin, ymin, w, h]. YOLO normalizes values relative to image dimensions as [x_center, y_center, w, h].',
        },
      },
    ],
  },
];

export const computerVisionCards: Card[] = [
  {
    id: 'cv-card-1',
    moduleId: 'computer-vision',
    lessonId: 'cv-1-convolutions-receptive-field',
    type: 'flip',
    front: {
      ru: 'Почему два последовательных слоя сверток 3x3 предпочтительнее одного слоя 5x5?',
      en: 'Why is a sequence of two 3x3 convolution layers preferred over a single 5x5 layer?',
    },
    back: {
      ru: 'Они обладают тем же полем восприятия (5x5), но требуют на 28% меньше параметров (2×3² = 18 против 5² = 25) и вносят две нелинейные активации ReLU вместо одной.',
      en: 'They share the identical 5x5 receptive field while requiring 28% fewer parameters (2×3² = 18 vs 5² = 25) and introducing two non-linear activations instead of one.',
    },
    tags: ['cv', 'convolution', 'receptive-field'],
  },
  {
    id: 'cv-card-2',
    moduleId: 'computer-vision',
    lessonId: 'cv-2-architectures-resnet-mobilenet-vit',
    type: 'flip',
    front: {
      ru: 'В чем заключается принципиальная разница индуктивного смещения (Inductive Bias) между CNN и Vision Transformer (ViT)?',
      en: 'What is the fundamental difference in inductive bias between CNNs and Vision Transformers (ViT)?',
    },
    back: {
      ru: 'CNN обладают сильным априорным смещением: локальность связей и инвариантность к сдвигу вшиты в оператор свертки. ViT не имеет локального смещения: механизм Self-Attention позволяет связывать любые пиксели с первого слоя, что требует больших объемов данных для обучения.',
      en: 'CNNs have strong hardcoded inductive biases: 2D locality and translation equivariance. ViTs lack spatial bias; global Self-Attention connects arbitrary patch tokens from layer 1, demanding large pretraining corpora.',
    },
    tags: ['cv', 'vit', 'resnet'],
  },
  {
    id: 'cv-card-3',
    moduleId: 'computer-vision',
    lessonId: 'cv-3-detection-metrics-nms-fpn',
    type: 'cloze',
    clozeText: {
      ru: 'Для устранения ошибки квантования координат при пулинге регионов в Mask R-CNN применяется алгоритм {{c1::RoI Align}} на основе билинейной интерполяции.',
      en: 'To eliminate spatial coordinate quantization drift in Mask R-CNN region extraction, the {{c1::RoI Align}} algorithm using bilinear interpolation is applied.',
    },
    answer: {
      ru: 'RoI Align',
      en: 'RoI Align',
    },
    tags: ['cv', 'roi-align', 'detection'],
  },
  {
    id: 'cv-card-4',
    moduleId: 'computer-vision',
    lessonId: 'cv-4-detection-models-yolo-faster-detr',
    type: 'flip',
    front: {
      ru: 'Как алгоритм Венгерского сопоставления (Hungarian Matching) в DETR позволяет обойтись без NMS?',
      en: 'How does Hungarian Matching in DETR eliminate the need for NMS?',
    },
    back: {
      ru: 'Он решает задачу назначения двудольного графа, сопоставляя каждому объекту строго одно предсказание из 100 запросов. Модель напрямую штрафуется за дублирующие рамки, поэтому NMS не требуется.',
      en: 'It solves a bipartite matching assignment, enforcing a strict 1-to-1 mapping between targets and object queries. The loss heavily penalizes duplicates, rendering NMS obsolete.',
    },
    tags: ['cv', 'detr', 'hungarian-matching'],
  },
];

export const computerVisionQuiz: QuizQuestion[] = [
  {
    id: 'cv-q-1',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Какой размер имеет тензор весов сверточного слоя с 64 входными каналами, 128 выходными каналами и ядром 3x3?',
      en: 'What are the dimensions of the weight tensor for a conv layer with 64 in-channels, 128 out-channels, and 3x3 kernel?',
    },
    options: [
      { ru: '[128, 64, 3, 3]', en: '[128, 64, 3, 3]' },
      { ru: '[64, 128, 3, 3]', en: '[64, 128, 3, 3]' },
      { ru: '[3, 3, 64, 128]', en: '[3, 3, 64, 128]' },
      { ru: '[128, 64, 9]', en: '[128, 64, 9]' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'В PyTorch стандартный порядок размерностей сверточного фильтра: [C_out, C_in, K_h, K_w] = [128, 64, 3, 3].',
      en: 'In PyTorch, 2D convolution weights are stored as [C_out, C_in, K_h, K_w] = [128, 64, 3, 3].',
    },
    tag: 'conv-weight-shape',
  },
  {
    id: 'cv-q-2',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какую главную архитектурную проблему решил блок Bottleneck в ResNet-50 по сравнению с обычным BasicBlock?',
      en: 'What primary problem did the Bottleneck block in ResNet-50 solve compared to BasicBlock?',
    },
    options: [
      { ru: 'Сократил вычислительную сложность FLOPs глубоких слоев путем сжатия числа каналов сверткой 1x1 перед дорогой сверткой 3x3', en: 'Reduced FLOPs by compressing channel dimensions with 1x1 conv prior to expensive 3x3 convolutions' },
      { ru: 'Устранил необходимость использования Batch Normalization', en: 'Eliminated the requirement for Batch Normalization' },
      { ru: 'Позволил обучать сеть на процессорах Intel без видеокарты', en: 'Allowed training on Intel CPUs without GPU acceleration' },
      { ru: 'Заменил сложение каналов на конкатенацию', en: 'Replaced element-wise addition with concatenation' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Bottleneck сжимает каналы (1x1), производит пространственную свертку 3x3 в дешевом низкоразмерном пространстве, а затем восстанавливает каналы (1x1).',
      en: 'Bottleneck compresses channels via 1x1 conv, executes 3x3 filtering in lower dimension, then restores channel depth via another 1x1 conv.',
    },
    tag: 'resnet-bottleneck',
  },
  {
    id: 'cv-q-3',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Что произойдет, если в алгоритме NMS установить слишком высокий порог IoU (например, IoU = 0.95)?',
      en: 'What occurs if the IoU threshold in NMS is set excessively high (e.g. IoU = 0.95)?',
    },
    options: [
      { ru: 'NMS почти перестанет подавлять перекрывающиеся рамки, оставив множество дублирующих рамок вокруг каждого обнаруженного объекта', en: 'NMS will barely suppress overlapping boxes, leaving numerous duplicate boxes around each object' },
      { ru: 'Все рамки на изображении будут немедленно удалены', en: 'All bounding boxes in the image will be deleted' },
      { ru: 'Качество детекции мелких объектов увеличится в 10 раз', en: 'Small object detection accuracy will jump by 10x' },
      { ru: 'Модель перестанет классифицировать фон', en: 'The model stops classifying background' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'NMS удаляет рамки только если IoU > порога. При пороге 0.95 даже сильно перекрывающиеся рамки с IoU 0.85 не будут подавлены, порождая дубли.',
      en: 'NMS only suppresses boxes with IoU exceeding the threshold. At 0.95, duplicates overlapping at 0.85 remain unpruned.',
    },
    tag: 'nms-threshold',
  },
  {
    id: 'cv-q-4',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'В чем заключается принципиальное отличие Anchor-free детектора (например, YOLOv8) от классического Anchor-based (YOLOv3–v5)?',
      en: 'What is the core distinction of Anchor-free detectors (e.g. YOLOv8) from Anchor-based systems (YOLOv3-v5)?',
    },
    options: [
      { ru: 'Модель напрямую предсказывает расстояния до 4 границ объекта от центра активной ячейки сетки, не требуя ручной настройки и кластеризации априорных якорных рамок', en: 'The model directly predicts distances to the 4 object boundaries from grid cells without manual anchor box tuning' },
      { ru: 'Anchor-free модели не используют свертки', en: 'Anchor-free models do not employ convolutions' },
      { ru: 'Anchor-free модели могут работать только со статичными размерами картинок 224x224', en: 'Anchor-free models are restricted to static 224x224 resolutions' },
      { ru: 'Они не способны детектировать объекты больше 100 пикселей', en: 'They cannot detect objects larger than 100 pixels' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Anchor-free избавляет от необходимости подбирать формы якорных рамок методом k-средних; модель регрессирует расстояния до краев объекта от центра точки.',
      en: 'Anchor-free architectures eliminate k-means clustering of bounding box priors, regressing direct geometric distances from cell centers.',
    },
    tag: 'anchor-free-detection',
  },
];
