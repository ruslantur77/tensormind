import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const pytorchPandasSklearnMeta: ModuleMeta = {
  id: 'pytorch-pandas-sklearn',
  title: {
    ru: 'Глубокое обучение, PyTorch и LLM: от тензоров до RAG и Агентов',
    en: 'Deep Learning, PyTorch & LLMs: from Tensors to RAG & Agents',
  },
  description: {
    ru: 'Фундаментальный курс: Autograd, CNN/ResNet, RNN/LSTM, Трансформеры, KV-кэш, методы PEFT (LoRA, QLoRA, Prefix Tuning), архитектура RAG и агентные фреймворки (LangChain, LlamaIndex, ReAct, Tools).',
    en: 'Mastery from basics to cutting-edge: Autograd, CNN/ResNet, Transformers, KV-Cache, PEFT (LoRA, QLoRA), RAG architecture, and agent frameworks (LangChain, LlamaIndex, ReAct, Tools).',
  },
  order: 10,
  icon: 'pytorch-pandas-sklearn',
  estimatedMinutes: 165,
  isPlaceholder: false,
};

export const pytorchPandasSklearnLessons: Lesson[] = [
  {
    id: 'pt-1-tensors',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Тензоры в PyTorch: создание, формы и вычисления на GPU',
    order: 1,
    estimatedMinutes: 12,
    draft: false,
    theoryMarkdown: `### Тензоры в PyTorch (\`torch.Tensor\`)

Тензор — фундаментальная структура данных в PyTorch, многомерный массив с поддержкой вычислений на GPU и автоматического дифференцирования.

#### 1. Создание тензоров
\`\`\`python
import torch
import numpy as np

# Из списка или NumPy массива
x = torch.tensor([[1.0, 2.0], [3.0, 4.0]], dtype=torch.float32)
np_arr = np.array([1, 2, 3])
x_from_np = torch.from_numpy(np_arr)  # Разделяет ту же физическую память!

# Специализированные инициализации
zeros = torch.zeros((3, 3))
ones = torch.ones((2, 4))
rand = torch.randn((3, 5))  # N(0, 1) стандартное нормальное распределение
\`\`\`

#### 2. Изменение формы: \`view\` vs \`reshape\`
* \`tensor.view(*shape)\`: работает только с **непрерывными** в памяти тензорами (contiguous). Если память фрагментирована (например, после \`transpose\` или \`permute\`), сначала необходим вызов \`tensor.contiguous().view(...)\`.
* \`tensor.reshape(*shape)\`: универсален, возвращает view без копирования, если это возможно, либо автоматически копирует данные в новый непрерывный блок памяти.

#### 3. Broadcasting (расширение размерностей)
Два тензора совместимы по правилу broadcasting справа налево, если для каждой размерности:
* Они равны;
* Либо одна из размерностей равна 1 (тогда она виртуально повторяется без копирования в памяти).

#### 4. Работа с устройствами (CPU vs CUDA GPU / Apple MPS)
\`\`\`python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Перенос тензора или модели на устройство
x = x.to(device)
model = model.to(device)
\`\`\`
* Операции между тензорами на разных устройствах (например, один на CPU, другой на CUDA) вызывают \`RuntimeError: Expected all tensors to be on the same device\`.`,
    commonMistakes: [
      'Пытаться применить `.view()` к транспонированному тензору без предварительного вызова `.contiguous()`.',
      'Выполнять математические операции между тензорами на разных девайсах (CPU и CUDA).',
      'Забывать, что `torch.from_numpy()` делит память с NumPy: изменение исходного массива изменит тензор.',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-1',
        question: 'Что произойдет при вызове `tensor.view(-1)` на тензоре после операции `tensor.transpose(0, 1)`, если память стала не-contiguous?',
        options: [
          'PyTorch выбросит RuntimeError, требуя вызвать `.contiguous()` перед `.view()`',
          'Тензор автоматически и без ошибок преобразуется',
          'Все элементы тензора обнулятся',
          'Память GPU будет немедленно освобождена',
        ],
        correctAnswer: 0,
        explanation: 'Метод `.view()` строго требует непрерывности данных в памяти. Для транспонированных тензоров следует использовать `tensor.contiguous().view(...)` либо `tensor.reshape(...)`.',
      },
      {
        id: 'pt-cp-2',
        question: 'Какое устройство (`device`) следует использовать в коде для универсальной поддержки GPU в PyTorch?',
        options: [
          "torch.device('cuda' if torch.cuda.is_available() else 'cpu')",
          "torch.device('gpu_always')",
          "torch.device('directx')",
          "torch.device('cuda:99')",
        ],
        correctAnswer: 0,
        explanation: 'Проверка `torch.cuda.is_available()` позволяет коду работать как на сервере с NVIDIA GPU, так и на локальном ноутбуке с CPU без падений.',
      },
    ],
  },
  {
    id: 'pt-2-autograd',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Механизм Autograd и динамический граф вычислений',
    order: 2,
    estimatedMinutes: 13,
    draft: false,
    theoryMarkdown: `### Автоматическое дифференцирование: Autograd

PyTorch использует **динамический граф вычислений** (Tape-based Autograd). Граф строится на лету во время прямого прохода (forward pass) и уничтожается после обратного прохода (backward pass).

#### 1. Флаг \`requires_grad\`
\`\`\`python
w = torch.tensor([2.0, 3.0], requires_grad=True)
b = torch.tensor(1.0, requires_grad=True)

y = (w[0] * 3.0 + w[1] * 4.0 + b) ** 2
\`\`\`
Каждая операция над тензором с \`requires_grad=True\` сохраняет ссылку на функцию создания (\`y.grad_fn\`), формируя направленный ациклический граф (DAG).

#### 2. Обратный проход (\`.backward()\`)
\`\`\`python
y.backward()
print(w.grad)  # Вектор частных производных dy/dw
print(b.grad)  # Производная dy/db
\`\`\`
* **Внимание: Градиенты аккумулируются (суммируются)!** Если вызвать \`.backward()\` повторно, новые градиенты прибавятся к уже сохранённым в \`w.grad\`. Поэтому перед каждым шагом оптимизатора вызывается:
\`\`\`python
optimizer.zero_grad()
\`\`\`

#### 3. Отключение графа: \`torch.no_grad()\` и \`.detach()\`
Во время валидации, тестирования или инференса граф вычислений не нужен. Его отключение экономит гигабайты памяти GPU:
\`\`\`python
with torch.no_grad():
    preds = model(val_x)
\`\`\`
* Метод \`x.detach()\` возвращает новый тензор, отсоединенный от текущего графа (градиенты сквозь него не текут).`,
    commonMistakes: [
      'Забывать вызывать `optimizer.zero_grad()` перед `loss.backward()`, что приводит к накоплению градиентов с предыдущих батчей.',
      'Забывать контекстный менеджер `with torch.no_grad():` во время инференса, что приводит к переполнению GPU памяти (CUDA Out of Memory).',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-3',
        question: 'Что произойдет, если в цикле обучения забыть вызвать `optimizer.zero_grad()`?',
        options: [
          'Градиенты нового шага сложатся со старыми градиентами предыдущего батча, искажая шаг оптимизации',
          'PyTorch выдаст синтаксическую ошибку',
          'Веса модели заморозятся и перестанут меняться',
          'Размерность градиентов умножится на два',
        ],
        correctAnswer: 0,
        explanation: 'В PyTorch поле `.grad` по умолчанию суммирует градиенты (accumulates). Без зануления шаг оптимизатора выполняется по сумме всех предыдущих шагов.',
      },
    ],
  },
  {
    id: 'pt-3-nn-module',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Построение архитектур нейросетей в nn.Module',
    order: 3,
    estimatedMinutes: 13,
    draft: false,
    theoryMarkdown: `### Модуль \`torch.nn.Module\`

Все нейронные сети и отдельные слои в PyTorch наследуются от базового класса \`torch.nn.Module\`.

#### Анатомия кастомной модели
\`\`\`python
import torch
import torch.nn as nn
import torch.nn.functional as F

class MLPClassifier(nn.Module):
    def __init__(self, in_features: int, hidden_dim: int, num_classes: int):
        super().__init__()
        self.fc1 = nn.Linear(in_features, hidden_dim)
        self.bn1 = nn.BatchNorm1d(hidden_dim)
        self.dropout = nn.Dropout(p=0.3)
        self.fc2 = nn.Linear(hidden_dim, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.fc1(x)
        x = self.bn1(x)
        x = F.relu(x)
        x = self.dropout(x)
        logits = self.fc2(x)
        return logits
\`\`\`

#### 1. Нормализации: BatchNorm vs LayerNorm
* **BatchNorm (\`nn.BatchNorm1d\`, \`BatchNorm2d\`)**:
  * Нормализует активации **вдоль оси батча** для каждого признака/канала отдельно:
    $$\\hat{x} = \\frac{x - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}} \\cdot \\gamma + \\beta$$
  * Зависит от размера батча ($B$): при маленьком батче ($B \\le 4$) оценка среднего и дисперсии зашумлена. В NLP с последовательностями разной длины неприменим.
* **LayerNorm (\`nn.LayerNorm\`)**:
  * Нормализует **вдоль оси признаков/каналов для каждого сэмпла независимо**:
    $$\\mu_L = \\frac{1}{D}\\sum_{i=1}^D x_i, \\quad \\sigma_L^2 = \\frac{1}{D}\\sum_{i=1}^D (x_i - \\mu_L)^2$$
  * Полностью независим от размера батча и параллельных сэмплов. Золотой стандарт для NLP, LLM и трансформеров.

#### 2. Проблема сочетания Sigmoid и BatchNorm
* Функция Sigmoid: $\\sigma(z) = \\frac{1}{1 + e^{-z}}$, производная $\\sigma'(z) = \\sigma(z)(1 - \\sigma(z)) \\le 0.25$.
* BatchNorm центрирует значения вокруг $0$ ($\mu=0, \sigma^2=1$). Значение $\\sigma(0) = 0.5$, производная максимальна ($\sigma'(0) = 0.25$).
* Казалось бы, BN защищает от насыщения сигмоиды. Однако максимальный множитель градиента равен всего $0.25$. При прохождении через 10 слоев градиент масштабируется как $0.25^{10} \\approx 10^{-6}$, вызывая **катастрофическое затухание градиентов (vanishing gradients)**. Поэтому в глубоких сетях используют **ReLU**, **GELU** или **SwiGLU**.

#### 3. Инициализация весов: Почему нельзя инициализировать нулями?
* **Проблема симметрии (Symmetry Problem)**: если все веса слоя $W = 0$, то при forward pass все нейроны скрытого слоя получат одинаковый вход и выдадут одинаковый сигнал. На backward pass градиенты $\\frac{\\partial L}{\\partial w_i}$ для всех нейронов будут идентичны. Все нейроны слоя будут обновляться одинаково, превращая многослойную сеть в эквивалент одного-единственного нейрона.
* **Xavier / Glorot (2010)**: рассчитана для симметричных функций с нулевым центром (Tanh, линейные слои). Дисперсия весов:
  $$\\text{Var}(W) = \\frac{2}{n_{in} + n_{out}}$$
  Сохраняет дисперсию активаций на прямом проходе и дисперсию градиентов на обратном.
* **He / Kaiming (2015)**: рассчитана специально для **ReLU/LeakyReLU**, которые обнуляют ровно половину нейронов ($x < 0$). Дисперсия весов вдвое больше, чем у Xavier:
  $$\\text{Var}(W) = \\frac{2}{n_{in}}$$
  Предотвращает затухание дисперсии вдвое на каждом ReLU-слое.

#### 4. Архитектурные фишки: Bottleneck и Residual связи
* **Bottleneck слой (1×1 $\\to$ 3×3 $\\to$ 1×1)**:
  1. $1\\times 1$ свертка сжимает каналы (например, с 256 до 64), снижая размерность;
  2. $3\\times 3$ свертка работает в низкоразмерном пространстве (мало параметров и FLOPs);
  3. $1\\times 1$ свертка восстанавливает исходную размерность каналов (до 256).
  Это позволяет строить гораздо более глубокие сети при меньшем числе операций.
* **Почему в Residual connection сложение ($x + F(x)$), а не конкатенация?**
  1. **Градиентный хайвей**: производная выхода по входу:
     $$\\frac{\\partial (x + F(x))}{\\partial x} = 1 + \\frac{\\partial F(x)}{\\partial x}$$
     Слагаемое $+1$ гарантирует, что градиент ошибки может беспрепятственно протекать из последнего слоя в самый первый без затухания, даже если $\\frac{\\partial F}{\\partial x} \\approx 0$.
  2. **Экономия памяти**: конкатенация ($[x; F(x)]$, как в DenseNet) линейно раздувает размерность скрытого пространства с каждым слоем, требуя колоссального объема памяти GPU. Сложение сохраняет размерность тензора неизменной.

#### 5. Переключение режимов: \`train()\` vs \`eval()\`
* \`model.train()\`: активирует Dropout (выбрасывает нейроны с масштабированием $\\frac{1}{1-p}$), BatchNorm считает $\\mu_B, \\sigma_B^2$ текущего батча.
* \`model.eval()\`: отключает Dropout, переводит BatchNorm на замороженные экспоненциальные статистики (\`running_mean\`, \`running_var\`).`,
    commonMistakes: [
      'Ставить `nn.Softmax()` на выход сети при использовании `nn.CrossEntropyLoss()` (двойной softmax искажает градиенты).',
      'Инициализировать веса линейных слоев нулями: это ломает симметрию и блокирует обучение индивидуальных признаков.',
      'Использовать BatchNorm при микроскопических размерах батча ($B=2$): оценки $\\mu_B$ и $\\sigma_B^2$ становятся шумными; для таких задач выбирают GroupNorm или LayerNorm.',
      'Забывать вызывать `model.eval()` перед инференсом: Dropout останется активным, внося случайный шум в предсказания.',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-4',
        question: 'Что произойдет, если инициализировать все веса W полносвязного скрытого слоя нулями?',
        options: [
          'Все нейроны скрытого слоя получат одинаковые градиенты и будут учить абсолютно одинаковые признаки (нарушение симметрии)',
          'Нейросеть обучится быстрее, так как стартует из глобального минимума',
          'PyTorch выбросит ошибку ZeroDivisionError при первом forward pass',
          'Градиенты моментально взорвутся до бесконечности (NaN)',
        ],
        correctAnswer: 0,
        explanation: 'Из-за симметрии одинаковые веса порождают одинаковые выходы и одинаковые частные производные dL/dw. В результате все нейроны слоя обновляются идентично и сеть деградирует в один нейрон.',
      },
      {
        id: 'pt-cp-4-res',
        question: 'Почему в блоках ResNet для соединения входа и выхода используется сложение x + F(x), а не конкатенация?',
        options: [
          'Производная d(x + F(x))/dx = 1 + dF/dx обеспечивает единичный градиентный хайвей без раздувания размерности тензора',
          'Конкатенация тензоров не поддерживается операциями Autograd в PyTorch',
          'Сложение устраняет необходимость в функциях активации ReLU',
          'Потому что конкатенация приводит к делению на ноль в обратном проходе',
        ],
        correctAnswer: 0,
        explanation: 'Единичное слагаемое в производной d(x+F)/dx = 1 + dF/dx гарантирует прохождение градиента даже при затухании dF/dx, а сложение не увеличивает размерность скрытого вектора.',
      },
      {
        id: 'pt-cp-4-norm',
        question: 'В чем ключевое различие между BatchNorm и LayerNorm?',
        options: [
          'BatchNorm нормализует по батчу для каждого признака, а LayerNorm — по всем признакам внутри каждого отдельного сэмпла независимо от батча',
          'BatchNorm применяется только в NLP, а LayerNorm — только в сверточных сетях для изображений',
          'LayerNorm требует знания меток классов y_batch, а BatchNorm работает без учителя',
          'BatchNorm обучается без параметров γ и β, а LayerNorm их использует',
        ],
        correctAnswer: 0,
        explanation: 'BatchNorm зависит от размера батча и считает статистики по N сэмплам. LayerNorm вычисляет среднее и дисперсию строго по вектору скрытого состояния одного конкретного сэмпла, поэтому независим от batch size.',
      },
    ],
  },
  {
    id: 'pt-4-training-loop',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Пайплайн обучения: Dataset, DataLoader и Training Loop',
    order: 4,
    estimatedMinutes: 12,
    draft: false,
    theoryMarkdown: `### Полный пайплайн обучения нейросети

#### 1. Кастомный \`Dataset\`
\`\`\`python
from torch.utils.data import Dataset, DataLoader

class TabularDataset(Dataset):
    def __init__(self, X: np.ndarray, y: np.ndarray):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.long)

    def __len__(self) -> int:
        return len(self.X)

    def __getitem__(self, idx: int):
        return self.X[idx], self.y[idx]
\`\`\`

#### 2. \`DataLoader\`
Обеспечивает параллельную загрузку данных, батчирование и перемешивание:
\`\`\`python
train_loader = DataLoader(
    dataset=train_dataset,
    batch_size=64,
    shuffle=True,       # Перемешивать только для train!
    num_workers=2,      # Число фоновых процессов
    pin_memory=True     # Ускоряет перенос данных из RAM в GPU
)
\`\`\`

#### 3. Канонический цикл обучения (Training Loop)
\`\`\`python
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
criterion = nn.CrossEntropyLoss()

for epoch in range(num_epochs):
    # Фаза обучения
    model.train()
    running_loss = 0.0

    for X_batch, y_batch in train_loader:
        X_batch, y_batch = X_batch.to(device), y_batch.to(device)

        # 1. Сброс градиентов
        optimizer.zero_grad()

        # 2. Прямой проход (forward)
        logits = model(X_batch)

        # 3. Вычисление ошибки
        loss = criterion(logits, y_batch)

        # 4. Обратный проход (backward)
        loss.backward()

        # 5. Шаг оптимизатора
        optimizer.step()

        running_loss += loss.item() * X_batch.size(0)

    # Фаза валидации
    model.eval()
    with torch.no_grad():
        val_loss = 0.0
        for X_val, y_val in val_loader:
            X_val, y_val = X_val.to(device), y_val.to(device)
            val_logits = model(X_val)
            val_loss += criterion(val_logits, y_val).item()
\`\`\`

#### 4. Распределение памяти GPU: Обучение vs Инференс
На собеседованиях часто спрашивают: *«Почему для обучения модели на 7 млрд параметров нужно 80 ГБ VRAM, а для инференса хватает 16 ГБ?»*

Объем памяти при **обучении**:
1. **Веса модели (Model Weights)**: в FP16/BF16 это $2$ байта на параметр ($7\text{B} \\times 2 = 14$ ГБ).
2. **Градиенты (Gradients)**: те же $2$ байта на каждый обучаемый параметр ($14$ ГБ).
3. **Состояния оптимизатора (Optimizer States)**: для Adam/AdamW хранятся первый и второй моменты ($m_t, v_t$) в FP32 для численной стабильности, плюс мастер-веса в FP32:
   $$\\text{AdamW memory} = 4 + 4 + 4 = 12\\text{–}16\\text{ байт на параметр!}$$
   Для модели 7B только состояния AdamW требуют $\\approx 56\\text{–}80$ ГБ!
4. **Активации (Activations)**: промежуточные тензоры, сохраненные на прямом проходе для вычисления градиентов по формуле Backpropagation. Объем пропорционален:
   $$\\text{Activations} \\propto \\text{Batch Size} \\times \\text{Seq Length} \\times \\text{Hidden Dim} \\times \\text{Num Layers}$$
   Для сжатия активаций применяют **Activation Checkpointing** (пересчет активаций на backward pass вместо их хранения в памяти).

Объем памяти при **инференсе**:
* Требуются **только веса** модели ($14$ ГБ в FP16 или $4$ ГБ при квантовании INT4) и минимальный буфер под один текущий слой (активации не нужно сохранять для backward pass). При генерации текста добавляется только KV-кэш.`,
    commonMistakes: [
      'Включать `shuffle=True` в DataLoader для валидационной или тестовой выборки (не нужно, лишние накладные расходы).',
      'Забывать перенести батчи `X_batch.to(device)` на то же устройство, где находится модель.',
      'Накапливать тензор потерь `running_loss += loss` вместо скаляра `loss.item()`, что не дает сборщику освободить граф вычислений и вызывает утечку памяти (Memory Leak).',
      'Не оборачивать валидационный цикл в `with torch.no_grad():`, из-за чего PyTorch строит граф вычислений и забивает GPU память сохраненными активациями.',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-5',
        question: 'Почему в цикле обучения нужно писать `running_loss += loss.item()`, а не `running_loss += loss`?',
        options: [
          '`loss.item()` извлекает Python float и не удерживает граф вычислений в памяти GPU, предотвращая утечку памяти',
          'Потому что тензор loss не поддерживает оператор `+=`',
          'Чтобы округлить ошибку до целого числа',
          'Разницы нет, это дело стиля',
        ],
        correctAnswer: 0,
        explanation: 'Если складывать тензоры `loss`, в памяти удерживается весь вычислительный граф за все батчи эпохи, что неизбежно приводит к ошибке CUDA Out of Memory.',
      },
      {
        id: 'pt-cp-5-mem',
        question: 'Что занимает наибольшую долю памяти GPU при обучении большой модели с оптимизатором AdamW в FP16 смешанной точности?',
        options: [
          'Состояния оптимизатора AdamW (первый и второй моменты в FP32 занимают до 12-16 байт на параметр)',
          'Сами веса модели в FP16',
          'Код Python скрипта и библиотеки PyTorch',
          'Служебный кэш CUDA драйвера',
        ],
        correctAnswer: 0,
        explanation: 'Для каждого параметра AdamW хранит скользящее среднее градиентов (first moment, 4 байта) и несмещенную оценку дисперсии (second moment, 4 байта) в FP32, а также копию FP32 весов, что в разы превышает размер самих весов модели.',
      },
    ],
  },
  {
    id: 'pt-5-cnn',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Сверточные сети (CNN): Conv2d, Receptive Field и ResNet с Skip-Connections',
    order: 5,
    estimatedMinutes: 20,
    draft: false,
    svgDiagram: 'CNNFeatureMap',
    theoryMarkdown: `### Сверточные нейронные сети (Convolutional Neural Networks)

Сверточный слой учитывает пространственную структуру двумерных изображений благодаря **локальности рецептивного поля (Receptive Field)** и **разделению весов (Weight Sharing)**.

#### 1. Формула размерности выхода 2D-свертки
Для входного изображения размера $H \\times W$ с ядром свертки $K \\times K$, паддингом $P$ и страйдом $S$:
$$H_{\\text{out}} = \\left\\lfloor \\frac{H - K + 2P}{S} \\right\\rfloor + 1, \\quad W_{\\text{out}} = \\left\\lfloor \\frac{W - K + 2P}{S} \\right\\rfloor + 1$$
* Чтобы сохранить пространственные размеры при ядре $3 \\times 3$ и $S=1$, выбирают $P=1$ (**Same Padding**).

#### 2. Слои в PyTorch
\`\`\`python
import torch.nn as nn

# [Batch, in_channels, H, W] -> [Batch, out_channels, H_out, W_out]
conv = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3, stride=1, padding=1, bias=False)
bn = nn.BatchNorm2d(64)
pool = nn.MaxPool2d(kernel_size=2, stride=2)  # Уменьшает H и W в 2 раза
gap = nn.AdaptiveAvgPool2d((1, 1))           # Схлопывает spatial-размеры до 1x1 перед FC
\`\`\`
* **Замечание:** Если за \`Conv2d\` сразу следует \`BatchNorm2d\`, смещение \`bias=False\` в свертке экономит параметры, так как BatchNorm содержит собственный обучаемый сдвиг $\\beta$.

---

### Архитектура ResNet (Residual Network) и Skip-Connections

При увеличении глубины классических CNN (более 20-30 слоев) возникает деградация: градиенты затухают при обратном распространении через десятки нелинейностей:
$$\\frac{\\partial \\mathcal{L}}{\\partial x} = \\prod_{k=1}^L W_k$$
Если $\|W_k\| < 1$, градиент экспоненциально стремится к нулю.

**Идея остаточного обучения (He et al., ResNet):**
Вместо аппроксимации целевого отображения $\\mathcal{H}(x)$ сеть обучается остаточной функции:
$$\\mathcal{F}(x) = \\mathcal{H}(x) - x \\implies \\mathcal{H}(x) = \\mathcal{F}(x) + x$$
Благодаря **Skip-Connection (пробросу тождественного входа)**, производная на выходе блока равна:
$$\\frac{\\partial \\mathcal{L}}{\\partial x} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathcal{H}} \\left( \\frac{\\partial \\mathcal{F}}{\\partial x} + 1 \\right)$$
Слагаемое $+1$ гарантирует **прямой магистральный канал** протекания градиента без затухания напрямую из конца сети в самые первые слои!

\`\`\`python
class ResidualBlock(nn.Module):
    def __init__(self, channels: int):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += identity  # Skip connection!
        return self.relu(out)
\`\`\``,
    commonMistakes: [
      'Устанавливать `bias=True` в `nn.Conv2d`, если следом стоит `nn.BatchNorm2d`: это бесполезная трата параметров GPU.',
      'Забывать согласовать размерности при пробросе identity в ResNet: если страйд $S > 1$ или число каналов меняется, то для identity необходима проекция $1 \\times 1$ сверткой.',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-cnn-1',
        question: 'Почему Skip-Connection в архитектуре ResNet предотвращает затухание градиента в сверхглубоких сетях (100+ слоев)?',
        options: [
          'Благодаря члену +1 в производной d/dx (F(x) + x) градиент всегда имеет беспрепятственный сквозной путь назад',
          'Потому что в ResNet запрещено использовать функции активации',
          'Потому что сверточные слои заменяются линейными',
          'ResNet вычисляет градиенты только для четных слоев',
        ],
        correctAnswer: 0,
        explanation: 'Формула градиента dL/dx = (dL/dH) * (dF/dx + 1). Наличие единичного слагаемого гарантирует, что даже если dF/dx близко к нулю, градиент не затухает.',
      },
      {
        id: 'pt-cp-cnn-2',
        question: 'Каков выходной размер тензора после nn.Conv2d(kernel_size=3, padding=1, stride=2) над входом [B, 3, 64, 64]?',
        options: [
          '[B, out_channels, 32, 32]',
          '[B, out_channels, 64, 64]',
          '[B, out_channels, 16, 16]',
          '[B, out_channels, 31, 31]',
        ],
        correctAnswer: 0,
        explanation: 'По формуле (64 - 3 + 2*1)/2 + 1 = 63/2 + 1 = 31 + 1 = 32.',
      },
    ],
  },
  {
    id: 'pt-6-rnn-lstm-gru',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Рекуррентные сети (RNN, LSTM, GRU): BPTT, ячейка памяти и последовательности',
    order: 6,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: `### Обработка последовательностей: от ванильной RNN к LSTM и GRU

Последовательные данные (текст, временные ряды, аудио) обладают временной зависимостью $x_1, x_2, \\dots, x_T$.

#### 1. Проблема ванильной RNN (Backpropagation Through Time)
В простой рекуррентной сети скрытое состояние обновляется как:
$$h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b)$$
При дифференцировании ошибки шага $T$ по начальному состоянию $h_1$:
$$\\frac{\\partial L_T}{\\partial h_1} = \\frac{\\partial L_T}{\\partial h_T} \\prod_{t=2}^T \\frac{\\partial h_t}{\\partial h_{t-1}} = \\frac{\\partial L_T}{\\partial h_T} \\prod_{t=2}^T \\text{diag}(1 - h_t^2) W_{hh}^T$$
* Если наибольшее сингулярное число $W_{hh} > 1$, градиент **взрывается (Exploding Gradient)**. Решение — **Gradient Clipping**:
\`\`\`python
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
\`\`\`
* Если сингулярные числа $< 1$ (а производная $\\tanh \\le 1$), градиент **экспоненциально затухает**. Ванильная RNN не способна помнить контекст длиннее 10-15 токенов.

---

### Архитектура LSTM (Long Short-Term Memory, Hochreiter & Schmidhuber)

LSTM решает проблему затухания градиента с помощью **выделенной ячейки состояния (Cell State, $C_t$)** и системы вентилей (гейтов):
1. **Вентиль забывания (Forget Gate):** сколько информации стереть из прошлой памяти:
   $$f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)$$
2. **Входной вентиль (Input Gate) и кандидат:** что нового записать:
   $$i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i), \\quad \\tilde{C}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c)$$
3. **Обновление ячейки памяти (линейная суперпозиция):**
   $$C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t$$
4. **Выходной вентиль (Output Gate) и скрытое состояние:**
   $$o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o), \\quad h_t = o_t \\odot \\tanh(C_t)$$

**Почему градиент в LSTM не затухает?**
Обратите внимание на формулу $C_t = f_t \\odot C_{t-1} + \\dots$. Производная $\\frac{\\partial C_t}{\\partial C_{t-1}} = f_t$. Если гейт забывания открыт ($f_t \\approx 1$), градиент течет сквозь сотни шагов времени вообще без затухания (additive linear highway)!

---

### Реализация в PyTorch
\`\`\`python
# batch_first=True меняет форму входа с [seq_len, batch, dim] на [batch, seq_len, dim]
lstm = nn.LSTM(
    input_size=128,
    hidden_size=256,
    num_layers=2,
    batch_first=True,
    bidirectional=True,  # Двунаправленная: конкатенирует прямой и обратный контекст
    dropout=0.2
)

# x: [Batch, Seq_Len, Input_Dim]
# h0, c0: [num_layers * num_directions, Batch, Hidden_Dim]
out, (hn, cn) = lstm(x)
# out: [Batch, Seq_Len, 512] (256 * 2 из-за bidirectional)
\`\`\``,
    commonMistakes: [
      'Забывать параметр `batch_first=True`: по умолчанию в PyTorch `nn.RNN/LSTM` ожидают тензор формы `[seq_len, batch, features]`.',
      'Забывать обрезать градиенты (`clip_grad_norm_`) при обучении рекуррентных архитектур.',
      'Передавать скрытые состояния между независимыми батчами без вызова `.detach()`, что приводит к росту графа Autograd во времени.',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-rnn-1',
        question: 'За счет чего LSTM предотвращает экспоненциальное затухание градиента при Backpropagation Through Time?',
        options: [
          'Благодаря аддитивному обновлению Cell State C_t = f_t * C_{t-1} + i_t * C~_t, где градиент dC_t/dC_{t-1} = f_t не перемножается на матричные веса',
          'За счет полного отказа от весов в рекуррентных слоях',
          'Потому что LSTM работает только с последовательностями длиной до 3 токенов',
          'За счет использования ReLU вместо всех других активаций',
        ],
        correctAnswer: 0,
        explanation: 'Cell State в LSTM образует линейный градиентный хайвей: градиент течет сквозь время через умножение на f_t, минуя повторные матричные умножения на W.',
      },
    ],
  },
  {
    id: 'pt-7-vae',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Вариационные автоэнкодеры (VAE): латентное пространство, ELBO и Reparameterization Trick',
    order: 7,
    estimatedMinutes: 25,
    draft: false,
    svgDiagram: 'VAELatentSpace',
    theoryMarkdown: `### От детерминированного AutoEncoder к генеративному VAE

Классический автоэнкодер сжимает вход $x$ в точку $z = f(x)$. Его латентное пространство дискретно, содержит «пустоты» и разрывы, из которых невозможно сэмплировать новые реалистичные объекты.

**Идея VAE (Kingma & Welling):**
Энкодер $q_\\phi(z \\mid x)$ предсказывает не точку, а **параметры распределения вероятностей** — среднее $\\mu(x)$ и логарифм дисперсии $\\log \\sigma^2(x)$ латентного вектора $z$.

---

### Вариационная нижняя граница (ELBO — Evidence Lower Bound)

Цель — максимизировать маргинальное лог-правдоподобие данных $\\log p_\\theta(x)$. Разлагая дивергенцию Кульбака-Лейблера:
$$\\log p_\\theta(x) = \\mathcal{L}_{\\text{ELBO}}(\\theta, \\phi; x) + D_{KL}(q_\\phi(z \\mid x) \\parallel p_\\theta(z \\mid x))$$
Поскольку $D_{KL} \\ge 0$, функция $\\mathcal{L}_{\\text{ELBO}}$ является строгой нижней границей:
$$\\mathcal{L}_{\\text{ELBO}} = \\underbrace{\\mathbb{E}_{q_\\phi(z \\mid x)} [\\log p_\\theta(x \\mid z)]}_{\\text{Reconstruction Loss (BCE или MSE)}} - \\underbrace{D_{KL}(q_\\phi(z \\mid x) \\parallel p(z))}_{\\text{Регуляризатор латентного пространства}}$$

#### Аналитическая формула KL-дивергенции для Гауссиан:
Если априорное распределение стандартное нормальное $p(z) = \\mathcal{N}(0, I)$, а $q_\\phi(z \\mid x) = \\mathcal{N}(\\mu, \\text{diag}(\\sigma^2))$:
$$D_{KL} = -\\frac{1}{2} \\sum_{j=1}^d \\left( 1 + \\log \\sigma_j^2 - \\mu_j^2 - \\sigma_j^2 \\right)$$
Этот штраф заставляет латентное пространство быть плотным, непрерывным и сосредоточенным вокруг нуля.

---

### Трюк с перепараметризацией (Reparameterization Trick)

**Проблема:** Нельзя взять случайную выборку $z \\sim \\mathcal{N}(\\mu, \\sigma^2)$ внутри графа PyTorch: операция сэмплирования недифференцируема, и градиенты от декодера не смогут пройти сквозь нее назад в энкодер!

**Решение:** Вынести стохастический шум **наружу** графа:
$$z = \\mu + \\sigma \\odot \\epsilon, \\quad \\text{где } \\epsilon \\sim \\mathcal{N}(0, I)$$
Теперь $z$ — строго дифференцируемое детерминированное преобразование по параметрам $\\mu$ и $\\sigma$, а шум $\\epsilon$ выступает просто константным внешним входом. Градиенты Autograd текут беспрепятственно!

\`\`\`python
import torch
import torch.nn as nn

class VAE(nn.Module):
    def __init__(self, in_dim=784, latent_dim=32):
        super().__init__()
        # Encoder
        self.fc_enc = nn.Linear(in_dim, 256)
        self.fc_mu = nn.Linear(256, latent_dim)
        self.fc_logvar = nn.Linear(256, latent_dim)
        
        # Decoder
        self.fc_dec = nn.Sequential(
            nn.Linear(latent_dim, 256),
            nn.ReLU(),
            nn.Linear(256, in_dim),
            nn.Sigmoid()
        )

    def reparameterize(self, mu: torch.Tensor, logvar: torch.Tensor) -> torch.Tensor:
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std  # Reparameterization trick!

    def forward(self, x: torch.Tensor):
        h = torch.relu(self.fc_enc(x))
        mu, logvar = self.fc_mu(h), self.fc_logvar(h)
        z = self.reparameterize(mu, logvar)
        recon_x = self.fc_dec(z)
        return recon_x, mu, logvar
\`\`\``,
    commonMistakes: [
      'Предсказывать напрямую дисперсию $\\sigma^2$ вместо логарифма $\\log \\sigma^2$: дисперсия обязана быть строго положительной, а $\\log \\sigma^2$ принимает любые вещественные значения.',
      'Использовать операцию `torch.normal` или `np.random` внутри `forward` без репараметризации: градиенты перестанут течь в энкодер.',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-vae-1',
        question: 'Зачем в Variational Autoencoder применяется Reparameterization Trick (z = μ + σ ⊙ ε)?',
        options: [
          'Чтобы вынести стохастичность во внешний независимый шум ε ~ N(0, I), сделав латентный вектор z дифференцируемым для Autograd',
          'Чтобы сжать размерность латентного вектора в 2 раза',
          'Чтобы исключить этап декодирования',
          'Чтобы перевести модель на вычисления с плавающей точкой FP16',
        ],
        correctAnswer: 0,
        explanation: 'Операция случайного сэмплирования не имеет градиента. Представление z = μ + σ * ε переносит производную на μ и σ через обычные дифференцируемые операции сложения и умножения.',
      },
    ],
  },
  {
    id: 'pt-8-transformers',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Архитектура Transformer: Scaled Dot-Product, Multi-Head Attention, RoPE и RMSNorm',
    order: 8,
    estimatedMinutes: 25,
    draft: false,
    svgDiagram: 'TransformerAttention',
    theoryMarkdown: `### Механизм внимания (Attention) как мостик от RNN к Transformer

В классических рекуррентных моделях (Seq2Seq с LSTM/GRU, Sutskever et al., 2014) входная последовательность любой длины сжималась в один-единственный скрытый вектор фиксированного размера $h_T$. Это создавало катастрофическое **бутылочное горлышко (information bottleneck)**: в длинных предложениях модель забывала начало фразы.

В 2014 году Дзмитрий Бахданау (Bahdanau et al.) предложил революционную идею **механизма внимания (Attention)**:
- Вместо сжатия в один вектор декодер на каждом шаге $t$ вычисляет веса релевантности $\\alpha_{t, i}$ ко **всем** скрытым состояниям энкодера $h_i$:
  $$e_{t, i} = v_a^T \\tanh(W_a s_{t-1} + U_a h_i), \\quad \\alpha_{t, i} = \\frac{\\exp(e_{t, i})}{\\sum_{k=1}^{T_x} \\exp(e_{t, k})}$$
- Контекстный вектор вычисляется как взвешенная сумма: $c_t = \\sum_{i=1}^{T_x} \\alpha_{t, i} h_i$.
Луонг (Luong et al., 2015) упростил вычисление до скалярного произведения: $\\text{score}(s_t, h_i) = s_t^T h_i$.

В 2017 году авторы статьи *«Attention Is All You Need»* (Vaswani et al.) сделали логический следующий шаг: если механизм внимания способен напрямую соединять любые два слова в предложении за $\\mathcal{O}(1)$ операций, **зачем вообще нужна рекуррентность?** Они полностью выбросили RNN и создали **Transformer** на базе самовнимания (Self-Attention) с полной параллелизацией на GPU!

---

### Механизм Scaled Dot-Product Attention

Для входного представления последовательности вычисляются матрицы **Query (Q)**, **Key (K)** и **Value (V)**:
$$Q = X W_Q, \\quad K = X W_K, \\quad V = X W_V$$
Формула внимания:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} + M \\right) V$$

**Зачем делить на $\\sqrt{d_k}$?**
При большой размерности $d_k$ (например, 128) скалярное произведение $q^T k = \\sum_{i=1}^{d_k} q_i k_i$ имеет дисперсию $d_k$. Значения становятся очень большими по модулю, и Softmax входит в область насыщения с **исчезающе малыми градиентами**. Деление на $\\sqrt{d_k}$ нормализует дисперсию к 1.

**Causal Mask ($M$):**
В генеративных моделях (GPT, LLaMA) токен не имеет права заглядывать в будущее. Верхний треугольник матрицы внимания заполняется $-\\infty$:
$$M_{ij} = \\begin{cases} 0, & i \\ge j \\\\ -\\infty, & i < j \\end{cases} \\implies \\text{softmax}(-\\infty) = 0$$

---

### Multi-Head Attention (MHA)
Вместо одного внимания размерности $d$, вычисляется $h$ параллельных голов внимания с проекциями в подпространства $d_k = d / h$:
$$\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W_O$$
Каждая голова фокусируется на своих типах взаимосвязей: синтаксических, семантических, анафорических ссылках.

---

### Self-Attention vs Cross-Attention
На собеседованиях регулярно просят объяснить разницу между этими двумя блоками:
* **Self-Attention (Самовнимание)**:
  * Входные векторы $Q, K, V$ проецируются из **одной и той же последовательности** ($X$):
    $$Q = X W_Q, \\quad K = X W_K, \\quad V = X W_V$$
  * Каждый токен вычисляет внимание ко всем остальным токенам того же предложения (или только к предшествующим в Causal Self-Attention).
* **Cross-Attention (Перекрестное внимание)**:
  * Запросы **$Q$ приходят из одной последовательности** (например, из декодера $Y$), а ключи и значения **$K, V$ приходят из другой последовательности** (из энкодера $X$):
    $$Q = Y W_Q, \\quad K = X W_K, \\quad V = X W_V$$
  * Позволяет целевой последовательности обращаться к контексту исходной: используется в машинном переводе (Seq2Seq Transformer), распознавании речи (Whisper), генерации картинок по тексту (Stable Diffusion — текстовые токены служат $K, V$, а латентные пиксели служат $Q$) и детекции (DETR).

---

### Позиционные эмбеддинги: виды и специфика
Так как операция внимания инвариантна к перестановкам токенов (permutation invariant), позиция обязана кодироваться явно:
1. **1D Absolute Sinusoidal (Vaswani et al., 2017)**: детерминированные синусы и косинусы разных частот $PE_{(pos, 2i)} = \\sin(pos / 10000^{2i/d})$. Не требуют параметров, но плохо экстраполируются на длины длиннее обучающих.
2. **1D Learned Embeddings (BERT, GPT-2)**: обучаемые векторы $W_{pos} \\in \\mathbb{R}^{L_{max} \\times d}$. Жестко ограничены максимальной длиной $L_{max}$.
3. **2D Positional Embeddings (Vision Transformer ViT)**: изображение разбивается на сетку патчей $H' \\times W'$. Позиция патча $(i, j)$ кодируется конкатенацией или суммой одномерных эмбеддингов по строкам и столбцам: $P_{i, j} = [E_{row}(i); E_{col}(j)]$.
4. **RoPE (Rotary Position Embedding, Su et al.)**: вращает двумерные срезы векторов $Q$ и $K$ на угол $m\\theta_i$:
   $$(R_{\\Theta, m}^d q)^T (R_{\\Theta, n}^d k) = q^T R_{\\Theta, n - m}^d k$$
   Внимание естественным образом зависит **только от относительного расстояния $(n - m)$**, легко масштабируется на гигантский контекст (методами YaRN и RoPE scaling).

---

### Борьба с квадратичной сложностью внимания $\\mathcal{O}(N^2)$
При длине контекста $N = 128\\text{k}$ матрица $N \\times N$ требует терабайты памяти. Решения:
1. **FlashAttention (Dao et al., 2022-2024)**:
   * Не меняет математику внимания!
   * Проблема стандартного внимания — узкое горлышко памяти: матрицы $Q, K, V$ читаются из медленной памяти High Bandwidth Memory (HBM) в быстрый кэш SRAM GPU, вычисляется гигантская матрица $S = Q K^T$ ($N \\times N$), записывается обратно в HBM, затем снова читается для Softmax.
   * **FlashAttention использует Tiling (блочность) и Online Softmax**: вычисления ведутся кусочками прямо в сверхбыстром SRAM без материализации матрицы $N \\times N$ в HBM. Это дает ускорение в $2\\text{–}4\\times$ и снижение памяти с $\\mathcal{O}(N^2)$ до $\\mathcal{O}(N)$.
2. **Linformer**:
   * Проецирует матрицы $K$ и $V$ обучаемой линейной проекцией $E \\in \\mathbb{R}^{k \\times N}$ (где $k \\ll N$):
     $$\\tilde{K} = E K, \\quad \\tilde{V} = E V$$
   * Сложность внимания падает с $\\mathcal{O}(N^2)$ до строго линейной $\\mathcal{O}(N \\cdot k)$.
3. **Разреженное внимание (Longformer, BigBird)**:
   * Локальное скользящее окно (sliding window) размером $w$ для близких токенов + глобальные токены (CLS, знаки препинания), сложность $\\mathcal{O}(N \\cdot w)$.

---

### Pre-LayerNorm vs Post-LayerNorm: почему Pre-LN выиграл?
* **Post-LN (оригинальный Transformer 2017)**:
  $$x_{l+1} = \\text{LayerNorm}(x_l + \\text{SubLayer}(x_l))$$
  * При росте глубины дисперсия входа в LayerNorm растет, а градиенты, проходящие через остаточный поток, масштабируются коэффициентом $\\approx \\frac{1}{\\sqrt{L}}$. В глубоких сетях ($>20$ слоев) без длительного warm-up градиенты затухают в нижних слоях, вызывая расходимость обучения.
* **Pre-LN (LLaMA, GPT-3, PaLM, Mistral)**:
  $$x_{l+1} = x_l + \\text{SubLayer}(\\text{RMSNorm}(x_l))$$
  * Остаточный поток (Residual stream) формирует прямой сквозной канал без нелинейностей: $x_L = x_0 + \\sum_{l=0}^{L-1} \\text{SubLayer}(\\text{Norm}(x_l))$.
  * Производная $\\frac{\\partial x_L}{\\partial x_l} = I + \\dots$ гарантирует стабильный градиентный поток на любой глубине. Модели обучаются стабильно с первого же шага!

\`\`\`python
# В PyTorch 2.0+ FlashAttention встроен в ядро SDPA:
import torch.nn.functional as F

attn_out = F.scaled_dot_product_attention(
    query, key, value, 
    is_causal=True,       # Causal маска без аллокации N x N тензора
    dropout_p=0.1 if model.training else 0.0
)
\`\`\``,
    commonMistakes: [
      'Забывать масштабирующий коэффициент $\\sqrt{d_k}$ при ручной реализации внимания (градиенты моментально затухают из-за насыщения softmax).',
      'Путать Self-Attention и Cross-Attention: в Cross-Attention матрицы K и V приходят из внешнего источника (энкодера или текста кондиционирования).',
      'Вычислять полную матрицу внимания $O(N^2)$ вручную на современных GPU: идиоматично использовать `torch.nn.functional.scaled_dot_product_attention`, использующий FlashAttention с экономией памяти в разы.',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-tr-1',
        question: 'Зачем в формуле Scaled Dot-Product Attention скалярное произведение Q K^T делится на √d_k?',
        options: [
          'Чтобы предотвратить насыщение функции Softmax и затухание градиентов при больших размерностях d_k',
          'Чтобы перевести матрицу в целочисленный формат',
          'Чтобы уменьшить количество голов внимания',
          'Это требование алгоритма обратного распространения ошибки для одномерных тензоров',
        ],
        correctAnswer: 0,
        explanation: 'Без деления на √d_k дисперсия скалярного произведения растет пропорционально d_k, загоняя значения softmax в экстремумы, где производная практически равна нулю.',
      },
      {
        id: 'pt-cp-tr-cross',
        question: 'Откуда берутся матрицы Query, Key и Value в блоке Cross-Attention генеративной Seq2Seq модели?',
        options: [
          'Query берется из текущего состояния декодера, а Key и Value — из скрытых состояний энкодера',
          'Все три матрицы Query, Key и Value берутся строго из декодера',
          'Query и Key берутся из энкодера, а Value — из случайного шума',
          'Cross-Attention использует только матрицу Value без Query и Key',
        ],
        correctAnswer: 0,
        explanation: 'В Cross-Attention декодер формирует запросы (Query), чтобы найти релевантную информацию среди ключей (Key) и извлечь значения (Value) исходного контекста энкодера.',
      },
      {
        id: 'pt-cp-tr-preln',
        question: 'Почему в современных языковых моделях (LLaMA, GPT-3) архитектура Pre-LayerNorm вытеснила оригинальный Post-LayerNorm?',
        options: [
          'Pre-LN сохраняет чистый сквозной остаточный канал (residual highway), исключая затухание градиентов в сверхглубоких сетях',
          'Pre-LN в 10 раз уменьшает количество обучаемых параметров',
          'Pre-LN позволяет отказаться от матрицы весов Value',
          'Post-LN не поддерживается компилятором PyTorch 2.0',
        ],
        correctAnswer: 0,
        explanation: 'В Pre-LN нормализация вынесена внутрь блока перед вниманием/FFN, поэтому остаточная связь x_{l+1} = x_l + F(Norm(x_l)) обеспечивает чистую единичную производную по x_l на всей глубине сети.',
      },
    ],
  },
  {
    id: 'pt-9-llm',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Современные LLM: KV-Cache, методы PEFT (LoRA, QLoRA, Prefix Tuning) и архитектура RAG',
    order: 9,
    estimatedMinutes: 30,
    draft: false,
    theoryMarkdown: `### Архитектура современных больших языковых моделей (LLM)

Все современные открытые и проприетарные LLM (LLaMA 3, Mistral, Gemma, GPT-4) построены по парадигме **Autoregressive Decoder-Only**:
* Входной текст токенизируется (BPE / SentencePiece).
* Модель предсказывает распределение вероятностей следующего токена (Next Token Prediction):
$$\\mathcal{L} = -\\sum_{t=1}^T \\log P(x_t \\mid x_1, \\dots, x_{t-1})$$

---

### Механизм KV-Cache и Grouped-Query Attention (GQA)

Во время авторегрессионной генерации токенов по одному ($t = 1, 2, \\dots$), вычисление полного внимания ко всем прошлым токенам «в лоб» требует $O(N^2)$ вычислений, причем для прошлых токенов векторы $K$ и $V$ никогда не меняются!

**KV-кэширование (Key-Value Cache):**
На каждом шаге генерации нового токена:
1. Вычисляется $q_t, k_t, v_t$ **только для текущего одного токена** ($1 \\times d$).
2. Векторы $k_t$ и $v_t$ конкатенируются в сохраненный в памяти GPU кэш:
   $$K_{\\text{past}} \\leftarrow [K_{\\text{past}}, k_t], \\quad V_{\\text{past}} \\leftarrow [V_{\\text{past}}, v_t]$$
3. Внимание считается между текущим $q_t$ ($1 \\times d$) и накопленными $K_{\\text{past}}$ ($N \\times d$).
Сложность генерации одного токена падает с $O(N^2)$ до **$O(N)$**!

* **Grouped-Query Attention (GQA):** в длинных контекстах (32k-128k) размер KV-кэша в VRAM превышает размер самих весов. В GQA несколько голов Query делят одну общую голову Key и Value (например, 8 голов Q на 1 пару K/V), сокращая размер памяти кэша в **8 раз** практически без потери качества!

---

### Семейство методов PEFT (Parameter-Efficient Fine-Tuning)

Полное дообучение (Full Fine-Tuning) всех весов 70B модели требует терабайты VRAM для хранения состояний оптимизатора AdamW (16 байт на параметр: FP32 вес + 2 момента + градиенты).

#### 1. LoRA (Low-Rank Adaptation, Hu et al., 2021)
Базовая матрица весов $W_0 \\in \\mathbb{R}^{d \\times k}$ **замораживается**, обучаются две матрицы низкого ранга ($r \\ll d$):
$$W = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r} (B \\cdot A), \\quad B \\in \\mathbb{R}^{d \\times r}, \\quad A \\in \\mathbb{R}^{r \\times k}$$
* $A \\sim \\mathcal{N}(0, \\sigma^2)$, $B = 0$ в начале обучения (поэтому $\\Delta W = 0$ и модель изначально не сломана).
* Количество обучаемых параметров $< 0.1\\%$.
* При инференсе матрицы перемножаются и вливаются в веса ($W_{\\text{merged}} = W_0 + \\frac{\\alpha}{r} BA$) — нулевой overhead по времени!

#### 2. QLoRA (Dettmers et al., 2023)
Базовая модель квантуется в специальный 4-битный формат **NormalFloat4 (NF4)** с двойным квантованием (Double Quantization) констант масштаба и страничным распределением памяти оптимизатора (Paged Optimizers). LoRA-адаптеры обучаются поверх 4-битных весов в BF16. Это позволяет файн-тюнить 70B модель на одной потребительской GPU с 48GB VRAM!

#### 3. Prefix Tuning (Li & Liang, 2021)
Вместо изменения матриц линейных слоев, к ключам $K$ и значениям $V$ **каждого Transformer-блока** дописываются обучаемые непрерывные виртуальные префиксы $P_K, P_V \\in \\mathbb{R}^{l_{\\text{prefix}} \\times d_k}$:
$$\\tilde{K} = [P_K; X W_K], \\quad \\tilde{V} = [P_V; X W_V]$$
Все исходные веса сети строго заморожены. Модель направляет внимание на виртуальные префиксы, адаптируясь под специфические задачи (суммаризация, перевод).

#### 4. Prompt Tuning (Lester et al., 2021)
Упрощенный вариант Prefix Tuning: обучаемые «мягкие токены» (soft prompts) добавляются **только на уровне входных эмбеддингов** в начале текста.

---

### Архитектура RAG (Retrieval-Augmented Generation)

Файн-тюнинг учит модель *стилю речи и формату ответов*, но не предназначен для запоминания точных фактов (модель страдает от галлюцинаций).
**RAG (генерация с аугментацией извлечением)** — самый востребованный промышленный паттерн: модель отвечает на вопрос, опираясь на внешние релевантные фрагменты документов.

#### 6 этапов промышленного RAG-пайплайна:
1. **Парсинг и чанкинг (Chunking):** документы (PDF, HTML, базы знаний) разбиваются на небольшие фрагменты. Стандарт: RecursiveCharacterTextSplitter с размером чанка $500-1000$ символов/токенов и перекрытием (overlap) $10-20\\%$ для сохранения контекста на стыках.
2. **Dense Vector Embeddings:** каждый чанк пропускается через Embedding-модель (BGE, E5, text-embedding-3), превращаясь в плотный вектор размерности $D$ (например, 1024).
3. **Векторная БД (Vector DB):** чанки индексируются в специализированных базах (FAISS, Qdrant, Milvus, Chroma) с графовым алгоритмом приближенного поиска HNSW.
4. **Гибридный поиск (Hybrid Retrieval):**
   - **Dense-поиск:** улавливает семантический смысл и синонимы.
   - **Sparse-поиск (BM25):** находит точные вхождения терминов, номеров законов, фамилий и артикулов.
   - Результаты объединяются методом **Reciprocal Rank Fusion (RRF)**:
     $$RRF(d) = \\sum_{m \\in \\{\\text{Dense}, \\text{BM25}\\}} \\frac{1}{60 + \\text{rank}_m(d)}$$
5. **Cross-Encoder Reranker:** топ-20 найденных кандидатов пропускаются через специализированную модель-реранкер (Cohere Rerank, BGE-Reranker), которая оценивает релевантность пары (запрос, чанк) целиком и оставляет топ-3..5 лучших фрагментов.
6. **Augmented Prompt Synthesis:** отобранные чанки подставляются в системный промпт LLM:
   > *"Отвечай на вопрос строго на основе предоставленного контекста. Если ответа нет в контексте, скажи, что не знаешь. Приводи цитаты из источников."*`,
    commonMistakes: [
      'Попытка использовать файн-тюнинг вместо RAG для обновления базы знаний компании: модель продолжит галлюцинировать и не сможет ссылаться на первоисточники.',
      'Использование только плотного (Dense) векторного поиска в RAG: Dense-модели часто упускают точные номера документов, редкие аббревиатуры и коды ошибок, где необходим гибридный поиск с BM25.',
      'Игнорирование инициализации матриц LoRA: матрица B обязана инициализироваться строго нулями, иначе базовые предобученные веса разрушатся на первом же шаге.',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-llm-1',
        question: 'Почему в методе LoRA матрица B инициализируется строго нулями (B = 0)?',
        options: [
          'Чтобы в начале файн-тюнинга дельта весов ΔW = B * A была равна нулю, сохраняя исходное поведение предобученной модели',
          'Чтобы обнулить градиенты первого слоя',
          'Потому что PyTorch не поддерживает инициализацию случайными числами для матриц ранга r',
          'Чтобы ускорить перемножение матриц на GPU',
        ],
        correctAnswer: 0,
        explanation: 'Инициализация B нулями гарантирует, что ΔW = 0 при t = 0. Обучение адаптера начинается плавно из точки идеальных базовых весов модели.',
      },
      {
        id: 'pt-cp-llm-2',
        question: 'Какую главную задачу решает механизм KV-Cache при генерации текста в авторегрессионных LLM?',
        options: [
          'Кэширует вычисленные векторы Key и Value прошлых токенов, устраняя их повторное вычисление и снижая вычислительную сложность шага с O(N^2) до O(N)',
          'Автоматически переводит модель с английского языка на русский',
          'Сохраняет сгенерированный текст в файл на диск',
          'Служит для квантования модели в формат INT4',
        ],
        correctAnswer: 0,
        explanation: 'KV-Cache сохраняет проекции K и V уже обработанных токенов в памяти GPU. На каждом шаге генерируется только один новый вектор Q, обращающийся к кэшу.',
      },
      {
        id: 'pt-cp-llm-3',
        question: 'В чем ключевое отличие Prefix Tuning от классического LoRA?',
        options: [
          'Prefix Tuning добавляет обучаемые непрерывные префиксы к ключам и значениям в каждом слое внимания, а LoRA обучает декомпозицию низкого ранга для матриц весов',
          'Prefix Tuning квантует модель до 1 бита',
          'Prefix Tuning удаляет все полносвязные слои',
        ],
        correctAnswer: 0,
        explanation: 'В Prefix Tuning параметры базовых слоев вообще не затрагиваются — к тензорам Key и Value на каждом шаге внимания просто приписываются обучаемые виртуальные векторы.',
      },
      {
        id: 'pt-cp-rag-1',
        question: 'Зачем в современных RAG-системах применяют гибридный поиск (Hybrid Retrieval: Dense + BM25)?',
        options: [
          'Dense-поиск отлично улавливает семантику и синонимы, а BM25 гарантирует точный поиск по номерам, артикулам и редким терминам',
          'Чтобы сократить размер векторной базы данных в 2 раза',
          'Это техническое требование протокола HTTP',
        ],
        correctAnswer: 0,
        explanation: 'Векторные эмбеддинги (Dense) могут терять точные цифровые идентификаторы и специальные термины, поэтому объединение с лексическим поиском BM25 дает наивысшее качество поиска.',
      },
    ],
  },
  {
    id: 'pt-10-agent-frameworks',
    moduleId: 'pytorch-pandas-sklearn',
    title: 'Агентные фреймворки: LangChain (LCEL, Tools, ReAct) и LlamaIndex (Data Framework, Indexes, Router)',
    order: 10,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### От статичных промптов и RAG к автономным LLM-агентам

В то время как классический RAG отвечает на вопрос по заранее извлеченным чанкам за **один проход** (Single Turn), **LLM-агенты** решают многошаговые задачи. Агент самостоятельно определяет:
1. Хватает ли ему информации или нужно вызвать внешний инструмент (Tool).
2. Какой именно инструмент использовать (поиск в веб, SQL-запрос, вызов API, вычисление на Python).
3. Каковы аргументы вызова и как интерпретировать результат (Observation).
4. Нужно ли повторить шаг или задача решена.

---

### Парадигма ReAct (Reasoning + Acting, Yao et al., 2022)

Основа большинства агентных систем — цикл рассуждений и действий:
$$\\text{Prompt} \\to \\text{Thought (Мысль)} \\to \\text{Action (Имя инструмента)} \\to \\text{Action Input} \\to \\text{Observation (Ответ инструмента)} \\to \\dots \\to \\text{Final Answer}$$

LLM генерирует блок рассуждений, останавливается специальным стоп-токеном (Stop Token), среда исполнения выполняет функцию и возвращает текст наблюдения (Observation) обратно в контекст LLM.

---

### LangChain: оркестрация цепочек и инструментов

**LangChain** — модульный фреймворк для построения приложений на базе LLM.

#### 1. LangChain Expression Language (LCEL)
Современный стандарт LangChain строится вокруг протокола \`Runnable\` и оператора pipe (\`|\`):
\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template("Объясни понятие {topic} для ML-инженера за 2 предложения.")
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
output_parser = StrOutputParser()

# Чистая декларативная цепочка (LCEL)
chain = prompt | model | output_parser
response = chain.invoke({"topic": "KV-Cache"})
\`\`\`
Преимущества LCEL: встроенная поддержка асинхронности (\`ainvoke\`), потоковой передачи (\`stream\`), батчинга (\`batch\`) и интеграции с LangSmith для трейсинга.

#### 2. Инструменты (Tools) и Pydantic
Агенты обращаются к внешнему миру через строго типизированные функции:
\`\`\`python
from langchain_core.tools import tool
from pydantic import BaseModel, Field

class StockQueryInput(BaseModel):
    ticker: str = Field(description="Тикер акции компании, например AAPL или NVDA")
    days: int = Field(default=7, description="Количество последних дней")

@tool("get_stock_volatility", args_schema=StockQueryInput)
def get_stock_volatility(ticker: str, days: int) -> str:
    """Вычисляет историческую волатильность цены акции за указанный период."""
    # Логика обращения к финансовому API...
    return f"Волатильность {ticker} за {days} дней составила 2.4%"
\`\`\`

#### 3. Паттерны памяти (Memory)
- \`ConversationBufferMemory\`: сохраняет историю диалога целиком (риск переполнения контекста).
- \`ConversationSummaryMemory\`: периодически сжимает старую историю в краткую суммаризацию через сателлитную LLM.

---

### LlamaIndex: Data Framework для сложных данных и продвинутого RAG

Если LangChain фокусируется на широкой оркестрации сервисов и цепочек действий, то **LlamaIndex** специализируется на **глубокой структуризации, индексации и извлечении данных (Data-Centric Framework)**.

#### 1. Иерархия абстракций LlamaIndex
- **Document:** сырой контейнер данных (текст, метаданные, ID источника).
- **Node:** атомарный чанк документа с векторными представлениями и связями (\`NodeRelationship\`).
- **Index:** структура поверх узлов:
  - \`VectorStoreIndex\`: векторный индекс для семантического поиска.
  - \`SummaryIndex\` (бывший ListIndex): обход всех узлов для последовательной суммаризации книги или длинного отчета.
  - \`KnowledgeGraphIndex\`: граф знаний триплетов (субъект, предикат, объект).

#### 2. QueryEngine vs ChatEngine
\`\`\`python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# Загрузка и индексация
documents = SimpleDirectoryReader("./company_docs").load_data()
index = VectorStoreIndex.from_documents(documents)

# Одноразовый вопрос-ответ без сохранения диалога
query_engine = index.as_query_engine(similarity_top_k=5)
answer = query_engine.query("Каковы правила компенсации командировочных?")

# Диалоговый режим с автоматическим управлением контекстом
chat_engine = index.as_chat_engine(chat_mode="condense_plus_context")
response = chat_engine.chat("А что насчет суточных за границу?")
\`\`\`

#### 3. Маршрутизация (RouterQueryEngine)
Позволяет LLM выбирать подходящий движок под специфику запроса:
- Если пользователь спрашивает агрегированную аналитику (*"Сколько суммарно продаж было в третьем квартале?"*) $\to$ маршрутизатор отправляет запрос в **SQL-базу** (\`NLSQLTableQueryEngine\`).
- Если пользователь спрашивает смысл документа (*"Какие риски описаны в контракте?"*) $\to$ запрос направляется в **Векторный индекс** (\`VectorStoreIndex\`).

---

### Сравнительный анализ: LangChain vs LlamaIndex

| Критерий | LangChain | LlamaIndex |
| :--- | :--- | :--- |
| **Основной фокус** | Оркестрация агентов, вызовы внешних API, интеграция 100+ сервисов | Продвинутая работа с данными, сложные схемы RAG, индексация |
| **Сильная сторона** | Гибкость графов исполнения (LangGraph), ReAct-агенты, цепочки LCEL | Иерархические индексы, чанкинг, оценка качества извлечения (Evaluation) |
| **Идеальный сценарий** | Агент-помощник, пишущий код, отправляющий почту и запускающий тесты | Корпоративная база знаний со сложными PDF, таблицами и гибридным поиском |
| **Связка на практике** | LlamaIndex упаковывается как Tool (\`QueryEngineTool\`) внутри LangChain-агента |`,
    commonMistakes: [
      'Попытка использовать LangChain для простого RAG с нуля: LlamaIndex из коробки предоставляет более зрелые алгоритмы чанкинга, иерархических узлов (Parent-Document Retrieval) и оценки.',
      'Предоставление агенту деструктивных инструментов (SQL DELETE, отправка писем) без промежуточного подтверждения человеком (Human-in-the-Loop).',
      'Ручной парсинг JSON/строк из ответа LLM вместо использования типизированных Pydantic Output Parsers со строгой валидацией схемы.',
    ],
    checkpointQuiz: [
      {
        id: 'pt-cp-agent-1',
        question: 'Что представляет собой оператор pipe (|) в LangChain Expression Language (LCEL)?',
        options: [
          'Побитовое логическое ИЛИ для сравнения булевых масок тензоров PyTorch',
          'Синтаксический сахар для композиции компонентов Runnable (вход предыдущего передается на вход следующего)',
          'Оператор распределения весов модели на несколько GPU',
          'Команду остановки генерации токенов',
        ],
        correctAnswer: 1,
        explanation: 'В LCEL оператор `|` объединяет любые объекты, реализующие протокол Runnable (PromptTemplate, ChatModel, OutputParser, Retriever), в единый поток выполнения.',
      },
      {
        id: 'pt-cp-agent-2',
        question: 'В каком сценарии целесообразно использовать RouterQueryEngine в LlamaIndex?',
        options: [
          'Для ускорения квантования модели в формат INT4',
          'Для шифрования сообщений пользователя перед отправкой на сервер',
          'Когда система должна динамически выбирать источник ответа — например, SQL-базу для агрегаций или векторный индекс для текстовых регламентов',
          'Для распределения сетевых пакетов между роутерами в локальной сети',
        ],
        correctAnswer: 2,
        explanation: 'RouterQueryEngine с помощью селектора определяет тип входящего вопроса и направляет его в наиболее подходящий Query Engine (табличные данные в SQL, семантические документы в VectorIndex).',
      },
      {
        id: 'pt-cp-agent-3',
        question: 'Какова последовательность шагов в классическом цикле рассуждений ReAct (Reasoning + Acting)?',
        options: [
          'Thought (Мысль) -> Action (Действие/Вызов инструмента) -> Observation (Наблюдение/Результат) -> повторение шагов до Final Answer',
          'Action -> Optimization -> Gradient Descent -> Final Answer',
          'Prompt -> Compilation -> Quantization -> TensorRT',
          'Observation -> Tokenization -> Cross-Entropy -> Loss',
        ],
        correctAnswer: 0,
        explanation: 'В ReAct модель сначала формулирует мысль о том, что нужно сделать, затем генерирует вызов инструмента, получает результат из среды (Observation) и анализирует его на следующем шаге.',
      },
    ],
  },
];

