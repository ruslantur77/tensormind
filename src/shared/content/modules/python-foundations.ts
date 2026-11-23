import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const pythonFoundationsMeta: ModuleMeta = {
  id: 'python-foundations',
  title: {
    ru: 'Основы Python для Data Science и ML',
    en: 'Python Foundations for Data Science & ML',
  },
  description: {
    ru: 'Фундаментальный базис языка: строгая динамическая типизация, модель памяти, структуры данных (List, Dict, Set), comprehensions, генераторы, декораторы, ООП, а также алгоритмы на деревьях (BST, DFS, BFS) и графах (DAG, топологическая сортировка) для ML-собеседований.',
    en: 'Core language foundations: dynamic typing, memory model, data structures (List, Dict, Set), comprehensions, generators, decorators, OOP, plus tree algorithms (BST, DFS, BFS) and graph theory (DAG, topological sort) for ML technical interviews.',
  },
  order: 1,
  icon: 'python-foundations',
  estimatedMinutes: 125,
  isPlaceholder: false,
};

export const pythonFoundationsLessons: Lesson[] = [
  {
    id: 'py-1-syntax-memory',
    moduleId: 'python-foundations',
    title: {
      ru: 'Синтаксис, строгая динамическая типизация и модель памяти Python',
      en: 'Syntax, Strong Dynamic Typing & Python Memory Model',
    },
    order: 1,
    estimatedMinutes: 15,
    draft: false,
    theoryMarkdown: {
      ru: `### Всё в Python — это объект

Python обладает **динамической строгой типизацией**:
* **Динамическая:** тип переменной определяется во время выполнения при присваивании значения, а не при компиляции.
* **Строгая:** интерпретатор не выполняет неявных приведений несовместимых типов (например, выражение \`"ML" + 42\` вызовет \`TypeError\`, в отличие от JavaScript).

---

#### 1. Модель ссылок и идентификатор объекта
Переменная в Python — это не ячейка памяти с данными, а **ссылка (указатель)** на объект в куче (heap):
\`\`\`python
a = [1, 2, 3]
b = a          # b ссылается на ТОТ ЖЕ объект, что и a
b.append(4)
print(a)       # [1, 2, 3, 4] — список a тоже изменился!
\`\`\`

Для проверки идентичности объектов используются:
* \`id(x)\`: целочисленный адрес объекта в памяти.
* \`x is y\`: проверяет, указывают ли \`x\` и \`y\` на один и тот же адрес в памяти (\`id(x) == id(y)\`).
* \`x == y\`: проверяет равенство значений (вызывает метод \`__eq__\`).

---

#### 2. Изменяемые (Mutable) и Неизменяемые (Immutable) типы
* **Неизменяемые (Immutable):** \`int\`, \`float\`, \`bool\`, \`str\`, \`tuple\`, \`frozenset\`, \`bytes\`.
  Любая модификация создает **новый** объект в памяти:
  \`\`\`python
  s = "tensor"
  # s[0] = "T" -> TypeError: 'str' object does not support item assignment
  s = "T" + s[1:] # создан абсолютно новый строковый объект
  \`\`\`
* **Изменяемые (Mutable):** \`list\`, \`dict\`, \`set\`, \`bytearray\`, пользовательские классы.
  Могут модифицироваться по месту (*in-place*) без изменения адреса памяти \`id()\`.

---

#### 3. Классическая ловушка: изменяемый дефолтный аргумент
В Python аргументы по умолчанию вычисляются **ровно один раз** в момент определения функции, а не при каждом ее вызове:
\`\`\`python
# ОПАСНО: список [] создается один раз при загрузке модуля!
def append_prediction(sample_id: int, history: list = []):
    history.append(sample_id)
    return history

print(append_prediction(1)) # [1]
print(append_prediction(2)) # [1, 2] -> Неожиданное разделение состояния!

# ПРАВИЛЬНЫЙ ИДИОМАТИЧНЫЙ ПАТТЕРН:
def append_prediction_safe(sample_id: int, history: list | None = None):
    if history is None:
        history = []
    history.append(sample_id)
    return history
\`\`\`

---

#### 4. Type Hints (Аннотации типов) в современном ML
Начиная с Python 3.9+, стандарт типизации стал обязательным для качественных библиотек (PyTorch, FastAPI, Hugging Face):
\`\`\`python
from typing import Callable, Sequence

def train_step(
    features: Sequence[float],
    target: float,
    loss_fn: Callable[[float, float], float]
) -> float:
    pred = sum(features)
    return loss_fn(pred, target)
\`\`\`
Аннотации не замедляют выполнение программы в рантайме, но предотвращают сотни скрытых багов через статический анализатор (\`mypy\`, IDE).

---

#### 5. Стек, куча и время жизни объектов

Переменная в Python — это имя в пространстве имен (фрейме), которое ссылается на объект в куче. Сам объект хранит счетчик ссылок \`ob_refcnt\`. Когда счетчик достигает нуля, память освобождается немедленно (reference counting). Циклические ссылки (\`a.append(a)\`) так не удаляются — для них работает циклический сборщик мусора.

\`\`\`python
import sys

a = [1, 2, 3]
print(sys.getrefcount(a))  # 2: переменная a + временный аргумент getrefcount

b = a
print(sys.getrefcount(a))  # 3: a, b и временный аргумент

del b
print(sys.getrefcount(a))  # снова 2
\`\`\`

Практический вывод: \`del\` не «удаляет объект», а удаляет имя; объект живет, пока на него есть хотя бы одна ссылка. Поэтому большой DataFrame может занимать память дольше, чем кажется: на него все еще ссылается кэш, логгер или замыкание.

#### 6. Присваивание, поверхностное и глубокое копирование

\`b = a\` не копирует данные. Для реального копирования есть два уровня:

\`\`\`python
import copy

a = [[1, 2], [3, 4]]
b = a                 # тот же объект
c = a.copy()          # поверхностная копия: внешний список новый, вложенные — общие
d = copy.deepcopy(a)  # полная копия: новые и внешний, и вложенные списки
\`\`\`

В ML это критично для конфигов и батчей: если вы передаете \`config\` в функцию и меняете вложенный \`config["augmentation"]\`, поверхностной копии недостаточно — изменится исходный конфиг.

#### 7. Как это проявляется в ML-коде

* **Мутация конфига.** Храните гиперпараметры в \`dataclass\` и передавайте \`copy.deepcopy(cfg)\` в эксперименты, чтобы один запуск не портил другой.
* **Кэш и память.** Глобальный кэш тензоров или загруженных данных удерживает объекты живыми; очищайте его явно.
* **Сравнение тензоров.** \`is\` проверяет идентичность объекта, а не равенство значений. Для чисел и строк используйте \`==\`.`,
      en: `### Everything in Python is an Object

Python features **dynamic strong typing**:
* **Dynamic:** variable types resolve at runtime upon assignment.
* **Strong:** implicit coercion across incompatible types is prohibited (\`"ML" + 42\` raises \`TypeError\`).

---

#### 1. Variables as Named References
Variables in Python are pointers to objects allocated on the heap. Assigning \`b = a\` copies the pointer, not the underlying memory structure.

* \`is\`: tests identity (whether memory addresses match via \`id(x) == id(y)\`).
* \`==\`: tests equality of values via \`__eq__\`.

---

#### 2. Mutable vs. Immutable Types
* **Immutable:** \`int\`, \`float\`, \`bool\`, \`str\`, \`tuple\`.
* **Mutable:** \`list\`, \`dict\`, \`set\`.

---

#### 3. The Mutable Default Argument Pitfall
Default parameter expressions evaluate once upon function definition. Always use \`None\` as sentinel for mutable parameter defaults:
\`\`\`python
def append_safe(item, history=None):
    if history is None:
        history = []
    history.append(item)
    return history
\`\`\`

---

#### 4. Stack, Heap, and Object Lifetime

A variable is a name in a namespace frame that references a heap object. Each object stores a reference count (\`ob_refcnt\`); when it reaches zero, the memory is reclaimed immediately. Reference cycles (\`a.append(a)\`) are handled later by the cyclic garbage collector.

\`\`\`python
import sys

a = [1, 2, 3]
print(sys.getrefcount(a))  # 2: the name a + the temporary argument
b = a
print(sys.getrefcount(a))  # 3: a, b + the temporary argument
del b                      # removes the name, not the object
\`\`\`

A large DataFrame may stay in memory longer than expected because a cache, logger, or closure still holds a reference to it.

#### 5. Assignment, Shallow Copy, and Deep Copy

\`b = a\` does not copy data. Real copying has two levels:

\`\`\`python
import copy

a = [[1, 2], [3, 4]]
b = a                 # same object
c = a.copy()          # shallow: new outer list, shared inner lists
d = copy.deepcopy(a)  # deep: new outer and inner lists
\`\`\`

This matters for ML configs: mutating a nested value through a shallow copy still changes the original configuration.

#### 6. Why This Matters in ML Code

* **Config mutation.** Keep hyperparameters in a \`dataclass\` and pass \`copy.deepcopy(cfg)\` into experiments.
* **Caches and memory.** Global tensor/data caches keep objects alive; clear them explicitly.
* **Comparisons.** \`is\` checks object identity, not value equality. Use \`==\` for numbers and strings.`,
    },
    commonMistakes: [
      {
        ru: 'Использовать изменяемые объекты (списки, словари) как значения по умолчанию в сигнатурах функций: `def f(data=[])`.',
        en: 'Using mutable data types (e.g. `def f(data=[])`) as default parameter values, causing shared state mutations across calls.',
      },
      {
        ru: 'Путать оператор идентичности `is` и оператор равенства значений `==`: проверять числа или строки через `if x is 100:` вместо `if x == 100:`.',
        en: 'Using identity comparison `is` instead of value equality `==` for non-singleton objects.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'py-cp-1',
        question: {
          ru: 'Что выведет следующий фрагмент кода: `a = [10, 20]; b = a; b += [30]; print(len(a))`?',
          en: 'What will be output by: `a = [10, 20]; b = a; b += [30]; print(len(a))`?',
        },
        options: [
          { ru: '3, так как a и b ссылаются на один и тот же изменяемый список', en: '3, because a and b point to the identical mutable list' },
          { ru: '2, так как b создал изолированную копию', en: '2, because b allocated an isolated copy' },
          { ru: 'Ошибка TypeError при попытке сложения списков', en: 'TypeError exception during list addition' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Оператор `b = a` копирует ссылку на существующий список. Метод `+=` для списков модифицирует исходный объект in-place, поэтому `a` также имеет длину 3.',
          en: 'Assignment binds `b` to the same memory object as `a`. In-place extension modifies the list referenced by both variables.',
        },
      },
      {
        id: 'py-cp-1-b',
        question: {
          ru: 'Почему в Python не рекомендуется использовать изменяемые объекты как дефолтные аргументы (например, `def append_record(item, records=[]):`)?',
          en: 'Why is using mutable objects as default function arguments considered an anti-pattern in Python (`def f(data=[]):`)?',
        },
        options: [
          { ru: 'Дефолтный аргумент вычисляется ровно один раз при определении функции, сохраняя изменения между вызовами', en: 'Default argument expressions evaluate once upon function definition, sharing mutations across subsequent calls' },
          { ru: 'Это вызывает ошибку компиляции SyntaxError', en: 'It triggers a compile-time SyntaxError' },
          { ru: 'Списки запрещено передавать в качестве параметров функций', en: 'Lists cannot be passed into function parameters' },
          { ru: 'Интерпретатор Python автоматически очищает список при втором вызове', en: 'The Python runtime clears the list on the second invocation' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Выражение значения по умолчанию вычисляется в момент создания функции (def). Изменяемый объект привязывается к атрибуту `__defaults__` и накапливает изменения.',
          en: 'Default argument expressions are evaluated when the function is parsed. The mutable object is stored in `__defaults__` and persists mutations.',
        },
      },
      {
        id: 'py-cp-1-c',
        question: {
          ru: 'В чем принципиальная разница между оператором `==` и оператором `is` в Python?',
          en: 'What is the fundamental difference between `==` and `is` operators in Python?',
        },
        options: [
          { ru: '`is` проверяет идентичность адресов памяти (`id(a) == id(b)`), а `==` проверяет равенство значений (`__eq__`)', en: '`is` verifies memory identity (`id(a) == id(b)`), while `==` checks value equality (`__eq__`)' },
          { ru: '`==` проверяет адреса памяти, а `is` проверяет равенство значений', en: '`==` checks memory addresses, while `is` verifies value equality' },
          { ru: 'Оператор `is` работает только для целых чисел int', en: 'The `is` operator only operates on integers' },
          { ru: 'Между ними нет никакой разницы, это полные синонимы', en: 'There is no difference, they are identical aliases' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Оператор `is` проверяет, указывают ли две переменные на одну и ту же область памяти в куче. Для синглтонов вроде `None` всегда используют `x is None`.',
          en: '`is` validates whether two references point to the exact same heap memory object. Singletons like `None` are always compared via `is`.',
        },
      },
    ],
  },
  {
    id: 'py-2-data-structures',
    moduleId: 'python-foundations',
    title: {
      ru: 'Встроенные коллекции: List, Tuple, Dict, Set и модуль collections',
      en: 'Built-in Collections: List, Tuple, Dict, Set & Collections Module',
    },
    order: 2,
    estimatedMinutes: 16,
    draft: false,
    theoryMarkdown: {
      ru: `### Эффективность структур данных в Data Science

Выбор правильной структуры данных определяет, будет ли предобработка датасета выполняться 1 секунду или зависнет на 2 часа.

---

#### 1. Временная сложность операций
| Операция | List (\`list\`) | Tuple (\`tuple\`) | Dict (\`dict\`) | Set (\`set\`) |
| :--- | :--- | :--- | :--- | :--- |
| Индексация (\`a[i]\`) | $O(1)$ | $O(1)$ | $O(1)$ (по ключу) | Не поддерживается |
| Добавление в конец | $O(1)$ (амортиз.) | Не поддерживается | $O(1)$ | $O(1)$ (\`add\`) |
| Вставка в начало (\`insert(0)\`) | $O(N)$ (сдвиг памяти) | Не поддерживается | $O(1)$ | $O(1)$ |
| Поиск элемента (\`x in col\`) | **$O(N)$** (линейный) | **$O(N)$** | **$O(1)$** (хэш) | **$O(1)$** (хэш) |
| Память | Выше (запас) | Минимальная | Выше (хэш-таблица) | Выше |

**Золотое правило:** если требуется проверка наличия элемента в миллионе строк (\`if item in collection:\`), коллекция **обязана** быть множеством (\`set\`) или словарем (\`dict\`), иначе проверка займет часы!

---

#### 2. Срезы (Slicing) и распаковка (Unpacking)
Синтаксис срезов: \`sequence[start:stop:step]\`:
\`\`\`python
data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(data[1:7:2])   # [1, 3, 5]
print(data[::-1])      # Разворот списка за O(N) без изменения оригинала

# Распаковка кортежей и списков
first, *middle, last = data
# first = 0, middle = [1..8], last = 9

# Обмен значений без временной переменной
x, y = y, x
\`\`\`

---

#### 3. Модуль \`collections\` для практического ML
Стандартная библиотека Python содержит оптимизированные C-структуры:
1. **Counter:** мгновенный подсчет распределения меток классов в датасете:
   \`\`\`python
   from collections import Counter
   labels = ["cat", "dog", "cat", "bird", "cat", "dog"]
   counts = Counter(labels)
   print(counts.most_common(1)) # [('cat', 3)]
   \`\`\`
2. **defaultdict:** словарь со значением по умолчанию без вызова исключения \`KeyError\`:
   \`\`\`python
   from collections import defaultdict
   user_actions = defaultdict(list)
   user_actions["user_42"].append("click_banner") # ключ создается автоматически
   \`\`\`
3. **deque (двусторонняя очередь):** вставка и удаление с обоих концов за строгое $O(1)$ (в отличие от списка, где \`list.pop(0)\` требует $O(N)$). Идеальна для скользящих окон временных рядов.

---

#### 4. Словарь (\`dict\`) под капотом и концепция Hashable
На собеседованиях регулярно спрашивают: *«Как устроен dict в Python 3.6+ и что может быть ключом?»*

* **Устройство Compact Dict (CPython):**
  Раньше словарь представлял собой одну большую разреженную таблицу, где каждая строка занимала 24 байта (\`hash\`, \`key\`, \`value\`), растрачивая память впустую.
  В современном Python словарь разделен на две структуры:
  1. **\`indices\` (Разреженная таблица индексов):** компактный массив целых чисел (1-2 байта на ячейку), куда отображается хэш ключа (\`hash(key) % capacity\`).
  2. **\`entries\` (Плотный массив записей):** массив кортежей \`[hash, key, value]\`, куда элементы добавляются строго по порядку вставки! Именно поэтому **с Python 3.6+ словари гарантируют сохранение порядка добавления ключей** при экономии до $30\\%$ RAM.
  * При возникновении коллизий (два разных ключа попали в один слот) CPython использует открытую адресацию с псевдослучайной формулой пробирования (perturbation probing):
    $$j = (5 \\cdot j + 1 + \\text{perturb}) \\pmod{\\text{capacity}}$$

* **Что такое Hashable (Хэшируемость)?**
  Объект можно использовать в качестве ключа словаря (\`dict\`) или элемента множества (\`set\`) тогда и только тогда, когда он:
  1. Имеет метод \`__hash__()\`, возвращающий неизменное целое число на протяжении всей жизни объекта.
  2. Имеет метод \`__eq__()\` для проверки равенства при коллизиях.
  3. Если \`a == b\`, то обязательно \`hash(a) == hash(b)\`.

* **Ловушка с собеседования: Можно ли использовать кортеж \`(1, [2, 3])\` как ключ словаря?**
  * **Ответ: НЕТ!** Будет выброшена ошибка \`TypeError: unhashable type: 'list'\`.
  * Сам кортеж является неизменяемым типом (\`tuple\`), однако его второй элемент — это изменяемый список (\`list\`). Так как список может измениться в любой момент, его хэш не определен. Вычисление \`hash()\` для кортежа рекурсивно требует хэшируемости всех его элементов!

---

#### 5. Что выбирать: список, кортеж, словарь или множество

| Задача | Выбор | Почему |
| :--- | :--- | :--- |
| Упорядоченная изменяемая коллекция | \`list\` | быстрый доступ по индексу, \`append\` амортизированно $O(1)$ |
| Фиксированная запись или ключ словаря | \`tuple\` | неизменяемость и хэшируемость |
| Поиск по ключу, счетчики, конфиги | \`dict\` | $O(1)$ в среднем |
| Уникальность и проверка вхождения | \`set\` | $O(1)$ в среднем, автоматически убирает дубликаты |

#### 6. Представления dict (views) и экономия памяти

\`d.keys()\`, \`d.values()\`, \`d.items()\` возвращают не копии списков, а ленивые представления. Они отражают текущее состояние словаря и не занимают память под все элементы:

\`\`\`python
scores = {"a": 0.9, "b": 0.7}
keys = scores.keys()
scores["c"] = 0.8
print(list(keys))  # ['a', 'b', 'c'] — view видит изменение
\`\`\`

Если нужен независимый снимок, явно приводите к \`list(...)\`.

#### 7. \`namedtuple\`, \`dataclass\` и словари: когда что использовать

* \`dict\` — когда набор полей динамический (например, JSON-ответ API).
* \`namedtuple\` — легкая неизменяемая запись с доступом по имени, совместимая с распаковкой.
* \`dataclass\` — когда нужны значения по умолчанию, валидация, методы и изменяемость.

\`\`\`python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(1.0, 2.5)
print(p.x, p.y)  # доступ по имени
\`\`\`

#### 8. Практический чек-лист

* Проверка вхождения в цикле — только \`set\` или \`dict\`.
* Очередь — \`deque\`, не \`list.pop(0)\`.
* Частоты — \`Counter\`, а не ручной \`dict.get\`.
* Группировка — \`defaultdict(list)\`.
* Неизменяемый конфиг — \`dataclass(frozen=True)\` или \`namedtuple\`.`,
      en: `### Computational Complexity of Python Collections

Choosing inappropriate data structures causes catastrophic pipeline slowdowns.

---

#### 1. Time Complexity Overview
* **List / Tuple:** element search via \`x in list\` takes $O(N)$ scan time.
* **Dict / Set:** hash-table backed lookup \`x in set\` executes in average $O(1)$ amortized time.

---

#### 2. Advanced Unpacking & Slicing
\`\`\`python
head, *tail = sequence
reversed_copy = sequence[::-1]
\`\`\`

---

#### 3. Standard Library \`collections\`
* **\`Counter\`**: rapid class frequency histogram extraction.
* **\`defaultdict\`**: avoids verbose \`if key not in d:\` boilerplates.
* **\`deque\`**: double-ended queue guaranteeing $O(1)$ push/pop at both boundaries.

---

#### 4. Choosing the Right Collection

| Task | Choice | Reason |
| :--- | :--- | :--- |
| Ordered mutable collection | \`list\` | index access, amortized $O(1)$ append |
| Fixed record or dictionary key | \`tuple\` | immutable and hashable |
| Key lookup, counters, configs | \`dict\` | average $O(1)$ |
| Uniqueness and membership tests | \`set\` | average $O(1)$, removes duplicates |

#### 5. Dict Views and Memory

\`d.keys()\`, \`d.values()\`, and \`d.items()\` return lazy views, not copies. They reflect the current state of the dictionary:

\`\`\`python
scores = {"a": 0.9, "b": 0.7}
keys = scores.keys()
scores["c"] = 0.8
print(list(keys))  # ['a', 'b', 'c']
\`\`\`

Use \`list(...)\` when you need an independent snapshot.

#### 6. \`namedtuple\`, \`dataclass\`, or \`dict\`?

* \`dict\` — dynamic fields, e.g. a JSON API response.
* \`namedtuple\` — lightweight immutable record with named access and tuple unpacking.
* \`dataclass\` — defaults, validation, methods, and mutability.

\`\`\`python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(1.0, 2.5)
print(p.x, p.y)
\`\`\`

#### 7. Practical Checklist

* Membership tests inside loops — use \`set\` or \`dict\`.
* Queues — \`deque\`, not \`list.pop(0)\`.
* Frequencies — \`Counter\`, not manual \`dict.get\`.
* Grouping — \`defaultdict(list)\`.
* Immutable configs — \`dataclass(frozen=True)\` or \`namedtuple\`.`,
    },
    commonMistakes: [
      {
        ru: 'Проверять вхождение элемента `if id in large_list:` внутри цикла: приводит к квадратичной асимптотике O(N²). Необходимо конвертировать список в `set(large_list)`.',
        en: 'Performing repeated membership tests `if x in my_list` inside loops, causing O(N²) quadratic bottlenecks instead of using sets.',
      },
      {
        ru: 'Использовать `list.pop(0)` для симуляции очереди: это сдвигает все N элементов массива в памяти ($O(N)$). Для этого предназначен `collections.deque.popleft()` ($O(1)$).',
        en: 'Using `list.pop(0)` for FIFO queues which runs in O(N) memory shift instead of O(1) `deque.popleft()`.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'py-cp-2',
        question: {
          ru: 'Какова средняя сложность проверки вхождения элемента `x in s`, если `s` является множеством (`set`)?',
          en: 'What is the average time complexity of checking membership `x in s` if `s` is a `set`?',
        },
        options: [
          { ru: 'O(1) благодаря хэш-таблице', en: 'O(1) due to hash table indexing' },
          { ru: 'O(N) из-за полного последовательного перебора', en: 'O(N) due to linear search' },
          { ru: 'O(log N) благодаря бинарному дереву', en: 'O(log N) via binary tree search' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Множества (set) и словари (dict) реализованы через открытую адресацию в хэш-таблицах, поэтому поиск по хэшу ключа выполняется за константное время O(1).',
          en: 'Sets and dictionaries rely on internal hash tables providing O(1) average lookup time.',
        },
      },
      {
        id: 'py-cp-2-b',
        question: {
          ru: 'Какая из коллекций может использоваться в качестве ключа словаря (dict) в Python и почему?',
          en: 'Which collection can serve as a dictionary key in Python and why?',
        },
        options: [
          { ru: 'Кортеж (tuple), если он содержит только неизменяемые элементы, так как он хэшируем', en: 'A tuple containing only immutable items, because it is hashable' },
          { ru: 'Список (list), так как он сохраняет порядок добавления элементов', en: 'A list, because it preserves insertion order' },
          { ru: 'Множество (set), так как все его элементы уникальны', en: 'A set, because all its elements are unique' },
          { ru: 'Словарь (dict), так как он поддерживает быстрый поиск по парам ключ-значение', en: 'A dictionary, because it supports fast key-value lookups' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Ключ словаря обязан быть хэшируемым (реализовать метод `__hash__`) и неизменяемым. Списки и множества изменяемы, поэтому вызывают `TypeError: unhashable type`.',
          en: 'Dictionary keys must be hashable and immutable. Lists and sets are mutable and unhashable, triggering `TypeError`.',
        },
      },
      {
        id: 'py-cp-2-c',
        question: {
          ru: 'Какова временная сложность извлечения элемента из начала стандартного списка `list.pop(0)` по сравнению с `collections.deque.popleft()`?',
          en: 'What is the time complexity of `list.pop(0)` compared to `collections.deque.popleft()`?',
        },
        options: [
          { ru: '`list.pop(0)` работает за O(N) из-за сдвига массива, а `deque.popleft()` — за O(1)', en: '`list.pop(0)` is O(N) due to memory shifting, while `deque.popleft()` is O(1)' },
          { ru: 'Обе операции работают за строго O(1)', en: 'Both operations run in strict O(1)' },
          { ru: '`deque.popleft()` работает медленнее, за O(N)', en: '`deque.popleft()` is slower, running in O(N)' },
          { ru: '`list.pop(0)` работает за O(log N)', en: '`list.pop(0)` runs in O(log N)' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Стандартный `list` в CPython является динамическим непрерывным массивом указателей. Удаление нулевого элемента вынуждает сдвинуть все N-1 оставшихся элементов. `deque` оперирует связанными блоками фиксированного размера за O(1).',
          en: 'Python lists are contiguous pointer buffers. Popping index 0 forces shifting remaining items. `deque` is a doubly linked chunk buffer guaranteeing O(1).',
        },
      },
    ],
  },
  {
    id: 'py-3-comprehensions-generators',
    moduleId: 'python-foundations',
    title: {
      ru: 'Comprehensions, Итераторы и Генераторы: эффективная работа с памятью',
      en: 'Comprehensions, Iterators & Memory-Efficient Generators',
    },
    order: 3,
    estimatedMinutes: 18,
    draft: false,
    theoryMarkdown: {
      ru: `### Как обрабатывать датасеты, не помещающиеся в RAM

В машинном обучении типичный датасет весит десятки или сотни гигабайт. Попытка загрузить все примеры в обычный список приводит к немедленному краху процесса: \`MemoryError: Out of Memory\`.
Спасение — **протокол итераторов и генераторы**.

---

#### 1. Comprehensions (Генераторы списков и словарей)
Comprehensions компилируются на уровне виртуальной машины Python в оптимизированный C-байткод, работая быстрее стандартного цикла \`for\` с вызовом \`.append()\`:
\`\`\`python
# List comprehension с фильтрацией
clean_tokens = [w.lower() for w in text.split() if len(w) > 3]

# Dict comprehension: словарь отображения категорий в индексы (Label Encoding)
unique_labels = ["benign", "malignant", "unknown"]
label_to_idx = {label: idx for idx, label in enumerate(unique_labels)}
# {'benign': 0, 'malignant': 1, 'unknown': 2}
\`\`\`

---

#### 2. Итераторы и ленивые вычисления (Lazy Evaluation)
Объект является **итерируемым (Iterable)**, если он реализует метод \`__iter__()\`.
Объект является **итератором (Iterator)**, если он реализует метод \`__next__()\`, который при каждом вызове возвращает очередной элемент либо выбрасывает исключение \`StopIteration\` при исчерпании.

---

#### 3. Генераторы с ключевым словом \`yield\`
Функция-генератор не возвращает значение сразу через \`return\`. Она приостанавливает выполнение на инструкции \`yield\`, сохраняя всё состояние локальных переменных:
\`\`\`python
import csv

def stream_csv_batches(file_path: str, batch_size: int = 128):
    """Потоковое чтение многогигабайтного CSV файла фиксированными батчами"""
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        batch = []
        for row in reader:
            batch.append([float(x) for x in row])
            if len(batch) == batch_size:
                yield batch # Отдаем батч клиенту, не храня весь файл в памяти!
                batch = []
        if batch:
            yield batch
\`\`\`

**Генераторные выражения (Generator Expressions):**
\`\`\`python
# Круглые скобки вместо квадратных:
sq_gen = (x ** 2 for x in range(10_000_000))
print(sys.getsizeof(sq_gen)) # Всего ~100 байт памяти независимо от числа элементов!
\`\`\`
Именно генераторы лежат в основе загрузчиков данных \`DataLoader\` в PyTorch и потоковых конвейеров TensorFlow.

---

#### 4. Как генератор устроен под капотом

Вызов функции-генератора не выполняет тело, а создает объект-генератор. При каждом \`next()\` интерпретатор возобновляет сохраненный фрейм (локальные переменные, позицию инструкции) и выполняет код до следующего \`yield\`. После исчерпания фрейм освобождается, а повторный \`next()\` бросает \`StopIteration\`.

\`\`\`python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

gen = countdown(3)
print(next(gen))  # 3
print(next(gen))  # 2
print(list(gen))  # [1] — генератор одноразовый
\`\`\`

Важное следствие: генератор нельзя «перемотать». Если данные нужны дважды, либо создайте новый генератор, либо материализуйте результат в \`list\` (если он помещается в память).

#### 5. \`yield from\` и композиция генераторов

\`yield from\` делегирует итерацию вложенному итератору и пробрасывает \`send\`/\`throw\`, поэтому это не просто синтаксический сахар:

\`\`\`python
def read_lines(path):
    with open(path) as f:
        yield from f

def non_empty(lines):
    for line in lines:
        if line.strip():
            yield line.strip()

for line in non_empty(read_lines("data.txt")):
    print(line)
\`\`\`

Так строятся ленивые пайплайны: каждый этап читает по одному элементу и не хранит весь набор.

#### 6. \`itertools\` для потоковой обработки

* \`itertools.islice(iterable, n)\` — взять первые \`n\` элементов, не материализуя остальное.
* \`itertools.chain(a, b)\` — склеить несколько итераторов без копирования.
* \`itertools.groupby(iterable, key)\` — группировка подряд идущих элементов (вход должен быть отсортирован по ключу).
* \`itertools.tee(iterable, n)\` — разветвить поток на \`n\` независимых итераторов (с внутренним буфером).

\`\`\`python
from itertools import islice

def batches(iterable, size):
    it = iter(iterable)
    while batch := list(islice(it, size)):
        yield batch
\`\`\`

#### 7. Когда генератор — плохая идея

* Нужен \`len()\`, индексация \`gen[i]\` или многократный проход — генератор этого не умеет.
* Нужно сериализовать состояние (например, \`pickle\` DataLoader) — генератор не сериализуется.
* Ошибка внутри генератора всплывает только в момент итерации, что усложняет отладку.
* Генератор удерживает открытые ресурсы (файл, соединение), пока его не закроют; используйте \`try/finally\` или \`with\` внутри.`,
      en: `### Processing Datasets Exceeding Physical RAM

Loading multi-gigabyte datasets entirely into memory triggers \`MemoryError\`. **Generators and the iterator protocol** allow streaming streams with constant $O(1)$ memory consumption.

---

#### 1. List and Dict Comprehensions
Comprehensions execute via optimized bytecode instructions in CPython:
\`\`\`python
label_to_id = {label: i for i, label in enumerate(classes)}
\`\`\`

---

#### 2. The Iterator Protocol
Iterables implement \`__iter__()\`; Iterators implement \`__next__()\` raising \`StopIteration\` when exhausted.

---

#### 3. Generators and the \`yield\` Keyword
Generator functions pause execution at each \`yield\`, retaining execution frame state and consuming negligible heap memory regardless of stream length.

---

#### 4. How a Generator Works Internally

Calling a generator function does not execute its body; it creates a generator object. Each \`next()\` resumes the saved frame (locals and instruction pointer) and runs until the next \`yield\`. When exhausted, the frame is released and further \`next()\` calls raise \`StopIteration\`.

\`\`\`python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

gen = countdown(3)
print(next(gen))  # 3
print(next(gen))  # 2
print(list(gen))  # [1] — generators are one-shot
\`\`\`

A generator cannot be rewound. If you need the data twice, create a new generator or materialize it in a \`list\` when it fits in memory.

#### 5. \`yield from\` and Generator Composition

\`yield from\` delegates iteration to a nested iterator and forwards \`send\`/\`throw\`, so it is more than syntax sugar:

\`\`\`python
def read_lines(path):
    with open(path) as f:
        yield from f

def non_empty(lines):
    for line in lines:
        if line.strip():
            yield line.strip()

for line in non_empty(read_lines("data.txt")):
    print(line)
\`\`\`

This is how lazy pipelines are built: each stage processes one item at a time.

#### 6. \`itertools\` for Streaming

* \`itertools.islice(iterable, n)\` — take the first \`n\` items without materializing the rest.
* \`itertools.chain(a, b)\` — concatenate iterators without copying.
* \`itertools.groupby(iterable, key)\` — group consecutive items (input must be sorted by the key).
* \`itertools.tee(iterable, n)\` — split a stream into \`n\` independent iterators (with an internal buffer).

\`\`\`python
from itertools import islice

def batches(iterable, size):
    it = iter(iterable)
    while batch := list(islice(it, size)):
        yield batch
\`\`\`

#### 7. When a Generator Is the Wrong Tool

* You need \`len()\`, indexing \`gen[i]\`, or multiple passes — generators do not support them.
* You need to serialize state (e.g. \`pickle\` a DataLoader) — generators are not picklable.
* Errors surface only during iteration, which complicates debugging.
* A generator keeps resources (file, connection) open until closed; use \`try/finally\` or \`with\` inside.`,
    },
    commonMistakes: [
      {
        ru: 'Использовать list comprehension `[process(x) for x in huge_file]` вместо генератора `(process(x) for x in huge_file)` при обработке тяжелых файлов: немедленно переполняет RAM.',
        en: 'Using list comprehensions over huge streams instead of generator expressions, causing Out-Of-Memory errors.',
      },
      {
        ru: 'Пытаться повторно итерироваться по исчерпанному генератору: генератор одноразовый; после завершения повторный цикл вернет пустой результат.',
        en: 'Attempting to re-iterate over an exhausted generator without re-instantiating it.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'py-cp-3',
        question: {
          ru: 'В чем ключевое отличие генераторного выражения `(x*2 for x in range(1000000))` от list comprehension `[x*2 for x in range(1000000)]`?',
          en: 'What is the fundamental difference between a generator `(x*2 for x in range(N))` and list comprehension `[x*2 for x in range(N)]`?',
        },
        options: [
          {
            ru: 'Генератор вычисляет элементы лениво по одному и потребляет константную память O(1)',
            en: 'The generator computes values lazily on demand, consuming constant O(1) memory',
          },
          {
            ru: 'Генератор работает в 10 раз медленнее и не поддерживает цикл for',
            en: 'The generator runs 10x slower and cannot be used in for-loops',
          },
          {
            ru: 'Генератор сохраняет все данные на жесткий диск вместо RAM',
            en: 'The generator writes all values to local disk instead of RAM',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'List comprehension материализует все 1 000 000 чисел в памяти одновременно, а генератор производит следующее число только в момент запроса next().',
          en: 'List comprehension instantiates the entire array upfront in RAM, while generators yield values lazily on demand.',
        },
      },
      {
        id: 'py-cp-3-b',
        question: {
          ru: 'Какие два дандер-метода определяют протокол итератора (Iterator Protocol) в Python?',
          en: 'Which two dunder methods define the Python Iterator Protocol?',
        },
        options: [
          { ru: '`__iter__()` (возвращает итератор) и `__next__()` (возвращает следующий элемент)', en: '`__iter__()` (returns iterator) and `__next__()` (yields next value)' },
          { ru: '`__init__()` и `__call__()`', en: '`__init__()` and `__call__()`' },
          { ru: '`__len__()` и `__getitem__()`', en: '`__len__()` and `__getitem__()`' },
          { ru: '`__enter__()` и `__exit__()`', en: '`__enter__()` and `__exit__()`' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Любой объект, реализующий `__iter__()` и `__next__()`, является итератором. При исчерпании элементов метод `__next__()` обязан выбросить исключение `StopIteration`.',
          en: 'Iterators implement `__iter__()` returning themselves and `__next__()` producing consecutive elements or raising `StopIteration`.',
        },
      },
      {
        id: 'py-cp-3-c',
        question: {
          ru: 'Какое исключение возникает в Python, когда у генератора больше нет элементов для выдачи через `next()`?',
          en: 'Which exception is raised when an exhausted generator has no more elements left to yield via `next()`?',
        },
        options: [
          { ru: 'StopIteration', en: 'StopIteration' },
          { ru: 'IndexError', en: 'IndexError' },
          { ru: 'GeneratorExit', en: 'GeneratorExit' },
          { ru: 'ValueError', en: 'ValueError' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Исключение `StopIteration` сигнализирует циклу `for` или функции `next()` о завершении последовательности элементов генератора.',
          en: '`StopIteration` signals termination of iteration stream to `for` loops and consumers.',
        },
      },
    ],
  },
  {
    id: 'py-4-functions-decorators',
    moduleId: 'python-foundations',
    title: {
      ru: 'Функции, замыкания, *args/**kwargs и декораторы в ML-пайплайнах',
      en: 'Functions, Closures, *args/**kwargs & Decorators in ML Pipelines',
    },
    order: 4,
    estimatedMinutes: 18,
    draft: false,
    theoryMarkdown: {
      ru: `### Функции как объекты первого класса

В Python функции являются полноценными объектами (First-Class Citizens):
* Их можно присваивать переменным.
* Передавать в качестве аргументов в другие функции (Higher-Order Functions).
* Возвращать из функций.

---

#### 1. Универсальная распаковка аргументов: \`*args\` и \`**kwargs\`
* \`*args\`: позиционные аргументы произвольной длины, упаковываются в кортеж (\`tuple\`).
* \`**kwargs\`: именованные аргументы произвольной длины, упаковываются в словарь (\`dict\`).
\`\`\`python
def build_model(model_cls, *args, lr: float = 0.001, **kwargs):
    print(f"Инициализация с learning_rate={lr}")
    # Проброс любых гиперпараметров в конструктор модели
    return model_cls(*args, **kwargs)
\`\`\`

---

#### 2. Замыкания (Closures)
Замыкание возникает, когда вложенная функция ссылается на переменные из области видимости родительской функции (Enclosing Scope), и родительская функция возвращает эту вложенную функцию:
\`\`\`python
def create_exponential_decay(initial_lr: float, decay_rate: float):
    # initial_lr и decay_rate сохраняются в __closure__ функции
    def get_lr_for_epoch(epoch: int) -> float:
        return initial_lr * (decay_rate ** epoch)
    return get_lr_for_epoch

scheduler = create_exponential_decay(0.01, 0.95)
print(scheduler(0)) # 0.01
print(scheduler(5)) # 0.00773
\`\`\`

---

#### 3. Декораторы: паттерн оборачивания логики
Декоратор — это функция, принимающая другую функцию и возвращающая ее модифицированную версию.
В машинном обучении декораторы используются повсеместно:
1. Замер времени инференса и профилирование:
\`\`\`python
import time
from functools import wraps

def timing_decorator(func):
    @wraps(func) # Сохраняет оригинальное имя и docstring функции
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration_ms = (time.perf_counter() - start) * 1000
        print(f"[{func.__name__}] Инференс занял: {duration_ms:.2f} мс")
        return result
    return wrapper

@timing_decorator
def predict_batch(features):
    # имитация расчета модели
    time.sleep(0.05)
    return [1, 0, 1]
\`\`\`
2. Встроенный кэш \`@functools.lru_cache\` для мемоизации тяжелых расчетов.
3. Декораторы в PyTorch: \`@torch.no_grad()\` для отключения вычисления градиентов при валидации.

---

#### 4. Области видимости LEGB и \`nonlocal\`

Python ищет имя по цепочке **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in. Замыкание может читать переменную из внешней функции, но для присваивания ей нужно объявить \`nonlocal\`:

\`\`\`python
def make_counter():
    count = 0
    def step():
        nonlocal count
        count += 1
        return count
    return step
\`\`\`

Без \`nonlocal\` интерпретатор создаст локальную \`count\` внутри \`step\`, и поведение будет неверным.

#### 5. Декоратор с аргументами

Декоратор с параметрами — это функция, которая возвращает декоратор (три уровня вложенности):

\`\`\`python
from functools import wraps

def retry(times: int):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception:
                    if attempt == times - 1:
                        raise
        return wrapper
    return decorator

@retry(times=3)
def call_api():
    ...
\`\`\`

Порядок применения важен: \`@a\` над \`@b\` эквивалентен \`a(b(f))\`, то есть ближайший к функции декоратор срабатывает первым.

#### 6. \`functools.partial\`, \`lru_cache\` и подводные камни

* \`partial\` фиксирует часть аргументов, не создавая новую функцию-обертку вручную.
* \`lru_cache\` мемоизирует результаты; аргументы должны быть хэшируемыми.
* \`lru_cache\` на методах экземпляра удерживает \`self\` живым — используйте осторожно в долгоживущих объектах.
* Кэш не видит изменений внешнего состояния: если функция зависит от глобальной переменной, результат будет устаревшим.

\`\`\`python
from functools import lru_cache, partial

@lru_cache(maxsize=1024)
def embed(token: str) -> tuple[float, ...]:
    ...

to_device = partial(torch.Tensor.to, device="cuda")
\`\`\`

#### 7. Декораторы в ML-стеке

* \`@torch.no_grad()\` — отключает построение графа и экономит память на инференсе.
* \`@torch.inference_mode()\` — еще более строгий режим без autograd.
* \`@tf.function\` — трассирует функцию в граф TensorFlow.
* \`@app.post(...)\` в FastAPI — регистрирует HTTP-обработчик.
* \`@retry(...)\` — повторные запросы к нестабильному API модели.`,
      en: `### First-Class Functions and Metaprogramming

Functions are first-class citizens in Python, enabling expressive functional programming constructs.

---

#### 1. Variable Arguments: \`*args\` and \`**kwargs\`
* \`*args\` captures excess positional parameters into a \`tuple\`.
* \`**kwargs\` captures named keyword arguments into a \`dict\`.

---

#### 2. Closures
Closures capture non-local state from enclosing scopes, preserving internal state without explicit class definitions.

---

#### 3. Decorators in Machine Learning
A decorator wraps a function, augmenting its behavior without mutating its underlying code:
\`\`\`python
from functools import wraps
import time

def benchmark(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        res = func(*args, **kwargs)
        print(f"Elapsed: {time.perf_counter() - t0:.4f}s")
        return res
    return wrapper
\`\`\`

---

#### 4. LEGB Scope and \`nonlocal\`

Python resolves names through **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in. A closure can read an enclosing variable, but assignment requires \`nonlocal\`:

\`\`\`python
def make_counter():
    count = 0
    def step():
        nonlocal count
        count += 1
        return count
    return step
\`\`\`

Without \`nonlocal\`, \`count += 1\` creates a new local variable and the closure state is lost.

#### 5. Decorators with Arguments

A parameterized decorator is a function returning a decorator (three levels):

\`\`\`python
from functools import wraps

def retry(times: int):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception:
                    if attempt == times - 1:
                        raise
        return wrapper
    return decorator

@retry(times=3)
def call_api():
    ...
\`\`\`

Order matters: \`@a\` above \`@b\` is \`a(b(f))\`; the decorator closest to the function runs first.

#### 6. \`functools.partial\`, \`lru_cache\`, and Pitfalls

* \`partial\` binds some arguments without hand-writing a wrapper.
* \`lru_cache\` memoizes results; arguments must be hashable.
* \`lru_cache\` on instance methods keeps \`self\` alive — be careful in long-lived objects.
* The cache does not observe external state changes; results become stale if the function depends on globals.

\`\`\`python
from functools import lru_cache, partial

@lru_cache(maxsize=1024)
def embed(token: str) -> tuple[float, ...]:
    ...

to_device = partial(torch.Tensor.to, device="cuda")
\`\`\`

#### 7. Decorators in the ML Stack

* \`@torch.no_grad()\` — disables graph construction and saves inference memory.
* \`@torch.inference_mode()\` — a stricter autograd-free mode.
* \`@tf.function\` — traces a function into a TensorFlow graph.
* \`@app.post(...)\` in FastAPI — registers an HTTP handler.
* \`@retry(...)\` — retries unstable model API calls.`,
    },
    commonMistakes: [
      {
        ru: 'Забывать декоратор `@functools.wraps(func)` внутри кастомного декоратора: это стирает оригинальное имя функции `__name__` и документацию `__doc__`, ломая отладчики.',
        en: 'Omitting `@functools.wraps(func)` inside decorators, wiping out original metadata and function signatures.',
      },
      {
        ru: 'Использовать изменяемую глобальную переменную внутри вложенной функции без `nonlocal` или `global`.',
        en: 'Mutating enclosing scope variables without declaring `nonlocal`.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'py-cp-4',
        question: {
          ru: 'Какую главную задачу решает декоратор `@functools.wraps(func)` при создании собственного декоратора?',
          en: 'What primary role does `@functools.wraps(func)` serve in custom decorator implementations?',
        },
        options: [
          {
            ru: 'Сохраняет метаданные оригинальной функции (имя __name__, аннотации типов и docstring)',
            en: 'Preserves original metadata (__name__, type annotations, docstring) of the wrapped function',
          },
          {
            ru: 'Автоматически компилирует функцию в C++ код',
            en: 'Compiles the function into optimized native C++ binaries',
          },
          {
            ru: 'Запрещает передачу ключевых аргументов **kwargs',
            en: 'Forbids passing **kwargs keyword parameters',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Без @wraps функция-обертка перезаписывает атрибуты `__name__` и `__doc__` декорируемой функции на имя `wrapper`.',
          en: '`@wraps` copies original introspection attributes like `__name__` and `__doc__` onto the inner wrapper.',
        },
      },
      {
        id: 'py-cp-4-b',
        question: {
          ru: 'В каком виде передаются позиционные аргументы `*args` и именованные `**kwargs` внутрь функции?',
          en: 'What data types represent `*args` and `**kwargs` inside the called function body?',
        },
        options: [
          { ru: '`*args` как кортеж (`tuple`), а `**kwargs` как словарь (`dict`)', en: '`*args` as a `tuple`, and `**kwargs` as a `dict`' },
          { ru: 'Оба параметра передаются как список `list`', en: 'Both parameters are unpacked as standard `list`' },
          { ru: '`*args` как множество `set`, а `**kwargs` как кортеж `tuple`', en: '`*args` as a `set`, and `**kwargs` as a `tuple`' },
          { ru: 'Они передаются как единый генератор элементов', en: 'They arrive as a single generator stream' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Оператор распаковки позиционных аргументов собирает их в неизменяемый `tuple`, а оператор двойной звездочки собирает пары ключ-значение в `dict`.',
          en: 'Positional arguments unpack into an immutable `tuple`, while keyword arguments unpack into a standard `dict`.',
        },
      },
      {
        id: 'py-cp-4-c',
        question: {
          ru: 'Что такое замыкание (Closure) в Python?',
          en: 'What is a Closure in Python?',
        },
        options: [
          { ru: 'Вложенная функция, которая запоминает переменные из охватывающей области видимости даже после завершения внешней функции', en: 'A nested function that retains access to variables from its enclosing scope even after the outer function has finished executing' },
          { ru: 'Автоматическое закрытие дескрипторов файлов при сборке мусора', en: 'Automatic file descriptor closure during garbage collection' },
          { ru: 'Метод завершения потока в многопоточном приложении', en: 'A method for thread termination in multi-threaded programs' },
          { ru: 'Оператор принудительного выхода из бесконечного цикла', en: 'An operator for terminating infinite while loops' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Замыкание привязывает к функции лексическое окружение (атрибут `__closure__`), сохраняя нелокальные переменные в памяти.',
          en: 'Closures bind references to free variables in enclosing lexical environments, stored in the `__closure__` cell tuple.',
        },
      },
    ],
  },
  {
    id: 'py-5-oop-dunder',
    moduleId: 'python-foundations',
    title: {
      ru: 'ООП в Python для ML: классы, дандер-методы и написание кастомных моделей',
      en: 'OOP for ML: Classes, Dunder Methods & Custom Model Architectures',
    },
    order: 5,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Как устроены библиотеки Scikit-learn и PyTorch изнутри

Вся экосистема машинного обучения построена на строгом объектно-ориентированном дизайне:
* В **Scikit-learn** любая модель наследуется от \`BaseEstimator\` и реализует методы \`fit(X, y)\` и \`predict(X)\`.
* В **PyTorch** любая нейросеть наследуется от \`torch.nn.Module\` и переопределяет метод \`forward(x)\`.

---

#### 1. Классы, self и дандер-методы (Магические методы)
Дандер-методы (\`__dunder__\` = *double underscore*) позволяют объекту интегрироваться в стандартные протоколы Python:

1. **\`__init__(self, ...)\`:** конструктор (инициализатор экземпляра).
2. **\`__call__(self, *args)\`:** позволяет вызывать экземпляр класса как обычную функцию!
   \`\`\`python
   class LinearLayer:
       def __init__(self, weight: float, bias: float):
           self.weight = weight
           self.bias = bias
       
       def __call__(self, x: float) -> float:
           return self.weight * x + self.bias

   layer = LinearLayer(weight=2.0, bias=1.5)
   print(layer(3.0)) # 7.5 — вызов объекта напрямую благодаря __call__!
   \`\`\`
   Именно благодаря \`__call__\` мы в PyTorch пишем \`output = model(inputs)\` вместо \`model.forward(inputs)\`.
3. **\`__len__\` и \`__getitem__\`:** протокол индексации Sequence. Это основа любого кастомного датасета:
   \`\`\`python
   class TextDataset:
       def __init__(self, texts: list[str], labels: list[int]):
           self.texts = texts
           self.labels = labels

       def __len__(self) -> int:
           return len(self.texts)

       def __getitem__(self, idx: int):
           return self.texts[idx], self.labels[idx]

   ds = TextDataset(["good", "bad"], [1, 0])
   print(len(ds))    # 2 -> вызван __len__
   print(ds[0])      # ('good', 1) -> вызван __getitem__
   \`\`\`

---

#### 2. Dataclasses (\`@dataclass\`) для конфигов и гиперпараметров
Начиная с Python 3.7, модуль \`dataclasses\` избавляет от написания шаблонных \`__init__\`, \`__repr__\` и \`__eq__\`:
\`\`\`python
from dataclasses import dataclass

@dataclass
class TrainingConfig:
    learning_rate: float = 1e-4
    batch_size: int = 64
    epochs: int = 10
    optimizer: str = "AdamW"
    weight_decay: float = 0.01

cfg = TrainingConfig(learning_rate=3e-4)
print(cfg) # TrainingConfig(learning_rate=0.0003, batch_size=64, epochs=10, optimizer='AdamW', weight_decay=0.01)
\`\`\`

---

#### 3. Методы класса, статические методы и фабрики: \`@classmethod\` vs \`@staticmethod\`
На технических интервью часто проверяют понимание сигнатур методов:
1. **Метод экземпляра (\`def method(self, ...)\`):**
   * Получает первым аргументом экземпляр \`self\`. Имеет полный доступ к изменению состояния объекта (\`self.weight\`).
2. **Метод класса (\`@classmethod\` с \`cls\`):**
   * Получает первым аргументом сам класс (\`cls\`), а не экземпляр.
   * Идеален для **альтернативных конструкторов (фабричных методов)**, например загрузки конфигурации или весов:
     \`\`\`python
     class ResNetBackbone:
         def __init__(self, depth: int, weights_path: str | None = None):
             self.depth = depth
             self.weights_path = weights_path

         @classmethod
         def from_pretrained(cls, model_name: str):
             # Возвращает экземпляр правильного класса, даже при наследовании!
             depth = 50 if "50" in model_name else 18
             return cls(depth=depth, weights_path=f"/models/{model_name}.pt")
     \`\`\`
3. **Статический метод (\`@staticmethod\`):**
   * Не получает неявных аргументов (ни \`self\`, ни \`cls\`). Это абсолютно обычная изолированная функция, которая логически привязана к пространству имен класса для чистоты архитектуры:
     \`\`\`python
     class LossUtils:
         @staticmethod
         def compute_l2_norm(w: list[float]) -> float:
             return sum(x ** 2 for x in w) ** 0.5
     \`\`\`

---

#### 4. \`__repr__\`, \`__str__\`, \`__eq__\` и \`__hash__\`

* \`__repr__\` — однозначное представление для отладки: \`LinearLayer(weight=2.0, bias=1.5)\`.
* \`__str__\` — человекочитаемое представление для пользователя.
* \`__eq__\` — логическое равенство; если переопределяете его, переопределите и \`__hash__\`, иначе объект станет нехэшируемым.

\`\`\`python
class LinearLayer:
    def __init__(self, weight: float, bias: float):
        self.weight = weight
        self.bias = bias

    def __repr__(self) -> str:
        return f"LinearLayer(weight={self.weight}, bias={self.bias})"

    def __eq__(self, other) -> bool:
        if not isinstance(other, LinearLayer):
            return NotImplemented
        return (self.weight, self.bias) == (other.weight, other.bias)

    def __hash__(self) -> int:
        return hash((self.weight, self.bias))
\`\`\`

#### 5. Наследование, MRO и композиция

Python использует C3-линеаризацию для метода разрешения порядка (MRO). \`super()\` идет к следующему классу в MRO, а не просто к родителю. В ML чаще предпочтительна композиция: модель содержит слои, а не наследует их.

\`\`\`python
class Encoder:
    def forward(self, x):
        ...

class Classifier:
    def __init__(self, encoder: Encoder):
        self.encoder = encoder  # композиция

    def forward(self, x):
        return self.head(self.encoder.forward(x))
\`\`\`

Наследование уместно для «является» (\`nn.Module\` → \`MyModel\`), композиция — для «содержит» (модель содержит энкодер).

#### 6. \`@property\`, \`__slots__\` и ABC

* \`@property\` позволяет вычислять атрибут и валидировать инварианты без изменения интерфейса.
* \`__slots__\` убирает \`__dict__\` у экземпляра и экономит память при миллионах объектов.
* \`abc.ABC\` и \`@abstractmethod\` задают контракт, который обязаны реализовать наследники.

\`\`\`python
from abc import ABC, abstractmethod

class Estimator(ABC):
    @abstractmethod
    def fit(self, X, y): ...

    @abstractmethod
    def predict(self, X): ...
\`\`\`

#### 7. Мини-пример: слой как объект

\`\`\`python
class Linear:
    def __init__(self, in_features: int, out_features: int):
        self.weight = [[0.0] * in_features for _ in range(out_features)]
        self.bias = [0.0] * out_features

    def __call__(self, x: list[float]) -> list[float]:
        return [
            sum(w * xi for w, xi in zip(row, x)) + b
            for row, b in zip(self.weight, self.bias)
        ]
\`\`\`

Именно \`__call__\` делает слой вызываемым, а \`__len__\`/\`__getitem__\` — совместимым с \`Dataset\` и \`DataLoader\`.`,
      en: `### OOP Design Patterns in ML Libraries

Modern ML frameworks adhere to standardized object-oriented protocols:
* **Scikit-learn:** classes inherit \`BaseEstimator\`, exposing \`fit()\` and \`predict()\`.
* **PyTorch:** neural layers inherit \`torch.nn.Module\`, overriding \`forward()\`.

---

#### 1. Dunder Magic Methods
* **\`__call__\`**: enables object invocation as a callable function (underlying mechanism of \`model(x)\`).
* **\`__len__\` and \`__getitem__\`**: implements sequence indexing protocol utilized in \`torch.utils.data.Dataset\`.

---

#### 2. Dataclasses
\`\`\`python
from dataclasses import dataclass

@dataclass
class ModelHyperparams:
    embedding_dim: int = 768
    num_heads: int = 12
    dropout: float = 0.1
\`\`\`

---

#### 3. \`__repr__\`, \`__str__\`, \`__eq__\`, and \`__hash__\`

* \`__repr__\` — unambiguous debugging representation.
* \`__str__\` — human-readable representation.
* \`__eq__\` — logical equality; if you override it, override \`__hash__\` too, otherwise instances become unhashable.

\`\`\`python
class LinearLayer:
    def __init__(self, weight: float, bias: float):
        self.weight = weight
        self.bias = bias

    def __repr__(self) -> str:
        return f"LinearLayer(weight={self.weight}, bias={self.bias})"

    def __eq__(self, other) -> bool:
        if not isinstance(other, LinearLayer):
            return NotImplemented
        return (self.weight, self.bias) == (other.weight, other.bias)

    def __hash__(self) -> int:
        return hash((self.weight, self.bias))
\`\`\`

#### 4. Inheritance, MRO, and Composition

Python uses C3 linearization for method resolution order (MRO). \`super()\` delegates to the next class in the MRO, not simply to the parent. In ML, composition is usually preferable: a model contains layers instead of inheriting from them.

\`\`\`python
class Encoder:
    def forward(self, x):
        ...

class Classifier:
    def __init__(self, encoder: Encoder):
        self.encoder = encoder  # composition

    def forward(self, x):
        return self.head(self.encoder.forward(x))
\`\`\`

Inheritance fits an "is-a" relationship (\`nn.Module\` → \`MyModel\`); composition fits "has-a" (a model has an encoder).

#### 5. \`@property\`, \`__slots__\`, and ABC

* \`@property\` computes an attribute and validates invariants without changing the interface.
* \`__slots__\` removes the per-instance \`__dict__\` and saves memory for millions of objects.
* \`abc.ABC\` and \`@abstractmethod\` define a contract subclasses must implement.

\`\`\`python
from abc import ABC, abstractmethod

class Estimator(ABC):
    @abstractmethod
    def fit(self, X, y): ...

    @abstractmethod
    def predict(self, X): ...
\`\`\`

#### 6. Mini-Example: A Layer as an Object

\`\`\`python
class Linear:
    def __init__(self, in_features: int, out_features: int):
        self.weight = [[0.0] * in_features for _ in range(out_features)]
        self.bias = [0.0] * out_features

    def __call__(self, x: list[float]) -> list[float]:
        return [
            sum(w * xi for w, xi in zip(row, x)) + b
            for row, b in zip(self.weight, self.bias)
        ]
\`\`\`

\`__call__\` makes the layer callable, while \`__len__\`/\`__getitem__\` make a dataset compatible with \`DataLoader\`.`,
    },
    commonMistakes: [
      {
        ru: 'Вызывать метод `model.forward(x)` напрямую в PyTorch вместо `model(x)`: прямой вызов игнорирует хуки (hooks) и профилировщики PyTorch.',
        en: 'Invoking `model.forward(x)` directly instead of `model(x)`, bypassing PyTorch forward hooks and tracing systems.',
      },
      {
        ru: 'Объявлять изменяемые переменные в теле класса вне `__init__`: они становятся разделяемыми атрибутами класса (Class Attributes), общими для всех экземпляров.',
        en: 'Declaring mutable attributes at class body scope, accidentally sharing state across all class instances.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'py-cp-5',
        question: {
          ru: 'Какой дандер-метод позволяет вызывать объект класса как обычную функцию (например, `output = layer(inputs)`)?',
          en: 'Which dunder method enables invoking a class instance like a standard function (`output = layer(x)`)?',
        },
        options: [
          { ru: '__call__(self, *args, **kwargs)', en: '__call__(self, *args, **kwargs)' },
          { ru: '__invoke__(self, *args)', en: '__invoke__(self, *args)' },
          { ru: '__run__(self, *args)', en: '__run__(self, *args)' },
          { ru: '__forward__(self, *args)', en: '__forward__(self, *args)' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Метод `__call__` превращает любой объект в вызываемый (callable), позволяя использовать круглые скобки `obj(...)`.',
          en: 'Implementing `__call__` turns instances into callables executed with standard parenthesis syntax.',
        },
      },
      {
        id: 'py-cp-5-b',
        question: {
          ru: 'Какие два дандер-метода обязан реализовать пользовательский датасет в PyTorch (`torch.utils.data.Dataset`), чтобы поддерживать индексацию `dataset[i]`?',
          en: 'Which two dunder methods must a custom PyTorch Map-style Dataset implement to support indexing `dataset[i]`?',
        },
        options: [
          { ru: '`__len__(self)` и `__getitem__(self, idx)`', en: '`__len__(self)` and `__getitem__(self, idx)`' },
          { ru: '`__iter__(self)` и `__next__(self)`', en: '`__iter__(self)` and `__next__(self)`' },
          { ru: '`__init__(self)` и `__call__(self)`', en: '`__init__(self)` and `__call__(self)`' },
          { ru: '`__repr__(self)` и `__str__(self)`', en: '`__repr__(self)` and `__str__(self)`' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Метод `__len__` возвращает общее число сэмплов, а `__getitem__` возвращает отдельный пример по переданному индексу для упаковки в батчи через DataLoader.',
          en: '`__len__` reports dataset size, and `__getitem__` loads sample pairs at specified index for batch collation in DataLoader.',
        },
      },
      {
        id: 'py-cp-5-c',
        question: {
          ru: 'В чем разница между атрибутами класса (Class Attributes) и атрибутами экземпляра (Instance Attributes)?',
          en: 'What is the key difference between Class Attributes and Instance Attributes in Python?',
        },
        options: [
          { ru: 'Атрибуты класса разделяются всеми экземплярами класса, а атрибуты экземпляра уникальны для каждого объекта и привязаны к `self`', en: 'Class attributes are shared across all instances, whereas instance attributes are unique to each object and bound to `self`' },
          { ru: 'Атрибуты класса неизменяемы, а атрибуты экземпляра всегда изменяемы', en: 'Class attributes are immutable, while instance attributes are always mutable' },
          { ru: 'Атрибуты экземпляра доступны только внутри метода `__init__`', en: 'Instance attributes can only be accessed within the `__init__` method' },
          { ru: 'Между ними нет разницы, это два названия одного механизма', en: 'There is no difference, they are identical concepts' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Переменные, объявленные в теле класса вне методов, являются общими для всех объектов. Если объявить там список, изменение его в одном экземпляре отразится во всех остальных.',
          en: 'Variables defined at class scope are shared by all instances. Mutable class attributes mutated by one instance impact all others.',
        },
      },
    ],
  },
  {
    id: 'py-6-modules-perf',
    moduleId: 'python-foundations',
    title: {
      ru: 'Модули, обработка исключений и почему чистый Python медленный для ML',
      en: 'Modules, Exception Handling & Why Pure Python is Slow for Linear Algebra',
    },
    order: 6,
    estimatedMinutes: 17,
    draft: false,
    theoryMarkdown: {
      ru: `### От чистого Python к высокопроизводительному ML-стеку

Почему нельзя обучить нейросеть на чистых циклах Python? Понимание архитектуры рантайма Python объясняет, зачем нужны NumPy, Polars и CUDA.

---

#### 1. Скрипт, модуль и пакет

Пока проект состоит из одного файла, разницы между «скриптом» и «модулем» нет. Она появляется, когда файлов становится несколько.

* **Скрипт** — файл, который вы запускаете напрямую: \`python train.py\`.
* **Модуль** — любой \`.py\`-файл, который импортируется: \`import utils\`.
* **Пакет** — каталог с модулями и файлом \`__init__.py\` (в Python 3.3+ допустимы namespace-пакеты без него, но в прикладных проектах файл обычно добавляют).

Когда вы пишете \`import src.models\`, интерпретатор:
1. Ищет \`src\` в списке путей \`sys.path\` (каталог запускаемого скрипта, \`PYTHONPATH\`, site-packages).
2. Внутри \`src\` ищет \`models.py\` или \`models/__init__.py\`.
3. Выполняет найденный файл **сверху вниз ровно один раз** и кэширует его в \`sys.modules\`.

Именно поэтому повторный \`import\` почти бесплатен, а побочные эффекты на верхнем уровне модуля (тяжелая загрузка данных, запуск обучения, сетевые запросы) выполняются при первом импорте. Это первая причина, по которой код запуска принято отделять от кода библиотеки.

\`\`\`python
# src/models.py
def train():
    ...

print("модуль загружен")  # выполнится при import src.models
\`\`\`

#### 2. Точка входа: \`if __name__ == "__main__":\`

При загрузке файла Python сам создает переменную \`__name__\`:
* \`"__main__"\`, если файл запущен напрямую;
* имя модуля (\`"src.models"\`), если файл импортирован.

Поэтому паттерн:

\`\`\`python
# train.py
from src.models import train

if __name__ == "__main__":
    train()
\`\`\`

делает файл одновременно библиотекой (функцию \`train\` можно импортировать в тестах) и самостоятельной программой. Без этого блока \`import train\` в тестах запустил бы обучение целиком.

Полезно мыслить так: **модуль — это описание возможностей, а блок \`__main__\` — команда, которую выполняет пользователь.** Верхний уровень модуля должен только объявлять функции, классы и константы; все действия — внутри \`main()\`.

#### 3. От точки входа к ресурсам

Скрипт запущен, модули импортированы, \`main()\` начал работу. Дальше почти любой реальный пайплайн открывает ресурсы: файл с логами, CSV с данными, соединение с базой, сокет, временный каталог, блокировку. И здесь возникает вопрос: **кто гарантирует, что ресурс будет освобожден, если посередине случится исключение?**

Ручной вариант ненадежен:

\`\`\`python
f = open("train.log", "w")
try:
    train()
finally:
    f.close()
\`\`\`

\`try/finally\` работает, но чем больше ресурсов, тем больше вложенности. Для этого в Python есть протокол контекстного менеджера.

#### 4. Контекстные менеджеры: \`with\` как гарантия очистки

Конструкция \`with\` вызывает у объекта два метода:
1. \`__enter__()\` — подготовка ресурса; результат попадает в переменную после \`as\`.
2. \`__exit__(exc_type, exc_value, traceback)\` — очистка. Вызывается **всегда**: и при успешном выходе, и при исключении.

\`\`\`python
with open("dataset.csv", "w") as f:
    f.write("id,target\\n")
# здесь файл уже закрыт, даже если write() бросил исключение
\`\`\`

Минимальный собственный менеджер:

\`\`\`python
import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        print(f"elapsed: {self.elapsed:.3f}s")
        return False  # False — не подавлять исключение
\`\`\`

Если \`__exit__\` вернет \`True\`, исключение будет подавлено. По умолчанию так делать не стоит: ошибки должны быть видны.

Для функций есть более короткий путь — декоратор \`contextlib.contextmanager\`:

\`\`\`python
from contextlib import contextmanager

@contextmanager
def opened(path):
    f = open(path, "w")
    try:
        yield f
    finally:
        f.close()

with opened("train.log") as f:
    f.write("start\\n")
\`\`\`

Всё, что до \`yield\`, — это \`__enter__\`; всё после — \`__exit__\`. \`try/finally\` внутри обязателен, иначе при исключении ресурс не закроется.

#### 5. Собираем всё вместе

\`\`\`python
# train.py
from contextlib import contextmanager
from src.models import train

@contextmanager
def training_run(log_path: str):
    log = open(log_path, "w")
    try:
        log.write("run started\\n")
        yield log
    finally:
        log.write("run finished\\n")
        log.close()

def main() -> None:
    with training_run("train.log") as log:
        train()
        log.write("model saved\\n")

if __name__ == "__main__":
    main()
\`\`\`

Здесь видны все три идеи урока: \`train.py\` — точка входа, \`src.models\` — импортируемый модуль, \`with\` — гарантия, что лог закроется при любом исходе.

---

#### 6. Почему чистый цикл Python медленный: Boxing и GIL

1. **Dynamic Type Boxing:** в Python число \`42\` — это не 4 байта в регистре CPU, а огромная C-структура \`PyObject\` (~28 байт), содержащая счетчик ссылок и указатель на тип.
2. **Динамическая диспетчеризация:** на каждой итерации цикла \`for x in numbers:\` интерпретатор заново проверяет тип \`x\` и ищет реализацию сложения.
3. **GIL (Global Interpreter Lock — Глобальная блокировка интерпретатора):**
   * **Что это такое и почему он существует?**
     CPython использует подсчет ссылок (\`reference counting\`) как основной механизм сборки мусора: каждый объект хранит поле \`ob_refcnt\`. Если несколько потоков ОС одновременно увеличат или уменьшат счетчик ссылок без синхронизации, возникнет гонка данных (Race Condition), что приведет к утечке памяти или аварийному падению (Segmentation Fault). Чтобы не ставить тяжелые блокировки на каждую операцию каждого объекта, Гвидо ван Россум ввел один глобальный мьютекс — **GIL**, позволяющий только одному системному потоку выполнять байткод Python в любой момент времени.
   * **Следствие:** стандартные потоки \`threading.Thread\` в Python **бесполезны для ускорения CPU-bound вычислений** на многоядерных процессорах (они будут выполняться строго по очереди на одном ядре).

#### 7. Как обходят GIL в реальном машинном обучении
1. **Модуль \`multiprocessing\` / \`concurrent.futures.ProcessPoolExecutor\`:**
   Порождает независимые процессы операционной системы. У каждого процесса свой изолированный интерпретатор Python, свое адресное пространство и свой собственный GIL. Стандарт для DataLoader в PyTorch (\`num_workers=4\`).
2. **Асинхронность (\`asyncio\`):**
   Для задач ввода-вывода (I/O-bound — скачивание батчей, запросы к внешним LLM API, чтение базы данных) поток отдает управление во время ожидания сетевого ответа.
3. **Отпускание GIL в нативных библиотеках (NumPy, PyTorch, Polars, Cython, Numba):**
   В C/C++ расширениях макрос \`Py_BEGIN_ALLOW_THREADS\` или блок \`with nogil:\` в Cython временно отпускает GIL!
   * Когда PyTorch умножает два гигантских тензора на GPU через cuBLAS или на CPU через OpenMP, GIL отпущен, и вычисления идут параллельно на всех ядрах!`,
      en: `### From Pure Python to High-Performance ML Kernels

Why can't we train machine learning models using raw Python loops?

---

#### 1. Scripts, Modules, and Packages

A single-file project does not distinguish between a script and a module. That changes as soon as the codebase grows.

* **Script** — a file you execute directly: \`python train.py\`.
* **Module** — any \`.py\` file imported elsewhere: \`import utils\`.
* **Package** — a directory of modules containing an \`__init__.py\` file (Python 3.3+ also supports namespace packages without it, but application projects usually include one).

When you write \`import src.models\`, the interpreter:
1. Looks for \`src\` on \`sys.path\` (the script directory, \`PYTHONPATH\`, site-packages).
2. Inside \`src\`, looks for \`models.py\` or \`models/__init__.py\`.
3. Executes the file **top to bottom exactly once** and caches it in \`sys.modules\`.

That is why repeated imports are almost free, while side effects at module top level (loading data, starting training, network calls) run on the first import. This is the first reason to separate startup code from library code.

\`\`\`python
# src/models.py
def train():
    ...

print("module loaded")  # runs on import src.models
\`\`\`

#### 2. The Entry Point: \`if __name__ == "__main__":\`

When Python loads a file, it sets \`__name__\`:
* \`"__main__"\` when the file is executed directly;
* the module name (\`"src.models"\`) when the file is imported.

Hence the pattern:

\`\`\`python
# train.py
from src.models import train

if __name__ == "__main__":
    train()
\`\`\`

The file is both a library (tests can import \`train\`) and a standalone program. Without the guard, \`import train\` in a test would start a full training run.

A useful mental model: **a module describes capabilities; the \`__main__\` block is the command the user runs.** Module top level should only declare functions, classes, and constants; actions belong in \`main()\`.

#### 3. From the Entry Point to Resources

The script is running, modules are imported, \`main()\` has started. Almost any real pipeline then opens resources: a log file, a CSV, a database connection, a socket, a temporary directory, a lock. The question becomes: **who guarantees the resource is released if an exception happens halfway through?**

The manual version is fragile:

\`\`\`python
f = open("train.log", "w")
try:
    train()
finally:
    f.close()
\`\`\`

\`try/finally\` works, but nesting grows with every resource. Python therefore provides the context manager protocol.

#### 4. Context Managers: \`with\` as a Cleanup Guarantee

The \`with\` statement calls two methods:
1. \`__enter__()\` — prepares the resource; its result is bound after \`as\`.
2. \`__exit__(exc_type, exc_value, traceback)\` — cleanup. It runs **always**, on success and on exception.

\`\`\`python
with open("dataset.csv", "w") as f:
    f.write("id,target\\n")
# the file is closed even if write() raised
\`\`\`

A minimal custom manager:

\`\`\`python
import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        print(f"elapsed: {self.elapsed:.3f}s")
        return False  # False — do not suppress exceptions
\`\`\`

Returning \`True\` from \`__exit__\` suppresses the exception. Do not do that by default: errors should stay visible.

For functions there is a shorter path — \`contextlib.contextmanager\`:

\`\`\`python
from contextlib import contextmanager

@contextmanager
def opened(path):
    f = open(path, "w")
    try:
        yield f
    finally:
        f.close()

with opened("train.log") as f:
    f.write("start\\n")
\`\`\`

Everything before \`yield\` is \`__enter__\`; everything after is \`__exit__\`. The internal \`try/finally\` is mandatory, otherwise the resource leaks on exceptions.

#### 5. Putting It All Together

\`\`\`python
# train.py
from contextlib import contextmanager
from src.models import train

@contextmanager
def training_run(log_path: str):
    log = open(log_path, "w")
    try:
        log.write("run started\\n")
        yield log
    finally:
        log.write("run finished\\n")
        log.close()

def main() -> None:
    with training_run("train.log") as log:
        train()
        log.write("model saved\\n")

if __name__ == "__main__":
    main()
\`\`\`

All three ideas of this lesson meet here: \`train.py\` is the entry point, \`src.models\` is an imported module, and \`with\` guarantees the log is closed no matter how the run ends.

---

#### 6. The Bottlenecks of Pure Python Loops
* **Object Boxing:** raw integers/floats are wrapped in heap-allocated 28-byte \`PyObject\` structs.
* **Dynamic Dispatch:** runtime type lookups execute on every loop iteration.
* **Global Interpreter Lock (GIL):** restricts multi-threaded execution over CPU-bound tasks.

---

#### 7. The Bridge to Native SIMD and GPU Acceleration
Python acts as a high-level orchestrator. Numerical libraries (NumPy, PyTorch, Polars) delegate contiguous memory buffers directly into native C/C++/CUDA kernels executing SIMD instructions and tensor cores.`,
    },
    commonMistakes: [
      {
        ru: 'Использовать вложенные циклы Python `for i in range(1000): for j in range(1000):` для умножения матриц: это в 100-300 раз медленнее, чем векторизованное умножение `A @ B` в NumPy/PyTorch.',
        en: 'Writing nested pure Python loops for matrix multiplication instead of vectorized operations `A @ B`.',
      },
      {
        ru: 'Писать исполняемый код верхнего уровня в модуле без блока `if __name__ == "__main__":` при использовании multiprocessing: приводит к рекурсивному спавну процессов.',
        en: 'Placing execution code outside `if __name__ == "__main__":`, causing infinite recursive spawn loops under multiprocessing.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'py-cp-6',
        question: {
          ru: 'Почему векторизованные операции в библиотеках NumPy и PyTorch выполняются в сотни раз быстрее обычных циклов Python?',
          en: 'Why do vectorized operations in NumPy/PyTorch run hundreds of times faster than standard Python loops?',
        },
        options: [
          {
            ru: 'Они работают с непрерывными массивами типизированной памяти на уровне скомпилированного C/CUDA кода с использованием SIMD-инструкций CPU/GPU',
            en: 'They operate over contiguous homogeneous memory buffers in native C/CUDA utilizing SIMD processor registers',
          },
          {
            ru: 'Они автоматически удаляют все отрицательные числа из выборки',
            en: 'They automatically drop negative numbers from tensors',
          },
          {
            ru: 'Они переводят код Python в язык JavaScript',
            en: 'They translate Python into JavaScript',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'NumPy и PyTorch хранят однородные массивы (например, float32) в непрерывной памяти без оберток PyObject и выполняют операции через параллельные векторные инструкции процессора и видеокарты.',
          en: 'Contiguous native memory layout eliminates object boxing and dynamic type lookup overhead while utilizing hardware SIMD pipelines.',
        },
      },
      {
        id: 'py-cp-6-b',
        question: {
          ru: 'Что такое Global Interpreter Lock (GIL) в CPython и как он влияет на многопоточность?',
          en: 'What is the Global Interpreter Lock (GIL) in CPython and how does it constrain threading?',
        },
        options: [
          { ru: 'GIL — мьютекс, позволяющий только одному нативному потоку выполнять байткод Python одновременно, ограничивая CPU-bound задачи одним ядром', en: 'GIL is a mutex allowing only one native thread to execute Python bytecode at a time, constraining CPU-bound tasks to a single core' },
          { ru: 'GIL блокирует доступ к жесткому диску при записи файлов', en: 'GIL locks disk I/O operations during file writes' },
          { ru: 'GIL ускоряет обучение нейросетей на видеокартах', en: 'GIL accelerates neural network training on GPUs' },
          { ru: 'GIL запрещает использование рекурсивных функций', en: 'GIL disables recursive function calls' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Из-за потоконебезопасного механизма подсчета ссылок в CPython GIL блокирует параллельное выполнение байткода на нескольких ядрах CPU. Для CPU-bound вычислений используют `multiprocessing` или библиотеки на C/Rust (NumPy, Polars).',
          en: 'Due to reference-counting memory management, GIL restricts Python bytecode execution to one thread per process. True parallelism requires multiprocessing or C/Rust extensions.',
        },
      },
      {
        id: 'py-cp-6-c',
        question: {
          ru: 'Для чего в Python-скриптах используется конструкция `if __name__ == "__main__":`?',
          en: 'What is the purpose of the `if __name__ == "__main__":` idiom in Python modules?',
        },
        options: [
          { ru: 'Чтобы код внутри блока выполнялся только при прямом запуске файла, но игнорировался при импорте модуля другими скриптами', en: 'To ensure enclosed code executes only when run as a standalone script, but is skipped when imported as a library module' },
          { ru: 'Для автоматического ускорения выполнения функций в 2 раза', en: 'To double function execution speed via JIT compilation' },
          { ru: 'Это обязательное требование синтаксиса для объявления функций', en: 'It is a mandatory syntax requirement for defining functions' },
          { ru: 'Для защиты файла паролем от несанкционированного чтения', en: 'To password-protect files against unauthorized reads' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'При импорте модуля переменная `__name__` равна имени файла, а при прямом запуске — строке `"__main__"`. Это предотвращает случайный запуск тяжелого обучения при импорте утилит.',
          en: 'When imported, `__name__` holds the module name; when executed directly, it evaluates to `"__main__"`. This prevents executing script payloads on import.',
        },
      },
    ],
  },
  {
    id: 'py-7-trees-algorithms',
    moduleId: 'python-foundations',
    title: {
      ru: 'Деревья и BST в Python: обходы (DFS, BFS), свойства и алгоритмы для ML-собеседований',
      en: 'Trees & BST in Python: Traversals (DFS, BFS), Properties & ML Interview Algorithms',
    },
    order: 7,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Деревья на собеседованиях по машинному обучению
Почему ML-инженеру обязательно знать алгоритмы на деревьях?
1. **Прямая связь с алгоритмами ML:** Решающие деревья (CART, Random Forest, XGBoost, LightGBM) строятся именно как бинарные деревья с пороговыми предикатами $x_j \\le \\theta$ в узлах и прогнозами в листьях.
2. **Алгоритмический раунд (Coding Interview):** Понимание рекурсии, DFS, BFS и деревьев поиска (BST) — стандартный фильтр на собеседованиях уровня Middle / Senior ML Engineer в FAANG и бигтех-компаниях.

---

#### 1. Представление узла бинарного дерева в Python
\`\`\`python
from typing import Optional

class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self) -> str:
        return f"TreeNode({self.val})"
\`\`\`

---

#### 2. Свойства Двоичного Дерева Поиска (BST — Binary Search Tree)
Для каждого узла $u$:
* Любое значение в **левом поддереве** строго меньше значения узла: $\\forall v \\in \\text{left}(u): v.val < u.val$.
* Любое значение в **правом поддереве** строго больше (или равно) значения узла: $\\forall v \\in \\text{right}(u): v.val > u.val$.
* **Сложность операций:**
  * В сбалансированном дереве (AVL, Red-Black): поиск, вставка, удаление выполняются за $O(\\log N)$.
  * В вырожденном дереве (список): $O(N)$.

---

#### 3. Обходы в глубину (DFS — Depth-First Search)
Рекурсивный обход посещает поддеревья с разным порядком обработки текущего узла:

\`\`\`python
# 1. In-Order (Left -> Root -> Right)
# КРИТИЧЕСКИ ВАЖНО: Для BST In-Order обход всегда возвращает элементы в СТРОГО ВОЗРАСТАЮЩЕМ порядке!
def inorder_traversal(root: Optional[TreeNode]) -> list[int]:
    if not root:
        return []
    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)

# 2. Pre-Order (Root -> Left -> Right)
# Используется для сериализации структуры дерева (сохранение обученного дерева решений в JSON / файл)
def preorder_traversal(root: Optional[TreeNode]) -> list[int]:
    if not root:
        return []
    return [root.val] + preorder_traversal(root.left) + preorder_traversal(root.right)

# 3. Post-Order (Left -> Right -> Root)
# Вычисление снизу вверх (Bottom-Up): подсчет высоты, удаление узлов, агрегация предсказаний
def postorder_traversal(root: Optional[TreeNode]) -> list[int]:
    if not root:
        return []
    return postorder_traversal(root.left) + postorder_traversal(root.right) + [root.val]
\`\`\`

---

#### 4. Обход в ширину по уровням (BFS / Level-Order Traversal)
BFS исследует дерево слой за слоем. Для эффективного извлечения из начала очереди с временной сложностью $O(1)$ всегда используйте \`collections.deque\` (обычный \`list.pop(0)\` работает за $O(N)$!):

\`\`\`python
from collections import deque

def level_order(root: Optional[TreeNode]) -> list[list[int]]:
    if not root:
        return []
    
    levels: list[list[int]] = []
    queue: deque[TreeNode] = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level: list[int] = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
                
        levels.append(current_level)
        
    return levels
\`\`\`

---

#### 5. Топ алгоритмических задач на деревья для ML
1. **Проверка валидности BST (Validate BST):**
   *Частая ошибка:* проверять только \`node.left.val < node.val < node.right.val\` локально. Это неверно! Все элементы в правом поддереве обязаны быть больше корня.
   *Правильное решение:* передавать диапазон допустимых значений \`(min_val, max_val)\`:
   \`\`\`python
   def is_valid_bst(root: Optional[TreeNode], min_val=float('-inf'), max_val=float('inf')) -> bool:
       if not root:
           return True
       if not (min_val < root.val < max_val):
           return False
       return (is_valid_bst(root.left, min_val, root.val) and 
               is_valid_bst(root.right, root.val, max_val))
   \`\`\`

2. **Максимальная глубина дерева (Maximum Depth):**
   \`\`\`python
   def max_depth(root: Optional[TreeNode]) -> int:
       if not root:
           return 0
       return 1 + max(max_depth(root.left), max_depth(root.right))
   \`\`\`
   В CART глубина ограничивается гиперпараметром \`max_depth\` для регуляризации и борьбы с переобучением.

3. **Наименьший общий предок в BST (Lowest Common Ancestor — LCA):**
   \`\`\`python
   def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
       curr = root
       while curr:
           if p.val > curr.val and q.val > curr.val:
               curr = curr.right
           elif p.val < curr.val and q.val < curr.val:
               curr = curr.left
           else:
               return curr # Точка ветвления — это и есть наименьший общий предок
       return root
   \`\`\`

---

#### 6. Итеративные обходы и риск \`RecursionError\`

Рекурсия элегантна, но Python ограничивает глубину стека (обычно около 1000 вызовов). Для вырожденного дерева из 10 000 узлов рекурсивный DFS упадет с \`RecursionError\`. Итеративный вариант с явным стеком:

\`\`\`python
def inorder_iterative(root):
    result, stack = [], []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result
\`\`\`

BFS с \`deque\` уже итеративен, поэтому для широких деревьев он безопаснее по памяти стека, но требует $O(\\text{width})$ памяти.

#### 7. Вставка и поиск в BST

\`\`\`python
def search(root, target):
    curr = root
    while curr:
        if target == curr.val:
            return curr
        curr = curr.left if target < curr.val else curr.right
    return None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root
\`\`\`

В среднем — $O(\\log N)$, в вырожденном случае — $O(N)$.

#### 8. Почему BST вырождается и как это лечат

Если вставлять отсортированные данные \`1, 2, 3, 4, ...\`, BST превращается в связный список. Самобалансирующиеся деревья (AVL, Red-Black) поддерживают высоту $O(\\log N)$ за счет поворотов. В ML это важно понимать концептуально: деревья решений тоже могут быть несбалансированными, поэтому глубину ограничивают \`max_depth\`, а ансамбли (Random Forest, GBDT) снижают дисперсию.

#### 9. Связь с ML-алгоритмами

* **CART** выбирает порог $x_j \\le \\theta$, максимизируя прирост информации; каждый узел — бинарный сплит.
* **Random Forest** усредняет много глубоких деревьев, снижая дисперсию.
* **GBDT** строит деревья последовательно на антиградиенте, исправляя ошибки предыдущих.
* **Feature importance** и SHAP объясняют вклад признаков через структуру деревьев.`,
      en: `### Tree Data Structures in ML Technical Interviews
Why are tree algorithms critical for ML Engineers?
1. **Decision-based ML Architectures:** Decision trees (CART, Random Forests, Gradient Boosted Trees) evaluate boolean split predicates $x_j \\le \\theta$ at internal nodes and store terminal values at leaves.
2. **Coding Interviews:** Tree traversals (DFS, BFS), recursion invariant tracking, and binary search properties are foundational evaluation criteria at top tier tech companies.

#### 1. Python TreeNode Representation
\`\`\`python
from typing import Optional

class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right
\`\`\`

#### 2. BST Invariant & In-Order Traversal
In a Binary Search Tree (BST), every node in the left subtree has a value strictly less than the parent node, and every node in the right subtree has a value strictly greater than the parent.
* **In-Order DFS Traversal (Left -> Root -> Right)** on a BST yields elements in **strictly monotonic ascending order**.

#### 3. Breadth-First Level-Order Traversal via \`collections.deque\`
Using \`collections.deque\` enables $O(1)$ pop operations for queue-based layer-by-layer exploration.

---

#### 4. Iterative Traversals and the \`RecursionError\` Risk

Recursion is elegant, but Python limits stack depth (typically around 1000 frames). A degenerate tree of 10,000 nodes will overflow a recursive DFS. Use an explicit stack:

\`\`\`python
def inorder_iterative(root):
    result, stack = [], []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result
\`\`\`

BFS with \`deque\` is already iterative, so it avoids stack overflow but uses $O(\\text{width})$ memory.

#### 5. BST Search and Insertion

\`\`\`python
def search(root, target):
    curr = root
    while curr:
        if target == curr.val:
            return curr
        curr = curr.left if target < curr.val else curr.right
    return None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root
\`\`\`

Average $O(\\log N)$; worst case $O(N)$.

#### 6. Why BSTs Degenerate and How Balancing Helps

Inserting sorted data \`1, 2, 3, 4, ...\` turns a BST into a linked list. Self-balancing trees (AVL, Red-Black) maintain $O(\\log N)$ height through rotations. In ML this is conceptually important: decision trees can also become unbalanced, so depth is limited by \`max_depth\`, while ensembles (Random Forest, GBDT) reduce variance.

#### 7. Connection to ML Algorithms

* **CART** picks a split threshold $x_j \\le \\theta$ that maximizes information gain; every node is a binary split.
* **Random Forest** averages many deep trees to reduce variance.
* **GBDT** builds trees sequentially on the anti-gradient, correcting previous errors.
* **Feature importance** and SHAP explain feature contributions through tree structure.`,
    },
    commonMistakes: [
      {
        ru: 'Использовать `list.pop(0)` вместо `collections.deque.popleft()` в алгоритме BFS: удаление из начала стандартного списка Python сдвигает все $N$ элементов и превращает алгоритм $O(N)$ в медленный $O(N^2)$.',
        en: 'Using `list.pop(0)` instead of `collections.deque.popleft()` in BFS, degrading algorithmic runtime from $O(N)$ to $O(N^2)$ due to array shifting.',
      },
      {
        ru: 'Проверять валидность BST только между родителем и непосредственными детьми без передачи границ `(low, high)`: левый потомок правого поддерева может быть меньше корня всего дерева.',
        en: 'Checking BST validity locally only against direct child pointers without propagating recursive global boundaries `(low, high)`.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'py-cp-7-a',
        question: {
          ru: 'Какой тип обхода двоичного дерева поиска (BST) гарантированно посещает значения всех узлов в строго отсортированном возрастающем порядке?',
          en: 'Which traversal strategy on a Binary Search Tree (BST) guarantees strictly ascending sorted order?',
        },
        options: [
          { ru: 'In-Order (Left -> Root -> Right)', en: 'In-Order (Left -> Root -> Right)' },
          { ru: 'Pre-Order (Root -> Left -> Right)', en: 'Pre-Order (Root -> Left -> Right)' },
          { ru: 'Post-Order (Left -> Right -> Root)', en: 'Post-Order (Left -> Right -> Root)' },
          { ru: 'Level-Order (BFS сверху вниз)', en: 'Level-Order (BFS top-down)' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'По определению BST все меньшие элементы лежат слева, а большие — справа. In-Order обход сначала рекурсивно выводит всё левое поддерево, затем текущий узел, затем правое поддерево, формируя отсортированную последовательность.',
          en: 'By BST definition, left subtrees contain smaller elements and right subtrees contain larger elements; in-order recursively processes left, root, and right.',
        },
      },
      {
        id: 'py-cp-7-b',
        question: {
          ru: 'Какую структуру данных стандартной библиотеки Python следует использовать для очереди в алгоритме BFS, чтобы операция извлечения узла выполнялась за O(1)?',
          en: 'Which standard Python collection should be used for queue pop operations in BFS to achieve O(1) time complexity?',
        },
        options: [
          { ru: 'collections.deque (метод .popleft())', en: 'collections.deque (.popleft() method)' },
          { ru: 'Стандартный list (метод .pop(0))', en: 'Standard list (.pop(0) method)' },
          { ru: 'dict.popitem()', en: 'dict.popitem()' },
          { ru: 'set.pop()', en: 'set.pop()' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: '`collections.deque` реализован на основе двусвязного списка чанков, что обеспечивает $O(1)$ для вставки и удаления с обоих концов (`append` и `popleft`). В `list` вызов `pop(0)` требует сдвига всех элементов за $O(N)$.',
          en: '`collections.deque` provides double-ended chunked memory guarantees of $O(1)$ amortized push/pop at head and tail.',
        },
      },
      {
        id: 'py-cp-7-c',
        question: {
          ru: 'Какова временная сложность поиска элемента в сбалансированном двоичном дереве поиска (BST) по сравнению с вырожденным деревом?',
          en: 'What is the search time complexity in a balanced Binary Search Tree vs an unbalanced/degenerate tree?',
        },
        options: [
          { ru: 'O(log N) в сбалансированном дереве и O(N) в вырожденном (несбалансированном)', en: 'O(log N) in a balanced BST and O(N) in a degenerate tree' },
          { ru: 'Строго O(1) в обоих случаях', en: 'Strictly O(1) in both cases' },
          { ru: 'O(N²) в худшем случае для любого бинарного дерева', en: 'O(N²) worst-case for any binary tree' },
          { ru: 'O(N log N) для сбалансированного дерева', en: 'O(N log N) for a balanced tree' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В сбалансированном дереве (AVL, Red-Black) высота равна h = log₂ N, поэтому каждый шаг делит пространство поиска пополам. В вырожденном дереве (в виде односвязного списка) поиск деградирует до линейного O(N).',
          en: 'In balanced BSTs, height is bounded by log₂ N. In degenerate tree configurations (e.g. linked lists), search degrades to linear O(N).',
        },
      },
    ],
  },
  {
    id: 'py-8-graphs-dag-algorithms',
    moduleId: 'python-foundations',
    title: {
      ru: 'Графы и DAG в Python: списки смежности, DFS/BFS, поиск циклов и топологическая сортировка',
      en: 'Graphs & DAGs in Python: Adjacency Lists, DFS/BFS, Cycle Detection & Topological Sort',
    },
    order: 8,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Графы и DAG в архитектуре современных ML-систем
В машинном обучении графы встречаются повсеместно:
* **Autograd в PyTorch и TensorFlow:** Вычислительный граф — это **DAG (Directed Acyclic Graph)**, где тензоры являются узлами, а операции — направленными ребрами.
* **Оркестраторы данных (Airflow, Kubeflow, Prefect):** Зависимости между этапами ETL и обучения моделей описываются в виде DAG.
* **Графовые нейросети (GNN — Graph Neural Networks):** Обработка молекул, социальных сетей и рекомендательных систем через матрицы смежности и Message Passing.

---

#### 1. Представление графа в Python
Наиболее идиоматичный и эффективный способ представления разреженного графа — **список смежности (Adjacency List)** на основе \`defaultdict(list)\`:

\`\`\`python
from collections import defaultdict

# Ориентированный граф
graph: dict[int, list[int]] = defaultdict(list)

def add_edge(u: int, v: int, directed: bool = True):
    graph[u].append(v)
    if not directed:
        graph[v].append(u)

add_edge(0, 1)
add_edge(0, 2)
add_edge(1, 3)
add_edge(2, 3)
\`\`\`

---

#### 2. Поиск в ширину (BFS): Кратчайший путь во невзвешенном графе
BFS гарантирует нахождение кратчайшего пути по числу ребер от стартового узла:

\`\`\`python
from collections import deque

def bfs_shortest_path(graph: dict[int, list[int]], start: int, target: int) -> int:
    queue = deque([(start, 0)]) # (node, distance)
    visited = {start}
    
    while queue:
        node, dist = queue.popleft()
        if node == target:
            return dist
            
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
                
    return -1 # Путь не существует
\`\`\`

---

#### 3. Поиск циклов в ориентированном графе (3-х цветная раскраска DFS)
В ориентированном графе для поиска циклов используют три состояния узла:
* **WHITE (0):** узел еще не был исследован.
* **GRAY (1):** узел находится в текущей цепочке вызовов (в активном стеке рекурсии). Если мы встречаем ребро в узел цвета **GRAY** — **в графе обнаружен цикл!**
* **BLACK (2):** узел и все его потомки полностью обработаны.

\`\`\`python
WHITE, GRAY, BLACK = 0, 1, 2

def has_cycle(num_nodes: int, adj: dict[int, list[int]]) -> bool:
    color = [WHITE] * num_nodes
    
    def dfs(u: int) -> bool:
        color[u] = GRAY
        for v in adj[u]:
            if color[v] == GRAY:
                return True # Обнаружено обратное ребро (Back Edge) -> Цикл!
            if color[v] == WHITE:
                if dfs(v):
                    return True
        color[u] = BLACK
        return False
        
    for node in range(num_nodes):
        if color[node] == WHITE:
            if dfs(node):
                return True
    return False
\`\`\`

---

#### 4. Топологическая сортировка (Topological Sort / Алгоритм Кана)
Топологическая сортировка применима **только к DAG** (направленным ациклическим графам). Она упорядочивает узлы так, что для любого ребра $u \\to v$ узел $u$ идет строго раньше узла $v$.

Именно так PyTorch и Airflow вычисляют порядок выполнения операций:

\`\`\`python
def topological_sort_kahn(num_nodes: int, edges: list[tuple[int, int]]) -> list[int]:
    """
    edges: список ребер (u, v), означающих зависимость: u должно выполниться ДО v
    """
    adj = defaultdict(list)
    in_degree = [0] * num_nodes
    
    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1
        
    # Начинаем с узлов с нулевой входящей степенью (нет зависимостей)
    queue = deque([i for i in range(num_nodes) if in_degree[i] == 0])
    execution_order = []
    
    while queue:
        node = queue.popleft()
        execution_order.append(node)
        
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    if len(execution_order) != num_nodes:
        raise ValueError("Граф содержит циклическую зависимость! Выполнение невозможно.")
        
    return execution_order

# Пример: Pipeline зависимостей (0: Clean -> 1: Embeddings -> 2: Train Model)
order = topological_sort_kahn(3, [(0, 1), (1, 2)])
print(order) # [0, 1, 2]
\`\`\`

---

#### 5. Связь с PyTorch Autograd
Когда вы вызываете \`loss.backward()\`:
1. PyTorch идет по графу \`grad_fn\` в **обратном топологическом порядке** (от узла Loss к обучаемым параметрам $W$).
2. В каждом узле применяется цепное правило (Chain Rule) дифференцирования $\\frac{\\partial L}{\\partial W} = \\frac{\\partial L}{\\partial y} \\cdot \\frac{\\partial y}{\\partial W}$.
3. Если бы в вычислительном графе был цикл без разрыва во времени, обратное распространение ошибки зациклилось бы навсегда (именно поэтому рекуррентные нейросети RNN разворачивают во времени — Backpropagation Through Time, превращая в DAG!).

---

#### 6. Список смежности vs матрица смежности

| Критерий | Список смежности | Матрица смежности |
| :--- | :--- | :--- |
| Память | $O(V + E)$ | $O(V^2)$ |
| Проверка ребра $u \\to v$ | $O(\\deg(u))$ | $O(1)$ |
| Перебор соседей | $O(\\deg(u))$ | $O(V)$ |
| Когда использовать | разреженные графы, соцсети, зависимости | плотные графы, малые $V$, GPU-операции |

В ML разреженные графы (батчи, рекомендации, молекулы) почти всегда хранят списком смежности или в формате COO/CSR.

#### 7. DFS по графу: рекурсивный и итеративный

\`\`\`python
def dfs_recursive(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)
    return visited

def dfs_iterative(graph, start):
    visited, stack = set(), [start]
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        stack.extend(graph[node])
    return visited
\`\`\`

Итеративный вариант не упирается в \`RecursionError\`, но порядок обхода может отличаться.

#### 8. Топологическая сортировка через DFS

Альтернатива алгоритму Кана — DFS с добавлением узла в результат после обработки всех потомков, затем разворот списка:

\`\`\`python
def topological_sort_dfs(num_nodes, adj):
    visited, order = set(), []

    def dfs(u):
        visited.add(u)
        for v in adj[u]:
            if v not in visited:
                dfs(v)
        order.append(u)

    for node in range(num_nodes):
        if node not in visited:
            dfs(node)
    return order[::-1]
\`\`\`

Оба алгоритма работают за $O(V + E)$; Кан проще для обнаружения цикла (если обработано меньше $V$ узлов — цикл есть).

#### 9. Где это в ML-инфраструктуре

* **PyTorch Autograd** хранит граф операций и обходит его в обратном топологическом порядке при \`loss.backward()\`.
* **Airflow / Prefect / Kubeflow** описывают пайплайны как DAG: узел запускается, когда все его зависимости завершены.
* **GNN** выполняют message passing по списку смежности или разреженной матрице.
* **Планировщики обучения** (curriculum, multi-task) используют DAG зависимостей между задачами.`,
      en: `### Graphs & DAGs in Machine Learning Infrastructure
Graphs underpin modern ML frameworks:
* **PyTorch Autograd:** Execution graphs are strictly **Directed Acyclic Graphs (DAGs)** where variables are nodes and differential operators are edges.
* **ML Orchestrators (Airflow, Kubeflow, Dagster):** Model training pipelines are defined as DAGs.

#### 1. Graph Representations in Python
Adjacency lists using \`defaultdict(list)\` deliver optimal memory footprint $O(V + E)$ and rapid iteration over outgoing edges.

#### 2. Cycle Detection via 3-Color DFS
Nodes are labeled WHITE (unvisited), GRAY (currently in recursion stack), or BLACK (fully resolved). Enountering a GRAY neighbor proves a directed cycle (back-edge) exists.

#### 3. Topological Sort (Kahn's Algorithm)
Finds a linear sequence of execution for DAG vertices such that each dependency preceeds its dependents. Nodes with \`in_degree == 0\` are greedily queued.

---

#### 4. Adjacency List vs Adjacency Matrix

| Criterion | Adjacency list | Adjacency matrix |
| :--- | :--- | :--- |
| Memory | $O(V + E)$ | $O(V^2)$ |
| Edge check $u \\to v$ | $O(\\deg(u))$ | $O(1)$ |
| Neighbor iteration | $O(\\deg(u))$ | $O(V)$ |
| Best for | sparse graphs, social networks, dependencies | dense graphs, small $V$, GPU operations |

In ML, sparse graphs (batches, recommendations, molecules) are almost always stored as adjacency lists or COO/CSR tensors.

#### 5. Graph DFS: Recursive and Iterative

\`\`\`python
def dfs_recursive(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)
    return visited

def dfs_iterative(graph, start):
    visited, stack = set(), [start]
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        stack.extend(graph[node])
    return visited
\`\`\`

The iterative version avoids \`RecursionError\`, though traversal order may differ.

#### 6. Topological Sort via DFS

An alternative to Kahn's algorithm is DFS that appends a node after all descendants are processed, then reverses the result:

\`\`\`python
def topological_sort_dfs(num_nodes, adj):
    visited, order = set(), []

    def dfs(u):
        visited.add(u)
        for v in adj[u]:
            if v not in visited:
                dfs(v)
        order.append(u)

    for node in range(num_nodes):
        if node not in visited:
            dfs(node)
    return order[::-1]
\`\`\`

Both algorithms run in $O(V + E)$; Kahn's algorithm makes cycle detection trivial (fewer than $V$ processed nodes means a cycle).

#### 7. Where This Appears in ML Infrastructure

* **PyTorch Autograd** stores the operation graph and traverses it in reverse topological order during \`loss.backward()\`.
* **Airflow / Prefect / Kubeflow** define pipelines as DAGs: a node runs once all dependencies finish.
* **GNNs** perform message passing over adjacency lists or sparse matrices.
* **Training schedulers** (curriculum, multi-task) use dependency DAGs between tasks.`,
    },
    commonMistakes: [
      {
        ru: 'Забывать отслеживать множество `visited` при обходе графов с циклами: без `visited` алгоритм BFS/DFS уйдет в бесконечный цикл или вызовет `RecursionError`.',
        en: 'Omitting visited node tracking during graph traversals, causing infinite loops or recursion depth overflows in cyclic structures.',
      },
      {
        ru: 'Пытаться применить топологическую сортировку к графу, содержащему циклы: топологический порядок определен строго для DAG. Если после алгоритма Кана длина результата меньше числа узлов — в графе цикл.',
        en: 'Assuming topological ordering exists for cyclic graphs; Kahn algorithm termination before reaching $V$ nodes proves cycle existence.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'py-cp-8-a',
        question: {
          ru: 'Какое условие в 3-х цветном DFS (White, Gray, Black) свидетельствует о наличии направленного цикла в графе?',
          en: 'Which condition in 3-color DFS indicates the presence of a directed cycle in a graph?',
        },
        options: [
          {
            ru: 'Переход в соседний узел, который в данный момент окрашен в СЕРЫЙ цвет (Gray — находится в активном стеке вызовов)',
            en: 'Visiting a neighbor currently marked GRAY (currently in the active recursion stack frame)',
          },
          {
            ru: 'Переход в узел, окрашенный в ЧЕРНЫЙ цвет (Black)',
            en: 'Visiting a neighbor marked BLACK',
          },
          {
            ru: 'Переход в узел, окрашенный в БЕЛЫЙ цвет (White)',
            en: 'Visiting a neighbor marked WHITE',
          },
          {
            ru: 'Если у узла нет исходящих ребер',
            en: 'When a node has no outgoing edges',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Серый цвет означает, что мы вошли в узел, но еще не закончили обработку его потомков. Если из потомка мы снова попали в серый узел — найдено обратное ребро (back edge), замыкающее цикл.',
          en: 'A node remains GRAY while its descendant subtree is traversed. An edge targeting a GRAY node completes a directed back-edge cycle.',
        },
      },
      {
        id: 'py-cp-8-b',
        question: {
          ru: 'Почему вычислительный граф автоматического дифференцирования в PyTorch (Autograd) обязан быть строго направленным ациклическим графом (DAG)?',
          en: 'Why must the PyTorch Autograd computational graph strictly be a Directed Acyclic Graph (DAG)?',
        },
        options: [
          {
            ru: 'Чтобы обратный проход (backward pass) мог однозначно пройти по графу в обратном топологическом порядке от Loss к весам без бесконечного зацикливания',
            en: 'To allow the backward pass to traverse nodes in reverse topological order from Loss to parameters without infinite recursion',
          },
          {
            ru: 'Это техническое ограничение видеокарт NVIDIA',
            en: 'It is a hardware limitation of NVIDIA GPUs',
          },
          {
            ru: 'Потому что графы с циклами занимают больше памяти на диске',
            en: 'Because cyclic graphs consume more disk storage',
          },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Вычисление градиентов по цепному правилу (Backpropagation) требует строгой топологической последовательности: градиент выхода слоя должен быть полностью вычислен до того, как мы считаем градиент по входу слоя.',
          en: 'Chain rule evaluation requires exact topological dependence ordering: child gradient terms must fully resolve before parent parameter gradients compute.',
        },
      },
      {
        id: 'py-cp-8-c',
        question: {
          ru: 'Какую структуру данных целесообразно использовать в алгоритме Кана (Kahn\'s Algorithm) для хранения узлов с нулевой входящей степенью (in-degree == 0)?',
          en: 'Which data structure is typically used in Kahn\'s algorithm to maintain nodes with in-degree == 0?',
        },
        options: [
          { ru: 'Очередь (FIFO Queue / `collections.deque`) для последовательного извлечения за O(1)', en: 'Queue (FIFO Queue / `collections.deque`) for O(1) removal' },
          { ru: 'Стек рекурсии фиксированной глубины', en: 'Fixed-depth call stack' },
          { ru: 'Матрицу смежности N x N', en: 'Adjacency matrix N x N' },
          { ru: 'Красно-черное дерево поиска', en: 'Red-Black search tree' },
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Алгоритм Кана извлекает узлы с in-degree == 0, уменьшает входящие степени их соседей и добавляет освободившиеся узлы в очередь. `deque` обеспечивает $O(V + E)$ суммарное время работы.',
          en: 'Kahn\'s algorithm pops 0-degree nodes from a queue and decrements neighbor degrees in O(V + E) overall complexity.',
        },
      },
    ],
  },
];

export const pythonFoundationsCards: Card[] = [
  {
    id: 'py-card-1',
    moduleId: 'python-foundations',
    lessonId: 'py-1-syntax-memory',
    type: 'flip',
    front: {
      ru: 'В чем разница между оператором `==` и оператором `is` в Python?',
      en: 'What is the distinction between `==` and `is` in Python?',
    },
    back: {
      ru: '`==` проверяет равенство значений объектов (вызывает метод `__eq__`), а `is` проверяет идентичность адресов памяти в куче (`id(a) == id(b)`). Для сравнения с `None` всегда используется `x is None`.',
      en: '`==` evaluates equality of values via `__eq__`, whereas `is` evaluates object memory identity (`id(a) == id(b)`). Always test singletons via `x is None`.',
    },
    tags: ['python', 'memory', 'syntax'],
  },
  {
    id: 'py-card-2',
    moduleId: 'python-foundations',
    lessonId: 'py-1-syntax-memory',
    type: 'cloze',
    clozeText: {
      ru: 'Никогда не используйте изменяемые объекты (списки, словари) как дефолтные аргументы функций, так как они вычисляются {{c1::один раз при загрузке функции}} и сохраняют состояние между вызовами.',
      en: 'Never use mutable objects as default arguments in Python because they are evaluated {{c1::once at definition time}}.',
    },
    answer: {
      ru: 'один раз при загрузке функции',
      en: 'once at definition time',
    },
    tags: ['python', 'functions', 'pitfalls'],
  },
  {
    id: 'py-card-3',
    moduleId: 'python-foundations',
    lessonId: 'py-2-data-structures',
    type: 'flip',
    front: {
      ru: 'Какова временная сложность поиска элемента `item in collection` для `list` и `set`?',
      en: 'What is the search time complexity of `item in collection` for a `list` vs a `set`?',
    },
    back: {
      ru: 'Для `list` — O(N) (линейный последовательный перебор всех элементов). Для `set` — O(1) в среднем (поиск по хэш-таблице). При частых проверках вхождения список необходимо преобразовывать в set.',
      en: 'For `list` it is O(N) linear scan. For `set` it is O(1) average lookup via hash table indexing.',
    },
    tags: ['python', 'complexity', 'data-structures'],
  },
  {
    id: 'py-card-4',
    moduleId: 'python-foundations',
    lessonId: 'py-3-comprehensions-generators',
    type: 'flip',
    front: {
      ru: 'Почему генераторы с ключевым словом `yield` критически важны для обработки больших данных в ML?',
      en: 'Why are `yield` generators critical for large-scale data processing in ML?',
    },
    back: {
      ru: 'Генераторы вычисляют элементы лениво (по требованию) и не хранят весь датасет в оперативной памяти. Это позволяет читать и обучать модели на файлах размером сотни гигабайт с постоянным потреблением RAM O(1).',
      en: 'Generators yield values lazily on demand without keeping the entire sequence in memory, enabling constant O(1) RAM streaming of multi-gigabyte datasets.',
    },
    tags: ['python', 'generators', 'memory'],
  },
  {
    id: 'py-card-5',
    moduleId: 'python-foundations',
    lessonId: 'py-4-functions-decorators',
    type: 'cloze',
    clozeText: {
      ru: 'В Python для сохранения оригинального имени функции и документации внутри декоратора используется вспомогательный декоратор {{c1::@functools.wraps}}.',
      en: 'In Python, the {{c1::@functools.wraps}} decorator is applied to preserve original function names and docstrings.',
    },
    answer: {
      ru: '@functools.wraps',
      en: '@functools.wraps',
    },
    tags: ['python', 'decorators'],
  },
  {
    id: 'py-card-6',
    moduleId: 'python-foundations',
    lessonId: 'py-5-oop-dunder',
    type: 'flip',
    front: {
      ru: 'Какой дандер-метод позволяет вызывать экземпляр класса как функцию (`model(inputs)`) в PyTorch?',
      en: 'Which dunder method allows invoking a class instance like a function (`model(inputs)`)?',
    },
    back: {
      ru: 'Метод `__call__(self, *args, **kwargs)`. В PyTorch он запускает внутренние хуки и вызывает метод `forward()`.',
      en: 'The `__call__` method. In PyTorch, it executes forward hooks and subsequently triggers the user-defined `forward()` method.',
    },
    tags: ['python', 'oop', 'pytorch'],
  },
  {
    id: 'py-card-7',
    moduleId: 'python-foundations',
    lessonId: 'py-7-trees-algorithms',
    type: 'flip',
    front: {
      ru: 'Какой порядок обхода двоичного дерева поиска (BST) гарантирует обход элементов в строго отсортированном порядке?',
      en: 'Which traversal strategy on a Binary Search Tree (BST) produces strictly ascending sorted order?',
    },
    back: {
      ru: 'In-Order обход (Left -> Root -> Right). Сначала рекурсивно обрабатывается левое поддерево (меньшие элементы), затем текущий узел, затем правое поддерево (большие элементы).',
      en: 'In-Order traversal (Left -> Root -> Right). Left children resolve first, then parent, then right children, forming an ascending sequence.',
    },
    tags: ['python', 'trees', 'algorithms', 'bst'],
  },
  {
    id: 'py-card-8',
    moduleId: 'python-foundations',
    lessonId: 'py-8-graphs-dag-algorithms',
    type: 'flip',
    front: {
      ru: 'В чем заключается алгоритм Кана (Kahn\'s Algorithm) для топологической сортировки DAG?',
      en: 'What is the core principle of Kahn\'s Algorithm for DAG topological sort?',
    },
    back: {
      ru: '1. Подсчитывается входящая степень (in-degree) каждого узла.\n2. Узлы с in-degree == 0 помещаются в очередь.\n3. Извлекая узел, уменьшаем in-degree соседей; при достижении 0 добавляем их в очередь.\nЕсли число извлеченных узлов < общего числа узлов, в графе обнаружен цикл!',
      en: '1. Track in-degree for every vertex.\n2. Queue vertices with in-degree == 0.\n3. Dequeue, decrement neighbor in-degrees, and queue new 0-degree vertices.\nIf processed vertices < total vertices, a directed cycle exists.',
    },
    tags: ['python', 'graphs', 'dag', 'topological-sort'],
  },
  {
    id: 'py-card-9',
    moduleId: 'python-foundations',
    lessonId: 'py-8-graphs-dag-algorithms',
    type: 'cloze',
    clozeText: {
      ru: 'В 3-цветном поиске циклов через DFS встреча вершины цвета {{c1::GRAY}} свидетельствует о наличии обратного ребра и направленного цикла в графе.',
      en: 'In 3-color DFS cycle detection, discovering a vertex in {{c1::GRAY}} status confirms a directed cycle.',
    },
    answer: {
      ru: 'GRAY',
      en: 'GRAY',
    },
    tags: ['python', 'graphs', 'cycle-detection'],
  },
];

export const pythonFoundationsQuiz: QuizQuestion[] = [
  {
    id: 'py-q-1',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Что выведет следующий код на Python:\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)\n```',
      en: 'What will be printed by:\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)\n```',
    },
    options: [
      { ru: '[1, 2, 3, 4]', en: '[1, 2, 3, 4]' },
      { ru: '[1, 2, 3]', en: '[1, 2, 3]' },
      { ru: 'AttributeError: append does not exist', en: 'AttributeError: append does not exist' },
      { ru: 'None', en: 'None' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Переменная `y` копирует ссылку на объект `x`, а не создает копию списка. Модификация `y.append(4)` изменяет общий объект в куче.',
      en: 'Variable `y` references the identical mutable list object; appending to `y` mutates the list viewed through `x`.',
    },
    tag: 'python-references',
  },
  {
    id: 'py-q-2',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какую структуру данных следует использовать для скользящего окна временного ряда с быстрым добавлением и удалением элементов с обоих концов за O(1)?',
      en: 'Which data structure should be used for sliding windows requiring O(1) additions and removals at both ends?',
    },
    options: [
      { ru: 'collections.deque', en: 'collections.deque' },
      { ru: 'Обычный list с методом pop(0)', en: 'Standard list with pop(0)' },
      { ru: 'Кортеж tuple', en: 'Tuple' },
      { ru: 'Множество set', en: 'Set' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: '`deque` (двусторонняя очередь) оптимизирована для операций `append`, `appendleft`, `pop`, `popleft` со сложностью O(1), в то время как `list.pop(0)` требует O(N).',
      en: '`collections.deque` performs append and pop operations at both ends in strict O(1) time.',
    },
    tag: 'python-collections',
  },
  {
    id: 'py-q-3',
    type: 'code_fill',
    difficulty: 'medium',
    question: {
      ru: 'Вставьте правильный декоратор из стандартного модуля functools для сохранения метаданных функции:',
      en: 'Insert the proper functools decorator used to preserve wrapped function metadata:',
    },
    codeSnippet: `from functools import wraps

def timing(func):
    @____(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper`,
    options: ['wraps', 'cache', 'partial', 'lru_cache'],
    correctAnswer: 0,
    explanation: {
      ru: 'Декоратор `@wraps(func)` копирует оригинальные атрибуты `__name__`, `__doc__` и сигнатуру внутрь `wrapper`.',
      en: '`@wraps(func)` copies the wrapped function metadata to the outer wrapper.',
    },
    tag: 'python-decorators',
    language: 'python',
  },
  {
    id: 'py-q-4',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Какие два дандер-метода обязана реализовать пользовательская коллекция в PyTorch для работы с DataLoader по индексу?',
      en: 'Which two dunder methods must a custom PyTorch Map-style Dataset implement?',
    },
    options: [
      { ru: '__len__ и __getitem__', en: '__len__ and __getitem__' },
      { ru: '__init__ и __call__', en: '__init__ and __call__' },
      { ru: '__iter__ и __next__', en: '__iter__ and __next__' },
      { ru: '__enter__ и __exit__', en: '__enter__ and __exit__' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Map-style датасет в PyTorch требует `__len__` для определения общего размера выборки и `__getitem__(idx)` для получения конкретного образца по индексу.',
      en: 'Standard PyTorch Map-style Datasets require `__len__` to report dataset size and `__getitem__` for key/index lookup.',
    },
    tag: 'python-dunder-methods',
  },
  {
    id: 'py-q-5',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Почему в Python не рекомендуется писать `def append_to_cache(key, val, cache={}):`?',
      en: 'Why is defining `def append_to_cache(key, val, cache={}):` discouraged in Python?',
    },
    options: [
      {
        ru: 'Словарь `cache={}` инициализируется один раз при определении функции и будет общим для всех последующих вызовов',
        en: 'The dictionary `cache={}` evaluates once at definition time and retains mutations across all subsequent calls',
      },
      {
        ru: 'Словари не могут передаваться в качестве аргументов',
        en: 'Dictionaries cannot be passed as arguments',
      },
      {
        ru: 'Это вызывает синтаксическую ошибку SyntaxError',
        en: 'It causes a SyntaxError compile error',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Значения аргументов по умолчанию вычисляются один раз при загрузке функции. Изменяемый объект сохраняет все добавления между вызовами.',
      en: 'Default argument values evaluate only once when the function definition is executed, sharing mutations between invocations.',
    },
    tag: 'python-functions',
  },
  {
    id: 'py-q-6',
    type: 'code_fill',
    difficulty: 'easy',
    question: {
      ru: 'Вставьте ключевое слово для превращения функции в ленивый генератор:',
      en: 'Insert the keyword that transforms a function into a lazy generator:',
    },
    codeSnippet: `def batch_generator(items, batch_size):
    for i in range(0, len(items), batch_size):
        ____ items[i:i + batch_size]`,
    options: ['yield', 'return', 'give', 'send'],
    correctAnswer: 0,
    explanation: {
      ru: 'Ключевое слово `yield` приостанавливает выполнение функции и возвращает очередное значение генератора.',
      en: 'The `yield` keyword pauses execution and produces a value without destroying the function execution frame.',
    },
    tag: 'python-generators',
    language: 'python',
  },
  {
    id: 'py-q-7',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какой обход двоичного дерева поиска (BST) посещает вершины строго в порядке возрастания их значений?',
      en: 'Which traversal of a Binary Search Tree (BST) visits nodes in strictly ascending numerical order?',
    },
    options: [
      { ru: 'In-Order (Left -> Root -> Right)', en: 'In-Order (Left -> Root -> Right)' },
      { ru: 'Pre-Order (Root -> Left -> Right)', en: 'Pre-Order (Root -> Left -> Right)' },
      { ru: 'Post-Order (Left -> Right -> Root)', en: 'Post-Order (Left -> Right -> Root)' },
      { ru: 'Breadth-First Search (BFS)', en: 'Breadth-First Search (BFS)' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'In-Order обход сначала рекурсивно проходит левое поддерево (содержащее меньшие элементы), затем текущий корень, затем правое (большие элементы).',
      en: 'In-order traversal visits left subtree, root node, then right subtree, maintaining sorted sequence on BSTs.',
    },
    tag: 'python-trees',
  },
  {
    id: 'py-q-8',
    type: 'single',
    difficulty: 'hard',
    question: {
      ru: 'Как алгоритм Кана (Kahn\'s Algorithm) для топологической сортировки определяет, что граф содержит цикл?',
      en: 'How does Kahn\'s Algorithm detect cycle presence during topological sorting of a graph?',
    },
    options: [
      {
        ru: 'Очередь узлов с нулевой входящей степенью (in-degree == 0) опустошается до того, как обработаны все вершины графа',
        en: 'The 0 in-degree queue empties before all graph vertices have been visited and ordered',
      },
      {
        ru: 'Если в графе четное количество ребер',
        en: 'If the graph contains an even number of edges',
      },
      {
        ru: 'Если сумма весов ребер отрицательна',
        en: 'If the sum of edge weights is negative',
      },
      {
        ru: 'Алгоритм Кана не способен обнаруживать циклы',
        en: 'Kahn\'s algorithm cannot detect cycles',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Если в графе есть направленный цикл, ни одна из вершин этого цикла никогда не получит входящую степень 0, и очередь закончится раньше, чем будут добавлены все вершины.',
      en: 'Vertices trapped in a directed cycle never reach an in-degree of 0, leaving them unvisited when the processing queue terminates.',
    },
    tag: 'python-graphs',
  },
  {
    id: 'py-q-9',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'В каком порядке движется алгоритм автоматического дифференцирования PyTorch Autograd во время вызова `loss.backward()`?',
      en: 'In which order does the PyTorch Autograd engine traverse the computational graph during `loss.backward()`?',
    },
    options: [
      {
        ru: 'В обратном топологическом порядке от узла Loss к исходным параметрам модели по направленному ациклическому графу (DAG)',
        en: 'In reverse topological order from the Loss node back to leaf parameters along the DAG',
      },
      {
        ru: 'Случайным перебором графа Монте-Карло',
        en: 'Random Monte Carlo traversal',
      },
      {
        ru: 'В прямом порядке от входных тензоров к Loss',
        en: 'In forward order from input tensors to Loss',
      },
      {
        ru: 'Строго слева направо по матрице смежности',
        en: 'Left to right sequentially along the adjacency matrix',
      },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Цепное правило дифференцирования требует вычисления градиентов от выхода сети назад к входам. Это в точности обратный топологический порядок по графу операторов.',
      en: 'Backpropagation requires reverse topological processing so parent differential outputs are available before child parameter gradients resolve.',
    },
    tag: 'python-graphs',
  },
];
