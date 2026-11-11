import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const mlSystemDesignMeta: ModuleMeta = {
  id: 'ml-system-design',
  title: {
    ru: 'ML System Design: Архитектура масштабных систем',
    en: 'ML System Design: Large-Scale System Architecture',
  },
  description: {
    ru: 'Инженерное проектирование ML-систем для собеседований и продакшна: 4-шаговый фреймворк, стриминг и батч фичи (Feature Store, Feast, Kafka), двухэтапный инференс (Candidate Retrieval + Heavy Re-ranking), Triton/vLLM и разбор сквозного кейса банковского антифрода (SLA < 50мс).',
    en: 'End-to-end ML system design for interviews and production: 4-step framework, streaming & batch feature pipelines (Feature Store, Feast, Kafka), two-stage inference (Candidate Retrieval + Heavy Re-ranking), Triton/vLLM serving, and a comprehensive bank fraud detection case study (SLA < 50ms).',
  },
  order: 17,
  icon: 'ml-system-design',
  estimatedMinutes: 95,
  isPlaceholder: false,
};

export const mlSystemDesignLessons: Lesson[] = [
  {
    id: 'sysdesign-1-framework',
    moduleId: 'ml-system-design',
    title: {
      ru: 'Фреймворк собеседования по ML System Design и оценка масштаба',
      en: 'ML System Design Interview Framework & Back-of-the-Envelope Estimation',
    },
    order: 1,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: {
      ru: `### Что проверяет секция ML System Design?
Секция ML System Design на собеседованиях уровня Middle+/Senior/Lead проверяет не умение вызвать \`model.fit()\`, а способность построить жизнеспособную, масштабируемую инженерную систему, решающую бизнес-задачу компании в условиях реальных ограничений (Latency, Throughput, Cost, Data Freshness).

---

#### 1. Универсальный 4-шаговый фреймворк (45 минут интервью)

##### Шаг 1: Уточнение требований и рамок задачи (5–8 минут)
Никогда не начинайте проектировать архитектуру сразу. Задавайте уточняющие вопросы:
* **Бизнес-цель:** Чего мы хотим достичь? (Снизить потери от мошенничества на $20\\%$, увеличить кликабельность ленты CTR на $5\\%$).
* **Функциональные требования:** Что делает система? (Принимает транзакцию пользователя в реальном времени и возвращает решение: Approve, Decline или Review).
* **Нефункциональные требования:**
  * **Latency (Задержка):** P99 < 50 мс (критично для банковских оплат) или допустима задержка в 500 мс?
  * **Throughput (Пропускная способность):** Пиковый QPS (Queries per second) — например, 10 000 запросов/сек.
  * **Freshness (Свежесть данных):** Насколько быстро фичи о действиях пользователя должны быть видны модели? (Real-time < 1 сек или Batch за вчерашний день?).
  * **Масштаб:** Сколько активных пользователей (DAU = 50 млн)? Сколько объектов в каталоге ($10^8$ товаров)?

##### Шаг 2: Постановка задачи и дизайн метрик (5–7 минут)
* **ML-формулировка:** Бинарная классификация (fraud/not-fraud), многоклассовая, регрессия, ранжирование (Learning to Rank) или генерация?
* **Бизнес-метрика:** Общая спасенная сумма денег (Saved Fraud Volume) за вычетом потерь от оттока ложно заблокированных клиентов (Churn Cost).
* **Офлайн-метрики:** PR-AUC (Precision-Recall AUC критичен при дисбалансе классов!), ROC-AUC, NDCG@k для ранжирования.
* **Онлайн-метрики:** Конверсия, GMV, CTR, отток (Customer Churn), доля ручных проверок (Manual Review Rate).

##### Шаг 3: Высокоуровневая архитектура (15 минут)
Рисуем ключевые блоки сквозного пайплайна:
\`\`\`
[Клиент / App] ──> [API Gateway] ──> [Inference Service] ──> [Prediction Cache]
                                             │
                       ┌─────────────────────┴──────────────────────┐
                       ▼                                            ▼
            [Online Feature Store]                       [Model Serving Cluster]
              (Redis: latency < 3ms)                       (Triton / ONNX Runtime)
                       ▲
                       │ Streaming Ingestion (Kafka + Flink)
                       │
              [Event Streaming Bus]
                       │
                       ▼ Batch Ingestion
            [Offline Data Lake / DWH] ──> [Training Pipeline] ──> [Model Registry]
              (Iceberg, ClickHouse)         (Airflow, Kubeflow)      (MLflow)
\`\`\`

##### Шаг 4: Детализация и узкие места (10–12 минут)
* Борьба с холодным стартом (Cold Start).
* Обновление моделей (Online Learning vs Scheduled Retraining).
* Мониторинг Data Drift / Concept Drift и отказоустойчивость (Graceful Degradation).

---

#### 2. Быстрые расчеты масштаба (Back-of-the-Envelope)
Умение быстро прикинуть порядок чисел в уме — ключевой признак зрелого инженера.
* **Расчет QPS:** Если сервис имеет 100 млн пользователей в день (DAU), и каждый делает в среднем 10 запросов:
  $$\text{Total Daily Requests} = 10^8 \times 10 = 10^9 \text{ запросов/день}$$
  $$\text{Average QPS} = \frac{10^9}{86400} \approx 11\,500 \text{ QPS}$$
  Пиковый QPS с запасом на распродажи ($\times 2.5–3$): $\approx \mathbf{30\,000–35\,000 \text{ QPS}}$.
* **Память под векторный индекс (Embedding Storage):**
  10 млн товаров, вектор размерности $d = 256$ чисел \`float32\` (4 байта):
  $$\text{RAM} = 10^7 \times 256 \times 4 \text{ bytes} \approx 10.24 \text{ GB}$$
  Служебные структуры графа HNSW требуют еще $\times 1.5–2$, итого $\approx 20 \text{ GB}$ оперативной памяти — легко помещается на одну стандартную ноду с Redis или FAISS!
`,
      en: `### The ML System Design Interview Framework & Scoping
ML System Design evaluates your capability to construct reliable, scalable architectures meeting real SLA and business requirements.

---

#### 1. The 4-Step Interview Framework
1. **Requirements & Scope (5-8m):** Functional vs non-functional constraints (P99 latency SLA, peak QPS, freshness, DAU).
2. **ML Framing & Metric Design (5-7m):** Offline metrics (PR-AUC, NDCG) aligned with online KPIs (GMV, Fraud loss, Churn).
3. **High-Level Architectural Blueprint (15m):** Client -> Gateway -> Feature Store -> Model Serving -> Continuous Training loop.
4. **Deep-Dive Bottlenecks & Failure Modes (10-12m):** Cold start, drift telemetry, horizontal scaling, graceful fallback.

---

#### 2. Back-of-the-Envelope Estimation
Calculating peak QPS and vector index memory footprint confirms infrastructure feasibility before coding.
`,
    },
    commonMistakes: [
      {
        ru: 'Сразу бросаться в выбор сложной архитектуры нейросети (например, «возьмем LLM 70B») без выяснения ограничений по задержке (Latency SLA) и бюджету инфраструктуры.',
        en: 'Jumping straight into heavy model architectures before clarifying latency SLAs and hardware budget constraints.',
      },
      {
        ru: 'Использование метрики ROC-AUC для задач с экстремальным дисбалансом классов (например, фрод 0.01%): при редких событиях ROC-AUC обманчиво оптимистичен, необходим PR-AUC!',
        en: 'Relying on ROC-AUC for extreme class imbalance (0.01% fraud) where PR-AUC is mathematically required.',
      },
      {
        ru: 'Забывать про отказоустойчивость: что делает система, если Feature Store или инференс-сервис недоступен (отсутствие эвристического фоллбэка приводит к простою бизнеса).',
        en: 'Omitting graceful degradation fallbacks when online model services experience outages.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-sys-1-1',
        question: {
          ru: 'Какая офлайн-метрика качества наиболее адекватна для задачи с экстремальным дисбалансом классов (например, мошенничество составляет 0.05% от всех транзакций)?',
          en: 'Which offline metric is most appropriate for extreme class imbalance (e.g. 0.05% fraud prevalence)?',
        },
        options: [
          'PR-AUC (площадь под Precision-Recall кривой), так как она не завышается огромным числом истинно-отрицательных примеров (True Negatives)',
          'Accuracy (доля правильных ответов), так как 99.95% accuracy гарантирует идеальную модель',
          'ROC-AUC, потому что он одинаково хорош для абсолютно любых распределений',
          'Mean Squared Error (MSE)',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'При редких событиях False Positive Rate в ROC-AUC искусственно занижается огромным числом нормальных транзакций (True Negatives). PR-AUC оценивает только соотношение полезного сигнала (True Positives) к ошибкам (False Positives/Negatives).',
          en: 'Under severe class imbalance, ROC-AUC is distorted by massive true negatives, whereas PR-AUC strictly tracks precision and recall on the minority positive class.',
        },
      },
      {
        id: 'q-sys-1-2',
        question: {
          ru: 'Сколько оперативной памяти (RAM) потребуется для хранения эмбеддингов 50 миллионов пользователей размерностью d = 128 в формате float32 (без учета графа индекса)?',
          en: 'How much RAM is required to store embeddings for 50 million users with dimension d = 128 in float32 (raw vectors)?',
        },
        options: [
          'Примерно 25.6 гигабайт ($50 \\times 10^6 \\times 128 \\times 4 \\text{ байта} \\approx 25.6 \\text{ GB}$)',
          'Примерно 256 терабайт',
          'Около 500 мегабайт',
          'Не более 10 гигабайт',
        ],
        correctAnswer: 0,
        explanation: {
          ru: '1 число float32 занимает 4 байта. Один вектор: $128 \\times 4 = 512$ байт. 50 млн векторов: $50\\,000\\,000 \\times 512 = 25.6 \\times 10^9$ байт $\\approx 25.6$ ГБ.',
          en: '50M vectors * 128 dimensions * 4 bytes per float32 = 25.6 GB of raw memory.',
        },
      },
      {
        id: 'q-sys-1-3',
        question: {
          ru: 'С чего обязательно нужно начинать решение задачи на секции ML System Design собеседования?',
          en: 'What is the mandatory first step when tackling an ML System Design interview prompt?',
        },
        options: [
          'С уточнения бизнес-целей, функциональных и нефункциональных требований (Latency SLA, QPS, объем данных, Freshness)',
          'С написания кода обучения PyTorch модели',
          'С выбора гиперпараметров для градиентного бустинга',
          'С немедленного выбора размера кластера Kubernetes',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Архитектура напрямую зависит от ограничений: сервис со строгим SLA < 20 мс проектируется принципиально иначе, чем батч-система со сроком вычислений в 4 часа. Уточнение требований — ключевой первый шаг.',
          en: 'Architectural blueprints directly hinge on latency, throughput, and scale constraints. Clarifying functional and non-functional requirements is paramount.',
        },
      },
    ],
  },
  {
    id: 'sysdesign-2-features-data-pipelines',
    moduleId: 'ml-system-design',
    title: {
      ru: 'Пайплайны данных, Feature Store и борьба с Training-Serving Skew',
      en: 'Data Pipelines, Feature Store & Preventing Training-Serving Skew',
    },
    order: 2,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: {
      ru: `### Кровь ML-системы: Данные и управление признаками
В реальных ML-системах более $80\\%$ сбоев и деградации точности вызваны не проблемами в коде нейросети, а рассинхронизацией данных между обучением и инференсом.

---

#### 1. Архитектура Feature Store (Feast, Hopsworks)
Feature Store решает проблему дублирования логики расчета фичей между Data Science командой (Jupyter/Python) и бэкенд-инженерами (Java/Go/C++).

Feature Store состоит из двух частей:
1. **Online Feature Store (Низкая задержка, P99 < 3 мс):**
   * *Хранилища:* **Redis**, **Cassandra**, **Aerospike**, **DynamoDB**.
   * *Задача:* Мгновенно вернуть вектор признаков по ключу \`user_id:12345\` в момент обработки пользовательского HTTP/gRPC запроса.
2. **Offline Feature Store (Высокая пропускная способность, терабайты):**
   * *Хранилища:* **ClickHouse**, **Snowflake**, **Apache Iceberg**, **Parquet / S3**.
   * *Задача:* Сбор гигантских обучающих датасетов с исторической точностью на определенный момент времени (**Point-in-Time Correctness / Time Travel**).

\`\`\`
                          [Feature Store Interface]
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
[Online Store (Redis)]                              [Offline Store (Parquet/Iceberg)]
  └── Serve at Inference (Key-Value lookup)            └── Generate Training Dataset (AS-OF Join)
\`\`\`

---

#### 2. Training-Serving Skew и утечка данных из будущего
**Training-Serving Skew (рассогласование обучения и инференса)** возникает, когда:
* Признаки на обучении и в продакшене вычисляются по разным формулам (например, в Spark на SQL, а в API на Python с легким расхождением в округлении или часовом поясе).
* **Data Leakage (Утечка из будущего):** При создании обучающей выборки транзакция за 12:00 обучается на фиче «число покупок за день», которая включает покупки, совершенные в 18:00 того же дня! В проде этой информации еще нет — модель в тестах показывает 99% accuracy, а в бою терпит полный крах.

##### Как бороться?
1. **Point-in-Time Joins (As-of Joins):** При объединении меток и признаков для каждого исторического события берутся значения фичей **строго до метки времени события ($t_{\\text{feature}} < t_{\\text{event}}$)**.
2. **Log and Store:** Логировать реальный вектор фичей прямо в момент боевого инференса в лог (Kafka) и использовать этот лог для будущего дообучения, гарантируя 100% идентичность данных!

---

#### 3. Потоковые фичи реального времени (Streaming Aggregations)
Для таких задач, как антифрод или рекомендации, критичны фичи, агрегируемые на лету:
* *«Сколько транзакций совершил пользователь за последние 60 секунд?»*
* *«Какова средняя сумма покупок по этой карте за последний час?»*

##### Движки потоковой обработки: Apache Flink / Spark Streaming
Используют скользящие окна (**Sliding Windows** и **Tumbling Windows**), сохраняя промежуточные аккумуляторы в RocksDB/Redis с мгновенным апдейтом по событиям из Kafka.
`,
      en: `### Feature Store Architecture & Preventing Training-Serving Skew
Over 80% of production ML failures stem from feature pipelines rather than weights.

---

#### 1. Dual Feature Store Architecture
* **Online Store (Redis/Aerospike):** Low-latency (<3ms) Key-Value lookup serving online inference.
* **Offline Store (Iceberg/Parquet):** Scalable storage generating historical datasets via point-in-time time-travel joins.

---

#### 2. Mitigating Training-Serving Skew
* Strict Point-in-Time (AS-OF) joins prevent future data leakage.
* Log-at-inference paradigms capture production features directly for retraining.

---

#### 3. Real-Time Streaming Aggregations
Apache Flink sliding windows maintain real-time counters (e.g. transactions in the last 60 seconds) directly in state backends.
`,
    },
    commonMistakes: [
      {
        ru: 'Расчет признаков в реальном времени прямыми тяжелыми SQL-запросами к боевой реляционной СУБД (Postgres) во время инференса — это кладет базу и пробивает SLA задержки.',
        en: 'Querying analytical aggregates directly from transactional Postgres tables during online inference, crashing the DB.',
      },
      {
        ru: 'Утечка данных из будущего (Target Leakage): расчет агрегатов (средний чек, частота кликов) по всей истории без привязки к временной отсечке события (Point-in-time).',
        en: 'Computing global historical aggregates across the entire timeline without point-in-time temporal joins.',
      },
      {
        ru: 'Пересчет статичных признаков (возраст, страна, категория товара) на каждый запрос вместо их предварительного предрасчета в батче и кэширования в Redis.',
        en: 'Recomputing static user demographics on every inference request rather than caching in a fast Key-Value store.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-sys-2-1',
        question: {
          ru: 'Что такое Training-Serving Skew в машинном обучении?',
          en: 'What is Training-Serving Skew in machine learning systems?',
        },
        options: [
          'Расхождение в распределении, значениях или логике вычисления признаков между этапом офлайн-обучения и онлайн-инференсом в продакшене',
          'Разница в физическом весе серверов обучения и серверов инференса',
          'Случайная потеря весов модели при сохранении на диск',
          'Ошибка нехватки памяти в видеокарте',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Training-Serving Skew возникает, когда логика подготовки данных в продакшене расходится с пайплайном обучения (разные языки, утечки из будущего, округления), что разрушает точность модели в бою.',
          en: 'Training-Serving Skew refers to discrepancies in feature computation logic or data distribution between offline training and live production serving.',
        },
      },
      {
        id: 'q-sys-2-2',
        question: {
          ru: 'Какую главную задачу решает Online Feature Store (например, на базе Redis) в архитектуре ML System Design?',
          en: 'What core role does an Online Feature Store (e.g. based on Redis) serve in ML System Design?',
        },
        options: [
          'Предоставление готового вектора признаков по ID пользователя или сущности с суб-миллисекундной задержкой (< 5 мс) во время инференса',
          'Обучение трансформеров с нуля',
          'Сжатие видеофайлов пользователей',
          'Автоматический перевод текста на английский язык',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Online Feature Store хранит предрассчитанные свежие фичи в оперативной памяти (Key-Value) и мгновенно отдает их сервису инференса, укладываясь в жесткие требования SLA.',
          en: 'Online feature stores provide low-latency (<5ms) retrieval of pre-aggregated feature vectors during online prediction calls.',
        },
      },
      {
        id: 'q-sys-2-3',
        question: {
          ru: 'Что обеспечивает метод Point-in-Time Join (As-of Join) при подготовке обучающего датасета?',
          en: 'What does a Point-in-Time Join (As-of Join) guarantee during training dataset preparation?',
        },
        options: [
          'Гарантирует, что для каждого исторического события будут взяты только те значения признаков, которые были известны строго до момента совершения события (защита от Data Leakage)',
          'Автоматически ускоряет время работы процессора в 2 раза',
          'Удаляет все пропущенные значения из базы данных',
          'Шифрует данные пользователей по стандарту AES-256',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Point-in-Time корректность устраняет утечки из будущего: если пользователь совершил покупку в 14:00, берутся фичи, зафиксированные ровно до 14:00, исключая события последующих часов.',
          en: 'Point-in-time correctness ensures features reflect exact historical timestamps preceding the target event, preventing future data leakage.',
        },
      },
    ],
  },
  {
    id: 'sysdesign-3-inference-serving-scaling',
    moduleId: 'ml-system-design',
    title: {
      ru: 'Архитектура онлайн-инференса: Двухэтапный поиск, Triton и vLLM',
      en: 'Online Inference Architecture: Two-Stage Funnel, Triton & vLLM',
    },
    order: 3,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: {
      ru: `### Проблема инференса: как проскорить миллионы объектов за 30 миллисекунд?
В интернет-магазине 50 млн товаров. Невозможно прогнать тяжелый трансформер или ансамбль бустинга по 50 млн вариантов для каждого поискового запроса пользователя — это займет 10 секунд и разорит компанию на серверах.

Решение: **Многоэтапная воронка (Multi-Stage Funnel Architecture)**.

---

#### 1. Двухэтапная воронка ранжирования (Two-Stage Ranking)

\`\`\`
[Каталог: 50 000 000 товаров]
             │
             ▼ 1. Candidate Generation / Retrieval (SLA < 10 ms)
             │    - Двухбашенные Two-Tower нейросети + ANN (HNSW / FAISS / ScaNN)
             │    - Простые фильтры по категории, городу, популярности
             ▼
[Кандидаты: 1 000 товаров]
             │
             ▼ 2. Heavy Ranking / Scoring (SLA < 25 ms)
             │    - Мощный GBDT (CatBoost / LightGBM) или Deep Cross Network (DCN)
             │    - Сотни real-time фичей пользователя и товара
             ▼
[Топ: 50 товаров] ──> 3. Re-ranking & Diversity ──> Выдача пользователю (Top-20)
\`\`\`

1. **Retrieval (Отбор кандидатов):** Быстрый отсев $99.99\%$ каталога. Вектор пользователя матчится с базой векторов товаров через векторный поиск (ANN — Approximate Nearest Neighbors: HNSW, IVF-PQ) со сложностью $O(\\log N)$.
2. **Ranking (Тяжелое ранжирование):** Точный скоринг оставшихся $\\sim 500–1000$ кандидатов глубокой моделью с учетом истории последних кликов, персонализации и контекста запроса.
3. **Re-ranking / Business Rules (Пост-обработка):** Устранение дубликатов, обеспечение разнообразия (Diversity), учет спонсорских товаров и правил безопасности.

---

#### 2. Специализированные инференс-серверы: Triton и vLLM
Запуск моделей через наивный Flask/FastAPI в проде приводит к низкой утилизации GPU ($< 15\\%$) и гигантским задержкам при всплесках трафика.

##### NVIDIA Triton Inference Server
Золотой стандарт продакшн-сервинга для CV, Audio и классического ML:
* **Dynamic Batching (Динамический батчинг):** Сервер накапливает запросы от разных пользователей за микроскопическое окно (например, 2 мс) и отправляет их на GPU единым параллельным батчем. Утилизация GPU подскакивает до $85\\%$, а throughput возрастает в $4–6$ раз!
* **Concurrent Model Execution:** Параллельное выполнение нескольких легковесных моделей на одной видеокарте.
* **Поддержка бэкендов:** TensorRT, ONNX Runtime, OpenVINO, PyTorch C++ LibTorch.

##### vLLM (Для больших языковых моделей — LLM)
* **PagedAttention:** Устраняет фрагментацию памяти KV-кэша трансформеров, организуя виртуальную страничную память (по аналогии с ОС). Позволяет запускать в 4–8 раз больший batch size без OOM.
* **Continuous Batching (Непрерывный батчинг):** Новые токены генерируются по мере завершения генерации предыдущих, исключая простой потоков.

---

#### 3. Кэширование и Graceful Degradation (Отказоустойчивость)
* **Prediction Cache (Redis):** Для частых повторных запросов (например, популярные поисковые фразы «iphone 16», «доставка пиццы») результат ранжирования кэшируется на 5–15 минут.
* **Graceful Degradation (Плавная деградация):** Если система под пиковой нагрузкой не успевает прогнать тяжелый ранкинг за 40 мс:
  1. Тайм-аут прерывает тяжелую модель.
  2. Клиенту мгновенно отдается простой топ по популярности (Fallback).
  3. Пользователь видит страницу без ошибки 504 Gateway Timeout!
`,
      en: `### Online Inference Architecture: Two-Stage Funnel & Serving Engines
Evaluating millions of items in real time requires tiered filtration.

---

#### 1. Two-Stage Funnel Architecture
* **Stage 1: Retrieval / Candidate Generation (<10ms):** Reduces $10^7$ down to $10^3$ candidates via ANN vector search (HNSW, FAISS) or inverted indexes.
* **Stage 2: Heavy Scoring / Ranking (<25ms):** Scores candidates with complex GBDTs or cross-encoders.
* **Stage 3: Business Logic & Re-ranking:** Enforces diversity, deduplication, and regulatory filters.

---

#### 2. Production Serving: Triton & vLLM
* **NVIDIA Triton:** Dynamic batching bundles concurrent queries into unified GPU tensors, quadrupling throughput.
* **vLLM:** PagedAttention partitions KV-caches, preventing VRAM memory fragmentation.

---

#### 3. Graceful Degradation
Under unexpected load spikes, timeout circuit breakers trigger lightweight popularity heuristics rather than failing requests.
`,
    },
    commonMistakes: [
      {
        ru: 'Попытка прогнать тяжелую нейросеть по всей базе объектов (миллионы элементов) без предварительного этапа быстрого отбора кандидатов (Retrieval).',
        en: 'Attempting full-catalogue deep scoring without an initial sub-linear candidate retrieval stage.',
      },
      {
        ru: 'Использование наивного веб-сервера без динамического батчинга для GPU-инференса (видеокарта простаивает на 90%, обрабатывая запросы строго по одному).',
        en: 'Serving GPU models without dynamic batching, causing severe GPU under-utilization.',
      },
      {
        ru: 'Отсутствие жестких тайм-аутов и фоллбэк-стратегий: зависание одной модели на 500 мс приводит к каскадному отказу всего мобильного приложения.',
        en: 'Lacking timeout circuit-breakers and heuristic fallback responses during service degradation.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-sys-3-1',
        question: {
          ru: 'Какова главная задача первого этапа (Candidate Generation / Retrieval) в двухэтапной архитектуре рекомендаций и поиска?',
          en: 'What is the primary role of the Candidate Generation (Retrieval) stage in two-stage search/recsys architectures?',
        },
        options: [
          'Быстро отсеять миллионы нерелевантных объектов до нескольких сотен кандидатов за минимальное время (< 10 мс) с высокой полнотой (Recall)',
          'Окончательно отранжировать топ-3 товаров для покупки',
          'Сгенерировать текст рекламного объявления с помощью LLM',
          'Вычислить финансовый баланс пользователя в банке',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Retrieval работает с гигантским каталогом (миллионы товаров), используя быстрые приближенные методы (ANN / эмбеддинги / индексы), чтобы сжать пул до сотен кандидатов для тяжелого скоринга.',
          en: 'Candidate generation prioritizes high recall and sub-linear latency (<10ms) to reduce millions of items to hundreds of candidates for heavy downstream ranking.',
        },
      },
      {
        id: 'q-sys-3-2',
        question: {
          ru: 'Что делает механизм Dynamic Batching в сервере Triton Inference Server?',
          en: 'What does Dynamic Batching in NVIDIA Triton Inference Server achieve?',
        },
        options: [
          'Объединяет независимые входящие запросы от разных пользователей за короткое временное окно в один тензорный батч для параллельного выполнения на GPU',
          'Автоматически удаляет старые базы данных',
          'Перезагружает видеокарту после каждого запроса',
          'Конвертирует все изображения в черно-белый формат',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Динамический батчинг прозрачно для клиентов склеивает приходящие параллельно запросы в батч, загружая ядра видеокарты параллельными матричными операциями и резко повышая пропускную способность (throughput).',
          en: 'Dynamic batching gathers incoming requests within a tiny latency window into a single batch, drastically boosting GPU compute saturation and throughput.',
        },
      },
      {
        id: 'q-sys-3-3',
        question: {
          ru: 'Какую главную архитектурную проблему решает технология PagedAttention в движке vLLM?',
          en: 'What core bottleneck does PagedAttention in vLLM address?',
        },
        options: [
          'Устраняет неэффективное использование и фрагментацию видеопамяти при хранении Key-Value кэша длинных текстовых последовательностей',
          'Ускоряет загрузку веб-страниц в браузере Chrome',
          'Позволяет моделям работать вообще без видеопамяти',
          'Автоматически исправляет орфографические ошибки в коде Python',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В трансформерах память KV-кэша динамична и фрагментирована. PagedAttention управляет ею по принципу виртуальной памяти ОС (страницами), сокращая потери памяти до минимума и увеличивая батч в разы.',
          en: 'PagedAttention manages KV-cache memory using non-contiguous virtual memory paging, eliminating memory waste from pre-allocated buffer fragmentation.',
        },
      },
    ],
  },
  {
    id: 'sysdesign-4-case-fraud-detection',
    moduleId: 'ml-system-design',
    title: {
      ru: 'Сквозной кейс: Проектирование системы банковского антифрода (SLA < 50мс)',
      en: 'End-to-End Case Study: Real-Time Banking Fraud Detection (SLA < 50ms)',
    },
    order: 4,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Классический кейс собеседований: «Спроектируй Real-Time Антифрод для Банка»
Подобный вопрос регулярно задают в Revolut, Тинькофф/Т-Банк, Сбер, Stripe, Adyen, PayPal.
Задача: во время совершения карточной транзакции на кассе или в онлайне за доли секунды определить, является ли операция мошеннической.

---

#### 1. Требования и специфика задачи
* **Latency SLA:** Жесткий лимит: весь ответ платежного шлюза должен уложиться в 100 мс, из них на ML-модель выделено строго **$< 50$ мс**.
* **Throughput:** До $15\\,000$ транзакций/сек в пиковые предновогодние часы.
* **Экстремальный дисбаланс:** Менее $0.1\\%$ транзакций являются фродовыми.
* **Асимметрия стоимости ошибок (Cost Matrix):**
  * **False Negative (FN, пропуск мошенника):** Банк теряет полную сумму украденной транзакции (например, 100 000 руб.) + штрафы регулятора.
  * **False Positive (FP, блокировка честного клиента):** Клиент в панике на кассе магазина, не может купить товар, уходит к банку-конкуренту (потеря LTV клиента).

Поэтому порог принятия решений выбирается не из $P > 0.5$, а из **минимизации ожидаемых финансовых потерь (Expected Financial Loss)**:
$$\\text{Loss} = C_{\\text{FP}} \\cdot P(\\text{FP}) + C_{\\text{FN}} \\cdot P(\\text{FN})$$

---

#### 2. Архитектура сквозного пайплайна антифрода

\`\`\`
[Терминал / Покупка] ──> [Payment Gateway]
                                │ (Транзакция: card_id, merchant_id, amount, timestamp)
                                ▼
                        [Rule Engine (Drools)] ──(Критический черный список)──> [DECLINE (< 2ms)]
                                │
                                ▼
                    [Real-Time Feature Fetcher]
                    ├── Redis: Счетчики за 1м, 1ч, 24ч (velocity features)
                    └── HNSW / Graph: Связи card_id с подозрительными устройствами
                                │ (< 12 ms)
                                ▼
                       [Ensemble Scorer]
                    ├── Model 1: GBDT (CatBoost / LightGBM на CPU/Triton) ──> p_gbdt
                    └── Model 2: Isolation Forest / Autoencoder (аномалии) ──> p_anomaly
                                │ (< 15 ms)
                                ▼
                      [Decision Matrix Policy]
                     ├── Score < 0.2 ────> [APPROVE] (99% транзакций)
                     ├── 0.2 <= Score < 0.8 ──> [2FA / Push-подтверждение] (0.9%)
                     └── Score >= 0.8 ───> [DECLINE & Alert Fraud Team] (0.1%)
\`\`\`

---

#### 3. Критичные фичи для антифрода (Feature Engineering)
1. **Velocity Features (Скоростные признаки реального времени):**
   * Число транзакций по этой карте за последние 60 секунд, 10 минут, 1 час.
   * Сумма транзакций за последний час относительно средней суммы пользователя за месяц.
   * Количество разных терминалов/мерчантов за последние 15 минут.
2. **Географическая невозможность (Impossible Travel):**
   * Пользователь совершил покупку в Москве в 14:00, а в 14:15 транзакция происходит в Дубае (физически невозможно преодолеть расстояние за 15 минут).
3. **Графовые фичи (Graph Neural Networks / Link Analysis):**
   * Связан ли IP-адрес или отпечаток устройства (Device Fingerprint) с известными дроп-аккаунтами или мошенническими сетями (PageRank, Community Detection).

---

#### 4. Мониторинг дрейфа и состязательная адаптация
* **Состязательная природа (Adversarial Concept Drift):** Мошенники постоянно ищут лазейки в правилах и меняют паттерны атак.
* **Мониторинг задержки разметки (Delayed Feedback):** Факт мошенничества становится известен банку только через 2–14 дней, когда клиент замечает списание и подает заявку на чарджбэк (Chargeback).
* **Решение:** Мониторинг сдвига распределений признаков через **PSI (Population Stability Index)** и мониторинг доли транзакций, отправленных на 2FA, в режиме реального времени.
`,
      en: `### End-to-End Case Study: Real-Time Banking Fraud Detection (<50ms SLA)
A quintessential interview prompt across financial technology leaders.

---

#### 1. System Constraints & Asymmetric Costs
* **Strict SLA:** Sub-50ms inference within a 100ms overall payment gateway budget.
* **Throughput:** Up to 15,000 TPS under extreme class imbalance (<0.1% fraud).
* **Cost Matrix Optimization:** Balancing financial chargeback losses (False Negatives) against customer churn from blocked legitimate cards (False Positives).

---

#### 2. Pipeline Layout
Rule engine tier (<2ms) -> Real-time feature fetcher (<12ms, Redis velocity counts & device graphs) -> GBDT ensemble scorer (<15ms) -> Tiered decision policy (Approve / 2FA Challenge / Decline).

---

#### 3. Real-Time Feature Velocity & Graph Analytics
Tracking velocity counters (txns/min), impossible travel velocity, and device graph clustering.

---

#### 4. Delayed Feedback & Adversarial Drift
Chargeback lag (2-14 days) requires immediate Population Stability Index (PSI) monitoring on incoming feature streams.
`,
    },
    commonMistakes: [
      {
        ru: 'Игнорирование асимметрии стоимости ошибок: использование стандартного порога классификации 0.5 вместо взвешивания матрицы финансовых потерь.',
        en: 'Using default 0.5 decision thresholds instead of risk-weighted cost matrix optimization.',
      },
      {
        ru: 'Непонимание задержки меток (Delayed Feedback Loop): вера в то, что разметка мошенничества появляется мгновенно (в реальности чарджбэки приходят через недели).',
        en: 'Assuming ground-truth fraud labels arrive instantaneously rather than acknowledging 2-14 day chargeback delays.',
      },
      {
        ru: 'Отсутствие промежуточного действия (2FA / Challenge): деление решений только на жесткий отказ и одобрение (промежуточная проверка SMS спасает честных клиентов).',
        en: 'Binary Approve/Decline actions lacking a step-up authentication tier (2FA/SMS confirmation) for borderline scores.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-sys-4-1',
        question: {
          ru: 'Почему в банковском антифроде оптимальный порог классификации редко равен 0.5?',
          en: 'Why is the optimal classification threshold in banking fraud detection rarely 0.5?',
        },
        options: [
          'Потому что цена ошибки False Negative (пропуск мошенника и потеря денег) и False Positive (блокировка честного клиента) кардинально асимметричны, и порог выбирается из минимизации ожидаемых потерь',
          'Потому что компьютеры не умеют делить пополам',
          'Потому что вероятность фрода всегда строго выше 50%',
          'Потому что регулятор требует использовать только целые пороги',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Стоимость пропуска мошенничества (кража сотен тысяч рублей) несоизмерима со стоимостью отправки SMS-подтверждения. Порог смещают вниз для минимизации суммарного финансового риска.',
          en: 'Asymmetric costs dictate non-0.5 thresholds: missing a fraudulent heist costs vastly more than challenging a borderline user via two-factor authentication.',
        },
      },
      {
        id: 'q-sys-4-2',
        question: {
          ru: 'Что такое фичи скорости (Velocity Features) в системе антифрода?',
          en: 'What are Velocity Features in a fraud detection pipeline?',
        },
        options: [
          'Счетчики агрегированных действий пользователя за короткие скользящие окна времени (например, число и сумма транзакций за последние 60 сек, 1 час, 24 часа)',
          'Скорость вращения кулера на сервере базы данных',
          'Скорость набора текста пользователем на клавиатуре',
          'Частота обновления операционной системы смартфона',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Мошенники часто пытаются быстро обналичить или перевести средства серией быстрых транзакций. Real-time счетчики в Redis (Velocity Features) мгновенно выявляют подозрительную активность.',
          en: 'Velocity features aggregate real-time transaction frequency and volume across sliding temporal windows (e.g. 1 min, 1 hour) using low-latency memory stores.',
        },
      },
      {
        id: 'q-sys-4-3',
        question: {
          ru: 'В чем заключается фундаментальная сложность мониторинга и дообучения антифрод-моделей (Delayed Feedback)?',
          en: 'What is the fundamental challenge of monitoring and retraining fraud models regarding Delayed Feedback?',
        },
        options: [
          'Истинные метки мошенничества поступают с задержкой в несколько дней или недель (когда клиент обнаруживает списание и оформляет чарджбэк)',
          'Модели антифрода запрещено переобучать чаще одного раза в 5 лет',
          'Банковские серверы не поддерживают язык Python',
          'Мошенники никогда не используют интернет-банкинг',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Проблема Delayed Feedback: сегодня мы не знаем, были ли сегодняшние транзакции мошенническими. Чарджбэки от пострадавших клиентов приходят спустя 2–14 дней, что требует мониторинга распределений (PSI) до появления разметки.',
          en: 'Delayed feedback means true positive labels only surface when victims initiate chargebacks days or weeks later, hindering immediate supervised retraining.',
        },
      },
    ],
  },
];