export const pytorchPandasSklearnCards: Card[] = [
  {
    id: 'pt-card-1',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-1-tensors',
    type: 'flip',
    front: {
      ru: 'В чем разница между `.view()` и `.reshape()` в PyTorch?',
      en: 'What is the difference between `.view()` and `.reshape()` in PyTorch?',
    },
    back: {
      ru: '`.view()` требует непрерывного расположения тензора в памяти (contiguous) и возвращает представление без копирования. `.reshape()` работает с любыми тензорами: возвращает view, если это возможно, либо создает копию данных при фрагментации.',
      en: '`.view()` requires contiguous memory layout and returns a view without copying. `.reshape()` is versatile: it returns a view if possible, or clones memory if the tensor is fragmented.',
    },
    tags: ['pytorch', 'tensors'],
  },
  {
    id: 'pt-card-2',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-2-autograd',
    type: 'cloze',
    clozeText: {
      ru: 'Перед вычислением обратного прохода `loss.backward()` необходимо вызвать {{c1::optimizer.zero_grad()}}, чтобы сбросить накопленные градиенты.',
      en: 'Before executing backpropagation via `loss.backward()`, calling {{c1::optimizer.zero_grad()}} is required to clear accumulated gradient buffers.',
    },
    answer: {
      ru: 'optimizer.zero_grad()',
      en: 'optimizer.zero_grad()',
    },
    tags: ['pytorch', 'autograd'],
  },
  {
    id: 'pt-card-3',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-3-nn-module',
    type: 'flip',
    front: {
      ru: 'Почему в выходном слое для `nn.CrossEntropyLoss` нельзя применять `nn.Softmax()`?',
      en: 'Why should you NOT apply `nn.Softmax()` before `nn.CrossEntropyLoss` in PyTorch?',
    },
    back: {
      ru: 'Потому что `nn.CrossEntropyLoss` уже включает внутри себя численно стабильную комбинацию `nn.LogSoftmax()` и `nn.NLLLoss()`. Повторный Softmax исказит вероятности и градиенты.',
      en: 'Because `nn.CrossEntropyLoss` internally fuses `nn.LogSoftmax()` and `nn.NLLLoss()` for numerical stability. An external softmax corrupts gradient scale.',
    },
    tags: ['pytorch', 'loss'],
  },
  {
    id: 'pt-card-4',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-3-nn-module',
    type: 'cloze',
    clozeText: {
      ru: 'Для перевода модели в режим валидации (отключение Dropout и фиксация BatchNorm) вызывается метод {{c1::model.eval()}}.',
      en: 'To switch a model to inference mode (disabling Dropout and fixing BatchNorm statistics), call {{c1::model.eval()}}.',
    },
    answer: {
      ru: 'model.eval()',
      en: 'model.eval()',
    },
    tags: ['pytorch', 'evaluation'],
  },
  {
    id: 'pt-card-5',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-4-training-loop',
    type: 'flip',
    front: {
      ru: 'Зачем во время инференса оборачивать код в контекстный менеджер `with torch.no_grad():`?',
      en: 'Why wrap inference code in `with torch.no_grad():`?',
    },
    back: {
      ru: 'Он отключает отслеживание операций и построение вычислительного графа, что существенно ускоряет выполнение и снижает потребление памяти GPU.',
      en: 'It deactivates Autograd execution graph construction, reducing GPU memory footprint and speeding up forward passes.',
    },
    tags: ['pytorch', 'inference'],
  },
  {
    id: 'pt-card-6',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-4-training-loop',
    type: 'cloze',
    clozeText: {
      ru: 'В PyTorch кастомный датасет обязан реализовать методы `__len__` и {{c1::__getitem__}}.',
      en: 'In PyTorch, a custom Dataset subclass must implement `__len__` and {{c1::__getitem__}}.',
    },
    answer: {
      ru: '__getitem__',
      en: '__getitem__',
    },
    tags: ['pytorch', 'dataset'],
  },
  {
    id: 'pt-card-7',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-5-cnn',
    type: 'flip',
    front: {
      ru: 'Какова формула размера выхода 2D-свертки для стороны W с ядром K, отступом P и шагом S?',
      en: 'What is the 2D convolution output size formula for dimension W with kernel K, padding P, and stride S?',
    },
    back: {
      ru: 'W_out = ⌊(W - K + 2P) / S⌋ + 1. Например, при W=64, K=3, P=1, S=2 выход равен 32.',
      en: 'W_out = ⌊(W - K + 2P) / S⌋ + 1. For example, for W=64, K=3, P=1, S=2 the output is 32.',
    },
    tags: ['cnn', 'convolution'],
  },
  {
    id: 'pt-card-8',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-5-cnn',
    type: 'cloze',
    clozeText: {
      ru: 'В ResNet проброс тождественного входа {{c1::H(x) = F(x) + x}} создает прямой путь градиента без затухания благодаря слагаемому +1 в производной.',
      en: 'In ResNet, the identity skip connection {{c1::H(x) = F(x) + x}} prevents vanishing gradients due to the +1 term in the chain rule derivative.',
    },
    answer: {
      ru: 'H(x) = F(x) + x',
      en: 'H(x) = F(x) + x',
    },
    tags: ['resnet', 'skip-connection'],
  },
  {
    id: 'pt-card-9',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-6-rnn-lstm-gru',
    type: 'flip',
    front: {
      ru: 'Почему ячейка памяти (Cell State) в LSTM предотвращает затухание градиента по сравнению с ванильной RNN?',
      en: 'Why does the LSTM Cell State mitigate vanishing gradients compared to vanilla RNNs?',
    },
    back: {
      ru: 'Обновление Cell State C_t = f_t ⊙ C_{t-1} + i_t ⊙ C~_t аддитивно: градиент ∂C_t / ∂C_{t-1} равен f_t и не перемножается многократно на весовые матрицы W.',
      en: 'Cell state update is additive (C_t = f_t ⊙ C_{t-1} + i_t ⊙ C~_t), so ∂C_t / ∂C_{t-1} = f_t without repeated weight matrix exponentiation.',
    },
    tags: ['lstm', 'rnn', 'gradients'],
  },
  {
    id: 'pt-card-10',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-7-vae',
    type: 'cloze',
    clozeText: {
      ru: 'В Variational Autoencoder трюк с перепараметризацией выражает латентный вектор через дифференцируемое преобразование: {{c1::z = μ + σ ⊙ ε}}, где ε ~ N(0, I).',
      en: 'In a VAE, the reparameterization trick computes the latent code via {{c1::z = μ + σ ⊙ ε}}, where ε ~ N(0, I).',
    },
    answer: {
      ru: 'z = μ + σ ⊙ ε',
      en: 'z = μ + σ ⊙ ε',
    },
    tags: ['vae', 'reparameterization'],
  },
  {
    id: 'pt-card-11',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-8-transformers',
    type: 'flip',
    front: {
      ru: 'Какова формула Scaled Dot-Product Attention в трансформерах?',
      en: 'What is the formula for Scaled Dot-Product Attention?',
    },
    back: {
      ru: 'Attention(Q, K, V) = softmax((Q K^T) / √d_k) V. Деление на √d_k масштабирует дисперсию, защищая softmax от насыщения и затухания градиента.',
      en: 'Attention(Q, K, V) = softmax((Q K^T) / √d_k) V. The √d_k denominator stabilizes variance and prevents softmax saturation.',
    },
    tags: ['transformer', 'attention'],
  },
  {
    id: 'pt-card-12',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-8-transformers',
    type: 'cloze',
    clozeText: {
      ru: 'В современных архитектурах LLM вместо аддитивного позиционного эмбеддинга используется {{c1::RoPE (Rotary Position Embedding)}}, поворачивающий векторы запросов и ключей в комплексной плоскости.',
      en: 'In modern LLMs, additive position embeddings are replaced by {{c1::RoPE (Rotary Position Embedding)}}, rotating Query and Key vectors in complex space.',
    },
    answer: {
      ru: 'RoPE (Rotary Position Embedding)',
      en: 'RoPE (Rotary Position Embedding)',
    },
    tags: ['llm', 'rope', 'transformers'],
  },
  {
    id: 'pt-card-13',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-9-llm',
    type: 'flip',
    front: {
      ru: 'Как метод LoRA (Low-Rank Adaptation) снижает объем обучаемых параметров в LLM?',
      en: 'How does LoRA (Low-Rank Adaptation) reduce trainable parameters in LLMs?',
    },
    back: {
      ru: 'Веса W_0 замораживаются, а приращение представляется произведением двух матриц низкого ранга: ΔW = (α/r) * (B · A), где B ∈ ℝ^(d×r), A ∈ ℝ^(r×k), r ≪ d. Обучается <0.1% параметров.',
      en: 'Weights W_0 are frozen, while updates are parameterized as low-rank matrices ΔW = (α/r) * (B · A) with r ≪ d, training <0.1% of parameters.',
    },
    tags: ['lora', 'fine-tuning', 'llm'],
  },
  {
    id: 'pt-card-14',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-9-llm',
    type: 'cloze',
    clozeText: {
      ru: 'Механизм {{c1::KV-Cache}} в авторегрессионных LLM кэширует ключи и значения прошлых токенов, снижая вычислительную сложность каждого шага генерации с O(N²) до O(N).',
      en: 'The {{c1::KV-Cache}} in autoregressive LLMs caches past Key and Value activations, reducing per-token inference complexity from O(N²) to O(N).',
    },
    answer: {
      ru: 'KV-Cache',
      en: 'KV-Cache',
    },
    tags: ['llm', 'kv-cache', 'inference'],
  },
  {
    id: 'pt-card-15',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-9-llm',
    type: 'flip',
    front: {
      ru: 'В чем суть метода Prefix Tuning и чем он отличается от LoRA?',
      en: 'What is Prefix Tuning and how does it differ from LoRA?',
    },
    back: {
      ru: 'Prefix Tuning приписывает обучаемые виртуальные префиксы P_K и P_V к ключам и значениям каждого Transformer-блока, полностью замораживая все веса модели W. LoRA же обучает низкоранговые матрицы ΔW = B · A для проекций.',
      en: 'Prefix Tuning prepends trainable virtual vectors to Keys and Values in every attention layer while freezing all base weights W, whereas LoRA adapts weight matrices via low-rank decomposition.',
    },
    tags: ['peft', 'prefix-tuning', 'llm'],
  },
  {
    id: 'pt-card-16',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-9-llm',
    type: 'cloze',
    clozeText: {
      ru: 'Для объединения семантического векторного поиска (Dense) и точного ключевого поиска (BM25) в RAG применяется формула {{c1::Reciprocal Rank Fusion (RRF)}}.',
      en: 'To combine dense vector search with sparse keyword search (BM25) in RAG, {{c1::Reciprocal Rank Fusion (RRF)}} is commonly applied.',
    },
    answer: {
      ru: 'Reciprocal Rank Fusion (RRF)',
      en: 'Reciprocal Rank Fusion (RRF)',
    },
    tags: ['rag', 'retrieval', 'llm'],
  },
  {
    id: 'pt-card-18',
    moduleId: 'pytorch-pandas-sklearn',
    lessonId: 'pt-10-agent-frameworks',
    type: 'flip',
    front: {
      ru: 'В чем ключевое различие ролей между фреймворками LangChain и LlamaIndex?',
      en: 'What is the primary difference in architectural focus between LangChain and LlamaIndex?',
    },
    back: {
      ru: 'LangChain фокусируется на оркестрации разнородных инструментов, цепочек действий (LCEL) и циклических агентов (ReAct/LangGraph). LlamaIndex — это специализированный Data-Centric фреймворк для глубокого парсинга, индексации (Node/Index) и продвинутого RAG над сложными документами.',
      en: 'LangChain specializes in broad orchestration, tool execution, and cyclic agent graphs (ReAct/LangGraph). LlamaIndex is a data-centric framework built for hierarchical parsing, indexing, and advanced RAG over multi-format data.',
    },
    tags: ['langchain', 'llamaindex', 'agents', 'llm'],
  },
];

