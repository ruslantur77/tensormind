export interface SplashPhrase {
  ru: string;
  en: string;
}

export const SPLASH_PHRASES: SplashPhrase[] = [
  {
    ru: 'Тензоры готовы к умножению, а ты?',
    en: 'Tensors are primed for multiplication, are you?',
  },
  {
    ru: 'Сегодня идеальный день для оптимизации градиентного спуска!',
    en: 'Today is a great day to optimize gradient descent!',
  },
  {
    ru: 'CUPED снижает дисперсию, а знания — стресс на собеседовании.',
    en: 'CUPED reduces variance, and knowledge reduces interview stress.',
  },
  {
    ru: 'Не забудь провалидировать модель на отложенной выборке!',
    en: 'Remember to validate your model on a hold-out test set!',
  },
  {
    ru: 'Random Forest уже проголосовал за твой успех единогласно.',
    en: 'Random Forest already voted for your success unanimously.',
  },
  {
    ru: 'Проверь p-value, но не подглядывай раньше времени!',
    en: 'Check your p-value, but remember: no early peeking!',
  },
  {
    ru: 'L₁-регуляризация зануляет веса, а TensorMind — пробелы в знаниях.',
    en: 'L₁ zeros out irrelevant weights, TensorMind zeros out knowledge gaps.',
  },
  {
    ru: 'Какой у тебя сегодня learning rate — динамический с косинусным отжигом?',
    en: 'What is your learning rate today — dynamic with cosine annealing?',
  },
  {
    ru: 'Байес одобряет твое априорное стремление учиться!',
    en: 'Bayes strongly approves of your prior eagerness to learn!',
  },
  {
    ru: 'Без утечки данных (Data Leakage) в продакшн!',
    en: 'Zero data leakage into production!',
  },
  {
    ru: 'Внимание — всё, что тебе нужно. (Attention Is All You Need!)',
    en: 'Attention Is All You Need!',
  },
  {
    ru: 'Переобучение подкрадывается незаметно — следи за лоссом на валидации.',
    en: 'Overfitting creeps silently — keep a vigilant eye on validation loss.',
  },
  {
    ru: 'Сделай один шаг градиента навстречу Senior ML Engineer.',
    en: 'Take one gradient step closer to Senior ML Engineer.',
  },
  {
    ru: 'Backpropagation успешно обновил синапсы долговременной памяти.',
    en: 'Backpropagation successfully updated your long-term memory synapses.',
  },
  {
    ru: 'Качественная разметка данных побеждает даже 70B модель.',
    en: 'High-quality data annotation outperforms even a 70B model.',
  },
  {
    ru: 'Твой стрик горит ярче, чем видеокарта при файнтюнинге LLaMA!',
    en: 'Your study streak burns hotter than an H100 fine-tuning LLaMA!',
  },
  {
    ru: 'Проверь метрику NDCG@k — релевантность твоих знаний сегодня максимальна.',
    en: 'Check your NDCG@k — relevance of your knowledge is peaked today.',
  },
  {
    ru: 'Сегодня напишем чистый код без технического долга.',
    en: 'Today we write clean, robust code with zero tech debt.',
  },
  {
    ru: 'Да пребудет с тобой быстрая сходимость функции потерь!',
    en: 'May the convex convergence of loss functions be with you!',
  },
  {
    ru: 'Не забудь нормализовать признаки перед обучением линейной модели.',
    en: 'Never forget feature scaling before training linear models.',
  },
  {
    ru: 'Ансамбль моделей всегда сильнее одной — как и регулярные занятия.',
    en: 'An ensemble is stronger than a single learner — just like daily practice.',
  },
  {
    ru: 'Сингулярные числа матрицы показывают главное направление твоего роста.',
    en: 'Singular values reveal the principal component of your growth.',
  },
  {
    ru: 'Граф вычислений построен, запускаем прямой проход!',
    en: 'Computation graph constructed. Commencing forward pass!',
  },
  {
    ru: 'Осторожно: 100% точность без кросс-валидации вызывает подозрения.',
    en: 'Beware: 100% accuracy without cross-validation is suspicious.',
  },
  {
    ru: 'Автоград помнит каждый шаг твоей дифференцируемой траектории.',
    en: 'Autograd remembers every step along your differentiable trajectory.',
  },
  {
    ru: 'Что выберем сегодня: бустинг над деревьями или трансформер?',
    en: 'What will we master today: gradient boosted trees or a transformer?',
  },
  {
    ru: 'Мини-батч знаний уже загружен в память GPU.',
    en: 'A fresh mini-batch of knowledge is loaded into GPU VRAM.',
  },
  {
    ru: 'Регуляризуй шум и концентрируйся на полезном сигнале.',
    en: 'Regularize ambient noise and amplify actionable signal.',
  },
  {
    ru: 'Один коммит в день держит легаси подальше!',
    en: 'One git commit a day keeps the legacy bugs away!',
  },
  {
    ru: 'Проверь Sample Ratio Mismatch перед тем, как делать выводы в тесте.',
    en: 'Always verify Sample Ratio Mismatch before drawing experiment conclusions.',
  },
];

export function getRandomSplash(lang: 'ru' | 'en' = 'ru'): string {
  const idx = Math.floor(Math.random() * SPLASH_PHRASES.length);
  return SPLASH_PHRASES[idx][lang];
}