export const mlSystemDesignCards: Card[] = [
  {
    id: 'card-sys-framework',
    moduleId: 'ml-system-design',
    type: 'flip',
    front: {
      ru: 'Каковы 4 ключевых шага фреймворка ML System Design на интервью?',
      en: 'What are the 4 core steps of the ML System Design interview framework?',
    },
    back: {
      ru: '1. **Уточнение требований и масштаба** (SLA задержки, QPS, Freshness).\n2. **Постановка задачи и метрики** (онлайн/офлайн, PR-AUC).\n3. **Высокоуровневая архитектура** (Feature Store, Serving, Training).\n4. **Детализация и масштабирование** (кэширование, дрейф, фоллбэки).',
      en: '1. **Requirements & Scope** (latency SLA, QPS, freshness).\n2. **Framing & Metrics** (online/offline alignment, PR-AUC).\n3. **High-Level Blueprint** (Feature store, inference, training).\n4. **Deep-Dive & Bottlenecks** (caching, drift, fallback).',
    },
    tags: ['system-design', 'interview-framework', 'architecture'],
  },
  {
    id: 'card-sys-two-stage',
    moduleId: 'ml-system-design',
    type: 'cloze',
    clozeText: {
      ru: 'В масштабных системах ранжирования этап {{c1::Retrieval (Candidate Generation)}} отбирает из миллионов объектов несколько сотен кандидатов за < 10 мс через {{c2::приближенный векторный поиск (ANN)}}.',
      en: 'In large-scale recommendation systems, {{c1::Retrieval (Candidate Generation)}} filters millions down to hundreds of candidates in < 10ms using {{c2::Approximate Nearest Neighbor (ANN)}} search.',
    },
    answer: {
      ru: 'Retrieval (Candidate Generation) и приближенный векторный поиск (ANN)',
      en: 'Retrieval (Candidate Generation) and Approximate Nearest Neighbor (ANN)',
    },
    tags: ['system-design', 'two-stage', 'retrieval'],
  },
  {
    id: 'card-sys-feature-store',
    moduleId: 'ml-system-design',
    type: 'flip',
    front: {
      ru: 'В чем разница между Online и Offline Feature Store?',
      en: 'What is the distinction between an Online vs Offline Feature Store?',
    },
    back: {
      ru: '**Online Store (Redis, Aerospike)**: суб-миллисекундная отдача признаков по ключу для продакшн-инференса.\n**Offline Store (Iceberg, Snowflake, Parquet)**: терабайтное хранилище с поддержкой Time-travel / As-of Joins для генерации обучающих выборок без утечек из будущего.',
      en: '**Online Store (Redis)**: sub-millisecond key-value feature retrieval for live inference.\n**Offline Store (Iceberg/Parquet)**: massive scale point-in-time time-travel joins for leakage-free model training.',
    },
    tags: ['feature-store', 'data-pipeline', 'architecture'],
  },
  {
    id: 'card-sys-cost-matrix',
    moduleId: 'ml-system-design',
    type: 'cloze',
    clozeText: {
      ru: 'В банковском антифроде порог принятия решений выбирается не из 0.5, а из минимизации {{c1::ожидаемых финансовых потерь (Expected Loss)}} с учетом асимметрии стоимости {{c2::False Negative и False Positive}}.',
      en: 'In banking fraud detection, decision thresholds minimize {{c1::Expected Financial Loss}} accounting for the cost asymmetry between {{c2::False Negatives and False Positives}}.',
    },
    answer: {
      ru: 'ожидаемых финансовых потерь (Expected Loss) и False Negative и False Positive',
      en: 'Expected Financial Loss and False Negatives and False Positives',
    },
    tags: ['fraud-detection', 'cost-matrix', 'business-metrics'],
  },
];

