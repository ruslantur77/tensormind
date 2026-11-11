import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const abTestingMeta: ModuleMeta = {
  id: 'ab-testing-experimentation',
  title: {
    ru: 'A/B-тестирование и продуктовая аналитика',
    en: 'A/B Testing & Product Experimentation (Data Analytics)',
  },
  description: {
    ru: 'Полная индустриальная база онлайн-экспериментов: проверка гипотез (H₀, H₁), ошибки I и II рода, MDE, расчет размера выборки (Sample Size), критерии Стьюдента, Манна-Уитни, бутстрэп, ускорение тестов через CUPED, стратификация, поправки на множественные проверки (FDR, Bonferroni) и сетевые эффекты (Switchback).',
    en: 'Production-grade experimentation & product analytics: hypothesis testing (H₀, H₁), Type I/II errors, MDE, sample size calculation, Student t-test, Mann-Whitney U, bootstrap, variance reduction (CUPED), stratification, multiple testing corrections (FDR, Bonferroni), and network effects (Switchback).',
  },
  order: 16,
  icon: 'ab-testing-experimentation',
  estimatedMinutes: 90,
  isPlaceholder: false,
};

export const abTestingLessons: Lesson[] = [
  {
    id: 'ab-1-foundations-sample-size',
    moduleId: 'ab-testing-experimentation',
    title: {
      ru: 'Основы A/B тестов, гипотезы и расчет размера выборки (Sample Size & MDE)',
      en: 'A/B Test Foundations, Hypotheses & Sample Size Calculation (MDE)',
    },
    order: 1,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Культура экспериментов в Data Analytics
A/B-тестирование (рандомизированный контролируемый эксперимент, RCT) — золотой стандарт доказательного принятия решений в бигтехе (Яндекс, Авито, Ozon, Netflix, Booking). Вместо споров о том, какая кнопка или рекомендательный алгоритм лучше, мы разделяем пользователей на контрольную ($A$) и тестовую ($B$) группы и статистически оцениваем причинно-следственный эффект (Causal Effect).

---

#### 1. Статистические гипотезы и ошибки принятия решений
* **Нулевая гипотеза ($H_0$):** Разницы между контрольной ($A$) и тестовой ($B$) группами нет, наблюдаемое отличие случайно: $\mu_B - \mu_A = 0$.
* **Альтернативная гипотеза ($H_1$):** Изменение имеет реальный эффект: $\mu_B - \mu_A \neq 0$ (двусторонняя) или $\mu_B - \mu_A > 0$ (односторонняя). В бизнесе почти всегда используют **двустороннюю** гипотезу, чтобы вовремя заметить негативные просадки.

##### Матрица ошибок:
| Реальность \\ Решение | Принимаем $H_0$ (нет эффекта) | Отклоняем $H_0$ (внедряем фичу) |
| :--- | :--- | :--- |
| **$H_0$ верна** (эффекта нет) | Корректное решение ($1 - \alpha$) | **Ошибка I рода (False Positive)**, вероятность $\alpha$ |
| **$H_1$ верна** (эффект есть) | **Ошибка II рода (False Negative)**, вероятность $\beta$ | **Мощность теста (Power)**, $1 - \beta$ |

* **Уровень значимости ($\alpha$):** Вероятность объявить изменение успешным, когда на самом деле эффекта нет (ложная тревога). Стандарт индустрии: $\alpha = 0.05$ (5%).
* **Мощность теста ($1 - \beta$):** Вероятность обнаружить реальный эффект заданного размера, если он действительно существует. Стандарт индустрии: $80\%$ или $90\%$ ($\beta = 0.2$ или $0.1$).
* **p-value:** Вероятность получить такое же или еще более экстремальное различие между группами при условии, что нулевая гипотеза $H_0$ строго верна. Если $p < \alpha$, мы отвергаем $H_0$.

---

#### 2. Расчет размера выборки (Sample Size) и MDE
**MDE (Minimum Detectable Effect)** — минимальный относительный или абсолютный прирост целевой метрики, который эксперимент способен статистически достоверно зафиксировать при заданных $\alpha$ и $\beta$.

Для непрерывной метрики с дисперсией $\sigma^2$ минимальный размер выборки на **каждую** группу вычисляется по формуле:
$$n = \frac{2 (Z_{1 - \alpha/2} + Z_{1 - \beta})^2 \cdot \sigma^2}{\text{MDE}^2}$$
где:
* $Z_{1 - \alpha/2}$ — квантиль стандартного нормального распределения для ошибки I рода (для $\alpha = 0.05$ равен $\approx 1.96$).
* $Z_{1 - \beta}$ — квантиль для мощности (для мощности $80\\%$ равен $\approx 0.84$, для $90\\%$ равен $\approx 1.28$).
* $\sigma^2$ — дисперсия метрики в историческом срезе (до теста).

##### Вычисление на Python:
\`\`\`python
import numpy as np
from scipy import stats

def calculate_sample_size(sigma: float, mde: float, alpha: float = 0.05, power: float = 0.80) -> int:
    z_alpha = stats.norm.ppf(1 - alpha / 2)
    z_beta = stats.norm.ppf(power)
    n = 2 * ((z_alpha + z_beta) ** 2) * (sigma ** 2) / (mde ** 2)
    return int(np.ceil(n))

# Пример: средний чек с дисперсией 2500 (sigma = 50), хотим поймать MDE = 2 рубля
n_per_group = calculate_sample_size(sigma=50.0, mde=2.0)
print(f"Требуется пользователей на группу: {n_per_group}")
\`\`\`

---

#### 3. Проблема подглядывания (Peeking Problem)
Самая частая ошибка начинающих аналитиков: открывать дашборд каждый день, считать p-value и останавливать тест в тот момент, когда $p < 0.05$.
* **Почему это катастрофа:** В процессе накопления данных график p-value колеблется случайным образом. Если проверять тест ежедневно в течение 30 дней, реальная вероятность ошибки I рода возрастает с $5\%$ до **$30–40\%$**!
* **Правило:** Тест рассчитывается на фиксированный срок (например, ровно 2 полных недели для компенсации эффекта дня недели) и анализируется только после набора целевого размера выборки $n$. Для непрерывного мониторинга используют специальные Sequential Testing методы (последовательный анализ Вальда или mSPRT).
`,
      en: `### Product Experimentation Foundations & Sample Size
A/B testing is the empirical foundation of product decision-making in tech companies.

---

#### 1. Hypothesis Testing & Errors
* **$H_0$:** No true difference between treatment and control ($\mu_B - \mu_A = 0$).
* **Type I Error ($\alpha$):** False positive rate (typically 5%).
* **Type II Error ($\beta$):** False negative rate; statistical power equals $1 - \beta$ (typically 80% or 90%).
* **p-value:** The probability of observing a test statistic at least as extreme as the one observed, assuming $H_0$ is true.

---

#### 2. Sample Size & Minimum Detectable Effect (MDE)
Sample size scales quadratically with variance and inversely with $\text{MDE}^2$:
$$n = \frac{2 (Z_{1 - \alpha/2} + Z_{1 - \beta})^2 \cdot \sigma^2}{\text{MDE}^2}$$

---

#### 3. The Peeking Problem
Continuous monitoring without statistical correction inflates Type I error rates from 5% up to 30-40%. Tests must run for their predetermined sample size and full weekly cycles.
`,
    },
    commonMistakes: [
      {
        ru: 'Остановка эксперимента раньше срока при первом достижении p-value < 0.05 (Peeking Problem). Это искусственно надувает False Positive Rate в несколько раз.',
        en: 'Early stopping when p-value first drops below 0.05 without sequential correction (Peeking problem).',
      },
      {
        ru: 'Проведение теста меньше 7 или 14 полных дней (игнорирование недельной сезонности: поведение пользователей в выходные кардинально отличается от будней).',
        en: 'Running tests for partial weeks, ignoring day-of-week seasonality shifts.',
      },
      {
        ru: 'Забывать пересчитывать размер выборки при увеличении числа вариантов (A/B/C тест требует поправки на множественные сравнения).',
        en: 'Failing to adjust sample size requirements when testing multiple treatment variants (A/B/C).',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-ab-1-1',
        question: {
          ru: 'Что происходит с вероятностью ошибки I рода (False Positive Rate), если ежедневно проверять p-value и останавливать тест при p < 0.05?',
          en: 'What happens to the Type I error rate when checking p-values daily and stopping as soon as p < 0.05?',
        },
        options: [
          'Она резко возрастает (может достигать 30–40% вместо запланированных 5%) из-за проблемы подглядывания (Peeking)',
          'Она уменьшается до нуля, делая результат абсолютно точным',
          'Она остается строго равной 5%',
          'Она снижает мощность теста до 1%',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Многократная проверка гипотезы во время сбора данных (Peeking Problem) накапливает вероятность случайно поймать экстремальное отклонение шума, раздувая вероятность ошибки I рода до 30-40%.',
          en: 'Repeated significance testing on accumulating data dramatically inflates false positive rates due to multiple testing over time without statistical penalties.',
        },
      },
      {
        id: 'q-ab-1-2',
        question: {
          ru: 'Как изменится необходимый размер выборки (Sample Size), если мы захотим обнаружить вдвое меньший эффект (MDE уменьшается в 2 раза)?',
          en: 'How does required sample size change if Minimum Detectable Effect (MDE) is cut in half?',
        },
        options: [
          'Увеличится в 4 раза (квадратичная зависимость $n \\propto 1 / \\text{MDE}^2$)',
          'Увеличится ровно в 2 раза',
          'Уменьшится в 2 раза',
          'Не изменится, размер выборки зависит только от $\\alpha$',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В формуле размера выборки MDE стоит в знаменателе в квадрате ($1 / \\text{MDE}^2$). При уменьшении MDE в 2 раза размер выборки возрастает в $2^2 = 4$ раза.',
          en: 'Sample size is inversely proportional to squared MDE ($n \\propto 1/\\text{MDE}^2$). Halving MDE quadruples required sample size.',
        },
      },
      {
        id: 'q-ab-1-3',
        question: {
          ru: 'Что означает статистическая мощность теста (Statistical Power), равная 80%?',
          en: 'What does a statistical test power of 80% mean?',
        },
        options: [
          'Вероятность обнаружить реальный эффект величиной не менее MDE составляет 80%, если он действительно существует',
          'Что у 80% пользователей метрика вырастет',
          'Что тест завершится за 80 часов',
          'Что вероятность ошибки I рода равна 20%',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Мощность теста $1 - \\beta = 0.80$ означает, что в $80\\%$ случаев истинный эффект будет обнаружен и подтвержден отвержением $H_0$, а в $20\\%$ будет допущена ошибка II рода (пропуск реального эффекта).',
          en: 'Power ($1 - \\beta$) is the probability of correctly rejecting the null hypothesis when an actual effect of at least MDE size exists.',
        },
      },
    ],
  },
  {
    id: 'ab-2-statistical-tests',
    moduleId: 'ab-testing-experimentation',
    title: {
      ru: 'Статистические критерии: t-test, Манна-Уитни, Ratio-метрики и Бутстрэп',
      en: 'Statistical Tests: t-test, Mann-Whitney U, Ratio Metrics & Bootstrap',
    },
    order: 2,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: {
      ru: `### Выбор статистического критерия под тип метрики
Не существует одного универсального теста для всех продуктовых метрик. Выбор критерия зависит от распределения величины (нормальное, скошенное, бинарное, отношение двух случайных величин).

---

#### 1. Классификация продуктовых метрик
1. **Бинарные метрики (Конверсии):** Кликнул/не кликнул (CTR), купил/не купил (CR), оформил подписку.
   * *Критерии:* Z-тест для двух долей, двухвыборочный тест пропорций, Хи-квадрат ($\chi^2$).
2. **Непрерывные метрики со средними:** Выручка на пользователя (ARPU), время на сайте (Time Spent), средний чек.
   * *Критерии:* Двухвыборочный t-критерий Стьюдента или **t-критерий Уэлча (Welch's t-test)**, который не требует равенства дисперсий групп:
   $$t = \frac{\bar{X}_B - \bar{X}_A}{\sqrt{\frac{s_A^2}{n_A} + \frac{s_B^2}{n_B}}}$$
   Благодаря **Центральной предельной теореме (ЦПТ)** при больших выборках ($n > 5000$) выборочные средние распределены нормально даже при скошенных исходных данных!

---

#### 2. Критерий Манна-Уитни (Mann-Whitney U) и его подводные камни
Критерий Манна-Уитни — непараметрический ранговый тест.
* **Когда применять:** Когда данные сильно зашумлены тяжелыми выбросами, а выборка мала, и нас интересует сдвиг распределения, а не среднее арифметическое.
* **Опасная ловушка:** Манна-Уитни тестирует гипотезу о равенстве вероятностей превосходства $P(X_B > X_A) = 0.5$, а **не равенство медиан**! При разной форме распределений медианы могут совпадать, а тест покажет значимость, или наоборот. Для бизнеса почти всегда важны деньги (суммарная выручка = $n \times \text{mean}$), а не ранги!

---

#### 3. Метод Бутстрэпа (Bootstrap)
Бутстрэп — универсальный непараметрический метод оценки доверительных интервалов для любых сложных статистик (квантили $p_{90}, p_{99}$, медианы, отношение средних).
1. Из имеющейся выборки размера $N$ с возвращением генерируется $B$ новых выборок (обычно $B = 2000–5000$).
2. На каждой сгенерированной выборке считается целевая метрика $\theta^*$.
3. Строится эмпирическое распределение $\theta^*$ и берутся квантили $2.5\\%$ и $97.5\\%$ для построения $95\\%$ доверительного интервала.

\`\`\`python
import numpy as np

def bootstrap_diff_ci(sample_a, sample_b, n_boot: int = 3000, alpha: float = 0.05):
    diffs = []
    n_a, n_b = len(sample_a), len(sample_b)
    for _ in range(n_boot):
        boot_a = np.random.choice(sample_a, size=n_a, replace=True)
        boot_b = np.random.choice(sample_b, size=n_b, replace=True)
        diffs.append(np.mean(boot_b) - np.mean(boot_a))
    
    ci_lower = np.percentile(diffs, 100 * (alpha / 2))
    ci_upper = np.percentile(diffs, 100 * (1 - alpha / 2))
    return ci_lower, ci_upper
\`\`\`

---

#### 4. Ratio-метрики и Бакетизация (Bucketization)
**Ratio-метрика** — это отношение двух сумм:
$$\text{CTR} = \frac{\sum \text{кликов}}{\sum \text{показов}}, \quad \text{AOV} = \frac{\sum \text{выручки}}{\sum \text{заказов}}$$
* **В чем проблема:** Единица рандомизации — пользователь, но один пользователь генерирует 1 показ, а другой — 500 показов. Наблюдения не являются независимыми и одинаково распределенными (i.i.d.), поэтому стандартный t-test ломается!
* **Решение 1: Дельта-метод (Delta Method)** — аналитическое приближение дисперсии отношения двух случайных величин через разложение в ряд Тейлора.
* **Решение 2: Бакетизация (Bucketization)** — пользователей случайным хэшем разбивают на $K = 100–200$ корзин (бакетов). Внутри каждого бакета считают суммарный числитель и знаменатель и вычисляют метрику бакета. К полученным $K$ независимым числам уже законно применяют классический t-test!
`,
      en: `### Statistical Tests for Product Metrics
Different metric types require distinct statistical hypothesis tests.

---

#### 1. Metric Typology
* **Binary (CR, CTR):** Two-sample proportion Z-test, Chi-squared ($\chi^2$).
* **Continuous (ARPU, Time):** Welch's t-test (robust against unequal sample sizes and variances). Due to CLT, sample averages converge to normality for large $N$.

---

#### 2. Mann-Whitney U Test & Its Traps
A non-parametric rank test. Tests stochastic dominance $P(Y > X) = 0.5$, NOT equal medians.

---

#### 3. Bootstrap
Empirical resampling with replacement ($B = 2000–5000$) to evaluate quantiles ($p_{95}, p_{99}$) and arbitrary non-linear statistics.

---

#### 4. Ratio Metrics & Bucketization
User-level ratios violate standard i.i.d. assumptions. Solved via Delta method Taylor approximations or deterministic hashing into $K = 100–200$ user buckets.
`,
    },
    commonMistakes: [
      {
        ru: 'Применение критерия Манна-Уитни для оценки выручки (ARPU) с мыслью «это проверит средний доход». Ранговый тест игнорирует абсолютные величины и может показать значимый плюс при фактическом падении суммарной выручки.',
        en: 'Using Mann-Whitney U for revenue analysis: it evaluates rank distribution rather than total financial impact.',
      },
      {
        ru: 'Игнорирование зависимостей в Ratio-метриках: расчет обычного t-теста по кликам на уровне сессий вместо агрегации на пользователя.',
        en: 'Running session-level t-tests for click-through ratios, ignoring user-level clustering correlation.',
      },
      {
        ru: 'Запуск тяжелого бутстрэпа с миллионами строк прямо в цикле веб-бэкенда без векторизации или бакетизации.',
        en: 'Running non-vectorized bootstrap iterations over millions of raw rows directly on API serving threads.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-ab-2-1',
        question: {
          ru: 'Почему t-критерий Уэлча (Welch\'s t-test) предпочтительнее классического t-критерия Стьюдента при анализе A/B тестов?',
          en: 'Why is Welch’s t-test preferred over Student’s t-test in A/B experimentation?',
        },
        options: [
          'Он не требует равенства дисперсий в контрольной и тестовой группах и надежен при разном размере выборок',
          'Он работает без использования математических формул',
          'Он гарантирует p-value меньше 0.05 в 100% случаев',
          'Он применим только к категориальным текстам',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В реальных тестах дисперсия метрики в тестовой группе часто меняется (например, фича увеличивает разброс трат). t-тест Уэлча адаптирует число степеней свободы под неравные дисперсии.',
          en: 'Welch’s t-test adjusts degrees of freedom for unequal population variances and sample sizes, protecting against false positive inflation.',
        },
      },
      {
        id: 'q-ab-2-2',
        question: {
          ru: 'В чем суть метода бакетизации (Bucketization) при работе с Ratio-метриками (например, CTR кликов на просмотры)?',
          en: 'What is the core idea of Bucketization when evaluating Ratio metrics?',
        },
        options: [
          'Пользователи хэшируются в фиксированное число корзин (например, 100 бакетов), внутри которых агрегируются числитель и знаменатель, после чего применяется t-тест к бакетам',
          'Все данные удаляются и заменяются случайными числами',
          'Пользователи группируются по знаку зодиака',
          'Каждый клик считается за 10 отдельных пользователей',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Бакетизация решает проблему коррелированных сессий: свернув миллионы зависимых действий в 100-200 независимых бакетов, мы получаем независимые нормально распределенные наблюдения, пригодные для t-теста.',
          en: 'Bucketization hashes users into 100-200 pseudo-clusters, aggregating correlated actions into independent, approximately normal bucket averages.',
        },
      },
      {
        id: 'q-ab-2-3',
        question: {
          ru: 'Какую нулевую гипотезу на самом деле проверяет непараметрический критерий Манна-Уитни (Mann-Whitney U)?',
          en: 'What null hypothesis does the non-parametric Mann-Whitney U test actually evaluate?',
        },
        options: [
          'Вероятность того, что случайно взятое наблюдение из группы B превосходит наблюдение из группы A, равна 0.5: $P(X_B > X_A) = 0.5$',
          'Медианы двух выборок строго равны',
          'Дисперсии двух выборок равны нулю',
          'Средние арифметические выборок равны 1.0',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Манна-Уитни проверяет стохастическое равенство (ранговое превосходство). Утверждение «Манна-Уитни сравнивает медианы» верно только при абсолютно одинаковой форме и масштабе обоих распределений.',
          en: 'Mann-Whitney U tests stochastic dominance: whether a randomly selected value from group B is equally likely to be greater than one from A.',
        },
      },
    ],
  },
  {
    id: 'ab-3-variance-reduction-cuped',
    moduleId: 'ab-testing-experimentation',
    title: {
      ru: 'Снижение дисперсии и ускорение тестов: CUPED и стратификация',
      en: 'Variance Reduction & Test Speedup: CUPED and Stratification',
    },
    order: 3,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: {
      ru: `### Проблема скорости продуктовых тестов
В быстрорастущем бизнесе время — самый ценный ресурс. Если для подтверждения прироста выручки на $1\%$ тесту требуется 6 месяцев сбора трафика, бизнес теряет конкурентоспособность.
Как ускорить тест в **2–3 раза** без привлечения дополнительного трафика? **Снизить дисперсию метрики!**

Формула размера выборки показывает:
$$n \propto \sigma^2$$
Если уменьшить дисперсию $\sigma^2$ в 2 раза, то требуемый размер выборки $n$ и длительность теста сокращаются ровно в 2 раза!

---

#### 1. Стратификация (Stratification)
Пользователи неоднородны: пользователи iOS тратят в среднем больше, чем пользователи Android; оптовые клиенты покупают больше розничных.
* **Суть:** Генеральная совокупность делится на непересекающиеся страты (пласты) $k \in \{1, \dots, K\}$. Внутри каждой страты пропорции групп $A$ и $B$ строго фиксируются.
* **Эффект:** Межстратовая дисперсия вычитается из общей ошибки, снижая дисперсию оценки эффекта на $10–25\%$.
* **Пост-стратификация (Post-stratification):** Взвешивание групп по долям страт уже после проведения теста, если физическое расщепление трафика было чисто случайным.

---

#### 2. Метод CUPED (Controlled-experiment Using Pre-Experiment Data)
Разработанный в Microsoft (Deng et al., 2013), алгоритм **CUPED** стал стандартом индустрии в Uber, Netflix, Яндекс и Авито.

##### Математическая идея CUPED:
Пусть $Y$ — целевая метрика в эксперименте (например, выручка пользователя за 2 недели теста).
Возьмем ковариату $X$ — ту же самую метрику пользователя (или тесно связанную с ней), измеренную **до начала эксперимента** (например, выручка за 2 недели до старта теста).

Сконструируем новую скорректированную метрику $Y_{\text{cuped}}$:
$$Y_{\text{cuped}} = Y - \theta (X - \mathbb{E}[X])$$
где константа $\theta$ выбирается так, чтобы минимизировать дисперсию $\text{Var}(Y_{\text{cuped}})$:
$$\theta = \frac{\text{Cov}(Y, X)}{\text{Var}(X)}$$

##### Чему равна итоговая дисперсия?
$$\text{Var}(Y_{\text{cuped}}) = \text{Var}(Y) \cdot (1 - \rho^2)$$
где $\rho = \text{Corr}(Y, X)$ — коэффициент корреляции Пирсона между предэкспериментальным и экспериментальным поведением пользователя!

* **Пример эффекта:** В зрелых продуктах корреляция между выручкой пользователя за прошлый месяц и текущий месяц часто составляет $\rho = 0.7–0.8$.
$$\text{Var}(Y_{\text{cuped}}) = \text{Var}(Y) \cdot (1 - 0.7^2) = \text{Var}(Y) \cdot (1 - 0.49) = 0.51 \cdot \text{Var}(Y)$$
Дисперсия снизилась в **2 раза**! Это означает, что эксперимент можно завершить ровно в 2 раза быстрее с сохранением той же мощности и MDE!

##### Реализация CUPED на Python:
\`\`\`python
import numpy as np

def apply_cuped(y_control, x_control, y_test, x_test):
    # Объединяем для надежной оценки ковариации
    y_all = np.concatenate([y_control, y_test])
    x_all = np.concatenate([x_control, x_test])
    
    cov_xy = np.cov(y_all, x_all)[0, 1]
    var_x = np.var(x_all, ddof=1)
    theta = cov_xy / var_x
    mean_x = np.mean(x_all)
    
    # Преобразование метрик
    y_control_cuped = y_control - theta * (x_control - mean_x)
    y_test_cuped = y_test - theta * (x_test - mean_x)
    
    variance_reduction = 1 - (np.var(y_test_cuped) / np.var(y_test))
    print(f"Снижение дисперсии: {variance_reduction * 100:.1f}%")
    return y_control_cuped, y_test_cuped
\`\`\`
`,
      en: `### Variance Reduction: Stratification & CUPED
Reducing variance directly accelerates test velocity without needing additional traffic.

---

#### 1. Stratified Sampling
Partitioning traffic across homogeneous user tiers (OS, region, activity level) eliminates between-strata variance.

---

#### 2. CUPED (Controlled-experiment Using Pre-Experiment Data)
Pioneered at Microsoft; subtracts pre-experiment baseline covariate $X$ from outcome $Y$:
$$Y_{\text{cuped}} = Y - \theta (X - \mathbb{E}[X]), \quad \theta = \frac{\text{Cov}(Y, X)}{\text{Var}(X)}$$
Residual variance scales down by correlation factor:
$$\text{Var}(Y_{\text{cuped}}) = \text{Var}(Y) \cdot (1 - \rho^2)$$
High autocorrelation ($\rho = 0.8$) cuts required duration in half.
`,
    },
    commonMistakes: [
      {
        ru: 'Использование в качестве ковариаты $X$ признаков, на которые повлиял сам эксперимент (ковариата ОБЯЗАНА быть замерена строго ДО старта теста или быть строго экзогенной). Иначе эффект фичи затрется.',
        en: 'Selecting covariates affected by the treatment itself; covariates must strictly precede test intervention.',
      },
      {
        ru: 'Расчет коэффициента $\\theta$ отдельно для контрольной и отдельно для тестовой группы (это смещает оценку, ковариация должна считаться пулом).',
        en: 'Computing CUPED theta separately within treatment and control, introducing bias.',
      },
      {
        ru: 'Применение CUPED для новых пользователей (New Users), у которых вообще нет исторической пре-периодной активности (для них $X = 0$, CUPED не дает выигрыша).',
        en: 'Expecting variance reduction on freshly registered users who lack pre-experiment historical data.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-ab-3-1',
        question: {
          ru: 'На какую величину снижается дисперсия метрики при использовании метода CUPED, если корреляция между целевой метрикой и пре-периодной ковариатой равна $\\rho = 0.6$?',
          en: 'By how much does CUPED reduce metric variance when the pre-experiment correlation is $\\rho = 0.6$?',
        },
        options: [
          'На 36% (дисперсия умножается на $1 - \\rho^2 = 1 - 0.36 = 0.64$)',
          'На 60%',
          'Ровно в 6 раз',
          'Дисперсия не меняется, меняется только среднее',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Формула дисперсии CUPED: $\\text{Var}(Y_{\\text{cuped}}) = \\text{Var}(Y) \\cdot (1 - \\rho^2)$. При $\\rho = 0.6$ множитель равен $1 - 0.36 = 0.64$, то есть дисперсия снизилась на $36\\%$.',
          en: 'CUPED reduces variance by a factor of $(1 - \\rho^2)$. For $\\rho = 0.6$, $(1 - 0.36) = 0.64$, representing a 36% variance reduction.',
        },
      },
      {
        id: 'q-ab-3-2',
        question: {
          ru: 'Какое главное требование предъявляется к ковариате $X$ при применении метода CUPED?',
          en: 'What is the critical requirement for covariate $X$ when applying CUPED?',
        },
        options: [
          'Она должна быть измерена строго до запуска эксперимента и не зависеть от исследуемого воздействия',
          'Она должна принимать только значения 0 и 1',
          'Она должна быть измерена только в последний день теста',
          'Ее среднее значение должно быть строго равно миллиону',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Ковариата не должна подвергаться влиянию тестируемой фичи. Если включить признак, на который повлияло изменение, CUPED вычтет сам эффект фичи и исказит выводы.',
          en: 'Covariates must be independent of treatment assignment, typically measured in pre-experiment periods.',
        },
      },
      {
        id: 'q-ab-3-3',
        question: {
          ru: 'Почему CUPED не дает выигрыша для когорты абсолютно новых пользователей (New Users), зарегистрировавшихся во время теста?',
          en: 'Why does CUPED provide no benefit for new users who registered during the experiment?',
        },
        options: [
          'У них нет исторических данных до старта теста ($X = 0$), поэтому корреляция с прошлым отсутствует',
          'Новые пользователи не умеют совершать покупки',
          'Для новых пользователей запрещено проводить A/B тесты',
          'CUPED применим только к пользователям старше 18 лет',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Для новых пользователей нет пре-периодных данных, поэтому для них $\\text{Corr}(Y, X) = 0$, и дисперсия не снижается.',
          en: 'New users have no prior tracking history, resulting in zero correlation with pre-experiment behavior.',
        },
      },
    ],
  },
  {
    id: 'ab-4-advanced-pitfalls-business',
    moduleId: 'ab-testing-experimentation',
    title: {
      ru: 'Продвинутые проблемы A/B: SRM, множественные проверки, сетевые эффекты и Switchback',
      en: 'Advanced A/B Pitfalls: SRM, Multiple Testing, Network Effects & Switchback',
    },
    order: 4,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Проверка валидности сплитования и сетевые эффекты
Даже математически безупречный статистический тест выдаст ложные выводы, если нарушена инженерная архитектура сплитования или физика взаимодействия пользователей.

---

#### 1. Sample Ratio Mismatch (SRM)
Вы планировали эксперимент с разделением $50/50$, но в контроле оказалось $100\\,000$ пользователей, а в тесте — всего $94\\,000$.
* **Что такое SRM:** Статистически значимое расхождение между ожидаемой и фактической пропорцией трафика.
* **Как проверять:** Критерием согласия Пирсона $\\chi^2$ (Goodness of Fit):
  $$\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}$$
  Если $p < 0.001$, эксперимент признается **невалидным (SRM)**.
