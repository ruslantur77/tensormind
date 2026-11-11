import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const dataWranglingEdaMeta: ModuleMeta = {
  id: 'data-wrangling-eda',
  title: {
    ru: 'Работа с данными и аналитика: SQL, EDA, Feature Engineering, Power BI и Excel',
    en: 'Data Wrangling & Analytics: SQL, EDA, Feature Engineering, Power BI & Excel',
  },
  description: {
    ru: 'Полный аналитический цикл от хранилищ до бизнес-решений: продвинутый SQL (оконные функции, CTE, сложные JOIN), разведочный анализ (EDA), инженерия признаков (Target Encoding, KNNImputer, SMOTE), высокопроизводительный Pandas и Polars, а также бизнес-аналитика в Power BI (Star Schema, DAX) и экспресс-анализ в Excel.',
    en: 'Full data & analytics stack: advanced SQL (window functions, CTEs, complex JOINs), exploratory data analysis (EDA), feature engineering (Target Encoding, KNNImputer, SMOTE), high-performance Pandas & Polars, plus business analytics in Power BI (Star Schema, DAX) and Excel validation.',
  },
  order: 2,
  icon: 'data-wrangling-eda',
  estimatedMinutes: 110,
  isPlaceholder: false,
};

export const dataWranglingEdaLessons: Lesson[] = [
  {
    id: 'eda-1-foundations',
    moduleId: 'data-wrangling-eda',
    title: {
      ru: 'Разведочный анализ данных (EDA): статистика, распределения и выбросы',
      en: 'Exploratory Data Analysis (EDA): Statistics, Distributions & Outliers',
    },
    order: 1,
    estimatedMinutes: 12,
    draft: false,
    theoryMarkdown: {
      ru: `### Основы Exploratory Data Analysis (EDA)

Разведочный анализ данных (EDA) — обязательный первый этап любого ML-проекта. Обучение модели на «сырых» неотфильтрованных данных приводит к правилу **«Garbage in, garbage out»** (мусор на входе — мусор на выходе).

#### 1. Первичный аудит датасета
\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv("dataset.csv")

# 1. Размерность выборки: (строки, столбцы)
print(df.shape)

# 2. Типы данных и пропущенные значения
print(df.info())

# 3. Базовые статистические показатели
print(df.describe(include="all"))
\`\`\`

#### 2. Типы признаков в машинном обучении
* **Числовые (Numerical):** непрерывные (температура, цена) и дискретные (число комнат, возраст).
* **Категориальные (Categorical):** номинальные (город, пол — нет порядка) и порядковые / ординальные (размер одежды S/M/L, оценка рейтинга).
* **Временные (Datetime):** даты и таймстемпы, требующие выделения циклических признаков (час, день недели, сезонность).

#### 3. Обнаружение выбросов (Outliers)
Выбросы могут искажать градиентный спуск в линейных моделях и нейросетях.

* **Метод межквартильного размаха (IQR):**
$$IQR = Q_3 - Q_1$$
Объект считается выбросом, если $x < Q_1 - 1.5 \\cdot IQR$ или $x > Q_3 + 1.5 \\cdot IQR$.
* **Z-оценка (Z-score):**
$$z = \\frac{x - \\mu}{\\sigma}$$
Если $|z| > 3$, объект находится дальше $3\\sigma$ от среднего и классифицируется как выброс для распределений, близких к нормальным.

#### 4. Корреляция и мультиколлинеарность
* **Коэффициент корреляции Пирсона ($r$):** измеряет силу линейной связи от $-1$ до $+1$.
* Мультиколлинеарность ($|r| > 0.85$ между признаками) делает матрицу $X^T X$ плохо обусловленной в линейных моделях, приводя к огромным нестабильным весам. Решение: удаление дублирующего признака или L2-регуляризация (Ridge).`,
      en: `### Exploratory Data Analysis (EDA) Foundations

Exploratory Data Analysis (EDA) is the foundational first step of any production machine learning workflow, preventing the classical **"Garbage In, Garbage Out"** trap.

#### 1. Initial Dataset Inspection
\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv("dataset.csv")

# 1. Dimensions: (rows, columns)
print(df.shape)

# 2. Schema, data types, and non-null counts
print(df.info())

# 3. Descriptive summary statistics
print(df.describe(include="all"))
\`\`\`

#### 2. Feature Types
* **Numerical:** Continuous (temperature, stock price) and Discrete (count of rooms, age).
* **Categorical:** Nominal (cities, brands — no intrinsic order) and Ordinal (education level, clothing sizes S/M/L/XL).
* **Datetime:** Timestamps requiring seasonal, cyclical or lagged decomposition.

#### 3. Outlier Detection
Outliers severely distort squared-loss estimators ($L_2$ error, linear regression, neural nets).

* **Interquartile Range (IQR) rule:**
$$IQR = Q_3 - Q_1$$
An observation is an outlier if $x < Q_1 - 1.5 \\cdot IQR$ or $x > Q_3 + 1.5 \\cdot IQR$.
* **Z-score metric:**
$$z = \\frac{x - \\mu}{\\sigma}$$
Observations with $|z| > 3$ deviate beyond $3\\sigma$ standard deviations from the sample mean.

#### 4. Correlation and Multicollinearity
* **Pearson correlation coefficient ($r$):** linear dependency metric in $[-1, +1]$.
* Extreme feature collinearity ($|r| > 0.85$) destabilizes the normal equation $(X^T X)^{-1}$, causing weight variance explosion. Mitigated via feature pruning, PCA, or Ridge L2 regularization.`,
    },
    commonMistakes: [
      {
        ru: 'Удалять выбросы бездумно: в задачах антифрода (fraud detection) или сбоев серверов именно выбросы являются целевым классом.',
        en: 'Bluntly deleting outliers: in fraud detection and anomaly monitoring, outliers constitute the primary signal of interest.',
      },
      {
        ru: 'Использовать корреляцию Пирсона для нелинейных зависимостей: Пирсон равен 0 для $y = x^2$ на симметричном интервале $[-1, 1]$.',
        en: 'Relying exclusively on Pearson for non-linear dynamics: Pearson correlation is exactly 0 for $y = x^2$ over symmetric intervals $[-1, 1]$.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'eda-cp-1',
        question: {
          ru: 'По правилу Тьюки (IQR), при каких границах значение признака признается выбросом?',
          en: 'According to Tukey IQR criterion, when is an observation classified as an outlier?',
        },
        options: [
          {
            ru: 'Меньше Q1 - 1.5*IQR или больше Q3 + 1.5*IQR',
            en: 'Below Q1 - 1.5*IQR or above Q3 + 1.5*IQR',
          },
          {
            ru: 'Строго больше 2*IQR',
            en: 'Strictly greater than 2*IQR',
          },
          {
            ru: 'Отрицательные значения любых признаков',
            en: 'Any negative feature values',
          },
          {
            ru: 'Значения, превышающие медиану ровно на 10%',
            en: 'Values exceeding the median by exactly 10%',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Межквартильный размах $IQR = Q_3 - Q_1$. Границы «усов» boxplot строятся на удалении $1.5 \\cdot IQR$ от квартилей.',
          en: 'Interquartile range is $IQR = Q_3 - Q_1$. Whiskers extend $1.5 \\times IQR$ beyond the first and third quartiles.',
        },
      },
      {
        id: 'eda-cp-1-b',
        question: {
          ru: 'Какая мера центральной тенденции является робастной (устойчивой) к асимметричным хвостам и экстремальным выбросам?',
          en: 'Which measure of central tendency is robust against extreme outliers and heavily skewed distributions?',
        },
        options: [
          { ru: 'Медиана (50-й перцентиль)', en: 'Median (50th percentile)' },
          { ru: 'Среднее арифметическое', en: 'Arithmetic Mean' },
          { ru: 'Дисперсия выборки', en: 'Sample Variance' },
          { ru: 'Стандартная ошибка среднего', en: 'Standard Error of the Mean' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Среднее арифметическое смещается в сторону даже одного экстремального выброса (например, миллиардера в выборке зарплат), в то время как медиана отражает значение ровно центрального наблюдения.',
          en: 'Arithmetic mean is sensitive to extreme values, shifting toward tails. The median isolates the 50th percentile rank without being skewed.',
        },
      },
      {
        id: 'eda-cp-1-c',
        question: {
          ru: 'Какой график позволяет одновременно оценить медиану, квартили Q1/Q3 и визуализировать аномальные выбросы?',
          en: 'Which visualization concisely portrays the median, Q1/Q3 interquartile frame, and outlier points simultaneously?',
        },
        options: [
          { ru: 'Boxplot (Ящик с усами)', en: 'Boxplot (Box-and-whisker plot)' },
          { ru: 'Линейный график (Line chart)', en: 'Line chart' },
          { ru: 'Круговая диаграмма (Pie chart)', en: 'Pie chart' },
          { ru: 'Матрица корреляций тепловой карты', en: 'Heatmap correlation matrix' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Диаграмма размаха (Boxplot) компактно отображает Q1, медиану, Q3, границы $1.5 \\cdot IQR$ и выносит отдельные точки выбросов за пределы «усов».',
          en: 'Boxplots display the median, IQR interquartile frame, 1.5*IQR whiskers, and discrete outlier observations exceeding whisker fences.',
        },
      },
    ],
  },
  {
    id: 'eda-2-preprocessing',
    moduleId: 'data-wrangling-eda',
    title: {
      ru: 'Предобработка: пропуски, кодирование категорий и масштабирование',
      en: 'Data Preprocessing: Imputation, Encoding & Feature Scaling',
    },
    order: 2,
    estimatedMinutes: 13,
    draft: false,
    theoryMarkdown: {
      ru: `### Предобработка признаков (Feature Preprocessing)

Большинство математических моделей (линейные модели, SVM, нейросети) не способны работать со строковыми значениями и пропусками, а также чувствительны к масштабу величин.

#### 1. Обработка пропущенных значений (Imputation)
* **Простое удаление (\`dropna\`):** допустимо только если доля пропусков ничтожно мала (< 2-3%).
* **Заполнение статистиками:**
  - Числовые признаки: медиана (устойчива к выбросам) или среднее.
  - Категориальные признаки: мода (наиболее частое значение) или отдельная категория \`"Unknown"\`.
* **Флаг пропуска (Missing Indicator):** создание бинарного признака \`is_na\`, так как сам факт отсутствия данных часто несет ценный сигнал.

#### 2. Кодирование категориальных признаков (Categorical Encoding)
* **One-Hot Encoding (\`OneHotEncoder\`, \`pd.get_dummies\`):**
  Создает $K$ бинарных столбцов для $K$ категорий. Идеален для номинальных категорий с низкой мощностью (low cardinality, < 15 значений).
  *Внимание:* для линейных моделей без регуляризации нужно удалять первый столбец (\`drop='first'\`), чтобы избежать ловушки фиктивных переменных (dummy variable trap).
* **Ordinal / Label Encoding:**
  Присваивает целые числа $0, 1, 2, \\dots$. Применяется, когда между категориями есть естественный порядок (например: «Junior», «Middle», «Senior»).

#### 3. Масштабирование признаков (Feature Scaling)
\`\`\`python
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

# 1. Z-стандартизация: среднее 0, дисперсия 1
scaler_std = StandardScaler()
X_std = scaler_std.fit_transform(X_train)

# 2. Min-Max нормализация в диапазон [0, 1]
scaler_minmax = MinMaxScaler()
X_norm = scaler_minmax.fit_transform(X_train)

# 3. RobustScaler (устойчив к выбросам через медиану и IQR)
scaler_robust = RobustScaler()
X_rob = scaler_robust.fit_transform(X_train)
\`\`\`

*Важнейшее правило защиты от Data Leakage (утечки данных):*
Метод \`.fit()\` вызывается **строго на обучающей выборке** (\`X_train\`), а тестовая выборка только трансформируется через \`.transform(X_test)\`!`,
      en: `### Feature Preprocessing Pipelines

Mathematical estimators (linear models, SVMs, neural networks, k-NN) require numerical inputs and are sensitive to feature scales.

#### 1. Missing Value Imputation
* **Row Deletion (\`dropna\`):** viable only when missingness is negligible (< 2-3%).
* **Statistical Imputation:**
  - Numerical features: median (robust to skew/outliers) or mean.
  - Categorical features: mode (most frequent) or dedicated \`"Unknown"\` token.
* **Missing Indicator:** augmenting features with a binary flag indicating whether the original value was missing, which often encodes predictive signal.

#### 2. Categorical Encoding
* **One-Hot Encoding (\`OneHotEncoder\`, \`pd.get_dummies\`):**
  Maps $K$ distinct values to $K$ binary indicator columns. Best suited for low-cardinality nominal features.
  *Note:* in unregularized linear regression, drop one column (\`drop='first'\`) to avoid the dummy variable trap (perfect multicollinearity).
* **Ordinal Encoding:**
  Assigns integers $0, 1, 2, \\dots$ when an intrinsic order exists (e.g. Bronze < Silver < Gold).

#### 3. Feature Scaling
\`\`\`python
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

# 1. Standard Z-score scaling: mean=0, std=1
scaler_std = StandardScaler()
X_std = scaler_std.fit_transform(X_train)

# 2. MinMax scaling bounded to [0, 1]
scaler_minmax = MinMaxScaler()
X_norm = scaler_minmax.fit_transform(X_train)

# 3. RobustScaler using median and IQR
scaler_robust = RobustScaler()
X_rob = scaler_robust.fit_transform(X_train)
\`\`\`

*Data Leakage Prevention:*
Fit the transformer **strictly on the training split** (\`scaler.fit(X_train)\`), then call \`.transform(X_test)\` on holdout splits!`,
    },
    commonMistakes: [
      {
        ru: 'Вызывать `scaler.fit_transform(X)` до разбиения выборки на train и test: это приводит к утечке информации о распределении теста.',
        en: 'Invoking `scaler.fit_transform(X)` before train/test splitting: this leaks global test set statistics into training.',
      },
      {
        ru: 'Применять One-Hot Encoding к признаку с тысячами уникальных значений (например, User ID), раздувая разреженную матрицу до гигабайт.',
        en: 'Applying One-Hot Encoding to high-cardinality columns (e.g., User ID), causing memory explosion with millions of sparse columns.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'eda-cp-2',
        question: {
          ru: 'Почему нельзя вызывать `scaler.fit()` на всем датасете до разделения на train и test?',
          en: 'Why is calling `scaler.fit()` on the entire dataset prior to splitting forbidden?',
        },
        options: [
          {
            ru: 'Это вызывает Data Leakage (утечку данных): среднее и дисперсия теста попадут в обучение',
            en: 'It causes Data Leakage: test distribution mean and variance contaminate the training process',
          },
          {
            ru: 'Scikit-learn выдаст синтаксическую ошибку',
            en: 'Scikit-learn raises a syntax error',
          },
          {
            ru: 'Все признаки автоматически станут равны нулю',
            en: 'All features will automatically zero out',
          },
          {
            ru: 'Это замедлит работу видеокарты',
            en: 'It degrades GPU performance',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Параметры масштабирования (среднее $\\mu$ и отклонение $\\sigma$) должны вычисляться только на тренировочных данных, симулируя работу модели в реальном продакшене.',
          en: 'Scaling statistics must derive purely from training samples to simulate realistic unseen production data.',
        },
      },
      {
        id: 'eda-cp-2-b',
        question: {
          ru: 'К какой математической проблеме приводит One-Hot кодирование в линейных моделях без регуляризации, если не удалить один из столбцов (`drop="first"`)?',
          en: 'What mathematical issue arises in unregularized linear regression if One-Hot encoding is performed without `drop="first"`?',
        },
        options: [
          { ru: 'Ловушка фиктивных переменных (Dummy Variable Trap) и строгая мультиколлинеарность матрицы X', en: 'Dummy Variable Trap and perfect multicollinearity in the design matrix X' },
          { ru: 'Отрицательные градиенты при оптимизации', en: 'Negative optimization gradients' },
          { ru: 'Автоматическое зануление весов регуляризации Lasso', en: 'Automatic zeroing of Lasso weights' },
          { ru: 'Утечка целевой переменной (Target Leakage)', en: 'Target Leakage' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Сумма всех One-Hot колонок категории тождественно равна единичному вектору константы (intercept), что делает матрицу $X^T X$ необратимой (ранг матрицы неполный).',
          en: 'The sum of all dummy indicator columns equals the constant intercept column, producing singular non-invertible covariance matrices.',
        },
      },
      {
        id: 'eda-cp-2-c',
        question: {
          ru: 'Какой класс масштабирования признаков в Scikit-learn устойчив к аномальным выбросам?',
          en: 'Which Scikit-learn feature scaler is robust against severe outlier values?',
        },
        options: [
          { ru: 'RobustScaler (использует медиану и IQR: z = (x - median) / IQR)', en: 'RobustScaler (scales via median and IQR: z = (x - median) / IQR)' },
          { ru: 'StandardScaler (использует среднее и стандартное отклонение)', en: 'StandardScaler (scales via mean and std)' },
          { ru: 'MinMaxScaler (сжимает в интервал [0, 1])', en: 'MinMaxScaler (bounds into [0, 1])' },
          { ru: 'MaxAbsScaler', en: 'MaxAbsScaler' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: '`RobustScaler` центрирует признак по медиане и делит на межквартильный размах ($IQR = Q_3 - Q_1$). Ни медиана, ни $IQR$ не подвержены влиянию экстремальных выбросов.',
          en: '`RobustScaler` centers around median and divides by interquartile range (IQR), neither of which is influenced by extreme tail values.',
        },
      },
    ],
  },
  {
    id: 'eda-3-pandas-idioms',
    moduleId: 'data-wrangling-eda',
    title: {
      ru: 'Продвинутый Pandas: векторизация, GroupBy и оптимизация памяти',
      en: 'Advanced Pandas: Vectorization, GroupBy & Memory Optimization',
    },
    order: 3,
    estimatedMinutes: 13,
    draft: false,
    theoryMarkdown: {
      ru: `### Высокопроизводительный Pandas

Использование неоптимальных конструкций (например, циклов \`for\` или \`.iterrows()\`) замедляет код в сотни раз. Эффективный код на Pandas опирается на **векторизацию** и оптимизацию памяти.

#### 1. Векторизация против циклов
\`\`\`python
# МЕДЛЕННО (антипаттерн - итерация по строкам):
for idx, row in df.iterrows():
    df.at[idx, 'total'] = row['price'] * row['quantity']

# БЫСТРО (векторизованная операция на C/NumPy):
df['total'] = df['price'] * df['quantity']
\`\`\`

#### 2. Продвинутые группировки (\`groupby\`)
\`\`\`python
# Агрегации с переименованием
grouped = df.groupby('category').agg(
    mean_price=('price', 'mean'),
    total_sales=('quantity', 'sum'),
    user_count=('user_id', 'nunique')
)

# Оконные преобразования без схлопывания строк (transform)
df['category_avg_price'] = df.groupby('category')['price'].transform('mean')
df['diff_from_avg'] = df['price'] - df['category_avg_price']
\`\`\`

#### 3. Оптимизация потребления оперативной памяти (Memory Downcasting)
По умолчанию Pandas загружает строки как \`object\`, а числа как \`int64\` / \`float64\`.
\`\`\`python
# 1. Категориальный тип: экономит до 90% памяти для повторяющихся строк
df['city'] = df['city'].astype('category')

# 2. Понижение разрядности чисел
df['age'] = pd.to_numeric(df['age'], downcast='unsigned') # uint8 вместо int64
df['score'] = pd.to_numeric(df['score'], downcast='float')  # float32 вместо float64
\`\`\`

#### 4. Цепочки методов (Method Chaining)
\`\`\`python
cleaned_df = (
    df.query("age >= 18 and status == 'active'")
      .assign(ratio=lambda d: d['income'] / d['expenses'])
      .sort_values(by='ratio', ascending=False)
      .reset_index(drop=True)
)
\`\`\``,
      en: `### High-Performance Pandas

Iterating over DataFrames via Python \`for\` loops or \`.iterrows()\` is hundreds of times slower than native operations. Idiomatic Pandas relies on **vectorization** and columnar contiguous memory layouts.

#### 1. Vectorization vs Loops
\`\`\`python
# SLOW (Anti-pattern - row-wise interpreter loop):
for idx, row in df.iterrows():
    df.at[idx, 'total'] = row['price'] * row['quantity']

# FAST (Columnar SIMD vectorization executed in C):
df['total'] = df['price'] * df['quantity']
\`\`\`

#### 2. Advanced GroupBy Operations
\`\`\`python
# Named Aggregations
grouped = df.groupby('category').agg(
    mean_price=('price', 'mean'),
    total_sales=('quantity', 'sum'),
    user_count=('user_id', 'nunique')
)

# Window transform preserving original row shape
df['category_avg_price'] = df.groupby('category')['price'].transform('mean')
df['relative_diff'] = df['price'] - df['category_avg_price']
\`\`\`

#### 3. RAM Downcasting
Pandas defaults strings to \`object\` and numbers to 64-bit width.
\`\`\`python
# 1. Categorical type: saves up to 90% RAM for repetitive strings
df['city'] = df['city'].astype('category')

# 2. Numerical downcasting
df['age'] = pd.to_numeric(df['age'], downcast='unsigned') # uint8 instead of int64
df['score'] = pd.to_numeric(df['score'], downcast='float')  # float32 instead of float64
\`\`\`

#### 4. Method Chaining
\`\`\`python
cleaned_df = (
    df.query("age >= 18 and status == 'active'")
      .assign(ratio=lambda d: d['income'] / d['expenses'])
      .sort_values(by='ratio', ascending=False)
      .reset_index(drop=True)
)
\`\`\``,
    },
    commonMistakes: [
      {
        ru: 'Использовать `.apply(axis=1)` там, где задачу можно решить векторизованными операциями.',
        en: 'Using `.apply(axis=1)` when vector expressions are readily available.',
      },
      {
        ru: 'Игнорировать SettingWithCopyWarning при операциях среза: используйте `.copy()` при фильтрации.',
        en: 'Ignoring SettingWithCopyWarning: chain indexing without explicit `.copy()` causes silent bugs.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'eda-cp-3',
        question: {
          ru: 'Какой метод позволяет добавить в исходный датафрейм среднее по группе, не сжимая число строк?',
          en: 'Which method appends grouped statistics back to rows without reducing total row count?',
        },
        options: [
          { ru: "df.groupby('cat')['val'].transform('mean')", en: "df.groupby('cat')['val'].transform('mean')" },
          { ru: "df.groupby('cat')['val'].mean()", en: "df.groupby('cat')['val'].mean()" },
          { ru: "df.groupby('cat')['val'].agg('mean')", en: "df.groupby('cat')['val'].agg('mean')" },
          { ru: "df.pivot_table()", en: "df.pivot_table()" },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Метод `.transform()` возвращает объект той же длины, что и исходный датасет, транслируя агрегированное значение на каждую строку группы.',
          en: '`.transform()` broadcasts group aggregates across all original rows, aligning dimensions seamlessly.',
        },
      },
      {
        id: 'eda-cp-3-b',
        question: {
          ru: 'Почему использование `for row in df.iterrows():` в Pandas считается антипаттерном?',
          en: 'Why is `for row in df.iterrows():` considered an anti-pattern in Pandas workflows?',
        },
        options: [
          { ru: 'Создает объект Series для каждой строки на уровне Python, замедляя выполнение в 100+ раз по сравнению с векторизацией', en: 'Instantiates individual Series objects per row at Python interpreter level, 100x slower than vectorized C pipelines' },
          { ru: 'Метод `iterrows` изменяет исходные данные на диске', en: 'The `iterrows` method alters raw disk files' },
          { ru: 'Этот метод удален из последних версий Pandas', en: 'The method was deprecated and removed in recent Pandas releases' },
          { ru: 'Он работает только для колонок с типом boolean', en: 'It only operates on boolean columns' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Итерация на чистом Python лишает нас оптимизаций BLAS/Cython/NumPy. Для быстрых расчетов всегда используйте векторизованные операции над колонками: `df["c"] = df["a"] + df["b"]`.',
          en: 'Pure Python row iteration bypasses underlying vectorized C/Cython execution blocks. Vectorized array expressions run orders of magnitude faster.',
        },
      },
      {
        id: 'eda-cp-3-c',
        question: {
          ru: 'Какой эффект дает приведение типов колонок (Downcasting: float64 -> float32, int64 -> int16, object -> category)?',
          en: 'What is the primary benefit of data type downcasting in Pandas during EDA?',
        },
        options: [
          { ru: 'Снижает объем занимаемой оперативной памяти (RAM) на 50–80%, предотвращая MemoryError при больших данных', en: 'Cuts memory (RAM) consumption by 50–80%, preventing MemoryError crashes on large datasets' },
          { ru: 'Увеличивает точность модели до 100%', en: 'Guarantees 100% model test accuracy' },
          { ru: 'Удаляет пропущенные значения NaN', en: 'Deletes missing NaN values' },
          { ru: 'Автоматически преобразует текст в эмбеддинги', en: 'Automatically embeds raw text into vectors' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'По умолчанию Pandas выделяет 64-битные типы. Сжатие в 32/16 бит и преобразование строковых повторов в категориальный тип (`category`) радикально уменьшает размер датафрейма в RAM.',
          en: 'Pandas defaults to 64-bit precision buffers. Downcasting to float32/int16 and dictionary category types slashes memory footprints dramatically.',
        },
      },
    ],
  },
  {
    id: 'eda-4-polars-speed',
    moduleId: 'data-wrangling-eda',
    title: {
      ru: 'Polars: современный многопоточный DataFrame-движок на Rust',
      en: 'Polars: Blazing Fast Multithreaded DataFrames in Rust',
    },
    order: 4,
    estimatedMinutes: 12,
    draft: false,
    theoryMarkdown: {
      ru: `### Знакомство с Polars

**Polars** — это современная молниеносная библиотека для обработки данных, написанная с нуля на **Rust** на базе спецификации **Apache Arrow**.

#### 1. Почему Polars превосходит Pandas?
| Параметр | Pandas | Polars |
| :--- | :--- | :--- |
| **Ядро** | Python + C | Чистый Rust |
| **Многопоточность** | Однопоточный (GIL) | Автоматически все ядра CPU |
| **Модель памяти** | Массивы NumPy | Apache Arrow (zero-copy) |
| **Оптимизация запросов** | Немедленная (Eager) | Ленивая (Lazy) с планировщиком |
| **Работа с большими файлами** | Ограничена объемом RAM | Потоковый режим (Streaming/Out-Of-Core) |

#### 2. Синтаксис выражений Polars (Expression API)
В Polars операции описываются как независимые выражения:
\`\`\`python
import polars as pl

df = pl.read_csv("orders.csv")

# Фильтрация и вычисления параллельно
result = df.select([
    pl.col("order_id"),
    (pl.col("price") * pl.col("quantity")).alias("total_price"),
    pl.when(pl.col("total_price") > 1000)
      .then(pl.lit("VIP"))
      .otherwise(pl.lit("Standard"))
      .alias("customer_tier")
])
\`\`\`

#### 3. Ленивые вычисления (LazyFrames)
Вместо немедленного выполнения операций строится граф вычислений. Планировщик Polars оптимизирует его (например, отсекает неиспользуемые колонки и фильтрует данные еще на этапе чтения с диска):
\`\`\`python
# 1. Сканирование без немедленной загрузки всего файла в RAM
lazy_plan = (
    pl.scan_parquet("large_dataset.parquet")
      .filter(pl.col("year") == 2024)
      .group_by("category")
      .agg(pl.col("revenue").sum())
)

# 2. Выполнение оптимизированного графа
final_df = lazy_plan.collect()
\`\`\`

*Predicate Pushdown (проталкивание предикатов):* Polars читает с диска только те партиции и строки Parquet-файла, которые удовлетворяют условию \`year == 2024\`, экономя гигабайты памяти.`,
      en: `### Introduction to Polars

**Polars** is a next-generation high-performance DataFrame library written from the ground up in **Rust**, powered by the **Apache Arrow** columnar format.

#### 1. Architectural Superiority
| Capability | Pandas | Polars |
| :--- | :--- | :--- |
| **Core** | Python + C | Pure Rust |
| **Parallelism** | Single-threaded (GIL bound) | Automatic multi-core threading |
| **Memory Format** | NumPy arrays | Apache Arrow (zero-copy IPC) |
| **Execution Engine** | Eager evaluation | Lazy evaluation with Query Optimizer |
| **Out-of-Core** | Crashes on large RAM | Built-in streaming mode |

#### 2. Expression API
\`\`\`python
import polars as pl

df = pl.read_csv("orders.csv")

# Expressions run concurrently across threads
result = df.select([
    pl.col("order_id"),
    (pl.col("price") * pl.col("quantity")).alias("total_price"),
    pl.when(pl.col("total_price") > 1000)
      .then(pl.lit("VIP"))
      .otherwise(pl.lit("Standard"))
      .alias("customer_tier")
])
\`\`\`

#### 3. LazyFrames & Query Optimization
Lazy evaluation compiles an AST execution plan. Polars applies Predicate and Projection Pushdown before execution:
\`\`\`python
# 1. Build an optimized plan without immediate I/O
lazy_plan = (
    pl.scan_parquet("large_dataset.parquet")
      .filter(pl.col("year") == 2024)
      .group_by("category")
      .agg(pl.col("revenue").sum())
)

# 2. Materialize via multithreaded engine
final_df = lazy_plan.collect()
\`\`\`

*Predicate Pushdown:* Polars inspects Parquet metadata statistics and skips disk reads for row chunks outside \`year == 2024\`.`,
    },
    commonMistakes: [
      {
        ru: 'Преобразовывать Polars в Pandas `.to_pandas()` на больших объемах данных, теряя преимущество по памяти.',
        en: 'Calling `.to_pandas()` on massive datasets, destroying memory efficiency and triggering unnecessary serialization.',
      },
      {
        ru: 'Забывать вызывать `.collect()` в конце ленивой цепочки `LazyFrame`.',
        en: 'Forgetting to trigger execution via `.collect()` on a LazyFrame.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'eda-cp-4',
        question: {
          ru: 'Какой метод запускает выполнение оптимизированного плана вычислений LazyFrame в Polars?',
          en: 'Which method executes and materializes an optimized Polars LazyFrame query?',
        },
        options: [
          { ru: '.collect()', en: '.collect()' },
          { ru: '.run()', en: '.run()' },
          { ru: '.execute()', en: '.execute()' },
          { ru: '.fetch_all()', en: '.fetch_all()' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Метод `.collect()` компилирует ленивый граф вычислений, применяет оптимизации и возвращает материализованный `DataFrame`.',
          en: '`.collect()` triggers the Polars Rust query engine to optimize and execute the execution graph.',
        },
      },
      {
        id: 'eda-cp-4-b',
        question: {
          ru: 'Что такое оптимизация Predicate Pushdown в Polars LazyFrame?',
          en: 'What is the Predicate Pushdown optimization in Polars LazyFrames?',
        },
        options: [
          { ru: 'Условия фильтрации опускаются до этапа сканирования диска (Parquet), пропуская чтение неподходящих строк и партиций', en: 'Filtering predicates are pushed down to the disk storage scan layer, skipping unneeded row chunks and files' },
          { ru: 'Автоматическое преобразование всех строковых столбцов в числа', en: 'Automatic type coercion from string to float' },
          { ru: 'Сжатие файлов в архив zip перед чтением', en: 'Compressing files into zip archives prior to scanning' },
          { ru: 'Принудительное выполнение запроса на одном ядре процессора', en: 'Forcing single-threaded CPU execution' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Благодаря метаданным Parquet-файлов движок Polars отсекает целые блоки данных еще до загрузки в RAM, что на порядок ускоряет чтение.',
          en: 'Polars leverages column chunk statistics in Parquet headers to prune chunks at the I/O layer before pulling bytes into memory.',
        },
      },
      {
        id: 'eda-cp-4-c',
        question: {
          ru: 'Какой формат данных в памяти и какой язык программирования обеспечивают экстремальную скорость Polars?',
          en: 'Which in-memory layout and underlying language provide Polars its high performance?',
        },
        options: [
          { ru: 'Колоночный формат Apache Arrow и системный язык Rust с автоматическим параллелизмом без ограничений GIL', en: 'Apache Arrow columnar memory layout and multi-threaded Rust without Python GIL bottlenecks' },
          { ru: 'Таблицы SQLite на языке Си', en: 'SQLite tables in C' },
          { ru: 'Формат JSON на JavaScript', en: 'JSON format in JavaScript' },
          { ru: 'Массивы NumPy на FORTRAN', en: 'NumPy arrays in FORTRAN' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Polars написан на Rust поверх формата Apache Arrow, что дает zero-copy обмен данными, векторизованные инструкции SIMD и параллелизм на всех ядрах CPU.',
          en: 'Polars is implemented natively in Rust around Apache Arrow memory primitives, enabling SIMD vectorization and true thread concurrency.',
        },
      },
    ],
  },
  {
    id: 'eda-5-feature-engineering',
    moduleId: 'data-wrangling-eda',
    title: {
      ru: 'Инженерия признаков: Target Encoding, KNNImputer, временные ряды и SMOTE',
      en: 'Feature Engineering: Target Encoding, KNNImputer, Time-Series & SMOTE',
    },
    order: 5,
    estimatedMinutes: 18,
    draft: false,
    theoryMarkdown: {
      ru: `### Инженерия признаков (Feature Engineering)
«Создание признаков — это искусство превращения сырых сырых данных в форму, максимально понятную алгоритмам машинного обучения» (Эндрю Ын). Качество признаков определяет верхний предел (ceiling) качества любой модели.

---

#### 1. Продвинутая обработка пропусков: KNNImputer и IterativeImputer (MICE)
Простая замена на медиану разрушает взаимосвязи между переменными (например, заменяет зарплату медианой без учета стажа и возраста).
* **KNNImputer:** находит $k$ ближайших соседей объекта по евклидову расстоянию среди признаков без пропусков (с взвешиванием по расстоянию) и вычисляет их среднее:
\`\`\`python
from sklearn.impute import KNNImputer

imputer = KNNImputer(n_neighbors=5, weights='distance')
X_train_imputed = imputer.fit_transform(X_train)
X_test_imputed = imputer.transform(X_test)
\`\`\`
* **IterativeImputer (MICE — Multivariate Imputation by Chained Equations):** моделирует каждый признак с пропусками как регрессионную функцию от всех остальных признаков в итерационном цикле.

---

#### 2. Продвинутое кодирование категорий: Target Encoding со сглаживанием
При высокой мощности категориального признака (High Cardinality, например, 500 городов) One-Hot кодирование порождает 500 разреженных колонок.
**Target Encoding (Mean Encoding):** заменяет категорию $c$ на среднее значение целевой переменной $\\bar{y}_c$ среди объектов этой категории:
$$S_c = \\frac{n_c \\bar{y}_c + m \\mu_y}{n_c + m}$$
где $n_c$ — число объектов категории $c$, $\\bar{y}_c$ — средний таргет в категории, $\\mu_y$ — глобальное среднее таргета по выборке, $m$ — вес априорного сглаживания (m-estimate / additive smoothing).
* **Защита от Target Leakage:** если считать среднее по обучающей выборке в лоб, модель переобучится (запомнит редкие категории). Применяют **Out-Of-Fold (OOF) Target Encoding**: таргет для фолда вычисляется строго по остальным $K-1$ фолдам!

---

#### 3. Масштабирование и степенные преобразования
* **StandardScaler:** $z = \\frac{x - \\mu}{\\sigma}$ (чувствителен к тяжелым хвостам).
* **RobustScaler:** $z = \\frac{x - \\text{median}}{IQR}$ (устойчив к выбросам).
* **PowerTransformer (Yeo-Johnson / Box-Cox):** стабилизирует дисперсию и преобразует скошенное (асимметричное) распределение в форму, близкую к Гауссовской, что резко улучшает линейные модели.

---

#### 4. Признаки для временных рядов (Time-Series)
Для данных с временным измерением недопустимо случайное разбиение (используют \`TimeSeriesSplit\`).
* **Лаги (Lags):** значения отклика или внешних факторов в прошлые моменты времени:
  $$y_{t-1}, \\quad y_{t-7} \\text{ (недельный сезонный лаг)}$$
* **Оконные скользящие статистики (Rolling Statistics):**
  - Скользящее среднее (SMA) и экспоненциальное скользящее среднее (EWMA).
  - Скользящая дисперсия/волатильность: \`df['sales'].rolling(window=7).std()\`.
* **Циклические тригонометрические признаки:** для предотвращения разрыва между часом 23 и часом 0:
  $$x_{\\sin} = \\sin\\left( \\frac{2\\pi \\cdot \\text{hour}}{24} \\right), \\quad x_{\\cos} = \\cos\\left( \\frac{2\\pi \\cdot \\text{hour}}{24} \\right)$$

---

#### 5. Дисбаланс классов (Imbalanced Classification)
Если положительный класс составляет $1\\%$:
1. **Алгоритмический способ (Cost-Sensitive):** аргумент \`class_weight='balanced'\` в LogisticRegression/RandomForest или параметр \`scale_pos_weight\` в бустинге увеличивает штраф за ошибку на редком классе.
2. **SMOTE (Synthetic Minority Over-sampling Technique):** не просто дублирует редкие объекты, а генерирует синтетические точки на отрезках между ближайшими соседями миноритарного класса:
   $$x_{\\text{new}} = x_i + \\lambda (x_{\\text{zi}} - x_i), \\quad \\lambda \\sim U(0, 1)$$
* **Критическое правило:** SMOTE вызывается **строго внутри обучающего сплита (train)** через \`imblearn.pipeline.Pipeline\`. Применение SMOTE до сплита приводит к синтетическому дублированию теста в train (Data Leakage)!`,
      en: `### Feature Engineering & Data Transformations
"Applied machine learning is basically feature engineering" (Andrew Ng). The features you craft determine the accuracy ceiling of your algorithms.

---

#### 1. Advanced Imputation: KNNImputer & IterativeImputer (MICE)
Replacing missing values with univariate medians destroys multi-attribute covariance.
* **KNNImputer:** fills missing values by averaging the $k$ nearest neighbors in Euclidean feature space:
\`\`\`python
from sklearn.impute import KNNImputer

imputer = KNNImputer(n_neighbors=5, weights='distance')
X_train_imp = imputer.fit_transform(X_train)
X_test_imp = imputer.transform(X_test)
\`\`\`
* **IterativeImputer (MICE):** estimates missing values by training a chained regression model for each column conditioned on all remaining features.

---

#### 2. Target Encoding with Additive Smoothing
When categorical columns exhibit High Cardinality (e.g. 500 postal codes), One-Hot encoding blows up dimensionality.
**Target Encoding (Mean Encoding):** maps category $c$ to the expected target value, regularized with additive smoothing ($m$-estimate):
$$S_c = \\frac{n_c \\bar{y}_c + m \\mu_y}{n_c + m}$$
where $n_c$ is frequency, $\\bar{y}_c$ is category target mean, $\\mu_y$ is global target mean, and $m$ is smoothing strength.
* **Leakage Prevention:** calculate target statistics exclusively using **Out-Of-Fold (OOF)** schemes to prevent models from memorizing rare categories.

---

#### 3. Power Transforms & Feature Scaling
* **StandardScaler:** $z = \\frac{x - \\mu}{\\sigma}$ (sensitive to heavy tails).
* **RobustScaler:** $z = \\frac{x - \\text{median}}{IQR}$ (robust to outliers).
* **PowerTransformer (Yeo-Johnson):** normalizes skewed feature distributions towards Gaussian symmetry.

---

#### 4. Time-Series Feature Engineering
* **Lag Features:** temporal offsets capturing autocorrelation:
  $$y_{t-1}, \\quad y_{t-7} \\text{ (weekly seasonality)}$$
* **Rolling Window Statistics:** rolling mean, rolling standard deviation, and exponential moving averages (EWMA).
* **Cyclical Encodings:** preserving continuity across cycle boundaries (e.g., hour 23 into hour 0):
  $$x_{\\sin} = \\sin\\left( \\frac{2\\pi \\cdot \\text{hour}}{24} \\right), \\quad x_{\\cos} = \\cos\\left( \\frac{2\\pi \\cdot \\text{hour}}{24} \\right)$$

---

#### 5. Handling Extreme Class Imbalance
1. **Cost-Sensitive Learning:** passing \`class_weight='balanced'\` or \`scale_pos_weight\` penalizes minority class misses proportionally.
2. **SMOTE (Synthetic Minority Over-sampling Technique):** synthesizes artificial minority observations by interpolating along segments connecting $k$-nearest neighbors:
   $$x_{\\text{new}} = x_i + \\lambda (x_{\\text{zi}} - x_i), \\quad \\lambda \\sim U(0, 1)$$
* **Strict Guardrail:** execute SMOTE exclusively inside training folds via an \`imblearn.pipeline.Pipeline\` to guarantee zero holdout leakage!`,
    },
    commonMistakes: [
      {
        ru: 'Применять SMOTE ко всей выборке до разбиения на train/test: это грубейшая утечка данных, так как синтетические точки будут созданы из информации тестовых объектов.',
        en: 'Running SMOTE prior to train/test splitting: synthetic samples interpolate test information directly into the training partition.',
      },
      {
        ru: 'Вычислять Target Encoding напрямую по обучающей выборке без сглаживания и без OOF (Out-Of-Fold): приводит к моментальному катастрофическому переобучению.',
        en: 'Computing raw target means without smoothing or out-of-fold partitioning, causing severe target memorization.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'eda-cp-5-a',
        question: {
          ru: 'Почему при Target Encoding редких категорий необходимо использовать сглаживание (smoothing) или формулу m-estimate?',
          en: 'Why is additive smoothing (m-estimate) required when target encoding rare categories?',
        },
        options: [
          {
            ru: 'Чтобы подтянуть оценку редких категорий (с малым n_c) к глобальному среднему таргета, предотвращая переобучение',
            en: 'To shrink noisy small-sample category estimates towards global target mean, mitigating overfitting',
          },
          {
            ru: 'Чтобы преобразовать вещественные числа в целые',
            en: 'To convert float numbers into integers',
          },
          {
            ru: 'Это техническое требование формата CSV',
            en: 'It is a CSV file format requirement',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Для категории с одним объектом (n_c = 1) таргет может быть случайным 1.0. Сглаживание $S_c = \\frac{n_c \\bar{y}_c + m \\mu}{n_c + m}$ плавно стягивает оценку к общему среднему $\\mu$.',
          en: 'Without smoothing, a category observed only once would assume extreme target values, creating high model variance.',
        },
      },
      {
        id: 'eda-cp-5-b',
        question: {
          ru: 'На каком этапе конвейера машинного обучения допустимо применять оверсэмплинг SMOTE?',
          en: 'Where should SMOTE oversampling be strictly positioned within the ML workflow?',
        },
        options: [
          {
            ru: 'Строго только на тренировочной выборке (X_train, y_train), никогда не затрагивая тест или валидацию',
            en: 'Strictly on the training partition (X_train, y_train), never touching validation or test splits',
          },
          {
            ru: 'На всем сыром датасете до любого разбиения',
            en: 'Across the entire raw dataset before splitting',
          },
          {
            ru: 'Только на тестовой выборке',
            en: 'Only on holdout test splits',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Синтез точек SMOTE по тестовым данным — это прямая утечка информации (Data Leakage). Тестовая выборка обязана отражать реальное неискаженное распределение.',
          en: 'Applying SMOTE before splitting leaks future test structure into training, artificially inflating evaluation metrics.',
        },
      },
      {
        id: 'eda-cp-5-c',
        question: {
          ru: 'Как работает заполнение пропусков с помощью `KNNImputer`?',
          en: 'How does missing value imputation work in `KNNImputer`?',
        },
        options: [
          { ru: 'Находит K ближайших соседей объекта по известным числовым признакам и берет их среднее значение (взвешенное по расстоянию)', en: 'Locates K nearest neighbors by observable features and computes their distance-weighted average' },
          { ru: 'Заполняет все пропуски случайным целым числом от 1 до K', en: 'Fills all missing cells with random integers between 1 and K' },
          { ru: 'Удаляет все строки, у которых расстояние до соседа больше K', en: 'Deletes all records with distance to neighbor exceeding K' },
          { ru: 'Обучает дерево решений CART на каждой колонке', en: 'Trains a CART decision tree on every column' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: '`KNNImputer` вычисляет расстояние между объектами по признакам, где нет пропусков, находит K самых похожих строк и интерполирует пропущенную величину.',
          en: '`KNNImputer` computes pairwise Euclidean distance on non-missing dimensions, identifying nearest neighbors to infer missing attributes.',
        },
      },
    ],
  },
  {
    id: 'eda-6-sql-analytics',
    moduleId: 'data-wrangling-eda',
    title: {
      ru: 'SQL для Data Science и аналитики: оконные функции, CTE, сложные JOIN и подготовка признаков',
      en: 'SQL for Data Science & Analytics: Window Functions, CTEs, Complex JOINs & Feature Preparation',
    },
    order: 6,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### SQL — Фундаментальный инструмент Data Science и Data Analytics
Более 80% сырых данных бизнеса хранятся в реляционных базах (PostgreSQL, MySQL) и распределенных аналитических хранилищах (ClickHouse, Snowflake, Google BigQuery). Извлечение и агрегация признаков на стороне СУБД в сотни раз быстрее, чем выгрузка сырых терабайтов в память Python.

---

#### 1. Логический порядок выполнения запроса (Logical Query Processing Order)
СУБД выполняет блоки SQL-запроса не в том порядке, в котором они написаны, а в строгой логической последовательности:
1. **\`FROM\` & \`JOIN\`** — определение таблиц и формирование декартова произведения со связями.
2. **\`WHERE\`** — фильтрация отдельных строк (до агрегации!).
3. **\`GROUP BY\`** — группировка строк по ключам.
4. **\`HAVING\`** — фильтрация уже сгруппированных данных (по агрегатным функциям, например \`HAVING COUNT(*) > 5\`).
5. **\`SELECT\`** — вычисление выражений и проекция колонок.
6. **\`WINDOW (OVER)\`** — расчет оконных функций.
7. **\`DISTINCT\`** — исключение дубликатов.
8. **\`ORDER BY\`** — сортировка результирующего набора.
9. **\`LIMIT / OFFSET\`** — усечение вывода.

*Знание этого порядка объясняет, почему в \`WHERE\` нельзя использовать псевдонимы (aliases) из \`SELECT\` или оконные функции!*

---

#### 2. Оконные функции (Window Functions): \`OVER (PARTITION BY ... ORDER BY ...)\`
В отличие от обычного \`GROUP BY\`, который схлопывает группу в одну строку, **оконная функция сохраняет все строки выборки**, приписывая к каждой строке агрегированное или ранжирующее значение:

1. **Ранжирование и дедупликация: \`ROW_NUMBER()\`, \`RANK()\`, \`DENSE_RANK()\`**
   Задача: выбрать последнюю транзакцию каждого пользователя (для актуального статуса в ML-признаках):
   \`\`\`sql
   WITH ranked_transactions AS (
       SELECT 
           user_id,
           amount,
           transaction_time,
           ROW_NUMBER() OVER (
               PARTITION BY user_id 
               ORDER BY transaction_time DESC
           ) AS rn
       FROM transactions
   )
   SELECT user_id, amount, transaction_time
   FROM ranked_transactions
   WHERE rn = 1;
   \`\`\`
   *Различия:*
   * \`ROW_NUMBER()\`: строгая нумерация \`1, 2, 3, 4\` без пропусков даже при равных значениях.
   * \`RANK()\`: при совпадении \`1, 2, 2, 4\` (пропускает номера).
   * \`DENSE_RANK()\`: при совпадении \`1, 2, 2, 3\` (без пропусков).

2. **Временные смещения: \`LAG()\` и \`LEAD()\` (Генерация лаговых признаков)**
   \`\`\`sql
   SELECT 
       user_id,
       transaction_time,
       amount,
       -- Время предыдущей покупки
       LAG(transaction_time, 1) OVER (
           PARTITION BY user_id ORDER BY transaction_time
       ) AS prev_txn_time,
       -- Сумма следующей покупки
       LEAD(amount, 1) OVER (
           PARTITION BY user_id ORDER BY transaction_time
       ) AS next_amount
   FROM transactions;
   \`\`\`

3. **Скользящие агрегаты (Rolling Aggregations):**
   \`\`\`sql
   -- 7-дневное скользящее среднее расходов пользователя
   SELECT 
       user_id,
       txn_date,
       amount,
       AVG(amount) OVER (
           PARTITION BY user_id 
           ORDER BY txn_date 
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS rolling_avg_7d
   FROM daily_user_spending;
   \`\`\`

---

#### 3. Обобщенные табличные выражения (CTE — Common Table Expressions)
Конструкция \`WITH ... AS (...)\` позволяет структурировать сложную аналитическую логику в виде чистого конвейера (DAG) промежуточных шагов вместо нечитаемых вложенных подзапросов:

\`\`\`sql
WITH user_activity AS (
    SELECT user_id, COUNT(*) AS total_logins, MAX(login_date) AS last_login
    FROM user_logins
    WHERE login_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
),
user_orders AS (
    SELECT user_id, SUM(order_total) AS ltv_30d
    FROM orders
    WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
)
SELECT 
    u.id AS user_id,
    COALESCE(a.total_logins, 0) AS logins_30d,
    COALESCE(o.ltv_30d, 0.0) AS revenue_30d,
    CASE WHEN a.last_login IS NULL THEN 1 ELSE 0 END AS is_churn_candidate
FROM users u
LEFT JOIN user_activity a ON u.id = a.user_id
LEFT JOIN user_orders o ON u.id = o.user_id;
\`\`\`

---

#### 4. Опасность «размножения строк» (Fan-out / Cartesian explosion) при JOIN
Если таблица объединяется с другой таблицей по ключу, который не является уникальным в правой части (отношение Many-to-Many), происходит неявное дублирование строк. Это искажает суммы (\`SUM\`) и метрики в ML-датасетах.
* Всегда проверяйте уникальность ключей перед объединением (\`COUNT(DISTINCT key) == COUNT(*)\`) либо выполняйте предварительную группировку в CTE.

---

#### 5. DuckDB: аналитический SQL прямо в Python и Jupyter
**DuckDB** называют «SQLite для аналитики и OLAP»:
\`\`\`python
import duckdb
import pandas as pd

df = pd.read_csv("events.csv")

# Выполнение сложнейшего оконного SQL прямо по объекту pandas DataFrame!
result_df = duckdb.query("""
    SELECT 
        user_id, 
        event_name,
        COUNT(*) OVER (PARTITION BY user_id) AS total_events,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY timestamp DESC) AS event_rank
    FROM df
    QUALIFY event_rank <= 3
""").df()
\`\`\`
DuckDB работает на векторизованном движке с колоночным хранением, обрабатывая сотни миллионов строк за секунды без установки сервера.

---

#### 6. Оптимизация аналитических SQL-запросов (Query Optimization & Execution Plans)
Когда объем таблиц превышает десятки миллионов строк, медленный SQL-запрос может заблокировать аналитический конвейер на часы.

1. **Анализ планов выполнения: \`EXPLAIN (ANALYZE, BUFFERS)\`**
   - \`Seq Scan (Sequential Scan)\`: последовательное чтение всей таблицы с диска. Для таблиц > 1 млн строк — опасный сигнал нехватки индексов или неселективного фильтра.
   - \`Index Scan\`: поиск по B-Tree индексу с точечным чтением страниц данных.
   - \`Index Only Scan\`: идеальный сценарий! Все запрошенные в \`SELECT\` и \`WHERE\` колонки уже содержатся в самом индексе (покрывающий индекс \`CREATE INDEX ... INCLUDE (...)\`), чтение основной таблицы с диска вообще не происходит.
   - \`Bitmap Heap Scan\`: поиск ссылок на строки в индексе с формированием битовой карты страниц памяти, а затем групповое последовательное чтение блоков.

2. **Принцип SARGability (Search Argument Able)**
   Предикат в \`WHERE\` называется **SARGable**, если планировщик СУБД способен использовать индекс для диапазонного поиска:
   - ❌ **Non-SARGable (индекс ломается, полный Seq Scan):**
     \`WHERE DATE(created_at) = '2024-05-01'\` или \`WHERE UPPER(email) = 'USER@MAIL.COM'\` или \`WHERE amount * 1.2 > 1000\`
     *Причина:* функция или математическая операция применяется к каждой строке таблицы на лету, лишая индекс смысла.
   - ✅ **SARGable (быстрый Index Range Scan):**
     \`WHERE created_at >= '2024-05-01 00:00:00' AND created_at < '2024-05-02 00:00:00'\` и \`WHERE amount > 1000 / 1.2\`
     *Правило:* колонка таблицы в условии обязана быть изолирована в чистом виде!

3. **Алгоритмы соединений (JOIN Algorithms):**
   - **Nested Loop:** для каждой строки внешней таблицы ищется совпадение во внутренней. Идеален, когда одна из таблиц крошечная, а вторая имеет B-Tree индекс по ключу связи.
   - **Hash Join:** СУБД строит в оперативной памяти (work_mem) хэш-таблицу по меньшей таблице, затем сканирует большую таблицу, проверяя хэши. Основной рабочий алгоритм для не отсортированных аналитических выборок.
   - **Merge Join:** обе таблицы предварительно сортируются по ключу (или уже упорядочены индексом), после чего курсоры идут параллельно за один проход $O(N + M)$.

4. **Партиционирование (Partition Pruning):**
   Разбиение гигантских таблиц (факты заказов, кликстрим) на секции по диапазону дат (\`PARTITION BY RANGE (event_date)\`). При запросе с фильтром по датам планировщик отсекает ненужные разделы (Partition Pruning), физически считывая с диска лишь 1-2% файлов.

5. **Особенности колоночных аналитических хранилищ (ClickHouse, Snowflake, BigQuery):**
   - Никогда не пишите \`SELECT *\`! В колоночных СУБД каждая колонка хранится в отдельном сжатом файле. Запрос 3 нужных колонок вместо всех 100 сократит объем считываемых байтов с диска в 30 раз!
   - Использование сортировочного первичного ключа (\`ORDER BY (event_date, user_id)\` в ClickHouse) для разреженных индексов (Sparse Index) и колоночной компрессии (LZ4, ZSTD).

---

#### 7. Легендарная задача собеседований: Вычисление медианы в SQL без встроенной функции
Во многих СУБД (например, в SQLite или стандартном PostgreSQL) нет встроенной агрегатной функции \`MEDIAN(column)\`. На собеседованиях этот вопрос задают 8 из 10 компаний!

**Решение 1: Оконные ранги \`ROW_NUMBER()\` и \`COUNT(*) OVER ()\`**
\`\`\`sql
WITH ranked_data AS (
    SELECT 
        salary,
        ROW_NUMBER() OVER (ORDER BY salary ASC) AS rn,
        COUNT(*) OVER () AS total_rows
    FROM employees
    WHERE salary IS NOT NULL
)
SELECT AVG(salary) AS median_salary
FROM ranked_data
-- Для нечетного N: выбирает ровно центральный элемент ((N+1)/2)
-- Для четного N: выбирает два средних элемента и AVG берет их полусумму!
WHERE rn IN (FLOOR((total_rows + 1) / 2.0), CEIL((total_rows + 1) / 2.0));
\`\`\`

**Решение 2: Симметричные счетчики с двух сторон**
\`\`\`sql
WITH ordered AS (
    SELECT 
        salary,
        ROW_NUMBER() OVER (ORDER BY salary ASC) AS r_asc,
        ROW_NUMBER() OVER (ORDER BY salary DESC) AS r_desc
    FROM employees
)
SELECT AVG(salary) AS median_salary
FROM ordered
WHERE ABS(r_asc - r_desc) <= 1;
\`\`\`

**Решение 3: Через непрерывный процентиль (PostgreSQL / Snowflake / BigQuery):**
\`\`\`sql
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary
FROM employees;
\`\`\``,
      en: `### SQL for Data Science & Business Analytics
More than 80% of enterprise production data resides in relational and analytical columnar databases (PostgreSQL, ClickHouse, Snowflake, BigQuery). Engineering features in SQL pushes compute to scalable database clusters.

#### 1. Logical Query Execution Order
FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> WINDOW -> DISTINCT -> ORDER BY -> LIMIT.

#### 2. Advanced Window Functions
\`ROW_NUMBER()\`, \`RANK()\`, \`DENSE_RANK()\` for deduplication and Top-K extraction without row collapsing.
\`LAG()\` and \`LEAD()\` for feature extraction on consecutive time intervals.
Running window aggregates via \`ROWS BETWEEN ...\`.

#### 3. Common Table Expressions (CTEs)
Structured intermediate views via \`WITH ... AS (...)\` prevent nested subquery anti-patterns.

#### 4. In-Process SQL with DuckDB
DuckDB enables blazingly fast columnar vectorized SQL queries directly over Python Pandas DataFrames and Parquet data.

#### 5. SQL Query Optimization & Performance Tuning
- **EXPLAIN (ANALYZE, BUFFERS):** Seq Scan vs Index Scan vs Index Only Scan (covering indexes via \`INCLUDE\`).
- **SARGability:** Why \`WHERE DATE(created_at) = '2024-05-01'\` breaks B-Tree indices forcing full table scans, whereas boundary ranges \`WHERE created_at >= '2024-05-01' AND created_at < '2024-05-02'\` unlock Index Range Scans.
- **Join Strategies:** Nested Loop vs Hash Join vs Merge Join.
- **Partition Pruning & Columnar Storage:** Avoiding \`SELECT *\` in ClickHouse/Snowflake to maximize columnar compression and I/O throughput.`,
    },
    commonMistakes: [
      {
        ru: 'Использовать оконные функции напрямую в блоке `WHERE`: оконные функции вычисляются ПОСЛЕ этапа `WHERE`. Для фильтрации по оконным функциям запрос необходимо обернуть в CTE или подзапрос (либо использовать конструкцию `QUALIFY` в ClickHouse/Snowflake/DuckDB).',
        en: 'Filtering on window functions inside the `WHERE` clause; window calculations occur downstream of `WHERE`, requiring CTE encapsulation or the `QUALIFY` clause.',
      },
      {
        ru: 'Забывать `COALESCE` при `LEFT JOIN`: если у пользователя не было покупок, колонка суммы вернет `NULL`, что приведет к пропускам (NaN) в ML-датасете. Следует писать `COALESCE(SUM(amount), 0)`.',
        en: 'Omitting `COALESCE` on `LEFT JOIN` aggregations, propagating unintended database `NULL` values into the downstream ML feature matrix.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'eda-cp-6-a',
        question: {
          ru: 'В чем ключевое отличие оконной функции с `OVER (PARTITION BY ...)` от классической группировки `GROUP BY`?',
          en: 'What is the fundamental difference between a window function using `OVER (PARTITION BY ...)` and standard `GROUP BY`?',
        },
        options: [
          {
            ru: 'Оконная функция вычисляет агрегат/ранг для группы, но сохраняет исходное число строк в выборке без схлопывания',
            en: 'Window functions compute partition-level aggregations while retaining all original individual rows without collapsing',
          },
          {
            ru: 'Оконная функция может выполняться только в базе данных Oracle',
            en: 'Window functions only work in Oracle databases',
          },
          {
            ru: 'Оконная функция удаляет дублирующиеся строки из таблицы',
            en: 'Window functions purge duplicate rows from tables',
          },
          {
            ru: 'Оконная функция всегда заменяет NULL на 0',
            en: 'Window functions automatically replace NULL with 0',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Стандартный `GROUP BY` сворачивает (схлопывает) строки группы в одну строку. Оконная функция производит вычисление по окну строк, но возвращает результат в каждую строку исходной выборки.',
          en: '`GROUP BY` aggregates many rows into one single output row per group; window functions evaluate across partitioned frames while maintaining individual row granularity.',
        },
      },
      {
        id: 'eda-cp-6-b',
        question: {
          ru: 'Какая оконная функция позволяет получить значение предыдущего события пользователя по времени (например, дату предыдущего входа)?',
          en: 'Which SQL window function retrieves the value from an earlier row within the partition (e.g. timestamp of previous session)?',
        },
        options: [
          { ru: 'LAG(column, 1) OVER (PARTITION BY user_id ORDER BY event_time)', en: 'LAG(column, 1) OVER (PARTITION BY user_id ORDER BY event_time)' },
          { ru: 'LEAD(column, 1) OVER (PARTITION BY user_id ORDER BY event_time)', en: 'LEAD(column, 1) OVER (PARTITION BY user_id ORDER BY event_time)' },
          { ru: 'DENSE_RANK() OVER (PARTITION BY user_id)', en: 'DENSE_RANK() OVER (PARTITION BY user_id)' },
          { ru: 'FIRST_VALUE() OVER (ORDER BY user_id)', en: 'FIRST_VALUE() OVER (ORDER BY user_id)' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: '`LAG(col, offset)` возвращает значение строки, отстоящей на `offset` позиций назад по порядку сортировки. `LEAD` заглядывает вперед.',
          en: '`LAG` inspects preceding rows at specified offset; `LEAD` looks ahead at following rows within the partition.',
        },
      },
      {
        id: 'eda-cp-6-c',
        question: {
          ru: 'В чем ключевое преимущество использования CTE (`WITH table_name AS (...)`) перед вложенными подзапросами в сложных аналитических запросах?',
          en: 'What is the primary advantage of CTEs (`WITH ...`) over deeply nested subqueries in analytical SQL?',
        },
        options: [
          { ru: 'Читаемость, модульная декомпозиция пайплайна и возможность многократного переиспользования одного CTE в том же запросе', en: 'Code readability, modular pipeline decomposition, and multiple re-use of the CTE within the same query' },
          { ru: 'CTE автоматически удаляет строки с NULL значениями', en: 'CTEs automatically purge NULL values' },
          { ru: 'CTE всегда физически материализуется на SSD диске', en: 'CTEs are always physically written to SSD' },
          { ru: 'CTE отключает транзакционность базы данных', en: 'CTEs disable database transactions' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Конструкция `WITH` превращает запутанные вложенные подзапросы в последовательный направленный граф вычислений (DAG), понятный аналитикам и оптимизатору запросов.',
          en: 'CTEs turn messy nested subqueries into readable linear DAG pipelines that can be referenced multiple times.',
        },
      },
      {
        id: 'eda-cp-6-d',
        question: {
          ru: 'Почему фильтр WHERE DATE(created_at) = \'2024-05-01\' работает значительно медленнее, чем WHERE created_at >= \'2024-05-01\' AND created_at < \'2024-05-02\' при наличии B-Tree индекса по created_at?',
          en: 'Why is WHERE DATE(created_at) = \'2024-05-01\' much slower than boundary comparison WHERE created_at >= \'2024-05-01\' AND created_at < \'2024-05-02\' on an indexed B-Tree column?',
        },
        options: [
          {
            ru: 'Функция DATE() возвращает случайное число',
            en: 'The DATE() function outputs random numbers',
          },
          {
            ru: 'Обертывание колонки в функцию DATE() делает предикат Non-SARGable, заставляя СУБД сканировать всю таблицу (Seq Scan) вместо быстрого Index Range Scan',
            en: 'Wrapping the column in DATE() renders the predicate Non-SARGable, forcing a full table scan (Seq Scan) instead of an Index Range Scan',
          },
          {
            ru: 'СУБД PostgreSQL не поддерживает B-Tree индексы по датам',
            en: 'PostgreSQL does not support date B-Tree indices',
          },
          {
            ru: 'Оператор равенства = в SQL всегда медленнее операторов неравенства < и >',
            en: 'The equality operator = is inherently slower than inequality comparisons',
          },
        ],
        correctAnswer: 1,
        explanation: {
          ru: 'Индекс B-Tree упорядочивает чистые значения timestamp. Вызов функции DATE() заставляет СУБД вычислять ее для каждой строки таблицы, отключая использование индекса.',
          en: 'B-Tree indices order raw timestamp values. Wrapping columns in scalar functions forces full table evaluation, disabling index range traversals.',
        },
      },
    ],
  },
  {
    id: 'eda-7-bi-excel-analytics',
    moduleId: 'data-wrangling-eda',
    title: {
      ru: 'Бизнес-аналитика: Excel для экспресс-проверок, Power BI, DAX и модель «Звезда»',
      en: 'Business Analytics: Excel for Validation, Power BI, DAX & Star Schema',
    },
    order: 7,
    estimatedMinutes: 18,
    draft: false,
    theoryMarkdown: {
      ru: `### От модели машинного обучения — к бизнес-решениям
ML-инженер и аналитик данных не существуют в вакууме. Даже модель с AUC-ROC = 0.95 бесполезна, если бизнес-руководители не видят ее эффекта в метриках (выручка, Churn, LTV, ROI). Владение инструментами бизнес-аналитики (BI) и электронными таблицами превращает технического специалиста в полноценного продуктового партнера.

---

#### 1. Microsoft Excel & Google Таблицы в арсенале Data Scientist
Быстрый анализ в таблицах — незаменимый навык:
* **Экспресс-валидация срезов:** открыть выгрузку на 10 000 строк и за 30 секунд проверить гипотезу быстрее, чем запускать Jupyter Notebook и писать код.
* **Сводные таблицы (Pivot Tables):** моментальный расчет перекрестных распределений (Cross-tabulation), срезов конверсий по регионам и когортам.
* **Ключевые формулы современного аналитика:**
  * \`XLOOKUP(lookup_val, lookup_arr, return_arr, not_found, match_mode)\`: современная замена \`VLOOKUP\` и \`INDEX/MATCH\`. Ищет в любом направлении (слева направо, справа налево), не ломается при вставке новых колонок и по умолчанию ищет точное совпадение.
  * \`SUMIFS / COUNTIFS\`: подсчет сумм и количества по нескольким критериям.
  * \`UNIQUE\` и \`FILTER\`: динамические массивы для выделения уникальных сегментов.

---

#### 2. Архитектура хранилища: Модель «Звезда» (Star Schema)
В системах бизнес-аналитики (Power BI, Tableau) объединение таблиц в одну гигантскую плоскую таблицу («flat wide table») — антипаттерн, приводящий к тормозам и неконсистентности.

Стандартом индустрии является **Star Schema (Схема «Звезда»)**:
1. **Таблица фактов (Fact Table):**
   * Расположена в центре.
   * Содержит количественные числовые события: транзакции, клики, заказы, предсказания моделей.
   * Содержит внешние ключи (Foreign Keys) и числовые метрики (\`amount\`, \`churn_probability\`, \`discount\`).
   * Высокая скорость роста (миллионы и миллиарды строк).
2. **Таблицы измерений (Dimension Tables):**
   * Справочники атрибутов: \`Dim_Customers\` (клиенты, демография), \`Dim_Products\` (категории товаров), \`Dim_Date\` (календарь: год, квартал, месяц, праздник).
   * Отношение между Dimension и Fact: строго **1 : Many (Один-ко-многим)**.
   * Преимущество: колоночный движок Power BI (VertiPaq) сжимает измерения по словарю, ускоряя интерактивные расчеты в 10–50 раз.

---

#### 3. Язык DAX (Data Analysis Expressions) в Power BI
DAX — функциональный язык формул Power BI и Analysis Services.

**Критическая разница: Вычисляемый столбец vs Мера**
* **Вычисляемый столбец (Calculated Column):**
  * Вычисляется построчно в момент загрузки данных и физически хранится в оперативной памяти.
  * *Пример:* \`Margin_USD = Sales[Revenue] - Sales[Cost]\`.
* **Мера (Measure):**
  * **Не занимает память на диске.** Вычисляется динамически на лету в **контексте фильтрации (Filter Context)** в зависимости от того, какие срезы (фильтры по дате, региону, категории) выбрал пользователь на дашборде!
  * Все ключевые KPI (выручка, средний чек, конверсия, процент оттока) обязаны реализовываться как меры:
    \`\`\`dax
    Total Revenue = SUM(Sales[Revenue])
    
    Total Orders = COUNTROWS(Sales)
    
    AOV = DIVIDE([Total Revenue], [Total Orders], 0)
    \`\`\`

**Король DAX: Функция \`CALCULATE\`**
\`CALCULATE\` — единственная функция в DAX, способная изменять и переопределять контекст фильтрации:
\`\`\`dax
-- Продажи строго премиального сегмента независимо от выбранного фильтра
High Value Sales = 
CALCULATE(
    [Total Revenue],
    Dim_Customers[Segment] = "VIP",
    Sales[Amount] > 1000
)

-- Продажи за тот же период прошлого года (Time Intelligence)
Sales LY = 
CALCULATE(
    [Total Revenue],
    SAMEPERIODLASTYEAR(Dim_Date[Date])
)
\`\`\`

---

#### 4. Интеграция выводов ML в продуктовые дашборды
Как визуализировать результаты моделей в Power BI для принятия решений:
1. **Скоринг оттока (Churn Scoring):** Таблица фактов пополняется предсказанной вероятностью оттока \`p_churn\` из Python-модели. Мера рассчитывает объем выручки под риском:
   \`\`\`dax
   Revenue At Risk = 
   CALCULATE(
       [Total Revenue],
       FILTER(Fact_ChurnScores, Fact_ChurnScores[p_churn] > 0.70)
   )
   \`\`\`
2. **Интерактивные срезы (What-If Parameters):** Ползунок порога классификации (threshold $\\theta \\in [0.1, 0.9]$), позволяющий бизнесу в реальном времени видеть компромисс между затратами на удержание клиентов (Precision) и предотвращенными потерями (Recall).`,
      en: `### Business Analytics: Power BI, DAX & Analytical Modeling
Translating predictive ML metrics (AUC-ROC, LogLoss) into executive business value requires BI interfaces and multidimensional modeling.

#### 1. Spreadsheets in Data Science
Rapid exploratory slice auditing using Excel/Google Sheets. Modern formulas: \`XLOOKUP\`, \`SUMIFS\`, \`UNIQUE\`, and Pivot Tables.

#### 2. Star Schema vs Flat Wide Tables
Central Fact Tables (events, measurements) linked to outer Dimension Tables (customers, calendar, products) via 1:Many relationships, optimizing columnar VertiPaq compression.

#### 3. DAX (Data Analysis Expressions)
* **Calculated Columns:** row-context evaluations stored in RAM.
* **Measures:** dynamic aggregations calculated on-the-fly inside the active user Filter Context.
* **\`CALCULATE()\`:** modifies filter contexts, powering Time Intelligence (\`SAMEPERIODLASTYEAR\`).

#### 4. Operationalizing ML Scores
Exposing model predictions as dimension-filterable fact tables allows live ROI and What-If analysis.`,
    },
    commonMistakes: [
      {
        ru: 'Создавать вычисляемые столбцы (Calculated Columns) вместо мер (Measures) для агрегаций вроде сумм и коэффициентов: вычисляемые столбцы раздувают оперативную память и не реагируют на динамические срезы дашборда.',
        en: 'Using Calculated Columns instead of Measures for business metrics; columns consume physical memory and cannot dynamically respond to dashboard slicer filter contexts.',
      },
      {
        ru: 'Строить двунаправленные связи (Bi-directional relationships) между всеми таблицами в Power BI: это приводит к неоднозначности путей фильтрации (ambiguity) и резкому падению производительности отчетов.',
        en: 'Enabling bi-directional cross-filtering everywhere, introducing relationship ambiguity and severe performance penalties in DAX engine execution.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'eda-cp-7-a',
        question: {
          ru: 'В чем ключевое преимущество Меры (Measure) перед Вычисляемым столбцом (Calculated Column) в Power BI?',
          en: 'What is the primary architectural advantage of a DAX Measure over a Calculated Column in Power BI?',
        },
        options: [
          {
            ru: 'Мера не занимает постоянную память и динамически пересчитывается на лету под фильтры и срезы, выбранные пользователем',
            en: 'Measures do not consume RAM storage and compute dynamically on-the-fly within the active user filter context',
          },
          {
            ru: 'Меры работают только с текстовыми строками',
            en: 'Measures only work on text string datatypes',
          },
          {
            ru: 'Меры вычисляются один раз при запуске компьютера',
            en: 'Measures evaluate once on machine boot',
          },
          {
            ru: 'Вычисляемые столбцы запрещены стандартами Microsoft',
            en: 'Calculated columns are forbidden by Microsoft standards',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Мера — это формула, которая рассчитывается в момент рендеринга визуализации в контексте примененных фильтров (Filter Context), не расходуя память на хранение значений.',
          en: 'Measures evaluate dynamically during visual query rendering under the current filter context, without bloating VertiPaq in-memory storage.',
        },
      },
      {
        id: 'eda-cp-7-b',
        question: {
          ru: 'Почему в системах бизнес-аналитики (Power BI, DWH) предпочтительнее использовать схему «Звезда» (Star Schema), а не одну широкую плоскую таблицу?',
          en: 'Why is a Star Schema strongly preferred over a single flat wide table in analytical BI systems?',
        },
        options: [
          {
            ru: 'Колоночный движок эффективно сжимает справочники измерений, устраняет дублирование данных и обеспечивает быстрый расчет агрегаций по связям 1:Many',
            en: 'Columnar storage engines compress normalized dimension tables efficiently, eliminate attribute redundancy, and optimize 1:Many query aggregation',
          },
          {
            ru: 'Потому что плоские таблицы не поддерживаются форматом CSV',
            en: 'Flat tables cannot be stored in CSV format',
          },
          {
            ru: 'Потому что звезды красивее отображаются на диаграмме связей',
            en: 'Because star layouts look more aesthetic in visual relationship diagrams',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Star Schema отделяет числовые факты (события) от описательных измерений, предотвращая избыточность текстовых данных и оптимизируя фильтрацию по индексам.',
          en: 'Star Schema separates quantitative transaction measures from descriptive dimensions, minimizing text duplication and maximizing query performance.',
        },
      },
      {
        id: 'eda-cp-7-c',
        question: {
          ru: 'Какая современная формула в Excel заменила устаревший `VLOOKUP` и способна искать значения влево от искомой колонки?',
          en: 'Which modern Excel formula replaced legacy `VLOOKUP` and searches leftward seamlessly?',
        },
        options: [
          { ru: '`XLOOKUP`', en: '`XLOOKUP`' },
          { ru: '`SUMIF`', en: '`SUMIF`' },
          { ru: '`CONCATENATE`', en: '`CONCATENATE`' },
          { ru: '`TRANSPOSE`', en: '`TRANSPOSE`' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Функция `XLOOKUP` не требует указания номера столбца, ищет в любом направлении (влево и вправо), по умолчанию использует точное совпадение и не ломается при вставке новых колонок.',
          en: '`XLOOKUP` searches in any direction without column index numbers, defaults to exact match, and is resilient to column insertion.',
        },
      },
    ],
  },
];

export const dataWranglingEdaCards: Card[] = [
  {
    id: 'eda-card-1',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-1-foundations',
    type: 'flip',
    front: {
      ru: 'Что такое интерквартильный размах (IQR) и как по нему выявляются выбросы?',
      en: 'What is the Interquartile Range (IQR) and how does it detect outliers?',
    },
    back: {
      ru: '$IQR = Q_3 - Q_1$. Значения за пределами $[Q_1 - 1.5 \\cdot IQR, \\; Q_3 + 1.5 \\cdot IQR]$ считаются выбросами (метод Тьюки).',
      en: '$IQR = Q_3 - Q_1$. Values outside $[Q_1 - 1.5 \\times IQR, \\; Q_3 + 1.5 \\times IQR]$ are flagged as outliers (Tukey method).',
    },
    tags: ['eda', 'statistics'],
  },
  {
    id: 'eda-card-2',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-2-preprocessing',
    type: 'cloze',
    clozeText: {
      ru: 'Чтобы избежать утечки данных (Data Leakage), метод `scaler.fit()` вызывается строго на {{c1::обучающей (train)}} выборке.',
      en: 'To prevent data leakage, `scaler.fit()` must be executed strictly on the {{c1::training (train)}} split.',
    },
    answer: {
      ru: 'обучающей (train)',
      en: 'training (train)',
    },
    tags: ['preprocessing', 'leakage'],
  },
  {
    id: 'eda-card-3',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-3-pandas-idioms',
    type: 'flip',
    front: {
      ru: 'В чем разница между `.agg()` и `.transform()` при группировке в Pandas?',
      en: 'What is the difference between `.agg()` and `.transform()` in Pandas groupby?',
    },
    back: {
      ru: '`.agg()` схлопывает каждую группу в одну строку, а `.transform()` возвращает массив той же длины, что и исходный датафрейм, дублируя агрегат на все строки группы.',
      en: '`.agg()` reduces groups into single summary rows, whereas `.transform()` broadcasts the calculated aggregate back across all original rows.',
    },
    tags: ['pandas', 'groupby'],
  },
  {
    id: 'eda-card-4',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-4-polars-speed',
    type: 'cloze',
    clozeText: {
      ru: 'Библиотека Polars написана на языке {{c1::Rust}} и использует многопоточный колоночный формат {{c2::Apache Arrow}}.',
      en: 'The Polars library is written in {{c1::Rust}} and leverages the {{c2::Apache Arrow}} columnar format.',
    },
    answer: {
      ru: 'Rust',
      en: 'Rust',
    },
    tags: ['polars', 'rust'],
  },
  {
    id: 'eda-card-5',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-4-polars-speed',
    type: 'flip',
    front: {
      ru: 'Что такое Predicate Pushdown (проталкивание предикатов) в Polars?',
      en: 'What is Predicate Pushdown in Polars query optimization?',
    },
    back: {
      ru: 'Это оптимизация, при которой условия фильтрации (`filter`) опускаются на уровень чтения файлов с диска (Parquet), минуя загрузку ненужных строк в оперативную память.',
      en: 'An engine optimization where filtering predicates are evaluated at the file scanning layer, avoiding loading unnecessary rows into memory.',
    },
    tags: ['polars', 'optimization'],
  },
  {
    id: 'eda-card-6',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-5-feature-engineering',
    type: 'flip',
    front: {
      ru: 'В чем ключевое преимущество Target Encoding перед One-Hot Encoding для категорий с высокой мощностью (High Cardinality)?',
      en: 'What is the primary advantage of Target Encoding over One-Hot for high-cardinality categories?',
    },
    back: {
      ru: 'Target Encoding сжимает категорию в ровно один информативный числовой столбец (средний таргет со сглаживанием), не раздувая размерность признакового пространства на сотни разреженных колонок.',
      en: 'Target Encoding encodes categories into a single scalar column of smoothed target expectation, preventing sparse dimensional explosion.',
    },
    tags: ['target-encoding', 'feature-engineering'],
  },
  {
    id: 'eda-card-7',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-5-feature-engineering',
    type: 'cloze',
    clozeText: {
      ru: 'При оверсэмплинге редкого класса алгоритм SMOTE должен применяться строго на {{c1::обучающей (train)}} выборке, чтобы избежать утечки данных.',
      en: 'During minority class balancing, SMOTE must be performed strictly on the {{c1::training (train)}} split to avoid data leakage.',
    },
    answer: {
      ru: 'обучающей (train)',
      en: 'training (train)',
    },
    tags: ['smote', 'imbalance'],
  },
  {
    id: 'eda-card-8',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-6-sql-analytics',
    type: 'flip',
    front: {
      ru: 'В чем разница между `ROW_NUMBER()`, `RANK()` и `DENSE_RANK()` в SQL?',
      en: 'What is the distinction between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` in SQL?',
    },
    back: {
      ru: 'При одинаковых значениях:\n• ROW_NUMBER() дает строго уникальные номера (1, 2, 3, 4)\n• RANK() дает одинаковый ранг с пропуском последующих (1, 2, 2, 4)\n• DENSE_RANK() дает одинаковый ранг без пропуска номеров (1, 2, 2, 3)',
      en: 'When values tie:\n• ROW_NUMBER assigns distinct consecutive integers (1, 2, 3, 4)\n• RANK gives tied rows identical ranks and skips numbers (1, 2, 2, 4)\n• DENSE_RANK assigns identical ranks without gaps (1, 2, 2, 3)',
    },
    tags: ['sql', 'window-functions', 'analytics'],
  },
  {
    id: 'eda-card-9',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-7-bi-excel-analytics',
    type: 'flip',
    front: {
      ru: 'Из каких двух типов таблиц состоит архитектура хранилища «Звезда» (Star Schema)?',
      en: 'Which two types of tables define the Star Schema architecture?',
    },
    back: {
      ru: '1. Таблица фактов (Fact Table) в центре — содержит числовые события, транзакции и внешние ключи (миллионы строк).\n2. Таблицы измерений (Dimension Tables) вокруг — справочники сущностей (клиенты, товары, даты) со связями 1 : Many к фактам.',
      en: '1. Central Fact Table: quantitative events, foreign keys, transaction logs.\n2. Dimension Tables: descriptive lookup entities (customers, dates, products) linked via 1:Many relationships.',
    },
    tags: ['bi', 'star-schema', 'power-bi', 'dwh'],
  },
  {
    id: 'eda-card-10',
    moduleId: 'data-wrangling-eda',
    lessonId: 'eda-7-bi-excel-analytics',
    type: 'cloze',
    clozeText: {
      ru: 'В Power BI ключевые бизнес-метрики (выручка, конверсия) реализуются как {{c1::Меры (Measures)}}, так как они вычисляются динамически на лету в контексте фильтрации и не занимают память.',
      en: 'In Power BI, aggregated business KPIs are implemented as {{c1::Measures}}, calculating dynamically on-the-fly under user filter contexts.',
    },
    answer: {
      ru: 'Меры (Measures)',
      en: 'Measures',
    },
    tags: ['power-bi', 'dax', 'measures'],
  },
];

export const dataWranglingEdaQuiz: QuizQuestion[] = [
  {
    id: 'eda-q-1',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Какой метод Pandas возвращает количество строк и столбцов в виде кортежа (rows, cols)?',
      en: 'Which Pandas attribute returns dataset dimensions as a (rows, cols) tuple?',
    },
    options: [
      { ru: 'df.shape', en: 'df.shape' },
      { ru: 'df.size', en: 'df.size' },
      { ru: 'df.len()', en: 'df.len()' },
      { ru: 'df.dimensions', en: 'df.dimensions' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Свойство `df.shape` возвращает кортеж из двух чисел: число наблюдений и число признаков.',
      en: '`df.shape` returns a tuple representing the dimensionality of the DataFrame.',
    },
    tag: 'pandas',
  },
  {
    id: 'eda-q-2',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какой скейлер scikit-learn наименее чувствителен к наличию тяжелых выбросов в данных?',
      en: 'Which scikit-learn feature scaler is most robust to extreme dataset outliers?',
    },
    options: [
      { ru: 'RobustScaler (на основе медианы и IQR)', en: 'RobustScaler (median & IQR)' },
      { ru: 'StandardScaler', en: 'StandardScaler' },
      { ru: 'MinMaxScaler', en: 'MinMaxScaler' },
      { ru: 'Normalizer', en: 'Normalizer' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: '`RobustScaler` центрирует данные по медиане и масштабирует по межквартильному размаху (IQR), поэтому выбросы не влияют на расчет статистик.',
      en: '`RobustScaler` removes the median and scales according to the IQR, isolating estimators from outlier distortion.',
    },
    tag: 'preprocessing',
  },
  {
    id: 'eda-q-3',
    type: 'code_fill',
    difficulty: 'medium',
    question: {
      ru: 'Заполните пропуск для ленивого сканирования Parquet-файла в Polars:',
      en: 'Complete the snippet to initialize a lazy query plan over a Parquet file in Polars:',
    },
    codeSnippet: `import polars as pl
q = (
    pl.____("data.parquet")
      .filter(pl.col("active") == True)
)
df = q.collect()`,
    options: ['scan_parquet', 'read_parquet', 'open_parquet', 'load_parquet'],
    correctAnswer: 0,
    explanation: {
      ru: '`pl.scan_parquet()` возвращает `LazyFrame` без немедленной загрузки данных в память, позволяя применить оптимизации предикатов.',
      en: '`pl.scan_parquet()` initializes a LazyFrame without eagerly reading data into RAM.',
    },
    tag: 'polars',
    language: 'python',
  },
  {
    id: 'eda-q-4',
    type: 'code_fill',
    difficulty: 'easy',
    question: {
      ru: 'Вставьте метод Pandas для заполнения пропущенных значений константой или медианой:',
      en: 'Insert the Pandas method used to replace missing values (NaN) with specified values:',
    },
    codeSnippet: `df["salary"] = df["salary"].____(df["salary"].median())`,
    options: ['fillna', 'replace_na', 'impute', 'dropna'],
    correctAnswer: 0,
    explanation: {
      ru: '`df.fillna()` заменяет пропущенные значения (NaN) на переданное значение.',
      en: '`df.fillna()` imputes null values with the provided argument.',
    },
    tag: 'pandas',
    language: 'python',
  },
  {
    id: 'eda-q-5',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Как алгоритм SMOTE генерирует новые синтетические объекты миноритарного класса?',
      en: 'How does the SMOTE algorithm synthesize new minority class observations?',
    },
    options: [
      {
        ru: 'Выбирает случайную точку на отрезке между объектом и одним из его k ближайших соседей того же класса',
        en: 'Selects a random point along the line segment connecting an instance to one of its k-nearest minority neighbors',
      },
      {
        ru: 'Точно дублирует существующие строки в памяти',
        en: 'Creates exact duplicated clones of existing rows',
      },
      {
        ru: 'Обучает нейросеть GAN с миллионом параметров',
        en: 'Trains a massive generative adversarial network (GAN)',
      },
      {
        ru: 'Удаляет объекты мажоритарного класса',
        en: 'Deletes observations from the majority class',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'SMOTE берет объект x_i, находит его соседа x_zi того же класса и создает новую точку: x_new = x_i + λ * (x_zi - x_i), где λ ~ U(0, 1).',
      en: 'SMOTE generates points by convex combination: x_new = x_i + λ * (x_zi - x_i), interpolating between real neighbors.',
    },
    tag: 'smote',
  },
  {
    id: 'eda-q-6',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Какую проблему решает метод Out-Of-Fold (OOF) при вычислении Target Encoding?',
      en: 'What fundamental risk is mitigated by using Out-Of-Fold (OOF) target encoding?',
    },
    options: [
      {
        ru: 'Target Leakage (утечку целевой переменной) и переобучение модели на редких категориях',
        en: 'Target leakage and empirical overfitting on rare categorical levels',
      },
      {
        ru: 'Необходимость масштабирования числовых признаков',
        en: 'The requirement to scale numeric features',
      },
      {
        ru: 'Нехватку оперативной памяти при чтении CSV',
        en: 'Out-of-memory errors during CSV ingestion',
      },
      {
        ru: 'Удаление выбросов из выборки',
        en: 'Outlier deletion from the dataset',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'При прямом вычислении Target Encoding объект получает кодировку со своим же таргетом y_i, что приводит к утечке. OOF-схема исключает текущий фолд из подсчета статистик.',
      en: 'Computing mean targets directly encodes each row with its own response. OOF strictly segregates target statistics calculation from inference folds.',
    },
    tag: 'target-encoding',
  },
  {
    id: 'eda-q-7',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Почему в SQL-запросе нельзя фильтровать строки по оконной функции напрямую в блоке `WHERE` (например, `WHERE ROW_NUMBER() OVER (...) = 1`)?',
      en: 'Why is it invalid to filter directly on a window function in the `WHERE` clause in SQL?',
    },
    options: [
      {
        ru: 'Блок `WHERE` логически выполняется до вычисления выражений `SELECT` и оконных функций `WINDOW`',
        en: 'The `WHERE` clause evaluates logically before `SELECT` and `WINDOW` projection stages',
      },
      {
        ru: 'Оконные функции возвращают логический тип данных boolean',
        en: 'Window functions return boolean data types',
      },
      {
        ru: 'В SQL запрещено использовать оператор равенства = с функциями',
        en: 'The equality operator cannot be used with functions in SQL',
      },
      {
        ru: 'Потому что СУБД всегда требует использования оператора HAVING',
        en: 'Because RDBMS engines require the HAVING operator instead',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Логический порядок выполнения: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> WINDOW -> ORDER BY. Оконные функции вычисляются после фильтрации строк WHERE, поэтому для фильтрации по ним требуется обертка в CTE или подзапрос.',
      en: 'Logical processing stages evaluate WHERE before WINDOW functions; filtering on window outputs requires CTE encapsulation or the QUALIFY clause.',
    },
    tag: 'sql',
  },
  {
    id: 'eda-q-8',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какое отношение связи (Cardinality) является стандартным между таблицей измерений (Dimension) и таблицей фактов (Fact) в схеме «Звезда»?',
      en: 'What standard cardinality relationship connects a Dimension table to a Fact table in a Star Schema?',
    },
    options: [
      { ru: '1 : Many (Один-ко-многим)', en: '1 : Many (One-to-Many)' },
      { ru: 'Many : Many (Многие-ко-многим)', en: 'Many : Many (Many-to-Many)' },
      { ru: '1 : 1 (Один-к-одному)', en: '1 : 1 (One-to-One)' },
      { ru: 'Иерархическая связь без внешних ключей', en: 'Keyless hierarchical link' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'В справочнике измерений каждый объект уникален (сторона 1, первичный ключ), а в таблице фактов одно и то же измерение может встречаться множество раз в транзакциях (сторона Many, внешний ключ).',
      en: 'Dimensions contain unique entities (1-side primary keys); Fact tables record repeated transaction instances referencing them (Many-side foreign keys).',
    },
    tag: 'bi-star-schema',
  },
  {
    id: 'eda-q-9',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Какая функция в языке DAX (Power BI) является ключевой для изменения и переопределения контекста фильтрации (Filter Context)?',
      en: 'Which fundamental DAX function in Power BI modifies and overrides the visual Filter Context?',
    },
    options: [
      { ru: 'CALCULATE()', en: 'CALCULATE()' },
      { ru: 'SUMX()', en: 'SUMX()' },
      { ru: 'RELATED()', en: 'RELATED()' },
      { ru: 'LOOKUPVALUE()', en: 'LOOKUPVALUE()' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: '`CALCULATE(Expression, Filter1, Filter2, ...)` вычисляет выражение в новом, измененном контексте фильтрации, переопределяя фильтры с визуализаций и срезов дашборда.',
      en: '`CALCULATE` evaluates expressions under modified filter contexts, overriding active report slicer conditions.',
    },
    tag: 'power-bi-dax',
  },
];