export const mlSystemDesignQuiz: QuizQuestion[] = [
  {
    id: 'quiz-sys-1',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Почему в высоконагруженных системах онлайн-рекомендаций и поиска используется двухэтапная архитектура (Retrieval + Re-ranking)?',
      en: 'Why do high-throughput search and recommender systems adopt a two-stage (Retrieval + Re-ranking) architecture?',
    },
    options: [
      {
        ru: 'Потому что вычислительно невозможно прогнать сложную глубокую модель скоринга по миллионам объектов каталога за допустимый SLA задержки (< 50 мс)',
        en: 'Because executing deep cross-encoders across millions of catalog items within strict latency SLAs (<50ms) is computationally impossible',
      },
      { ru: 'Потому что нейросети не умеют работать с каталогами более 100 товаров', en: 'Because neural networks cannot operate on over 100 items' },
      { ru: 'Чтобы специально запутать пользователей мобильного приложения', en: 'To intentionally obfuscate app recommendations' },
      { ru: 'Потому что так требует стандарт SQL-92', en: 'Because required by the SQL-92 standard' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Сложные модели (CatBoost со 100 фичами, трансформеры) требуют десятков миллисекунд даже на 1000 кандидатов. Быстрый Retrieval отсеивает 99.99% каталога за 5 мс, передавая на скоринг только реальных претендентов.',
      en: 'Heavy scoring models require tens of milliseconds for a few hundred candidates; the two-stage funnel ensures scalability over massive catalogs within tight response budgets.',
    },
    tag: 'system-design-funnel',
  },
  {
    id: 'quiz-sys-2',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какой механизм инференс-сервера NVIDIA Triton позволяет радикально увеличить утилизацию GPU при параллельных запросах?',
      en: 'Which mechanism in NVIDIA Triton Inference Server dramatically enhances GPU utilization under concurrent queries?',
    },
    options: [
      {
        ru: 'Dynamic Batching: динамическое объединение независимых входящих запросов в единый тензорный батч',
        en: 'Dynamic Batching: accumulating independent concurrent requests into a unified tensor batch',
      },
      { ru: 'Автоматический перевод кода модели на JavaScript', en: 'Transpiling model code into JavaScript' },
      { ru: 'Физическое отключение оперативной памяти сервера', en: 'Physically disconnecting host RAM' },
      { ru: 'Запрет на использование многопоточности', en: 'Disabling multi-threading' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Dynamic Batching агрегирует входящие HTTP/gRPC запросы за микросекундное окно ожидания в батч, загружая параллельные ядра Tensor Core видеокарты на 80-90% вместо одиночных прогонов.',
      en: 'Dynamic batching transparently aggregates concurrent asynchronous requests into dense matrix operations, saturating GPU compute capacity.',
    },
    tag: 'triton-serving',
  },
  {
    id: 'quiz-sys-3',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'В чем заключается опасность утечки данных из будущего (Target/Data Leakage) при расчете фичей для обучения?',
      en: 'What is the risk of future data leakage when engineering features for training?',
    },
    options: [
      {
        ru: 'Модель учится на признаках, которые в реальном времени еще не произошли на момент события, что дает идеальные метрики на тесте, но полный провал в продакшене',
        en: 'The model trains on features containing information that has not occurred yet at event time, causing inflated test metrics but complete production collapse',
      },
      { ru: 'Модель случайно удаляет свои веса', en: 'The model deletes its own weights' },
      { ru: 'База данных полностью перестает отвечать на запросы', en: 'The database stops responding' },
      { ru: 'Компьютер перегревается и отключается', en: 'Hardware overheating shutdown' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Если в фичу попала информация из будущего (например, покупки пользователя, совершенные ПОСЛЕ текущей транзакции), модель опирается на «чит» и в продакшене оказывается бессильна.',
      en: 'Future leakage provides illegitimate signals absent during production serving, producing artificially high validation accuracy that collapses in production.',
    },
    tag: 'data-leakage',
  },
  {
    id: 'quiz-sys-4',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какую политику принятия решений применяют в продакшн-антифроде для транзакций с пограничным скором подозрительности (например, score от 0.2 до 0.8)?',
      en: 'What decision policy is applied in production fraud systems for borderline risk scores (e.g. 0.2 to 0.8)?',
    },
    options: [
      {
        ru: 'Двухфакторная аутентификация (2FA / SMS-подтверждение / звонок), защищающая клиента без мгновенной блокировки',
        en: 'Step-up verification (2FA challenge / SMS code / callback), validating the user without hard declines',
      },
      { ru: 'Мгновенное аннулирование банковского счета', en: 'Instant account termination' },
      { ru: 'Списание дополнительной комиссии 50%', en: 'Charging an additional 50% penalty fee' },
      { ru: 'Полное игнорирование скоринга', en: 'Ignoring the score completely' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Промежуточный сценарий 2FA / Challenge позволяет проверить сомнительные транзакции: честный пользователь просто введет код из SMS, а мошенник, перехвативший данные карты, не сможет подтвердить операцию.',
      en: 'A step-up 2FA challenge safely verifies ambiguous transactions without triggering hard customer friction or financial chargebacks.',
    },
    tag: 'fraud-policy',
  },
];