* **Причины SRM:**
  * Тестовая версия падает с ошибкой 500 и не отправляет телеметрию.
  * Тестовая страница грузится на 2 секунды дольше, и пользователи закрывают вкладку до срабатывания трекера.
  * Ошибки балансировщика трафика / CDN кэширования.
* **Золотое правило:** При наличии SRM результаты теста нельзя анализировать! Их нужно выбросить, найти технический баг и перезапустить тест.

---

#### 2. Проблема множественной проверки гипотез (Multiple Testing)
Если в тесте отслеживается 20 разных продуктовых метрик (конверсия, клики, отказы, глубина, шеринг...), то при $\\alpha = 0.05$ вероятность получить хотя бы один ложноположительный результат равна:
$$\\text{FWER} = 1 - (1 - 0.05)^{20} \\approx 64.1\\%!$$
Вы почти гарантированно «найдете» фиктивную победу там, где ее нет.

##### Методы коррекции:
1. **Поправка Бонферрони (Bonferroni):** Консервативная защита FWER. Уровень значимости делится на число проверяемых гипотез: $\\alpha_{\\text{adj}} = \\frac{\\alpha}{m}$.
2. **Контроль доли ложных открытий (FDR — False Discovery Rate, процедура Бенджамини-Хохберга):** Менее жесткий метод для продуктовой аналитики, контролирует долю ложных побед среди всех отклоненных гипотез.

