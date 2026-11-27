import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const combinatoricsMeta: ModuleMeta = {
  id: 'combinatorics',
  title: {
    ru: 'Комбинаторика и основы математики',
    en: 'Combinatorics & Math Foundations',
  },
  description: {
    ru: 'Комбинаторные правила, сочетания, размещения, бутстрэп и дискретная вероятность для ML и анализа данных.',
    en: 'Combinatorics, permutations, binomial theorem, bootstrap sampling, and discrete math for ML.',
  },
  order: 3,
  icon: 'combinatorics',
  estimatedMinutes: 46,
  isPlaceholder: false,
};

export const combinatoricsLessons: Lesson[] = [
  {
    id: 'comb-1-basics',
    moduleId: 'combinatorics',
    title: {
      ru: 'Правила суммы и произведения, перестановки и сочетания',
      en: 'Sum & Product Rules, Permutations and Combinations',
    },
    order: 1,
    estimatedMinutes: 16,
    draft: false,
    theoryMarkdown: {
      ru: `### Зачем считать варианты, если можно просто запустить поиск?

Комбинаторика отвечает на вопрос «сколько разных вариантов существует?» до того, как вы потратите вычисления. Она спасает от двух крайностей: перебрать лишнее (Grid Search на 10 000 конфигураций) или недооценить пространство и удивиться, почему модель не нашла хорошее решение.

#### 1. Правило суммы: «или»

Если вариант выбирается **либо** из одной группы, **либо** из другой, и группы не пересекаются, количества складываются.

**Пример.** В экспериментальном стенде есть 3 линейные модели (Logistic Regression, Ridge, Lasso) и 4 древовидные (Decision Tree, Random Forest, XGBoost, LightGBM). Нужно выбрать ровно одну модель:
$$3 + 4 = 7 \\text{ вариантов}$$

**Где ловушка.** Если списки пересекаются, складывать нельзя. «Модели с L2-регуляризацией или модели для табличных данных» могут содержать Ridge в обоих списках — его нельзя посчитать дважды.

#### 2. Правило произведения: «и»

Если решение принимается последовательно и каждый следующий выбор не зависит от предыдущего, количества **умножаются**.

**Пример.** Собираем конфигурацию пайплайна:
- 3 варианта масштабирования: StandardScaler, MinMaxScaler, без масштабирования;
- 4 варианта модели;
- 5 значений \`max_depth\`.

$$3 \\cdot 4 \\cdot 5 = 60 \\text{ конфигураций}$$

Добавили ещё 2 варианта порога отсечения — стало 120. Каждый новый параметр **умножает** пространство поиска, а не расширяет его на пару вариантов. Именно поэтому \`RandomizedSearchCV\` часто практичнее полного перебора.

**Быстрая проверка.** Спросите себя: я делаю «это **и** вот это» или «это **или** вот это»? «И» — умножаем, «или» — складываем.

#### 3. Перестановки: порядок важен, берём все элементы

Перестановка упорядочивает **все** $n$ элементов. Первый элемент выбирается $n$ способами, второй — $(n-1)$, ..., последний — одним:
$$P_n = n! = n \\cdot (n-1) \\cdot \\ldots \\cdot 1$$

**Пример.** В пайплайне 4 шага: \`clean → encode → scale → fit\`. Сколько существует порядков их выполнения?
$$P_4 = 4! = 4 \\cdot 3 \\cdot 2 \\cdot 1 = 24$$

**Важная оговорка.** Комбинаторика считает *все* порядки, включая бессмысленные: \`scale\` до \`encode\` может сломать кодирование категорий. Формула даёт верхнюю границу, а ограничения предметной области отсекают невозможные варианты.

**Если элементы повторяются.** В слове \`BANANA\` шесть букв, но \`A\` встречается 3 раза, \`N\` — 2 раза, \`B\` — 1 раз. Перестановки одинаковых букв между собой неразличимы, поэтому результат делим на факториалы повторов:
$$P = \\frac{6!}{3! \\cdot 2! \\cdot 1!} = \\frac{720}{6 \\cdot 2} = 60$$

Тот же приём — для последовательности предсказаний классов. Строка из 10 предсказаний, где 6 «кот», 3 «пёс» и 1 «птица», существует в
$$\\frac{10!}{6! \\cdot 3! \\cdot 1!} = 840 \\text{ вариантах.}$$

Обратите внимание: это ответ на вопрос «сколько разных строк с таким составом классов», а не «какова вероятность».

#### 4. Размещения: порядок важен, но выбираем часть элементов

Из $n$ элементов выбираем $k$, порядок важен:
$$A_n^k = \\frac{n!}{(n-k)!} = n(n-1)\\ldots(n-k+1)$$

**Пример.** Выбираем 2 признака из 10 и строим график: один признак на ось $x$, другой на ось $y$. Для оси $x$ — 10 вариантов, для оси $y$ — 9 оставшихся:
$$A_{10}^2 = 10 \\cdot 9 = 90$$
Пары \`(age, income)\` и \`(income, age)\` — разные графики, поэтому обе считаются.

#### 5. Сочетания: порядок не важен

Если важно только **какие** элементы попали в набор:
$$C_n^k = \\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}$$

**Пример.** Для матрицы парных scatter plot нужны пары признаков, и порядок внутри пары не важен: \`(age, income)\` и \`(income, age)\` дают один и тот же график.
$$C_{10}^2 = \\frac{10 \\cdot 9}{2!} = 45$$

**Связь формул.** Любое сочетание из $k$ элементов можно упорядочить $k!$ способами:
$$A_n^k = C_n^k \\cdot k!$$
В примере: $90 = 45 \\cdot 2!$. Если вы посчитали размещения, а нужны сочетания — разделите на $k!$.

**Сводная таблица.**
| Выбор | Порядок важен | Порядок не важен |
|---|---|---|
| Без повторений | $A_n^k = \\frac{n!}{(n-k)!}$ | $C_n^k = \\frac{n!}{k!\\,(n-k)!}$ |
| С повторениями | $n^k$ | $C_{n+k-1}^{k}$ |

**Примеры на каждую клетку.**
- 4-значный PIN-код: $10^4 = 10\\,000$ (порядок важен, цифры повторяются).
- 2 шара из 5 цветов с возвращением: $C_{5+2-1}^{2} = C_6^2 = 15$ (порядок не важен, повторения разрешены).
- Пароль из 3 разных букв латинского алфавита: $A_{26}^3 = 26 \\cdot 25 \\cdot 24 = 15\\,600$.

#### 6. Бином Ньютона: откуда берутся коэффициенты

**Идея: раскрытие скобок — это последовательность выборов.**
Запишем степень как произведение $n$ одинаковых скобок:
$$(a+b)^n = (a+b)(a+b)\\cdots(a+b)$$
Чтобы раскрыть произведение, из каждой скобки нужно выбрать ровно один член — $a$ или $b$ — и перемножить выбранные. Для $n=3$:
$$(a+b)(a+b)(a+b)$$
Одна ветка раскрытия дает $a \\cdot a \\cdot b = a^2b$. Другая дает $a \\cdot b \\cdot a = a^2b$. Это разные выборы, но одинаковый одночлен, поэтому такие вклады нужно сложить.

**Сколько раз встретится $a^{n-k}b^k$?**
Ровно столько, сколькими способами можно выбрать $k$ скобок из $n$, из которых берется $b$; в остальных $n-k$ скобках берется $a$. Это число сочетаний:
$$C_n^k = \\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}$$
Отсюда и получается формула бинома:
$$(a+b)^n = \\sum_{k=0}^{n} C_n^k\\, a^{n-k} b^k$$

**Полный пайплайн для $n = 3$.**

| Какие скобки дали $b$ | Какие одночлены получаются | Сколько способов |
|---|---|---|
| ни одной | $aaa = a^3$ | $C_3^0 = 1$ |
| одна | $baa,\\ aba,\\ aab$ — все дают $a^2b$ | $C_3^1 = 3$ |
| две | $bba,\\ bab,\\ abb$ — все дают $ab^2$ | $C_3^2 = 3$ |
| три | $bbb = b^3$ | $C_3^3 = 1$ |

Складываем вклады:
$$(a+b)^3 = 1a^3 + 3a^2b + 3ab^2 + 1b^3$$
Числа $1, 3, 3, 1$ — это в точности $C_3^0, C_3^1, C_3^2, C_3^3$.

**Треугольник Паскаля.** Те же коэффициенты удобно считать без факториалов:

| $n$ | Коэффициенты |
|---|---|
| 0 | 1 |
| 1 | 1, 1 |
| 2 | 1, 2, 1 |
| 3 | 1, 3, 3, 1 |
| 4 | 1, 4, 6, 4, 1 |
| 5 | 1, 5, 10, 10, 5, 1 |

Каждое число равно сумме двух чисел над ним. При переходе от $n-1$ к $n$ добавляется новая скобка $(a+b)$: либо в ней берется $b$ (тогда $b$ выбирается из $k-1$ старых скобок), либо берется $a$ (тогда все $k$ выбираются из старых). Отсюда правило Паскаля:
$$C_n^k = C_{n-1}^{k-1} + C_{n-1}^{k}, \\qquad C_n^0 = C_n^n = 1$$

**Проверка для $n = 4$.** Средний коэффициент $C_4^2 = 6$: выбрать 2 скобки из 4, дающие $b$, можно шестью способами. Поэтому:
$$(a+b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$$

**Числовой пример.** Подставим $a = x$, $b = 2$:
$$(x+2)^3 = x^3 + 3x^2 \\cdot 2 + 3x \\cdot 2^2 + 2^3 = x^3 + 6x^2 + 12x + 8$$

**Следствие для Data Science.** Подставим $a = b = 1$:
$$\\sum_{k=0}^{n} C_n^k = 2^n$$
Это количество всех подмножеств из $n$ элементов. Для 20 признаков получается $2^{20} = 1\\,048\\,576$ подмножеств: полный перебор в feature selection невозможен, поэтому используют жадные методы, L1-регуляризацию и отбор по важности.

#### Как решать задачи: три вопроса

1. **Порядок важен?** Да → перестановки или размещения. Нет → сочетания.
2. **Берём все элементы или часть?** Все → перестановки. Часть → размещения или сочетания.
3. **Повторения разрешены?** Да → $n^k$ или $C_{n+k-1}^{k}$. Нет → формулы с факториалами.

**Мини-проверка.** Сколькими способами можно выбрать 3 модели из 8 для ансамбля, если порядок не важен?
$$C_8^3 = \\frac{8 \\cdot 7 \\cdot 6}{3!} = 56$$`,
      en: `### Why count variants before running a search?

Combinatorics answers "how many options exist?" before you spend compute. It prevents two opposite mistakes: brute-forcing far more configurations than needed and underestimating the search space so much that a model never finds a good solution.

#### 1. Sum rule: "or"

If an option is chosen **either** from one group **or** from another, and the groups do not overlap, the counts add up.

**Example.** An experiment setup has 3 linear models (Logistic Regression, Ridge, Lasso) and 4 tree-based models (Decision Tree, Random Forest, XGBoost, LightGBM). You pick exactly one:
$$3 + 4 = 7 \\text{ options}$$

**The trap.** If the lists overlap, you cannot simply add. "Models with L2 regularization or models for tabular data" may contain Ridge in both lists, so counting it twice is wrong.

#### 2. Product rule: "and"

If decisions are made in sequence and each next choice is independent of the previous one, the counts **multiply**.

**Example.** Building a pipeline configuration:
- 3 scaling options: StandardScaler, MinMaxScaler, none;
- 4 model options;
- 5 values of \`max_depth\`.

$$3 \\cdot 4 \\cdot 5 = 60 \\text{ configurations}$$

Add 2 threshold values and you get 120. Every new parameter **multiplies** the search space instead of adding a couple of options. This is why \`RandomizedSearchCV\` is often more practical than an exhaustive grid.

**Quick check.** Ask yourself: am I doing "this **and** that" or "this **or** that"? "And" means multiply, "or" means add.

#### 3. Permutations: order matters, all elements are used

A permutation orders **all** $n$ elements. The first slot has $n$ options, the second has $(n-1)$, and so on:
$$P_n = n! = n \\cdot (n-1) \\cdot \\ldots \\cdot 1$$

**Example.** A pipeline has 4 steps: \`clean → encode → scale → fit\`. How many execution orders exist?
$$P_4 = 4! = 4 \\cdot 3 \\cdot 2 \\cdot 1 = 24$$

**Important caveat.** Combinatorics counts *all* orders, including meaningless ones: running \`scale\` before \`encode\` may break categorical encoding. The formula gives an upper bound; domain constraints remove impossible orders.

**Repeated elements.** The word \`BANANA\` has six letters, but \`A\` appears 3 times, \`N\` 2 times, \`B\` once. Permuting identical letters changes nothing, so divide by the factorials of repeats:
$$P = \\frac{6!}{3! \\cdot 2! \\cdot 1!} = \\frac{720}{6 \\cdot 2} = 60$$

The same trick counts label sequences. A sequence of 10 predictions containing 6 "cat", 3 "dog", and 1 "bird" exists in
$$\\frac{10!}{6! \\cdot 3! \\cdot 1!} = 840 \\text{ ways.}$$

Note that this answers "how many distinct label sequences have this composition", not "what is the probability".

#### 4. Arrangements: order matters, only part of the elements

Choose $k$ out of $n$, order matters:
$$A_n^k = \\frac{n!}{(n-k)!} = n(n-1)\\ldots(n-k+1)$$

**Example.** Pick 2 features out of 10 and plot one on the $x$-axis and the other on the $y$-axis. There are 10 options for $x$ and 9 remaining for $y$:
$$A_{10}^2 = 10 \\cdot 9 = 90$$
\`(age, income)\` and \`(income, age)\` are different charts, so both count.

#### 5. Combinations: order does not matter

If only **which** elements were chosen matters:
$$C_n^k = \\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}$$

**Example.** A pairwise scatter-plot matrix needs feature pairs, and the order inside a pair is irrelevant:
$$C_{10}^2 = \\frac{10 \\cdot 9}{2!} = 45$$

**How the formulas connect.** Every combination of $k$ elements can be ordered in $k!$ ways:
$$A_n^k = C_n^k \\cdot k!$$
In the example: $90 = 45 \\cdot 2!$. If you counted arrangements but need combinations, divide by $k!$.

**Summary table.**
| Selection | Order matters | Order does not matter |
|---|---|---|
| Without repetition | $A_n^k = \\frac{n!}{(n-k)!}$ | $C_n^k = \\frac{n!}{k!\\,(n-k)!}$ |
| With repetition | $n^k$ | $C_{n+k-1}^{k}$ |

**One example per cell.**
- 4-digit PIN: $10^4 = 10\\,000$ (order matters, digits may repeat).
- 2 balls from 5 colors with replacement: $C_{5+2-1}^{2} = C_6^2 = 15$ (order irrelevant, repeats allowed).
- Password of 3 distinct Latin letters: $A_{26}^3 = 26 \\cdot 25 \\cdot 24 = 15\\,600$.

#### 6. Binomial theorem: where the coefficients come from

**The idea: expanding brackets is a sequence of choices.**
Write the power as a product of $n$ identical brackets:
$$(a+b)^n = (a+b)(a+b)\\cdots(a+b)$$
To expand the product, choose exactly one term from each bracket — either $a$ or $b$ — and multiply the choices. For $n=3$:
$$(a+b)(a+b)(a+b)$$
One branch gives $a \\cdot a \\cdot b = a^2b$. Another gives $a \\cdot b \\cdot a = a^2b$. These are different choices but the same monomial, so their contributions must be added.

**How many times does $a^{n-k}b^k$ appear?**
Exactly as many times as there are ways to choose the $k$ brackets out of $n$ that contribute $b$; the remaining $n-k$ brackets contribute $a$. That is the number of combinations:
$$C_n^k = \\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}$$
Hence the binomial formula:
$$(a+b)^n = \\sum_{k=0}^{n} C_n^k\\, a^{n-k} b^k$$

**The full pipeline for $n = 3$.**

| Brackets that gave $b$ | Monomials produced | Number of ways |
|---|---|---|
| none | $aaa = a^3$ | $C_3^0 = 1$ |
| one | $baa,\\ aba,\\ aab$ — all give $a^2b$ | $C_3^1 = 3$ |
| two | $bba,\\ bab,\\ abb$ — all give $ab^2$ | $C_3^2 = 3$ |
| three | $bbb = b^3$ | $C_3^3 = 1$ |

Add the contributions:
$$(a+b)^3 = 1a^3 + 3a^2b + 3ab^2 + 1b^3$$
The numbers $1, 3, 3, 1$ are exactly $C_3^0, C_3^1, C_3^2, C_3^3$.

**Pascal's triangle.** The same coefficients are easy to compute without factorials:

| $n$ | Coefficients |
|---|---|
| 0 | 1 |
| 1 | 1, 1 |
| 2 | 1, 2, 1 |
| 3 | 1, 3, 3, 1 |
| 4 | 1, 4, 6, 4, 1 |
| 5 | 1, 5, 10, 10, 5, 1 |

Each number is the sum of the two numbers above it. When moving from $n-1$ to $n$, a new bracket $(a+b)$ is added: either it contributes $b$ (then $b$ is chosen from $k-1$ old brackets), or it contributes $a$ (then all $k$ are chosen from the old brackets). This gives Pascal's rule:
$$C_n^k = C_{n-1}^{k-1} + C_{n-1}^{k}, \\qquad C_n^0 = C_n^n = 1$$

**Check for $n = 4$.** The middle coefficient $C_4^2 = 6$: there are six ways to choose 2 of 4 brackets for $b$. Therefore:
$$(a+b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$$

**A numeric example.** Substitute $a = x$, $b = 2$:
$$(x+2)^3 = x^3 + 3x^2 \\cdot 2 + 3x \\cdot 2^2 + 2^3 = x^3 + 6x^2 + 12x + 8$$

**A Data Science consequence.** Setting $a = b = 1$ gives
$$\\sum_{k=0}^{n} C_n^k = 2^n$$
which is the number of all subsets of $n$ elements. For 20 features that is $2^{20} = 1\\,048\\,576$ subsets: exhaustive feature selection is infeasible, which is why greedy methods, L1 regularization, and importance-based selection exist.

#### How to solve: three questions

1. **Does order matter?** Yes → permutations or arrangements. No → combinations.
2. **Do we use all elements or only some?** All → permutations. Some → arrangements or combinations.
3. **Are repetitions allowed?** Yes → $n^k$ or $C_{n+k-1}^{k}$. No → factorial formulas.

**Quick check.** How many ways can you choose 3 models out of 8 for an ensemble if order does not matter?
$$C_8^3 = \\frac{8 \\cdot 7 \\cdot 6}{3!} = 56$$`,
    },
    commonMistakes: [
      {
        ru: 'Путать сочетания $C_n^k$ (порядок не важен) и размещения $A_n^k$ (порядок важен).',
        en: 'Confusing combinations $C_n^k$ (order does not matter) with arrangements $A_n^k$ (order matters).',
      },
      {
        ru: 'Забывать факториал $0! = 1$ при вычислении $C_n^0$ или $C_n^n$.',
        en: 'Forgetting that $0! = 1$ when evaluating $C_n^0$ or $C_n^n$.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'comb-cp-1',
        question: {
          ru: 'Сколькими способами можно выбрать 2 признака из 10 для построения пары в scatter plot (порядок осей не важен)?',
          en: 'How many ways can 2 features be chosen from 10 for a pairwise scatter plot (axis order does not matter)?',
        },
        options: [
          { ru: '45', en: '45' },
          { ru: '90', en: '90' },
          { ru: '20', en: '20' },
          { ru: '100', en: '100' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Используем число сочетаний без учёта порядка: $C_{10}^2 = \\frac{10 \\cdot 9}{2} = 45$.',
          en: 'We calculate combinations without order: $C_{10}^2 = \\frac{10 \\times 9}{2} = 45$.',
        },
      },
      {
        id: 'comb-cp-2',
        question: {
          ru: 'Чему равно значение $0!$ (ноль факториал)?',
          en: 'What is the value of $0!$ (zero factorial)?',
        },
        options: [
          { ru: '1', en: '1' },
          { ru: '0', en: '0' },
          { ru: 'Не определено', en: 'Undefined' },
          { ru: 'Бесконечность', en: 'Infinity' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'По определению комбинаторики и гамма-функции $0! = 1$. Это обеспечивает корректность формул $C_n^0 = 1$ и $C_n^n = 1$.',
          en: 'By definition in combinatorics and the Gamma function $\\Gamma(1)=1$, $0! = 1$, ensuring consistency in $C_n^0=1$.',
        },
      },
    ],
  },
  {
    id: 'comb-2-sampling',
    moduleId: 'combinatorics',
    title: {
      ru: 'Комбинаторика в сэмплировании: Bootstrap и K-Fold',
      en: 'Combinatorics in Sampling: Bootstrap & K-Fold',
    },
    order: 2,
    estimatedMinutes: 15,
    draft: false,
    theoryMarkdown: {
      ru: `### Сэмплирование — это тоже подсчёт вариантов

Бутстрэп и кросс-валидация выглядят как «просто случайные разбиения», но за ними стоят комбинаторные вероятности. Эти числа объясняют, почему в Random Forest бесплатно появляется валидационная выборка и почему 5 фолдов — разумный компромисс.

#### 1. Бутстрэп: выборка с возвращением

Идея бутстрэпа: из исходной выборки размера $N$ делают новую выборку тоже размера $N$, но каждый элемент выбирают **с возвращением**. Один и тот же объект может попасть несколько раз, а часть объектов не попадёт ни разу.

Какова вероятность, что конкретный объект **не попадёт** в бутстрэп-выборку?
1. За один розыгрыш его не выбрали с вероятностью $1 - \\frac{1}{N}$.
2. Розыгрыши независимы, поэтому за $N$ шагов:
$$P(\\text{не попал}) = \\left(1 - \\frac{1}{N}\\right)^N$$
3. При больших $N$ это выражение стремится к $e^{-1}$:
$$\\lim_{N \\to \\infty} \\left(1 - \\frac{1}{N}\\right)^N = e^{-1} \\approx 0.368$$

**Численный пример.** Посмотрим, как быстро сходится формула:
| Размер выборки $N$ | $\\left(1 - \\frac{1}{N}\\right)^N$ | Доля OOB |
|---|---|---|
| 3 | 0.2963 | 29.6% |
| 10 | 0.3487 | 34.9% |
| 100 | 0.3660 | 36.6% |
| 1000 | 0.3677 | 36.8% |
| $\\infty$ | $e^{-1}$ | 36.8% |

Уже при $N = 100$ значение практически совпадает с $1/e$. Поэтому в учебниках пишут «примерно 37%», не уточняя размер датасета.

**Что это значит на практике.**
- Около $63.2\\%$ **уникальных** объектов попадают в бутстрэп-выборку (с учётом повторов длина всё равно $N$).
- Около $36.8\\%$ остаются **Out-of-Bag (OOB)**.
- В Random Forest каждое дерево обучается на своей бутстрэп-выборке, а OOB-объекты этого дерева дают бесплатную оценку качества без отдельного validation-набора.

**Мини-расчёт.** В датасете 500 строк. Ожидаемое число уникальных объектов в бутстрэп-выборке:
$$500 \\cdot (1 - e^{-1}) \\approx 500 \\cdot 0.632 = 316$$
То есть примерно 184 строки окажутся OOB.

#### 2. K-Fold: разбиение без пересечений

В K-Fold выборка делится на $K$ равных непересекающихся фолдов. Модель обучается $K$ раз: каждый раз один фолд служит валидацией, остальные $K-1$ — обучением.

**Пример.** 1000 строк, $K = 5$:
- размер фолда: $1000 / 5 = 200$;
- обучение: $1000 - 200 = 800$ строк;
- валидация: 200 строк;
- всего обучений: 5, и каждая строка ровно один раз побывает в валидации.

При $K = 10$: обучение на 900 строках, валидация на 100. Больше $K$ — меньше смещение оценки, но больше вычислений. $K = 5$ или $10$ — стандартный компромисс.

**Что делать, если $N$ не делится на $K$.** Фолды делают почти равными: например, 23 строки и 5 фолдов дают размеры \`5, 5, 5, 4, 4\`. Разница в один объект — норма.

#### 3. Стратификация: сохраняем доли классов

При дисбалансе классов случайное разбиение может сильно исказить доли. Представьте 1000 строк, из них 10% положительного класса (100 объектов). В фолде из 200 объектов ожидается 20 положительных, но при случайном разбиении легко получить 12 или 30.

Разброс числа положительных в фолде описывается гипергеометрическим распределением:
$$\\text{Var}(X) = n \\cdot p(1-p) \\cdot \\frac{N-n}{N-1}$$
Для $N = 1000$, $n = 200$, $p = 0.1$:
$$\\text{Var}(X) = 200 \\cdot 0.1 \\cdot 0.9 \\cdot \\frac{800}{999} \\approx 14.4, \\quad \\sigma_X \\approx 3.8$$
То есть вместо ожидаемых 20 объектов типичный разброс — примерно $20 \\pm 4$. Stratified K-Fold фиксирует ровно 20 в каждом фолде и убирает этот источник шума.

#### 4. Где комбинаторика ломается: зависимости во времени

Обычный бутстрэп и случайный K-Fold предполагают, что объекты **обмениваемы** (i.i.d.). Для временных рядов это не так: случайное перемешивание уничтожает автокорреляцию и даёт оптимистичную оценку. Поэтому используют:
- **TimeSeriesSplit** — обучение только на прошлом, валидация на будущем;
- **Block bootstrap** — пересэмплирование целыми блоками, а не отдельными точками.

#### 5. Практический чек-лист

- Средний датасет, сбалансированные классы: \`StratifiedKFold(n_splits=5)\`.
- Нужна доверительная оценка метрики: bootstrap по предсказаниям (1000–2000 итераций) и перцентили распределения.
- Много данных, дорогое обучение: $K = 3$ или однократный hold-out.
- Временной ряд: только последовательные разбиения.

**Мини-проверка.** Датасет из 200 объектов, $K = 4$. Сколько объектов в валидации на каждой итерации и сколько всего обучений? Ответ: $200 / 4 = 50$ объектов в валидации, 4 обучения, каждое на 150 объектах.`,
      en: `### Sampling is also counting

Bootstrap and cross-validation look like "just random splits", but their behaviour comes from combinatorial probabilities. These numbers explain why Random Forest gets a free validation set and why 5 folds are a sensible default.

#### 1. Bootstrap: sampling with replacement

From a dataset of size $N$, draw a new sample of size $N$, choosing each element **with replacement**. The same object may appear several times, while some objects never appear.

What is the probability that a specific object is **left out** of the bootstrap sample?
1. On one draw it is not chosen with probability $1 - \\frac{1}{N}$.
2. Draws are independent, so over $N$ draws:
$$P(\\text{omitted}) = \\left(1 - \\frac{1}{N}\\right)^N$$
3. For large $N$ this tends to $e^{-1}$:
$$\\lim_{N \\to \\infty} \\left(1 - \\frac{1}{N}\\right)^N = e^{-1} \\approx 0.368$$

**Numerical example.** How fast does the formula converge?
| Sample size $N$ | $\\left(1 - \\frac{1}{N}\\right)^N$ | OOB share |
|---|---|---|
| 3 | 0.2963 | 29.6% |
| 10 | 0.3487 | 34.9% |
| 100 | 0.3660 | 36.6% |
| 1000 | 0.3677 | 36.8% |
| $\\infty$ | $e^{-1}$ | 36.8% |

Already at $N = 100$ the value is essentially $1/e$, which is why textbooks say "about 37%" without mentioning dataset size.

**What it means in practice.**
- Roughly $63.2\\%$ of **unique** objects appear in the bootstrap sample (its length is still $N$ because of duplicates).
- Roughly $36.8\\%$ remain **Out-of-Bag (OOB)**.
- In Random Forest each tree trains on its own bootstrap sample, and that tree's OOB objects provide a free estimate of validation quality without a separate hold-out set.

**Mini calculation.** A dataset has 500 rows. Expected unique objects in a bootstrap sample:
$$500 \\cdot (1 - e^{-1}) \\approx 500 \\cdot 0.632 = 316$$
So about 184 rows are OOB.

#### 2. K-Fold: partition without overlap

K-Fold splits the data into $K$ equal non-overlapping folds. The model trains $K$ times: each time one fold is validation and the other $K-1$ folds are training.

**Example.** 1000 rows, $K = 5$:
- fold size: $1000 / 5 = 200$;
- training: $1000 - 200 = 800$ rows;
- validation: 200 rows;
- total fits: 5, and every row is used for validation exactly once.

With $K = 10$: train on 900 rows, validate on 100. Larger $K$ reduces bias but costs compute. $K = 5$ or $10$ is the standard trade-off.

**When $N$ is not divisible by $K$.** Folds are made nearly equal: 23 rows with 5 folds give sizes \`5, 5, 5, 4, 4\`. A difference of one object is normal.

#### 3. Stratification: preserving class proportions

With imbalanced classes, a random split can distort proportions. Consider 1000 rows with 10% positive class (100 objects). A fold of 200 rows expects 20 positives, but a random split can easily produce 12 or 30.

The number of positives in a fold follows a hypergeometric distribution:
$$\\text{Var}(X) = n \\cdot p(1-p) \\cdot \\frac{N-n}{N-1}$$
For $N = 1000$, $n = 200$, $p = 0.1$:
$$\\text{Var}(X) = 200 \\cdot 0.1 \\cdot 0.9 \\cdot \\frac{800}{999} \\approx 14.4, \\quad \\sigma_X \\approx 3.8$$
Instead of 20 positives you typically get $20 \\pm 4$. Stratified K-Fold fixes exactly 20 in every fold and removes this source of noise.

#### 4. Where combinatorics breaks: temporal dependence

Standard bootstrap and random K-Fold assume objects are **exchangeable** (i.i.d.). Time series are not: shuffling destroys autocorrelation and yields optimistic estimates. Use instead:
- **TimeSeriesSplit** — train only on the past, validate on the future;
- **Block bootstrap** — resample whole blocks rather than individual points.

#### 5. Practical checklist

- Medium dataset, balanced classes: \`StratifiedKFold(n_splits=5)\`.
- Need a confidence interval for a metric: bootstrap the predictions (1000–2000 iterations) and take percentiles.
- Large data, expensive training: $K = 3$ or a single hold-out split.
- Time series: sequential splits only.

**Quick check.** A dataset has 200 objects, $K = 4$. How many objects are in validation per iteration and how many fits are performed? Answer: $200 / 4 = 50$ objects in validation, 4 fits, each on 150 objects.`,
    },
    commonMistakes: [
      {
        ru: 'Думать, что бутстрэп покрывает 100% данных — на самом деле лишь около 63.2%.',
        en: 'Assuming bootstrap samples cover 100% of unique data — in reality it is only $\\approx 63.2\\%$.',
      },
      {
        ru: 'Забывать, что OOB-оценка возможна только при сэмплировании с возвращением.',
        en: 'Forgetting that OOB evaluation requires sampling with replacement.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'comb-cp-3',
        question: {
          ru: 'Какая примерная доля объектов исходной выборки не попадает в бутстрэп-выборку при достаточно большом $N$?',
          en: 'What approximate percentage of original dataset samples are left out of a bootstrap draw for large $N$?',
        },
        options: [
          { ru: 'Примерно 36.8% (1/e)', en: 'Approximately 36.8% (1/e)' },
          { ru: 'Примерно 50%', en: 'Approximately 50%' },
          { ru: 'Примерно 10%', en: 'Approximately 10%' },
          { ru: '0% — попадают все', en: '0% — all are included' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Вероятность не выбрать объект за N шагов с возвращением стремится к $(1 - 1/N)^N \\to 1/e \\approx 0.368$ (36.8%).',
          en: 'Probability of omitting an element over $N$ draws converges to $(1 - 1/N)^N \\to 1/e \\approx 36.8\\%$.',
        },
      },
    ],
  },
  {
    id: 'comb-3-discrete-distr',
    moduleId: 'combinatorics',
    title: {
      ru: 'Дискретные распределения: Бернулли и Биномиальное',
      en: 'Discrete Distributions: Bernoulli and Binomial',
    },
    order: 3,
    estimatedMinutes: 15,
    draft: false,
    theoryMarkdown: {
      ru: `### От одного испытания к серии

Дискретные распределения описывают счётные исходы: «кликнул / не кликнул», «сколько писем из 10 оказались спамом», «сколько объектов из 10 модель отнесла к каждому из трёх классов». Начнём с одного испытания и постепенно усложним.

#### 1. Распределение Бернулли: один опыт с двумя исходами

Один опыт: «успех» с вероятностью $p$ (обозначим $Y = 1$) и «неуспех» с вероятностью $q = 1 - p$ ($Y = 0$).

**Пример.** Пользователь видит баннер. Вероятность клика $p = 0.04$. Тогда:
- $\\mathbb{E}[Y] = p = 0.04$ — ожидаемая доля кликов;
- $\\text{Var}(Y) = p(1-p) = 0.04 \\cdot 0.96 = 0.0384$;
- стандартное отклонение: $\\sqrt{0.0384} \\approx 0.196$.

**Почему дисперсия максимальна при $p = 0.5$.** Функция $p(1-p)$ — парабола с вершиной в $p = 0.5$, где $\\text{Var} = 0.25$. При $p = 0.01$ или $p = 0.99$ исход почти предсказуем, и дисперсия близка к нулю.

#### 2. Биномиальное распределение: серия независимых испытаний

Пусть проведено $n$ независимых испытаний Бернулли с одной и той же вероятностью $p$. Случайная величина $X$ — число успехов. Тогда
$$P(X = k) = C_n^k\\, p^k (1-p)^{n-k}$$

**Почему нужен коэффициент $C_n^k$.** Он считает, сколькими способами $k$ успехов могут расположиться среди $n$ испытаний. Без него вы получите вероятность **одной конкретной** последовательности, а не всех последовательностей с $k$ успехами.

**Разобранный пример.** Спам-фильтр проверяет 10 писем, вероятность спама $p = 0.3$. Какова вероятность, что ровно 3 письма — спам?
1. Коэффициент: $C_{10}^3 = \\frac{10 \\cdot 9 \\cdot 8}{3!} = 120$.
2. Вероятность одной последовательности: $0.3^3 \\cdot 0.7^7 = 0.027 \\cdot 0.08235 \\approx 0.00222$.
3. Умножаем на число последовательностей:
$$P(X = 3) = 120 \\cdot 0.00222 \\approx 0.2668$$

Без коэффициента ответ был бы в 120 раз меньше — типичная ошибка.

**Свойства.**
- $\\mathbb{E}[X] = np = 10 \\cdot 0.3 = 3$ письма;
- $\\text{Var}(X) = np(1-p) = 10 \\cdot 0.3 \\cdot 0.7 = 2.1$;
- $\\sigma_X = \\sqrt{2.1} \\approx 1.45$ письма.

**Ещё один пример.** Модель отвечает верно с вероятностью $0.9$ на 20 объектах. Ожидаемое число верных ответов $20 \\cdot 0.9 = 18$, разброс $\\sigma = \\sqrt{20 \\cdot 0.9 \\cdot 0.1} = \\sqrt{1.8} \\approx 1.34$.

**Форма распределения.**
- При $p = 0.5$ распределение симметрично.
- При $p \\ne 0.5$ появляется асимметрия, но с ростом $n$ форма приближается к нормальной.
- Практическое правило: если $np > 5$ и $n(1-p) > 5$, можно пользоваться нормальным приближением.

**Почему важна не только средняя точность.** Два классификатора могут иметь одинаковую точность 80%, но разную неопределённость. При $n = 10$ стандартная ошибка доли равна $\\sqrt{p(1-p)/n} = \\sqrt{0.8 \\cdot 0.2 / 10} \\approx 0.126$; при $n = 100$ — уже $0.04$. Поэтому «8 из 10» и «80 из 100» дают разную уверенность, хотя доля одна и та же.

**Кумулятивная вероятность.** Часто нужен ответ «хотя бы $k$ успехов»:
$$P(X \\ge k) = \\sum_{i=k}^{n} C_n^i\\, p^i (1-p)^{n-i}$$
Считать удобно через дополнение: $P(X \\ge 3) = 1 - P(X \\le 2)$.

#### 3. Полиномиальное распределение: несколько исходов

Если исходов не два, а $m$ (например, три класса), и вероятности $p_1, \\dots, p_m$ таковы, что $\\sum p_i = 1$, то вероятность получить конкретный вектор счётчиков $(k_1, \\dots, k_m)$ при $\\sum k_i = n$:
$$P(k_1, \\dots, k_m) = \\frac{n!}{k_1!\\, k_2! \\cdots k_m!}\\, p_1^{k_1} p_2^{k_2} \\cdots p_m^{k_m}$$

**Пример.** Три класса с вероятностями $0.5$, $0.3$, $0.2$. На 10 объектах получили счётчики $5$, $3$, $2$.
1. Мультиномиальный коэффициент:
$$\\frac{10!}{5!\\,3!\\,2!} = \\frac{3\\,628\\,800}{120 \\cdot 6 \\cdot 2} = 2520$$
2. Произведение вероятностей: $0.5^5 \\cdot 0.3^3 \\cdot 0.2^2 = 0.03125 \\cdot 0.027 \\cdot 0.04 = 0.00003375$.
3. Итог: $2520 \\cdot 0.00003375 \\approx 0.085$.

**Связь с глубоким обучением.** Функция потерь Cross-Entropy — это отрицательный логарифм правдоподобия:
$$\\mathcal{L} = -\\log P = -\\sum_{i=1}^{m} k_i \\log p_i + \\text{const}$$
Минимизация $\\mathcal{L}$ максимизирует вероятность наблюдаемых счётчиков. Именно поэтому softmax-выход и кросс-энтропия — стандартная пара для мультиклассовой классификации.

#### 4. Как выбирать распределение

| Ситуация | Распределение |
|---|---|
| Один бинарный исход (клик / нет) | Бернулли |
| Число успехов в $n$ независимых испытаниях | Биномиальное |
| Счётчики по $m$ классам при фиксированном $n$ | Полиномиальное |
| Число редких событий за интервал | Пуассона |

**Мини-проверка.** Монету подбрасывают 5 раз, $p = 0.5$. Какова вероятность ровно 2 орлов?
$$C_5^2 \\cdot 0.5^2 \\cdot 0.5^3 = 10 \\cdot 0.03125 = 0.3125$$`,
      en: `### From a single trial to a series

Discrete distributions describe countable outcomes: "clicked / did not click", "how many of 10 emails are spam", "how many of 10 objects the model assigned to each of three classes". Start with one trial and build up.

#### 1. Bernoulli distribution: one trial, two outcomes

One trial: "success" with probability $p$ ($Y = 1$) and "failure" with probability $q = 1 - p$ ($Y = 0$).

**Example.** A user sees a banner. Click probability $p = 0.04$. Then:
- $\\mathbb{E}[Y] = p = 0.04$ — expected click share;
- $\\text{Var}(Y) = p(1-p) = 0.04 \\cdot 0.96 = 0.0384$;
- standard deviation: $\\sqrt{0.0384} \\approx 0.196$.

**Why variance peaks at $p = 0.5$.** The function $p(1-p)$ is a parabola with its vertex at $p = 0.5$, where $\\text{Var} = 0.25$. At $p = 0.01$ or $p = 0.99$ the outcome is almost predictable, so variance is near zero.

#### 2. Binomial distribution: a series of independent trials

Run $n$ independent Bernoulli trials with the same success probability $p$. Let $X$ be the number of successes:
$$P(X = k) = C_n^k\\, p^k (1-p)^{n-k}$$

**Why the coefficient $C_n^k$ is needed.** It counts how many ways $k$ successes can be placed among $n$ trials. Without it you get the probability of **one specific** sequence, not of all sequences with $k$ successes.

**Worked example.** A spam filter checks 10 emails, spam probability $p = 0.3$. What is the probability that exactly 3 are spam?
1. Coefficient: $C_{10}^3 = \\frac{10 \\cdot 9 \\cdot 8}{3!} = 120$.
2. Probability of one sequence: $0.3^3 \\cdot 0.7^7 = 0.027 \\cdot 0.08235 \\approx 0.00222$.
3. Multiply by the number of sequences:
$$P(X = 3) = 120 \\cdot 0.00222 \\approx 0.2668$$

Without the coefficient the answer would be 120 times smaller — a classic mistake.

**Properties.**
- $\\mathbb{E}[X] = np = 10 \\cdot 0.3 = 3$ emails;
- $\\text{Var}(X) = np(1-p) = 10 \\cdot 0.3 \\cdot 0.7 = 2.1$;
- $\\sigma_X = \\sqrt{2.1} \\approx 1.45$ emails.

**Another example.** A model is correct with probability $0.9$ on 20 objects. Expected correct answers: $20 \\cdot 0.9 = 18$, spread $\\sigma = \\sqrt{20 \\cdot 0.9 \\cdot 0.1} = \\sqrt{1.8} \\approx 1.34$.

**Shape.**
- At $p = 0.5$ the distribution is symmetric.
- At $p \\ne 0.5$ it is skewed, but as $n$ grows it approaches a normal shape.
- Rule of thumb: if $np > 5$ and $n(1-p) > 5$, the normal approximation is reasonable.

**Why uncertainty matters as much as mean accuracy.** Two classifiers can both be 80% accurate but differ in uncertainty. With $n = 10$ the standard error of the proportion is $\\sqrt{p(1-p)/n} = \\sqrt{0.8 \\cdot 0.2 / 10} \\approx 0.126$; with $n = 100$ it is $0.04$. So "8 out of 10" and "80 out of 100" carry different confidence even though the share is the same.

**Cumulative probability.** Often you need "at least $k$ successes":
$$P(X \\ge k) = \\sum_{i=k}^{n} C_n^i\\, p^i (1-p)^{n-i}$$
Computing via the complement is usually easier: $P(X \\ge 3) = 1 - P(X \\le 2)$.

#### 3. Multinomial distribution: more than two outcomes

With $m$ outcomes (for example, three classes) and probabilities $p_1, \\dots, p_m$ such that $\\sum p_i = 1$, the probability of a specific count vector $(k_1, \\dots, k_m)$ with $\\sum k_i = n$ is
$$P(k_1, \\dots, k_m) = \\frac{n!}{k_1!\\, k_2! \\cdots k_m!}\\, p_1^{k_1} p_2^{k_2} \\cdots p_m^{k_m}$$

**Example.** Three classes with probabilities $0.5$, $0.3$, $0.2$. On 10 objects the counts are $5$, $3$, $2$.
1. Multinomial coefficient:
$$\\frac{10!}{5!\\,3!\\,2!} = \\frac{3\\,628\\,800}{120 \\cdot 6 \\cdot 2} = 2520$$
2. Probability product: $0.5^5 \\cdot 0.3^3 \\cdot 0.2^2 = 0.03125 \\cdot 0.027 \\cdot 0.04 = 0.00003375$.
3. Result: $2520 \\cdot 0.00003375 \\approx 0.085$.

**Connection to deep learning.** Cross-entropy loss is the negative log-likelihood:
$$\\mathcal{L} = -\\log P = -\\sum_{i=1}^{m} k_i \\log p_i + \\text{const}$$
Minimizing $\\mathcal{L}$ maximizes the likelihood of the observed counts. That is why softmax outputs and cross-entropy are the standard pair for multi-class classification.

#### 4. Choosing a distribution

| Situation | Distribution |
|---|---|
| One binary outcome (click / no click) | Bernoulli |
| Number of successes in $n$ independent trials | Binomial |
| Counts across $m$ classes with fixed $n$ | Multinomial |
| Number of rare events per interval | Poisson |

**Quick check.** A fair coin is flipped 5 times, $p = 0.5$. What is the probability of exactly 2 heads?
$$C_5^2 \\cdot 0.5^2 \\cdot 0.5^3 = 10 \\cdot 0.03125 = 0.3125$$`,
    },
    commonMistakes: [
      {
        ru: 'Забывать биномиальный коэффициент $C_n^k$ в формуле Бернулли, рассчитывая только $p^k (1-p)^{n-k}$.',
        en: 'Forgetting the binomial coefficient $C_n^k$ in the Bernoulli formula, evaluating only $p^k(1-p)^{n-k}$.',
      },
      {
        ru: 'Забывать, что максимальная дисперсия испытания Бернулли достигается при $p = 0.5$ и равна $0.25$.',
        en: 'Forgetting that Bernoulli variance peaks at $p = 0.5$ with value $0.25$.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'comb-cp-4',
        question: {
          ru: 'При каком значении вероятности $p$ дисперсия схемы Бернулли $\\text{Var}(Y) = p(1-p)$ максимальна?',
          en: 'At what probability value $p$ does Bernoulli variance $\\text{Var}(Y) = p(1-p)$ reach its maximum?',
        },
        options: [
          { ru: 'p = 0.5', en: 'p = 0.5' },
          { ru: 'p = 1.0', en: 'p = 1.0' },
          { ru: 'p = 0.0', en: 'p = 0.0' },
          { ru: 'p = 0.75', en: 'p = 0.75' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Функция $f(p) = p - p^2$ имеет вершину параболы в точке $p = 0.5$, где дисперсия достигает максимума $0.25$.',
          en: 'The parabola $f(p) = p - p^2$ reaches its peak at $p = 0.5$, yielding maximum variance $0.25$.',
        },
      },
    ],
  },
];

export const combinatoricsCards: Card[] = [
  {
    id: 'comb-card-1',
    moduleId: 'combinatorics',
    lessonId: 'comb-1-basics',
    type: 'flip',
    front: {
      ru: 'Чем принципиально отличаются сочетания $C_n^k$ от размещений $A_n^k$?',
      en: 'What is the fundamental difference between combinations $C_n^k$ and arrangements $A_n^k$?',
    },
    back: {
      ru: 'В **размещениях** $A_n^k$ порядок выбранных элементов важен ($A_n^k = \\frac{n!}{(n-k)!}$), а в **сочетаниях** $C_n^k$ порядок не имеет значения ($C_n^k = \\frac{n!}{k!(n-k)!}$).',
      en: 'In **arrangements** $A_n^k$, order matters ($A_n^k = \\frac{n!}{(n-k)!}$), while in **combinations** $C_n^k$, order does not matter ($C_n^k = \\frac{n!}{k!(n-k)!}$).',
    },
    tags: ['combinatorics', 'formulas'],
  },
  {
    id: 'comb-card-2',
    moduleId: 'combinatorics',
    lessonId: 'comb-2-sampling',
    type: 'cloze',
    clozeText: {
      ru: 'В сэмплировании бутстрэпа с возвращением доля объектов, не вошедших в подвыборку (OOB), стремится к {{c1::36.8%}} ($1/e$).',
      en: 'In bootstrap sampling with replacement, the expected proportion of out-of-bag (OOB) samples approaches {{c1::36.8%}} ($1/e$).',
    },
    answer: {
      ru: '36.8%',
      en: '36.8%',
    },
    tags: ['bootstrap', 'sampling'],
  },
  {
    id: 'comb-card-3',
    moduleId: 'combinatorics',
    lessonId: 'comb-3-discrete-distr',
    type: 'cloze',
    clozeText: {
      ru: 'Математическое ожидание биномиального распределения с $n$ испытаниями и вероятностью успеха $p$ равно {{c1::n * p}}.',
      en: 'The expected value of a binomial distribution with $n$ trials and success probability $p$ is {{c1::n * p}}.',
    },
    answer: {
      ru: 'n * p',
      en: 'n * p',
    },
    tags: ['probability', 'binomial'],
  },
  {
    id: 'comb-card-4',
    moduleId: 'combinatorics',
    lessonId: 'comb-1-basics',
    type: 'flip',
    front: {
      ru: 'Чему равна сумма всех биномиальных коэффициентов $\\sum_{k=0}^n C_n^k$?',
      en: 'What is the sum of all binomial coefficients $\\sum_{k=0}^n C_n^k$?',
    },
    back: {
      ru: 'Сумма равна $2^n$ (общее число всех возможных подмножеств множества из $n$ элементов).',
      en: 'The sum equals $2^n$ (the cardinality of the powerset of an $n$-element set).',
    },
    tags: ['combinatorics', 'sets'],
  },
  {
    id: 'comb-card-5',
    moduleId: 'combinatorics',
    lessonId: 'comb-2-sampling',
    type: 'flip',
    front: {
      ru: 'Что такое Out-of-Bag (OOB) ошибка в Random Forest?',
      en: 'What is Out-of-Bag (OOB) error in Random Forest?',
    },
    back: {
      ru: 'Это оценка качества ансамбля на объектах, которые не попали в бутстрэп-обучающую выборку конкретного дерева (примерно 37% данных для каждого дерева).',
      en: 'It is the validation error evaluated on samples that were left out of each individual tree bootstrap sample (~37% per tree).',
    },
    tags: ['random-forest', 'oob'],
  },
];

export const combinatoricsQuiz: QuizQuestion[] = [
  {
    id: 'comb-q-1',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Сколькими способами можно переставить 4 различных гиперпараметра в пайплайне?',
      en: 'How many ways can 4 distinct hyperparameters be ordered in a pipeline?',
    },
    options: [
      { ru: '24', en: '24' },
      { ru: '16', en: '16' },
      { ru: '12', en: '12' },
      { ru: '4', en: '4' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Число перестановок без повторений $P_4 = 4! = 4 \\cdot 3 \\cdot 2 \\cdot 1 = 24$.',
      en: 'Permutations without repetition: $P_4 = 4! = 24$.',
    },
    tag: 'combinatorics',
  },
  {
    id: 'comb-q-2',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Почему бутстрэп-выборка содержит в среднем лишь около 63.2% уникальных объектов исходного датасета?',
      en: 'Why does a bootstrap sample contain only about 63.2% of unique original dataset objects on average?',
    },
    options: [
      {
        ru: 'Потому что вероятность не выбрать элемент за $N$ шагов с возвращением равна $(1 - 1/N)^N \\to 1/e \\approx 0.368$',
        en: 'Because the probability of not selecting an item over $N$ draws with replacement converges to $(1 - 1/N)^N \\to 1/e \\approx 0.368$',
      },
      {
        ru: 'Потому что генератор псевдослучайных чисел отсекает крайние квантили',
        en: 'Because pseudorandom generators truncate extreme quantiles',
      },
      {
        ru: 'Это эмпирическое правило для нормального распределения',
        en: 'It is an empirical rule specific to Gaussian distributions',
      },
      {
        ru: 'Из-за округления размера батча',
        en: 'Due to batch size rounding',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Вероятность объекта ни разу не быть выбранным за $N$ независимых испытаний с возвращением равна $(1 - 1/N)^N \\to 1/e \\approx 36.8\\%$. Доля вошедших: $1 - 1/e \\approx 63.2\\%$.',
      en: 'The probability of an item being omitted over $N$ draws with replacement approaches $1/e \\approx 36.8\\%$. The included proportion is $1 - 1/e \\approx 63.2\\%$.',
    },
    tag: 'bootstrap',
  },
  {
    id: 'comb-q-3',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Чему равна дисперсия случайной величины $X$, распределенной по закону Бернулли с параметром $p = 0.2$?',
      en: 'What is the variance of a Bernoulli random variable $X$ with success probability $p = 0.2$?',
    },
    options: [
      { ru: '0.16', en: '0.16' },
      { ru: '0.20', en: '0.20' },
      { ru: '0.04', en: '0.04' },
      { ru: '0.80', en: '0.80' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Дисперсия распределения Бернулли: $\\text{Var}(X) = p(1 - p) = 0.2 \\cdot 0.8 = 0.16$.',
      en: 'Variance of a Bernoulli variable is $\\text{Var}(X) = p(1 - p) = 0.2 \\times 0.8 = 0.16$.',
    },
    tag: 'probability',
  },
];
