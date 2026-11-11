import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const recsysMeta: ModuleMeta = {
  id: 'recsys',
  title: {
    ru: 'Рекомендательные системы (RecSys)',
    en: 'Recommender Systems (RecSys)',
  },
  description: {
    ru: 'Прикладная индустриальная задача: коллаборативная фильтрация (User/Item-based), матричная факторизация (FunkSVD, ALS), контентные Two-Tower нейросети с ANN-поиском (FAISS, HNSW) и метрики ранжирования (NDCG@k, MAP@k, MRR, HitRate).',
    en: 'Production-grade recommendation systems: collaborative filtering (User/Item-based), matrix factorization (FunkSVD, ALS), content-based Two-Tower neural networks with ANN search (FAISS, HNSW), and ranking metrics (NDCG@k, MAP@k, MRR, HitRate).',
  },
  order: 13,
  icon: 'recsys',
  estimatedMinutes: 80,
  isPlaceholder: false,
};

export const recsysLessons: Lesson[] = [
  {
    id: 'recsys-1-collaborative',
    moduleId: 'recsys',
    title: {
      ru: 'Коллаборативная фильтрация: User-based, Item-based и метрики сходства',
      en: 'Collaborative Filtering: User-based, Item-based & Similarity Metrics',
    },
    order: 1,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Природа рекомендательных систем
Рекомендательные системы (RecSys) — один из ключевых драйверов монетизации в современном бигтехе (YouTube, Netflix, Spotify, Amazon, маркетплейсы). Их цель — предсказать релевантность товаров, контента или сервисов для конкретного пользователя среди миллионов вариантов.

---

#### 1. Матрица взаимодействий User-Item и типы фидбека
Данные представляются матрицей $R \in \mathbb{R}^{|U| \times |I|}$, где строки — пользователи, а столбцы — элементы каталога.
* **Разреженность (Sparsity):** В реальных системах типичный пользователь взаимодействует менее чем с 0.01% каталога. Разреженность матрицы часто превышает **99.9%**.
* **Явный фидбек (Explicit Feedback):** Оценки 1–5 звезд, лайки/дизлайки. Редок, но точно отражает отношение.
* **Неявный фидбек (Implicit Feedback):** Клики, факт покупки, время досмотра видео (dwell time), добавление в закладки. Данных на порядки больше, но отсутствие клика не обязательно означает отрицательное отношение (пользователь мог просто не увидеть товар).

---

#### 2. Memory-based Коллаборативная фильтрация (Метод соседей)
Идея: «Похожие пользователи любят похожие товары» или «Похожие товары нравятся одним и тем же людям».

##### User-Based подход
Находим $k$ пользователей, наиболее похожих на пользователя $u$, и берем их оценки:
$$\hat{r}_{u, i} = \bar{r}_u + \frac{\sum_{v \in N(u)} \text{sim}(u, v) (r_{v, i} - \bar{r}_v)}{\sum_{v \in N(u)} |\text{sim}(u, v)|}$$
где $\bar{r}_u$ — средняя оценка пользователя $u$ (центрирование нивелирует индивидуальную строгость пользователя).

##### Item-Based подход
Находим товары, похожие на те, которые пользователь $u$ уже высоко оценил:
$$\hat{r}_{u, i} = \frac{\sum_{j \in N(i)} \text{sim}(i, j) \cdot r_{u, j}}{\sum_{j \in N(i)} |\text{sim}(i, j)|}$$

*Почему Item-Based доминирует в продакшене?*
1. Число товаров $|I|$ в интернет-магазинах обычно значительно меньше числа пользователей $|U|$.
2. Профиль оценок товара стабильнее во времени, чем сиюминутные интересы пользователя. Матрицу сходства товаров $S \in \mathbb{R}^{|I| \times |I|}$ можно предрассчитать офлайн в батч-режиме.

---

#### 3. Метрики сходства (Similarity Metrics)
\`\`\`python
import numpy as np

# Векторы оценок двух пользователей/товаров
u = np.array([5, 3, 0, 4])
v = np.array([4, 2, 0, 5])

# 1. Косинусное сходство (Cosine Similarity)
cosine_sim = np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))

# 2. Корреляция Пирсона (Pearson Correlation / Centered Cosine)
# Вычитает среднюю оценку пользователя, исключая эффект завышения/занижения оценок
u_centered = u - np.mean(u[u > 0])
v_centered = v - np.mean(v[v > 0])
# ... вычисление косинуса центрированных векторов

# 3. Сходство Жаккара (Jaccard Similarity) — для бинарного неявного фидбека:
# J(A, B) = |A ∩ B| / |A ∪ B|
\`\`\`

---

#### 4. Проблема холодного старта (Cold Start Problem)
* **Новый пользователь (User Cold Start):** Нет истории взаимодействия. Решение: показ глобального Top-популярного контента, анкетирование при онбординге, гео/демографические дефолты.
* **Новый товар (Item Cold Start):** Никто еще не оценил товар, поэтому коллаборативная фильтрация его не порекомендует. Решение: контентные методы (анализ текста описания, категории, эмбеддингов изображения).`,
      en: `### Recommender Systems Foundations
Recommender systems identify optimal items for specific users from vast catalogs under severe matrix sparsity (>99.9%).

#### 1. Explicit vs Implicit Feedback
* **Explicit:** 1-5 star ratings, explicit reviews (sparse, high fidelity).
* **Implicit:** Clicks, purchases, watch-time (dense, ambiguous negative signal).

#### 2. User-based vs Item-based Collaborative Filtering
* **User-based:** Leverages taste similarity between users with mean-centering.
* **Item-based:** Computes item-item similarity offline; computationally superior because item catalogs are smaller and more stable than user bases.

#### 3. Similarity Metrics & Cold Start
Cosine similarity, Pearson correlation (centered cosine), and Jaccard index. Mitigation of cold start via popularity heuristics and content-based fallbacks.`,
    },
    commonMistakes: [
      {
        ru: 'Использовать обычное косинусное сходство без центрирования средних оценок пользователей: одни пользователи ставят 5 за любой фильм, другие не ставят выше 3. Центрирование (Pearson) устраняет этот сдвиг шкалы.',
        en: 'Using raw cosine similarity without mean-centering user ratings, ignoring systematic user rating bias.',
      },
      {
        ru: 'Пытаться применить чистую коллаборативную фильтрацию к только что добавленным товарам: без оценок товар никогда не будет порекомендован (проблема холодного старта).',
        en: 'Relying exclusively on collaborative filtering for fresh items without rating interactions (item cold start).',
      },
    ],
    checkpointQuiz: [
      {
        id: 'recsys-cp-1-a',
        question: {
          ru: 'Почему в продакшене алгоритм Item-based фильтрации обычно предпочтительнее User-based?',
          en: 'Why is Item-based collaborative filtering generally preferred over User-based in production systems?',
        },
        options: [
          {
            ru: 'Каталог товаров обычно меньше и статичнее базы пользователей, что позволяет предрассчитать матрицу сходства товаров офлайн',
            en: 'Item catalogs are generally smaller and more stable than volatile user populations, allowing offline pre-computation',
          },
          {
            ru: 'Item-based алгоритм гарантирует 100% точность без ошибок',
            en: 'Item-based guarantees 100% error-free precision',
          },
          {
            ru: 'User-based алгоритм не поддерживает косинусное сходство',
            en: 'User-based filtering cannot utilize cosine similarity',
          },
          {
            ru: 'Item-based алгоритм требует меньше 1 МБ оперативной памяти',
            en: 'Item-based filtering requires under 1 MB of memory',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Пользователи постоянно добавляются и меняют предпочтения, в то время как товары меняются реже. Матрицу сходства товаров $I \\times I$ можно заранее рассчитать в ночном батче и мгновенно использовать в онлайне.',
          en: 'Item-item relationships evolve much slower than dynamic user sessions, enabling pre-computed similarity matrix lookups with low online latency.',
        },
      },
      {
        id: 'recsys-cp-1-b',
        question: {
          ru: 'В чем ключевое отличие корреляции Пирсона (центрированного косинуса) от стандартного косинусного сходства векторов оценок?',
          en: 'What is the primary advantage of Pearson Correlation (centered cosine) over raw cosine similarity?',
        },
        options: [
          {
            ru: 'Вычитает среднюю оценку пользователя из каждого рейтинга, компенсируя индивидуальную строгость или щедрость судейства',
            en: 'Subtracts individual user average ratings, adjusting for optimistic or harsh personal grading scales',
          },
          {
            ru: 'Преобразует числа в логарифмическую шкалу',
            en: 'Transforms numbers to logarithmic scales',
          },
          {
            ru: 'Исключает деление на ноль в квадратном корне',
            en: 'Eliminates division by zero in square roots',
          },
          {
            ru: 'Работает только для положительных чисел',
            en: 'Operates solely on strictly positive numbers',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Один пользователь может ставить фильмам в среднем 4.5 балла, а строгий критик — 2.5 балла. Вычитание $\\bar{r}_u$ приводит оценки к единой относительной шкале отклонений от среднего.',
          en: 'Mean-centering standardizes disparate baseline expectations across generous and pessimistic reviewers.',
        },
      },
      {
        id: 'recsys-cp-1-c',
        question: {
          ru: 'Что такое проблема «Холодного старта» (Cold Start) в рекомендательных системах?',
          en: 'What constitutes the "Cold Start Problem" in recommendation systems?',
        },
        options: [
          {
            ru: 'Трудность формирования качественных рекомендаций для новых пользователей или товаров из-за отсутствия истории взаимодействий',
            en: 'Difficulty in generating personalized recommendations for brand new users or items lacking interaction history',
          },
          {
            ru: 'Падение сервера при перезагрузке операционной системы',
            en: 'Server crashes occurring during operating system reboots',
          },
          {
            ru: 'Медленный запуск видеокарты при низких температурах',
            en: 'Slow GPU startup latencies in cold data centers',
          },
          {
            ru: 'Сложность вычисления обратной матрицы',
            en: 'Complexity of inverting dense matrix structures',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Коллаборативные методы требуют данных о прошлых связях. Если пользователь или товар только что зарегистрирован, данных нет — приходится подключать контентный анализ или популярный дефолт.',
          en: 'Pure collaborative filters fail on unobserved entities without interaction histories, requiring content metadata fallbacks.',
        },
      },
    ],
  },
  {
    id: 'recsys-2-matrix-factorization',
    moduleId: 'recsys',
    title: {
      ru: 'Матричная факторизация: SVD, FunkSVD и ALS для неявного фидбека',
      en: 'Matrix Factorization: SVD, FunkSVD & Alternating Least Squares (ALS)',
    },
    order: 2,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### От разреженных таблиц — к скрытым факторам (Latent Factors)
Методы матричной факторизации совершили революцию в RecSys во время знаменитого конкурса **Netflix Prize (2006–2009)**. Идея заключается в проецировании и пользователей, и товаров в общее $k$-мерное пространство скрытых признаков (жанры, режиссеры, стилистика).

---

#### 1. Базовая модель факторизации
Разреженная матрица рейтингов $R \in \mathbb{R}^{|U| \times |I|}$ аппроксимируется произведением двух плотных низкоранговых матриц:
$$R \approx P Q^T$$
* $P \in \mathbb{R}^{|U| \times k}$ — матрица эмбеддингов пользователей ($p_u \in \mathbb{R}^k$).
* $Q \in \mathbb{R}^{|I| \times k}$ — матрица эмбеддингов товаров ($q_i \in \mathbb{R}^k$).
* Размерность скрытого пространства $k \ll \min(|U|, |I|)$ (обычно $k \in [32, 256]$).

Прогноз оценки пользователя $u$ товару $i$:
$$\hat{r}_{ui} = p_u^T q_i = \sum_{f=1}^k p_{uf} q_{if}$$

---

#### 2. FunkSVD (Biased Matrix Factorization)
Классический SVD из линейной алгебры требует полностью заполненной матрицы (заполнение нулями искажает данные). **Саймон Функ (Simon Funk)** предложил оптимизировать функцию потерь **только по известным рейтингам** $\mathcal{K} = \{(u, i) \mid r_{ui} \text{ известно}\}$ с учетом глобальных смещений (Biases):

$$\hat{r}_{ui} = \mu + b_u + b_i + p_u^T q_i$$
где:
* $\mu$ — глобальное среднее всех оценок по всей базе.
* $b_u$ — систематическое смещение пользователя $u$ (доброжелательность/придирчивость).
* $b_i$ — базовое смещение товара $i$ (общая популярность фильма/товара).

##### Функция потерь с $L_2$-регуляризацией:
$$\mathcal{L} = \sum_{(u, i) \in \mathcal{K}} (r_{ui} - \hat{r}_{ui})^2 + \lambda \left( \|p_u\|_2^2 + \|q_i\|_2^2 + b_u^2 + b_i^2 \right)$$

Обучение выполняется с помощью **SGD (Stochastic Gradient Descent)**:
\`\`\`python
# Ошибка предсказания на сэмпле (u, i)
err = r_ui - (mu + b_u + b_i + np.dot(p_u, q_i))

# Обновление смещений и скрытых векторов
b_u += lr * (err - reg * b_u)
b_i += lr * (err - reg * b_i)
p_u += lr * (err * q_i - reg * p_u)
q_i += lr * (err * p_u - reg * q_i)
\`\`\`

---

#### 3. ALS (Alternating Least Squares) для неявного фидбека (Implicit Feedback)
При кликах и покупках нет явных оценок $r_{ui}$. Модель **iALS (Hu, Koren, Volinsky)** вводит:
1. **Бинарное предпочтение:** $p_{ui} = 1$, если $r_{ui} > 0$, иначе $0$.
2. **Уровень доверия (Confidence):** $c_{ui} = 1 + \alpha r_{ui}$ (чем больше раз просмотрен товар, тем выше уверенность, что он нравится).

Функция потерь iALS:
$$\mathcal{L}_{ALS} = \sum_{u, i} c_{ui} (p_{ui} - p_u^T q_i)^2 + \lambda \sum_u \|p_u\|^2 + \lambda \sum_i \|q_i\|^2$$

**Почему метод называется чередующимся (Alternating)?**
* Задача невыпукла по $P$ и $Q$ одновременно, но если **зафиксировать $Q$**, задача становится обычной квадратичной регрессией (OLS) относительно $P$, решаемой аналитически за один шаг!
* Затем **фиксируем $P$** и решаем аналитически относительно $Q$.
* Шаги повторяются до сходимости. ALS превосходно масштабируется на распределенные кластеры (Apache Spark, GPU) благодаря независимости расчетов для каждого пользователя.`,
      en: `### Matrix Factorization: SVD, FunkSVD & Implicit ALS
Matrix factorization projects users and items into a shared $k$-dimensional latent feature vector space.

#### 1. FunkSVD with Explicit Biases
$$\hat{r}_{ui} = \mu + b_u + b_i + p_u^T q_i$$
Optimizes MSE loss strictly over observable interactions $\mathcal{K}$ via Stochastic Gradient Descent with $L_2$ regularization.

#### 2. Alternating Least Squares (ALS) for Implicit Data
Implicit feedback requires confidence weighting $c_{ui} = 1 + \alpha r_{ui}$ and binary preference targets. Fix $Q$ and solve OLS for $P$; fix $P$ and solve OLS for $Q$ iteratively. Highly parallelizable across compute clusters.`,
    },
    commonMistakes: [
      {
        ru: 'Пытаться применить стандартный TruncatedSVD из scipy/sklearn к разреженной матрице рейтингов, заполнив пропуски нулями: модель воспримет пропуски как категорическое отвращение пользователя к товарам (оценка 0).',
        en: 'Zero-filling missing ratings before running standard SVD, implicitly treating unobserved items as maximally negative feedback.',
      },
      {
        ru: 'Забывать регуляризацию $\\lambda$ для скрытых векторов: популярные товары и активные пользователи быстро вызывают переобучение.',
        en: 'Omitting $L_2$ regularization on latent vectors and biases, causing severe overfitting to high-frequency users and items.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'recsys-cp-2-a',
        question: {
          ru: 'Какую главную проблему классического SVD решил Саймон Функ в алгоритме FunkSVD?',
          en: 'What fundamental limitation of classical linear algebra SVD was resolved by FunkSVD?',
        },
        options: [
          {
            ru: 'Оптимизация потерь выполняется строго по известным (наблюдаемым) рейтингам без необходимости искусственного заполнения нулями 99% пропусков матрицы',
            en: 'Loss minimization optimizes strictly over observable rating entries without imputing unobserved matrix zeros',
          },
          {
            ru: 'FunkSVD работает только на квантовых компьютерах',
            en: 'FunkSVD requires specialized quantum processors',
          },
          {
            ru: 'Он полностью удаляет необходимость обучения скрытых факторов',
            en: 'It completely eliminates latent vector optimization',
          },
          {
            ru: 'Он исключает использование градиентного спуска',
            en: 'It avoids stochastic gradient descent entirely',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Обычный SVD требует полной матрицы, а нули искажают смысл предпочтений. FunkSVD обновляет веса $p_u$ и $q_i$ через SGD строго по тем парам $(u, i)$, где оценка действительно была поставлена.',
          en: 'Classical SVD requires complete matrices. FunkSVD evaluates prediction errors strictly over observed triples $(u, i, r_{ui})$.',
        },
      },
      {
        id: 'recsys-cp-2-b',
        question: {
          ru: 'В чем суть алгоритма ALS (Alternating Least Squares) при факторизации матриц?',
          en: 'What is the algorithmic premise of Alternating Least Squares (ALS)?',
        },
        options: [
          {
            ru: 'Чередование: фиксируются векторы товаров и аналитически находятся векторы пользователей (регрессия OLS), затем фиксируются пользователи и находятся товары',
            en: 'Alternating phases: fix item vectors to solve user vectors via exact OLS, then fix user vectors to solve item vectors',
          },
          {
            ru: 'Случайное удаление 50% весов на каждой итерации',
            en: 'Randomly zeroing out 50% of weights on each training step',
          },
          {
            ru: 'Поочередное применение функций активации ReLU и Sigmoid',
            en: 'Alternating between ReLU and Sigmoid activations',
          },
          {
            ru: 'Обучение двух независимых случайных лесов',
            en: 'Training two separate Random Forest regressors',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Хотя функция потерь билинейна и невыпукла для $P$ и $Q$ вместе, фиксация одной из матриц превращает шаг в стандартную систему линейных уравнений МНК (OLS), решаемую параллельно для всех строк.',
          en: 'Fixing one factor matrix reduces the quadratic objective to independent, easily parallelized linear ridge regressions for each entity.',
        },
      },
      {
        id: 'recsys-cp-2-c',
        question: {
          ru: 'Зачем в формулу FunkSVD добавляются смещения (Biases: глобальное $\\mu$, пользователя $b_u$ и товара $b_i$)?',
          en: 'Why are global $\\mu$, user $b_u$, and item $b_i$ biases incorporated into the FunkSVD formulation?',
        },
        options: [
          {
            ru: 'Большая часть дисперсии оценок объясняется общей популярностью товара и средней щедростью пользователя, а скрытые факторы $p_u^T q_i$ моделируют лишь специфический остаточный интерес',
            en: 'A dominant portion of rating variance stems from baseline item popularity and user generosity, leaving $p_u^T q_i$ to model residual interaction affinity',
          },
          {
            ru: 'Чтобы сделать скрытые векторы строго положительными',
            en: 'To constrain latent feature vectors to positive values',
          },
          {
            ru: 'Без смещений градиентный спуск всегда равен нулю',
            en: 'Without biases the gradient vanishes to zero',
          },
          {
            ru: 'Это требование операционной системы Linux',
            en: 'It is a POSIX system requirement',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Шедевр киноленты получает высокие оценки независимо от тонких вкусов, а критики занижают все баллы. Смещения изолируют базовые эффекты, разгружая векторное скалярное произведение $p_u^T q_i$.',
          en: 'Biases capture universal baseline tendencies (e.g. widely acclaimed items or hyper-critical raters), permitting latent factors to purely encode residual affinity.',
        },
      },
    ],
  },
  {
    id: 'recsys-3-two-tower-ann',
    moduleId: 'recsys',
    title: {
      ru: 'Контентные методы, Two-Tower нейросети и векторный поиск ANN (FAISS, HNSW)',
      en: 'Content-Based Filtering, Two-Tower Deep Networks & ANN Search (FAISS, HNSW)',
    },
    order: 3,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Современный глубокий RecSys: Двухбашенные архитектуры
В масштабных сервисах (YouTube, TikTok, Яндекс, Wildberries) рекомендательный пайплайн разделен на два этапа:
1. **Candidate Generation (Отбор кандидатов / Retrieval):** Сужение миллиардного каталога до $1000$ релевантных кандидатов за $\le 10$ миллисекунд.
2. **Heavy Ranking (Тяжелое ранжирование):** Точный скоринг отобранных 1000 кандидатов тяжелой нейросетью с контекстными фичами.

---

#### 1. Архитектура Two-Tower (Dual-Encoder)
Модель состоит из двух независимых нейросетей («башен»):
* **User Tower $f(u, \text{context}) \to \mathbf{u} \in \mathbb{R}^d$:**
  Принимает на вход профиль пользователя, историю последних кликов, геопозицию, тип устройства, время суток.
* **Item Tower $g(i, \text{features}) \to \mathbf{v} \in \mathbb{R}^d$:**
  Принимает на вход описание товара, текст, категорию, цену, эмбеддинг изображения из CNN/ViT.
* **Скоринг релевантности:**
  $$\text{score}(u, i) = \langle \mathbf{u}, \mathbf{v} \rangle = \sum_{j=1}^d u_j v_j$$

*В чем архитектурная магия Two-Tower?*
Башню товаров можно запустить **офлайн** для всех 50 000 000 товаров каталога один раз в сутки и загрузить векторные эмбеддинги $\mathbf{v}_i$ в специализированный индекс векторного поиска! При поступлении онлайн-запроса пользователя вычисляется **только User Tower** $\mathbf{u}$, после чего выполняется поиск ближайших векторов.

---

#### 2. Обучение: Contrastive Loss и In-Batch Negatives
Для каждого положительного взаимодействия $(u_k, v_k)$ остальные товары из текущего батча $v_j$ ($j \neq k$) используются как бесплатные отрицательные примеры (In-Batch Negatives):

$$\mathcal{L} = -\sum_{k=1}^B \log \frac{\exp(\mathbf{u}_k^T \mathbf{v}_k / \tau)}{\sum_{j=1}^B \exp(\mathbf{u}_k^T \mathbf{v}_j / \tau)}$$
где $\tau$ — температура распределения (Softmax Temperature).

---

#### 3. Приближенный поиск ближайших соседей (ANN — Approximate Nearest Neighbors)
Точный поиск ближайших векторов $\mathbf{v}$ к $\mathbf{u}$ требует линейного перебора $O(N \cdot d)$. При $N = 10^7$ и $d = 256$ это занимает сотни миллисекунд.
**ANN (Approximate Nearest Neighbors)** находит ближайшие элементы за $O(\log N)$ с точностью $98\%+$:

##### Основные методы индексации:
1. **HNSW (Hierarchical Navigable Small World):**
   * Многослойный граф, где верхние слои содержат длинные «экспресс-ребра» для быстрого перехода между кластерами, а нижние слои — плотный локальный граф.
   * Стандарт де-факто по скорости и качеству (библиотеки FAISS, Hnswlib, Qdrant).
2. **IVF-PQ (Inverted File with Product Quantization):**
   * Векторы квантуются (сжимаются) на подпространства и группируются по центроидам кластеров Voronoi.
   * Обеспечивает сжатие индекса в памяти в 10–20 раз при сохранении быстродействия.

##### Простой пример с библиотекой FAISS:
\`\`\`python
import faiss
import numpy as np

d = 128                       # Размерность эмбеддингов
nb = 1000000                  # 1 миллион товаров
item_vectors = np.random.random((nb, d)).astype('float32')

# Создание быстрого HNSW индекса
index = faiss.IndexHNSWFlat(d, 32)
index.add(item_vectors)

# Вектор пользователя из User Tower
user_vector = np.random.random((1, d)).astype('float32')

# Поиск Top-10 ближайших товаров за < 1 мс!
distances, indices = index.search(user_vector, k=10)
print("Рекомендованные ID товаров:", indices)
\`\`\``,
      en: `### Content-Based Two-Tower Architectures & Vector ANN Search
Modern large-scale recommender systems split into Candidate Retrieval (sub-millisecond Top-1000 extraction) and Heavy Re-ranking.

#### 1. Two-Tower (Dual-Encoder) Pattern
* **User Tower:** Encodes user demographic, history, and real-time context into a normalized latent vector $u \in \mathbb{R}^d$.
* **Item Tower:** Encodes rich product catalog attributes, image embeddings, and textual descriptions into $v \in \mathbb{R}^d$.
* **Retrieval Score:** Cosine / Dot product affinity score $u^T v$. Item embeddings are computed offline and indexed in vector databases.

#### 2. Approximate Nearest Neighbors (ANN)
Exact $k$-NN linear scanning $O(N \cdot d)$ is too slow for production SLAs. Graph-based HNSW and quantized IVF-PQ indexes enable logarithmic $O(\log N)$ nearest neighbor retrieval via FAISS and ScaNN.`,
    },
    commonMistakes: [
      {
        ru: 'Конкатенировать признаки пользователя и товара в одну большую нейросеть на этапе первичного отбора кандидатов (Retrieval): чтобы отобрать топ из 10 000 000 товаров, пришлось бы прогнать нейросеть 10 000 000 раз на каждый клик. Именно поэтому применяют раздельные Two-Tower башни с векторным поиском.',
        en: 'Using early-interaction cross-encoders for initial candidate retrieval, requiring millions of neural forward passes per user request.',
      },
      {
        ru: 'Использовать точный поиск k-NN Flat на миллионных базах в продакшене без ANN-индексов (HNSW / ScaNN): это приводит к таймаутам веб-сервиса и отказу системы под нагрузкой.',
        en: 'Relying on brute-force linear search over multi-million item embeddings instead of sub-linear ANN indexes.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'recsys-cp-3-a',
        question: {
          ru: 'В чем ключевое эксплуатационное преимущество архитектуры Two-Tower (User Tower + Item Tower) на этапе Candidate Retrieval?',
          en: 'What is the primary operational advantage of the Two-Tower neural network design during Candidate Retrieval?',
        },
        options: [
          {
            ru: 'Эмбеддинги всех товаров каталога вычисляются офлайн один раз, а онлайн в реальном времени считается только башня пользователя с мгновенным векторным ANN-поиском',
            en: 'Item embeddings are pre-computed offline, leaving only the User Tower to compute online followed by sub-millisecond vector ANN lookup',
          },
          {
            ru: 'Two-Tower модель не требует данных для обучения',
            en: 'Two-Tower networks require zero training data',
          },
          {
            ru: 'Она всегда обучается в 100 раз быстрее обычных деревьев решений',
            en: 'It invariably trains 100x faster than decision tree ensembles',
          },
          {
            ru: 'Она исключает необходимость использования видеокарт',
            en: 'It completely eliminates the need for GPU accelerators',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Поскольку башни независимы, эмбеддинги товаров $v_i$ рассчитываются заранее в ночном батче и помещаются в индекс HNSW/FAISS. В онлайне достаточно один раз вычислить $u$ и запросить индекс за 2 мс.',
          en: 'Decoupled encoders allow offline generation of static item embeddings, reducing online inference to a single user forward pass and indexed nearest-neighbor lookup.',
        },
      },
      {
        id: 'recsys-cp-3-b',
        question: {
          ru: 'Какой алгоритм приближенного поиска ближайших соседей (ANN) основан на многослойном графе со связями малого мира?',
          en: 'Which Approximate Nearest Neighbor (ANN) index algorithm is based on multi-layered small-world proximity graphs?',
        },
        options: [
          { ru: 'HNSW (Hierarchical Navigable Small World)', en: 'HNSW (Hierarchical Navigable Small World)' },
          { ru: 'Dijkstra Shortest Path', en: 'Dijkstra Shortest Path' },
          { ru: 'Linear Search Flat Scan', en: 'Linear Search Flat Scan' },
          { ru: 'Bubble Sort Ranking', en: 'Bubble Sort Ranking' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'HNSW строит иерархию графов, где верхние слои позволяют совершать длинные прыжки между кластерами векторов, а нижние слои находят точных локальных соседей за $O(\\log N)$.',
          en: 'HNSW organizes vectors into a hierarchy of proximity graphs with skip-list navigation dynamics, yielding fast logarithmic search times.',
        },
      },
      {
        id: 'recsys-cp-3-c',
        question: {
          ru: 'Что такое In-Batch Negatives при обучении контрастивных рекомендательных моделей?',
          en: 'What are In-Batch Negatives in contrastive recommender training?',
        },
        options: [
          {
            ru: 'Использование товаров других пользователей из того же обучающего мини-батча в качестве отрицательных примеров без необходимости специального сэмплирования',
            en: 'Treating items interacted with by other users in the same mini-batch as negative samples without explicit negative mining',
          },
          {
            ru: 'Удаление отрицательных чисел из градиентов весов',
            en: 'Clipping negative weight gradient updates',
          },
          {
            ru: 'Игнорирование ошибок классификации в первом слое',
            en: 'Ignoring classification errors at the initial input layer',
          },
          {
            ru: 'Удаление дубликатов строк в таблице фактов',
            en: 'Deduplicating fact table transactions',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Если в батче $B$ пар $(u_k, v_k)$, то для пользователя $u_k$ положительным является товар $v_k$, а остальные $B-1$ товаров батча служат эффективными негативными примерами.',
          en: 'Within a mini-batch of $B$ positive pairs, all cross-diagonal items $(v_j, j \\neq k)$ serve as implicit negative targets, maximizing computational efficiency on GPUs.',
        },
      },
    ],
  },
  {
    id: 'recsys-4-ranking-metrics',
    moduleId: 'recsys',
    title: {
      ru: 'Метрики ранжирования и качества RecSys: NDCG@k, MAP@k, MRR и разнообразие',
      en: 'Ranking & Quality Metrics for RecSys: NDCG@k, MAP@k, MRR, Diversity & Serendipity',
    },
    order: 4,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Оценка качества рекомендательных систем
Почему классические метрики (Accuracy, MSE, ROC-AUC) недостаточны для RecSys?
В реальном интерфейсе пользователь видит только **Top-k** позиций (например, 5–10 карточек на экране смартфона). Ошибка в предсказании оценки фильму, который находится на 50 000-м месте в каталоге, бизнесу безразлична. Важен **порядок ранжирования на первых позициях**.

---

#### 1. Метрики наличия и точности в Top-K
* **HitRate@k (HR@k):**
  Бинарный индикатор: попал ли хотя бы один релевантный товар в Top-k рекомендаций пользователя:
  $$\text{HitRate@k} = \frac{1}{|U|} \sum_{u \in U} \mathbb{I}(|\text{Top-k}(u) \cap \text{Relevant}(u)| > 0)$$
* **Precision@k и Recall@k:**
  $$\text{Precision@k} = \frac{|\text{Top-k}(u) \cap \text{Relevant}(u)|}{k}, \quad \text{Recall@k} = \frac{|\text{Top-k}(u) \cap \text{Relevant}(u)|}{|\text{Relevant}(u)|}$$

---

#### 2. Позиционные метрики (Order-Aware Metrics)

##### MRR (Mean Reciprocal Rank)
Показывает, насколько высоко расположен **первый** релевантный результат:
$$\text{MRR} = \frac{1}{|U|} \sum_{u \in U} \frac{1}{\text{rank}_1(u)}$$
Если первый релевантный товар стоит на 1 месте — $\text{RR} = 1.0$; если на 2 месте — $\text{RR} = 0.5$; если на 10 месте — $\text{RR} = 0.1$.

##### MAP@k (Mean Average Precision)
Учитывает порядок **всех** релевантных рекомендаций в Top-k:
$$\text{AP@k} = \frac{1}{\min(m, k)} \sum_{i=1}^k P@i \cdot \text{rel}(i)$$
где $\text{rel}(i) = 1$, если на позиции $i$ находится релевантный товар, и $0$ иначе; $P@i$ — Precision на первых $i$ элементах.

##### NDCG@k (Normalized Discounted Cumulative Gain) — «Золотой стандарт» RecSys
NDCG учитывает градуированную релевантность (например: 3 — купил, 2 — добавил в корзину, 1 — кликнул, 0 — пропустил).

1. **Cumulative Gain (CG):** Сумма релевантностей без учета позиций $\text{CG@k} = \sum_{i=1}^k \text{rel}_i$.
2. **Discounted Cumulative Gain (DCG):** Логарифмический штраф за удаление от начала списка:
   $$\text{DCG@k} = \sum_{i=1}^k \frac{2^{\text{rel}_i} - 1}{\log_2(i + 1)}$$
3. **Ideal DCG (IDCG):** Значение DCG@k при идеальной сортировке товаров по убыванию релевантности.
4. **Normalized DCG:**
   $$\text{NDCG@k} = \frac{\text{DCG@k}}{\text{IDCG@k}} \in [0, 1]$$

---

#### 3. Бизнес-метрики за пределами точности (Beyond Accuracy)
Высокая точность NDCG может рекомендовать только очевидные бестселлеры (хлеб, молоко, iPhone). Это приводит к деградации пользовательского опыта («Filter Bubble»).

* **Catalog Coverage (Покрытие каталога):** Процент уникальных товаров из каталога, показанных пользователям:
  $$\text{Coverage} = \frac{|\bigcup_{u \in U} \text{Top-k}(u)|}{|I|}$$
* **Diversity (Внутрисписочное разнообразие):** Среднее расстояние между парами рекомендованных товаров в Top-k:
  $$\text{Diversity} = \frac{2}{k(k-1)} \sum_{i < j} (1 - \text{sim}(i, j))$$
* **Novelty (Новизна):** Способность системы рекомендовать редкие товары из «длинного хвоста» (Long Tail), а не только Top-10 популярных.
* **Serendipity (Неожиданность / Удачная находка):** Товары, которые оказались релевантными и удивили пользователя, так как не похожи на его обычную историю.`,
      en: `### Recommender Evaluation: Top-K Ranking Metrics & Beyond Accuracy
Traditional metrics (RMSE, Accuracy) misalign with production discovery feeds. Users inspect only Top-K ranked positions.

#### 1. Top-K Evaluation Metrics
* **HitRate@k, Precision@k, Recall@k:** Binary overlap measures within Top-k.
* **MRR (Mean Reciprocal Rank):** Reciprocal position of the very first hit: $\frac{1}{\text{rank}_1}$.
* **MAP@k (Mean Average Precision):** Evaluates precision at all relevant cutoffs.
* **NDCG@k (Normalized Discounted Cumulative Gain):** Industry gold standard balancing graded relevance with $\log_2(i + 1)$ rank discount penalties.

#### 2. Beyond Accuracy Metrics
* **Catalog Coverage:** Ratio of catalog actively explored by recommendations.
* **Diversity:** Pairwise distance between recommended items to avoid repetitive filter bubbles.
* **Serendipity & Novelty:** Rewarding serendipitous discovery of Long-Tail products.`,
    },
    commonMistakes: [
      {
        ru: 'Оценивать RecSys по метрике RMSE на тестовой выборке: модель с минимальным RMSE может превосходно угадывать оценки 1 и 2 плохим фильмам, но полностью заваливать порядок в Top-5 рекомендуемых фильмов на главной странице.',
        en: 'Relying exclusively on RMSE to evaluate recommenders, ignoring that Top-K ranking ordering determines real customer engagement.',
      },
      {
        ru: 'Игнорировать метрики разнообразия (Diversity): рекомендация 10 чехлов одного цвета дает высокий Precision, но вызывает отторжение пользователей.',
        en: 'Neglecting list diversity, creating repetitive filter bubbles that degrade user satisfaction.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'recsys-cp-4-a',
        question: {
          ru: 'Какая метрика ранжирования считается золотым стандартом в RecSys благодаря логарифмическому штрафу за позицию и учету градуированной релевантности?',
          en: 'Which ranking metric serves as the industry standard due to logarithmic positional decay and graded relevance weighting?',
        },
        options: [
          { ru: 'NDCG@k (Normalized Discounted Cumulative Gain)', en: 'NDCG@k (Normalized Discounted Cumulative Gain)' },
          { ru: 'MSE (Mean Squared Error)', en: 'MSE (Mean Squared Error)' },
          { ru: 'Accuracy', en: 'Accuracy' },
          { ru: 'R² (Коэффициент детерминации)', en: 'R² (Coefficient of Determination)' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'NDCG делит выигрыш от каждого релевантного товара на $\\log_2(i+1)$ (штраф за глубину позиции) и нормализует значение на идеальный IDCG, давая число в диапазоне от 0 до 1.',
          en: 'NDCG discounts relevance payoffs by $\\log_2(i+1)$ rank penalties and scales against ideal permutations, producing an interpretable [0, 1] benchmark.',
        },
      },
      {
        id: 'recsys-cp-4-b',
        question: {
          ru: 'Если первый релевантный товар в списке рекомендаций находится на 4-й позиции, каково значение Reciprocal Rank (RR)?',
          en: 'If the first relevant item in a recommendation list appears at rank position 4, what is the Reciprocal Rank (RR)?',
        },
        options: [
          { ru: '0.25 (1 / 4)', en: '0.25 (1 / 4)' },
          { ru: '4.0', en: '4.0' },
          { ru: '0.5', en: '0.5' },
          { ru: '0.0', en: '0.0' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Метрика Reciprocal Rank вычисляется как обратная величина от ранга первого релевантного объекта: $RR = \\frac{1}{\\text{rank}_1} = \\frac{1}{4} = 0.25$.',
          en: 'Reciprocal Rank evaluates the inverse index of the first hit: $RR = 1 / \\text{rank}_1 = 1 / 4 = 0.25$.',
        },
      },
      {
        id: 'recsys-cp-4-c',
        question: {
          ru: 'Что измеряет метрика Diversity (внутрисписочное разнообразие) в рекомендациях?',
          en: 'What does the Diversity metric quantify in recommendation lists?',
        },
        options: [
          {
            ru: 'Среднюю непохожесть (попарное расстояние) рекомендуемых товаров между собой в Top-k списке пользователя',
            en: 'The average pairwise dissimilarity between recommended items within a user\'s Top-K list',
          },
          {
            ru: 'Скорость обучения нейросети на GPU',
            en: 'GPU training throughput speed',
          },
          {
            ru: 'Количество пользователей в базе данных',
            en: 'The total user count in the database',
          },
          {
            ru: 'Размер файла датасета на диске',
            en: 'Dataset file size on disk',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Diversity предотвращает однообразие рекомендаций (например, показ 10 одинаковых смартфонов), вычисляя среднее попарное расстояние $1 - \\text{sim}(i, j)$ между товарами выдачи.',
          en: 'Diversity measures average pairwise distance $1 - \\text{sim}(i, j)$ among items in the recommendation slate, preventing single-category concentration.',
        },
      },
    ],
  },
];

export const recsysCards: Card[] = [
  {
    id: 'recsys-card-1',
    moduleId: 'recsys',
    lessonId: 'recsys-1-collaborative',
    type: 'flip',
    front: {
      ru: 'В чем преимущество Item-based коллаборативной фильтрации перед User-based?',
      en: 'What is the main operational advantage of Item-based over User-based collaborative filtering?',
    },
    back: {
      ru: 'Каталог товаров обычно меньше базы пользователей, а профиль оценок товара стабильнее. Матрицу сходства товаров $I \\times I$ можно предрассчитать офлайн в батче, получая низкую задержку онлайн-ответа.',
      en: 'Item catalogs are smaller and less volatile than dynamic user streams. Item-item similarity matrices are pre-computed offline, enabling low-latency online serving.',
    },
    tags: ['recsys', 'collaborative-filtering', 'architecture'],
  },
  {
    id: 'recsys-card-2',
    moduleId: 'recsys',
    lessonId: 'recsys-2-matrix-factorization',
    type: 'flip',
    front: {
      ru: 'Как устроена формула предсказания оценки в модели FunkSVD со смещениями (Biases)?',
      en: 'What is the prediction equation in Biased FunkSVD matrix factorization?',
    },
    back: {
      ru: '$\\hat{r}_{ui} = \\mu + b_u + b_i + p_u^T q_i$\nгде $\\mu$ — глобальное среднее, $b_u$ — смещение пользователя, $b_i$ — смещение товара, $p_u^T q_i$ — скрытое векторное взаимодействие.',
      en: '$\\hat{r}_{ui} = \\mu + b_u + b_i + p_u^T q_i$\nwhere $\\mu$ is global mean, $b_u$ is user bias, $b_i$ is item bias, and $p_u^T q_i$ models latent interaction.',
    },
    tags: ['recsys', 'matrix-factorization', 'funksvd'],
  },
  {
    id: 'recsys-card-3',
    moduleId: 'recsys',
    lessonId: 'recsys-3-two-tower-ann',
    type: 'cloze',
    clozeText: {
      ru: 'В архитектуре Two-Tower эмбеддинги товаров рассчитываются {{c1::офлайн}}, а онлайн в реальном времени запускается только {{c2::User Tower}} с поиском через ANN.',
      en: 'In Two-Tower architectures, item embeddings are computed {{c1::offline}}, whereas online serving only evaluates the {{c2::User Tower}} with ANN search.',
    },
    answer: {
      ru: 'офлайн, User Tower',
      en: 'offline, User Tower',
    },
    tags: ['recsys', 'two-tower', 'deep-learning'],
  },
  {
    id: 'recsys-card-4',
    moduleId: 'recsys',
    lessonId: 'recsys-4-ranking-metrics',
    type: 'flip',
    front: {
      ru: 'Как вычисляется Discounted Cumulative Gain (DCG@k)?',
      en: 'How is Discounted Cumulative Gain (DCG@k) computed?',
    },
    back: {
      ru: '$\\text{DCG@k} = \\sum_{i=1}^k \\frac{2^{\\text{rel}_i} - 1}{\\log_2(i + 1)}$\nКаждая релевантность штрафуется логарифмическим дисконтом за глубину позиции $i$ в списке.',
      en: '$\\text{DCG@k} = \\sum_{i=1}^k \\frac{2^{\\text{rel}_i} - 1}{\\log_2(i + 1)}$\nRelevance gains are penalized by logarithmic position discounts.',
    },
    tags: ['recsys', 'ndcg', 'ranking-metrics'],
  },
];

export const recsysQuiz: QuizQuestion[] = [
  {
    id: 'recsys-q-1',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какая метрика сходства в коллаборативной фильтрации вычитает среднюю оценку пользователя перед расчетом косинуса?',
      en: 'Which similarity metric mean-centers user ratings before cosine computation?',
    },
    options: [
      { ru: 'Корреляция Пирсона (Pearson Correlation)', en: 'Pearson Correlation' },
      { ru: 'Евклидово расстояние L2', en: 'L2 Euclidean distance' },
      { ru: 'Манхэттенское расстояние L1', en: 'L1 Manhattan distance' },
      { ru: 'Расстояние Хэмминга', en: 'Hamming distance' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Корреляция Пирсона центрирует оценки пользователей, устраняя индивидуальное смещение между строгими и лояльными оценщиками.',
      en: 'Pearson correlation mean-centers user ratings to eliminate personal rating scale biases.',
    },
    tag: 'recsys-collaborative',
  },
  {
    id: 'recsys-q-2',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Почему при обучении на неявном фидбеке (Implicit Feedback: клики, просмотры) используют алгоритм iALS вместо FunkSVD?',
      en: 'Why is iALS preferred over FunkSVD when training on implicit feedback (clicks, impressions)?',
    },
    options: [
      {
        ru: 'В неявном фидбеке нет отрицательных меток (не кликнул $\\neq$ не нравится), поэтому iALS вводит уровень доверия $c_{ui} = 1 + \\alpha r_{ui}$ и учитывает всю матрицу',
        en: 'Implicit feedback lacks true negative signals, requiring confidence weights $c_{ui} = 1 + \\alpha r_{ui}$ evaluated across all entries',
      },
      {
        ru: 'Потому что iALS работает только на языке SQL',
        en: 'Because iALS is an SQL-only method',
      },
      {
        ru: 'FunkSVD не может работать с матрицами более 100 строк',
        en: 'FunkSVD cannot process matrices over 100 rows',
      },
      {
        ru: 'iALS удаляет все пропущенные значения без вычислений',
        en: 'iALS deletes unobserved cells without compute',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'iALS рассматривает все взаимодействия как положительные предпочтения с разным уровнем уверенности $c_{ui}$, а пропуски — как слабое нулевое предпочтение с базовой уверенностью 1.',
      en: 'iALS models interactions as confidence-weighted preferences, treating unobserved pairs as low-confidence negatives.',
    },
    tag: 'recsys-factorization',
  },
  {
    id: 'recsys-q-3',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какую роль выполняет библиотека FAISS или индекс HNSW в архитектуре Two-Tower?',
      en: 'What role does FAISS or an HNSW index play in a Two-Tower production architecture?',
    },
    options: [
      {
        ru: 'Обеспечивает приближенный поиск ближайших векторных соседей (ANN) среди миллионов товаров за несколько миллисекунд',
        en: 'Performs sub-millisecond Approximate Nearest Neighbor (ANN) search across millions of item vectors',
      },
      {
        ru: 'Сжимает изображения товаров в формат JPEG',
        en: 'Compresses product images into JPEG format',
      },
      {
        ru: 'Обучает градиентный бустинг CatBoost',
        en: 'Trains CatBoost gradient boosting trees',
      },
      {
        ru: 'Генерирует текст описания товаров с помощью LLM',
        en: 'Generates product descriptions using LLMs',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'После вычисления вектора пользователя $u$ через User Tower индекс HNSW/FAISS находит Top-k ближайших векторов товаров $v_i$ со сложностью $O(\\log N)$.',
      en: 'Given a query embedding $u$, HNSW/FAISS navigates proximity graph layers to identify nearest candidate items in sub-linear time.',
    },
    tag: 'recsys-two-tower',
  },
  {
    id: 'recsys-q-4',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Чему равен Reciprocal Rank (RR), если первый релевантный товар оказался на 2-й позиции в выданном списке?',
      en: 'What is the Reciprocal Rank (RR) if the first relevant item appears at rank position 2?',
    },
    options: [
      { ru: '0.5', en: '0.5' },
      { ru: '2.0', en: '2.0' },
      { ru: '1.0', en: '1.0' },
      { ru: '0.25', en: '0.25' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Reciprocal Rank равен $1 / \\text{rank}_1 = 1 / 2 = 0.5$.',
      en: 'Reciprocal Rank is defined as $1 / \\text{rank}_1 = 1 / 2 = 0.5$.',
    },
    tag: 'recsys-metrics',
  },
];