---

#### 3. Сетевые эффекты и Spillover в маркетплейсах
Классическое A/B предполагает **SUTVA (Stable Unit Treatment Value Assumption)**: воздействие на пользователя $A$ никак не влияет на пользователя $B$.
В двухсторонних маркетплейсах (Uber, Яндекс Такси, Airbnb, Delivery Club) это предположение грубо нарушается!

* **Каннибализация трафика:** Тестовые пользователи $B$ получили скидку $20\\%$, вызвали все машины в районе, и контрольным пользователям $A$ машин не досталось (время ожидания выросло). Фича в тесте выглядит триумфом, но в реальности бизнес не вырос!

##### Решения для маркетплейсов:
1. **Географическая кластеризация (Cluster Randomization):** Город Казань — контрольная группа, Нижний Новгород — тестовая группа (с синтетическим контролем Synthetic Control).
2. **Switchback-эксперименты (Рандомизация по времени):** Весь город переключается между вариантами по расписанию:
   * 10:00–11:00 — Вариант $A$
   * 11:00–12:00 — Вариант $B$
   * 12:00–13:00 — Вариант $A$
   Специфика анализа требует учета автокорреляции временных рядов (Newey-West стандартные ошибки).
`,
      en: `### Advanced Experimentation Pitfalls: SRM, Multiple Testing & Spillover