export const pytorchPandasSklearnQuiz: QuizQuestion[] = [
  {
    id: 'pt-q-1',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Какой вызов корректно переносит веса модели на доступную видеокарту?',
      en: 'Which call correctly transfers model parameters to an available GPU accelerator?',
    },
    options: [
      {
        ru: "model = model.to(torch.device('cuda' if torch.cuda.is_available() else 'cpu'))",
        en: "model = model.to(torch.device('cuda' if torch.cuda.is_available() else 'cpu'))",
      },
      { ru: 'model.set_device_gpu()', en: 'model.set_device_gpu()' },
      { ru: 'torch.send_to_cuda(model)', en: 'torch.send_to_cuda(model)' },
      { ru: 'model.compile(hardware="gpu")', en: 'model.compile(hardware="gpu")' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'В PyTorch метод `.to(device)` используется для перемещения параметров модели и тензоров на указанное устройство.',
      en: 'In PyTorch, `.to(device)` transfers weights and tensors to the specified device target.',
    },
    tag: 'pytorch',
  },
  {
    id: 'pt-q-2',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Что произойдет, если вызвать `y.backward()` для тензора, полученного внутри блока `with torch.no_grad():`?',
      en: 'What happens if you invoke `y.backward()` on a tensor computed inside `with torch.no_grad():`?',
    },
    options: [
      {
        ru: 'Вызов завершится ошибкой RuntimeError, так как граф вычислений не строился и градиенты отсутствуют',
        en: 'A RuntimeError is raised because Autograd did not build a computation DAG',
      },
      {
        ru: 'Градиенты посчитаются в два раза быстрее',
        en: 'Gradients compute twice as fast',
      },
      {
        ru: 'Градиенты будут заполнены нулями',
        en: 'Gradients are filled with zeros',
      },
      {
        ru: 'Тензор автоматически конвертируется в NumPy',
        en: 'The tensor converts automatically into a NumPy ndarray',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Внутри `torch.no_grad()` флаги градиентов отключены и граф вычислений не сохраняется, поэтому `.backward()` выбросит ошибку.',
      en: 'Tensors produced inside `torch.no_grad()` do not retain `grad_fn`, triggering a RuntimeError on `.backward()`.',
    },
    tag: 'autograd',
  },
  {
    id: 'pt-q-3',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Что делает параметр `weight_decay` в оптимизаторе `torch.optim.AdamW`?',
      en: 'What does the `weight_decay` parameter perform in `torch.optim.AdamW`?',
    },
    options: [
      {
        ru: 'Реализует L2-регуляризацию, штрафуя модель за большие веса напрямую при обновлении параметров',
        en: 'Implements decoupled weight decay, shrinking weights directly during parameter updates',
      },
      {
        ru: 'Уменьшает learning rate в конце каждой эпохи',
        en: 'Decays learning rate at the end of each epoch',
      },
      {
        ru: 'Обнуляет веса с нулевым градиентом',
        en: 'Zeros weights with null gradients',
      },
      {
        ru: 'Удаляет неиспользуемые слои нейросети',
        en: 'Prunes inactive network layers',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'В отличие от классического Adam, AdamW применяет weight decay непосредственно к весам, отделяя его от градиентных моментов (decoupled weight decay).',
      en: 'Unlike vanilla Adam L2 penalty, AdamW decouples weight decay from momentum and adaptive moments.',
    },
    tag: 'optimizers',
  },
  {
    id: 'pt-q-4',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Какова цель нормализации на √d_k в формуле внимания softmax((Q K^T) / √d_k) V?',
      en: 'What is the purpose of the √d_k scaling factor in dot-product attention?',
    },
    options: [
      {
        ru: 'Сохранить дисперсию скалярного произведения равной 1, предотвращая насыщение softmax и затухание градиента',
        en: 'Keep dot-product variance at 1, preventing softmax saturation and vanishing gradients',
      },
      {
        ru: 'Снизить размерность матрицы внимания с O(N^2) до O(N)',
        en: 'Reduce attention matrix complexity from O(N^2) to O(N)',
      },
      {
        ru: 'Обеспечить causal-маскирование токенов будущего',
        en: 'Enforce causal future token masking',
      },
      {
        ru: 'Уравнять количество голов внимания с размером батча',
        en: 'Match head count with batch size',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Сумма d_k произведений независимых случайных величин имеет дисперсию d_k. Деление на √d_k возвращает стандартное отклонение к 1, удерживая softmax в активной зоне градиентов.',
      en: 'The dot product has variance d_k; dividing by √d_k restores variance to 1, keeping softmax in a non-saturating gradient regime.',
    },
    tag: 'transformers',
  },
  {
    id: 'pt-q-5',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'В чем заключается Reparameterization Trick в Вариационных автоэнкодерах (VAE)?',
      en: 'What is the Reparameterization Trick in Variational Autoencoders (VAEs)?',
    },
    options: [
      {
        ru: 'Формулирование z = μ + σ ⊙ ε с независимым шумом ε ~ N(0, I), позволяющее вычислять градиенты Autograd сквозь параметры латентного распределения',
        en: 'Expressing z = μ + σ ⊙ ε with independent noise ε ~ N(0, I), enabling Autograd differentiation through distribution parameters',
      },
      {
        ru: 'Замена сверточных слоев энкодера на полносвязные слои',
        en: 'Replacing encoder convolutional layers with dense layers',
      },
      {
        ru: 'Использование квантования INT8 для латентного вектора z',
        en: 'Using INT8 quantization for latent representation z',
      },
      {
        ru: 'Отказ от декодера во время инференса',
        en: 'Discarding the decoder during inference',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Прямое сэмплирование z ~ N(μ, σ^2) недифференцируемо. Репараметризация переносит стохастичность в константный шум ε, сохраняя градиенты по μ и σ.',
      en: 'Direct sampling is non-differentiable; reparameterization routes randomness to an auxiliary variable ε, keeping gradients intact for μ and σ.',
    },
    tag: 'vae',
  },
  {
    id: 'pt-q-6',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Почему при использовании Grouped-Query Attention (GQA) в LLaMA 3 существенно снижается расход памяти GPU?',
      en: 'Why does Grouped-Query Attention (GQA) in LLaMA 3 dramatically decrease GPU memory usage?',
    },
    options: [
      {
        ru: 'Несколько голов запросов (Query) используют общие ключи (Key) и значения (Value), что сжимает размер сохраняемого KV-кэша в несколько раз',
        en: 'Multiple Query heads share a single Key and Value head, reducing the memory size of the KV-Cache by a factor of 4x to 8x',
      },
      {
        ru: 'GQA удаляет половину слоев нейросети',
        en: 'GQA removes half of the network layers',
      },
      {
        ru: 'GQA переводит веса модели в бинарный формат 1-bit',
        en: 'GQA converts weights to a 1-bit binary representation',
      },
      {
        ru: 'GQA отключает вычисление внимания для четных токенов',
        en: 'GQA disables attention computation for even tokens',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'В длинных контекстах KV-кэш занимает десятки гигабайт. В GQA группа голов Query обращается к одной общей паре K/V, сокращая кэш в 4-8 раз.',
      en: 'In long context windows, KV cache dominates VRAM. Grouping queries around shared K/V projections slashes cache footprint.',
    },
    tag: 'llm-gqa',
  },
  {
    id: 'pt-q-code-1',
    type: 'code_fill',
    difficulty: 'medium',
    question: {
      ru: 'Вставьте вызов для запуска обратного распространения ошибки и вычисления градиентов функции потерь:',
      en: 'Insert the call that initiates backpropagation and populates gradient buffers:',
    },
    codeSnippet: `for inputs, targets in dataloader:
    optimizer.zero_grad()
    outputs = model(inputs)
    loss = criterion(outputs, targets)
    ___
    optimizer.step()`,
    options: ['loss.backward()', 'loss.backward(retain_graph=True)', 'optimizer.backward()', 'torch.autograd.step(loss)'],
    correctAnswer: 0,
    explanation: {
      ru: 'loss.backward() вычисляет градиенты функции потерь по всем обучаемым параметрам модели с помощью Autograd.',
      en: 'loss.backward() computes gradients with respect to model graph leaves.',
    },
    tag: 'pytorch-loop',
    language: 'python',
  },
  {
    id: 'pt-q-code-2',
    type: 'code_fill',
    difficulty: 'medium',
    question: {
      ru: 'Заполните реализацию остаточного блока (ResNet Skip-Connection):',
      en: 'Complete the residual connection computation in a ResNet block:',
    },
    codeSnippet: `class ResBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn = nn.BatchNorm2d(channels)
        self.relu = nn.ReLU()

    def forward(self, x):
        identity = x
        out = self.relu(self.bn(self.conv(x)))
        out = ___  # Добавление skip-connection
        return self.relu(out)`,
    options: ['out + identity', 'out * identity', 'torch.cat([out, identity], dim=1)', 'self.conv(identity)'],
    correctAnswer: 0,
    explanation: {
      ru: 'В остаточном блоке ResNet выход свертки складывается с исходным входом (out + identity) перед финальной активацией.',
      en: 'The residual block sums the convolutional output and input identity (out + identity).',
    },
    tag: 'resnet-code',
    language: 'python',
  },
  {
    id: 'pt-q-code-3',
    type: 'code_fill',
    difficulty: 'hard',
    question: {
      ru: 'Заполните вычисление трюка с перепараметризацией в VAE (z = μ + σ ⊙ ε):',
      en: 'Complete the reparameterization trick computation in a VAE:',
    },
    codeSnippet: `def reparameterize(mu, logvar):
    std = torch.exp(0.5 * logvar)
    eps = torch.randn_like(std)
    return ___`,
    options: ['mu + eps * std', 'mu + eps', 'mu * std + eps', 'torch.normal(mu, std)'],
    correctAnswer: 0,
    explanation: {
      ru: 'Формула репараметризации: z = mu + eps * std, где std = exp(0.5 * logvar), а eps сэмплируется из N(0, I).',
      en: 'Reparameterization calculates z = mu + eps * std, preserving differentiability.',
    },
    tag: 'vae-code',
    language: 'python',
  },
  {
    id: 'pt-q-code-4',
    type: 'code_fill',
    difficulty: 'hard',
    question: {
      ru: 'Вставьте функцию PyTorch 2.0+ для ускоренного вычисления внимания через FlashAttention:',
      en: 'Insert the PyTorch 2.0+ function for accelerated attention with FlashAttention:',
    },
    codeSnippet: `import torch.nn.functional as F

# Q, K, V: [Batch, Heads, Seq_Len, Head_Dim]
out = F.___(query, key, value, is_causal=True)`,
    options: ['scaled_dot_product_attention', 'multi_head_attention_forward', 'dot_product_attention', 'flash_attention_2'],
    correctAnswer: 0,
    explanation: {
      ru: 'F.scaled_dot_product_attention — официальная высокооптимизированная реализация внимания в PyTorch 2+, использующая FlashAttention и fused kernels.',
      en: 'F.scaled_dot_product_attention is the PyTorch 2+ fused attention implementation leveraging FlashAttention.',
    },
    tag: 'flash-attention',
    language: 'python',
  },
  {
    id: 'pt-q-code-5',
    type: 'code_fill',
    difficulty: 'hard',
    question: {
      ru: 'Заполните прямое вычисление слоя LoRA (y = W_0 x + (alpha/r) * B(Ax)):',
      en: 'Complete the forward pass computation for a LoRA layer:',
    },
    codeSnippet: `class LoRALinear(nn.Module):
    def __init__(self, in_features, out_features, r=8, alpha=16):
        super().__init__()
        self.linear = nn.Linear(in_features, out_features) # W_0 (frozen)
        self.lora_A = nn.Linear(in_features, r, bias=False)
        self.lora_B = nn.Linear(r, out_features, bias=False)
        self.scaling = alpha / r

    def forward(self, x):
        base_out = self.linear(x)
        lora_out = self.lora_B(self.lora_A(x)) * self.scaling
        return ___`,
    options: ['base_out + lora_out', 'base_out * lora_out', 'lora_out', 'self.linear(lora_out)'],
    correctAnswer: 0,
    explanation: {
      ru: 'В LoRA выход равен сумме выхода базового замороженного слоя и масштабированного низкорангового адаптера: base_out + lora_out.',
      en: 'LoRA output is the sum of the frozen base layer output and the scaled adapter projection: base_out + lora_out.',
    },
    tag: 'lora-code',
    language: 'python',
  },
  {
    id: 'pt-q-rag-1',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Какую ключевую роль выполняет Cross-Encoder Reranker в конвейере RAG?',
      en: 'What critical role does a Cross-Encoder Reranker serve within a RAG pipeline?',
    },
    options: [
      {
        ru: 'Выполняет глубокую совместную оценку релевантности (запрос, документ), отбирая топ-3..5 наиболее точных чанков перед генерацией ответа LLM',
        en: 'Performs deep joint cross-attention scoring on (query, chunk) pairs to prune top candidates down to the best 3-5 snippets',
      },
      {
        ru: 'Квантует векторную базу данных до 4 бит',
        en: 'Quantizes the vector database down to 4-bit precision',
      },
      {
        ru: 'Переводит текст с одного языка на другой',
        en: 'Translates text between languages',
      },
      {
        ru: 'Разбивает PDF на страницы',
        en: 'Splits PDF files into pages',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Быстрый bi-encoder векторный поиск отбирает топ-20 кандидатов, а Cross-Encoder пропускает запрос и чанк вместе через слои внимания для максимальной точности ранжирования.',
      en: 'Bi-encoder retrieval fetches top-k fast candidates, while Cross-Encoders attend across query and document jointly for precision reranking.',
    },
    tag: 'rag-reranking',
  },
  {
    id: 'pt-q-agents-1',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Что происходит на этапе "Observation" в цикле ReAct автономного LLM-агента?',
      en: 'What takes place during the "Observation" step in an autonomous LLM agent ReAct loop?',
    },
    options: [
      {
        ru: 'LLM генерирует финальный ответ пользователю и завершает диалог',
        en: 'The LLM generates the final answer to the user and halts',
      },
      {
        ru: 'Происходит градиентный спуск по весам адаптера LoRA',
        en: 'Gradient descent step is performed across LoRA adapter weights',
      },
      {
        ru: 'Среда исполнения (Runtime) возвращает фактический результат работы вызванного инструмента (Tool) обратно в контекст LLM для осмысления на следующем шаге',
        en: 'The runtime environment injects the execution output of the chosen Tool back into the LLM context for subsequent reasoning',
      },
      {
        ru: 'Модель вычисляет значение Cross-Entropy Loss',
        en: 'The model computes Cross-Entropy Loss value',
      },
    ],
    correctAnswer: 2,
    explanation: {
      ru: 'В парадигме ReAct на этапе Action агент запрашивает вызов инструмента, внешняя среда исполняет функцию и передает вывод как "Observation", после чего LLM формулирует следующую мысль (Thought).',
      en: 'In ReAct, after an Action invocation, the runtime executes the tool and passes results as an "Observation", triggering the next LLM Thought.',
    },
    tag: 'agent-react-loop',
  },
];
