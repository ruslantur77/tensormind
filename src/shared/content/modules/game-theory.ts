import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const gameTheoryMeta: ModuleMeta = {
  id: 'game-theory',
  title: {
    ru: 'Теория игр и состязательные модели',
    en: 'Game Theory & Adversarial ML',
  },
  description: {
    ru: 'Равновесие Нэша, минимакс, игры с нулевой суммой, GANs (генеративно-состязательные сети) и состязательные атаки.',
    en: 'Nash equilibrium, minimax, zero-sum games, GAN formulation, and adversarial robustness.',
  },
  order: 11,
  icon: 'game-theory',
  estimatedMinutes: 40,
  isPlaceholder: false,
};

export const gameTheoryLessons: Lesson[] = [
  {
    id: 'gt-1-nash',
    moduleId: 'game-theory',
    title: {
      ru: 'Стратегии, матрицы выплат и Равновесие Нэша',
      en: 'Strategies, Payoff Matrices, and Nash Equilibrium',
    },
    order: 1,
    estimatedMinutes: 14,
    draft: false,
    theoryMarkdown: {
      ru: `### Основы теории игр и Равновесие Нэша

Теория игр изучает математические модели принятия решений в условиях взаимодействия нескольких рациональных агентов с конфликтующими или согласованными интересами.

#### 1. Нормальная форма игры
Игра задается тройкой $(N, S, U)$:
* $N = \\{1, 2, \\dots, n\\}$ — множество игроков;
* $S = S_1 \\times S_2 \\times \\dots \\times S_n$ — пространство стратегий;
* $u_i(s_1, \\dots, s_n)$ — функция выигрыша (utility function) игрока $i$.

#### 2. Доминирующие стратегии
* Стратегия $s_i^*$ называется **строго доминирующей**, если для любых стратегий оппонентов $s_{-i}$ выигрыш игрока строго больше любого альтернативного выбора:
$$u_i(s_i^*, s_{-i}) > u_i(s_i, s_{-i}) \\quad \\forall s_i \\neq s_i^*$$

#### 3. Равновесие Нэша (Nash Equilibrium)
Набор стратегий $s^* = (s_1^*, s_2^*, \\dots, s_n^*)$ образует **Равновесие Нэша**, если ни одному игроку **не выгодно в одностороннем порядке отклоняться** от своей стратегии:
$$u_i(s_i^*, s_{-i}^*) \\ge u_i(s_i, s_{-i}^*) \\quad \\forall s_i \\in S_i, \\forall i \\in N$$

* **Теорема Нэша (1950):** Всякая конечная игра имеет по крайней мере одно равновесие в смешанных стратегиях.
* **Дилемма заключенного:** равновесие Нэша (оба предают) может быть субоптимальным по сравнению с кооперативным исходом (Парето-эффективность).`,
      en: `### Game Theory Foundations & Nash Equilibrium

Game theory models strategic decision-making where multiple rational agents interact with conflicting or aligned objectives.

#### 1. Normal-Form Game
A game is defined by the tuple $(N, S, U)$:
* $N = \\{1, 2, \\dots, n\\}$ is the set of players;
* $S = S_1 \\times S_2 \\times \\dots \\times S_n$ is the strategy profile space;
* $u_i(s_1, \\dots, s_n)$ is the utility (payoff) function of player $i$.

#### 2. Dominant Strategies
* A strategy $s_i^*$ is **strictly dominant** if, regardless of opponents' actions $s_{-i}$, it yields strictly superior payoff over any alternative:
$$u_i(s_i^*, s_{-i}) > u_i(s_i, s_{-i}) \\quad \\forall s_i \\neq s_i^*$$

#### 3. Nash Equilibrium
A strategy profile $s^* = (s_1^*, \\dots, s_n^*)$ is a **Nash Equilibrium** if no player can unilaterally deviate to improve their expected payoff:
$$u_i(s_i^*, s_{-i}^*) \\ge u_i(s_i, s_{-i}^*) \\quad \\forall s_i \\in S_i, \\forall i \\in N$$

* **Nash Existence Theorem (1950):** Every finite game possesses at least one equilibrium in mixed (probabilistic) strategies.
* **Prisoner's Dilemma:** Individual rationality produces a Nash equilibrium (defect, defect) that is Pareto-dominated by mutual cooperation.`,
    },
    commonMistakes: [
      {
        ru: 'Путать Равновесие Нэша с оптимумом Парето: в равновесии Нэша индивидуальная рациональность может приводить к общему худшему результату.',
        en: 'Confusing Nash Equilibrium with Pareto Optimality: Nash equilibria can be socially sub-optimal.',
      },
      {
        ru: 'Полагать, что равновесие всегда существует в чистых стратегиях (например, в игре «Камень-ножницы-бумага» оно только в смешанных).',
        en: 'Assuming equilibria always exist in pure strategies (e.g. Rock-Paper-Scissors only has a mixed equilibrium at 1/3 each).',
      },
    ],
    checkpointQuiz: [
      {
        id: 'gt-cp-1',
        question: {
          ru: 'Что означает Равновесие Нэша в игре нескольких игроков?',
          en: 'What characterizes a Nash Equilibrium in multi-player games?',
        },
        options: [
          {
            ru: 'Ни одному игроку не выгодно менять свою стратегию в одностороннем порядке',
            en: 'No player can improve their payoff through unilateral strategy deviation',
          },
          {
            ru: 'Все игроки получают максимально возможный суммарный выигрыш',
            en: 'All players collectively achieve the maximum possible cooperative sum',
          },
          {
            ru: 'Игра обязательно заканчивается ничьей',
            en: 'The game strictly terminates in a draw',
          },
          {
            ru: 'Все игроки делают одинаковые ходы',
            en: 'All players make identical deterministic moves',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В точке равновесия Нэша каждый игрок выбирает наилучший ответ на фиксированные стратегии остальных участников.',
          en: 'In Nash equilibrium, every strategy is a best response to the opponents strategies.',
        },
      },
    ],
  },
  {
    id: 'gt-2-minimax',
    moduleId: 'game-theory',
    title: {
      ru: 'Игры с нулевой суммой и теорема о минимаксе',
      en: 'Zero-Sum Games and the Minimax Theorem',
    },
    order: 2,
    estimatedMinutes: 13,
    draft: false,
    theoryMarkdown: {
      ru: `### Антагонистические игры с нулевой суммой

В играх с нулевой суммой (Zero-Sum Games) выигрыш одного игрока в точности равен проигрышу другого:
$$u_1(x, y) + u_2(x, y) = 0 \\implies u_2(x, y) = -u_1(x, y)$$

Обозначим $V(x, y) = u_1(x, y)$. Тогда:
* Игрок 1 максимизирует $V(x, y)$;
* Игрок 2 минимизирует $V(x, y)$.

#### Теорема фон Неймана о минимаксе (1928)
Для любой матричной игры с нулевой суммой в смешанных стратегиях существует значение игры $V^*$, и выполняется равенство:
$$\\max_{x \\in \\Delta_m} \\min_{y \\in \\Delta_n} x^T A y = \\min_{y \\in \\Delta_n} \\max_{x \\in \\Delta_m} x^T A y = V^*$$

Точка $(x^*, y^*)$ образует **седловую точку** (saddle point) функции выигрыша:
$$V(x, y^*) \\le V(x^*, y^*) \\le V(x^*, y)$$

#### Значение для машинного обучения:
* Минимаксные алгоритмы лежат в основе Alpha-Beta pruning в шахматах и Go.
* Обучение робастных моделей к состязательным атакам (Robust Optimization):
$$\\min_{\\theta} \\max_{\\|\\delta\\| \\le \\epsilon} \\mathcal{L}(\\theta, x + \\delta, y)$$`,
      en: `### Zero-Sum Games and Minimax Equilibrium

In zero-sum games, one player payoff strictly mirrors the opponent loss:
$$u_1(x, y) + u_2(x, y) = 0 \\implies u_2(x, y) = -u_1(x, y)$$

Defining $V(x, y) = u_1(x, y)$:
* Player 1 maximizes $V(x, y)$;
* Player 2 minimizes $V(x, y)$.

#### Von Neumann Minimax Theorem (1928)
For any finite two-player zero-sum matrix game in mixed strategies, the game value $V^*$ exists such that:
$$\\max_{x \\in \\Delta_m} \\min_{y \\in \\Delta_n} x^T A y = \\min_{y \\in \\Delta_n} \\max_{x \\in \\Delta_m} x^T A y = V^*$$

The profile $(x^*, y^*)$ forms a **saddle point**:
$$V(x, y^*) \\le V(x^*, y^*) \\le V(x^*, y)$$

#### Machine Learning Implications:
* Underpins Alpha-Beta game tree search (chess, Go engines).
* Robust optimization under worst-case bounded perturbations:
$$\\min_{\\theta} \\max_{\\|\\delta\\| \\le \\epsilon} \\mathcal{L}(\\theta, x + \\delta, y)$$`,
    },
    commonMistakes: [
      {
        ru: 'Путать $\\min_y \\max_x$ и $\\max_x \\min_y$: без смешанных стратегий верно лишь слабое неравенство $\\max_x \\min_y \\le \\min_y \\max_x$.',
        en: 'Confusing $\\min_y \\max_x$ with $\\max_x \\min_y$: in general non-convex spaces weak duality $\\max_x \\min_y \\le \\min_y \\max_x$ applies.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'gt-cp-2',
        question: {
          ru: 'Что выражает седловая точка $(x^*, y^*)$ в игре с нулевой суммой $V(x, y)$?',
          en: 'What does a saddle point $(x^*, y^*)$ characterize in a zero-sum game $V(x, y)$?',
        },
        options: [
          {
            ru: 'Максимум по $x$ и одновременно минимум по $y$: $V(x, y^*) \\le V(x^*, y^*) \\le V(x^*, y)$',
            en: 'Maximum along $x$ and simultaneously minimum along $y$: $V(x, y^*) \\le V(x^*, y^*) \\le V(x^*, y)$',
          },
          {
            ru: 'Точку, где градиенты обоих игроков равны бесконечности',
            en: 'A singularity where both gradients diverge to infinity',
          },
          {
            ru: 'Точку, где оба игрока гарантированно проигрывают',
            en: 'An outcome where both players strictly lose',
          },
          {
            ru: 'Точку с нулевой размерностью матрицы',
            en: 'A point with zero matrix dimension',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Седловая точка гарантирует, что отклонение первого игрока $x$ не увеличит выигрыш, а отклонение второго $y$ не уменьшит штраф.',
          en: 'At a saddle point, player 1 has no incentive to change $x$ and player 2 has no incentive to alter $y$.',
        },
      },
    ],
  },
  {
    id: 'gt-3-gans',
    moduleId: 'game-theory',
    title: {
      ru: 'GANs как игра двух игроков и состязательные атаки',
      en: 'GANs as a Two-Player Game and Adversarial Attacks',
    },
    order: 3,
    estimatedMinutes: 13,
    draft: false,
    theoryMarkdown: {
      ru: `### Генеративно-состязательные сети (GANs)

В 2014 году Ян Гудфеллоу (Ian Goodfellow) сформулировал обучение генеративных моделей как минимаксную игру двух игроков:
1. **Дискриминатор $D(x)$:** оценивает вероятность того, что образец $x$ пришел из реальных данных $p_{data}$.
2. **Генератор $G(z)$:** преобразует шум $z \\sim p_z$ в реалистичный объект, пытаясь обмануть дискриминатор.

#### Целевая функция игры GAN
$$\\min_G \\max_D V(D, G) = \\mathbb{E}_{x \\sim p_{data}}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z}[\\log (1 - D(G(z)))]$$

#### Аналитическое решение для Дискриминатора
При фиксированном $G$ оптимальный дискриминатор равен:
$$D^*(x) = \\frac{p_{data}(x)}{p_{data}(x) + p_g(x)}$$

* Подстановка $D^*(x)$ в целевую функцию сводит задачу к минимизации **дивергенции Йенсена-Шеннона (JS divergence)**:
$$V(D^*, G) = -\\log 4 + 2 \\cdot D_{JS}(p_{data} \\parallel p_g)$$
* Глобальный оптимум достигается при $p_g = p_{data}$, где $D^*(x) = \\frac{1}{2}$ и $V(D^*, G) = -\\log 4$.

#### Состязательные атаки (FGSM)
Fast Gradient Sign Method строит состязательный шум в направлении роста градиента потерь:
$$x_{adv} = x + \\epsilon \\cdot \\text{sign}(\\nabla_x \\mathcal{L}(\\theta, x, y))$$`,
      en: `### Generative Adversarial Networks (GANs)

Ian Goodfellow et al. (2014) framed generative modeling as a two-player zero-sum game:
1. **Discriminator $D(x)$:** estimates the probability that sample $x$ came from true data distribution $p_{data}$.
2. **Generator $G(z)$:** maps latent noise $z \\sim p_z$ to synthetic samples, trying to fool the discriminator.

#### GAN Objective Function
$$\\min_G \\max_D V(D, G) = \\mathbb{E}_{x \\sim p_{data}}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z}[\\log (1 - D(G(z)))]$$

#### Optimal Discriminator Solution
For fixed generator $G$, the optimal discriminator is analytically:
$$D^*(x) = \\frac{p_{data}(x)}{p_{data}(x) + p_g(x)}$$

* Evaluating at $D^*$ equates the objective to minimizing **Jensen-Shannon (JS) divergence**:
$$V(D^*, G) = -\\log 4 + 2 \\cdot D_{JS}(p_{data} \\parallel p_g)$$
* Global equilibrium occurs when $p_g = p_{data}$, at which point $D^*(x) = \\frac{1}{2}$.

#### Adversarial Attacks (FGSM)
The Fast Gradient Sign Method synthesizes adversarial perturbations along the sign of loss gradients:
$$x_{adv} = x + \\epsilon \\cdot \\text{sign}(\\nabla_x \\mathcal{L}(\\theta, x, y))$$`,
    },
    commonMistakes: [
      {
        ru: 'Считать, что дискриминатор должен обучаться до совершенства: если $D$ идеален слишком рано, градиент генератора исчезает.',
        en: 'Allowing the discriminator to overpower early on: an optimal discriminator produces vanishing generator gradients.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'gt-cp-3',
        question: {
          ru: 'Чему равен выход оптимального дискриминатора $D^*(x)$ в точке идеального глобального равновесия, когда $p_g = p_{data}$?',
          en: 'What is the output of the optimal discriminator $D^*(x)$ at global Nash equilibrium where $p_g = p_{data}$?',
        },
        options: [
          { ru: '1/2 (0.5)', en: '1/2 (0.5)' },
          { ru: '1.0', en: '1.0' },
          { ru: '0.0', en: '0.0' },
          { ru: 'Не определен', en: 'Undefined' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Когда распределения совпадают, $D^*(x) = \\frac{p_{data}}{p_{data} + p_{data}} = 1/2$. Дискриминатор не может отличить реальные данные от синтетических.',
          en: 'When distributions match, $D^*(x) = \\frac{p}{p + p} = 0.5$. The discriminator can do no better than random guessing.',
        },
      },
    ],
  },
];

export const gameTheoryCards: Card[] = [
  {
    id: 'gt-card-1',
    moduleId: 'game-theory',
    lessonId: 'gt-1-nash',
    type: 'flip',
    front: {
      ru: 'Что такое Равновесие Нэша (Nash Equilibrium)?',
      en: 'What is a Nash Equilibrium in Game Theory?',
    },
    back: {
      ru: 'Состояние игры, в котором стратегия каждого игрока является наилучшим ответом на стратегии оппонентов, и ни одному игроку не выгодно менять свой выбор в одностороннем порядке.',
      en: 'A state where each player strategy is a best response to opponents choices, such that no player gains from unilateral deviation.',
    },
    tags: ['game-theory', 'nash'],
  },
  {
    id: 'gt-card-2',
    moduleId: 'game-theory',
    lessonId: 'gt-2-minimax',
    type: 'cloze',
    clozeText: {
      ru: 'В антагонистической игре с нулевой суммой точка равновесия является {{c1::седловой точкой}} (saddle point) функции выигрыша.',
      en: 'In a two-player zero-sum game, the equilibrium is a {{c1::saddle point}} of the payoff function.',
    },
    answer: {
      ru: 'седловой точкой',
      en: 'saddle point',
    },
    tags: ['game-theory', 'minimax'],
  },
  {
    id: 'gt-card-3',
    moduleId: 'game-theory',
    lessonId: 'gt-3-gans',
    type: 'flip',
    front: {
      ru: 'Какую дивергенцию минимизирует классический GAN при оптимальном дискриминаторе?',
      en: 'Which divergence does a standard GAN minimize under an optimal discriminator?',
    },
    back: {
      ru: 'Дивергенцию Йенсена-Шеннона (Jensen-Shannon divergence, $D_{JS}$) между истинным распределением данных $p_{data}$ и модельным $p_g$.',
      en: 'The Jensen-Shannon divergence ($D_{JS}$) between data distribution $p_{data}$ and generator distribution $p_g$.',
    },
    tags: ['gans', 'math'],
  },
  {
    id: 'gt-card-4',
    moduleId: 'game-theory',
    lessonId: 'gt-3-gans',
    type: 'cloze',
    clozeText: {
      ru: 'Формула атаки FGSM добавляет состязательный шум по формуле $x_{adv} = x + \\epsilon \\cdot \\text{sign}({{\\nabla_x \\mathcal{L}}})$.',
      en: 'The FGSM attack generates adversarial perturbations via $x_{adv} = x + \\epsilon \\cdot \\text{sign}({{\\nabla_x \\mathcal{L}}})$.',
    },
    answer: {
      ru: '\\nabla_x \\mathcal{L}',
      en: '\\nabla_x \\mathcal{L}',
    },
    tags: ['adversarial', 'fgsm'],
  },
  {
    id: 'gt-card-5',
    moduleId: 'game-theory',
    lessonId: 'gt-3-gans',
    type: 'flip',
    front: {
      ru: 'Что такое Mode Collapse (коллапс мод) в GANs?',
      en: 'What is Mode Collapse in GAN architectures?',
    },
    back: {
      ru: 'Патология обучения, при которой генератор производит лишь узкое разнообразие образцов, успешно обманывающих текущий дискриминатор, игнорируя остальное многообразие данных.',
      en: 'A training failure where the generator yields narrow repetitive patterns that fool the discriminator, failing to cover the full data distribution.',
    },
    tags: ['gans', 'mode-collapse'],
  },
];

export const gameTheoryQuiz: QuizQuestion[] = [
  {
    id: 'gt-q-1',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Почему в задаче обучения GAN невозможно просто использовать стандартный оптимизатор минимизации без учета игры?',
      en: 'Why cannot GAN training simply use standard minimization without game-theoretic formulation?',
    },
    options: [
      {
        ru: 'Потому что оптимизация ведется для минимакса $\\min_G \\max_D V(D,G)$, что требует поиска седловой точки, а не глобального минимума одной функции',
        en: 'Because optimization solves a minimax problem $\\min_G \\max_D V(D,G)$ seeking a saddle point rather than a single scalar minimum',
      },
      {
        ru: 'Потому что в GAN не используются нейросети',
        en: 'Because GANs do not utilize neural networks',
      },
      {
        ru: 'Потому что вычисления требуют исключительно целочисленных весов',
        en: 'Because weights must strictly be integers',
      },
      {
        ru: 'Из-за отсутствия дифференцируемости у дискриминатора',
        en: 'Due to non-differentiability of the discriminator',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'GAN — это игра с противоположными целями. Стандартный спуск-подъем (simultaneous gradient descent) в минимаксе может входить в бесконечные круговые циклы или расходиться.',
      en: 'GAN optimization is non-cooperative; simultaneous gradient steps can cause cyclic limit orbits rather than convergence to saddle points.',
    },
    tag: 'gans',
  },
  {
    id: 'gt-q-2',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'В игре «Дилемма заключенного» почему стратегия «предать» является доминирующей для обоих участников?',
      en: 'In the Prisoner Dilemma, why is "defect" a strictly dominant strategy for both players?',
    },
    options: [
      {
        ru: 'Потому что при любом фиксированном действии партнера предать дает меньший срок наказания',
        en: 'Because regardless of what the partner plays, defection strictly minimizes individual prison sentence',
      },
      {
        ru: 'Потому что это максимизирует сумму лет заключения обоих',
        en: 'Because it maximizes total joint prison time',
      },
      {
        ru: 'Потому что игроки обязаны следовать указаниям судьи',
        en: 'Because players must follow judicial orders',
      },
      {
        ru: 'Потому что это приводит к оптимуму Парето',
        en: 'Because it achieves Pareto optimality',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Если партнер молчит, предательство дает 0 лет вместо 1. Если партнер предает, предательство дает 5 лет вместо 10. Предательство строго выгоднее в обоих случаях.',
      en: 'If partner cooperates: 0 vs 1 year. If partner defects: 5 vs 10 years. Defection is strictly advantageous under all conditions.',
    },
    tag: 'nash',
  },
  {
    id: 'gt-q-3',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Зачем в алгоритме FGSM (Fast Gradient Sign Method) берется функция $\\text{sign}(\\nabla_x \\mathcal{L})$?',
      en: 'Why does the FGSM algorithm apply $\\text{sign}(\\nabla_x \\mathcal{L})$ to loss gradients?',
    },
    options: [
      {
        ru: 'Чтобы максимизировать возмущение в $L_\\infty$-норме с ограничением $\\|\\delta\\|_\\infty \\le \\epsilon$',
        en: 'To maximize linear perturbation under an $L_\\infty$-norm constraint $\\|\\delta\\|_\\infty \\le \\epsilon$',
      },
      {
        ru: 'Для сжатия изображения в формат JPEG',
        en: 'To compress images into JPEG format',
      },
      {
        ru: 'Для фильтрации отрицательных пикселей',
        en: 'To filter out negative pixel values',
      },
      {
        ru: 'Чтобы гарантировать нулевое среднее значение шума',
        en: 'To ensure zero-mean Gaussian noise',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'В $L_\\infty$-норме максимальное приращение линейной функции достигается, когда каждая компонента сдвинута на $\\pm \\epsilon$ с тем же знаком, что и частная производная: $\\delta = \\epsilon \\cdot \\text{sign}(\\nabla_x \\mathcal{L})$.',
      en: 'Under an $L_\\infty$ bound $\\|\\delta\\|_\\infty \\le \\epsilon$, the dual norm problem is maximized by assigning $\\delta_i = \\epsilon \\cdot \\text{sign}(g_i)$.',
    },
    tag: 'adversarial',
  },
];