Statistical inference fails when infrastructural assumptions are violated.

---

#### 1. Sample Ratio Mismatch (SRM)
Discrepancies between targeted and actual traffic ratios indicate platform anomalies (crashes, redirect drops). Evaluated via Chi-square goodness-of-fit. When SRM is present, test results must be discarded.

---

#### 2. Multiple Hypothesis Testing
Evaluating 20 metrics simultaneously blows family-wise error rate (FWER) to 64%. Managed via Bonferroni or False Discovery Rate (Benjamini-Hochberg).

---

#### 3. Network Effects & SUTVA Violations
Two-sided marketplaces break interference independence (drivers booked by group B starve group A). Mitigated through Cluster Randomization or Time-Slot Switchback experimentation.
`,
    },
    commonMistakes: [
      {
        ru: 'Игнорирование проверки на SRM: попытка трактовать результаты теста, в котором один из вариантов уронил сплитование из-за крэшей приложения.',
        en: 'Analyzing metrics despite active Sample Ratio Mismatch (SRM) caused by client-side crashes.',
      },
      {
        ru: 'Поиск «хоть какой-нибудь выросшей метрики» среди 50 параметров без поправки на множественные проверки (data dredging / p-hacking).',
        en: 'Scanning dozens of secondary metrics without FDR/Bonferroni corrections to claim artificial wins.',
      },
      {
        ru: 'Запуск стандартного пользовательского сплита в такси или доставке вместо Switchback-теста, что приводит к каннибализации ограниченных ресурсов (курьеров/водителей).',
        en: 'Using standard user-level split in shared physical marketplaces instead of time-based Switchback designs.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-ab-4-1',
        question: {
          ru: 'Что необходимо сделать, если при анализе A/B теста критерий Хи-квадрат выявил статистически значимый Sample Ratio Mismatch (SRM, p < 0.001)?',
          en: 'What must be done if a Chi-square check reveals a statistically significant Sample Ratio Mismatch (SRM, p < 0.001)?',
        },
        options: [
          'Признать результаты теста недействительными, найти техническую причину расхождения в инфраструктуре и перезапустить тест',
          'Внедрить фичу в прод, если конверсия в тесте положительная',
          'Искусственно удалить случайных пользователей из контроля, чтобы выровнять числа',
          'Поменять порог значимости alpha с 0.05 на 0.5',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'SRM указывает на фундаментальный сбой в инфраструктуре распределения или отслеживания пользователей (например, крэши или дропы). Любые метрики в таком тесте смещены и неприменимы.',
          en: 'SRM signals severe data pipeline corruption (tracking drops, crashes). Results cannot be trusted and must be investigated.',
        },
      },
      {
        id: 'q-ab-4-2',
        question: {
          ru: 'В чем заключается дизайн Switchback-экспериментов, применяемый в сервисах такси (Uber, Яндекс Go) и доставке?',
          en: 'What is the design principle of Switchback experiments used in ride-hailing and food delivery?',
        },
        options: [
          'Рандомизация происходит не по отдельным пользователям, а по временным интервалам (например, каждый час алгоритм переключается между A и B для всего города)',
          'Каждому водителю выдается два смартфона',
          'Тестирование проводится только в ночное время',
          'Цены на поездки увеличиваются в 10 раз для половины пассажиров',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В маркетплейсах пользователи конкурируют за общий пул машин. Switchback переключает весь рынок во времени (1 час вариант А, 1 час вариант B), устраняя интерференцию между пользователями.',
          en: 'Switchback designs randomize across time windows across entire geographic zones to eliminate market equilibrium interference (SUTVA violations).',
        },
      },
      {
        id: 'q-ab-4-3',
        question: {
          ru: 'Для чего в продуктовой аналитике применяется поправка Бенджамини-Хохберга (FDR)?',
          en: 'Why is the Benjamini-Hochberg (FDR) procedure applied in product analytics?',
        },
        options: [
          'Для контроля доли ложных открытий (False Discovery Rate) при одновременной проверке множества продуктовых метрик',
          'Для ускорения загрузки базы данных SQL',
          'Для шифрования логов пользователей',
          'Для автоматического создания дашбордов в Power BI',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Процедура Бенджамини-Хохберга контролирует False Discovery Rate — математическое ожидание доли ошибочно отвергнутых гипотез среди всех зафиксированных изменений, являясь более мощной альтернативой консервативной поправке Бонферрони.',
          en: 'Benjamini-Hochberg controls the False Discovery Rate (proportion of false positives among all declared discoveries) when monitoring multiple metrics.',
        },
      },
    ],
  },
];

export const abTestingCards: Card[] = [
  {
    id: 'card-ab-mde',
    moduleId: 'ab-testing-experimentation',
    type: 'flip',
    front: {
      ru: 'Что такое MDE (Minimum Detectable Effect) в A/B тестировании?',
      en: 'What is MDE (Minimum Detectable Effect) in A/B testing?',
    },
    back: {
      ru: 'Минимальный размер изменения метрики, который эксперимент способен статистически достоверно обнаружить при заданных уровнях $\\alpha$ (ошибка I рода) и мощности $1-\\beta$.',
      en: 'The smallest true effect size that an experiment has statistical power ($1-\\beta$) to detect at significance level $\\alpha$.',
    },
    tags: ['ab-testing', 'mde', 'sample-size'],
  },
  {
    id: 'card-ab-cuped',
    moduleId: 'ab-testing-experimentation',
    type: 'cloze',
    clozeText: {
      ru: 'Метод {{c1::CUPED}} снижает дисперсию целевой метрики в {{c2::1 - \\rho^2}} раз за счет использования ковариаты, замеренной до старта эксперимента.',
      en: 'The {{c1::CUPED}} technique reduces target variance by a factor of {{c2::1 - \\rho^2}} by subtracting a pre-experiment baseline covariate.',
    },
    answer: {
      ru: 'CUPED и 1 - \\rho^2',
      en: 'CUPED and 1 - \\rho^2',
    },
    tags: ['cuped', 'variance-reduction'],
  },
  {
    id: 'card-ab-srm',
    moduleId: 'ab-testing-experimentation',
    type: 'flip',
    front: {
      ru: 'Что такое Sample Ratio Mismatch (SRM) и почему он критичен?',
      en: 'What is Sample Ratio Mismatch (SRM) and why is it critical?',
    },
    back: {
      ru: 'Статистически значимое отклонение фактического распределения трафика от запланированного (проверяется $\\chi^2$). Свидетельствует о багах в сплитовании, крэшах или потере логов — результаты теста невалидны.',
      en: 'Significant mismatch between expected and actual sample ratios (evaluated via $\\chi^2$), signaling telemetry loss, redirect bugs, or crashes; voids experimental validity.',
    },
    tags: ['srm', 'experiment-integrity'],
  },
  {
    id: 'card-ab-switchback',
    moduleId: 'ab-testing-experimentation',
    type: 'cloze',
    clozeText: {
      ru: 'В двухсторонних маркетплейсах для борьбы с нарушением SUTVA и интерференцией ресурсов используют {{c1::Switchback-эксперименты}}, в которых рандомизация происходит по {{c2::временным интервалам}}.',
      en: 'To prevent SUTVA interference in two-sided marketplaces, analysts run {{c1::Switchback experiments}} where treatment randomizes across {{c2::time windows}}.',
    },
    answer: {
      ru: 'Switchback-эксперименты и временным интервалам',
      en: 'Switchback experiments and time windows',
    },
    tags: ['switchback', 'sutva', 'marketplaces'],
  },
];

export const abTestingQuiz: QuizQuestion[] = [
  {
    id: 'quiz-ab-1',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Почему при A/B тестировании непрерывных метрик на больших выборках (n > 10 000) используют t-критерий Уэлча даже при скошенных распределениях?',
      en: 'Why is Welch’s t-test valid on skewed continuous metrics with large sample sizes (n > 10,000)?',
    },
    options: [
      {
        ru: 'Благодаря Центральной предельной теореме выборочные средние распределены нормально даже при скошенных исходных данных',
        en: 'By the Central Limit Theorem, sample averages converge to a normal distribution regardless of underlying skew',
      },
      { ru: 'Потому что t-тест автоматически удаляет всех пользователей с нулевыми тратами', en: 'Because t-test trims all zero-spenders' },
      { ru: 'Потому что закон больших чисел делает все данные строго равными 0', en: 'Because law of large numbers forces data to 0' },
      { ru: 'Потому что t-тест работает только если дисперсия равна единице', en: 'Because t-test only functions when variance is 1' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Центральная предельная теорема гарантирует, что выборочное среднее суммы независимых величин асимптотически приближается к нормальному распределению при росте размера выборки.',
      en: 'The Central Limit Theorem ensures that the sampling distribution of the mean approaches normality for sufficiently large N.',
    },
    tag: 'ab-statistics',
  },
  {
    id: 'quiz-ab-2',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Какое соотношение связывает коэффициент корреляции Пирсона $\\rho$ между исторической и текущей метрикой с коэффициентом снижения дисперсии в CUPED?',
      en: 'What formula relates pre-experiment correlation $\\rho$ to variance reduction in CUPED?',
    },
    options: [
      { ru: '$\\text{Var}(Y_{\\text{cuped}}) = \\text{Var}(Y) \\cdot (1 - \\rho^2)$', en: '$\\text{Var}(Y_{\\text{cuped}}) = \\text{Var}(Y) \\cdot (1 - \\rho^2)$' },
      { ru: '$\\text{Var}(Y_{\\text{cuped}}) = \\text{Var}(Y) / \\rho$', en: '$\\text{Var}(Y_{\\text{cuped}}) = \\text{Var}(Y) / \\rho$' },
      { ru: '$\\text{Var}(Y_{\\text{cuped}}) = \\text{Var}(Y) + \\rho^2$', en: '$\\text{Var}(Y_{\\text{cuped}}) = \\text{Var}(Y) + \\rho^2$' },
      { ru: '$\\text{Var}(Y_{\\text{cuped}}) = \\rho \\cdot \\text{Var}(Y)$', en: '$\\text{Var}(Y_{\\text{cuped}}) = \\rho \\cdot \\text{Var}(Y)$' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Дисперсия остатков линейной регрессии на оптимальную ковариату уменьшается в $(1 - \\rho^2)$ раз, где $\\rho$ — корреляция между пре- и пост-периодами.',
      en: 'Optimal residual variance reduction in linear regression against pre-experiment data equals $(1 - \\rho^2)$.',
    },
    tag: 'cuped-math',
  },
  {
    id: 'quiz-ab-3',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Что такое эффект интерференции (SUTVA violation) в A/B тестировании маркетплейсов?',
      en: 'What is a SUTVA violation (interference) in marketplace A/B testing?',
    },
    options: [
      {
        ru: 'Ситуация, когда воздействие на пользователей группы B косвенно меняет метрики контрольной группы A (например, через истощение общего пула свободных курьеров)',
        en: 'A condition where treatment of group B indirectly alters outcomes for control group A via shared supply pools',
      },
      { ru: 'Сбой в сетевом кабеле на сервере', en: 'A physical server networking disconnection' },
      { ru: 'Отказ пользователей открывать мобильное приложение', en: 'Users declining to open the app' },
      { ru: 'Удаление базы данных PostgreSQL', en: 'PostgreSQL database deletion' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'SUTVA (Stable Unit Treatment Value Assumption) требует независимости субъектов. В маркетплейсах спрос группы B забирает общее конечное предложение (курьеры, водители, отели), ухудшая метрики группы A.',
      en: 'SUTVA requires no interference between units; shared supply in two-sided platforms causes treatment spillover into control availability.',
    },
    tag: 'ab-pitfalls',
  },
  {
    id: 'quiz-ab-4',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Для чего в продуктовом эксперименте проводится A/A-тестирование (когда обе группы получают одинаковую исходную версию)?',
      en: 'What is the purpose of A/A testing where both groups receive identical control experiences?',
    },
    options: [
      {
        ru: 'Для проверки корректности сплит-системы, отсутствия скрытых смещений и подтверждения того, что False Positive Rate соответствует уровню alpha',
        en: 'To validate traffic splitting fairness, ensure lack of systemic bias, and verify that Type I error matches alpha',
      },
      { ru: 'Для удвоения выручки компании без изменений', en: 'To double business revenue without code changes' },
      { ru: 'Для тренировки дизайнеров', en: 'To practice UI designing' },
      { ru: 'Для сокращения времени сбора данных в 10 раз', en: 'To speed up data collection 10x' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'A/A-тест проверяет, что система сплитования не имеет скрытых смещений. При многократных симуляциях p-value в A/A тесте должно быть равномерно распределено на отрезке [0, 1].',
      en: 'A/A testing benchmarks the experimentation platform to guarantee unbiased allocation and uniform p-value distributions under the null.',
    },
    tag: 'aa-testing',
  },
];
