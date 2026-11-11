import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const combinatoricsMeta: ModuleMeta = {
  id: 'combinatorics',
  title: {
    ru: 'Комбинаторика и основы математики',
    en: 'Combinatorics & Math Foundations',
  },
  description: {
    ru: 'Комбинаторные правила, сочетания, размещения, бутстрэп и дискретная вероятность для ML и анализа данных.',
    en: 'Combinatorics, permutations, binomial theorem, bootstrap sampling, and discrete math for ML.',
  },
  order: 3,
  icon: 'combinatorics',
  estimatedMinutes: 35,
  isPlaceholder: false,
};

export const combinatoricsLessons: Lesson[] = [
  {
    id: 'comb-1-basics',
    moduleId: 'combinatorics',
    title: {
      ru: 'Правила суммы и произведения, перестановки и сочетания',
      en: 'Sum & Product Rules, Permutations and Combinations',
    },
    order: 1,
    estimatedMinutes: 12,
    draft: false,
    theoryMarkdown: {
      ru: `### Основы комбинаторики в Data Science

Комбинаторика лежит в основе теории вероятностей, методов сэмплирования, кросс-валидации и расчёта пространства гиперпараметров.

#### 1. Правило суммы и правило произведения
* **Правило суммы:** если объект $A$ можно выбрать $m$ способами, а объект $B$ — $n$ способами (причем выборы взаимоисключающие), то выбор «$A$ или $B$» возможен $m + n$ способами.
* **Правило произведения:** если выбор $A$ делается $m$ способами, а после каждого выбора объект $B$ можно выбрать $n$ способами, то пара «$A$ и $B$» выбирается $m \\cdot n$ способами.

#### 2. Перестановки (Permutations)
Число способов упорядочить $n$ различных элементов:
$$P_n = n! = n \\cdot (n-1) \\dots 1$$

Если среди $n$ элементов есть повторяющиеся (полиномиальная перестановка):
$$P_{n}(k_1, k_2, \\dots, k_m) = \\frac{n!}{k_1! \\cdot k_2! \\dots k_m!}$$

#### 3. Размещения (Arrangements / Variations)
Выбор $k$ элементов из $n$ **с учётом порядка**:
$$A_n^k = \\frac{n!}{(n - k)!} = n(n-1)\\dots(n-k+1)$$

#### 4. Сочетания (Combinations)
Выбор $k$ элементов из $n$ **без учёта порядка** (биномиальный коэффициент):
$$C_n^k = \\binom{n}{k} = \\frac{n!}{k!(n - k)!}$$

* Симметрия: $C_n^k = C_n^{n-k}$
* Формула Паскаля: $C_n^k = C_{n-1}^{k-1} + C_{n-1}^k$
* Сумма по всем подмножествам: $\\sum_{k=0}^n C_n^k = 2^n$

#### Бином Ньютона
$$(a + b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k$$`,
      en: `### Combinatorics Foundations in Data Science

Combinatorics underpins probability theory, sampling methods, cross-validation architectures, and hyperparameter search grids.

#### 1. Sum Rule and Product Rule
* **Sum Rule:** If an object $A$ can be chosen in $m$ ways and $B$ in $n$ ways (mutually exclusive choices), then choosing "$A$ or $B$" can be done in $m + n$ ways.
* **Product Rule:** If choosing $A$ can be done in $m$ ways and subsequent choice $B$ in $n$ ways, the ordered pair "$(A, B)$" can be chosen in $m \\cdot n$ ways.

#### 2. Permutations
The number of ways to arrange $n$ distinct elements in order:
$$P_n = n! = n \\cdot (n-1) \\dots 1$$

Permutations with repetitions (multinomial coefficients):
$$P_{n}(k_1, k_2, \\dots, k_m) = \\frac{n!}{k_1! \\cdot k_2! \\dots k_m!}$$

#### 3. Arrangements (Variations)
Selecting $k$ items from $n$ **where order matters**:
$$A_n^k = \\frac{n!}{(n - k)!} = n(n-1)\\dots(n-k+1)$$

#### 4. Combinations
Selecting $k$ items from $n$ **where order does NOT matter** (binomial coefficient):
$$C_n^k = \\binom{n}{k} = \\frac{n!}{k!(n - k)!}$$

* Symmetry: $C_n^k = C_n^{n-k}$
* Pascal Identity: $C_n^k = C_{n-1}^{k-1} + C_{n-1}^k$
* Powerset cardinality: $\\sum_{k=0}^n C_n^k = 2^n$

#### Binomial Theorem
$$(a + b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k$$`,
    },
    commonMistakes: [
      {
        ru: 'Путать сочетания $C_n^k$ (порядок не важен) и размещения $A_n^k$ (порядок важен).',
        en: 'Confusing combinations $C_n^k$ (order does not matter) with arrangements $A_n^k$ (order matters).',
      },
      {
        ru: 'Забывать факториал $0! = 1$ при вычислении $C_n^0$ или $C_n^n$.',
        en: 'Forgetting that $0! = 1$ when evaluating $C_n^0$ or $C_n^n$.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'comb-cp-1',
        question: {
          ru: 'Сколькими способами можно выбрать 2 признака из 10 для построения пары в scatter plot (порядок осей не важен)?',
          en: 'How many ways can 2 features be chosen from 10 for a pairwise scatter plot (axis order does not matter)?',
        },
        options: [
          { ru: '45', en: '45' },
          { ru: '90', en: '90' },
          { ru: '20', en: '20' },
          { ru: '100', en: '100' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Используем число сочетаний без учёта порядка: $C_{10}^2 = \\frac{10 \\cdot 9}{2} = 45$.',
          en: 'We calculate combinations without order: $C_{10}^2 = \\frac{10 \\times 9}{2} = 45$.',
        },
      },
      {
        id: 'comb-cp-2',
        question: {
          ru: 'Чему равно значение $0!$ (ноль факториал)?',
          en: 'What is the value of $0!$ (zero factorial)?',
        },
        options: [
          { ru: '1', en: '1' },
          { ru: '0', en: '0' },
          { ru: 'Не определено', en: 'Undefined' },
          { ru: 'Бесконечность', en: 'Infinity' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'По определению комбинаторики и гамма-функции $0! = 1$. Это обеспечивает корректность формул $C_n^0 = 1$ и $C_n^n = 1$.',
          en: 'By definition in combinatorics and the Gamma function $\\Gamma(1)=1$, $0! = 1$, ensuring consistency in $C_n^0=1$.',
        },
      },
    ],
  },
  {
    id: 'comb-2-sampling',
    moduleId: 'combinatorics',
    title: {
      ru: 'Комбинаторика в сэмплировании: Bootstrap и K-Fold',
      en: 'Combinatorics in Sampling: Bootstrap & K-Fold',
    },
    order: 2,
    estimatedMinutes: 12,
    draft: false,
    theoryMarkdown: {
      ru: `### Комбинаторные принципы в сэмплировании и валидации

#### 1. Бутстрэп (Bootstrap Aggregation / Bagging)
В бутстрэпе мы генерируем подвыборку размера $N$ из исходной выборки размера $N$ **с возвращением** (with replacement).

Какова вероятность того, что конкретный объект выборки **не попадет** в бутстрэп-выборку?
1. Вероятность не выбрать конкретный объект за один шаг: $1 - \\frac{1}{N}$.
2. За $N$ независимых выборов с возвращением вероятность равна:
$$P(\\text{не попал}) = \\left(1 - \\frac{1}{N}\\right)^N$$
3. При $N \\to \\infty$ этот предел равен экспоненте:
$$\\lim_{N \\to \\infty} \\left(1 - \\frac{1}{N}\\right)^N = e^{-1} \\approx 0.368 \\ (36.8\\%)$$

* Доля уникальных объектов, вошедших в бутстрэп-выборку: $1 - e^{-1} \\approx 63.2\\%$.
* Оставшиеся $\\approx 36.8\\%$ объектов называются **Out-of-Bag (OOB)** и могут использоваться для бесплатной валидации модели без кросс-валидации!

#### 2. K-Fold Cross-Validation
* Выборка разбивается на $K$ равных непересекающихся блоков.
* В стратифицированном K-fold (Stratified K-Fold) доли классов в каждом блоке сохраняются равными долям в генеральной совокупности, что критично при дисбалансе классов.`,
      en: `### Combinatorial Principles in Sampling and Validation

#### 1. Bootstrap (Bootstrap Aggregation / Bagging)
In bootstrapping, we generate a subset of size $N$ from an original dataset of size $N$ **with replacement**.

What is the probability that a specific observation is **omitted** from the bootstrap sample?
1. Probability of not choosing a specific sample in one draw: $1 - \\frac{1}{N}$.
2. Over $N$ independent draws with replacement:
$$P(\\text{omitted}) = \\left(1 - \\frac{1}{N}\\right)^N$$
3. In the asymptotic limit as $N \\to \\infty$:
$$\\lim_{N \\to \\infty} \\left(1 - \\frac{1}{N}\\right)^N = e^{-1} \\approx 0.368 \\ (36.8\\%)$$

* Expected percentage of unique samples included in a bootstrap sample: $1 - e^{-1} \\approx 63.2\\%$.
* The remaining $\\approx 36.8\\%$ of samples are called **Out-of-Bag (OOB)** and provide validation scoring without holding out a separate test fold!

#### 2. K-Fold Cross-Validation
* Dataset is partitioned into $K$ equal non-overlapping folds.
* In Stratified K-Fold, label distributions in each fold mirror the parent population, preventing train-validation distribution shifts.`,
    },
    commonMistakes: [
      {
        ru: 'Думать, что бутстрэп покрывает 100% данных — на самом деле лишь около 63.2%.',
        en: 'Assuming bootstrap samples cover 100% of unique data — in reality it is only $\\approx 63.2\\%$.',
      },
      {
        ru: 'Забывать, что OOB-оценка возможна только при сэмплировании с возвращением.',
        en: 'Forgetting that OOB evaluation requires sampling with replacement.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'comb-cp-3',
        question: {
          ru: 'Какая примерная доля объектов исходной выборки не попадает в бутстрэп-выборку при достаточно большом $N$?',
          en: 'What approximate percentage of original dataset samples are left out of a bootstrap draw for large $N$?',
        },
        options: [
          { ru: 'Примерно 36.8% (1/e)', en: 'Approximately 36.8% (1/e)' },
          { ru: 'Примерно 50%', en: 'Approximately 50%' },
          { ru: 'Примерно 10%', en: 'Approximately 10%' },
          { ru: '0% — попадают все', en: '0% — all are included' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Вероятность не выбрать объект за N шагов с возвращением стремится к $(1 - 1/N)^N \\to 1/e \\approx 0.368$ (36.8%).',
          en: 'Probability of omitting an element over $N$ draws converges to $(1 - 1/N)^N \\to 1/e \\approx 36.8\\%$.',
        },
      },
    ],
  },
  {
    id: 'comb-3-discrete-distr',
    moduleId: 'combinatorics',
    title: {
      ru: 'Дискретные распределения: Бернулли и Биномиальное',
      en: 'Discrete Distributions: Bernoulli and Binomial',
    },
    order: 3,
    estimatedMinutes: 11,
    draft: false,
    theoryMarkdown: {
      ru: `### Дискретные распределения и формула Бернулли

#### 1. Схема независимых испытаний Бернулли
Опыт имеет два исхода: «Успех» ($Y = 1$) с вероятностью $p$ и «Неуспех» ($Y = 0$) с вероятностью $q = 1 - p$.
* Математическое ожидание: $\\mathbb{E}[Y] = p$
* Дисперсия: $\\text{Var}(Y) = p(1 - p)$

#### 2. Биномиальное распределение $B(n, p)$
Вероятность получить ровно $k$ успехов в серии из $n$ независимых испытаний Бернулли:
$$P(X = k) = C_n^k p^k (1 - p)^{n - k} = \\binom{n}{k} p^k (1 - p)^{n - k}$$

* Математическое ожидание: $\\mathbb{E}[X] = n \\cdot p$
* Дисперсия: $\\text{Var}(X) = n \\cdot p(1 - p)$

#### 3. Полиномиальное распределение (Multinomial)
Обобщение биномиального на случай $m$ взаимоисключающих исходов с вероятностями $p_1, p_2, \\dots, p_m$, где $\\sum p_i = 1$:
$$P(k_1, k_2, \\dots, k_m) = \\frac{n!}{k_1! \\cdot k_2! \\dots k_m!} p_1^{k_1} p_2^{k_2} \\dots p_m^{k_m}$$
Именно полиномиальное распределение лежит в основе Cross-Entropy Loss для мультиклассовой классификации в глубоком обучении!`,
      en: `### Discrete Distributions and Bernoulli Trials

#### 1. Independent Bernoulli Trials
An experiment with two outcomes: "Success" ($Y = 1$) with probability $p$ and "Failure" ($Y = 0$) with probability $q = 1 - p$.
* Expectation: $\\mathbb{E}[Y] = p$
* Variance: $\\text{Var}(Y) = p(1 - p)$

#### 2. Binomial Distribution $B(n, p)$
The probability of observing exactly $k$ successes in $n$ independent Bernoulli trials:
$$P(X = k) = C_n^k p^k (1 - p)^{n - k} = \\binom{n}{k} p^k (1 - p)^{n - k}$$

* Expectation: $\\mathbb{E}[X] = n \\cdot p$
* Variance: $\\text{Var}(X) = n \\cdot p(1 - p)$

#### 3. Multinomial Distribution
Generalization to $m$ mutually exclusive outcomes with probabilities $p_1, p_2, \\dots, p_m$, where $\\sum p_i = 1$:
$$P(k_1, k_2, \\dots, k_m) = \\frac{n!}{k_1! \\cdot k_2! \\dots k_m!} p_1^{k_1} p_2^{k_2} \\dots p_m^{k_m}$$
The multinomial likelihood directly forms the foundation of categorical Cross-Entropy Loss in deep classification networks!`,
    },
    commonMistakes: [
      {
        ru: 'Забывать биномиальный коэффициент $C_n^k$ в формуле Бернулли, рассчитывая только $p^k (1-p)^{n-k}$.',
        en: 'Forgetting the binomial coefficient $C_n^k$ in the Bernoulli formula, evaluating only $p^k(1-p)^{n-k}$.',
      },
      {
        ru: 'Забывать, что максимальная дисперсия испытания Бернулли достигается при $p = 0.5$ и равна $0.25$.',
        en: 'Forgetting that Bernoulli variance peaks at $p = 0.5$ with value $0.25$.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'comb-cp-4',
        question: {
          ru: 'При каком значении вероятности $p$ дисперсия схемы Бернулли $\\text{Var}(Y) = p(1-p)$ максимальна?',
          en: 'At what probability value $p$ does Bernoulli variance $\\text{Var}(Y) = p(1-p)$ reach its maximum?',
        },
        options: [
          { ru: 'p = 0.5', en: 'p = 0.5' },
          { ru: 'p = 1.0', en: 'p = 1.0' },
          { ru: 'p = 0.0', en: 'p = 0.0' },
          { ru: 'p = 0.75', en: 'p = 0.75' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Функция $f(p) = p - p^2$ имеет вершину параболы в точке $p = 0.5$, где дисперсия достигает максимума $0.25$.',
          en: 'The parabola $f(p) = p - p^2$ reaches its peak at $p = 0.5$, yielding maximum variance $0.25$.',
        },
      },
    ],
  },
];

export const combinatoricsCards: Card[] = [
  {
    id: 'comb-card-1',
    moduleId: 'combinatorics',
    lessonId: 'comb-1-basics',
    type: 'flip',
    front: {
      ru: 'Чем принципиально отличаются сочетания $C_n^k$ от размещений $A_n^k$?',
      en: 'What is the fundamental difference between combinations $C_n^k$ and arrangements $A_n^k$?',
    },
    back: {
      ru: 'В **размещениях** $A_n^k$ порядок выбранных элементов важен ($A_n^k = \\frac{n!}{(n-k)!}$), а в **сочетаниях** $C_n^k$ порядок не имеет значения ($C_n^k = \\frac{n!}{k!(n-k)!}$).',
      en: 'In **arrangements** $A_n^k$, order matters ($A_n^k = \\frac{n!}{(n-k)!}$), while in **combinations** $C_n^k$, order does not matter ($C_n^k = \\frac{n!}{k!(n-k)!}$).',
    },
    tags: ['combinatorics', 'formulas'],
  },
  {
    id: 'comb-card-2',
    moduleId: 'combinatorics',
    lessonId: 'comb-2-sampling',
    type: 'cloze',
    clozeText: {
      ru: 'В сэмплировании бутстрэпа с возвращением доля объектов, не вошедших в подвыборку (OOB), стремится к {{c1::36.8%}} ($1/e$).',
      en: 'In bootstrap sampling with replacement, the expected proportion of out-of-bag (OOB) samples approaches {{c1::36.8%}} ($1/e$).',
    },
    answer: {
      ru: '36.8%',
      en: '36.8%',
    },
    tags: ['bootstrap', 'sampling'],
  },
  {
    id: 'comb-card-3',
    moduleId: 'combinatorics',
    lessonId: 'comb-3-discrete-distr',
    type: 'cloze',
    clozeText: {
      ru: 'Математическое ожидание биномиального распределения с $n$ испытаниями и вероятностью успеха $p$ равно {{c1::n * p}}.',
      en: 'The expected value of a binomial distribution with $n$ trials and success probability $p$ is {{c1::n * p}}.',
    },
    answer: {
      ru: 'n * p',
      en: 'n * p',
    },
    tags: ['probability', 'binomial'],
  },
  {
    id: 'comb-card-4',
    moduleId: 'combinatorics',
    lessonId: 'comb-1-basics',
    type: 'flip',
    front: {
      ru: 'Чему равна сумма всех биномиальных коэффициентов $\\sum_{k=0}^n C_n^k$?',
      en: 'What is the sum of all binomial coefficients $\\sum_{k=0}^n C_n^k$?',
    },
    back: {
      ru: 'Сумма равна $2^n$ (общее число всех возможных подмножеств множества из $n$ элементов).',
      en: 'The sum equals $2^n$ (the cardinality of the powerset of an $n$-element set).',
    },
    tags: ['combinatorics', 'sets'],
  },
  {
    id: 'comb-card-5',
    moduleId: 'combinatorics',
    lessonId: 'comb-2-sampling',
    type: 'flip',
    front: {
      ru: 'Что такое Out-of-Bag (OOB) ошибка в Random Forest?',
      en: 'What is Out-of-Bag (OOB) error in Random Forest?',
    },
    back: {
      ru: 'Это оценка качества ансамбля на объектах, которые не попали в бутстрэп-обучающую выборку конкретного дерева (примерно 37% данных для каждого дерева).',
      en: 'It is the validation error evaluated on samples that were left out of each individual tree bootstrap sample (~37% per tree).',
    },
    tags: ['random-forest', 'oob'],
  },
];

export const combinatoricsQuiz: QuizQuestion[] = [
  {
    id: 'comb-q-1',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Сколькими способами можно переставить 4 различных гиперпараметра в пайплайне?',
      en: 'How many ways can 4 distinct hyperparameters be ordered in a pipeline?',
    },
    options: [
      { ru: '24', en: '24' },
      { ru: '16', en: '16' },
      { ru: '12', en: '12' },
      { ru: '4', en: '4' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Число перестановок без повторений $P_4 = 4! = 4 \\cdot 3 \\cdot 2 \\cdot 1 = 24$.',
      en: 'Permutations without repetition: $P_4 = 4! = 24$.',
    },
    tag: 'combinatorics',
  },
  {
    id: 'comb-q-2',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Почему бутстрэп-выборка содержит в среднем лишь около 63.2% уникальных объектов исходного датасета?',
      en: 'Why does a bootstrap sample contain only about 63.2% of unique original dataset objects on average?',
    },
    options: [
      {
        ru: 'Потому что вероятность не выбрать элемент за $N$ шагов с возвращением равна $(1 - 1/N)^N \\to 1/e \\approx 0.368$',
        en: 'Because the probability of not selecting an item over $N$ draws with replacement converges to $(1 - 1/N)^N \\to 1/e \\approx 0.368$',
      },
      {
        ru: 'Потому что генератор псевдослучайных чисел отсекает крайние квантили',
        en: 'Because pseudorandom generators truncate extreme quantiles',
      },
      {
        ru: 'Это эмпирическое правило для нормального распределения',
        en: 'It is an empirical rule specific to Gaussian distributions',
      },
      {
        ru: 'Из-за округления размера батча',
        en: 'Due to batch size rounding',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Вероятность объекта ни разу не быть выбранным за $N$ независимых испытаний с возвращением равна $(1 - 1/N)^N \\to 1/e \\approx 36.8\\%$. Доля вошедших: $1 - 1/e \\approx 63.2\\%$.',
      en: 'The probability of an item being omitted over $N$ draws with replacement approaches $1/e \\approx 36.8\\%$. The included proportion is $1 - 1/e \\approx 63.2\\%$.',
    },
    tag: 'bootstrap',
  },
  {
    id: 'comb-q-3',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Чему равна дисперсия случайной величины $X$, распределенной по закону Бернулли с параметром $p = 0.2$?',
      en: 'What is the variance of a Bernoulli random variable $X$ with success probability $p = 0.2$?',
    },
    options: [
      { ru: '0.16', en: '0.16' },
      { ru: '0.20', en: '0.20' },
      { ru: '0.04', en: '0.04' },
      { ru: '0.80', en: '0.80' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Дисперсия распределения Бернулли: $\\text{Var}(X) = p(1 - p) = 0.2 \\cdot 0.8 = 0.16$.',
      en: 'Variance of a Bernoulli variable is $\\text{Var}(X) = p(1 - p) = 0.2 \\times 0.8 = 0.16$.',
    },
    tag: 'probability',
  },
];
