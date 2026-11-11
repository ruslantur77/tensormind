import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const reinforcementLearningMeta: ModuleMeta = {
  id: 'reinforcement-learning',
  title: {
    ru: 'Обучение с подкреплением: от MDP до PPO, RLHF и GRPO (DeepSeek R1)',
    en: 'Reinforcement Learning: from MDP to PPO, RLHF & GRPO (DeepSeek R1)',
  },
  description: {
    ru: 'Фундаментальный и современный RL: марковские процессы (MDP), уравнения Беллмана, Deep Q-Networks (DQN), Policy Gradient (REINFORCE), Actor-Critic и PPO. Передовой RL для LLM: классический пайплайн RLHF, DPO и алгоритм GRPO (Group Relative Policy Optimization) из DeepSeek-R1 без критика, а также прикладные задачи в рекомендациях и робототехнике.',
    en: 'Foundational & modern RL: Markov Decision Processes (MDP), Bellman equations, Deep Q-Networks (DQN), Policy Gradients (REINFORCE), Actor-Critic, and PPO. Frontier LLM RL: RLHF, DPO, and DeepSeek-R1 Group Relative Policy Optimization (GRPO) without a critic model, plus RecSys and robotics.',
  },
  order: 21,
  icon: 'reinforcement-learning',
  estimatedMinutes: 105,
  isPlaceholder: false,
};

