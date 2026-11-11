import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const mlopsProductionMeta: ModuleMeta = {
  id: 'mlops-production',
  title: {
    ru: 'MLOps и Продакшн: от экспериментов до мониторинга',
    en: 'MLOps & Production: from Experiment to Monitoring',
  },
  description: {
    ru: 'Доведение ML-моделей до бизнеса: Git для версионирования, контейнеризация в Docker, деплой через FastAPI, трекинг в MLflow / W&B, версионирование данных в DVC и мониторинг Data Drift.',
    en: 'Delivering ML models to production: Git versioning, Docker containerization, FastAPI model serving, experiment tracking with MLflow/W&B, data versioning with DVC, and data drift monitoring.',
  },
  order: 12,
  icon: 'mlops-production',
  estimatedMinutes: 90,
  isPlaceholder: false,
};

export const mlopsProductionLessons: Lesson[] = [
  {
    id: 'mlops-1-git-versioning',
    moduleId: 'mlops-production',
    title: {
      ru: 'Git для ML: воспроизводимость кода, ветвление и гигиена репозитория',
      en: 'Git for ML: Code Reproducibility, Branching & Repository Hygiene',
    },
    order: 1,
    estimatedMinutes: 16,
    draft: false,
    theoryMarkdown: {
      ru: `### Роль Git в жизненном цикле Machine Learning

В традиционной разработке ПО код детерминирован: одна и та же версия кода всегда порождает один и тот же бинарный артефакт.
В машинном обучении итоговая модель определяется **триадой**:
$$\\text{Модель} = f(\\text{Код}, \\; \\text{Данные}, \\; \\text{Гиперпараметры})$$
Git отвечает за строгое версионирование первой составляющей — программного кода и конфигураций обучения.

---

#### 1. Проблема Jupyter Notebooks (.ipynb) в Git
Файлы \`.ipynb\` представляют собой крупные JSON-документы, хранящие:
* Метаданные среды выполнения и счетчики ячеек (\`execution_count\`).
* Бинарный вывод графиков Base64 и логи, которые меняются при каждом запуске.

**Последствия:** обычный \`git diff\` превращается в нечитаемую простыню на тысячи строк, а слияние веток (\`merge\`) неизбежно ведет к неразрешимым конфликтам.

**Решения индустрии:**
1. **nbstripout:** Git-фильтр, автоматически очищающий ячейки вывода перед каждым \`git commit\`.
2. **Jupytext:** двусторонняя синхронизация между блокнотом \`.ipynb\` и чистым Python-скриптом \`.py\` (в Git коммитится только чистый \`.py\`).
3. **Правило продакшена:** в исследовательском режиме допустимы ноутбуки, но весь рабочий пайплайн переносится в модульные Python-пакеты (\`src/data/\`, \`src/models/\`, \`src/pipelines/\`).

---

#### 2. Гигиена .gitignore: что категорически запрещено коммитить в Git
* **Тяжелые данные:** \`*.csv\`, \`*.parquet\`, \`*.h5\`, \`*.sqlite\` (для них используется DVC).
* **Бинарные веса моделей:** \`*.pt\`, \`*.onnx\`, \`*.joblib\`, \`*.pkl\`, \`*.bin\` (хранятся в Model Registry).
* **Секреты и токены:** \`.env\`, \`credentials.json\`, приватные ключи AWS/GCP (только через Environment Variables).
* **Виртуальные окружения и кэш:** \`.venv/\`, \`__pycache__/\`, \`.ipynb_checkpoints/\`.

---

#### 3. Ветвление и тегирование релизов (Git Tags)
Каждая обученная модель, отправляемая в реестр моделей (Model Registry), обязана жестко привязываться к конкретному хэшу коммита Git:
\`\`\`bash
# Фиксация релизного состояния кода для модели v1.2.0
git checkout main
git tag -a v1.2.0 -m "Production LightGBM model, ROC-AUC: 0.932 on validation"
git push origin v1.2.0
\`\`\`
Это гарантирует, что через год любой инженер сможет выполнить \`git checkout v1.2.0\` и получить идентичный код обучения.`,
      en: `### Git in Machine Learning Lifecycle

In conventional software development, code is deterministic. In Machine Learning, production artifacts derive from a triad:
$$\\text{Model} = f(\\text{Code}, \\; \\text{Data}, \\; \\text{Hyperparameters})$$
Git acts as the authoritative ledger for codebase and training configurations.

---

#### 1. The Jupyter Notebook (.ipynb) Git Dilemma
Notebooks are serialized JSON documents containing execution counts, ephemeral outputs, and Base64 images. Raw \`git diff\` outputs become noisy, causing impossible merge conflicts.

**Industry Standard Solutions:**
1. **nbstripout:** git filter automatically stripping outputs prior to commit.
2. **Jupytext:** paired two-way syncing of notebooks to lightweight pure \`.py\` scripts.
3. **Production Standard:** prototype in notebooks, but refactor pipelines into structured Python packages (\`src/\`).

---

#### 2. .gitignore Hygiene: What Never Goes into Git
* **Data files:** \`*.csv\`, \`*.parquet\` (tracked via DVC).
* **Model weights:** \`*.pt\`, \`*.onnx\`, \`*.joblib\` (managed in Model Registries).
* **Secrets:** \`.env\`, cloud API tokens (use runtime environment injection).
* **Virtual environments & cache:** \`.venv/\`, \`__pycache__/\`.

---

#### 3. Release Tagging
Every trained model deployed to a Model Registry must map directly to an immutable Git commit hash:
\`\`\`bash
git tag -a v1.2.0 -m "LightGBM model v1.2.0, ROC-AUC: 0.932"
git push origin v1.2.0
\`\`\``,
    },
    commonMistakes: [
      {
        ru: 'Коммитить веса нейросетей (*.pt, *.onnx) размером сотни мегабайт напрямую в Git: это навсегда раздувает репозиторий и блокирует клонирование.',
        en: 'Committing multi-gigabyte model weights directly into Git history, permanently corrupting repository size.',
      },
      {
        ru: 'Хранить API-ключи облачных хранилищ и пароли от баз данных в коде скрипта или конфигах без .env.',
        en: 'Hardcoding cloud credentials and database connection URIs directly in source files.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'mlops-cp-git-1',
        question: {
          ru: 'Почему бинарные файлы обученных моделей (*.pt, *.onnx) и тяжелые датасеты не следует хранить в обычном Git-репозитории?',
          en: 'Why should trained model weights (*.pt, *.onnx) and large datasets avoid standard Git tracking?',
        },
        options: [
          {
            ru: 'Git хранит полную историю изменений каждого бинарного файла, что приводит к лавинообразному раздуванию репозитория до гигабайт',
            en: 'Git stores full binary snapshots in its historical tree, causing repo size bloat and slow network operations',
          },
          {
            ru: 'Git повреждает байты при коммите файлов размером больше 1 МБ',
            en: 'Git corrupts file bytes whenever sizes exceed 1 MB',
          },
          {
            ru: 'Бинарные файлы невозможно компилировать в Python',
            en: 'Binary files cannot be executed by Python',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Git оптимизирован для построчного текстового diff. При каждом обновлении весов модели Git сохраняет копию всего многомегабайтного файла целиком.',
          en: 'Git is designed for textual deltas; changing binary weights forces Git to store whole full-sized snapshots.',
        },
      },
    ],
  },
  {
    id: 'mlops-2-docker-containerization',
    moduleId: 'mlops-production',
    title: {
      ru: 'Docker для ML: воспроизводимое окружение, Dockerfile и Multi-Stage сборка',
      en: 'Docker for ML: Reproducible Environment, Dockerfile & Multi-Stage Builds',
    },
    order: 2,
    estimatedMinutes: 18,
    draft: false,
    theoryMarkdown: {
      ru: `### Проблема «На моей машине всё работало» в ML

ML-модели крайне чувствительны к системным зависимостям:
* Версии C++ компилятора и системных библиотек (\`glibc\`, \`libgomp\` для OpenMP в XGBoost/LightGBM).
* Версии NVIDIA CUDA Driver, CUDA Toolkit и cuDNN для PyTorch.
* Версии Python и скомпилированных C-extensions (NumPy, SciPy).

**Контейнеризация через Docker** упаковывает код, интерпретатор, все библиотеки Python и системные зависимости в изолированный стандартизированный образ (Image).

---

#### 1. Выбор базового образа (Base Image)
* **Для CPU-инференса:** \`python:3.11-slim\` (весит ~150 МБ в отличие от тяжелого 1 ГБ \`python:3.11\`).
* **Для GPU-инференса:** официальные образы NVIDIA CUDA, например \`nvidia/cuda:12.2.0-runtime-ubuntu22.04\`.
* На хост-машине с видеокартой требуется установка **NVIDIA Container Toolkit**, позволяющего пробрасывать видеокарту внутрь контейнера:
\`\`\`bash
docker run --gpus all -p 8000:8000 ml-service:latest
\`\`\`

---

#### 2. Оптимизация слоев Dockerfile
Docker кэширует каждый шаг сборки. Если изменить одну строчку кода в конце, все предыдущие шаги берутся из кэша.
\`\`\`dockerfile
# 1. Базовый образ
FROM python:3.11-slim

# 2. Установка системных зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \\
    libgomp1 \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. КЭШИРОВАНИЕ ЗАВИСИМОСТЕЙ: копируем requirements ДО кода!
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Копируем код приложения и веса модели
COPY src/ ./src/
COPY models/ ./models/

# 5. Безопасность: непривилегированный пользователь
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

---

#### 3. Multi-Stage Builds: как сжать образ с 3 ГБ до 300 МБ
При сборке C-расширений требуются компиляторы (\`gcc\`, \`g++\`, \`python3-dev\`), которые не нужны в рантайме.
* **Stage 1 (Builder):** устанавливаем компиляторы, собираем wheels.
* **Stage 2 (Final):** копируем только готовые скомпилированные пакеты в чистый образ \`slim\`. Никаких исходников и компиляторов в продакшене!`,
      en: `### The "Works on My Machine" ML Fallacy

Machine learning runtimes depend upon low-level binary stacks:
* CUDA runtime, cuDNN kernels, and NVIDIA GPU driver compatibility.
* C++ OpenMP runtime libraries (\`libgomp\`) required by LightGBM/XGBoost.
* Python wheel ABI compatibility.

**Docker containerization** encapsulates the entire operating system userland, Python interpreter, system shared libraries, and dependencies into an immutable image.

---

#### 1. Base Image Selection
* **CPU Inference:** \`python:3.11-slim\` (~150MB footprint).
* **GPU Inference:** \`nvidia/cuda:12.2.0-runtime-ubuntu22.04\` paired with NVIDIA Container Toolkit for \`--gpus all\` hardware acceleration.

---

#### 2. Optimized Layer Caching
Docker builds top-down; dependencies must be copied before mutable source code:
\`\`\`dockerfile
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \\
    libgomp1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
USER 1000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

---

#### 3. Multi-Stage Builds
Separates heavy compile-time build dependencies (GCC, development headers) from final lean production runtime images.`,
    },
    commonMistakes: [
      {
        ru: 'Копировать исходный код `COPY . .` до установки зависимостей: при любом изменении файла кода кэш `pip install` сбрасывается и все пакеты скачиваются заново.',
        en: 'Placing `COPY . .` before `pip install`: invalidating the dependency cache on every single code change.',
      },
      {
        ru: 'Запуск Docker-контейнера от пользователя root: нарушает безопасность промышленного кластера Kubernetes.',
        en: 'Running production containers as default root user, violating enterprise container security standards.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'mlops-cp-docker-1',
        question: {
          ru: 'Почему в Dockerfile команду `COPY requirements.txt .` и `pip install` располагают перед `COPY src/ .`?',
          en: 'Why is `COPY requirements.txt` and `pip install` placed prior to `COPY src/` in a Dockerfile?',
        },
        options: [
          {
            ru: 'Чтобы задействовать кэш слоев Docker: при изменении кода зависимости не будут скачиваться заново',
            en: 'To leverage Docker layer caching: code edits will not trigger redundant package downloads',
          },
          {
            ru: 'Потому что pip не умеет работать после копирования Python-файлов',
            en: 'Because pip fails if source files are present in the directory',
          },
          {
            ru: 'Это снижает потребление оперативной памяти видеокарты',
            en: 'It reduces GPU VRAM consumption',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Слои Docker пересобираются только начиная с первого изменившегося слоя. Если requirements.txt не менялся, шаг pip install берется из кэша мгновенно.',
          en: 'Docker invalidates cache from the first mutated layer downwards; caching heavy pip installs saves massive build time.',
        },
      },
    ],
  },
  {
    id: 'mlops-3-fastapi-serving',
    moduleId: 'mlops-production',
    title: {
      ru: 'Деплой моделей через FastAPI: REST API, Pydantic, асинхронность и батчинг',
      en: 'Model Serving with FastAPI: REST APIs, Pydantic, Async & Dynamic Batching',
    },
    order: 3,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Архитектура микросервиса предсказаний

В продакшене бизнес-сервисы (бэкенд интернет-магазина, мобильное приложение) обращаются к ML-модели по протоколам **HTTP/REST** или **gRPC**.
Де-факто стандартом в Python стал **FastAPI** благодаря высокой скорости на базе ASGI-сервера **Uvicorn** и автоматической валидации типов через **Pydantic**.

---

#### 1. Строгая валидация запросов через Pydantic
Модели машинного обучения падают с неинформативными ошибками, если на вход передать пропуск или отрицательное значение. Pydantic перехватывает ошибки на уровне HTTP:
\`\`\`python
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    user_age: int = Field(..., ge=18, le=120, description="Возраст пользователя")
    monthly_income: float = Field(..., gt=0, description="Ежемесячный доход")
    credit_score: float = Field(..., ge=300, le=850)
    city_tier: int = Field(default=1, ge=1, le=3)

class PredictionResponse(BaseModel):
    probability: float
    is_default: bool
    model_version: str
\`\`\`

---

#### 2. Загрузка модели через Lifespan Events (Контекстный менеджер)
**Грубейшая ошибка:** загружать модель внутри функции ручки \`@app.post("/predict")\` на каждый HTTP-запрос. Это приводит к задержкам в секунды и утечке памяти!
Модель обязана загружаться в память/VRAM **ровно один раз** при старте процесса:
\`\`\`python
from contextlib import asynccontextmanager
from fastapi import FastAPI
import joblib

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Код до yield выполняется при запуске сервиса
    ml_models["classifier"] = joblib.load("models/model_v1.joblib")
    yield
    # Очистка ресурсов при выключении
    ml_models.clear()

app = FastAPI(lifespan=lifespan)
\`\`\`

---

#### 3. Асинхронность и блокирующие вызовы CPU/GPU
FastAPI работает на асинхронном Event Loop. Функция \`model.predict(X)\` — это синхронный тяжелый расчет, блокирующий весь цикл обработки:
* Если объявить эндпоинт как \`async def predict(...)\` и вызвать \`model.predict()\`, сервер перестанет отвечать другим клиентам на время расчета!
* **Решение:** использовать обычный синхронный \`def predict(...)\` (тогда FastAPI автоматически выполнит его в отдельном пуле потоков ThreadPool) либо оборачивать вызов через \`asyncio.to_thread\`.

---

#### 4. Эндпоинты жизнеспособности (Health Checks)
Для оркестраторов Kubernetes / Docker Swarm обязательны два эндпоинта:
1. **/healthz (Liveness Probe):** жив ли процесс (HTTP 200). Если завис — перезапуск контейнера.
2. **/readyz (Readiness Probe):** загружена ли модель в память и готов ли сервис принимать боевой трафик.`,
      en: `### Production ML Prediction Microservice

Production applications invoke ML models via **HTTP/REST** or **gRPC** interfaces. **FastAPI** with **Uvicorn** and **Pydantic** is the premier Python inference stack.

---

#### 1. Input Contract Validation with Pydantic
Pydantic guarantees schema adherence and range boundaries before tensors touch model code:
\`\`\`python
from pydantic import BaseModel, Field

class ScoringRequest(BaseModel):
    age: int = Field(..., ge=18, le=120)
    income: float = Field(..., gt=0)
\`\`\`

---

#### 2. Model Lifecycle Management (Lifespan Context)
Loading model weights per-request introduces catastrophic latency. Weights must initialize **strictly once at application startup**:
\`\`\`python
from contextlib import asynccontextmanager
from fastapi import FastAPI

models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    models["clf"] = load_model("weights.pt")
    yield
    models.clear()

app = FastAPI(lifespan=lifespan)
\`\`\`

---

#### 3. Concurrency and Blocking Invocations
\`model.predict()\` is CPU/GPU-bound computation that blocks the ASGI event loop. Declare endpoints as standard \`def\` (FastAPI delegates to a background thread pool) or use \`asyncio.to_thread\`.`,
    },
    commonMistakes: [
      {
        ru: 'Загружать модель с диска внутри тела эндпоинта `/predict`: это увеличивает время ответа в сотни раз и приводит к Out of Memory.',
        en: 'Loading model weights from disk inside the `/predict` route handler, causing massive latency and RAM exhaustion.',
      },
      {
        ru: 'Вызов синхронного тяжелого вычисления `model.predict()` внутри `async def` без перевода в поток: блокирует event loop Uvicorn для всех параллельных запросов.',
        en: 'Invoking synchronous CPU-heavy `predict()` inside `async def` routes, blocking the Uvicorn event loop for concurrent users.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'mlops-cp-fastapi-1',
        question: {
          ru: 'Когда должна происходить загрузка весов ML-модели в память сервиса FastAPI?',
          en: 'When should ML model weights be loaded into memory in a FastAPI service?',
        },
        options: [
          {
            ru: 'Один раз при старте приложения через контекстный менеджер lifespan (lifespan event)',
            en: 'Once at application startup using the lifespan context manager',
          },
          {
            ru: 'На каждый входящий HTTP POST запрос клиента',
            en: 'Upon every incoming HTTP POST client request',
          },
          {
            ru: 'После завершения каждого запроса',
            en: 'After each request completes',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Загрузка с диска весов занимает сотни миллисекунд или секунды. Модель держится резидентно в оперативной памяти (или VRAM) на протяжении всего времени жизни процесса.',
          en: 'Model weight deserialization is an expensive I/O operation; weights must remain resident in RAM/VRAM permanently across requests.',
        },
      },
    ],
  },
  {
    id: 'mlops-4-tracking-dvc',
    moduleId: 'mlops-production',
    title: {
      ru: 'Трекинг экспериментов (MLflow, W&B) и версионирование данных (DVC)',
      en: 'Experiment Tracking (MLflow, W&B) & Data Versioning (DVC)',
    },
    order: 4,
    estimatedMinutes: 18,
    draft: false,
    theoryMarkdown: {
      ru: `### Проблема хаоса в исследованиях
В процессе обучения исследователь пробует десятки архитектур, меняет learning rate, отбирает разные признаки.
Без системы трекинга через неделю невозможно вспомнить:
- Какой seed и какие гиперпараметры дали лучшую модель?
- На каком именно срезе датасета модель обучалась?
- Где сохранены итоговые веса?

---

#### 1. MLflow Tracking и Model Registry
**MLflow** — опенсорсный стандарт оркестрации экспериментов:
1. **MLflow Tracking:** сохраняет параметры, динамические метрики по эпохам и артефакты:
\`\`\`python
import mlflow

with mlflow.start_run(run_name="catboost_baseline"):
    # 1. Логируем параметры
    mlflow.log_params({"depth": 6, "learning_rate": 0.05, "iterations": 500})
    
    model.fit(X_train, y_train)
    score = roc_auc_score(y_val, model.predict_proba(X_val)[:, 1])
    
    # 2. Логируем метрики
    mlflow.log_metric("val_roc_auc", score)
    
    # 3. Логируем модель и графики
    mlflow.sklearn.log_model(model, artifact_path="model")
\`\`\`
2. **MLflow Model Registry:** централизованное хранилище моделей со стадиями жизненного цикла:
   $$\\text{None} \\longrightarrow \\text{Staging (тестирование)} \\longrightarrow \\text{Production (боевой инференс)} \\longrightarrow \\text{Archived}$$

---

#### 2. Weights & Biases (W&B)
Облачная платформа трекинга, популярная в обучении нейросетей и LLM:
* Интерактивные графики функции потерь в реальном времени.
* **W&B Sweeps:** автоматизированный байесовский подбор гиперпараметров с визуализацией параллельных координат (Parallel Coordinates Plot).

---

#### 3. DVC (Data Version Control) — Git для больших данных
Git не может эффективно хранить датасеты размером 10 ГБ или 1 ТБ.
**Как работает DVC:**
1. Выполняется команда \`dvc add data/train.parquet\`.
2. DVC вычисляет контрольную сумму md5 файла и создает крошечный указатель \`data/train.parquet.dvc\` (размером 100 байт), содержащий этот хэш.
3. Указатель \`.dvc\` коммитится в обычный **Git**, а сам 10-гигабайтный файл отправляется в удаленное хранилище S3/GCS/MinIO командой:
\`\`\`bash
dvc push
\`\`\`
4. Любой коллега после \`git pull\` запускает:
\`\`\`bash
dvc pull
\`\`\`
и получает точную версию датасета, на которой обучалась данная версия кода!

* **DVC Pipelines (dvc.yaml):** описание графа вычислений (DAG) шагов \`preprocess\` $\\to$ \`train\` $\\to$ \`eval\`. DVC перезапускает только те шаги, чьи входные файлы или параметры изменились.`,
      en: `### Research Chaos vs Reproducibility

Without standardized tracking, empirical research descends into untraceable experiments where winning parameters, random seeds, and training split states are forgotten.

---

#### 1. MLflow Tracking & Registry
MLflow structures the ML lifecycle into:
* **Runs:** parameter sets, metric series per epoch, and serialized artifacts.
* **Model Registry:** lifecycle governance transitioning weights through \`Staging\` to \`Production\`.

\`\`\`python
import mlflow

with mlflow.start_run():
    mlflow.log_params({"max_depth": 6, "lr": 0.05})
    mlflow.log_metric("roc_auc", score)
    mlflow.sklearn.log_model(model, "model")
\`\`\`

---

#### 2. DVC (Data Version Control)
Git cannot handle gigabytes of data. DVC decouples data storage from tracking:
1. Datasets are indexed via content-addressable md5 hashes saved to small \`*.dvc\` pointer files.
2. Lightweight \`*.dvc\` files are versioned in Git.
3. Actual bulky datasets sync to S3/GCS/MinIO via \`dvc push\` / \`dvc pull\`.`,
    },
    commonMistakes: [
      {
        ru: 'Хранить результаты экспериментов и метрики вручную в файлах Excel или блокнотах: через месяц воспроизвести модель становится невозможно.',
        en: 'Relying on manual spreadsheets for tracking parameters and metrics, losing scientific lineage.',
      },
      {
        ru: 'Путать DVC с Git LFS: DVC работает поверх любого S3/GCS/SSH хранилища и поддерживает полноценные графы конвейеров dvc.yaml с кэшированием вычислений.',
        en: 'Confusing DVC with Git LFS: DVC supports generic object stores (S3/GCS) and deterministic DAG pipeline caching.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'mlops-cp-dvc-1',
        question: {
          ru: 'Каким образом DVC позволяет версионировать многогигабайтные датасеты совместно с Git?',
          en: 'How does DVC enable versioning multi-gigabyte datasets alongside Git?',
        },
        options: [
          {
            ru: 'Заменяет датасет легким текстовым файлом-указателем (*.dvc) с md5-хэшем в Git, а реальные данные хранит в S3/GCS хранилище',
            en: 'Replaces raw data with tiny md5 pointer files (*.dvc) in Git while pushing heavy binaries to S3/GCS stores',
          },
          {
            ru: 'Сжимает терабайтные датасеты в zip-архив размером 10 КБ',
            en: 'Compresses terabyte datasets into a 10 KB zip archive',
          },
          {
            ru: 'Преобразует все строки датасета в бинарный код C++',
            en: 'Converts dataset rows into binary C++ executables',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В Git хранится только легковесный текстовый файл с хэшем и метаданными, а скачивание и загрузка тяжелых данных выполняется через dvc pull/push в облачный бакет.',
          en: 'Git versions only the metadata pointer file, while actual heavy binaries sync out-of-band to scalable cloud object storage.',
        },
      },
    ],
  },
  {
    id: 'mlops-5-monitoring-drift',
    moduleId: 'mlops-production',
    title: {
      ru: 'Мониторинг в продакшене: Data Drift, Concept Drift и метрики деградации',
      en: 'Production Monitoring: Data Drift, Concept Drift & Degradation Metrics',
    },
    order: 5,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### «Модели в продакшене со временем деградируют»

После деплоя модель неизбежно сталкивается с изменением внешнего мира:
* Меняется поведение клиентов, макроэкономическая ситуация, сезонность.
* Ломаются или меняют формат источники данных (баги мобильных приложений, изменения API сторонних сервисов).

---

#### 1. Классификация типов сдвига распределений
Пусть $X$ — признаки, $y$ — истинный таргет:
1. **Data Drift (Covariate Shift — сдвиг ковариат):**
   $$P_{\\text{train}}(X) \\ne P_{\\text{prod}}(X), \\quad \\text{но } P(y \\mid X) \\text{ не изменилось}$$
   *Пример:* банк запустил рекламу для молодежи. Средний возраст клиентов упал с 45 до 22 лет. Входное распределение $P(X)$ изменилось, хотя правило одобрения кредита при равном доходе осталось прежним.
2. **Concept Drift (сдвиг концепции):**
   $$P_{\\text{train}}(y \\mid X) \\ne P_{\\text{prod}}(y \\mid X), \\quad \\text{но } P(X) \\text{ может быть прежним}$$
   *Пример:* началась пандемия или инфляция. Профиль трат клиента остался прежним, но вероятность дефолта при том же доходе резко возросла. Прежняя модель ошибается.
3. **Prior Probability Shift (сдвиг априорной вероятности таргета):**
   $$P_{\\text{train}}(y) \\ne P_{\\text{prod}}(y)$$
   *Пример:* доля мошеннических транзакций подскочила с $0.1\\%$ до $2\\%$ во время праздничной распродажи.

---

#### 2. Математические метрики детекции дрейфа

#### 1. PSI (Population Stability Index — Индекс стабильности популяции)
Золотой стандарт в банковском скоринге и финтехе. Непрерывный признак разбивается на $B$ корзин (бинов):
$$PSI = \\sum_{i=1}^B (P_i - Q_i) \\cdot \\ln\\left( \\frac{P_i}{Q_i} \\right)$$
где $P_i$ — доля объектов в $i$-й корзине в референсной (train) выборке, $Q_i$ — доля в боевой (prod) выборке.
*Интерпретация порогов PSI:*
* **$PSI < 0.1$:** дрейф отсутствует, распределение стабильно.
* **$0.1 \\le PSI \\le 0.2$:** умеренный сдвиг (требуется повышенное внимание инженера).
* **$PSI > 0.2$:** **критический сдвиг распределения!** Модель срочно требует переобучения или отката на консервативный бейзлайн.

#### 2. Двухвыборочный тест Колмогорова-Смирнова (KS-Test)
Для непрерывных признаков вычисляет максимальное вертикальное расстояние между эмпирическими функциями распределения:
$$D = \\sup_x |F_{\\text{train}}(x) - F_{\\text{prod}}(x)|$$
Если $p\\text{-value} < 0.05$, нулевая гипотеза об одинаковости распределений отвергается.

#### 3. Тест Хи-квадрат ($\\chi^2$)
Применяется для категориальных признаков для проверки совпадения частот категорий.

---

#### 3. Архитектура мониторинга: Evidently AI и Prometheus
1. Инференс-сервис логирует входящие признаки $X$ и предсказания $\\hat{y}$ в хранилище (PostgreSQL, ClickHouse, Kafka).
2. Фоновый воркер (cron-job / Airflow) с библиотекой **Evidently AI** сравнивает входящий поток за последние сутки с эталонным датасетом обучения.
3. При превышении порога $PSI > 0.2$ отправляется алерт в Slack/PagerDuty и автоматически инициируется пайплайн переобучения (**Continuous Training, CT**).`,
      en: `### Production Model Degradation

Models degrade over time as external world conditions evolve.

---

#### 1. Taxonomy of Distribution Shifts
1. **Data Drift (Covariate Shift):**
   $$P_{\\text{train}}(X) \\ne P_{\\text{prod}}(X), \\quad \\text{with static } P(y \\mid X)$$
2. **Concept Drift:**
   $$P_{\\text{train}}(y \\mid X) \\ne P_{\\text{prod}}(y \\mid X)$$
   The mapping from features to labels mutates (macroeconomic changes, fraudster adaptation).
3. **Prior Probability Shift:**
   $$P_{\\text{train}}(y) \\ne P_{\\text{prod}}(y)$$

---

#### 2. Statistical Drift Metrics

#### Population Stability Index (PSI):
Bins the continuous feature distribution across $B$ quantiles:
$$PSI = \\sum_{i=1}^B (P_i - Q_i) \\ln\\left( \\frac{P_i}{Q_i} \\right)$$
* **$PSI < 0.1$:** No significant change.
* **$0.1 \\le PSI \\le 0.2$:** Moderate drift.
* **$PSI > 0.2$:** Severe shift; triggers retraining alerts.

#### Two-Sample Kolmogorov-Smirnov Test (KS-Test):
Computes supremum distance across empirical CDF curves: $D = \\sup_x |F_1(x) - F_2(x)|$.

---

#### 3. Production Monitoring Architecture
Production requests stream to log sinks. Frameworks like **Evidently AI** evaluate batched statistics against training reference baselines, exporting metrics to **Prometheus & Grafana**.`,
    },
    commonMistakes: [
      {
        ru: 'Мониторить только технические метрики сервиса (CPU, RAM, latency 200 OK): сервис может отдавать ответы за 5мс, но из-за сдвига данных выдавать абсолютно бесполезный для бизнеса мусор.',
        en: 'Relying exclusively on infrastructure health (CPU, RAM, HTTP 200 latency) while remaining blind to silent data and concept drift.',
      },
      {
        ru: 'Использовать тест Колмогорова-Смирнова на выборках в миллионы строк без квантильного прореживания: при гигантских N даже микроскопический шум приведет к p-value < 0.05.',
        en: 'Running raw KS tests over millions of observations without subsampling, triggering false-positive drift alarms due to extreme statistical power.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'mlops-cp-drift-1',
        question: {
          ru: 'В чем разница между Data Drift (ковариатным сдвигом) и Concept Drift?',
          en: 'What distinguishes Data Drift (Covariate Shift) from Concept Drift?',
        },
        options: [
          {
            ru: 'При Data Drift меняется распределение признаков P(X), а при Concept Drift меняется сама истинная зависимость P(y|X)',
            en: 'Data Drift mutates feature distribution P(X), whereas Concept Drift mutates the underlying conditional mapping P(y|X)',
          },
          {
            ru: 'Data Drift бывает только у нейросетей, а Concept Drift — только у линейных моделей',
            en: 'Data Drift affects only neural networks, while Concept Drift affects linear models',
          },
          {
            ru: 'Никакой разницы нет, это полные синонимы',
            en: 'There is no distinction; they are identical concepts',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Data Drift означает, что на вход стали приходить другие данные P(X). Concept Drift означает, что изменилась сама природа целевого явления P(y|X).',
          en: 'Data Drift captures shifts in the input domain P(X); Concept Drift indicates that identical inputs now correspond to different targets P(y|X).',
        },
      },
      {
        id: 'mlops-cp-drift-2',
        question: {
          ru: 'Какое пороговое значение метрики PSI (Population Stability Index) обычно свидетельствует о критическом сдвиге распределения?',
          en: 'What PSI (Population Stability Index) threshold typically indicates a severe distribution shift?',
        },
        options: [
          {
            ru: 'PSI > 0.2',
            en: 'PSI > 0.2',
          },
          {
            ru: 'PSI = 0',
            en: 'PSI = 0',
          },
          {
            ru: 'PSI > 100',
            en: 'PSI > 100',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В промышленном риск-менеджменте PSI < 0.1 считается нормой, 0.1-0.2 — умеренным сдвигом, а PSI > 0.2 требует переобучения модели.',
          en: 'Standards specify PSI < 0.1 as stable, 0.1–0.2 as moderate shift, and PSI > 0.2 as significant drift requiring model remediation.',
        },
      },
    ],
  },
];

export const mlopsProductionCards: Card[] = [
  {
    id: 'mlops-card-1',
    moduleId: 'mlops-production',
    lessonId: 'mlops-1-git-versioning',
    type: 'flip',
    front: {
      ru: 'Почему файлы весов моделей (*.pt, *.onnx) и датасеты нельзя коммитить напрямую в Git?',
      en: 'Why must trained model weights (*.pt, *.onnx) not be committed directly into Git?',
    },
    back: {
      ru: 'Git не умеет сохранять разностные diff для бинарных файлов и сохраняет весь файл целиком при каждом обновлении, раздувая .git до десятков гигабайт. Для моделей используют Model Registry (MLflow), для данных — DVC.',
      en: 'Git cannot compute textual deltas for binary blobs, storing full copies that bloat repo history into tens of gigabytes. Use Model Registries and DVC instead.',
    },
    tags: ['git', 'mlops', 'reproducibility'],
  },
  {
    id: 'mlops-card-2',
    moduleId: 'mlops-production',
    lessonId: 'mlops-2-docker-containerization',
    type: 'cloze',
    clozeText: {
      ru: 'В Dockerfile для кэширования слоев копирование {{c1::requirements.txt}} и команду {{c2::pip install}} выполняют ДО копирования исходного кода `COPY src/`.',
      en: 'In a Dockerfile, copying {{c1::requirements.txt}} and running {{c2::pip install}} is placed BEFORE copying mutable source code.',
    },
    answer: {
      ru: 'requirements.txt',
      en: 'requirements.txt',
    },
    tags: ['docker', 'caching'],
  },
  {
    id: 'mlops-card-3',
    moduleId: 'mlops-production',
    lessonId: 'mlops-3-fastapi-serving',
    type: 'flip',
    front: {
      ru: 'Зачем в FastAPI загружать модель через контекстный менеджер lifespan, а не внутри эндпоинта /predict?',
      en: 'Why load ML models via FastAPI lifespan context rather than inside the /predict route handler?',
    },
    back: {
      ru: 'Чтобы загрузить веса с диска в память ровно один раз при старте процесса. Загрузка модели внутри эндпоинта добавляет сотни миллисекунд к каждому запросу и приводит к утечкам памяти.',
      en: 'To initialize weights into RAM once at startup. Per-request loading introduces massive disk I/O latency and memory churn.',
    },
    tags: ['fastapi', 'serving'],
  },
  {
    id: 'mlops-card-4',
    moduleId: 'mlops-production',
    lessonId: 'mlops-4-tracking-dvc',
    type: 'cloze',
    clozeText: {
      ru: 'Инструмент {{c1::DVC (Data Version Control)}} хранит в Git легкие текстовые файлы с md5-хэшами (*.dvc), а реальные большие датасеты синхронизирует с S3/GCS через команды `dvc push` и `dvc pull`.',
      en: 'The {{c1::DVC}} tool versions tiny md5 pointer files (*.dvc) in Git while syncing heavy datasets to S3/GCS via `dvc push` and `dvc pull`.',
    },
    answer: {
      ru: 'DVC (Data Version Control)',
      en: 'DVC (Data Version Control)',
    },
    tags: ['dvc', 'versioning'],
  },
  {
    id: 'mlops-card-5',
    moduleId: 'mlops-production',
    lessonId: 'mlops-5-monitoring-drift',
    type: 'flip',
    front: {
      ru: 'Что выражает метрика PSI (Population Stability Index) и при каком значении фиксируется критический дрейф?',
      en: 'What does the PSI metric measure and what threshold indicates severe drift?',
    },
    back: {
      ru: 'PSI измеряет сдвиг распределения признака между обучающей и боевой выборкой: PSI = Σ (P_i - Q_i) ln(P_i / Q_i). Значение PSI > 0.2 сигнализирует о критическом дрейфе данных.',
      en: 'PSI quantifies distribution divergence between reference and target populations. A threshold of PSI > 0.2 indicates significant drift requiring retraining.',
    },
    tags: ['monitoring', 'psi', 'drift'],
  },
  {
    id: 'mlops-card-6',
    moduleId: 'mlops-production',
    lessonId: 'mlops-5-monitoring-drift',
    type: 'cloze',
    clozeText: {
      ru: 'Сдвиг, при котором меняется распределение входных признаков P(X), но не меняется истинная зависимость P(y|X), называется {{c1::Data Drift (ковариатный сдвиг)}}.',
      en: 'A distribution shift where feature distributions P(X) alter while conditional mapping P(y|X) stays unchanged is called {{c1::Data Drift (Covariate Shift)}}.',
    },
    answer: {
      ru: 'Data Drift (ковариатный сдвиг)',
      en: 'Data Drift (Covariate Shift)',
    },
    tags: ['data-drift', 'monitoring'],
  },
];

export const mlopsProductionQuiz: QuizQuestion[] = [
  {
    id: 'mlops-q-1',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Какую главную задачу решает библиотека MLflow в жизненном цикле машинного обучения?',
      en: 'What primary problem is addressed by MLflow in the machine learning lifecycle?',
    },
    options: [
      {
        ru: 'Логирование параметров, метрик и артефактов экспериментов, а также ведение реестра моделей (Model Registry)',
        en: 'Tracking experiment parameters, metrics, artifacts, and managing a central Model Registry',
      },
      {
        ru: 'Автоматическое написание веб-интерфейса на React',
        en: 'Automated generation of React user interfaces',
      },
      {
        ru: 'Квантование моделей до 1-битного формата',
        en: 'Quantizing neural network weights to 1-bit',
      },
      {
        ru: 'Замена Docker-контейнеров на виртуальные машины',
        en: 'Replacing Docker containers with hypervisors',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'MLflow позволяет отслеживать все запуски обучения (Tracking), сравнивать гиперпараметры и переводить проверенные модели в Production (Model Registry).',
      en: 'MLflow manages end-to-end experiment lineage, metric tracking, and production stage governance.',
    },
    tag: 'mlflow',
  },
  {
    id: 'mlops-q-2',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какой класс Pydantic используется для валидации входных данных в REST API на FastAPI?',
      en: 'Which Pydantic class is inherited to validate incoming HTTP payloads in FastAPI?',
    },
    options: [
      { ru: 'BaseModel', en: 'BaseModel' },
      { ru: 'DataClass', en: 'DataClass' },
      { ru: 'SchemaValidator', en: 'SchemaValidator' },
      { ru: 'ModelContainer', en: 'ModelContainer' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'В FastAPI схемы запросов и ответов наследуются от `pydantic.BaseModel`, гарантируя строгую валидацию типов и диапазонов значений.',
      en: 'FastAPI schemas inherit from `pydantic.BaseModel` to provide runtime schema parsing and constraint enforcement.',
    },
    tag: 'fastapi',
  },
  {
    id: 'mlops-q-3',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Что происходит при Concept Drift (сдвиге концепции) в работающей модели?',
      en: 'What characterizes Concept Drift in a production machine learning deployment?',
    },
    options: [
      {
        ru: 'Изменяется истинная статистическая взаимосвязь между признаками и целевой переменной P(y|X)',
        en: 'The ground-truth conditional relationship between features and target P(y|X) changes',
      },
      {
        ru: 'В базе данных повреждается жесткий диск',
        en: 'A physical storage drive failure occurs in the database',
      },
      {
        ru: 'Модель случайно теряет файл с весами',
        en: 'The service accidentally deletes weight binaries',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'При Concept Drift входные признаки могут оставаться теми же, но меняется поведение мира P(y|X) (например, изменение потребительского поведения при инфляции).',
      en: 'Concept drift alters the underlying conditional dependency P(y|X), rendering historical training assumptions invalid.',
    },
    tag: 'concept-drift',
  },
  {
    id: 'mlops-q-4',
    type: 'formula',
    difficulty: 'hard',
    question: {
      ru: 'В формуле индекса стабильности популяции $PSI = \\sum (P_i - Q_i) \\cdot f(P_i, Q_i)$ в качестве функции $f$ выступает:',
      en: 'In the Population Stability Index formula $PSI = \\sum (P_i - Q_i) \\cdot f(P_i, Q_i)$, the function $f$ is:',
    },
    formulaAnswer: 'ln(P_i / Q_i)',
    explanation: {
      ru: 'Формула PSI: $\\sum (P_i - Q_i) \\ln(P_i / Q_i)$, где логарифм отношения взвешивает разницу между фактической и базовой долями.',
      en: 'The PSI calculation is $\\sum (P_i - Q_i) \\ln(P_i / Q_i)$.',
    },
    tag: 'psi-formula',
  },
  {
    id: 'mlops-q-5',
    type: 'code_fill',
    difficulty: 'medium',
    question: {
      ru: 'Вставьте команду DVC для отправки версионированных данных в удаленный S3-бакет:',
      en: 'Insert the DVC command used to upload versioned dataset files to a remote S3 bucket:',
    },
    codeSnippet: `# Фиксация изменений данных в Git и отправка в удаленный сторадж
git add data.csv.dvc
git commit -m "Update training dataset"
dvc ____`,
    options: ['push', 'upload', 'commit', 'sync'],
    correctAnswer: 0,
    explanation: {
      ru: 'Команда `dvc push` синхронизирует локальный кэш данных с удаленным хранилищем (S3, GCS, SSH), аналогично `git push`.',
      en: '`dvc push` syncs tracked binaries from the local cache to the configured remote storage bucket.',
    },
    tag: 'dvc-commands',
    language: 'bash',
  },
];
