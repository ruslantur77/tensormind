import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const timeSeriesMeta: ModuleMeta = {
  id: 'time-series-forecasting',
  title: {
    ru: 'Временные ряды и прогнозирование',
    en: 'Time Series Analysis & Forecasting',
  },
  description: {
    ru: 'Промышленное прогнозирование спроса, трафика и финансовых показателей: стационарность, тест Дики-Фуллера (ADF), модели ARIMA и SARIMAX с экзогенными факторами, библиотека Prophet, валидация TimeSeriesSplit без заглядывания в будущее, лаги и градиентный бустинг (LightGBM/CatBoost), метрики WAPE и MASE.',
    en: 'Production demand, web traffic, and financial forecasting: stationarity, ADF testing, ARIMA/SARIMAX with exogenous regressors, open-source Prophet library, leak-free TimeSeriesSplit validation, lag feature engineering, gradient boosting (LightGBM/CatBoost), WAPE and MASE metrics.',
  },
  order: 18,
  icon: 'time-series-forecasting',
  estimatedMinutes: 95,
  isPlaceholder: false,
};

export const timeSeriesLessons: Lesson[] = [
  {
    id: 'ts-1-stationarity-decomposition',
    moduleId: 'time-series-forecasting',
    title: {
      ru: 'Структура временного ряда, стационарность и тест Дики-Фуллера (ADF)',
      en: 'Time Series Structure, Stationarity & Augmented Dickey-Fuller (ADF) Test',
    },
    order: 1,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: `### Анатомия временного ряда и декомпозиция

Временной ряд — это упорядоченная последовательность наблюдений $y_t$, зафиксированных в последовательные моменты времени $t \\in \\{1, 2, \\dots, T\\}$.

Классическая модель декомпозиции раскладывает ряд на 3 базовые компоненты:
1. **Тренд ($T_t$, Trend):** долгосрочное монотонное или гладкое направление изменения среднего уровня.
2. **Сезонность ($S_t$, Seasonality):** строго периодические колебания фиксированной длины (суточные, недельные, годовые).
3. **Остаток ($R_t$ или $\\epsilon_t$, Residual / White Noise):** стохастический шум и нерегулярные флуктуации.

#### Аддитивная vs Мультипликативная модель
- **Аддитивная:** $y_t = T_t + S_t + R_t$ — применяется, когда амплитуда сезонных колебаний **постоянна** и не зависит от текущего уровня тренда.
- **Мультипликативная:** $y_t = T_t \\times S_t \\times R_t$ — применяется, когда сезонные всплески пропорциональны уровню ряда (например, при росте продаж в 10 раз праздничный пик тоже вырастает в 10 раз).
- *Практический лайфхак:* логарифмирование мультипликативного ряда $\\log(y_t) = \\log(T_t) + \\log(S_t) + \\log(R_t)$ превращает его в аддитивный!

---

### Понятие стационарности (Stationarity)

Большинство классических математических моделей (ARIMA, экспоненциальное сглаживание) предполагают **стационарность ряда в широком смысле (слабая стационарность / ковариационная стационарность)**:
1. **Постоянное среднее:** $\\mathbb{E}[y_t] = \\mu = \\text{const}$ для всех $t$ (нет тренда).
2. **Постоянная дисперсия:** $\\text{Var}(y_t) = \\sigma^2 = \\text{const}$ (гомоскедастичность).
3. **Автоковариация зависит только от временного лага $k$:** $\\text{Cov}(y_t, y_{t-k}) = \\gamma(k)$, а не от абсолютной точки отсчета $t$.

Если модель обучается на нестационарном ряде, возникает феномен **ложной корреляции (spurious regression)** — две совершенно независимые величины с трендом показывают $R^2 > 0.95$.

---

### Проверка стационарности: Тест Дики-Фуллера (ADF)

**Augmented Dickey-Fuller (ADF) Test** проверяет наличие единичного корня (Unit Root) в авторегрессионной модели:
$$\\Delta y_t = \\alpha + \\beta t + \\gamma y_{t-1} + \\sum_{i=1}^p \\delta_i \\Delta y_{t-i} + \\epsilon_t$$

- **Нулевая гипотеза ($H_0$):** $\\gamma = 0$ — ряд имеет единичный корень, процесс **нестационарен**.
- **Альтернативная гипотеза ($H_1$):** $\\gamma < 0$ — процесс **стационарен**.
- **Правило принятия решений:** если **p-value < 0.05** (или тестовая статистика меньше критического порога), мы отвергаем $H_0$ и заключаем, что ряд стационарен.

\`\`\`python
from statsmodels.tsa.stattools import adfuller

result = adfuller(df['sales'])
print(f"ADF Statistic: {result[0]:.4f}")
print(f"p-value: {result[1]:.4f}")

if result[1] < 0.05:
    print("Ряд стационарен (H0 отвергнута)")
else:
    print("Ряд нестационарен -> требуется дифференцирование")
\`\`\`

---

### Приведение к стационарности

1. **Дифференцирование первого порядка (First Differencing):**
   $$\\Delta y_t = y_t - y_{t-1}$$
   Устраняет линейный тренд. Число последовательных дифференцирований $d$, требуемых для достижения стационарности, называется порядком интегрирования $I(d)$.
2. **Сезонное дифференцирование:**
   $$\\Delta_s y_t = y_t - y_{t-s}$$
   (например, $s = 7$ для дней недели или $s = 12$ для месяцев) — устраняет сезонные тренды.
3. **Стабилизация дисперсии:** логарифмическое преобразование $\\ln(y_t)$ или преобразование Бокса-Кокса (Box-Cox).

---

### Анализ автокорреляций: ACF и PACF

- **ACF (Autocorrelation Function):** измеряет прямую и косвенную корреляцию между $y_t$ и $y_{t-k}$.
- **PACF (Partial Autocorrelation Function):** измеряет *чистую* корреляцию между $y_t$ и $y_{t-k}$, устраняя промежуточное влияние лагов $y_{t-1}, \\dots, y_{t-k+1}$.
- Коррелограммы ACF и PACF — ключевой инструмент для определения порядков $p$ и $q$ моделей ARMA.`,
    commonMistakes: [
      'Попытка обучить модель ARIMA на нестационарном ряде с ярким восходящим трендом без предварительного дифференцирования d=1: модель выдаст расходящийся прогноз с взрывающимися доверительными интервалами.',
      'Путаница с интерпретацией ADF теста: p-value > 0.05 означает НЕстационарность (H0 не отвергается), в отличие от некоторых других тестов.',
      'Игнорирование гетероскедастичности: если дисперсия ряда экспоненциально растет со временем, одно лишь дифференцирование не поможет, необходимо предварительное логарифмирование.',
    ],
    checkpointQuiz: [
      {
        id: 'ts-cp-1-1',
        question: 'Какое условие в тесте Дики-Фуллера (ADF) позволяет считать временной ряд стационарным?',
        options: [
          'Тестовая статистика строго равна нулю',
          'Значение p-value < 0.05 (нулевая гипотеза о наличии единичного корня отвергается)',
          'Значение p-value > 0.95 (нулевая гипотеза подтверждается)',
          'Дисперсия ряда превышает математическое ожидание в 2 раза',
        ],
        correctAnswer: 1,
        explanation: 'В тесте ADF нулевая гипотеза H0 утверждает, что ряд нестационарен. Значение p-value < 0.05 дает статистическое основание отвергнуть H0 в пользу стационарности.',
      },
      {
        id: 'ts-cp-1-2',
        question: 'Когда для декомпозиции временного ряда необходимо использовать мультипликативную модель вместо аддитивной?',
        options: [
          'Когда амплитуда сезонных колебаний увеличивается пропорционально росту общего уровня тренда',
          'Когда ряд не содержит пропущенных значений',
          'Когда количество наблюдений превышает 1 миллион строк',
          'Когда ряд измеряется строго в градусах Цельсия',
        ],
        correctAnswer: 0,
        explanation: 'Мультипликативная модель Y = T * S * R описывает процессы, где сезонные всплески масштабируются вместе с ростом тренда.',
      },
      {
        id: 'ts-cp-1-3',
        question: 'Что измеряет частичная автокорреляционная функция (PACF) на лаге k?',
        options: [
          'Общую корреляцию между y(t) и всеми предыдущими значениями ряда скопом',
          'Стандартное отклонение остатков после линейной регрессии',
          'Чистую корреляцию между y(t) и y(t-k) после математического исключения влияния всех промежуточных лагов от 1 до k-1',
          'Вероятность появления аномальных выбросов в будущем',
        ],
        correctAnswer: 2,
        explanation: 'PACF изолирует непосредственную прямую связь между y(t) и y(t-k), очищая ее от линейного воздействия промежуточных точек во времени.',
      },
    ],
  },
  {
    id: 'ts-2-arima-sarimax',
    moduleId: 'time-series-forecasting',
    title: {
      ru: 'Классическое статистическое моделирование: ARIMA, SARIMA и экзогенные факторы (SARIMAX)',
      en: 'Classical Statistical Modeling: ARIMA, Seasonal SARIMA & Exogenous Regressors (SARIMAX)',
    },
    order: 2,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Семейство моделей AR, MA, ARMA и ARIMA

Классическая эконометрика временных рядов опирается на линейные комбинации прошлых значений ряда и прошлых ошибок белого шума.

#### 1. Модель авторегрессии $AR(p)$
Текущее значение ряда выражается через свои $p$ прошлых значений:
$$y_t = c + \\sum_{i=1}^p \\phi_i y_{t-i} + \\epsilon_t, \\quad \\epsilon_t \\sim \\mathcal{N}(0, \\sigma^2)$$
- На графике PACF порядок $p$ определяется номером последнего лага, выходящего за пределы доверительного интервала (после чего PACF резко обрывается в ноль).

#### 2. Модель скользящего среднего $MA(q)$
Текущее значение выражается через текущую и $q$ прошлых ошибок прогноза:
$$y_t = \\mu + \\epsilon_t + \\sum_{j=1}^q \\theta_j \\epsilon_{t-j}$$
- На графике ACF порядок $q$ определяется номером последнего значимого лага (после чего ACF обрывается в ноль).

#### 3. Модель $ARIMA(p, d, q)$
Объединяет авторегрессию, скользящее среднее и интегрирование:
- $p$: порядок авторегрессии (AR).
- $d$: порядок разностей (дифференцирований для достижения стационарности).
- $q$: порядок скользящего среднего (MA).

---

### Сезонная модель $SARIMA(p, d, q)(P, D, Q)_s$

Если ряд демонстрирует регулярный сезонный цикл длины $s$ (например, $s = 7$ для дней недели при дневных данных или $s = 12$ для месяцев при помесячных данных), базовая ARIMA не улавливает далекие корреляции.

В модель добавляются сезонные операторы порядка $P, D, Q$:
- $P$: количество сезонных авторегрессионных лагов (например, $y_{t-s}, y_{t-2s}$).
- $D$: порядок сезонного дифференцирования $\\Delta_s y_t = y_t - y_{t-s}$.
- $Q$: количество сезонных лагов скользящего среднего.
- $s$: сезонный период.

---

### Модель $SARIMAX$: учет внешних факторов (Exogenous Features)

В реальном бизнесе (e-commerce, ритейл, энергетика) временной ряд зависит не только от собственной предыстории, но и от внешних сигналов:
$$y_t = \\beta_1 X_{1, t} + \\beta_2 X_{2, t} + \\dots + \\beta_k X_{k, t} + \\eta_t$$
где $\\eta_t$ моделируется как процесс $SARIMA(p, d, q)(P, D, Q)_s$.

**Примеры экзогенных переменных ($X_t$):**
- Запланированные скидки, промо-акции и маркетинговые кампании.
- Праздничные и предпраздничные дни (бинарные флаги).
- Прогноз температуры воздуха (критично для энергопотребления и продажи напитков).
- Цены конкурентов.

*Критическое требование:* для построения прогноза на горизонт $t+1, \\dots, t+H$ значения экзогенных признаков $X_{t+h}$ **должны быть известны заранее** на весь период прогноза!

---

### Автоматический подбор гиперпараметров: AIC, BIC и auto_arima

Подбор параметров $(p, d, q) \\times (P, D, Q)_s$ вручную по коррелограммам трудоемок. В продакшене используют минимизацию информационных критериев:
- **AIC (Akaike Information Criterion):** $\\text{AIC} = 2k - 2\\ln(L)$ (штрафует за число параметров $k$, балансируя точность подгонки $L$).
- **BIC (Bayesian Information Criterion):** $\\text{BIC} = k \\ln(n) - 2\\ln(L)$ (сильнее штрафует за избыточную сложность при больших выборках $n$).

\`\`\`python
from pmdarima import auto_arima

# Пошаговый поиск оптимальной конфигурации по AIC
model = auto_arima(
    train_series,
    exogenous=train_exog,
    seasonal=True,
    m=7,  # недельная сезонность
    stepwise=True,
    suppress_warnings=True,
    error_action="ignore"
)

print(model.summary())
forecast = model.predict(n_periods=14, exogenous=future_exog)
\`\`\``,
    commonMistakes: [
      'Попытка использовать экзогенные признаки в SARIMAX, которые сами неизвестны в будущем (например, курс доллара или реальный объем трафика без прогноза).',
      'Завышение порядков p и q (например, ARIMA(10, 1, 10)): приводит к катастрофическому переобучению, мультиколлинеарности параметров и нестабильности корней характеристического уравнения.',
      'Забывание о проверке остатков модели: остатки обученной ARIMA обязаны вести себя как белый шум (отсутствие автокорреляции по Ljung-Box тесту и нормальное распределение).',
    ],
    checkpointQuiz: [
      {
        id: 'ts-cp-2-1',
        question: 'Что означает буква "X" в аббревиатуре модели SARIMAX?',
        options: [
          'Поддержку экстремального квантования весов',
          'Экзогенные (внешние) признаки (Exogenous variables), влияющие на целевой ряд',
          'Экспоненциальное сглаживание рядов Хольта-Винтерса',
          'Ограничение длины ряда не более 10 000 точек',
        ],
        correctAnswer: 1,
        explanation: 'Буква X указывает на Exogenous regressors — внешние ковариаты (промо-акции, цены, праздники), используемые вместе со структурой ряда.',
      },
      {
        id: 'ts-cp-2-2',
        question: 'Какое главное требование предъявляется к экзогенным признакам при использовании SARIMAX для прогнозирования на неделю вперед?',
        options: [
          'Они должны быть строго бинарными 0 или 1',
          'Они не должны коррелировать с целевой переменной',
          'Их значения должны быть заранее известны на весь будущий горизонт прогнозирования',
          'Они обязаны быть дифференцированы не менее 2 раз',
        ],
        correctAnswer: 2,
        explanation: 'Поскольку модель вычисляет прогноз как сумму линейной комбинации экзогенных фичей и SARIMA-остатка, значения признаков X на шаги t+1..t+H обязаны быть доступны во время инференса.',
      },
      {
        id: 'ts-cp-2-3',
        question: 'По какому критерию в библиотеке pmdarima (auto_arima) по умолчанию выбирается наилучшая конфигурация (p, d, q)?',
        options: [
          'По максимальной вычислительной скорости инференса',
          'По максимальному значению R^2 на обучающей выборке',
          'По минимальному значению информационного критерия Акаике (AIC / AICc)',
          'По абсолютному числу параметров модели',
        ],
        correctAnswer: 2,
        explanation: 'Информационный критерий Акаике (AIC) находит баланс между качеством правдоподобия модели и штрафом за избыточное число оцениваемых параметров.',
      },
    ],
  },
  {
    id: 'ts-3-prophet-neural',
    moduleId: 'time-series-forecasting',
    title: {
      ru: 'Библиотека Prophet и нейросетевые архитектуры для временных рядов',
      en: 'Prophet Library & Modern Neural Time Series Architectures',
    },
    order: 3,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Библиотека Prophet: промышленный стандарт для бизнес-метрик

Популярный open-source фреймворк **Prophet** (Taylor & Letham, 2017) специально спроектирован для решения прикладных бизнес-задач прогнозирования (DAU, заказы, выручка, логистический спрос).

#### Архитектура обобщенной аддитивной модели (GAM)
$$y(t) = g(t) + s(t) + h(t) + \\epsilon_t$$

1. **Нелинейный тренд $g(t)$:**
   - Кусочно-линейная (Piecewise linear) или логистическая модель роста с насыщением (Cap / Capacity).
   - Автоматический выбор точек излома тренда (**changepoints**). По умолчанию расставляется сетка потенциальных точек (25 штук в первых $80\\%$ истории), а регуляризация с априорным распределением Лапласа (параметр \`changepoint_prior_scale\`) обнуляет незначительные изломы, оставляя только ключевые смены тренда.
2. **Сезонность через ряды Фурье $s(t)$:**
   Вместо громоздких dummy-переменных Prophet аппроксимирует периодические циклы суммами гармоник:
   $$s(t) = \\sum_{n=1}^N \\left( a_n \\cos\\left(\\frac{2\\pi n t}{P}\\right) + b_n \\sin\\left(\\frac{2\\pi n t}{P}\\right) \\right)$$
   - Годовая сезонность: $P = 365.25$, порядок $N = 10$.
   - Недельная сезонность: $P = 7$, порядок $N = 3$.
3. **Эффект праздников и нерегулярных событий $h(t)$:**
   Позволяет задать списки праздников (Новый год, Черная пятница, Киберпонедельник) с окном влияния до и после (\`lower_window\`, \`upper_window\`).

#### Преимущества Prophet в реальном проде:
- **Устойчивость к пропускам и смене частоты:** не требует идеальной непрерывности данных без пробелов.
- **Интерпретируемость:** встроенная декомпозиция на тренд, дни недели, праздники и годовой цикл в одну строчку \`model.plot_components(forecast)\`.
- **Байесовские доверительные интервалы:** расчет квантилей неопределенности через MAP или MCMC выборку.

\`\`\`python
from prophet import Prophet
import pandas as pd

# Prophet строго требует колонки 'ds' (дата) и 'y' (значение)
df = df.rename(columns={'timestamp': 'ds', 'revenue': 'y'})

model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    changepoint_prior_scale=0.05,
    seasonality_mode='multiplicative'
)
model.add_country_holidays(country_name='RU')
model.fit(df)

future = model.make_future_dataframe(periods=30)
forecast = model.predict(future)
\`\`\`

---

### Обзор современных нейросетевых архитектур для рядов

Когда объема данных становится много (десятки тысяч связанных временных рядов в ритейле или IoT), классические статистические подходы уступают нейросетям:

1. **N-BEATS (Oreshkin et al., 2019):**
   - Глубокая архитектура без рекуррентности и без внимания!
   - Построена на блоках с прямыми и обратными связями (Backward & Forward residual links).
   - Внутренние блоки генерируют интерпретируемые базисы тренда (полиномы) и сезонности (гармоники Фурье).
2. **PatchTST (Nie et al., 2023):**
   - Разбивает одномерный временной ряд на небольшие суб-векторы (патчи, например по 16 временных шагов) и подает их как токены в стандартный Transformer Encoder.
   - Механизм Channel-Independence (каждый ряд обрабатывается независимо общими весами) снижает переобучение.
3. **Temporal Fusion Transformer (TFT, Lim et al., 2021):**
   - SOTA-архитектура для многомерных временных рядов с десятками статичных признаков (категория товара, магазин), известных будущих входов (акции, праздники) и наблюдаемых прошлых сигналов.
   - Использует Variable Selection Networks для фильтрации нерелевантных признаков и самовнимание для моделирования долгосрочных зависимостей.`,
    commonMistakes: [
      'Подача в Prophet датафрейма с произвольными названиями колонок: библиотека жестко требует поля с именами `ds` (datetime) и `y` (numeric).',
      'Чрезмерное увеличение `changepoint_prior_scale` в Prophet (например, 0.8 вместо 0.05): тренд начинает глотать шум и случайные разовые колебания, вызывая дикое переобучение.',
      'Использование тяжелых трансформеров (TFT / PatchTST) на маленьких датасетах с одной сотней точек: классическая модель ARIMA или Prophet покажет существенно более стабильный результат.',
    ],
    checkpointQuiz: [
      {
        id: 'ts-cp-3-1',
        question: 'Как open-source библиотека Prophet моделирует периодическую сезонность (недельную, годовую)?',
        options: [
          'Через дерево решений с 500 листьями',
          'С помощью усеченных тригонометрических рядов Фурье (суммы синусов и косинусов)',
          'Через сверточные фильтры размером 3x3',
          'Путем удаления сезонных точек из датасета',
        ],
        correctAnswer: 1,
        explanation: 'Prophet использует гармонический анализ Фурье: периодические колебания аппроксимируются взвешенной суммой sin(2*pi*n*t / P) и cos(2*pi*n*t / P).',
      },
      {
        id: 'ts-cp-3-2',
        question: 'За что отвечает параметр changepoint_prior_scale в модели Prophet?',
        options: [
          'За скорость сетевого соединения при обучении модели',
          'За гибкость тренда: регуляризацию количества и величины скачков наклона в точках излома',
          'За процент пропущенных значений в обучающей выборке',
          'За выбор языка интерфейса графиков',
        ],
        correctAnswer: 1,
        explanation: 'Параметр changepoint_prior_scale задает дисперсию априорного распределения Лапласа для наклонов тренда. Чем он больше, тем более гибким (и склонным к оверфиттингу) становится тренд.',
      },
      {
        id: 'ts-cp-3-3',
        question: 'В чем заключается ключевая идея архитектуры PatchTST для анализа временных рядов?',
        options: [
          'Разбиение непрерывного одномерного ряда на последовательные перекрывающиеся патчи (векторы шагов) и подача их как токенов в Transformer',
          'Полный отказ от слоев внимания в пользу k-средних',
          'Преобразование временного ряда в аудиофайл формата MP3',
          'Обучение модели только на выходных днях',
        ],
        correctAnswer: 0,
        explanation: 'PatchTST группирует близкие временные точки в патчи-токены, что резко сокращает длину последовательности для механизма внимания и сохраняет локальную семантику окрестностей.',
      },
    ],
  },
  {
    id: 'ts-4-validation-feature-engineering-gbdt',
    moduleId: 'time-series-forecasting',
    title: {
      ru: 'Валидация (TimeSeriesSplit), Feature Engineering лагов и градиентный бустинг',
      en: 'Validation (TimeSeriesSplit), Lag Feature Engineering & Gradient Boosting',
    },
    order: 4,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: `### Почему стандартный k-fold CV — фатальная ошибка во временных рядах

В классическом табличном ML строки считаются независимыми и одинаково распределенными (i.i.d.). Данные можно перемешивать случайно:
\`\`\`python
# КАТАСТРОФИЧЕСКАЯ ОШИБКА ДЛЯ ВРЕМЕННЫХ РЯДОВ!
from sklearn.model_selection import KFold
kf = KFold(n_splits=5, shuffle=True)  # УТЕЧКА ИЗ БУДУЩЕГО (LOOKAHEAD BIAS)
\`\`\`
При случайном перемешивании модель обучается на данных четверга и предсказывает среду той же недели, получая информацию из будущего. На тесте качество будет $99\\%$, а в реальном проде модель моментально сломается.

---

### Корректные схемы валидации: TimeSeriesSplit

Обучающая выборка всегда должна хронологически **строго предшествовать** валидационной выборке:

1. **Expanding Window (Расширяющееся окно):**
   - Фолд 1: Обучение [Январь], Валидация [Февраль]
   - Фолд 2: Обучение [Январь - Февраль], Валидация [Март]
   - Фолд 3: Обучение [Январь - Март], Валидация [Апрель]
2. **Rolling / Sliding Window (Скользящее окно фиксированной длины):**
   - Полезно при сильном концептуальном дрейфе (Concept Drift), когда события полугодовой давности уже нерелевантны.
3. **Out-of-Time (OOT) Holdout:**
   - Финальные последние $N$ дней/недель изолируются и используются только для итогового тестирования.

\`\`\`python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5, test_size=14)
for fold, (train_idx, val_idx) in enumerate(tscv.split(df)):
    X_train, y_train = df.iloc[train_idx], y[train_idx]
    X_val, y_val = df.iloc[val_idx], y[val_idx]
\`\`\`

---

### Feature Engineering для табличных моделей (LightGBM, CatBoost)

Градиентный бустинг — сильнейший baseline для табличного прогнозирования при правильной генерации фичей:

#### 1. Лаговые признаки (Lags)
Значения ряда в прошлые моменты времени:
\`\`\`python
# y_{t-1}, y_{t-2}, недельный лаг y_{t-7}
df['lag_1'] = df['target'].shift(1)
df['lag_2'] = df['target'].shift(2)
df['lag_7'] = df['target'].shift(7)
\`\`\`

#### 2. Оконные статистики (Rolling Features)
Среднее, стандартное отклонение, квантили:
\`\`\`python
# ВАЖНО: обязательно shift(1) перед rolling, чтобы не включать y_t в расчет!
df['rolling_mean_7'] = df['target'].shift(1).rolling(window=7).mean()
df['rolling_std_7'] = df['target'].shift(1).rolling(window=7).std()
df['rolling_mean_30'] = df['target'].shift(1).rolling(window=30).mean()
\`\`\`

#### 3. Календарные и циклические признаки
\`\`\`python
import numpy as np

df['dayofweek'] = df['date'].dt.dayofweek
df['month'] = df['date'].dt.month
df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)

# Тригонометрическое кодирование циклов (24 часа, 7 дней)
df['hour_sin'] = np.sin(2 * np.pi * df['date'].dt.hour / 24.0)
df['hour_cos'] = np.cos(2 * np.pi * df['date'].dt.hour / 24.0)
\`\`\`

---

### Стратегии многошагового прогнозирования (Multi-Step Forecasting)

Как предсказать значения на $H$ шагов вперед ($t+1, \\dots, t+H$)?
1. **Recursive (Рекурсивная стратегия):**
   Обучается одна модель на 1 шаг. Предсказание $\\hat{y}_{t+1}$ подставляется как лаг для прогнозирования $\\hat{y}_{t+2}$ и так далее.
   - *Минус:* быстрое накопление ошибок (Error Accumulation).
2. **Direct (Прямая стратегия):**
   Обучается $H$ независимых моделей: модель 1 учится предсказывать $y_{t+1}$, модель 2 — $y_{t+2}$, модель $H$ — $y_{t+H}$.
   - *Плюс:* нет накопления ошибок; каждая модель оптимизируется под свой горизонт.

---

### Метрики качества прогноза

| Метрика | Формула | Особенности |
| :--- | :--- | :--- |
| **MAE** | $\\frac{1}{n} \\sum |y_i - \\hat{y}_i|$ | Устойчива к выбросам, выражена в единицах целевой переменной |
| **RMSE** | $\\sqrt{\\frac{1}{n} \\sum (y_i - \\hat{y}_i)^2}$ | Сильно штрафует за редкие крупные промахи |
| **MAPE** | $\\frac{1}{n} \\sum \\left|\\frac{y_i - \\hat{y}_i}{y_i}\\right| \\times 100\\%$ | Относительная ошибка; ломается и делит на ноль при $y_i = 0$ |
| **WAPE** | $\\frac{\\sum |y_i - \\hat{y}_i|}{\\sum y_i} \\times 100\\%$ | Взвешенная ошибка; стабильна при нулевых продажах, стандарт ритейла |
| **MASE** | $\\frac{\\text{MAE}}{\\text{MAE}_{\\text{naive}}}$ | Отношение к ошибке наивного прогноза $\\hat{y}_t = y_{t-1}$. Если $< 1$, модель лучше наивной! |`,
    commonMistakes: [
      'Вычисление скользящего среднего без предварительного `.shift(1)`: целевое значение $y_t$ напрямую попадает в признак, создавая 100% утечку данных.',
      'Использование метрики MAPE на разреженных данных с нулевыми продажами: деление на ноль приводит к бесконечности (Inf) или NaN.',
      'Использование кросс-валидации со случайным перемешиванием (Random Shuffle K-Fold), приводящей к невалидным сверхоптимистичным оценкам качества.',
    ],
    checkpointQuiz: [
      {
        id: 'ts-cp-4-1',
        question: 'Почему при расчете скользящих статистик (rolling mean) в pandas необходимо делать df["target"].shift(1)?',
        options: [
          'Чтобы преобразовать числа с плавающей точкой в целочисленный тип',
          'Чтобы текущее истинное значение y_t не попало в расчет признака, исключая утечку данных из будущего',
          'Это требование компилятора CUDA',
          'Чтобы уменьшить объем занимаемой оперативной памяти в 2 раза',
        ],
        correctAnswer: 1,
        explanation: 'Без shift(1) окно rolling(7) включит сегодняшнее значение y_t. На инференсе сегодня значение y_t еще неизвестно, что приведет к катастрофической утечке.',
      },
      {
        id: 'ts-cp-4-2',
        question: 'Что показывает метрика MASE (Mean Absolute Scaled Error), если ее значение равно 0.72?',
        options: [
          'Модель ошибается ровно на 72% от максимального значения',
          'Модель предсказывает данные с задержкой в 72 миллисекунды',
          'Ошибка модели на 28% ниже, чем ошибка базового наивного прогноза прошлого значения y(t) = y(t-1)',
          'Модель переобучилась и непригодна для продакшена',
        ],
        correctAnswer: 2,
        explanation: 'MASE нормирует MAE модели на MAE наивного бенчмарка. Значение 0.72 означает, что модель превосходит тривиальный прогноз на 28%.',
      },
      {
        id: 'ts-cp-4-3',
        question: 'В чем преимущество прямой стратегии (Direct Multi-Step Forecasting) перед рекурсивной (Recursive)?',
        options: [
          'Прямая стратегия требует в 10 раз меньше оперативной памяти',
          'Прямая стратегия не накапливает ошибки предыдущих шагов, обучая отдельную модель под каждый горизонт прогнозирования',
          'Прямая стратегия работает только без экзогенных признаков',
          'Прямая стратегия автоматически удаляет выбросы из датасета',
        ],
        correctAnswer: 1,
        explanation: 'В рекурсивном подходе ошибка прогноза на шаге 1 передается как вход на шаг 2, экспоненциально накапливаясь. Direct обучает изолированные модели под каждый шаг горизонта.',
      },
    ],
  },
];

export const timeSeriesCards: Card[] = [
  {
    id: 'ts-card-1',
    moduleId: 'time-series-forecasting',
    lessonId: 'ts-1-stationarity-decomposition',
    type: 'flip',
    front: {
      ru: 'Что утверждает нулевая гипотеза (H₀) в тесте Дики-Фуллера (ADF)?',
      en: 'What does the null hypothesis (H₀) state in the Augmented Dickey-Fuller (ADF) test?',
    },
    back: {
      ru: 'H₀: ряд имеет единичный корень и является НЕстационарным. Если p-value < 0.05, мы отвергаем H₀ в пользу стационарности.',
      en: 'H₀: the series possesses a unit root and is non-stationary. If p-value < 0.05, we reject H₀ in favor of stationarity.',
    },
    tags: ['timeseries', 'stationarity', 'adf'],
  },
  {
    id: 'ts-card-2',
    moduleId: 'time-series-forecasting',
    lessonId: 'ts-2-arima-sarimax',
    type: 'cloze',
    clozeText: {
      ru: 'В модели SARIMA(p, d, q)(P, D, Q)ₛ параметр {{c1::s}} обозначает длину сезонного периода (например, 7 для дней недели или 12 для месяцев).',
      en: 'In a SARIMA(p, d, q)(P, D, Q)ₛ model, the parameter {{c1::s}} represents the seasonal cycle length (e.g., 7 for days of week, 12 for months).',
    },
    answer: {
      ru: 's',
      en: 's',
    },
    tags: ['timeseries', 'sarima', 'econometrics'],
  },
  {
    id: 'ts-card-3',
    moduleId: 'time-series-forecasting',
    lessonId: 'ts-3-prophet-neural',
    type: 'flip',
    front: {
      ru: 'Как open-source библиотека Prophet моделирует годовую и недельную сезонность?',
      en: 'How does the open-source Prophet library model yearly and weekly seasonalities?',
    },
    back: {
      ru: 'С помощью частичных сумм тригонометрического ряда Фурье (суммы синусов и косинусов с периодами P=365.25 и P=7).',
      en: 'Using truncated Fourier series harmonics (linear sums of sines and cosines with periods P=365.25 and P=7).',
    },
    tags: ['timeseries', 'prophet', 'fourier'],
  },
  {
    id: 'ts-card-4',
    moduleId: 'time-series-forecasting',
    lessonId: 'ts-4-validation-feature-engineering-gbdt',
    type: 'flip',
    front: {
      ru: 'Почему для оценки прогнозов розничных продаж со множеством нулей предпочитают WAPE вместо MAPE?',
      en: 'Why is WAPE preferred over MAPE when evaluating retail sales forecasts with frequent zeros?',
    },
    back: {
      ru: 'В MAPE при yᵢ = 0 происходит деление на ноль (ошибка уходит в бесконечность). WAPE делит сумму абсолютных ошибок на сумму всех фактических продаж (∑|yᵢ - ŷᵢ| / ∑yᵢ), что дает стабильную и взвешенную оценку.',
      en: 'In MAPE, zero actual sales (yᵢ = 0) cause division by zero. WAPE divides total absolute error by total actual demand (∑|yᵢ - ŷᵢ| / ∑yᵢ), maintaining mathematical stability.',
    },
    tags: ['timeseries', 'metrics', 'wape'],
  },
];

export const timeSeriesQuiz: QuizQuestion[] = [
  {
    id: 'ts-q-1',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какое преобразование позволяет стабилизировать экспоненциально растущую дисперсию временного ряда перед обучением моделей?',
      en: 'Which transformation stabilizes exponentially expanding variance in a time series prior to modeling?',
    },
    options: [
      {
        ru: 'Логарифмирование ln(yₜ) или степенное преобразование Бокса-Кокса',
        en: 'Logarithmic transform ln(yₜ) or Box-Cox power transformation',
      },
      {
        ru: 'Умножение ряда на константу 100',
        en: 'Multiplying the series by a constant factor of 100',
      },
      {
        ru: 'Случайное перемешивание точек во времени',
        en: 'Random time shuffling of sample points',
      },
      {
        ru: 'Удаление каждого второго наблюдения',
        en: 'Dropping every second observation',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Логарифмирование сжимает масштабы больших значений, стабилизируя дисперсию и превращая мультипликативные мультипликаторы в аддитивные слагаемые.',
      en: 'Logarithmic transforms compress extreme magnitudes, stabilizing heteroscedastic variance and linearizing multiplicative effects.',
    },
    tag: 'timeseries-stationarity',
  },
  {
    id: 'ts-q-2',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'В чем заключается фундаментальная проблема случайной k-fold кросс-валидации (shuffle=True) для временных рядов?',
      en: 'What is the fundamental hazard of random k-fold cross-validation (shuffle=True) on time series data?',
    },
    options: [
      {
        ru: 'Она работает слишком медленно на современных процессорах',
        en: 'It runs too slowly on modern CPUs',
      },
      {
        ru: 'Возникает критическая утечка данных из будущего (Lookahead Bias), так как модель обучается на будущих точках для предсказания прошлого',
        en: 'It causes fatal Lookahead Bias because future data points leak into training folds to predict past outcomes',
      },
      {
        ru: 'Алгоритм k-fold не поддерживает вещественные числа',
        en: 'K-fold algorithm does not support floating point values',
      },
      {
        ru: 'Она искусственно занижает метрики качества модели',
        en: 'It artificially degrades model quality metrics',
      },
    ],
    correctAnswer: 1,
    explanation: {
      ru: 'Во временных рядах время упорядочено. Случайное разбиение позволяет модели подсмотреть будущее, что дает ложно-оптимистичную метрику и поломку в проде.',
      en: 'Time is strictly directional. Random shuffling leaks future states into training subsets, causing severe over-optimism and failure in production.',
    },
    tag: 'timeseries-validation',
  },
  {
    id: 'ts-q-3',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какая комбинация лагов на графиках ACF и PACF указывает на чистый процесс авторегрессии порядка 2 — AR(2)?',
      en: 'Which combination of ACF and PACF patterns characterizes a pure AR(2) autoregressive process?',
    },
    options: [
      {
        ru: 'ACF обрывается после лага 2, а PACF экспоненциально затухает',
        en: 'ACF cuts off after lag 2, while PACF decays exponentially',
      },
      {
        ru: 'И ACF, и PACF обрываются строго в ноль на лаге 1',
        en: 'Both ACF and PACF cut off to zero strictly at lag 1',
      },
      {
        ru: 'ACF плавно экспоненциально затухает (синусоида), а PACF резко обрывается после лага 2',
        en: 'ACF decays smoothly/sinusoidally, while PACF cuts off sharply after lag 2',
      },
      {
        ru: 'Оба графика показывают постоянные единичные корреляции на всех лагах',
        en: 'Both plots exhibit continuous unit correlations at all lags',
      },
    ],
    correctAnswer: 2,
    explanation: {
      ru: 'Для процесса AR(p) характерно экспоненциальное или синусоидальное затухание функции автокорреляции (ACF) и резкий обрыв частичной автокорреляции (PACF) ровно после лага p.',
      en: 'An AR(p) process exhibits decaying/sinusoidal ACF tail-off and a sharp cutoff in PACF immediately after lag p.',
    },
    tag: 'arima-identification',
  },
  {
    id: 'ts-q-4',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Чем рекурсивное многошаговое прогнозирование (Recursive) принципиально уступает прямому подходу (Direct)?',
      en: 'What is the primary drawback of recursive multi-step forecasting compared to the direct approach?',
    },
    options: [
      {
        ru: 'Рекурсивный подход требует обучения отдельной модели под каждую точку времени',
        en: 'Recursive forecasting requires training an independent model for each time step',
      },
      {
        ru: 'Ошибки прогнозирования ранних шагов подставляются как входные данные на следующих шагах и лавинообразно накапливаются со временем',
        en: 'Early forecasting prediction errors get fed as inputs into subsequent steps, cascading and compounding over the forecast horizon',
      },
      {
        ru: 'Рекурсивный подход не умеет предсказывать числовые значения',
        en: 'Recursive forecasting cannot output continuous numeric values',
      },
      {
        ru: 'Рекурсивный подход не совместим с градиентным бустингом',
        en: 'Recursive approach is incompatible with gradient boosting algorithms',
      },
    ],
    correctAnswer: 1,
    explanation: {
      ru: 'В рекурсивном прогнозе модель предсказывает t+1, затем использует это предположение для прогноза t+2. Любая ошибка первого шага ухудшает второй, приводя к деградации качества на длинных горизонтах.',
      en: 'Recursive forecasting feeds noisy model predictions into its own subsequent inputs, causing rapid error accumulation over distant horizons.',
    },
    tag: 'multistep-forecasting',
  },
];