export const reinforcementLearningLessons: Lesson[] = [
  {
    id: 'rl-1-mdp-bellman-foundations',
    moduleId: 'reinforcement-learning',
    title: {
      ru: 'Основы RL: Марковские процессы (MDP), функции ценности и уравнения Беллмана',
      en: 'RL Foundations: Markov Decision Processes (MDP), Value Functions & Bellman Equations',
    },
    order: 1,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Парадигма обучения с подкреплением (Reinforcement Learning)

В отличие от Supervised Learning (где дана разметка $y$) и Unsupervised Learning (поиск скрытых структур), в **Reinforcement Learning (RL)** автономный **Агент (Agent)** взаимодействует со **Средой (Environment)** методом проб и ошибок:
1. Агент наблюдает текущее состояние среды $s_t \\in \\mathcal{S}$.
2. Выбирает действие $a_t \\in \\mathcal{A}$ в соответствии со своей стратегией $\\pi(a_t \\mid s_t)$.
3. Среда переходит в новое состояние $s_{t+1}$ и возвращает скалярную **награду (Reward)** $r_{t+1} \\in \\mathbb{R}$.

Цель агента — максимизировать не сиюминутную награду, а **накопленный дисконтированный доход (Cumulative Discounted Return)**:
$$G_t = \\sum_{k=0}^\\infty \\gamma^k R_{t+k+1} = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\dots$$
где $\\gamma \\in [0, 1)$ — **фактор дисконтирования (Discount Factor)**. При $\\gamma \\to 0$ агент близорук (думает только о ближайшем шаге), при $\\gamma \\to 1$ агент дальновиден (готов пожертвовать текущей наградой ради стратегического выигрыша в конце эпизода).

---

### Марковский процесс принятия решений (MDP)

Формальным математическим фундаментом RL является **Markov Decision Process (MDP)**, задаваемый кортежем:
$$\\langle \\mathcal{S}, \\; \\mathcal{A}, \\; \\mathcal{P}, \\; \\mathcal{R}, \\; \\gamma \\rangle$$

- $\\mathcal{S}$ — пространство состояний (State Space).
- $\\mathcal{A}$ — пространство действий (Action Space: дискретное или непрерывное).
- $\\mathcal{P}(s' \\mid s, a)$ — матрица вероятностей перехода (Transition Dynamics):
  $$P(S_{t+1} = s' \\mid S_t = s, A_t = a)$$
- $\\mathcal{R}(s, a)$ — функция математического ожидания награды: $\\mathbb{E}[R_{t+1} \\mid S_t = s, A_t = a]$.
- $\\gamma$ — коэффициент дисконтирования.

#### Марковское свойство (Markov Property)
> Будущее состояние зависит **исключительно от текущего состояния и действия**, и никак не зависит от всей предыстории прошлых шагов:
> $$P(S_{t+1} = s' \\mid S_t = s_t, A_t = a_t, S_{t-1} = s_{t-1}, \\dots, S_0 = s_0) = P(S_{t+1} = s' \\mid S_t = s_t, A_t = a_t)$$

---

### Функции ценности: $V(s)$ и $Q(s, a)$

1. **State-Value Function $V^\\pi(s)$ (Ценность состояния):**
   Ожидаемый суммарный дисконтированный доход, если агент стартует из состояния $s$ и далее следует стратегии $\\pi$:
   $$V^\\pi(s) = \\mathbb{E}_\\pi [G_t \\mid S_t = s]$$

2. **Action-Value Function $Q^\\pi(s, a)$ (Q-функция / Ценность действия):**
   Ожидаемый доход, если агент в состоянии $s$ совершает действие $a$, а затем следует стратегии $\\pi$:
   $$Q^\\pi(s, a) = \\mathbb{E}_\\pi [G_t \\mid S_t = s, A_t = a]$$

Связь между функциями: $V^\\pi(s) = \\sum_{a \\in \\mathcal{A}} \\pi(a \\mid s) Q^\\pi(s, a)$.

---

### Уравнения Беллмана (Bellman Equations)

Ключевая идея Ричарда Беллмана (1957) — рекурсивное разложение ценности на немедленную награду и дисконтированную ценность следующего состояния:

#### 1. Уравнение Беллмана для оценки (Bellman Expectation Equation):
$$V^\\pi(s) = \\sum_{a} \\pi(a \\mid s) \\left[ \\mathcal{R}(s, a) + \\gamma \\sum_{s'} \\mathcal{P}(s' \\mid s, a) V^\\pi(s') \\right]$$
$$Q^\\pi(s, a) = \\mathcal{R}(s, a) + \\gamma \\sum_{s'} \\mathcal{P}(s' \\mid s, a) \\sum_{a'} \\pi(a' \\mid s') Q^\\pi(s', a')$$

#### 2. Уравнение Беллмана для оптимальности (Bellman Optimality Equation):
Для оптимальной стратегии $\\pi^*$ ценность состояния равна максимальному действию:
$$V^*(s) = \\max_{a \\in \\mathcal{A}} Q^*(s, a)$$
$$Q^*(s, a) = \\mathcal{R}(s, a) + \\gamma \\sum_{s'} \\mathcal{P}(s' \\mid s, a) \\max_{a' \\in \\mathcal{A}} Q^*(s', a')$$
Это нелинейное уравнение лежит в основе алгоритмов динамического программирования (Value Iteration, Policy Iteration) и Q-Learning!

---

### Дилемма Exploration vs. Exploitation

Агент сталкивается с классическим конфликтом:
- **Exploitation (Использование):** выбирать действие с наивысшим известным на данный момент $Q(s, a)$, собирая гарантированную награду.
- **Exploration (Исследование):** пробовать неизвестные или субоптимальные действия в надежде найти еще более высокую награду, скрытую за горизонтом.

#### Базовые стратегии исследования:
1. **$\\epsilon$-Greedy:** с вероятностью $1 - \\epsilon$ выбирается $\\arg\\max_a Q(s, a)$, а с вероятностью $\\epsilon$ — случайное действие. Обычно $\\epsilon$ экспоненциально спадает во времени ($\\epsilon$-decay).
2. **Upper Confidence Bound (UCB):** выбор действия с учетом неопределенности: $a_t = \\arg\\max_a \\left[ Q(s, a) + c \\sqrt{\\frac{\\ln t}{N(s, a)}} \\right]$.
3. **Энтропийный бонус (Entropy Regularization):** добавление энтропии стратегии $\\mathcal{H}(\\pi(\\cdot \\mid s))$ в функцию потерь для предотвращения преждевременного вырождения стратегии в детерминированную.`,
    commonMistakes: [
      'Установка коэффициента дисконтирования gamma = 1 в бесконечных непрерывных задачах: накопленный доход расходится в бесконечность, делая функции ценности математически неопределенными.',
      'Нарушение марковского свойства: попытка подать в модель одиночный кадр Atari вместо стека из 4 последних кадров (по одной картинке невозможно определить скорость и вектор движения мяча).',
      'Отказ от Exploration (чистый greedy e=0 с самого начала): агент застревает в первом случайно найденном локальном минимуме и никогда не открывает оптимальную траекторию.',
    ],
    checkpointQuiz: [
      {
        id: 'rl-cp-1-1',
        question: 'Что формально означает марковское свойство среды в MDP?',
        options: [
          'Награда агента всегда неотрицательна',
          'Распределение вероятностей перехода в следующее состояние s(t+1) зависит исключительно от текущего состояния s(t) и действия a(t), но не от предшествующей истории',
          'Все состояния среды обязаны быть непрерывными векторами',
          'Агент обязан исследовать 100% пространства состояний',
        ],
        correctAnswer: 1,
        explanation: 'Марковское свойство («будущее не зависит от прошлого при известном настоящем») позволяет описывать динамику переходов одним шагом без сохранения полной предыстории.',
      },
      {
        id: 'rl-cp-1-2',
        question: 'Какую зависимость выражает уравнение Беллмана для оптимальной Q-функции Q*(s, a)?',
        options: [
          'Ценность Q*(s, a) равна сумме немедленной награды R(s, a) и дисконтированного максимума ценности следующего действия gamma * max_a Q*(s\', a\')',
          'Ценность равна среднему арифметическому всех наград за прошлый год',
          'Q*(s, a) всегда строго равна нулю',
          'Она связывает размер батча со скоростью обучения оптимизатора Adam',
        ],
        correctAnswer: 0,
        explanation: 'Уравнение Беллмана рекурсивно связывает текущую пару (состояние, действие) с ожидаемой немедленной наградой и максимальной ценностью действий из следующего состояния s\'.',
      },
      {
        id: 'rl-cp-1-3',
        question: 'Зачем в алгоритмах обучения с подкреплением используют энтропийную регуляризацию (Entropy Bonus)?',
        options: [
          'Чтобы уменьшить размер нейросети в 4 раза',
          'Чтобы полностью запретить агенту совершать случайные действия',
          'Чтобы поощрять исследование (Exploration) и предотвратить преждевременный коллапс стохастической стратегии в преждевременный локальный детерминизм',
          'Для ускорения чтения файлов из оперативной памяти',
        ],
        correctAnswer: 2,
        explanation: 'Энтропийный штраф штрафует стратегию за излишнюю самоуверенность на ранних стадиях, стимулируя агента пробовать альтернативные действия.',
      },
    ],
  },
  {
    id: 'rl-2-qlearning-dqn-policy-gradient',
    moduleId: 'reinforcement-learning',
    title: {
      ru: 'Классические алгоритмы: Q-Learning, Deep Q-Network (DQN) и Policy Gradient (REINFORCE)',
      en: 'Foundational Algorithms: Q-Learning, Deep Q-Network (DQN) & Policy Gradients (REINFORCE)',
    },
    order: 2,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Табличный алгоритм Q-Learning (Watkins, 1989)

Q-Learning — это **Model-Free** (не требует знания динамики переходов $\\mathcal{P}$) и **Off-Policy** алгоритм, основанный на временных разностях (**Temporal Difference, TD**).

На каждом шаге агент совершает переход $(S_t, A_t, R_{t+1}, S_{t+1})$ и обновляет оценку:
$$Q(S_t, A_t) \\leftarrow Q(S_t, A_t) + \\alpha \\Big[ \\underbrace{R_{t+1} + \\gamma \\max_{a} Q(S_{t+1}, a)}_{\\text{TD-Target}} - Q(S_t, A_t) \\Big]$$
Разность в квадратных скобках называется **TD-Error ($\\delta_t$)**.
- *Off-Policy природа:* агент может собирать опыт по исследовательской $\\epsilon$-greedy стратегии, но целевой TD-таргет обновляется строго по жадному максимуму $\\max_a Q$, оценивая оптимальную стратегию $\\pi^*$.

---

### Революция глубокого RL: Deep Q-Network (DQN, Mnih et al., 2015)

Когда пространство состояний $\\mathcal{S}$ непрерывно или огромно (например, пиксели экрана $84 \\times 84$), таблица $Q$ не помещается в память. Модель аппроксимируется глубокой нейросетью:
$$Q(s, a; \\theta) \\approx Q^*(s, a)$$

#### Почему наивное объединение Q-learning с нейросетями расходилось:
1. **Коррелированность данных:** последовательные кадры $s_t, s_{t+1}, s_{t+2}$ почти идентичны, нарушая предположение о независимости сэмплов (i.i.d.).
2. **Нестабильная цель (Moving Target Problem):** при обновлении весов $\\theta$ меняется не только предсказание $Q(s_t, a_t; \\theta)$, но и сам целевой таргет $R + \\gamma \\max Q(s', a'; \\theta)$. Сеть «гоняется за собственным хвостом».

#### 2 фундаментальных прорыва DQN от DeepMind:
1. **Буфер воспроизведения опыта (Experience Replay Buffer $\\mathcal{D}$):**
   Агент сохраняет переходы $(s_t, a_t, r_{t+1}, s_{t+1}, d_{t+1})$ в кольцевой буфер (например, на 1 млн шагов). Обучение оптимизатором идет по **случайным батчам** из буфера, декоррелируя данные.
2. **Целевая сеть (Target Network $\\theta^-$):**
   Для вычисления TD-таргета используется отдельная замороженная копия сети:
   $$\\mathcal{L}(\\theta) = \\mathbb{E}_{(s, a, r, s')} \\left[ \\Big( r + \\gamma \\max_{a'} Q(s', a'; \\theta^-) - Q(s, a; \\theta) \\Big)^2 \\right]$$
   Веса $\\theta^-$ обновляются редко (раз в 10 000 шагов) или через мягкое усреднение Polyak ($\\theta^- \\leftarrow \\tau \\theta + (1-\\tau)\\theta^-$).

#### Расширения DQN:
- **Double DQN (DDQN):** разделяет выбор действия через основную сеть и оценку через Target-сеть, устраняя систематическую переоценку (Overestimation Bias) Q-значений:
  $$Y_{\\text{DoubleQ}} = r + \\gamma Q(s', \\; \\arg\\max_a Q(s', a; \\theta); \\; \\theta^-)$$
- **Dueling DQN:** архитектура сети разделяется на два потока: поток ценности состояния $V(s)$ и поток преимуществ действий $A(s, a)$, объединяемых как $Q(s, a) = V(s) + (A(s, a) - \\frac{1}{|\\mathcal{A}|}\\sum A(s, a'))$.

---

### Семейство Policy Gradient и алгоритм REINFORCE

Вместо косвенного обучения $Q$-значений методы градиента стратегии параметризуют **саму политику напрямую**: $\\pi_\\theta(a \\mid s) = P(A_t = a \\mid S_t = s; \\theta)$.

#### Преимущества Policy Gradient:
- Естественная работа с непрерывными пространствами действий (например, угол поворота руля или крутящий момент мотора робота).
- Возможность выучивать истинно стохастические оптимальные стратегии (например, в игре «Камень, ножницы, бумага»).

#### Теорема о градиенте стратегии (Policy Gradient Theorem, Sutton et al.):
$$\\nabla_\\theta J(\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta} \\left[ \\sum_{t=0}^T \\nabla_\\theta \\ln \\pi_\\theta(a_t \\mid s_t) \\cdot G_t \\right]$$

#### Алгоритм REINFORCE (Monte Carlo Policy Gradient):
1. Сэмплируется полный эпизод $\\tau = (s_0, a_0, r_1, \\dots, s_T)$ под текущей стратегией $\\pi_\\theta$.
2. Для каждого шага $t$ вычисляется эмпирический накопленный доход $G_t = \\sum_{k=t}^T \\gamma^{k-t} r_{k+1}$.
3. Шаг градиентного подъема:
   $$\\theta \\leftarrow \\theta + \\alpha \\sum_{t=0}^T \\nabla_\\theta \\ln \\pi_\\theta(a_t \\mid s_t) \\cdot (G_t - b(s_t))$$

*Роль базовой линии (Baseline $b(s_t)$):*
Служит для уменьшения огромной дисперсии метода Монте-Карло. Если вычесть из дохода оценку среднего состояния $V(s_t)$, математическое ожидание градиента **строго не изменится**, а дисперсия шагов упадет на порядки!`,
    commonMistakes: [
      'Попытка использовать DQN в задачах с непрерывным пространством действий (Continuous Actions): операция max_a Q(s, a) требует решения сложной нелинейной оптимизации на каждом шаге инференса.',
      'Вычисление Target в DQN той же самой обучаемой сетью theta вместо Target Network: вызывает расхождение градиентов и численный взрыв потерь.',
      'Забывание вычитания Baseline в REINFORCE: градиенты Монте-Карло обладают колоссальной дисперсией, из-за чего обучение сходится крайне медленно или буксует.',
    ],
    checkpointQuiz: [
      {
        id: 'rl-cp-2-1',
        question: 'Какую ключевую проблему решает буфер воспроизведения опыта (Experience Replay) в алгоритме DQN?',
        options: [
          'Удаляет шум из изображений с помощью сглаживающего фильтра Гаусса',
          'Разрушает временную корреляцию между последовательными кадрами, предоставляя i.i.d. сэмплы для градиентного спуска',
          'Автоматически переводит игру на русский язык',
          'Уменьшает количество нейронов во входном слое сверточной сети',
        ],
        correctAnswer: 1,
        explanation: 'Последовательные шаги агента сильно скоррелированы во времени. Случайная выборка из Replay Buffer декоррелирует батч, стабилизируя обучение нейросети.',
      },
      {
        id: 'rl-cp-2-2',
        question: 'Зачем в алгоритме Double DQN действие argmax выбирается основной сетью theta, а его значение оценивается Target-сетью theta^-?',
        options: [
          'Чтобы сжать веса модели до 4 бит',
          'Чтобы устранить систематическую переоценку (Overestimation Bias) Q-значений, вызванную операцией максимума по шумным оценкам',
          'Чтобы ускорить рендеринг графики на экране',
          'Потому что в C++ запрещены вложенные циклы',
        ],
        correctAnswer: 1,
        explanation: 'Операция max по шумным случайным оценкам всегда имеет положительное смещение E[max(X, Y)] >= max(E[X], E[Y]). Разделение выбора и оценки устраняет этот систематический оверэстимейт.',
      },
      {
        id: 'rl-cp-2-3',
        question: 'Как вычитание базовой линии (Baseline b(s)) влияет на математическое ожидание и дисперсию градиента в алгоритме REINFORCE?',
        options: [
          'Увеличивает смещение и увеличивает дисперсию',
          'Не меняет математическое ожидание (несмещенность сохраняется), но кардинально снижает дисперсию градиентных оценок',
          'Обнуляет градиенты всех слоев',
          'Заменяет функцию активации на Softmax',
        ],
        correctAnswer: 1,
        explanation: 'Математически E[grad ln pi * b(s)] = 0, поэтому baseline не вносит систематической ошибки (bias), но резко гасит стохастический разброс траекторий.',
      },
    ],
  },
  {
    id: 'rl-3-actor-critic-ppo',
    moduleId: 'reinforcement-learning',
    title: {
      ru: 'Архитектура Actor-Critic и алгоритм PPO (Proximal Policy Optimization)',
      en: 'Actor-Critic Architecture & Proximal Policy Optimization (PPO)',
    },
    order: 3,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Архитектура Actor-Critic (Актёр-Критик)

Методы Policy Gradient страдают от высокой дисперсии (так как используют полный доход траектории $G_t$), а методы Value-based страдают от смещения (bias TD-ошибки).

**Actor-Critic** объединяет сильные стороны обоих подходов в двух взаимодействующих нейросетях:
1. **Actor (Актёр $\\pi_\\theta(a \\mid s)$):** параметризует стратегию и выбирает действия.
2. **Critic (Критик $V_\\phi(s)$):** оценивает ценность состояния и критикует выбранное актёром действие через **функцию преимущества (Advantage Function)**:
   $$A(s_t, a_t) = Q(s_t, a_t) - V(s_t)$$

#### Что показывает Advantage $A(s, a)$?
Преимущество показывает, **насколько данное конкретное действие $a$ лучше среднего действия**, которое агент совершил бы из состояния $s$.
- Если $A(s, a) > 0$ — действие превзошло ожидания критика $\\to$ вероятность $\\pi_\\theta(a \\mid s)$ увеличивается.
- Если $A(s, a) < 0$ — действие оказалось хуже среднего $\\to$ вероятность уменьшается.

На практике 1-шаговая оценка преимущества вычисляется через TD-ошибку критика:
$$\\delta_t = R_{t+1} + \\gamma V_\\phi(S_{t+1}) - V_\\phi(S_t) \\approx A(S_t, A_t)$$

#### Generalized Advantage Estimation (GAE, Schulman et al., 2015)
Компромисс между смещением (1 шаг) и дисперсией (бесконечность шагов) через экспоненциальное взвешивание $k$-шаговых преимуществ с параметром $\\lambda \\in [0, 1]$:
$$\\hat{A}_t^{\\text{GAE}(\\gamma, \\lambda)} = \\sum_{l=0}^\\infty (\\gamma \\lambda)^l \\delta_{t+l}^V$$

---

### Проблема Policy Collapse в Policy Gradients

В классическом градиентном спуске слишком большой шаг в пространстве параметров $\\theta$ может привести к катастрофическому падению качества (**Policy Collapse**):
- Новая плохая стратегия $\\pi_{\\theta_{\\text{new}}}$ начинает сэмплировать исключительно катастрофические траектории.
- Из-за этого градиенты становятся неадекватными, и агент **никогда не может восстановиться**.

---

### Алгоритм PPO (Proximal Policy Optimization, Schulman et al., 2017)

PPO — самый популярный и надежный алгоритм RL в индустрии, ставший де-факто стандартом как в управлении роботами (OpenAI, Boston Dynamics), так и в выравнивании языковых моделей (ChatGPT RLHF).

#### Идея ограничения шага: Отношение вероятностей (Probability Ratio)
$$r_t(\\theta) = \\frac{\\pi_\\theta(a_t \\mid s_t)}{\\pi_{\\theta_{\\text{old}}}(a_t \\mid s_t)}$$
- Если $r_t(\\theta) = 1$, текущая политика совпадает со старой.
- Если $r_t(\\theta) > 1$, действие стало более вероятным под новой политикой.

#### Целевая функция PPO с клиппированием (Clipped Surrogate Objective):
$$\\mathcal{L}^{\\text{CLIP}}(\\theta) = \\hat{\\mathbb{E}}_t \\left[ \\min\\left( r_t(\\theta) \\hat{A}_t, \\; \\text{clip}(r_t(\\theta), \\; 1 - \\epsilon, \\; 1 + \\epsilon) \\hat{A}_t \\right) \\right]$$
где $\\epsilon$ — гиперпараметр клиппирования (обычно $\\epsilon = 0.2$).

\`\`\`
Как работает клиппинг (при A > 0):
L_clip
  ▲
  │              / (неклиппированное r * A)
  │             /
  │  ──────────● (1 + epsilon) * A  <-- насыщение (пессимистичная оценка)
  │ /
  │/
──┼───────────────► r_t(theta)
  │      1.0  1.2
\`\`\`

#### Почему берется минимум $\\min(\\cdot, \\cdot)$?
Это создает **пессимистическую нижнюю границу (Pessimistic Bound)**:
- Если действие хорошее ($\\hat{A}_t > 0$), клиппинг $1+\\epsilon$ не позволяет увеличивать вероятность чрезмерно за один шаг.
- Если действие плохое ($\\hat{A}_t < 0$), клиппинг $1-\\epsilon$ не позволяет штрафовать стратегию сильнее допустимого предела.

#### Итоговый комбинированный лосс PPO:
$$\\mathcal{L}^{\\text{PPO}}(\\theta, \\phi) = \\hat{\\mathbb{E}}_t \\left[ \\mathcal{L}^{\\text{CLIP}}(\\theta) - c_1 \\mathcal{L}^{\\text{VF}}(\\phi) + c_2 \\mathcal{S}[\\pi_\\theta](s_t) \\right]$$
где $\\mathcal{L}^{\\text{VF}}$ — ошибка критика (MSE между $V_\\phi(s)$ и таргетом дохода), а $\\mathcal{S}[\\pi_\\theta]$ — энтропийный бонус для поддержания exploration.`,
    commonMistakes: [
      'Установка слишком большого epsilon в PPO (например, epsilon = 0.8): клиппинг перестает удерживать стратегию в доверительной области (Trust Region), вызывая коллапс политики.',
      'Обучение критика V(s) и актёра с одинаковым learning rate: критик обычно обучается с более высоким темпом (или отдельным оптимизатором), так как ему нужно быстрее подстроиться под новые траектории.',
      'Пересчет отношения r_t(theta) без сохранения старых лог-вероятностей log_prob_old: приводит к некорректному расчету производных.',
    ],
    checkpointQuiz: [
      {
        id: 'rl-cp-3-1',
        question: 'Что выражает функция преимущества Advantage A(s, a) = Q(s, a) - V(s)?',
        options: [
          'Насколько конкретное выбранное действие а лучше или хуже среднего ожидаемого действия агента из состояния s',
          'Разницу в количестве параметров между актёром и критиком',
          'Скорость вычислений модели на графическом ускорителе',
          'Вероятность ошибки при передаче сетевых пакетов',
        ],
        correctAnswer: 0,
        explanation: 'Advantage изолирует относительное превосходство конкретного хода над средним базовым уровнем состояния V(s), исключая влияние абсолютной высоты наград.',
      },
      {
        id: 'rl-cp-3-2',
        question: 'Зачем в алгоритме PPO используется операция клиппирования clip(r_t(theta), 1 - epsilon, 1 + epsilon)?',
        options: [
          'Чтобы сжать размер батча до степени двойки',
          'Чтобы не позволить вероятностям новой стратегии отклониться слишком далеко от предыдущей и предотвратить катастрофический коллапс политики (Policy Collapse)',
          'Чтобы округлить веса нейросети до целых чисел',
          'Чтобы скрыть системный промпт от пользователя',
        ],
        correctAnswer: 1,
        explanation: 'PPO ограничивает отношение вероятностей r_t в окрестности [1-e, 1+e]. Это гарантирует стабильное монотонное улучшение без риска разрушить выученное поведение одним гигантским шагом.',
      },
      {
        id: 'rl-cp-3-3',
        question: 'Какую роль выполняет Critic (Критик) в архитектуре Actor-Critic?',
        options: [
          'Непосредственно выводит действия в окружающую среду',
          'Оценивает скалярную функцию ценности состояния V(s), позволяя сформировать низкодисперсионный сигнал преимущества для обучения Актёра',
          'Шифрует веса модели перед деплоем на сервер',
          'Удаляет дубликаты из обучающего набора',
        ],
        correctAnswer: 1,
        explanation: 'Критик учится предсказывать ожидаемый суммарный доход из состояния, выступая стабильной базовой линией для оценки действий Актёра.',
      },
    ],
  },
  {
    id: 'rl-4-rlhf-dpo-grpo-deepseek',
    moduleId: 'reinforcement-learning',
    title: {
      ru: 'RL для LLM: RLHF, DPO и прорыв GRPO (Group Relative Policy Optimization в DeepSeek-R1)',
      en: 'RL for LLMs: RLHF, DPO & the GRPO Breakthrough (DeepSeek-R1)',
    },
    order: 4,
    estimatedMinutes: 30,
    draft: false,
    theoryMarkdown: `### Языковые модели как задача обучения с подкреплением

Обучение современных рассуждающих моделей (Reasoning LLMs: OpenAI o1, DeepSeek-R1) доказало, что **Reinforcement Learning — это главный двигатель качественного скачка интеллекта**.

#### Формулировка LLM в терминах MDP:
- **Состояние $s_t$:** исходный промпт пользователя $x$ плюс все уже сгенерированные токены $w_1, \\dots, w_{t-1}$.
- **Действие $a_t$:** выбор очередного токена $w_t$ из словаря размера $|\\mathcal{V}| \\approx 128\\,000$.
- **Переход $P(s_{t+1} \\mid s_t, a_t)$:** детерминированный (конкатенация нового токена к контексту).
- **Награда $R$:** отложенная! В процессе генерации промежуточные токены получают $r_t = 0$. Финальная награда выдается **один раз в самом конце ответа** (после токена \`<EOS>\`).

---

### Классический пайплайн RLHF (InstructGPT, ChatGPT)

1. **Step 1: Supervised Fine-Tuning (SFT)** — дообучение на демонстрациях идеальных ответов.
2. **Step 2: Reward Modeling (RM)** — люди-асессоры ранжируют пары ответов ($y_w \\succ y_l$). Обучается модель $r_\\psi(x, y)$ с бинарным лоссом Брэдли-Терри (Bradley-Terry):
   $$\\mathcal{L}_{\\text{RM}} = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma\\big( r_\\psi(x, y_w) - r_\\psi(x, y_l) \\big) \\right]$$
3. **Step 3: PPO Fine-Tuning** — генератор $\\pi_\\theta$ оптимизируется по алгоритму PPO. Чтобы модель не забыла язык и не подверглась взлому наград (**Reward Hacking**), к награде добавляется штраф за дивергенцию Кульбака-Лейблера к замороженной базовой SFT-модели:
   $$\\mathcal{R}(x, y) = r_\\psi(x, y) - \\beta \\cdot D_{\\text{KL}}\\big(\\pi_\\theta(y \\mid x) \\;\\parallel\\; \\pi_{\\text{ref}}(y \\mid x)\\big)$$

*Узкое горлышко PPO в LLM:* необходимо держать в видеопамяти **4 огромные модели одновременно** (Actor $\\pi_\\theta$, Critic $V_\\phi$, Reference $\\pi_{\\text{ref}}$, Reward $r_\\psi$), что требует гигантских кластеров GPU и порождает нестабильность сходимости.

---

### DPO (Direct Preference Optimization, 2023)

DPO математически исключает необходимость обучать отдельную Reward Model и исключает RL-цикл.
Оптимизируется замкнутая функция потерь классификации пар ответов непосредственно на весах LLM:
$$\\mathcal{L}_{\\text{DPO}}(\\theta) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)} \\right) \\right]$$

---

### Алгоритм GRPO (Group Relative Policy Optimization) — основа DeepSeek-R1

В начале 2025 года компания DeepSeek представила модели **DeepSeekMath** и **DeepSeek-R1**, показавшие reasoning-возможности мирового уровня (математика, соревновательное программирование, логика) при феноменально низких затратах на обучение.

Ключевой математический двигатель DeepSeek-R1 — алгоритм **GRPO (Shao et al., 2024)**.

#### Архитектурная революция: Полный отказ от модели Критика (No Critic Network!)
В стандартном PPO модель Critic $V_\\phi$ сопоставима по размеру с генератором (например, 70B параметров) и склонна давать неточные предсказания ценности для длинных цепочек рассуждений (Chain-of-Thought).
**GRPO полностью выбрасывает Критика из архитектуры!**

\`\`\`
Пайплайн GRPO (DeepSeek-R1):
                     ┌──► Сэмпл o_1 ──► Верификатор ──► Награда r_1 ──┐
                     ├──► Сэмпл o_2 ──► Верификатор ──► Награда r_2 ──┤
Входной промпт q ──► ├──► Сэмпл o_3 ──► Верификатор ──► Награда r_3 ──┼─► Нормализация A_i
                     └──► Сэмпл o_G ──► Верификатор ──► Награда r_G ──┘   A_i = (r_i - mean) / std
                                                                                   │
                                                                                   ▼
                                                                  PPO Clipped Update весов Actor
\`\`\`

#### Пошаговый алгоритм GRPO:
1. Для каждого входящего вопроса $q$ модель $\\pi_\\theta$ генерирует **группу из $G$ независимых ответов-кандидатов** $\\{o_1, o_2, \\dots, o_G\\}$ (обычно $G = 8 \\dots 16$).
2. Каждый ответ $o_i$ оценивается автоматическими верификаторами:
   - **Rule-based Verifier:** для математики проверяется точное совпадение финального ответа в блоке \`\\boxed{...}\` (через SymPy); для кода запускаются юнит-тесты в песочнице (Compiler output).
   - **Format Verifier:** штрафует за отсутствие тегов рассуждения \`<think> ... </think>\`.
3. Вычисляется **внутригрупповое относительное преимущество (Group Relative Advantage)**:
   $$\\hat{A}_i = \\frac{r_i - \\text{mean}(\\{r_1, \\dots, r_G\\})}{\\text{std}(\\{r_1, \\dots, r_G\\})}$$
   Если среди 8 ответов 2 правильных ($r=1$), а 6 неправильных ($r=0$), правильные ответы автоматически получают положительное преимущество $+A$, а неправильные — отрицательное $-A$!
4. Обновление стратегии актёра с клиппированием PPO и регуляризатором KL:
   $$\\mathcal{L}_{\\text{GRPO}}(\\theta) = \\frac{1}{G} \\sum_{i=1}^G \\frac{1}{|o_i|} \\sum_{t=1}^{|o_i|} \\left[ \\min\\left( \\frac{\\pi_\\theta(o_{i,t})}{\\pi_{\\text{old}}(o_{i,t})} \\hat{A}_i, \\; \\text{clip}\\left( \\frac{\\pi_\\theta(o_{i,t})}{\\pi_{\\text{old}}(o_{i,t})}, 1-\\epsilon, 1+\\epsilon \\right) \\hat{A}_i \\right) \\right] - \\beta D_{\\text{KL}}(\\pi_\\theta \\parallel \\pi_{\\text{ref}})$$

#### Феномен DeepSeek-R1-Zero («Aha Moment»):
При обучении через GRPO напрямую из базовой модели без предварительного SFT сеть самостоятельно выработала длинные цепочки рассуждений, научилась перепроверять свои шаги, пересчитывать интегралы с нуля при обнаружении нестыковок и формулировать мысли внутри \`<think>\`.

---

### Прикладные индустриальные применения RL

1. **Рекомендательные системы (RecSys):**
   Вместо близорукого максимизирования сиюминутного CTR модель обучается как RL-агент (SlateQ, RecSim), оптимизируя долгосрочный retention пользователя, LTV и разнообразие контента на горизонте месяцев.
2. **Робототехника и автопилоты (Robotics & Autonomous Driving):**
   Обучение локомоции четвероногих роботов и манипуляторов в симуляторах (Isaac Gym, MuJoCo) с переносом в реальный мир (**Sim-to-Real**) через рандомизацию физических параметров среды (**Domain Randomization**).`,
    commonMistakes: [
      'Попытка запустить PPO для LLM без KL-штрафа к reference-модели: модель моментально подвергается Reward Hacking, начиная генерировать бессмысленный спам из ключевых слов, максимизирующих скор Reward-модели.',
      'Путаница между GRPO и PPO: в GRPO полностью отсутствует сеть Critic (Value Model), а Advantage вычисляется путем статистической нормализации наград внутри сгенерированной группы кандидатов.',
      'Использование DPO для задач с объективной проверяемой истиной (математика, код): в задачах точных наук RL (PPO/GRPO) превосходит DPO, так как генерирует процесс исследования и самоисправления ошибок.',
    ],
    checkpointQuiz: [
      {
        id: 'rl-cp-4-1',
        question: 'За счет чего алгоритм GRPO (Group Relative Policy Optimization) в DeepSeek-R1 экономит колоссальный объем видеопамяти по сравнению с PPO?',
        options: [
          'Он полностью исключает из архитектуры тяжелую модель Критика (Critic/Value Network), вычисляя преимущество Advantage через статистическую нормализацию наград группы ответов',
          'Он уменьшает словарь токенов до 100 символов',
          'Он квантует модель до 1 бита',
          'Он удаляет слои внимания из архитектуры трансформера',
        ],
        correctAnswer: 0,
        explanation: 'В PPO Критик удваивает потребление VRAM. GRPO генерирует группу из G кандидатов на один промпт и нормализует награды внутри группы (r_i - mean) / std, обходясь без Value-сети.',
      },
      {
        id: 'rl-cp-4-2',
        question: 'Что такое "Reward Hacking" (взлом награды) в контексте обучения языковых моделей через RLHF?',
        options: [
          'Физический взлом базы данных злоумышленниками',
          'Ситуация, когда LLM находит лазейку в несовершенной Reward Model и генерирует абсурдный или неестественный текст, получающий высокую оценку награды без реальной пользы для человека',
          'Сбой электропитания в серверной стойке',
          'Отказ видеокарты продолжать вычисления',
        ],
        correctAnswer: 1,
        explanation: 'Модели наград несовершенны. Без сдерживающего штрафа KL-дивергенции LLM быстро находит аномальные последовательности токенов, обманывающие модель наград.',
      },
      {
        id: 'rl-cp-4-3',
        question: 'В чем ключевое отличие алгоритма DPO от классического пайплайна RLHF с PPO?',
        options: [
          'DPO оптимизирует веса напрямую на парах предпочтений через закрытую форму классификации, полностью устраняя необходимость обучать Reward Model и запускать RL-цикл',
          'DPO работает только с изображениями и видео',
          'DPO требует в 10 раз больше видеокарт, чем PPO',
          'DPO отменяет необходимость предобучения модели на текстах',
        ],
        correctAnswer: 0,
        explanation: 'DPO математически преобразует задачу RLHF в аналитическую бинарную классификацию предпочтений, обходясь без промежуточной Reward-модели и нестабильного PPO.',
      },
    ],
  },
];

export const reinforcementLearningCards: Card[] = [
  {
    id: 'rl-card-1',
    moduleId: 'reinforcement-learning',
    lessonId: 'rl-1-mdp-bellman-foundations',
    type: 'flip',
    front: {
      ru: 'Что выражает уравнение Беллмана для оптимальности Q*(s, a)?',
      en: 'What does the Bellman Optimality Equation for Q*(s, a) state?',
    },
    back: {
      ru: 'Q*(s, a) = R(s, a) + γ ∑ P(s\'|s, a) max_{a\'} Q*(s\', a\'). Ценность текущего действия равна немедленной награде плюс дисконтированное максимальное Q-значение следующего состояния.',
      en: 'Q*(s, a) = R(s, a) + γ ∑ P(s\'|s, a) max_{a\'} Q*(s\', a\'). The optimal value of an action is the expected immediate reward plus the discounted maximum value achievable from the subsequent state.',
    },
    tags: ['rl', 'bellman', 'mdp'],
  },
  {
    id: 'rl-card-2',
    moduleId: 'reinforcement-learning',
    lessonId: 'rl-2-qlearning-dqn-policy-gradient',
    type: 'flip',
    front: {
      ru: 'Какие две ключевые техники обеспечили стабильность алгоритма DQN в исследовании DeepMind (2015)?',
      en: 'Which two key innovations enabled stability in DeepMind\'s DQN (2015)?',
    },
    back: {
      ru: '1. Experience Replay Buffer (буфер воспроизведения для декорреляции сэмплов во времени). 2. Target Network (отдельная замороженная сеть для стабилизации целевого значения TD-таргета).',
      en: '1. Experience Replay Buffer (decorrelating consecutive time-series samples via random mini-batch sampling). 2. Target Network (stabilizing moving regression targets by periodically freezing parameters).',
    },
    tags: ['rl', 'dqn', 'deep-learning'],
  },
  {
    id: 'rl-card-3',
    moduleId: 'reinforcement-learning',
    lessonId: 'rl-3-actor-critic-ppo',
    type: 'cloze',
    clozeText: {
      ru: 'В алгоритме PPO для предотвращения деструктивного коллапса политики целевая функция ограничивает отношение вероятностей с помощью {{c1::клиппирования (Clipped Surrogate Objective)}} в окрестности [1-ε, 1+ε].',
      en: 'In PPO, preventing destructive policy collapse is achieved by constraining the probability ratio via {{c1::clipping (Clipped Surrogate Objective)}} within [1-ε, 1+ε].',
    },
    answer: {
      ru: 'клиппирования (Clipped Surrogate Objective)',
      en: 'clipping (Clipped Surrogate Objective)',
    },
    tags: ['rl', 'ppo', 'actor-critic'],
  },
  {
    id: 'rl-card-4',
    moduleId: 'reinforcement-learning',
    lessonId: 'rl-4-rlhf-dpo-grpo-deepseek',
    type: 'flip',
    front: {
      ru: 'В чем заключается революционное отличие алгоритма GRPO (DeepSeek-R1) от классического PPO?',
      en: 'What is the revolutionary difference between GRPO (DeepSeek-R1) and standard PPO?',
    },
    back: {
      ru: 'GRPO полностью отказывается от тяжелой модели Критика (Critic/Value Network). Модель генерирует группу из G кандидатов на каждый промпт, а преимущество A_i вычисляется через статистическую нормализацию наград внутри этой группы: (r_i - mean(r)) / std(r).',
      en: 'GRPO completely discards the heavy Critic/Value Network. It samples a group of G candidates per prompt and computes relative advantages by normalizing rewards within the group: (r_i - mean(r)) / std(r).',
    },
    tags: ['rl', 'grpo', 'deepseek', 'llm'],
  },
];

export const reinforcementLearningQuiz: QuizQuestion[] = [
  {
    id: 'rl-q-1',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Что происходит с поведением RL-агента, если фактор дисконтирования gamma установить равным 0 (gamma = 0)?',
      en: 'What happens to the behavior of an RL agent when the discount factor gamma is set to zero (gamma = 0)?',
    },
    options: [
      {
        ru: 'Агент становится абсолютно близоруким (myopic), оптимизируя исключительно немедленную награду на текущем шаге и игнорируя любые последствия в будущем',
        en: 'The agent becomes completely myopic, optimizing exclusively for immediate rewards while totally disregarding future outcomes',
      },
      {
        ru: 'Агент начинает планировать действия на бесконечный горизонт вперед',
        en: 'The agent plans actions across an infinite horizon',
      },
      {
        ru: 'Скорость обучения нейросети уменьшается до нуля',
        en: 'Neural network training speed drops to zero',
      },
      {
        ru: 'Агент всегда выбирает только первое действие из списка',
        en: 'The agent always executes the first action in the list',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'При gamma = 0 доход G_t = R_{t+1}. Агент максимизирует только мгновенную отдачу на следующем шаге, не принимая во внимание будущие выигрыши или потери.',
      en: 'At gamma = 0, cumulative return reduces to G_t = R_{t+1}, eliminating consideration of any downstream rewards.',
    },
    tag: 'rl-discount-factor',
  },
  {
    id: 'rl-q-2',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Какую главную архитектурную проблему PPO при обучении рассуждающих LLM (Reasoning models) решил алгоритм GRPO в DeepSeek-R1?',
      en: 'Which critical architectural bottleneck of PPO in reasoning LLM training did GRPO solve in DeepSeek-R1?',
    },
    options: [
      {
        ru: 'Необходимость аллоцировать память под огромную модель Критика (Critic/Value Network), удваивающую потребление VRAM и дающую нестабильные оценки для длинных цепочек мыслей',
        en: 'The requirement to allocate VRAM for an equally sized Critic/Value Network, doubling memory footprint and introducing noisy value estimates across long reasoning chains',
      },
      {
        ru: 'Невозможность генерации текста длиннее 512 токенов',
        en: 'Inability to generate completions exceeding 512 tokens',
      },
      {
        ru: 'Необходимость использования языка программирования Java',
        en: 'The prerequisite to use the Java programming language',
      },
      {
        ru: 'Ограничение на размер обучающего датасета не более 1000 строк',
        en: 'Constraint capping training dataset size at 1,000 samples',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'В PPO модель Critic требует отдельной копии параметров того же масштаба (десятки миллиардов весов). GRPO устранил критика, оценивая группу кандидатов через внутреннюю нормализацию.',
      en: 'In PPO, the Critic model duplicates large-scale parameter memory. GRPO discards the critic, deriving baseline advantages purely from group statistics.',
    },
    tag: 'grpo-deepseek-architecture',
  },
  {
    id: 'rl-q-3',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Зачем в алгоритме REINFORCE из накопленного дохода G_t вычитают базовую линию (Baseline)?',
      en: 'Why is a Baseline subtracted from the cumulative return G_t in the REINFORCE algorithm?',
    },
    options: [
      {
        ru: 'Чтобы снизить высокую дисперсию оценок градиента Монте-Карло, не внося при этом математического смещения (bias) в шаг обучения',
        en: 'To reduce the high variance of Monte Carlo gradient estimates without introducing mathematical bias to the update step',
      },
      {
        ru: 'Чтобы удалить отрицательные числа из логов',
        en: 'To purge negative numbers from runtime logs',
      },
      {
        ru: 'Чтобы сделать функцию потерь выпуклой',
        en: 'To force the loss function into strict convexity',
      },
      {
        ru: 'Это аппаратное требование компилятора CUDA',
        en: 'It is a mandatory hardware requirement of CUDA compilers',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Математическое ожидание градиента со смещением базовой линии не меняется (E[grad ln pi * b] = 0), однако разброс эмпирических траекторий резко сокращается.',
      en: 'Subtracting any state-dependent baseline preserves gradient expectation while drastically compressing sample trajectory variance.',
    },
    tag: 'policy-gradient-baseline',
  },
  {
    id: 'rl-q-4',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Как в алгоритме GRPO вычисляется преимущество A_i для каждого сгенерированного ответа группы {o_1, ..., o_G}?',
      en: 'How is the advantage A_i calculated for each candidate in group {o_1, ..., o_G} under GRPO?',
    },
    options: [
      {
        ru: 'Через статистическую Z-нормализацию наград группы: A_i = (r_i - mean(r)) / std(r)',
        en: 'Via statistical Z-score normalization of group rewards: A_i = (r_i - mean(r)) / std(r)',
      },
      {
        ru: 'Через вызов функции softmax от номеров токенов',
        en: 'By computing softmax over token index values',
      },
      {
        ru: 'Путем умножения награды на длину текста в символах',
        en: 'By multiplying the reward by completion character length',
      },
      {
        ru: 'Через обучение отдельного случайного леса',
        en: 'By training an external random forest regressor',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'GRPO вычисляет награды r_i для группы ответов на один промпт и стандартизирует их: A_i = (r_i - mean) / std. Лучшие ответы получают положительное преимущество, худшие — отрицательное.',
      en: 'GRPO standardizes rewards across G outputs per prompt: A_i = (r_i - mean) / std. Answers superior to the group average receive positive reinforcement.',
    },
    tag: 'grpo-advantage-formula',
  },
];
