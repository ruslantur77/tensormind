import { QuizQuestion } from '@/shared/lib/schemas';

export const BLITZ_QUESTIONS: QuizQuestion[] = [
  {
    "id": "blitz-1",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Какое геометрическое свойство L1-регуляризации (Lasso) приводит к занулению весов (разреженности)?",
      "en": "Which geometric property of L1 regularization (Lasso) leads to zeroing out weights (sparsity)?"
    },
    "options": [
      {
        "ru": "Острые ромбовидные углы линий уровня, касающиеся контуров потерь прямо на координатных осях",
        "en": "Sharp rhomboid corners of level curves touching loss contours directly on coordinate axes"
      },
      {
        "ru": "Круглая изотропная форма линий уровня, касающаяся контуров функции потерь в случайной гладкой точке",
        "en": "Circular isotropic level curves touching loss contours at arbitrary smooth points"
      },
      {
        "ru": "Постоянная вторая производная (гессиан равен единичной матрице во всех точках пространства)",
        "en": "Constant second derivative (Hessian equals identity matrix everywhere in parameter space)"
      },
      {
        "ru": "Асимптотическое затухание субградиента при удалении весов от разделяющей гиперплоскости",
        "en": "Asymptotic subgradient decay as weights move away from the separating hyperplane"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Линии уровня L1-нормы представляют собой многогранники (в 2D — ромбы) с недифференцируемыми вершинами на координатных осях. Контуры функции потерь с высокой вероятностью впервые касаются именно этих вершин, обращая соответствующие координаты в ровно 0.",
      "en": "L1-norm level curves are polytopes with sharp corners on the coordinate axes. Loss contours touch these non-differentiable vertices first, zeroing weights."
    },
    "tag": "regularization"
  },
  {
    "id": "blitz-2",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Почему в формуле градиентного спуска $w^{(t+1)} = w^{(t)} - \\eta \\nabla L$ стоит знак минус?",
      "en": "Why is there a minus sign in the gradient descent formula $w^{(t+1)} = w^{(t)} - \\eta \\nabla L$?"
    },
    "options": [
      {
        "ru": "Знак минус компенсирует положительную определенность матрицы Гессе целевой функции",
        "en": "The minus sign compensates for the positive-definiteness of the objective Hessian matrix"
      },
      {
        "ru": "Вектор градиента направлен в сторону наискорейшего роста функции, а мы минимизируем потери",
        "en": "The gradient vector points in the direction of steepest increase, while we seek to minimize loss"
      },
      {
        "ru": "Это необходимо для сохранения унитарности оператора обновления параметров в фазовом пространстве",
        "en": "It is required to preserve the unitarity of the parameter update operator in phase space"
      },
      {
        "ru": "Минус переводит стохастическую оптимизацию в детерминированный квазиньютоновский режим",
        "en": "The minus converts stochastic optimization into a deterministic quasi-Newton regime"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Градиент $\\nabla L$ указывает направление максимального возрастания ошибки. Для поиска минимума необходимо двигаться в противоположную сторону (по антиградиенту).",
      "en": "The gradient $\\nabla L$ points along the steepest ascent; minimizing requires moving in the opposite direction (antigradient)."
    },
    "tag": "optimization"
  },
  {
    "id": "blitz-3",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Что происходит при выборе чрезмерно большого шага обучения (Learning Rate $\\eta$) в градиентном спуске?",
      "en": "What happens when choosing an excessively large Learning Rate $\\eta$ in gradient descent?"
    },
    "options": [
      {
        "ru": "Градиентный спуск вырождается в метод Ньютона с квадратичной скоростью сходимости",
        "en": "Gradient descent degenerates into Newton method with quadratic convergence rate"
      },
      {
        "ru": "Норма градиента мгновенно обращается в ноль из-за численного андерфлоу в регистрах",
        "en": "Gradient norm immediately vanishes due to numerical underflow in floating point registers"
      },
      {
        "ru": "Веса модели осциллируют вокруг оптимума с нарастающей амплитудой, приводя к расходимости ошибки",
        "en": "Model weights oscillate around the valley with growing amplitude, causing the loss to diverge"
      },
      {
        "ru": "Модель моментально переобучается, зануляя эмпирический риск на всей обучающей выборке",
        "en": "The model instantly overfits, zeroing empirical risk across the entire training split"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "При слишком большом $\\eta$ шаг перелетает овраг целевой функции, и последующие значения потерь начинают неограниченно возрастать (расходиться).",
      "en": "An excessive learning rate overshoots valleys in the loss landscape, causing loss oscillation and exponential divergence."
    },
    "tag": "optimization"
  },
  {
    "id": "blitz-4",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В чем ключевое отличие функции потерь Huber от стандартного MSE в задачах регрессии?",
      "en": "What is the core difference between Huber Loss and MSE in regression?"
    },
    "options": [
      {
        "ru": "Huber loss строго монотонна и не имеет глобального минимума на неограниченных областях",
        "en": "Huber loss is strictly monotonic and lacks a global minimum on unbounded domains"
      },
      {
        "ru": "Huber loss оценивает логарифм отношения правдоподобия вместо расстояния между прогнозом и таргетом",
        "en": "Huber loss computes log-likelihood ratio rather than residual distance between prediction and target"
      },
      {
        "ru": "Huber loss кусочно-постоянна и вычисляет градиенты исключительно методом конечных разностей",
        "en": "Huber loss is piecewise constant and computes gradients exclusively via finite differences"
      },
      {
        "ru": "Huber loss штрафует малые ошибки квадратично, а при превышении порога $\\delta$ переходит в линейный рост",
        "en": "Huber loss penalizes small residuals quadratically and transitions to linear penalties beyond threshold $\\delta$"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Huber loss сочетает гладкость MSE при малых невязках $|y - \\hat{y}| \\le \\delta$ и робастность MAE при больших отклонениях, предотвращая взрыв градиентов из-за выбросов.",
      "en": "Huber loss combines quadratic curvature near zero with linear growth for large errors, resisting outlier distortion."
    },
    "tag": "loss-functions"
  },
  {
    "id": "blitz-5",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "За счет какого механизма оптимизатор Adam адаптирует скорость обучения для каждого отдельного параметра?",
      "en": "Through what mechanism does the Adam optimizer adapt learning rates for individual parameters?"
    },
    "options": [
      {
        "ru": "Через экспоненциальное сглаживание первых (среднее) и вторых (нецентрированная дисперсия) моментов градиентов",
        "en": "Via exponential moving averages of first (mean) and second (uncentered variance) gradient moments"
      },
      {
        "ru": "Через вычисление точного аналитического спектра собственных значений матрицы ковариации признаков",
        "en": "By computing the exact analytical eigenvalue spectrum of the input covariance matrix"
      },
      {
        "ru": "Через аппроксимацию обратного гессиана алгоритмом BFGS на каждом минибатче",
        "en": "Via inverse Hessian approximation using BFGS updates computed on each mini-batch"
      },
      {
        "ru": "Через динамическое изменение размера батча пропорционально скалярному произведению весов",
        "en": "By dynamically scaling the batch size proportionally to the dot product of weights"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Adam делит экспоненциальное скользящее среднее градиентов $m_t$ (первый момент) на корень из скользящего среднего квадратов градиентов $v_t$ (второй момент) с поправкой на смещение.",
      "en": "Adam scales updates by dividing the running momentum estimate $m_t$ by $\\sqrt{v_t} + \\epsilon$, individualizing steps per coordinate."
    },
    "tag": "optimization"
  },
  {
    "id": "blitz-6",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Каково основное теоретическое назначение L2-регуляризации (Ridge / Weight Decay)?",
      "en": "What is the primary theoretical goal of L2 regularization (Ridge / Weight Decay)?"
    },
    "options": [
      {
        "ru": "Принудительное приведение матрицы плана $X$ к верхнетреугольному виду Холецкого",
        "en": "Forcing the design matrix $X$ into upper-triangular Cholesky decomposition form"
      },
      {
        "ru": "Штрафование евклидовой нормы вектора весов для снижения дисперсии и устранения мультиколлинеарности",
        "en": "Penalizing the Euclidean norm of weight vectors to reduce variance and mitigate multicollinearity"
      },
      {
        "ru": "Строгое обнуление ровно половины наименее скоррелированных признаков",
        "en": "Strictly zeroing out exactly half of the least correlated input features"
      },
      {
        "ru": "Трансформация выпуклой задачи оптимизации в многоэкстремальную нелинейную поверхность",
        "en": "Transforming convex optimization problems into multi-modal non-linear surfaces"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Штраф $\\frac{\\lambda}{2}\\|w\\|^2$ добавляет $\\lambda I$ к матрице $X^T X$, делая ее обратимой и сдерживая взрыв весов при линейной зависимости признаков.",
      "en": "L2 regularization adds $\\lambda I$ to Gram matrix $X^T X$, ensuring non-singularity and preventing weights from exploding."
    },
    "tag": "regularization"
  },
  {
    "id": "blitz-7",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "В выборке 990 здоровых и 10 больных. Классификатор предсказывает «все здоровы». Какова его Accuracy?",
      "en": "In a sample of 990 healthy and 10 sick patients, a trivial classifier predicts \"all healthy\". What is its Accuracy?"
    },
    "options": [
      {
        "ru": "10%",
        "en": "10%"
      },
      {
        "ru": "50%",
        "en": "50%"
      },
      {
        "ru": "99%",
        "en": "99%"
      },
      {
        "ru": "0%",
        "en": "0%"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Accuracy = (TP + TN) / Total = (0 + 990) / 1000 = 99%. Это классический парадокс точности на несбалансированных данных.",
      "en": "Accuracy = 990 / 1000 = 99%, illustrating the Accuracy Paradox under extreme class imbalance."
    },
    "tag": "metrics"
  },
  {
    "id": "blitz-8",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В какой из перечисленных ситуаций бизнес-требования диктуют максимизацию Recall даже ценой существенного падения Precision?",
      "en": "In which scenario do product requirements mandate maximizing Recall even at the cost of lower Precision?"
    },
    "options": [
      {
        "ru": "Ранжирование видеороликов в ленте рекомендаций развлекательной платформы",
        "en": "Ranking video recommendations in a casual media streaming feed"
      },
      {
        "ru": "Подбор релевантных ключевых слов для контекстной рекламной кампании",
        "en": "Selecting targeted keywords for sponsored pay-per-click ad placement"
      },
      {
        "ru": "Автоматическая блокировка сомнительных комментариев в блоге с премодерацией",
        "en": "Automated filtering of borderline blog comments with pre-moderation"
      },
      {
        "ru": "Детекция редких критических дефектов авиационных турбин перед взлетом",
        "en": "Screening for rare catastrophic turbine cracks before aircraft departure"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Когда стоимость ошибки False Negative (пропуск дефекта) катастрофична, модель настраивают на максимальный Recall, сознательно допуская избыточные ложные тревоги (False Positives) для ручной проверки.",
      "en": "When False Negatives carry catastrophic consequences, high Recall is non-negotiable, accepting lower Precision for manual review."
    },
    "tag": "metrics"
  },
  {
    "id": "blitz-9",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Чему равен показатель площади под ROC-кривой (ROC-AUC) для абсолютно случайного бинарного классификатора?",
      "en": "What is the ROC-AUC score of a purely random binary classifier?"
    },
    "options": [
      {
        "ru": "0.5",
        "en": "0.5"
      },
      {
        "ru": "0.0",
        "en": "0.0"
      },
      {
        "ru": "1.0",
        "en": "1.0"
      },
      {
        "ru": "-1.0",
        "en": "-1.0"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Случайный классификатор порождает ROC-кривую, совпадающую с главной диагональю TPR = FPR. Площадь под единичным треугольником равна 0.5.",
      "en": "A random coin toss traces the line of no-discrimination (TPR = FPR), bounding an area under curve of exactly 0.5."
    },
    "tag": "metrics"
  },
  {
    "id": "blitz-10",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какая метрика классификации определяется как гармоническое среднее между Precision и Recall?",
      "en": "Which classification metric is defined as the harmonic mean between Precision and Recall?"
    },
    "options": [
      {
        "ru": "Balanced Accuracy",
        "en": "Balanced Accuracy"
      },
      {
        "ru": "F1-Score",
        "en": "F1-Score"
      },
      {
        "ru": "Cohen Kappa",
        "en": "Cohen Kappa"
      },
      {
        "ru": "Matthews Correlation Coefficient",
        "en": "Matthews Correlation Coefficient"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "F1-Score = 2 * (P * R) / (P + R). Гармоническое среднее сильно штрафует несбалансированность, если одна из метрик близка к нулю.",
      "en": "F1 is the harmonic mean $2 \\cdot \\frac{P \\cdot R}{P + R}$, heavily penalizing asymmetric degradation in either precision or recall."
    },
    "tag": "metrics"
  },
  {
    "id": "blitz-11",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Почему при сильном дисбалансе классов ($99.9\\%$ негативных примеров) метрика PR-AUC информативнее, чем ROC-AUC?",
      "en": "Why is PR-AUC significantly more informative than ROC-AUC under extreme class imbalance (99.9% negative samples)?"
    },
    "options": [
      {
        "ru": "PR-AUC инвариантна к монотонным преобразованиям вероятностей предсказаний",
        "en": "PR-AUC is invariant to monotonic probability recalibration transforms"
      },
      {
        "ru": "PR-AUC вычисляется только на обучающей выборке без использования кросс-валидации",
        "en": "PR-AUC can be evaluated strictly in-sample without cross-validation splits"
      },
      {
        "ru": "ROC-AUC страдает от огромного числа True Negatives в знаменателе FPR, создавая иллюзию высокого качества при плохом Precision",
        "en": "ROC-AUC denominator FPR = FP / (FP + TN) is overwhelmed by massive TNs, masking thousands of false alarms"
      },
      {
        "ru": "ROC-кривая не определена, если число положительных объектов меньше 100",
        "en": "ROC curves are mathematically undefined when positive sample count is under 100"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "В ROC-AUC формула FPR = FP / (FP + TN). Огромный пул TN сжимает FPR почти до нуля, из-за чего модель с миллионом ложных срабатываний может иметь ROC-AUC > 0.98. PR-AUC оценивает Precision = TP / (TP + FP) напрямую.",
      "en": "When TN is huge, FPR remains negligible even with excessive False Positives, inflating ROC-AUC. PR-AUC directly exposes poor Precision."
    },
    "tag": "metrics"
  },
  {
    "id": "blitz-12",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Каков основной механизм снижения ошибки обобщения в Random Forest по сравнению с одиночным решающим деревом?",
      "en": "What is the primary mechanism of error reduction in Random Forest compared to a single decision tree?"
    },
    "options": [
      {
        "ru": "Снижение смещения (bias) за счет последовательного градиентного исправления ошибок предыдущих деревьев",
        "en": "Reduction of bias via sequential gradient correction of previous tree residuals"
      },
      {
        "ru": "Автоматическая регуляризация весов с помощью квадратичного штрафа Тихонова на листьях",
        "en": "Automatic weight regularization using Tikhonov quadratic penalties across tree leaf nodes"
      },
      {
        "ru": "Преобразование кусочно-постоянной разделяющей поверхности в строго гладкую линейную гиперплоскость",
        "en": "Transforming piecewise-constant decision boundaries into strictly smooth linear hyperplanes"
      },
      {
        "ru": "Подавление разброса (variance) за счет усреднения слабокоррелированных деревьев, обученных на бутстрэп-выборках со случайными подпространствами признаков",
        "en": "Suppression of variance via averaging weakly correlated trees trained on bootstrap samples with random feature subspaces"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Одиночные глубокие деревья обладают низким bias и огромным variance. Усреднение ансамбля $M$ деревьев с парной корреляцией $\\rho$ дает дисперсию $\\rho \\sigma^2 + \\frac{1-\\rho}{M}\\sigma^2$, кардинально сбивая разброс.",
      "en": "Ensemble averaging de-correlated deep trees dampens variance according to Breiman formula while maintaining low inductive bias."
    },
    "tag": "trees-ensembles"
  },
  {
    "id": "blitz-13",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Что именно предсказывает каждое очередное базовое дерево $b_t(x)$ в градиентном бустинге (GBDT) для произвольной дифференцируемой функции потерь $L(y, F(x))$?",
      "en": "What exactly does each base tree $b_t(x)$ fit in Gradient Boosted Decision Trees (GBDT) for arbitrary differentiable loss $L(y, F(x))$?"
    },
    "options": [
      {
        "ru": "Антиградиент функции потерь (псевдоостатки) $-\\left[ \\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)} \\right]_{F=F_{t-1}}$ в точке текущего ансамбля",
        "en": "The negative gradient (pseudo-residuals) $-\\left[ \\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)} \\right]_{F=F_{t-1}}$ evaluated at current ensemble predictions"
      },
      {
        "ru": "Исходный целевой признак $y$, взвешенный с коэффициентом $\\alpha_t = \\frac{1}{2}\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}$",
        "en": "The original ground-truth target $y$ reweighted by $\\alpha_t = \\frac{1}{2}\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}$"
      },
      {
        "ru": "Вторую вариационную производную функционала энтропии Шеннона по пространству признаков",
        "en": "Second variational derivative of Shannon entropy functional with respect to feature space"
      },
      {
        "ru": "Остаточную дисперсию случайного шума измерений, оцененную алгоритмом Калмана",
        "en": "Residual variance of observation noise estimated via Kalman filtering"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Градиентный бустинг совершает шаг градиентного спуска в бесконечномерном функциональном пространстве: каждое дерево аппроксимирует направление наискорейшего убывания ошибки $-\\nabla_F L$.",
      "en": "GBDT conducts gradient descent in function space; each new estimator fits the negative functional gradient of the loss with respect to ensemble outputs."
    },
    "tag": "trees-ensembles"
  },
  {
    "id": "blitz-14",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Может ли Random Forest переобучиться исключительно из-за добавления слишком большого числа деревьев $N \\to \\infty$ при фиксированной их глубине?",
      "en": "Can a Random Forest overfit simply by adding an excessively large number of trees $N \\to \\infty$ with fixed tree depth?"
    },
    "options": [
      {
        "ru": "Да, после 100 деревьев ансамбль начинает воспроизводить точные координаты всех точек обучающей выборки",
        "en": "Yes, beyond 100 trees the ensemble memorizes exact sample coordinates of the training split"
      },
      {
        "ru": "Нет, согласно закону больших чисел и теореме Бреймана, ошибка обобщения сходится к конечному пределу",
        "en": "No, by the Law of Large Numbers and Breiman theorem, generalization error converges asymptotically to a finite limit"
      },
      {
        "ru": "Да, так как с ростом $N$ попарная корреляция деревьев неизбежно стремится к 1",
        "en": "Yes, because pairwise correlation between trees asymptotically approaches 1 as $N$ grows"
      },
      {
        "ru": "Нет, но только при условии, что каждое дерево построено с критерием расщепления MAE вместо Gini",
        "en": "No, but only under the constraint that trees use MAE splitting criterion instead of Gini"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Теорема Бреймана доказывает, что при $N \\to \\infty$ ошибка обобщения Random Forest почти наверное сходится к пределу, зависящему от силы деревьев и их корреляции. Переобучение определяется сложностью отдельных деревьев, а не их числом.",
      "en": "Breiman proved that generalization error converges as tree count approaches infinity. Adding trees does not increase variance or cause overfitting."
    },
    "tag": "trees-ensembles"
  },
  {
    "id": "blitz-15",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Какова математическая природа Out-of-Bag (OOB) оценки качества в бэггинге и случайных лесах?",
      "en": "What is the mathematical rationale behind Out-of-Bag (OOB) error estimation in bagging?"
    },
    "options": [
      {
        "ru": "Это байесовская апостериорная оценка вероятности расщепления корневого узла дерева",
        "en": "It is a Bayesian posterior probability estimate of splitting the root tree node"
      },
      {
        "ru": "OOB вычисляет теоретическую верхнюю границу Вапника-Червоненкиса для решающих списков",
        "en": "OOB computes the theoretical Vapnik-Chervonenkis upper bound for decision list complexity"
      },
      {
        "ru": "При бутстрэпе с возвращением размера $n$ вероятность объекта НЕ попасть в выборку составляет $(1 - 1/n)^n \\approx 1/e \\approx 36.8\\%$, образуя бесплатную валидационную выборку для каждого дерева",
        "en": "In bootstrap with replacement of size $n$, the probability of omitting any sample is $(1 - 1/n)^n \\approx 1/e \\approx 36.8\\%$, providing built-in validation"
      },
      {
        "ru": "OOB представляет собой регуляризационный штраф за нелинейность предикатов ветвления",
        "en": "OOB represents a regularization penalty for non-linearity of branch predicates"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Каждое дерево Random Forest обучается примерно на $63.2\\%$ уникальных объектов выборки. Оставшиеся $36.8\\%$ объектов (out-of-bag) используются для честной оценки обобщающей способности без выделения тестового сета.",
      "en": "Because $(1 - 1/n)^n \\to e^{-1} \\approx 0.368$, each bootstrap bag omits $\\approx 36.8\\%$ of samples, yielding unbiased cross-validation estimates without extra splits."
    },
    "tag": "trees-ensembles"
  },
  {
    "id": "blitz-16",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "В чем вычислительное преимущество критерия неоднородности Джини (Gini Impurity) перед информационной энтропией Шеннона в алгоритмах построения деревьев?",
      "en": "What is the computational advantage of Gini Impurity over Shannon Entropy in decision tree split algorithms?"
    },
    "options": [
      {
        "ru": "Критерий Джини инвариантен к масштабированию целевой переменной в регрессии",
        "en": "Gini impurity is invariant to target scaling transforms in continuous regression"
      },
      {
        "ru": "Критерий Джини гарантирует построение строго сбалансированных двоичных деревьев минимальной глубины",
        "en": "Gini impurity mathematically guarantees perfectly balanced binary trees of minimum depth"
      },
      {
        "ru": "Джини применим исключительно к непрерывным признакам, в то время как энтропия — только к категориальным",
        "en": "Gini applies strictly to continuous attributes, while entropy is valid solely for categorical features"
      },
      {
        "ru": "Критерий Джини $1 - \\sum p_k^2$ не требует вычисления трансцендентных логарифмов $\\log_2 p_k$, выполняясь существенно быстрее",
        "en": "Gini impurity $1 - \\sum p_k^2$ avoids costly transcendental $\\log_2 p_k$ calls, executing significantly faster on CPU"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Неоднородность Джини опирается на простые арифметические операции умножения и сложения $1 - \\sum p_k^2$, в то время как энтропия $-\\sum p_k \\log_2 p_k$ требует многократного вычисления логарифмов для тысяч потенциальных порогов.",
      "en": "Gini impurity avoids transcendental floating-point logarithm evaluations across candidate thresholds, accelerating training."
    },
    "tag": "trees-ensembles"
  },
  {
    "id": "blitz-17",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В каком сценарии плотностной алгоритм DBSCAN демонстрирует фундаментальное преимущество перед классическим K-Means?",
      "en": "In which scenario does density-based DBSCAN exhibit a fundamental advantage over classical K-Means?"
    },
    "options": [
      {
        "ru": "При наличии нелинейных кластеров сложной формы (кольца, спирали) и интенсивного фонового шума/выбросов",
        "en": "When clusters exhibit complex non-convex geometry (concentric rings, spirals) and heavy background noise"
      },
      {
        "ru": "При разбиении высокоразмерных разреженных текстовых матриц TF-IDF с фиксированным числом кластеров $K=100$",
        "en": "When partitioning high-dimensional sparse TF-IDF text matrices with a fixed cluster budget $K=100$"
      },
      {
        "ru": "Когда кластеры имеют существенно различающуюся плотность точек в евклидовом пространстве",
        "en": "When true underlying clusters feature widely divergent spatial point densities in Euclidean space"
      },
      {
        "ru": "Когда требуется строгая сходимость центроидов за константное число итераций $O(1)$",
        "en": "When deterministic centroid convergence is required within constant $O(1)$ iterations"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "K-Means строит выпуклые сферические ячейки Вороного и чувствителен к шуму. DBSCAN объединяет плотные связные области произвольной топологии и помечает разреженные изолированные точки как выбросы.",
      "en": "K-Means is restricted to convex Voronoi partitions. DBSCAN connects density-reachable cores into arbitrary manifolds while isolating noise."
    },
    "tag": "clustering"
  },
  {
    "id": "blitz-18",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Какова математическая идея схемы инициализации центроидов в алгоритме K-Means++?",
      "en": "What is the core mathematical mechanism behind K-Means++ centroid initialization?"
    },
    "options": [
      {
        "ru": "Центроиды размещаются в точках глобальных максимумов плотности ядерной оценки Парзена-Розенблатта",
        "en": "Centroids are placed at global density peaks of a Parzen-Rosenblatt kernel density estimator"
      },
      {
        "ru": "Каждый следующий центроид выбирается стохастически с вероятностью, пропорциональной квадрату расстояния до ближайшего уже выбранного центра: $P(x) \\propto D(x)^2$",
        "en": "Each subsequent centroid is chosen randomly with probability proportional to the squared distance to the nearest existing centroid: $P(x) \\propto D(x)^2$"
      },
      {
        "ru": "Все $K$ центроидов инициализируются собственными векторами выборочной ковариационной матрицы данных",
        "en": "All $K$ centroids are initialized as the leading eigenvectors of the sample covariance matrix"
      },
      {
        "ru": "Центроиды расставляются равномерно по периметру минимальной выпуклой оболочки выборки",
        "en": "Centroids are distributed uniformly along the convex hull perimeter of the data manifold"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "K-Means++ разносит начальные центроиды как можно дальше друг от друга с помощью вероятностной выборки $\\propto D(x)^2$. Это теоретически гарантирует $O(\\log K)$-аппроксимацию оптимальной инерции.",
      "en": "K-Means++ samples centers proportionally to squared distance $D(x)^2$, spreading seeds apart and proving an $O(\\log K)$ optimality bound."
    },
    "tag": "clustering"
  },
  {
    "id": "blitz-19",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "В чем проявляется геометрическое воздействие «проклятия размерности» на алгоритм k-NN при росте числа признаков $d \\to \\infty$?",
      "en": "How does the curse of dimensionality geometrically affect the k-NN algorithm as feature count $d \\to \\infty$?"
    },
    "options": [
      {
        "ru": "Количество соседей $k$ обязано расти экспоненциально $k = 2^d$ для сохранения непрерывности прогноза",
        "en": "Neighbor count $k$ must scale exponentially $k = 2^d$ to maintain continuous prediction boundaries"
      },
      {
        "ru": "Метрика расстояния Минковского перестает удовлетворять аксиоме симметричности",
        "en": "The Minkowski distance metric violates the axiom of symmetry in infinite-dimensional Banach spaces"
      },
      {
        "ru": "Относительная разность между расстоянием до ближайшего и самого дальнего соседа стремится к нулю: $\\lim_{d \\to \\infty} \\frac{\\text{dist}_{\\max} - \\text{dist}_{\\min}}{\\text{dist}_{\\min}} = 0$",
        "en": "The relative distance difference between nearest and farthest neighbors vanishes: $\\lim_{d \\to \\infty} \\frac{\\text{dist}_{\\max} - \\text{dist}_{\\min}}{\\text{dist}_{\\min}} = 0$"
      },
      {
        "ru": "Вычислительная сложность поиска соседей падает до $O(1)$ из-за ортогонализации признакового базиса",
        "en": "Nearest neighbor query complexity collapses to $O(1)$ due to orthogonalization of feature bases"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "В пространствах высокой размерности объем гиперсферы концентрируется в тонком приповерхностном слое, из-за чего расстояния между всеми парами точек становятся практически неразличимыми, а метрическое соседство теряет физический смысл.",
      "en": "As $d \\to \\infty$, relative distances concentrate around the mean, destroying distance contrast between nearest and farthest neighbors."
    },
    "tag": "metric-methods"
  },
  {
    "id": "blitz-20",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Что выражает значение коэффициента силуэта (Silhouette Coefficient) $s(i) \\approx +1.0$ для объекта кластеризации?",
      "en": "What does a Silhouette Coefficient of $s(i) \\approx +1.0$ signify for an individual sample in clustering?"
    },
    "options": [
      {
        "ru": "Объект находится строго на разделяющей границе между двумя соседними кластерами",
        "en": "The sample is situated directly along the decision boundary between two adjacent clusters"
      },
      {
        "ru": "Дисперсия внутри кластера превосходит расстояние между центроидами в 10 раз",
        "en": "Within-cluster variance exceeds between-centroid separation by tenfold"
      },
      {
        "ru": "Объект классифицирован как изолированная аномалия (шум) по критерию Махаланобиса",
        "en": "The sample is classified as an isolated outlier according to Mahalanobis distance thresholds"
      },
      {
        "ru": "Объект расположен значительно ближе к точкам своего кластера, чем к точкам ближайшего чужого кластера ($a(i) \\ll b(i)$)",
        "en": "The sample is significantly closer to members of its own cluster than to the nearest neighboring cluster ($a(i) \\ll b(i)$)"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Силуэт вычисляется по формуле $s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}$. Значение $+1$ достигается при $a(i) \\to 0$, означая плотное примыкание к своему кластеру и далекое отстояние от чужих.",
      "en": "Silhouette score $s = (b - a)/\\max(a, b)$ reaches $+1$ when mean intra-cluster distance $a$ is negligible relative to nearest cluster distance $b$."
    },
    "tag": "clustering"
  },
  {
    "id": "blitz-21",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Почему использование сигмоидальной функции активации $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ в глубоких полносвязных сетях вызывает эффект затухания градиентов (Vanishing Gradient)?",
      "en": "Why does using Sigmoid activation $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ in deep networks cause Vanishing Gradients?"
    },
    "options": [
      {
        "ru": "Максимальное значение ее производной равно $\\sigma'(0) = 0.25$, и при перемножении якобианов через $L$ слоев градиент затухает как $(0.25)^L$",
        "en": "Its maximum derivative is $\\sigma'(0) = 0.25$; chaining layer Jacobians across $L$ layers scales the gradient by $\\le (0.25)^L$"
      },
      {
        "ru": "Сигмоида не дифференцируема в нуле, из-за чего субградиентный спуск застревает в седловой точке",
        "en": "Sigmoid is non-differentiable at the origin, halting subgradient updates at saddle points"
      },
      {
        "ru": "Вторая производная сигмоиды строго положительна на всей числовой прямой, нарушая выпуклость",
        "en": "The second derivative of sigmoid is strictly positive over $\\mathbb{R}$, violating convexity"
      },
      {
        "ru": "Сигмоида переводит веса модели в комплексную плоскость при отрицательных значениях входа $z < 0$",
        "en": "Sigmoid projects weight tensors onto the complex plane when evaluated on negative inputs $z < 0$"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Поскольку $\\sigma'(z) = \\sigma(z)(1 - \\sigma(z)) \\le 0.25$, при обратном распространении ошибки через глубокую сеть градиент масштабируется факторами $\\le 1/4$ на каждом слое, экспоненциально исчезая к первым слоям.",
      "en": "Because $\\max \\sigma'(z) = 0.25$, chain rule multiplication scales backpropagated gradients by $\\le 4^{-L}$, extinguishing signals to early layers."
    },
    "tag": "neural-networks"
  },
  {
    "id": "blitz-22",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Как функционирует слой Dropout во время применения модели в режиме инференса (`model.eval()`)?",
      "en": "How does Dropout operate during model inference (`model.eval()`)?"
    },
    "options": [
      {
        "ru": "Продолжает случайно занулять нейроны с вероятностью $p$, но с фиксированным seed для воспроизводимости",
        "en": "Continues randomly masking neurons with probability $p$, using fixed PRNG seeds for determinism"
      },
      {
        "ru": "Полностью отключается: все нейроны остаются активными, пропуская сигнал без случайного зануления",
        "en": "It is disabled: all neurons remain active, passing activations deterministically without masking"
      },
      {
        "ru": "Инвертирует маску: зануляет те нейроны, которые были активны на последней эпохе обучения",
        "en": "Inverts the activation mask, dropping neurons that were active during the final training epoch"
      },
      {
        "ru": "Умножает веса последующего полносвязного слоя на дисперсию шума входного тензора",
        "en": "Multiplies dense layer weights by the variance of input tensor Gaussian noise"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "В режиме `eval()` слой Dropout деактивируется (работает как тождественное отображение Identity), позволяя задействовать полный ансамбль обученных связей сети без случайного шума.",
      "en": "During evaluation, Dropout becomes an identity pass-through, producing deterministic predictions from the aggregated ensemble of weights."
    },
    "tag": "neural-networks"
  },
  {
    "id": "blitz-23",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "С какой целью применяется метод ограничения нормы градиентов (Gradient Clipping) при обучении рекуррентных сетей (RNN/LSTM)?",
      "en": "Why is Gradient Clipping employed during recurrent network (RNN/LSTM) optimization?"
    },
    "options": [
      {
        "ru": "Для устранения разреженности весовых матриц в механизме скрытого состояния $h_t$",
        "en": "To eliminate sparsity in hidden state transition matrices $h_t$"
      },
      {
        "ru": "Для принудительного обращения в ноль градиентов по свободным членам (bias) слоев",
        "en": "To force gradients of layer bias vectors to exactly zero throughout BPTT"
      },
      {
        "ru": "Для предотвращения взрыва градиентов (Exploding Gradients) путем нормировки вектора шага при превышении заданного порога $\\|g\\| > c$",
        "en": "To prevent Exploding Gradients by rescaling the step vector whenever its Euclidean norm exceeds threshold $\\|g\\| > c$"
      },
      {
        "ru": "Для ускорения вычисления обратного распространения во времени (BPTT) за счет отсечения ветвей графа",
        "en": "To accelerate backpropagation through time by pruning subgraphs with low activation energy"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "В RNN при обратном проходе градиент по длинным последовательностям может многократно умножаться на матрицу весов $W_{hh}$, вызывая экспоненциальный взрыв. Клиппинг масштабирует $g \\leftarrow g \\cdot \\frac{c}{\\|g\\|}$, сохраняя направление градиента.",
      "en": "Clipping bounds the norm of gradient vectors while preserving their directional cosine similarity, preventing numerical overflow during BPTT."
    },
    "tag": "neural-networks"
  },
  {
    "id": "blitz-24",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Каков фундаментальный математический механизм сквозных связей (Residual Connections) $y = x + F(x)$ в архитектуре ResNet?",
      "en": "What is the fundamental mathematical mechanism of Residual Connections $y = x + F(x)$ in ResNet?"
    },
    "options": [
      {
        "ru": "Они снижают размерность тензора активаций в два раза, заменяя операцию пулинга",
        "en": "They reduce activation tensor dimensionality by half, replacing spatial pooling operations"
      },
      {
        "ru": "Они исключают необходимость использования обратного распространения ошибки благодаря прямому суммированию",
        "en": "They eliminate backpropagation requirements through direct additive feature routing"
      },
      {
        "ru": "Они принудительно заставляют блок $F(x)$ изучать строго ортогональное унитарное преобразование",
        "en": "They force sub-network $F(x)$ to learn strictly orthogonal unitary coordinate transformations"
      },
      {
        "ru": "При дифференцировании по входу $\\frac{\\partial (x + F(x))}{\\partial x} = I + \\frac{\\partial F}{\\partial x}$ слагаемое $I$ создает беспрепятственную магистраль для протекания градиента к ранним слоям сети",
        "en": "In differentiation $\\frac{\\partial (x + F(x))}{\\partial x} = I + \\frac{\\partial F}{\\partial x}$, identity $I$ creates an unattenuated gradient highway back to early layers"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Слагаемое $I$ в производной гарантирует, что даже если остаточный блок $\\frac{\\partial F}{\\partial x}$ затухает к нулю, градиент ошибки протекает через глубокую сеть без затухания, позволяя обучать сети из сотен слоев.",
      "en": "The identity term guarantees gradient preservation: $\\nabla_x L = \\nabla_y L (I + \\nabla_x F)$, preventing exponential attenuation across deep architectures."
    },
    "tag": "deep-learning"
  },
  {
    "id": "blitz-25",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "В чем заключается принципиальная разница между методами индексации `.loc` и `.iloc` в библиотеке Pandas?",
      "en": "What is the core distinction between indexing accessors `.loc` and `.iloc` in Pandas?"
    },
    "options": [
      {
        "ru": "`.loc` осуществляет выборку по текстовым и пользовательским меткам (labels), а `.iloc` — строго по целочисленным позициям (integer positions 0..n)",
        "en": "`.loc` slices by explicit index/column labels, whereas `.iloc` selects strictly by 0-based integer positions"
      },
      {
        "ru": "`.loc` возвращает копию данных в памяти (deep copy), а `.iloc` всегда возвращает представление (view)",
        "en": "`.loc` allocates an explicit deep memory copy, while `.iloc` strictly creates a lightweight view"
      },
      {
        "ru": "`.loc` поддерживает фильтрацию по булевым маскам, а `.iloc` предназначен исключительно для работы со строковыми типами",
        "en": "`.loc` supports boolean masks, whereas `.iloc` is designed solely for string categorical series"
      },
      {
        "ru": "`.loc` выполняет векторизованные операции на GPU, а `.iloc` ограничен однопоточным выполнением на CPU",
        "en": "`.loc` evaluates vectorized SIMD kernels on GPU, whereas `.iloc` runs single-threaded on CPU"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "`df.loc['row_label', 'col_label']` использует имена индексов и колонок. `df.iloc[0, 1]` работает исключительно с порядковыми номерами строк и столбцов (от 0 до len-1).",
      "en": "`.loc` is label-based slicing; `.iloc` is integer-positional indexing adhering to Python slice conventions."
    },
    "tag": "pandas"
  },
  {
    "id": "blitz-26",
    "type": "code_fill",
    "difficulty": "medium",
    "question": {
      "ru": "Какую функцию модуля model_selection библиотеки scikit-learn используют для разбиения выборки на обучающую и валидационную?",
      "en": "Which function from scikit-learn model_selection is used to partition data into train and validation splits?"
    },
    "codeSnippet": "from sklearn.model_selection import ___\nX_train, X_val, y_train, y_val = ___(X, y, test_size=0.2, random_state=42)",
    "options": [
      "train_test_split",
      "cross_val_score",
      "KFoldSplitter",
      "StratifiedShuffle"
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "`train_test_split` разбивает матрицы признаков и целевые векторы на непересекающиеся подвыборки с поддержкой стратификации (`stratify=y`).",
      "en": "`train_test_split` partitions arrays into random train and test subsets adhering to optional class stratification."
    },
    "tag": "sklearn"
  },
  {
    "id": "blitz-27",
    "type": "code_fill",
    "difficulty": "easy",
    "question": {
      "ru": "Какой метод перемещает PyTorch модель или тензор на указанное вычислительное устройство (GPU/CPU)?",
      "en": "Which method transfers a PyTorch model or tensor to the target hardware device (GPU/CPU)?"
    },
    "codeSnippet": "device = torch.device(\"cuda\" if torch.cuda.is_available() else \"cpu\")\nmodel = model.___(device)",
    "options": [
      "to",
      "cuda_cast",
      "transfer",
      "allocate"
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Метод `model.to(device)` перемещает все весовые параметры и буферы модуля PyTorch на целевое устройство (CUDA или CPU).",
      "en": "`model.to(device)` modifies module hardware placement, loading parameter tensors into specified device memory."
    },
    "tag": "pytorch"
  },
  {
    "id": "blitz-28",
    "type": "code_fill",
    "difficulty": "easy",
    "question": {
      "ru": "Какую команду необходимо вызвать перед вычислением градиентов `loss.backward()` в цикле обучения PyTorch?",
      "en": "Which method must be invoked before `loss.backward()` in a PyTorch training step?"
    },
    "codeSnippet": "optimizer.____()\nloss.backward()\noptimizer.step()",
    "options": [
      "step_back",
      "zero_grad",
      "flush_cache",
      "reset_state"
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "PyTorch по умолчанию аккумулирует (суммирует) градиенты в атрибуте `.grad`. Вызов `optimizer.zero_grad()` обнуляет градиенты перед вычислением новых значений на текущем батче.",
      "en": "PyTorch accumulates gradients across backward passes. `optimizer.zero_grad()` clears parameter gradient buffers before backprop."
    },
    "tag": "pytorch"
  },
  {
    "id": "blitz-29",
    "type": "code_fill",
    "difficulty": "easy",
    "question": {
      "ru": "Какой метод в библиотеке Pandas удаляет строки, содержащие хотя бы одно пропущенное значение (NaN)?",
      "en": "Which Pandas method drops rows containing at least one missing value (NaN)?"
    },
    "codeSnippet": "clean_df = df.____(how=\"any\", axis=0)",
    "options": [
      "drop_nulls",
      "dropna",
      "filter_na",
      "remove_empty"
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "`df.dropna(how=\"any\", axis=0)` удаляет строки, в которых есть хотя бы один пропуск NaN.",
      "en": "`df.dropna()` removes rows or columns containing null/missing entries."
    },
    "tag": "pandas"
  },
  {
    "id": "blitz-30",
    "type": "code_fill",
    "difficulty": "medium",
    "question": {
      "ru": "Какой контекстный менеджер отключает построение графа автодифференцирования при валидации/инференсе в PyTorch?",
      "en": "Which context manager disables autograd tracking during PyTorch inference/evaluation?"
    },
    "codeSnippet": "model.eval()\nwith torch.____():\n    predictions = model(val_tensors)",
    "options": [
      "no_grad",
      "inference_graph",
      "eval_scope",
      "frozen_weights"
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "`torch.no_grad()` отключает вычисление и сохранение графа Autograd, снижая потребление памяти и ускоряя вычисления во время инференса.",
      "en": "`torch.no_grad()` deactivates autograd tape recording, reducing RAM/VRAM consumption during validation."
    },
    "tag": "pytorch"
  },
  {
    "id": "blitz-31",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Если события $A$ и $B$ статистически независимы, чему равна вероятность их совместного наступления $P(A \\cap B)$?",
      "en": "If random events $A$ and $B$ are statistically independent, what is their joint probability $P(A \\cap B)$?"
    },
    "options": [
      {
        "ru": "$P(A) + P(B) - P(A \\cup B)$",
        "en": "$P(A) + P(B) - P(A \\cup B)$"
      },
      {
        "ru": "$\\frac{P(A|B)}{P(B|A)}$",
        "en": "$\\frac{P(A|B)}{P(B|A)}$"
      },
      {
        "ru": "$P(A) \\cdot P(B)$",
        "en": "$P(A) \\cdot P(B)$"
      },
      {
        "ru": "$\\max(P(A), P(B))$",
        "en": "$\\max(P(A), P(B))$"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "По определению статистической независимости случайных событий вероятность их одновременного наступления факторизуется в произведение маргинальных вероятностей: $P(A \\cap B) = P(A) \\cdot P(B)$.",
      "en": "By definition of statistical independence, joint probability factorizes as $P(A \\cap B) = P(A) P(B)$."
    },
    "tag": "probability"
  },
  {
    "id": "blitz-32",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Каково классическое выражение формулы Байеса для вычисления апостериорной вероятности гипотезы $P(A|B)$?",
      "en": "What is the formulation of Bayes theorem for posterior hypothesis probability $P(A|B)$?"
    },
    "options": [
      {
        "ru": "$P(A|B) = 1 - P(\\bar{A}|\\bar{B})$",
        "en": "$P(A|B) = 1 - P(\\bar{A}|\\bar{B})$"
      },
      {
        "ru": "$P(A|B) = \\frac{P(A) + P(B)}{P(A \\cap B)}$",
        "en": "$P(A|B) = \\frac{P(A) + P(B)}{P(A \\cap B)}$"
      },
      {
        "ru": "$P(A|B) = \\frac{P(A) \\cdot P(B)}{P(B|A)}$",
        "en": "$P(A|B) = \\frac{P(A) \\cdot P(B)}{P(B|A)}$"
      },
      {
        "ru": "$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$",
        "en": "$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Формула Байеса связывает апостериорную вероятность $P(A|B)$ с правдоподобием $P(B|A)$, априорной вероятностью $P(A)$ и маргинальной вероятностью свидетельства $P(B)$.",
      "en": "Bayes rule computes Posterior = (Likelihood * Prior) / Evidence."
    },
    "tag": "probability"
  },
  {
    "id": "blitz-33",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какая доля значений нормально распределенной случайной величины содержится в интервале $[mu - 2sigma, \\mu + 2sigma]$ согласно правилу трех сигм?",
      "en": "What fraction of a normally distributed random variable lies within $[mu - 2sigma, \\mu + 2sigma]$?"
    },
    "options": [
      {
        "ru": "~95.4%",
        "en": "~95.4%"
      },
      {
        "ru": "~68.3%",
        "en": "~68.3%"
      },
      {
        "ru": "~99.7%",
        "en": "~99.7%"
      },
      {
        "ru": "~50.0%",
        "en": "~50.0%"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Для нормального распределения в пределах $\\pm 1\\sigma$ лежит $\\approx 68.3\\%$, в пределах $\\pm 2\\sigma$ — $\\approx 95.4\\%$, а в пределах $\\pm 3\\sigma$ — $\\approx 99.7\\%$ всей вероятностной массы.",
      "en": "Empirical rule for Gaussian variables: $\\pm 1\\sigma \\approx 68.3\\%$, $\\pm 2\\sigma \\approx 95.4\\%$, $\\pm 3\\sigma \\approx 99.7\\%$."
    },
    "tag": "probability"
  },
  {
    "id": "blitz-34",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Почему в формуле несмещенной выборочной дисперсии $S^2 = \\frac{1}{n-1} \\sum_{i=1}^n (X_i - \\bar{X})^2$ делитель равен $n-1$, а не $n$ (поправка Бесселя)?",
      "en": "Why does the unbiased sample variance estimator use denominator $n-1$ instead of $n$ (Bessel correction)?"
    },
    "options": [
      {
        "ru": "Для компенсации асимметрии распределения Стьюдента при малых объемах выборки",
        "en": "To offset skewness in the Student t-distribution under small sample constraints"
      },
      {
        "ru": "Потому что одна степень свободы расходуется на оценку неизвестного истинного среднего $\\mu$ через выборочное среднее $\\bar{X}$, что систематически занижает дисперсию на фактор $\\frac{n-1}{n}$",
        "en": "Because estimating true mean $\\mu$ via sample mean $\\bar{X}$ consumes one degree of freedom, creating a systematic downward bias of $\\frac{n-1}{n}$"
      },
      {
        "ru": "Для выполнения условия Липшица при дифференцировании функции логарифмического правдоподобия",
        "en": "To satisfy the Lipschitz condition in log-likelihood score function differentiation"
      },
      {
        "ru": "Это обеспечивает сходимость ковариационной матрицы к диагональному виду при $n \\to \\infty$",
        "en": "It ensures asymptotic convergence of the sample covariance matrix to diagonal form"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Поскольку отклонения суммируются относительно выборочного среднего $\\bar{X}$, а не истинного $\\mu$, математическое ожидание $\\mathbb{E}[\\frac{1}{n}\\sum(X_i-\\bar{X})^2] = \\frac{n-1}{n}\\sigma^2$. Деление на $n-1$ устраняет смещение.",
      "en": "Deviations around $\\bar{X}$ underestimate true variance by factor $\\frac{n-1}{n}$. Multiplying by $\\frac{n}{n-1}$ yields an unbiased estimator $\\mathbb{E}[S^2] = \\sigma^2$."
    },
    "tag": "probability"
  },
  {
    "id": "blitz-35",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "В чем заключается точная формулировка классической Центральной предельной теоремы (Линдеберга-Леви)?",
      "en": "What is the formal statement of the classical Central Limit Theorem (Lindeberg-Levy)?"
    },
    "options": [
      {
        "ru": "Дисперсия выборочной медианы строго равна дисперсии выборочного среднего для любого распределения с конечным носителем",
        "en": "Sample median variance equals sample mean variance for any probability measure on compact support"
      },
      {
        "ru": "Выборочное среднее любой последовательности случайных величин почти наверное сходится к истинному математическому ожиданию",
        "en": "The sample mean of any sequence of random variables converges almost surely to the true expected value"
      },
      {
        "ru": "Нормированная сумма $n$ независимых одинаково распределенных случайных величин с конечной дисперсией слабо сходится по распределению к стандартному нормальному закону $\\mathcal{N}(0, 1)$ при $n \\to \\infty$",
        "en": "The normalized sum of $n$ i.i.d. random variables with finite variance converges weakly in distribution to standard normal $\\mathcal{N}(0, 1)$ as $n \\to \\infty$"
      },
      {
        "ru": "Энтропия произвольного непрерывного распределения монотонно возрастает до бесконечности при повторных свертках",
        "en": "Differential entropy of continuous distributions increases monotonically without bound under convolution"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "ЦПТ утверждает, что случайная величина $\\frac{\\sum X_i - n\\mu}{\\sigma \\sqrt{n}} \\xrightarrow{d} \\mathcal{N}(0, 1)$, объясняя появление гауссова распределения при сложении множества малых случайных эффектов.",
      "en": "CLT establishes weak convergence $\\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{d} \\mathcal{N}(0, 1)$ for any underlying distribution with finite second moment."
    },
    "tag": "probability"
  },
  {
    "id": "blitz-36",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Что характеризует состояние Равновесия Нэша в некооперативной теории игр?",
      "en": "What defines a Nash Equilibrium in non-cooperative Game Theory?"
    },
    "options": [
      {
        "ru": "Суммарный выигрыш всех игроков строго равен нулю (антагонистическая игра)",
        "en": "The aggregate social payoff across all participating agents sums to exactly zero"
      },
      {
        "ru": "Каждый игрок получает глобально максимально возможный выигрыш среди всех исходов игры",
        "en": "Every player simultaneously attains the highest theoretical payoff across game outcomes"
      },
      {
        "ru": "Все участники обязаны использовать исключительно чистые детерминированные стратегии",
        "en": "All agents are constrained to use strictly pure deterministic action strategies"
      },
      {
        "ru": "Ни один из игроков не может увеличить свой ожидаемый выигрыш односторонним изменением своей стратегии, если остальные сохраняют свои стратегии",
        "en": "No player can strictly improve their expected payoff by unilaterally deviating from their chosen strategy"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "В равновесии Нэша стратегия каждого агента является наилучшим ответом на фиксированные стратегии оппонентов, делая любое индивидуальное отклонение невыгодным.",
      "en": "In a Nash equilibrium, each player strategy is a best response to all other players strategies, rendering unilateral deviation non-beneficial."
    },
    "tag": "game-theory"
  },
  {
    "id": "blitz-37",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Что означает Парето-эффективность (Pareto Optimality) исхода в многоагентной системе?",
      "en": "What does Pareto Optimality signify in a multi-agent economic system?"
    },
    "options": [
      {
        "ru": "Состояние, при котором невозможно улучшить положение ни одного агента без одновременного ухудшения положения хотя бы одного другого",
        "en": "An outcome from which no agent can be made strictly better off without making at least one other agent strictly worse off"
      },
      {
        "ru": "Состояние, в котором суммарное благосостояние распределено строго поровну между всеми участниками",
        "en": "A state where total system endowment is allocated with strictly equal dispersion"
      },
      {
        "ru": "Исход, максимизирующий прибыль исключительно первого игрока, ходящего по праву инициативы",
        "en": "An equilibrium maximizing the utility of the first-mover agent possessing strategic initiative"
      },
      {
        "ru": "Решение, исключающее возникновение любых смешанных вероятностных стратегий",
        "en": "A resolution that eliminates the emergence of mixed randomized action profiles"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Парето-эффективность означает отсутствие Парето-улучшений. Известный пример Дилеммы заключенного показывает, что равновесие Нэша может быть Парето-неэффективным.",
      "en": "An outcome is Pareto optimal if no Pareto improvements are possible. Prisoner dilemma illustrates that Nash equilibria can be Pareto-suboptimal."
    },
    "tag": "game-theory"
  },
  {
    "id": "blitz-38",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Как формулируется целевой функционал состязательной игры генератора $G$ и дискриминатора $D$ в классической архитектуре GAN (Goodfellow et al.)?",
      "en": "How is the adversarial minimax objective formulated in original GANs (Goodfellow et al.)?"
    },
    "options": [
      {
        "ru": "$\\min_G \\min_D \\mathbb{E}_{x}[\\|x - G(D(x))\\|^2] + \\lambda \\text{KL}(D(x) \\| G(z))$",
        "en": "$\\min_G \\min_D \\mathbb{E}_{x}[\\|x - G(D(x))\\|^2] + \\lambda \\text{KL}(D(x) \\| G(z))$"
      },
      {
        "ru": "$\\min_G \\max_D \\mathbb{E}_{x \\sim p_{data}}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z}[\\log(1 - D(G(z)))]$",
        "en": "$\\min_G \\max_D \\mathbb{E}_{x \\sim p_{data}}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z}[\\log(1 - D(G(z)))]$"
      },
      {
        "ru": "$\\max_G \\min_D \\mathbb{E}_{x}[D(x)] - \\mathbb{E}_{z}[D(G(z))] - \\gamma \\|\\nabla_x D(x)\\|^2$",
        "en": "$\\max_G \\min_D \\mathbb{E}_{x}[D(x)] - \\mathbb{E}_{z}[D(G(z))] - \\gamma \\|\\nabla_x D(x)\\|^2$"
      },
      {
        "ru": "$\\min_G \\max_D \\text{Tr}(D^T G) - \\frac{1}{2}\\|G(z) - x\\|_1$",
        "en": "$\\min_G \\max_D \\text{Tr}(D^T G) - \\frac{1}{2}\\|G(z) - x\\|_1$"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Классический GAN представляет собой минимаксную игру двух агентов: дискриминатор $D$ максимизирует вероятность корректного распознавания реальных и синтетических данных, а генератор $G$ минимизирует вероятность раскрытия своих генераций.",
      "en": "GAN optimization is a two-player zero-sum game $\\min_G \\max_D V(D, G)$ which under optimal $D^*$ reduces to minimizing the Jensen-Shannon divergence."
    },
    "tag": "game-theory"
  },
  {
    "id": "blitz-39",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Что представляет собой явление коллапса мод (Mode Collapse) в процессе оптимизации сетей GAN?",
      "en": "What constitutes Mode Collapse during Generative Adversarial Network training?"
    },
    "options": [
      {
        "ru": "Численный взрыв весов дискриминатора, приводящий к переполнению IEEE-754 чисел",
        "en": "Numerical gradient explosion in discriminator weights causing floating-point overflow"
      },
      {
        "ru": "Случайное удаление полносвязных слоев генератора во время регуляризации весов",
        "en": "Spontaneous pruning of generative dense layers during spectral norm regularization"
      },
      {
        "ru": "Ситуация, когда генератор выучивает отображение всего латентного пространства в узкий набор повторяющихся схожих образцов, игнорируя разнообразие целевого распределения",
        "en": "A pathology where the generator maps diverse latent vectors into a narrow cluster of identical samples, ignoring distribution modes"
      },
      {
        "ru": "Падение точности дискриминатора до ровно 50% на обучающей выборке",
        "en": "Discriminator binary accuracy locking onto exactly 50% across training samples"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "При коллапсе мод генератор находит единственный «легкий» образ, гарантированно обманывающий текущий дискриминатор, и перестает воспроизводить все многообразие классов датасета.",
      "en": "Mode collapse occurs when $G$ collapses multi-modal distributions into a few safe archetypes that fool current $D$, destroying generation diversity."
    },
    "tag": "game-theory"
  },
  {
    "id": "blitz-40",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Как вычисляется состязательное возмущение изображения по методу FGSM (Fast Gradient Sign Method)?",
      "en": "How is the adversarial perturbation generated in the Fast Gradient Sign Method (FGSM)?"
    },
    "options": [
      {
        "ru": "$x_{adv} = x - \\epsilon \\cdot \\nabla_w L(f(x; w), y)$ по весовым параметрам $w$",
        "en": "$x_{adv} = x - \\epsilon \\cdot \\nabla_w L(f(x; w), y)$ with respect to model weights $w$"
      },
      {
        "ru": "$x_{adv} = \\text{FFT}^{-1}(\\text{HighPass}(\\text{FFT}(x))) + \\epsilon$",
        "en": "$x_{adv} = \\text{FFT}^{-1}(\\text{HighPass}(\\text{FFT}(x))) + \\epsilon$"
      },
      {
        "ru": "$x_{adv} = x \\odot \\text{Bernoulli}(p)$ со случайным маскированием каналов",
        "en": "$x_{adv} = x \\odot \\text{Bernoulli}(p)$ with stochastic channel drop masking"
      },
      {
        "ru": "$x_{adv} = x + \\epsilon \\cdot \\text{sign}(\\nabla_x L(\\theta, x, y))$ по пикселям входного изображения $x$",
        "en": "$x_{adv} = x + \\epsilon \\cdot \\text{sign}(\\nabla_x L(\\theta, x, y))$ with respect to input pixels $x$"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "FGSM делает один шаг длины $\\epsilon$ в направлении знака градиента функции потерь относительно входа $\\nabla_x L$, максимизируя ошибку классификации в пределах $\\ell_\\infty$-окрестности.",
      "en": "FGSM applies a one-step perturbation along the sign of the input loss gradient: $x_{adv} = x + \\epsilon \\cdot \\text{sign}(\\nabla_x L)$, inducing misclassification."
    },
    "tag": "adversarial"
  },
  {
    "id": "blitz-41",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Сколько различных перестановок без повторений можно составить из 5 различных признаков модели?",
      "en": "How many distinct permutations without repetition can be formed from 5 unique features?"
    },
    "options": [
      {
        "ru": "120",
        "en": "120"
      },
      {
        "ru": "60",
        "en": "60"
      },
      {
        "ru": "25",
        "en": "25"
      },
      {
        "ru": "240",
        "en": "240"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Число перестановок $P_5 = 5! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 120$.",
      "en": "Permutations without replacement: $P_5 = 5! = 120$."
    },
    "tag": "combinatorics"
  },
  {
    "id": "blitz-42",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Сколькими способами можно отобрать пару признаков из 10 доступных колонок для парного скаттерплота (порядок признаков в паре не имеет значения)?",
      "en": "In how many ways can 2 features be selected from 10 candidate columns for a scatter plot (order does not matter)?"
    },
    "options": [
      {
        "ru": "90",
        "en": "90"
      },
      {
        "ru": "45",
        "en": "45"
      },
      {
        "ru": "20",
        "en": "20"
      },
      {
        "ru": "100",
        "en": "100"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Число сочетаний $C_{10}^2 = \\frac{10!}{2! \\cdot 8!} = \\frac{10 \\cdot 9}{2} = 45$.",
      "en": "Combinations formula: $C_{10}^2 = \\frac{10 \\times 9}{2} = 45$."
    },
    "tag": "combinatorics"
  },
  {
    "id": "blitz-43",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Чему равно математическое ожидание случайной величины $X \\sim \\text{Binomial}(n, p)$ с $n$ испытаниями Бернулли и вероятностью успеха $p$?",
      "en": "What is the expected value of a Binomial random variable $X \\sim \\text{Binomial}(n, p)$?"
    },
    "options": [
      {
        "ru": "$n \\cdot p(1 - p)$",
        "en": "$n \\cdot p(1 - p)$"
      },
      {
        "ru": "$\\sqrt{n \\cdot p}$",
        "en": "$\\sqrt{n \\cdot p}$"
      },
      {
        "ru": "$n \\cdot p$",
        "en": "$n \\cdot p$"
      },
      {
        "ru": "$\\frac{p}{n}$",
        "en": "$\\frac{p}{n}$"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Математическое ожидание биномиального распределения равно сумме математических ожиданий $n$ независимых испытаний Бернулли: $\\mathbb{E}[X] = n \\cdot p$.",
      "en": "By linearity of expectation across $n$ Bernoulli trials, $\\mathbb{E}[X] = n \\cdot p$."
    },
    "tag": "probability"
  },
  {
    "id": "blitz-44",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Чему равна сумма всех биномиальных коэффициентов $\\sum_{k=0}^n C_n^k$ для множества из $n$ признаков?",
      "en": "What is the sum of all binomial coefficients $\\sum_{k=0}^n C_n^k$ for a set of $n$ features?"
    },
    "options": [
      {
        "ru": "$n!$",
        "en": "$n!$"
      },
      {
        "ru": "$2n$",
        "en": "$2n$"
      },
      {
        "ru": "$n^2$",
        "en": "$n^2$"
      },
      {
        "ru": "$2^n$",
        "en": "$2^n$"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "По формуле бинома Ньютона $(1 + 1)^n = \\sum_{k=0}^n C_n^k = 2^n$. Это в точности равно мощности булеана (числу всех возможных подмножеств признаков).",
      "en": "By the binomial theorem, $(1 + 1)^n = 2^n$, representing the total cardinality of the power set of $n$ features."
    },
    "tag": "combinatorics"
  },
  {
    "id": "blitz-45",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Что утверждает классический принцип Дирихле (Pigeonhole Principle) в дискретной математике при размещении $n+1$ объектов по $n$ контейнерам?",
      "en": "What does the Dirichlet Pigeonhole Principle state when placing $n+1$ items into $n$ containers?"
    },
    "options": [
      {
        "ru": "Хотя бы один контейнер гарантированно содержит не менее двух объектов",
        "en": "At least one container is guaranteed to hold two or more items"
      },
      {
        "ru": "Все контейнеры обязаны содержать равное число элементов",
        "en": "All containers are guaranteed to hold an identical number of items"
      },
      {
        "ru": "Хотя бы один контейнер обязательно останется полностью пустым",
        "en": "At least one container must remain completely empty"
      },
      {
        "ru": "Дисперсия заполненности контейнеров стремится к нулю",
        "en": "Variance of container fill ratios approaches zero"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Если мощность множества объектов строго превышает количество доступных ячеек, то по принципу Дирихле хотя бы в одной ячейке окажется два или более объекта.",
      "en": "Partitioning $n+1$ items into $n$ pigeonholes guarantees by contradiction that at least one bucket holds $\\ge 2$ items."
    },
    "tag": "combinatorics"
  },
  {
    "id": "blitz-46",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какая математическая формула выражает среднеквадратичную ошибку (Mean Squared Error, MSE)?",
      "en": "Which mathematical formula defines Mean Squared Error (MSE)?"
    },
    "options": [
      {
        "ru": "$\\frac{1}{n} \\sum_{i=1}^n |y_i - \\hat{y}_i|$",
        "en": "$\\frac{1}{n} \\sum_{i=1}^n |y_i - \\hat{y}_i|$"
      },
      {
        "ru": "$\\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2$",
        "en": "$\\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2$"
      },
      {
        "ru": "$\\sqrt{\\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)}$",
        "en": "$\\sqrt{\\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)}$"
      },
      {
        "ru": "$\\max_{i} |y_i - \\hat{y}_i|$",
        "en": "$\\max_{i} |y_i - \\hat{y}_i|$"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "MSE вычисляет среднее арифметическое квадратов разностей между реальными значениями $y_i$ и модельными прогнозами $\\hat{y}_i$.",
      "en": "MSE computes the mean of squared residuals $\\frac{1}{n} \\sum (y_i - \\hat{y}_i)^2$."
    },
    "tag": "metrics"
  },
  {
    "id": "blitz-47",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какой стандартный метод API библиотеки scikit-learn используется для обучения оценщика (Estimator) на данных?",
      "en": "Which standard scikit-learn Estimator API method fits parameters on training data?"
    },
    "options": [
      {
        "ru": ".train(X, y)",
        "en": ".train(X, y)"
      },
      {
        "ru": ".learn(X, y)",
        "en": ".learn(X, y)"
      },
      {
        "ru": ".fit(X, y)",
        "en": ".fit(X, y)"
      },
      {
        "ru": ".optimize(X, y)",
        "en": ".optimize(X, y)"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "В объектной модели scikit-learn любой алгоритм классификации, регрессии или трансформации реализует единый метод `.fit(X, y)` для настройки параметров.",
      "en": "Scikit-learn unified Estimator interface exposes `.fit(X, y)` to estimate internal parameters."
    },
    "tag": "sklearn"
  },
  {
    "id": "blitz-48",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Что характеризует эффект переобучения (Overfitting) алгоритма машинного обучения?",
      "en": "What characterizes Overfitting in machine learning models?"
    },
    "options": [
      {
        "ru": "Высокая ошибка на тренировочной выборке и столь же высокая ошибка на валидационном сете",
        "en": "High error on the training set and similarly high error on the validation split"
      },
      {
        "ru": "Неспособность модели выучить даже линейный тренд из-за недостаточной емкости архитектуры",
        "en": "Inability to learn simple linear trends due to insufficient model hypothesis capacity"
      },
      {
        "ru": "Зануление всех весов модели вследствие чрезмерной L2-регуляризации",
        "en": "Total zeroing of weights caused by excessive L2 regularization penalties"
      },
      {
        "ru": "Почти нулевая ошибка на обучающих данных в сочетании с резким ухудшением качества на независимых тестовых примерах",
        "en": "Near-zero loss on training data accompanied by sharp degradation on unseen test samples"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "При переобучении модель запоминает шум и индивидуальные особенности обучающей выборки, теряя способность к генерализации на новых данных.",
      "en": "Overfitting occurs when excess capacity memorizes training noise rather than true population signals."
    },
    "tag": "basics"
  },
  {
    "id": "blitz-49",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Как раскладывается среднеквадратичная ошибка модели в дилемме смещения и разброса (Bias-Variance Decomposition)?",
      "en": "What is the canonical Bias-Variance decomposition of expected mean squared test error?"
    },
    "options": [
      {
        "ru": "$\\text{MSE} = \\text{Bias}^2 + \\text{Variance} + \\sigma^2_{шум}$",
        "en": "$\\text{MSE} = \\text{Bias}^2 + \\text{Variance} + \\sigma^2_{noise}$"
      },
      {
        "ru": "$\\text{MSE} = \\text{Bias} \\cdot \\text{Variance} - \\text{Covariance}$",
        "en": "$\\text{MSE} = \\text{Bias} \\cdot \\text{Variance} - \\text{Covariance}$"
      },
      {
        "ru": "$\\text{MSE} = \\sqrt{\\text{Bias}^2 + \\text{Variance}^2}$",
        "en": "$\\text{MSE} = \\sqrt{\\text{Bias}^2 + \\text{Variance}^2}$"
      },
      {
        "ru": "$\\text{MSE} = \\frac{\\text{Bias}^2}{\\text{Variance}} + \\epsilon$",
        "en": "$\\text{MSE} = \\frac{\\text{Bias}^2}{\\text{Variance}} + \\epsilon$"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Ожидаемая ошибка модели состоит из трех компонентов: квадрата смещения (ошибка предположений модели), разброса (чувствительность к выборке) и неустранимого шума данных $\\sigma^2$.",
      "en": "Expected test MSE decomposes into squared bias (underfitting), variance (sensitivity/overfitting), and irreducible noise $\\sigma^2$."
    },
    "tag": "basics"
  },
  {
    "id": "blitz-50",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Что определяет условие Куна-Таккера (KKT) для взаимодополняющей нежесткости (Complementary Slackness) в задаче обучения SVM: $\\alpha_i [y_i (w^T x_i + b) - 1] = 0$?",
      "en": "What does KKT Complementary Slackness $\\alpha_i [y_i (w^T x_i + b) - 1] = 0$ imply in Support Vector Machines (SVM)?"
    },
    "options": [
      {
        "ru": "Все объекты выборки обязаны иметь строго ненулевые множители Лагранжа $\\alpha_i > 0$",
        "en": "All training samples must possess strictly positive Lagrange multipliers $\\alpha_i > 0$"
      },
      {
        "ru": "Множители Лагранжа $\\alpha_i > 0$ отличны от нуля только для опорных векторов, лежащих в точности на границе разделяющей полосы, а для внутренних точек $\\alpha_i = 0$",
        "en": "Lagrange multipliers $\\alpha_i > 0$ are non-zero solely for support vectors lying exactly on margin boundaries, while $\\alpha_i = 0$ for interior points"
      },
      {
        "ru": "Разделяющая гиперплоскость проходит строго через центроид положительного класса",
        "en": "The separating hyperplane passes strictly through the positive class centroid"
      },
      {
        "ru": "Ядро RBF вырождается в линейное при равенстве множителя единице",
        "en": "The RBF kernel degenerates to linear whenever the multiplier reaches unity"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Условие взаимодополняющей нежесткости доказывает разреженность SVM: веса $w = \\sum \\alpha_i y_i x_i$ определяются исключительно опорными векторами (для которых $y_i(w^Tx_i+b) = 1$).",
      "en": "Complementary slackness shows that only points lying on the margin support boundary have $\\alpha_i > 0$, giving SVM its sparse dual representation."
    },
    "tag": "svm"
  },
  {
    "id": "blitz-51",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Почему в формуле Scaled Dot-Product Attention $\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$ скалярные произведения делятся на $\\sqrt{d_k}$?",
      "en": "Why is the dot product scaled by $\\sqrt{d_k}$ in Scaled Dot-Product Attention?"
    },
    "options": [
      {
        "ru": "Для устранения сингулярности матрицы значений $V$ при обратном распространении ошибки",
        "en": "To eliminate singularity in the value matrix $V$ during backward passes"
      },
      {
        "ru": "Для принудительного ограничения спектральной нормы внимания единицей",
        "en": "To enforce a strict unitary spectral norm constraint across attention maps"
      },
      {
        "ru": "Без масштабирования при больших $d_k$ дисперсия скалярного произведения растет как $d_k$, выталкивая softmax в области с околонулевыми градиентами",
        "en": "Without scaling for large $d_k$, dot-product variance scales as $d_k$, pushing softmax into regions with vanishing gradients"
      },
      {
        "ru": "Это необходимо для преобразования внимания в строго причинную (causal) маску",
        "en": "It is required to transform self-attention into a strictly causal triangular mask"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Если компоненты векторов $q$ и $k$ независимы с $\\mathbb{D}=1$, то дисперсия их скалярного произведения равна $d_k$. При больших размерностях аргументы softmax становятся огромными, а производная softmax насыщается и затухает к нулю.",
      "en": "If $q_i, k_i \\sim \\mathcal{N}(0, 1)$, $\\text{Var}(q \\cdot k) = d_k$. Large magnitudes saturate softmax into regions with near-zero gradients."
    },
    "tag": "transformers"
  },
  {
    "id": "blitz-52",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Какова вычислительная сложность по времени стандартного Self-Attention механизма Трансформера относительно длины входной последовательности токенов $N$?",
      "en": "What is the time complexity of standard Transformer Self-Attention with respect to sequence length $N$?"
    },
    "options": [
      {
        "ru": "$O(N \\log N)$",
        "en": "$O(N \\log N)$"
      },
      {
        "ru": "$O(N)$",
        "en": "$O(N)$"
      },
      {
        "ru": "$O(N^3)$",
        "en": "$O(N^3)$"
      },
      {
        "ru": "$O(N^2)$",
        "en": "$O(N^2)$"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Матричное умножение $Q K^T$ перемножает матрицы формы $(N, d)$ и $(d, N)$, требуя $O(N^2 \\cdot d)$ операций, что создает квадратичную зависимость от длины контекста $N$.",
      "en": "Computing the attention matrix $Q K^T$ involves an $(N \\times d) \\times (d \\times N)$ matrix product, scaling quadratically as $O(N^2 d)$."
    },
    "tag": "transformers"
  },
  {
    "id": "blitz-53",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В чем разница между Batch Normalization и Layer Normalization?",
      "en": "What is the distinction between Batch Normalization and Layer Normalization?"
    },
    "options": [
      {
        "ru": "BatchNorm нормализует каждый признак по минибатчу объектов, а LayerNorm нормализует все признаки отдельного объекта независимо от размера батча",
        "en": "BatchNorm normalizes each feature across mini-batch samples, while LayerNorm normalizes all features within an individual sample independently of batch size"
      },
      {
        "ru": "BatchNorm используется исключительно в рекуррентных сетях, а LayerNorm — в сверточных слоях",
        "en": "BatchNorm is utilized exclusively in recurrent networks, while LayerNorm is applied in convolutional feature maps"
      },
      {
        "ru": "LayerNorm не содержит обучаемых параметров масштаба и сдвига $\\gamma, \\beta$",
        "en": "LayerNorm contains zero learnable scale and shift affine parameters $\\gamma, \\beta$"
      },
      {
        "ru": "BatchNorm вычисляет параметры нормализации только во время инференса модели",
        "en": "BatchNorm computes normalization statistics strictly during inference passes"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "BatchNorm зависит от размера батча и не подходит для NLP/последовательностей разной длины. LayerNorm считает $\\mu$ и $\\sigma$ по измерению признаков/каналов конкретного примера, идеально подходя для Трансформеров.",
      "en": "BatchNorm calculates statistics across batch elements $(N)$; LayerNorm calculates across channel/hidden dimensions $(C, H, W)$ per sample, making it batch-size independent."
    },
    "tag": "deep-learning"
  },
  {
    "id": "blitz-54",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Какую величину максимизируют главные компоненты в методе Principal Component Analysis (PCA)?",
      "en": "What quantity do principal component directions maximize in PCA?"
    },
    "options": [
      {
        "ru": "Информационную энтропию проекций данных на ядро отображения",
        "en": "Shannon information entropy of projections onto the nullspace"
      },
      {
        "ru": "Дисперсию проекций центрированных данных $w^T X^T X w$ при единичном ограничении нормы $|w|=1$",
        "en": "The variance of projected centered data $w^T X^T X w$ subject to unit norm constraint $\\|w\\|=1$"
      },
      {
        "ru": "Взаимную информацию (Mutual Information) между признаками и целевой переменной",
        "en": "Mutual Information between feature vectors and target labels"
      },
      {
        "ru": "Ранг выборочной корреляционной матрицы признаков",
        "en": "The algebraic rank of the sample correlation matrix"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Первая главная компонента находит направление максимальной дисперсии спроецированных данных, что математически эквивалентно собственному вектору ковариационной матрицы с максимальным собственным значением $\\lambda_1$.",
      "en": "PCA finds orthogonal projection axes maximizing projected data variance, matching the leading eigenvectors of the sample covariance matrix."
    },
    "tag": "pca"
  },
  {
    "id": "blitz-55",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В чем суть информационной энтропии Шеннона $H(X) = -\\sum p(x) \\log_2 p(x)$?",
      "en": "What is the theoretical interpretation of Shannon Entropy $H(X) = -\\sum p(x) \\log_2 p(x)$?"
    },
    "options": [
      {
        "ru": "Отношение правдоподобия двух конкурирующих нормальных распределений",
        "en": "Likelihood ratio test between two competing Gaussian density models"
      },
      {
        "ru": "Коэффициент детерминации нелинейной авторегрессионной модели",
        "en": "Coefficient of determination of a non-linear autoregressive pipeline"
      },
      {
        "ru": "Мера неопределенности или среднее количество информации (в битах), необходимое для описания состояния случайной величины",
        "en": "Measure of average uncertainty or the expected information content (in bits) required to encode outcomes"
      },
      {
        "ru": "Вероятность ошибки Байесовского классификатора на бесконечной выборке",
        "en": "Asymptotic error rate of a Bayesian classifier on infinite datasets"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Энтропия Шеннона измеряет среднюю степень непредсказуемости источника: она максимальна для равномерного распределения и равна 0 для детерминированного исхода.",
      "en": "Shannon entropy quantifies the expected unpredictability or surprise in a probability distribution, maximized by uniform distributions."
    },
    "tag": "information-theory"
  },
  {
    "id": "blitz-56",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Что выражает дивергенция Кульбака-Лейблера $D_{KL}(P \\| Q) = \\sum P(x) \\log \\frac{P(x)}{Q(x)}$?",
      "en": "What does the Kullback-Leibler (KL) Divergence $D_{KL}(P \\| Q)$ measure?"
    },
    "options": [
      {
        "ru": "Симметричное евклидово расстояние между двумя векторами вероятностей в гильбертовом пространстве",
        "en": "Symmetric Euclidean metric distance between probability vectors in Hilbert space"
      },
      {
        "ru": "Коэффициент ранговой корреляции Спирмена между дискретными случайными величинами",
        "en": "Spearman rank correlation coefficient between discrete random variables"
      },
      {
        "ru": "Геометрический угол между первыми собственными векторами двух ковариационных матриц",
        "en": "Geometric angle subtended between the leading eigenvectors of two covariance matrices"
      },
      {
        "ru": "Несимметричную меру потери информации (избыточных затрат бит) при приближении истинного распределения $P$ распределением $Q$",
        "en": "Non-symmetric measure of relative entropy (excess bits) lost when approximating true distribution $P$ with model $Q$"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Дивергенция KL (относительная энтропия) неотрицательна $D_{KL}(P \\| Q) \\ge 0$ и равна 0 тогда и только тогда, когда $P = Q$. Она несимметрична ($D_{KL}(P \\| Q) \\ne D_{KL}(Q \\| P)$), поэтому не является метрикой расстояния.",
      "en": "KL divergence measures relative entropy lost using distribution $Q$ to encode $P$. It is strictly non-negative but asymmetric ($D_{KL}(P \\| Q) \\ne D_{KL}(Q \\| P)$)."
    },
    "tag": "information-theory"
  },
  {
    "id": "blitz-57",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Что происходит с весами линейной регрессии при аналитическом решении нормального уравнения $w = (X^T X)^{-1} X^T y$, если признаки строго коллинеарны?",
      "en": "What happens to Ordinary Least Squares $w = (X^T X)^{-1} X^T y$ if input features are strictly collinear?"
    },
    "options": [
      {
        "ru": "Матрица $X^T X$ становится необратимой (сингулярной), и классическое нормальное уравнение не имеет единственного решения",
        "en": "Gram matrix $X^T X$ becomes singular (non-invertible), destroying solution uniqueness"
      },
      {
        "ru": "Модель вычисляет аналитическое решение за $O(1)$ операций",
        "en": "The estimator computes analytical weights in constant $O(1)$ runtime"
      },
      {
        "ru": "Все коэффициенты регрессии автоматически приравниваются к 1",
        "en": "All regression coefficients automatically normalize to 1"
      },
      {
        "ru": "Функция потерь MSE обращается в бесконечность для любых значений $w$",
        "en": "The MSE objective function diverges to infinity for all values of $w$"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "При строгой линейной зависимости признаков определитель матрицы Грама $\\det(X^T X) = 0$, матрица не имеет обратной, а система нормальных уравнений имеет бесконечное множество решений.",
      "en": "Collinear columns make $X^T X$ rank-deficient with zero determinant, rendering $(X^T X)^{-1}$ non-existent without regularization."
    },
    "tag": "linear-models"
  },
  {
    "id": "blitz-58",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Как в алгоритме t-SNE решается «проблема скучивания» (Crowding Problem) точек низкой размерности?",
      "en": "How does t-SNE resolve the Crowding Problem in low-dimensional space?"
    },
    "options": [
      {
        "ru": "Заменой евклидова расстояния на косинусное расстояние в исходном пространстве",
        "en": "Substituting Euclidean distance with cosine distance in the high-dimensional space"
      },
      {
        "ru": "Использованием распределения Стьюдента с 1 степенью свободы (распределение Коши) с тяжелыми хвостами в пространстве низкой размерности вместо Гауссианы",
        "en": "Employing a heavy-tailed Student-t distribution with 1 degree of freedom (Cauchy) in the low-dimensional map instead of a Gaussian"
      },
      {
        "ru": "Принудительным ортогонализированием координат проекции на каждой итерации",
        "en": "Enforcing orthogonal projection constraints across gradient iterations"
      },
      {
        "ru": "Увеличением параметра перплексии (perplexity) до бесконечности",
        "en": "Scaling the perplexity hyperparameter asymptotically to infinity"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "В 2D объеме вокруг точки значительно меньше места, чем в многомерном пространстве. Тяжелые хвосты распределения Стьюдента $q_{ij} \\propto (1 + \\|y_i - y_j\\|^2)^{-1}$ отталкивают умеренно далекие кластеры друг от друга, предотвращая скучивание.",
      "en": "The heavy tails of the Student-t distribution allow moderately distant points in high-D to map to far distances in 2D without collapsing."
    },
    "tag": "metric-methods"
  },
  {
    "id": "blitz-59",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В чем ключевое отличие алгоритма градиентного бустинга LightGBM от классического XGBoost в стратегии роста деревьев?",
      "en": "What is the key difference in tree growth strategy between LightGBM and classic XGBoost?"
    },
    "options": [
      {
        "ru": "LightGBM строит деревья по уровням (Level-wise), а XGBoost — по листьям (Leaf-wise)",
        "en": "LightGBM grows trees Level-wise (depth-first), while XGBoost grows Leaf-wise"
      },
      {
        "ru": "LightGBM не использует гистограммную дискретизацию непрерывных признаков",
        "en": "LightGBM avoids histogram binning of continuous input features"
      },
      {
        "ru": "LightGBM применяет стратегию роста по листьям (Leaf-wise / Best-first), выбирая лист с максимальным уменьшением функции потерь",
        "en": "LightGBM adopts a Leaf-wise (Best-first) growth strategy, splitting the leaf with maximum delta loss reduction"
      },
      {
        "ru": "XGBoost не поддерживает вычисление вторых производных гессиана",
        "en": "XGBoost lacks support for second-order Hessian loss derivatives"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Классический XGBoost по умолчанию растит деревья симметрично по слоям (level-wise), а LightGBM ищет лист с наибольшим выигрышем (leaf-wise), достигая меньшей ошибки при той же глубине.",
      "en": "LightGBM grows trees leaf-wise (best-first), splitting the leaf with the highest loss decrease, optimizing convergence speed over level-wise splits."
    },
    "tag": "trees-ensembles"
  },
  {
    "id": "blitz-60",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "В сингулярном разложении матрицы данных $A = U \\Sigma V^T$, чем являются диагональные элементы $\\sigma_i$ матрицы $\\Sigma$?",
      "en": "In Singular Value Decomposition (SVD) $A = U \\Sigma V^T$, what do diagonal entries $\\sigma_i$ of $\\Sigma$ represent?"
    },
    "options": [
      {
        "ru": "Диагональными элементами матрицы Гессе целевой функции потерь",
        "en": "Diagonal entries of the objective loss Hessian matrix"
      },
      {
        "ru": "Коэффициентами автокорреляции остатков модели регрессии",
        "en": "Autocorrelation coefficients of residual prediction errors"
      },
      {
        "ru": "Собственными значениями левой унитарной матрицы $U$",
        "en": "Eigenvalues of the left unitary matrix $U$"
      },
      {
        "ru": "Квадратными корнями из неотрицательных собственных чисел матрицы $A^T A$",
        "en": "Square roots of non-negative eigenvalues of the matrix $A^T A$"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Сингулярные числа матрицы $A$ равны $\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$. Они упорядочиваются по убыванию $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$ и отражают дисперсию вдоль главных осей.",
      "en": "Singular values $\\sigma_i$ of matrix $A$ are defined as the square roots of the eigenvalues of $A^T A$, determining energy along principal axes."
    },
    "tag": "pca"
  },
  {
    "id": "blitz-61",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какой метод в pandas используется для быстрой генерации описательной статистики (mean, std, quartiles) числовых колонок?",
      "en": "Which method in pandas generates summary statistics (mean, std, quartiles) for numeric columns?"
    },
    "options": [
      {
        "ru": "df.describe()",
        "en": "df.describe()"
      },
      {
        "ru": "df.summary()",
        "en": "df.summary()"
      },
      {
        "ru": "df.stats()",
        "en": "df.stats()"
      },
      {
        "ru": "df.info()",
        "en": "df.info()"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": ".describe() возвращает DataFrame со счетчиком, средним, стандартным отклонением, min, 25%, 50%, 75% и max для всех числовых колонок.",
      "en": ".describe() outputs summary statistics including count, mean, std, min, percentiles (25%, 50%, 75%), and max."
    },
    "tag": "eda-pandas"
  },
  {
    "id": "blitz-62",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Почему при масштабировании признаков (StandardScaler) метод `.fit()` вызывается ТОЛЬКО на обучающей выборке (train)?",
      "en": "Why must `.fit()` of feature scalers (e.g. StandardScaler) be called ONLY on the training split?"
    },
    "options": [
      {
        "ru": "Потому что на тестовой выборке числовые признаки заменяются на категориальные",
        "en": "Because test split numeric attributes must be converted to categorical bins"
      },
      {
        "ru": "Для предотвращения утечки данных (data leakage) из тестовой выборки в модель",
        "en": "To prevent data leakage from the test split into model preprocessing"
      },
      {
        "ru": "Для устранения сингулярности ковариационной матрицы тестового множества",
        "en": "To eliminate singularity of the test set sample covariance matrix"
      },
      {
        "ru": "Это техническое требование формата сериализации ONNX",
        "en": "It is a technical serialization constraint in the ONNX specification"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Если рассчитать $\\mu$ и $\\sigma$ по всему датасету, модель косвенно получит информацию о распределении теста (data leakage), завышая валидационные метрики.",
      "en": "Fitting scalers on test data causes data leakage, contaminating model evaluation with future distribution statistics."
    },
    "tag": "preprocessing"
  },
  {
    "id": "blitz-63",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "В чем фундаментальное преимущество `LazyFrame` перед `DataFrame` в библиотеке Polars?",
      "en": "What is the primary architectural advantage of `LazyFrame` over `DataFrame` in Polars?"
    },
    "options": [
      {
        "ru": "Хранение датасета исключительно в сжатом формате на SSD без использования RAM",
        "en": "Storing dataset exclusively in compressed form on SSD without RAM allocation"
      },
      {
        "ru": "Принудительное однопоточное выполнение для гарантированной детерминированности хэшей",
        "en": "Enforcing single-threaded execution to guarantee deterministic hash calculation"
      },
      {
        "ru": "Построение логического графа плана запроса с оптимизациями (Predicate & Projection Pushdown) до физического вычисления",
        "en": "Building a logical query plan graph optimized with Predicate & Projection Pushdown before execution"
      },
      {
        "ru": "Автоматическое преобразование всех вещественных чисел в целочисленные типы int32",
        "en": "Automatic truncation of all 64-bit floating point numbers into 32-bit integers"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "LazyFrame не загружает и не фильтрует данные сразу, а компилирует оптимизированный граф выполнения, отбрасывая ненужные столбцы и фильтруя строки прямо при чтении файлов.",
      "en": "LazyFrames build an execution graph that Polars optimizes using predicate/projection pushdown, streaming, and parallel execution upon `.collect()`."
    },
    "tag": "polars"
  },
  {
    "id": "blitz-64",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какой стандарт колоночного представления данных в памяти лежит в основе Polars и обеспечивает Zero-Copy взаимодействие?",
      "en": "Which in-memory columnar data specification forms the foundation of Polars and enables zero-copy sharing?"
    },
    "options": [
      {
        "ru": "Protocol Buffers",
        "en": "Protocol Buffers"
      },
      {
        "ru": "Apache Parquet",
        "en": "Apache Parquet"
      },
      {
        "ru": "HDF5 Column Store",
        "en": "HDF5 Column Store"
      },
      {
        "ru": "Apache Arrow",
        "en": "Apache Arrow"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Polars построен на Rust-реализации Apache Arrow, что дает кэш-дружественное расположение колонок и SIMD-векторизацию.",
      "en": "Polars is powered by Apache Arrow memory specification, enabling cache efficiency, SIMD vectorization, and zero-copy transfers."
    },
    "tag": "polars"
  },
  {
    "id": "blitz-65",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Что происходит в One-Hot Encoding при игнорировании дамми-ловушки (Dummy Variable Trap) в линейных моделях со свободным членом?",
      "en": "What happens in One-Hot Encoding if the Dummy Variable Trap is ignored in linear regression with an intercept?"
    },
    "options": [
      {
        "ru": "Возникает строгая линейная зависимость (мультиколлинеарность), делающая матрицу $X^T X$ сингулярной",
        "en": "Perfect multicollinearity arises, rendering the Gram matrix $X^T X$ non-invertible/singular"
      },
      {
        "ru": "Коэффициенты регуляризации Lasso обращаются в отрицательные величины",
        "en": "Lasso regularization multipliers turn strictly negative"
      },
      {
        "ru": "Категориальные столбцы преобразуются в случайный гауссов шум",
        "en": "Categorical dummy columns overflow into random Gaussian noise"
      },
      {
        "ru": "Деревья решений теряют способность находить предикаты разделения",
        "en": "Decision tree algorithms become unable to compute split points"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Сумма всех бинарных one-hot колонок равна вектору из единиц, который уже присутствует в виде интерсепта. В линейных моделях без регуляризации это ломает МНК; решение: `drop=\"first\"`.",
      "en": "The sum of all dummy indicators equals 1 (matching the intercept column), causing perfect collinearity. Dropping the first dummy (`drop=\"first\"`) resolves it."
    },
    "tag": "preprocessing"
  },
  {
    "id": "blitz-66",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Какой интервал значений считается нормальным по критерию Тьюки (межквартильный размах $IQR = Q_3 - Q_1$)?",
      "en": "Which interval defines regular values without outliers under Tukey Fences ($IQR = Q_3 - Q_1$)?"
    },
    "options": [
      {
        "ru": "$[\\mu - 3\\sigma,\\; \\mu + 3\\sigma]$",
        "en": "$[\\mu - 3\\sigma,\\; \\mu + 3\\sigma]$"
      },
      {
        "ru": "$[Q_1 - 1.5 \\cdot IQR,\\; Q_3 + 1.5 \\cdot IQR]$",
        "en": "$[Q_1 - 1.5 \\cdot IQR,\\; Q_3 + 1.5 \\cdot IQR]$"
      },
      {
        "ru": "$[Q_1 - 3.0 \\cdot IQR,\\; Q_3 + 3.0 \\cdot IQR]$",
        "en": "$[Q_1 - 3.0 \\cdot IQR,\\; Q_3 + 3.0 \\cdot IQR]$"
      },
      {
        "ru": "$[0,\\; 2 \\cdot IQR]$",
        "en": "$[0,\\; 2 \\cdot IQR]$"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "По правилу Тьюки точки за пределами $[Q_1 - 1.5 \\cdot IQR, Q_3 + 1.5 \\cdot IQR]$ считаются умеренными выбросами (outliers), а за пределами $3 \\cdot IQR$ — экстремальными.",
      "en": "Under Tukey rule, data points outside $[Q_1 - 1.5 \\cdot IQR, Q_3 + 1.5 \\cdot IQR]$ are classified as outliers."
    },
    "tag": "eda-pandas"
  },
  {
    "id": "blitz-67",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "В чем заключается математическая суть позиционного кодирования RoPE (Rotary Position Embedding) в современных LLM (Llama, Mistral)?",
      "en": "What is the mathematical mechanism of Rotary Position Embedding (RoPE) in modern LLMs?"
    },
    "options": [
      {
        "ru": "Сложение обучаемого вектора смещения $P_i$ с эмбеддингом токена перед входом в Transformer",
        "en": "Adding a learnable bias vector $P_i$ directly to token embeddings prior to the first layer"
      },
      {
        "ru": "Умножение матрицы внимания на статическую маску внимания ALiBi со скалярным наклоном",
        "en": "Multiplying the attention logits matrix by a static ALiBi slope bias mask"
      },
      {
        "ru": "Вращение 2D-подпространств векторов Query и Key в комплексной плоскости на угол, пропорциональный позиции $m \\theta_i$",
        "en": "Rotating 2D orthogonal subspaces of Query and Key vectors in the complex plane by an angle proportional to position $m \\theta_i$"
      },
      {
        "ru": "Аппроксимация расстояния между токенами через спектральное разложение графа внимания",
        "en": "Approximating inter-token distance via spectral decomposition of the attention graph"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "RoPE умножает пары координат векторов $Q$ и $K$ на 2D-матрицу поворота $R_{\\Theta, m}^d$. Благодаря этому скалярное произведение $q_m^T k_n$ зависит строго от относительного смещения $m - n$.",
      "en": "RoPE applies an orthogonal rotation matrix to pairs of coordinates in $Q$ and $K$, encoding relative position $m-n$ via inner products."
    },
    "tag": "transformers"
  },
  {
    "id": "blitz-68",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Почему оптимизатор AdamW превосходит классический Adam при использовании L2-регуляризации в глубоких сетях?",
      "en": "Why is AdamW superior to standard Adam when applying weight decay to deep architectures?"
    },
    "options": [
      {
        "ru": "AdamW вычисляет точный гессиан функции потерь без использования приближения моментов",
        "en": "AdamW computes the exact Hessian matrix of the loss without moment approximations"
      },
      {
        "ru": "AdamW гарантирует сходимость к седловым точкам с положительной кривизной",
        "en": "AdamW mathematically guarantees convergence strictly to saddle points with positive curvature"
      },
      {
        "ru": "AdamW заменяет операции с плавающей запятой на целочисленную арифметику FP8",
        "en": "AdamW replaces floating point matrix multiplication with quantized 8-bit integer kernels"
      },
      {
        "ru": "В AdamW распад весов (weight decay) отвязан от градиентного обновления и не масштабируется на адаптивный знаменатель $\\sqrt{v_t} + \\epsilon$",
        "en": "In AdamW, weight decay is decoupled from gradient steps and not scaled by the adaptive second moment denominator $\\sqrt{v_t} + \\epsilon$"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "В стандартном Adam добавление L2-штрафа к градиенту приводит к тому, что веса с большими историческими градиентами штрафуются слабее, чем веса с редкими градиентами. AdamW разделяет эти операции ($w_{t+1} = w_t (1 - \\eta \\lambda) - \\eta \\frac{m_t}{\\sqrt{v_t}+\\epsilon}$).",
      "en": "Loshchilov & Hutter showed Adam couples weight decay with gradient moments, penalizing frequent gradients less. AdamW decouples weight decay."
    },
    "tag": "optimization"
  },
  {
    "id": "blitz-69",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какова основная функция слоя Softmax в задаче многоклассовой классификации?",
      "en": "What is the primary function of the Softmax layer in multi-class classification?"
    },
    "options": [
      {
        "ru": "Преобразование вещественных логитов в распределение вероятностей, где все элементы $\\in [0, 1]$ и их сумма строго равна 1",
        "en": "Converting real-valued logits into a probability distribution where elements $\\in [0, 1]$ and sum strictly to 1"
      },
      {
        "ru": "Принудительное обнуление отрицательных весов сети аналогично функции ReLU",
        "en": "Clipping negative weight tensors to zero identically to the ReLU activation function"
      },
      {
        "ru": "Ортогонализация матрицы скрытых представлений последнего слоя",
        "en": "Orthogonalizing the hidden representation matrix of the final layer"
      },
      {
        "ru": "Снижение размерности пространства эмбеддингов до скаляра",
        "en": "Compressing the embedding vector space down into a single scalar value"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Softmax экспоненцирует входные логиты $\\frac{e^{z_i}}{\\sum e^{z_j}}$, нормализуя их в валидное дискретное распределение вероятностей.",
      "en": "Softmax exponentiates logits and divides by their sum, mapping unbounded values into valid probabilities summing to 1."
    },
    "tag": "neural-networks"
  },
  {
    "id": "blitz-70",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Что выражает метрика Cross-Entropy Loss (перекрестная энтропия) при обучении классификаторов?",
      "en": "What does Cross-Entropy Loss measure during classifier optimization?"
    },
    "options": [
      {
        "ru": "Косинусное расстояние между вектором весов и вектором признаков объекта",
        "en": "Cosine distance between the model weight vector and sample feature vector"
      },
      {
        "ru": "Отрицательный логарифм вероятности, предсказанной моделью для истинного целевого класса: $-\\log p(y_{true})$",
        "en": "Negative log-likelihood of the probability assigned by the model to the true class: $-\\log p(y_{true})$"
      },
      {
        "ru": "Разницу между дисперсиями предсказаний модели на обучающей и тестовой выборках",
        "en": "The difference between prediction variances on training and validation splits"
      },
      {
        "ru": "Количество нейронов, активированных при прямом проходе через сеть",
        "en": "The count of active neurons firing during forward propagation through the network"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Для one-hot разметки Cross-Entropy равна $-\\log(\\hat{y}_{correct})$. Если модель уверена в верном ответе ($hat{y} \\to 1$), ошибка стремится к 0; если дает малую вероятность ($\\hat{y} \\to 0$), ошибка стремится к $+\\infty$.",
      "en": "Cross-entropy simplifies to $-\\sum y_i \\log \\hat{y}_i$. Penalties explode asymptotically as predicted probability for the ground truth drops to zero."
    },
    "tag": "loss-functions"
  },
  {
    "id": "blitz-71",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "В диффузионных вероятностных моделях (DDPM), какую целевую величину предсказывает нейросеть U-Net на каждом шаге обратного процесса?",
      "en": "In Denoising Diffusion Probabilistic Models (DDPM), what target quantity does the U-Net predict at each reverse step?"
    },
    "options": [
      {
        "ru": "Исходное чистое изображение $x_0$ без использования латентного представления",
        "en": "The clean original image $x_0$ directly without latent space formulations"
      },
      {
        "ru": "Дивергенцию Кульбака-Лейблера между соседними шагами прямой цепи Маркова",
        "en": "The Kullback-Leibler divergence between adjacent states in the forward Markov chain"
      },
      {
        "ru": "Шум $\\epsilon_t \\sim \\mathcal{N}(0, I)$, который был добавлен к изображению на шаге $t$",
        "en": "The Gaussian noise $\\epsilon_t \\sim \\mathcal{N}(0, I)$ that was added to the sample at timestep $t$"
      },
      {
        "ru": "Спектральную плотность мощности градиента по времени $t$",
        "en": "The power spectral density of temporal gradient flows across diffusion timesteps"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Хо и соавторы (Ho et al., 2020) доказали, что параметризация модели на предсказание добавленного шума $\\epsilon_\\theta(x_t, t)$ значительно превосходит прямое предсказание $x_0$ по стабильности и качеству сэмплов.",
      "en": "DDPM parameterizes the network to predict the noise $\\epsilon_\\theta(x_t, t)$ added at timestep $t$, optimizing a simplified variational lower bound."
    },
    "tag": "deep-learning"
  },
  {
    "id": "blitz-72",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Каково главное преимущество векторного квантования в архитектуре VQ-VAE?",
      "en": "What is the main design feature of Vector Quantization in VQ-VAE?"
    },
    "options": [
      {
        "ru": "Ограничение глубины дерева квантования константой $O(\\log N)$",
        "en": "Bounding vector tree quantization depth by an asymptotic $O(\\log N)$ ceiling"
      },
      {
        "ru": "Устранение необходимости вычисления производных при обучении дискриминатора",
        "en": "Eliminating the need to backpropagate through convolutional downsampling kernels"
      },
      {
        "ru": "Автоматическое преобразование цветных RGB изображений в спектрограммы",
        "en": "Automatic real-time translation of RGB imagery into spatial audio spectrograms"
      },
      {
        "ru": "Замена непрерывного латентного пространства дискретной кодовой книгой (Codebook) эмбеддингов, исключающая проблему Posterior Collapse",
        "en": "Replacing continuous latent spaces with a discrete codebook of embeddings, circumventing posterior collapse"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "VQ-VAE сопоставляет непрерывные выходы энкодера с ближайшим вектором из дискретного словаря (codebook) с помощью Straight-Through Estimator, устраняя коллапс мод и размытость обычных VAE.",
      "en": "VQ-VAE uses discrete codebooks with straight-through gradient estimators, avoiding posterior collapse and generating sharp representations."
    },
    "tag": "deep-learning"
  },
  {
    "id": "blitz-73",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "В чем заключается основное достоинство сверточных слоев (CNN) при обработке изображений по сравнению с полносвязными (MLP)?",
      "en": "What is the primary advantage of Convolutional layers (CNN) over dense layers (MLP) for images?"
    },
    "options": [
      {
        "ru": "Разделение весов (Weight Sharing) и трансляционная инвариантность/эквивариантность локальных паттернов при кардинально меньшем числе параметров",
        "en": "Weight Sharing and translational equivariance of local patterns with drastically fewer trainable parameters"
      },
      {
        "ru": "Полное отсутствие необходимости в функциях нелинейной активации",
        "en": "Complete elimination of requirements for non-linear activation functions"
      },
      {
        "ru": "Гарантированная выпуклость функции потерь при любой глубине сети",
        "en": "Mathematically guaranteed convexity of the empirical loss landscape across arbitrary depth"
      },
      {
        "ru": "Возможность обучения модели без использования градиентного спуска",
        "en": "Ability to estimate optimal filter weights without gradient descent iterations"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Сверточные ядра имеют локальное поле восприятия (receptive field) и одни и те же веса для всех участков изображения, что резко сокращает число весов и учитывает пространственную 2D-структуру данных.",
      "en": "Convolutions exploit spatial locality and weight sharing, enabling translation equivariance with orders of magnitude fewer parameters than MLPs."
    },
    "tag": "deep-learning"
  },
  {
    "id": "blitz-74",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Какую проблему решает слой Multi-Head Attention по сравнению с Single-Head Attention в архитектуре Transformer?",
      "en": "What issue does Multi-Head Attention address over Single-Head Attention in Transformers?"
    },
    "options": [
      {
        "ru": "Уменьшает квадратичную сложность $O(N^2)$ до строго линейной $O(N)$",
        "en": "Reduces the quadratic time complexity $O(N^2)$ down to strictly linear $O(N)$"
      },
      {
        "ru": "Позволяет модели одновременно фокусироваться на информации из различных позиций и подпространств признаков (синтаксис, семантика, кореференция)",
        "en": "Enables the model to jointly attend to information from different representation subspaces at different positions"
      },
      {
        "ru": "Устраняет необходимость нормализации слоев LayerNorm между блоками",
        "en": "Eliminates the requirement for intermediate LayerNorm normalizations between blocks"
      },
      {
        "ru": "Автоматически предотвращает переобучение при работе с короткими текстами",
        "en": "Mathematically prevents overfitting during training on small corpus splits"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Разбиение размерности $d_{model}$ на $h$ голов позволяет независимо проецировать запросы, ключи и значения в различные подпространства, улавливая одновременно разнотипные связи между словами.",
      "en": "Multi-head attention projects $Q, K, V$ into multiple smaller subspaces ($d_k = d_{model}/h$), capturing distinct linguistic relationships simultaneously."
    },
    "tag": "transformers"
  },
  {
    "id": "blitz-75",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Какое утверждение справедливо относительно алгоритма оптимизации LoRA (Low-Rank Adaptation) для Fine-Tuning LLM?",
      "en": "Which statement accurately describes Low-Rank Adaptation (LoRA) for LLM fine-tuning?"
    },
    "options": [
      {
        "ru": "LoRA изменяет только смещения (bias) и коэффициенты нормализации LayerNorm",
        "en": "LoRA optimizes strictly the bias vectors and LayerNorm scaling parameters"
      },
      {
        "ru": "Все полносвязные слои заменяются рекуррентными ячейками GRU с квантованием FP4",
        "en": "All dense projection layers are replaced with recurrent GRU cells quantized to FP4"
      },
      {
        "ru": "Веса исходной модели $W_0$ замораживаются, а инкремент весов представляется факторизацией низкого ранга $\\Delta W = B \\cdot A$, где $B \\in \\mathbb{R}^{d \\times r}, A \\in \\mathbb{R}^{r \\times k}$ при $r \\ll \\min(d, k)$",
        "en": "Frozen base weights $W_0$ receive additive low-rank updates $\\Delta W = B \\cdot A$ with rank $r \\ll \\min(d, k)$, training drastically fewer parameters"
      },
      {
        "ru": "Адаптация происходит исключительно через модификацию токенизатора без градиентных шагов",
        "en": "Adaptation is achieved strictly by fine-tuning the vocabulary tokenizer without gradients"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "LoRA предполагает, что изменение весов при адаптации к целевой задаче имеет низкий внутренний ранг (intrinsic rank). Обучение матриц $A$ и $B$ сокращает число обучаемых параметров на 99% без замедления инференса ($W = W_0 + BA$).",
      "en": "LoRA decomposes weight updates into two low-rank matrices $BA$, training $<1\\%$ of parameters while allowing zero-latency inference by merging $W_0 + BA$."
    },
    "tag": "transformers"
  },
  {
    "id": "blitz-76",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Для чего в методе k-Fold кросс-валидации выборка разбивается на $K$ блоков (фолдов)?",
      "en": "What is the purpose of partitioning data into $K$ folds in k-Fold Cross-Validation?"
    },
    "options": [
      {
        "ru": "Для устранения шума измерений с помощью $K$-мерного дискретного вейвлет-преобразования",
        "en": "Denoising sensor observations using a $K$-dimensional discrete wavelet transform"
      },
      {
        "ru": "Для увеличения размера исходной выборки в $K$ раз методом интерполяции",
        "en": "Synthetically expanding dataset size by $K$-fold via feature interpolation"
      },
      {
        "ru": "Для обучения $K$ принципиально разных алгоритмов машинного обучения на одних и тех же данных",
        "en": "Training $K$ distinct model families on identical training splits for stacking ensembles"
      },
      {
        "ru": "Для последовательного обучения модели на $K-1$ блоке и валидации на оставшемся с усреднением метрики по всем $K$ итерациям",
        "en": "Iteratively training on $K-1$ folds and evaluating on the held-out fold, averaging performance across all $K$ rounds"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "k-Fold кросс-валидация позволяет каждому объекту побывать в роли тестового ровно один раз, давая устойчивую оценку обобщающей способности модели.",
      "en": "k-Fold cross-validation uses every data point for both training and validation across $K$ rounds, minimizing split-dependent evaluation bias."
    },
    "tag": "basics"
  },
  {
    "id": "blitz-77",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В чем разница между параметрическими и непараметрическими моделями машинного обучения?",
      "en": "What is the fundamental difference between parametric and non-parametric ML models?"
    },
    "options": [
      {
        "ru": "Параметрические модели имеют фиксированное число параметров, не зависящее от размера обучающей выборки (например, логистическая регрессия), а сложность непараметрических растет с объемом данных (например, k-NN)",
        "en": "Parametric models have a fixed parameter count independent of sample size (e.g. Logistic Regression), while non-parametric complexity scales with data (e.g. k-NN)"
      },
      {
        "ru": "Параметрические модели обучаются без использования функции потерь",
        "en": "Parametric models train without defining an explicit empirical loss objective"
      },
      {
        "ru": "Непараметрические модели не способны работать с числовыми непрерывными признаками",
        "en": "Non-parametric models are fundamentally incapable of processing continuous features"
      },
      {
        "ru": "Параметрические модели всегда обладают более высоким разбросом (variance), чем непараметрические",
        "en": "Parametric models strictly exhibit higher variance than non-parametric alternatives"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Параметрическая модель сжимает обучающие данные в фиксированный вектор параметров $\\theta \\in \\mathbb{R}^d$. Непараметрические модели (k-NN, ядерная плотность) сохраняют данные или их фрагменты, масштабируя память с ростом $n$.",
      "en": "Parametric models summarize data into a fixed number of parameters. Non-parametric models grow representation capacity as dataset size expands."
    },
    "tag": "basics"
  },
  {
    "id": "blitz-78",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Что выражает нижняя граница доказательства (Evidence Lower Bound, ELBO) в вариационных автоэнкодерах (VAE)?",
      "en": "What does the Evidence Lower Bound (ELBO) represent in Variational Autoencoders (VAE)?"
    },
    "options": [
      {
        "ru": "Точное значение информационной размерности Реньи для фрактального многообразия данных",
        "en": "Exact analytical evaluation of Renyi information dimension across fractal data manifolds"
      },
      {
        "ru": "$\\log p(x) \\ge \\mathbb{E}_{q_\\phi(z|x)}[\\log p_\\theta(x|z)] - D_{KL}(q_\\phi(z|x) \\| p(z))$: сумма качества реконструкции и штрафа за отклонение апостериорного распределения от априорного",
        "en": "$\\log p(x) \\ge \\mathbb{E}_{q_\\phi(z|x)}[\\log p_\\theta(x|z)] - D_{KL}(q_\\phi(z|x) \\| p(z))$: reconstruction fidelity minus KL divergence from latent prior"
      },
      {
        "ru": "Эвристическую верхнюю оценку ошибки дискриминатора в состязательном обучении WGAN-GP",
        "en": "Heuristic upper bound on discriminator Wasserstein distance in gradient-penalized GANs"
      },
      {
        "ru": "Отношение правдоподобия эмпирической ковариации к диагональному гауссову базису",
        "en": "Likelihood ratio of empirical feature covariance to diagonal Gaussian isotropic baselines"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "ELBO является оптимизируемой нижней оценкой логарифма маргинального правдоподобия $\\log p(x)$. Ее максимизация балансирует точность восстановления данных и близость латентного распределения к стандартному нормальному $\\mathcal{N}(0, I)$.",
      "en": "ELBO provides a tractable surrogate for intractable marginal likelihood $\\log p(x)$, trading off reconstruction log-likelihood against latent KL regularizer."
    },
    "tag": "deep-learning"
  },
  {
    "id": "blitz-79",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Что делает функция активации ReLU (Rectified Linear Unit)?",
      "en": "What does the ReLU (Rectified Linear Unit) activation function compute?"
    },
    "options": [
      {
        "ru": "$f(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$",
        "en": "$f(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$"
      },
      {
        "ru": "$f(x) = \\frac{1}{1 + e^{-x}}$",
        "en": "$f(x) = \\frac{1}{1 + e^{-x}}$"
      },
      {
        "ru": "$f(x) = \\max(0, x)$",
        "en": "$f(x) = \\max(0, x)$"
      },
      {
        "ru": "$f(x) = x^2$",
        "en": "$f(x) = x^2$"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "ReLU возвращает $x$, если $x > 0$, и $0$ в противном случае. Ее производная равна $1$ для всех $x > 0$, что предотвращает затухание градиента в положительной области.",
      "en": "ReLU computes $f(x) = \\max(0, x)$. Its unit gradient for positive activations prevents saturation and vanishing gradients."
    },
    "tag": "neural-networks"
  },
  {
    "id": "blitz-80",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Что такое проблема «умирающих ReLU» (Dying ReLU Problem)?",
      "en": "What is the Dying ReLU problem in neural network training?"
    },
    "options": [
      {
        "ru": "Ситуация, когда нейрон выдает отрицательные значения активации при любых входах",
        "en": "A state where neurons produce negative activations on all input vectors"
      },
      {
        "ru": "Периодическая смена знака весов при использовании стохастического импульса Нестерова",
        "en": "Periodic sign oscillation of weights during Nesterov accelerated momentum updates"
      },
      {
        "ru": "Экспоненциальный взрыв весов нейрона из-за слишком малого шага обучения",
        "en": "Exponential parameter growth caused by an excessively small learning rate"
      },
      {
        "ru": "Состояние, когда веса нейрона смещаются так, что на всех обучающих примерах $x \\le 0$, из-за чего градиент равен 0 и нейрон навсегда перестает обновляться",
        "en": "A state where weights shift such that inputs to the unit are always $\\le 0$, permanently zeroing gradients and freezing weights"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Если из-за неудачного большого шага взвешенная сумма на входе в ReLU всегда отрицательна, производная равна 0 для всех примеров выборки, и градиентный спуск не может оживить такой нейрон. Решение — Leaky ReLU или PReLU.",
      "en": "When a neuron outputs $\\le 0$ across the training set, its derivative is $0$, permanently halting backpropagation updates for that unit."
    },
    "tag": "neural-networks"
  },
  {
    "id": "blitz-81",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Какова роль «трюка с повторной параметризацией» (Reparameterization Trick) в Variational Autoencoders (VAE)?",
      "en": "What is the function of the Reparameterization Trick in Variational Autoencoders (VAE)?"
    },
    "options": [
      {
        "ru": "Вынесение стохастичности из вычислительного графа: $z = \\mu(x) + \\sigma(x) \\odot \\epsilon$, где $\\epsilon \\sim \\mathcal{N}(0, I)$, что позволяет дифференцировать целевую функцию по параметрам энкодера",
        "en": "Isolating stochasticity outside the computation graph: $z = \\mu(x) + \\sigma(x) \\odot \\epsilon$ with $\\epsilon \\sim \\mathcal{N}(0, I)$, enabling backprop through encoder parameters"
      },
      {
        "ru": "Замена сверточных слоев на плотные линейные слои с разреженным представлением",
        "en": "Replacing convolutional layers with sparse dense matrix decompositions"
      },
      {
        "ru": "Аппроксимация интеграла по латентному пространству методом Монте-Карло с марковскими цепями",
        "en": "Approximating latent integrals via Markov Chain Monte Carlo transition kernels"
      },
      {
        "ru": "Нормализация градиентов декодера к единичной $\\ell_2$-сфере перед оптимизацией",
        "en": "Normalizing decoder gradients onto the unit $\\ell_2$ hypersphere prior to optimization"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Прямое сэмплирование $z \\sim \\mathcal{N}(\\mu, \\sigma^2)$ блокирует обратное распространение ошибки, так как случайная операция недифференцируема. Трюк выражает $z$ детерминированно через вспомогательный внешний шум $\\epsilon$.",
      "en": "Sampling is non-differentiable. Expressing $z = \\mu + \\sigma \\odot \\epsilon$ makes the latent code a differentiable function of parameters $\\mu$ and $\\sigma$."
    },
    "tag": "deep-learning"
  },
  {
    "id": "blitz-82",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В чем состоит главное различие между алгоритмами оптимизации SGD с моментом (Momentum) и классическим SGD?",
      "en": "What is the key mechanism of SGD with Momentum compared to standard SGD?"
    },
    "options": [
      {
        "ru": "Momentum вычисляет градиенты исключительно по случайно выбранной одной координате",
        "en": "Momentum computes directional derivatives strictly along a single randomly sampled coordinate"
      },
      {
        "ru": "Momentum накапливает экспоненциальное скользящее среднее предыдущих градиентов $v_t = \\gamma v_{t-1} + \\eta \\nabla L$, сглаживая колебания в оврагах и ускоряя движение вдоль устойчивого направления",
        "en": "Momentum maintains an exponential moving average of past gradients $v_t = \\gamma v_{t-1} + \\eta \\nabla L$, dampening oscillations across ravines and accelerating descent"
      },
      {
        "ru": "Momentum гарантирует абсолютную выпуклость функции потерь на каждом шаге",
        "en": "Momentum mathematically enforces local convexity of the empirical loss at each step"
      },
      {
        "ru": "Momentum динамически увеличивает размер минибатча в 2 раза на каждой эпохе",
        "en": "Momentum doubles the mini-batch size dynamically at the conclusion of each epoch"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Импульс моделирует физическое движение тяжелого шара с инерцией: паразитные колебания по крутым склонам взаимно гасятся, а шаги в направлении спуска накапливаются.",
      "en": "Momentum adds inertia to gradient updates, averaging out orthogonal oscillations and accelerating progress along consistent trajectory directions."
    },
    "tag": "optimization"
  },
  {
    "id": "blitz-83",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Что представляет собой матрица ошибок (Confusion Matrix) для задачи бинарной классификации?",
      "en": "What does a binary classification Confusion Matrix summarize?"
    },
    "options": [
      {
        "ru": "Спектральное разложение ковариационной матрицы между предсказаниями и таргетом",
        "en": "The spectral decomposition of cross-covariance between predictions and targets"
      },
      {
        "ru": "Матрицу вторых производных функции потерь по весовым параметрам классификатора",
        "en": "The matrix of second partial derivatives of the loss with respect to classifier weights"
      },
      {
        "ru": "Таблицу $2 \\times 2$ со счетчиками истинно положительных (TP), ложноположительных (FP), истинно отрицательных (TN) и ложноотрицательных (FN) исходов",
        "en": "A $2 \\times 2$ contingency table reporting True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN)"
      },
      {
        "ru": "Таблицу весов линейной комбинации признаков в логистической регрессии",
        "en": "A summary table of linear feature combination weights in logistic regression"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Confusion Matrix сопоставляет предсказанные классы с реальными, служа основой для расчета Precision, Recall, Specificity, Accuracy и F-меры.",
      "en": "The confusion matrix cross-tabulates actual vs predicted labels into TP, FP, TN, FN categories, serving as the basis for all standard classification metrics."
    },
    "tag": "metrics"
  },
  {
    "id": "blitz-84",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Что выражает коэффициент детерминации $R^2$ в задачах линейной регрессии?",
      "en": "What does the Coefficient of Determination ($R^2$) represent in regression analysis?"
    },
    "options": [
      {
        "ru": "Квадрат коэффициента регуляризации $\\lambda^2$ в задаче Ridge-регрессии",
        "en": "Squared Tikhonov regularization penalty $\\lambda^2$ in Ridge regression formulation"
      },
      {
        "ru": "Евклидово расстояние между вектором коэффициентов и вектором единиц",
        "en": "Euclidean distance between estimated regression coefficients and the ones vector"
      },
      {
        "ru": "Вероятность отсутствия гетероскедастичности в остатках регрессионной модели",
        "en": "Probability of homoscedasticity in regression residuals under Breusch-Pagan testing"
      },
      {
        "ru": "Долю дисперсии целевой переменной, объясненную построенной моделью: $R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$",
        "en": "The proportion of target variance explained by model predictions: $R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "$R^2 = 1$ соответствует идеальному предсказанию, $R^2 = 0$ означает, что модель работает не лучше простого константного среднего $\\bar{y}$, а отрицательный $R^2$ указывает на то, что модель хуже среднего.",
      "en": "$R^2$ measures the proportion of total sum of squares explained by regression. $R^2 = 1$ is a perfect fit; $R^2 < 0$ implies worse performance than baseline mean."
    },
    "tag": "metrics"
  },
  {
    "id": "blitz-85",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Каково главное теоретическое свойство ядерного трюка (Kernel Trick) в Support Vector Machines (SVM)?",
      "en": "What is the primary theoretical insight of the Kernel Trick in SVM?"
    },
    "options": [
      {
        "ru": "Возможность вычислять скалярные произведения в спрямляющем пространстве бесконечной размерности $\\langle \\phi(x), \\phi(z) \\rangle = K(x, z)$ напрямую, без явного вычисления координат $\\phi(x)$",
        "en": "Evaluating inner products in high-dimensional feature spaces $\\langle \\phi(x), \\phi(z) \\rangle = K(x, z)$ directly, without explicitly computing mapped vectors $\\phi(x)$"
      },
      {
        "ru": "Приведение нелинейной классификации к задаче безусловной одномерной оптимизации",
        "en": "Reducing non-linear classification to unconstrained 1D scalar line search optimization"
      },
      {
        "ru": "Автоматическое обращение матрицы Грама за $O(1)$ операций благодаря теореме Теплица",
        "en": "Inverting the kernel Gram matrix in constant $O(1)$ time via Toeplitz matrix properties"
      },
      {
        "ru": "Устранение зависимости числа опорных векторов от объема обучающей выборки",
        "en": "Eliminating dependency between support vector count and training set cardinality"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Теорема Мерсера гарантирует, что непрерывное симметричное положительно определенное ядро $K(x, z)$ соответствует скалярному произведению в гильбертовом пространстве, избавляя от вычислительно невозможного построения бесконечномерных признаков.",
      "en": "Mercers theorem allows kernels like RBF to implicitly evaluate inner products in infinite-dimensional Hilbert spaces with zero explicit projection overhead."
    },
    "tag": "svm"
  },
  {
    "id": "blitz-86",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какую цель преследует метод ранней остановки (Early Stopping) в процессе обучения нейросетей?",
      "en": "What is the primary objective of Early Stopping during neural network training?"
    },
    "options": [
      {
        "ru": "Ограничение максимального количества параметров в полносвязных слоях сети",
        "en": "Bounding the maximum number of trainable weights within dense layer tensors"
      },
      {
        "ru": "Остановка оптимизации при начале устойчивого роста ошибки на валидационной выборке для предотвращения переобучения",
        "en": "Halting optimization when validation loss starts to consistently climb, preventing overfitting"
      },
      {
        "ru": "Принудительное обнуление градиентов весов с наименьшей абсолютной величиной",
        "en": "Zeroing out weight gradients possessing the smallest absolute magnitudes"
      },
      {
        "ru": "Автоматическое переключение режима обучения с GPU на распределенный кластер CPU",
        "en": "Automated hardware migration from GPU acceleration to distributed CPU clusters"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Early Stopping отслеживает Validation Loss: пока Training Loss продолжает падать, рост ошибки на валидации сигнализирует о переобучении, и обучение прерывается с откатом к лучшим весам.",
      "en": "Early stopping monitors validation loss and checkpoints optimal weights before model capacity overfits training set noise."
    },
    "tag": "basics"
  },
  {
    "id": "blitz-87",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В чем заключается фундаментальное допущение Наивного Байесовского классификатора (Naive Bayes)?",
      "en": "What is the foundational assumption of the Naive Bayes classifier?"
    },
    "options": [
      {
        "ru": "Все признаки имеют строго гауссово распределение с единичной ковариацией",
        "en": "All input attributes follow identical Gaussian distributions with identity covariance"
      },
      {
        "ru": "Априорные вероятности всех целевых классов строго равны между собой",
        "en": "Prior probabilities across all candidate class targets are strictly equiprobable"
      },
      {
        "ru": "Все признаки взаимно условно независимы при условии заданного класса: $P(x_1, \\dots, x_d | y) = \\prod_{j=1}^d P(x_j | y)$",
        "en": "All features are mutually conditionally independent given the class label: $P(x_1, \\dots, x_d | y) = \\prod_{j=1}^d P(x_j | y)$"
      },
      {
        "ru": "Разделяющая гиперплоскость между классами строго ортогональна первому признаку",
        "en": "The separating hyperplane between classes is strictly orthogonal to the first attribute"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Слово «наивный» отражает гипотезу условной независимости признаков: несмотря на то, что на практике признаки часто коррелируют, классификатор демонстрирует удивительно высокую точность при малом объеме данных.",
      "en": "The \"naive\" conditional independence assumption factorizes joint likelihood into 1D marginals, drastically reducing parameter estimation complexity."
    },
    "tag": "probabilistic"
  },
  {
    "id": "blitz-88",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Что определяет понятие емкости Вапника-Червоненкиса (VC-dimension) семейства классификаторов?",
      "en": "What defines the Vapnik-Chervonenkis (VC) dimension of a hypothesis space?"
    },
    "options": [
      {
        "ru": "Размер минимального остовного дерева в пространстве признаков объектов",
        "en": "The edge count of a minimal spanning tree over the empirical feature space"
      },
      {
        "ru": "Количество обучаемых параметров весовой матрицы нейронной сети",
        "en": "The count of unconstrained floating point parameters in the model weight matrix"
      },
      {
        "ru": "Количество эпох, необходимое для сходимости градиентного спуска с точностью $\\epsilon$",
        "en": "The number of training epochs required for gradient descent convergence to tolerance $\\epsilon$"
      },
      {
        "ru": "Максимальное количество точек, которые данное семейство функций способно разделить (shatter) всеми возможными $2^n$ способами разметки",
        "en": "The maximum cardinality of points that the hypothesis space can shatter in all possible $2^n$ binary labelings"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "VC-размерность измеряет теоретическую выразительную силу классификатора. Например, для линейных классификаторов на плоскости $\\mathbb{R}^2$ VC-размерность равна 3, так как 4 точки в общем положении разделить всеми $2^4$ способами прямая не может.",
      "en": "VC dimension measures hypothesis capacity by the maximum number of arbitrary points a classifier can shatter into all $2^n$ dichotomies."
    },
    "tag": "theory"
  },
  {
    "id": "blitz-89",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какое ключевое свойство отличает алгоритм K-Means от иерархической агломеративной кластеризации?",
      "en": "What distinguishes K-Means from Agglomerative Hierarchical clustering?"
    },
    "options": [
      {
        "ru": "K-Means требует предварительного задания фиксированного числа кластеров $K$, а иерархическая строит полное дендрограмное дерево объединений",
        "en": "K-Means requires specifying cluster count $K$ in advance, while hierarchical builds a full dendrogram merge tree"
      },
      {
        "ru": "K-Means не поддерживает евклидово расстояние",
        "en": "K-Means is fundamentally incompatible with standard Euclidean metrics"
      },
      {
        "ru": "Иерархическая кластеризация работает быстрее K-Means на миллионных выборках",
        "en": "Hierarchical clustering runs asymptotically faster than K-Means on multi-million row datasets"
      },
      {
        "ru": "K-Means используется исключительно для задач обучения с подкреплением",
        "en": "K-Means is restricted exclusively to reinforcement learning state representations"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "K-Means — плоский итеративный алгоритм с гиперпараметром $K$. Агломеративная иерархическая кластеризация начинает с отдельных точек и последовательно сливает ближайшие, формируя дендрограмму с вычислительной сложностью $O(N^2)$ или $O(N^3)$.",
      "en": "K-Means partitions data into $K$ disjoint centroids iteratively. Hierarchical clustering produces a dendrogram without fixing $K$ upfront."
    },
    "tag": "clustering"
  },
  {
    "id": "blitz-90",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Что выражает коэффициент ранговой корреляции Спирмена в отличие от линейной корреляции Пирсона?",
      "en": "What does the Spearman rank correlation measure compared to Pearson linear correlation?"
    },
    "options": [
      {
        "ru": "Строго линейное соотношение между средними значениями признаков в предположении нормальности",
        "en": "Strict linear proportionality under bivariate normality assumptions"
      },
      {
        "ru": "Степень монотонной зависимости между переменными на основе их рангов, независимо от линейности связи",
        "en": "Monotonic relationship strength evaluated on sample ranks, regardless of strict linearity"
      },
      {
        "ru": "Отношение геометрического среднего к гармоническому среднему для положительных рядов",
        "en": "The ratio of geometric mean to harmonic mean for strictly positive series"
      },
      {
        "ru": "Долю совпадающих бинарных меток в задаче многоклассовой классификации",
        "en": "The fraction of concordant binary labels in multi-class prediction arrays"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Корреляция Спирмена — это корреляция Пирсона, вычисленная не по исходным значениям, а по их рангам. Она устойчива к нелинейным монотонным трансформациям и выбросам.",
      "en": "Spearman rank correlation calculates Pearson correlation over rank-transformed variables, assessing monotonic relationships robust to outliers."
    },
    "tag": "eda-pandas"
  },
  {
    "id": "blitz-91",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Как алгоритм FlashAttention достигает 2-4x кратного ускорения и многократной экономии памяти при вычислении Self-Attention?",
      "en": "How does FlashAttention achieve 2-4x speedups and sub-quadratic memory footprint in Self-Attention?"
    },
    "options": [
      {
        "ru": "Аппроксимация матрицы $QK^T$ случайными разреженными графами Эрдеша-Реньи",
        "en": "Approximating $QK^T$ via sparse Erdos-Renyi random graphs"
      },
      {
        "ru": "Замена скалярного произведения на вычисление Манхэттенского расстояния в целочисленных регистрах INT4",
        "en": "Replacing inner products with Manhattan distance evaluated on INT4 registers"
      },
      {
        "ru": "Тайлинг (блочная обработка) и онлайн-вычисление Softmax без материализации гигантской матрицы внимания $N \\times N$ в медленной памяти HBM GPU",
        "en": "Tiling and online Softmax scaling without materializing the intermediate $N \\times N$ attention matrix in slow GPU HBM"
      },
      {
        "ru": "Вынесение вычисления внимания на хост-процессор CPU с использованием инструкций AVX-512",
        "en": "Offloading attention evaluation to host CPU cores using vectorized AVX-512 instructions"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Dao et al. показали, что стандартный Attention упирается в пропускную способность памяти (IO-bound). FlashAttention разбивает $Q, K, V$ на блоки, помещающиеся в быструю память SRAM чипа, и пересчитывает промежуточные значения на обратном проходе без сохранения $N \\times N$ карты в HBM.",
      "en": "FlashAttention reorganizes attention computation into SRAM-sized blocks via online Softmax, bypassing slow GPU HBM memory traffic bottleneck."
    },
    "tag": "transformers"
  },
  {
    "id": "blitz-92",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Что такое Temperature (температура сэмплирования $T$) при генерации текста языковыми моделями?",
      "en": "What is Sampling Temperature $T$ in autoregressive LLM text generation?"
    },
    "options": [
      {
        "ru": "Аппаратная температура графического ускорителя, при превышении которой троттлятся вычисления",
        "en": "Hardware GPU junction temperature triggering thermal throttling safeguards"
      },
      {
        "ru": "Порог усечения наименее вероятных токенов аналогично параметру Top-P",
        "en": "Cumulative probability mass cutoff identical to nucleus sampling (Top-P)"
      },
      {
        "ru": "Количество слоев Transformer, участвующих в вычислении текущего токена",
        "en": "The number of Transformer blocks activated during decoding of the current token"
      },
      {
        "ru": "Масштабирующий делитель логитов $z_i / T$ перед функцией Softmax: $T < 1$ делает распределение острее (детерминированнее), а $T > 1$ сглаживает его, увеличивая креативность",
        "en": "Logit scaling factor $z_i / T$ before Softmax: $T < 1$ sharpens probabilities (deterministic), while $T > 1$ flattens them (creative)"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "При $T \\to 0$ Softmax вырождается в $\\text{argmax}$ (жадный выбор). При высоких $T$ вероятности токенов выравниваются, делая текст разнообразным, но повышая риск бессвязности.",
      "en": "Temperature divides logits before Softmax: lower values concentrate probability mass on top tokens; higher values encourage diversity."
    },
    "tag": "transformers"
  },
  {
    "id": "blitz-93",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "В чем суть техники Data Augmentation (аугментации данных) в машинном обучении?",
      "en": "What is the core premise of Data Augmentation in machine learning?"
    },
    "options": [
      {
        "ru": "Искусственное увеличение разнообразия обучающей выборки путем применения реалистичных трансформаций (повороты, обрезки, шум), не меняющих истинную метку",
        "en": "Artificially expanding training diversity via realistic label-preserving transformations (flips, crops, jitter)"
      },
      {
        "ru": "Сжатие исходных табличных файлов алгоритмом gzip для экономии места на диске",
        "en": "Compressing raw dataset archives using gzip to economize local storage allocations"
      },
      {
        "ru": "Удаление всех дублирующихся строк из тренировочного датафрейма",
        "en": "Deduplicating identical rows from the training split DataFrame"
      },
      {
        "ru": "Принудительное приведение всех текстовых признаков к верхнему регистру",
        "en": "Forcing all textual corpus attributes into capitalized upper-case strings"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "Аугментация внедряет априорные инвариантности в модель (например, зеркальное отражение кота не делает его собакой), снижая переобучение при дефиците данных.",
      "en": "Data augmentation injects domain invariance into models by generating label-preserving synthetic variations, mitigating overfitting."
    },
    "tag": "basics"
  },
  {
    "id": "blitz-94",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Какова формула и смысл коэффициента скольжения силуэта Davies-Bouldin Index в кластеризации?",
      "en": "What is the formulation and objective of the Davies-Bouldin Index in clustering?"
    },
    "options": [
      {
        "ru": "Логарифм определителя ковариационной матрицы центроидов",
        "en": "Log-determinant of the empirical inter-centroid covariance matrix"
      },
      {
        "ru": "Отношение суммы внутрикластерных расстояний к расстоянию между центроидами: чем меньше индекс, тем лучше разделены и компактнее кластеры",
        "en": "Ratio of within-cluster scatter to between-cluster separation: lower values indicate tighter, better-separated clusters"
      },
      {
        "ru": "Произведение энтропии распределения меток на число шумовых объектов DBSCAN",
        "en": "Product of label assignment entropy and DBSCAN noise point density"
      },
      {
        "ru": "Максимальное значение собственных чисел проекции на первую главную компоненту",
        "en": "Leading eigenvalue of data projected onto the first principal component"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Индекс Дэвиса-Болдина оценивает среднее сходство каждого кластера с его наиболее похожим соседом $R_{ij} = \\frac{s_i + s_j}{d(c_i, c_j)}$. Низкие значения соответствуют идеальным кластерам.",
      "en": "Davies-Bouldin index evaluates similarity $R_{ij} = (s_i + s_j)/d(c_i, c_j)$. Minimizing the index yields compact, isolated clusters."
    },
    "tag": "clustering"
  },
  {
    "id": "blitz-95",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "Что такое Target Encoding (целевое кодирование) категориальных признаков и какая главная опасность ему сопутствует?",
      "en": "What is Target Encoding for categorical variables, and what is its primary pitfall?"
    },
    "options": [
      {
        "ru": "Разбиение категории на $K$ бинарных столбцов; опасность — необратимость матрицы",
        "en": "Splitting into $K$ binary indicator columns; primary risk is matrix non-invertibility"
      },
      {
        "ru": "Замена категорий их порядковыми номерами по алфавиту; опасность — переполнение 32-битных чисел",
        "en": "Alphabetical ordinal assignment; primary risk is 32-bit integer register overflow"
      },
      {
        "ru": "Замена категорий средним значением целевой переменной по этой категории; главная опасность — катастрофическое переобучение (Data Leakage) без сглаживания и фолдинга",
        "en": "Replacing categories with the mean target value for that category; primary risk is severe target leakage without out-of-fold smoothing"
      },
      {
        "ru": "Преобразование строк в векторы методом Word2Vec; опасность — затухание градиента",
        "en": "Embedding strings via Word2Vec; primary risk is gradient attenuation across layers"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Target Encoding заменяет категорию на $\\mathbb{E}[y | x \\in \\text{cat}]$. Для редких категорий среднее выучивает таргет наизусть. Для защиты применяют сглаживание (smoothing) и Out-of-Fold вычисления (как в CatBoost).",
      "en": "Target encoding maps categories to conditional target means. Without out-of-fold regularization or Bayesian smoothing, it causes severe target leakage."
    },
    "tag": "preprocessing"
  },
  {
    "id": "blitz-96",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Какая метрика в регрессии измеряет среднее абсолютное отклонение прогнозов от факта?",
      "en": "Which regression metric measures the mean absolute deviation of predictions from ground truth?"
    },
    "options": [
      {
        "ru": "Cosine Similarity",
        "en": "Cosine Similarity"
      },
      {
        "ru": "MSE (Mean Squared Error)",
        "en": "MSE (Mean Squared Error)"
      },
      {
        "ru": "MAPE (Mean Absolute Percentage Error)",
        "en": "MAPE"
      },
      {
        "ru": "MAE (Mean Absolute Error)",
        "en": "MAE (Mean Absolute Error)"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "MAE рассчитывается как $\\frac{1}{n} \\sum |y_i - \\hat{y}_i|$. В отличие от MSE, MAE не возводит ошибки в квадрат и гораздо устойчивее к единичным аномальным выбросам.",
      "en": "Mean Absolute Error $\\frac{1}{n} \\sum |y_i - \\hat{y}_i|$ treats residuals linearly, offering robust performance in the presence of outliers."
    },
    "tag": "metrics"
  },
  {
    "id": "blitz-97",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Каково свойство устойчивости алгоритма t-SNE к локальной и глобальной структуре многообразия данных?",
      "en": "What is the characteristic property of t-SNE regarding local vs global manifold preservation?"
    },
    "options": [
      {
        "ru": "t-SNE превосходно сохраняет локальное соседство точек и структуру кластеров, но расстояния между далекими кластерами и глобальная геометрия в значительной степени не имеют физического смысла",
        "en": "t-SNE excels at preserving local neighborhoods and cluster structure, but inter-cluster distances and global geometry are largely arbitrary"
      },
      {
        "ru": "t-SNE гарантированно сохраняет глобальные геодезические расстояния изометрично алгоритму Isomap",
        "en": "t-SNE mathematically preserves global geodesic manifold distances identically to Isomap"
      },
      {
        "ru": "t-SNE является строго детерминированным методом без стохастической оптимизации",
        "en": "t-SNE is a strictly convex, deterministic optimization procedure free of stochasticity"
      },
      {
        "ru": "t-SNE применим только к данным размерности $d \\le 3$",
        "en": "t-SNE is mathematically constrained to input spaces with dimensionality $d \\le 3$"
      }
    ],
    "correctAnswer": 0,
    "explanation": {
      "ru": "t-SNE минимизирует дивергенцию KL вероятностей соседства, концентрируясь на малых расстояниях. Позиции кластеров относительно друг друга и их относительные размеры в проекции t-SNE могут вводить в заблуждение.",
      "en": "Because KL divergence heavily penalizes modeling nearby points as far, t-SNE focuses on local neighborhood preservation at the expense of global distances."
    },
    "tag": "metric-methods"
  },
  {
    "id": "blitz-98",
    "type": "single",
    "difficulty": "medium",
    "question": {
      "ru": "В чем суть концепции Stacking (стекинга) в ансамблевом машинном обучении?",
      "en": "What is the foundational concept of Stacking in ensemble machine learning?"
    },
    "options": [
      {
        "ru": "Простое взвешенное голосование моделей по правилу большинства без обучения второго уровня",
        "en": "Simple plurality majority voting across models without secondary learning stages"
      },
      {
        "ru": "Обучение мета-модели (Meta-Learner) на предсказаниях нескольких разнородных базовых моделей (Level 0), полученных по схеме Out-of-Fold кросс-валидации",
        "en": "Training a Meta-Learner on the out-of-fold cross-validated predictions generated by diverse base estimators (Level 0)"
      },
      {
        "ru": "Последовательное обучение деревьев на градиентах функции потерь",
        "en": "Sequential tree optimization fitting gradient residuals of the previous step"
      },
      {
        "ru": "Случайное сэмплирование признаков для каждой отдельной строки обучающей выборки",
        "en": "Stochastic feature sampling conducted independently for each row observation"
      }
    ],
    "correctAnswer": 1,
    "explanation": {
      "ru": "Стекинг обучает мета-модель комбинировать сильные стороны разных алгоритмов (например, GBDT, нейросети и линейной модели). Чтобы мета-модель не переобучилась, ее обучающая матрица формируется из OOF-прогнозов базовых моделей.",
      "en": "Stacking uses predictions of diverse base estimators as meta-features for a final meta-learner, using out-of-fold splits to prevent target contamination."
    },
    "tag": "trees-ensembles"
  },
  {
    "id": "blitz-99",
    "type": "single",
    "difficulty": "easy",
    "question": {
      "ru": "Что из перечисленного является главной задачей понижения размерности данных (Dimensionality Reduction)?",
      "en": "What is a primary goal of Dimensionality Reduction in data science pipelines?"
    },
    "options": [
      {
        "ru": "Увеличение объема оперативной памяти, выделяемой под датасет",
        "en": "Increasing physical RAM footprint allocated to the training split"
      },
      {
        "ru": "Принудительное преобразование задачи регрессии в классификацию",
        "en": "Forcing continuous regression tasks into discrete binary classification"
      },
      {
        "ru": "Сжатие пространства признаков с сохранением максимального объема полезной дисперсии/информации, ускорение обучения и визуализация",
        "en": "Compressing feature spaces while retaining maximum variance/information, speeding up training, and visualization"
      },
      {
        "ru": "Генерация синтетических дубликатов строк для балансировки редкого класса",
        "en": "Synthesizing duplicate rows to balance underrepresented minority labels"
      }
    ],
    "correctAnswer": 2,
    "explanation": {
      "ru": "Снижение размерности (PCA, t-SNE, UMAP) борется с проклятием размерности, устраняет мультиколлинеарность, сжимает данные и позволяет визуализировать многомерные структуры в 2D/3D.",
      "en": "Dimensionality reduction compacts feature representations, mitigating collinearity and the curse of dimensionality while facilitating visualization."
    },
    "tag": "pca"
  },
  {
    "id": "blitz-100",
    "type": "single",
    "difficulty": "hard",
    "question": {
      "ru": "Что определяет понятие Парето-фронта (Pareto Front) в многокритериальной оптимизации моделей машинного обучения?",
      "en": "What defines the Pareto Front in multi-objective machine learning optimization?"
    },
    "options": [
      {
        "ru": "Кривая сходимости стохастического градиентного спуска при температуре $T \\to 0$",
        "en": "The asymptotic trajectory of stochastic gradient descent as temperature approaches zero"
      },
      {
        "ru": "Точка глобального минимума функции потерь, в которой все частные производные равны нулю",
        "en": "The unique global loss minimum coordinate where all partial derivatives vanish simultaneously"
      },
      {
        "ru": "Гиперплоскость, разделяющая линейно независимые классы в пространстве гипотез",
        "en": "A hyperplane strictly partitioning linearly independent classes in hypothesis space"
      },
      {
        "ru": "Множество недоминируемых решений, в которых ни одну из метрик (например, Accuracy и Latency) невозможно улучшить без ухудшения хотя бы одной другой",
        "en": "The set of non-dominated solutions where no single objective (e.g. Accuracy vs Latency) can be improved without degrading at least one other"
      }
    ],
    "correctAnswer": 3,
    "explanation": {
      "ru": "Парето-фронт представляет собой границу компромисса между конфликтующими целями (например, точность модели vs задержка инференса на мобильном устройстве): любая точка на фронте является оптимальной при определенном балансе приоритетов.",
      "en": "The Pareto front contains all non-dominated candidate architectures where trade-offs between competing metrics (accuracy, size, speed) are optimal."
    },
    "tag": "theory"
  }
];
