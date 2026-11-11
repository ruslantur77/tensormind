import { GlossaryTerm, GlossaryCategoryMeta } from './types';

export const GLOSSARY_CATEGORIES: GlossaryCategoryMeta[] = [
  { id: 'all', label: { ru: 'Все термины', en: 'All Terms' }, icon: '📚', color: 'from-sky-500 to-indigo-500' },
  { id: 'python', label: { ru: 'Python для ML', en: 'Python & Core' }, icon: '🐍', color: 'from-amber-400 to-yellow-600' },
  { id: 'metrics', label: { ru: 'Метрики качества', en: 'Evaluation Metrics' }, icon: '📊', color: 'from-blue-500 to-cyan-500' },
  { id: 'regularization', label: { ru: 'Регуляризация & Оптимизация', en: 'Regularization & Optimizers' }, icon: '⚙️', color: 'from-amber-500 to-orange-500' },
  { id: 'architectures', label: { ru: 'Архитектуры & Слои', en: 'Architectures & Layers' }, icon: '🧠', color: 'from-purple-500 to-pink-500' },
  { id: 'cv', label: { ru: 'Компьютерное зрение', en: 'Computer Vision' }, icon: '👁️', color: 'from-emerald-500 to-teal-500' },
  { id: 'nlp_llm', label: { ru: 'NLP & LLM', en: 'NLP & LLMs' }, icon: '💬', color: 'from-violet-500 to-indigo-500' },
  { id: 'classical_ml', label: { ru: 'Классический ML', en: 'Classical ML' }, icon: '🌲', color: 'from-green-500 to-emerald-500' },
  { id: 'statistics', label: { ru: 'Теорвер & Статистика', en: 'Probability & Stats' }, icon: '🎲', color: 'from-rose-500 to-red-500' },
  { id: 'rl', label: { ru: 'RL & Alignment', en: 'RL & Alignment' }, icon: '🤖', color: 'from-yellow-500 to-amber-500' },
  { id: 'safety_mlops', label: { ru: 'MLOps, Этика & Безопасность', en: 'MLOps & Safety' }, icon: '🛡️', color: 'from-slate-500 to-zinc-500' },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ==========================================
  // 0. PYTHON ДЛЯ ML / PYTHON & CORE
  // ==========================================
  {
    id: 'python-gil',
    term: { ru: 'GIL (Global Interpreter Lock)', en: 'GIL (Global Interpreter Lock)' },
    englishName: 'CPython Global Interpreter Lock / Mutex',
    category: 'python',
    formulaLatex: '\\text{Thread}_1 \\xrightarrow{\\text{Acquire GIL}} \\text{Bytecode} \\xrightarrow{\\text{I/O or Switch}} \\text{Release} \\to \\text{Thread}_2',
    formulaDescription: {
      ru: 'В любой момент времени только один нативный поток ОС выполняет байткод Python в рамках процесса CPython.',
      en: 'Only one native thread can hold the GIL and execute Python bytecode at any given moment.',
    },
    shortDefinition: {
      ru: 'Глобальная блокировка интерпретатора CPython — мьютекс, предотвращающий одновременное выполнение байткода Python несколькими потоками для потокобезопасного управления памятью и подсчета ссылок.',
      en: 'CPython mutex synchronizing the execution of threads so that only one native thread runs Python bytecode at a time, protecting reference count integrity.',
    },
    whenToUse: [
      {
        ru: 'I/O-bound задачи (парсинг веб-страниц, запросы к БД, микросервисам или сетевые вызовы): потоки ОС полезны, так как GIL освобождается во время ожидания сокета или диска.',
        en: 'I/O-bound tasks: threading is effective because the GIL is released during network socket, disk I/O, and OS sleep operations.',
      },
      {
        ru: 'CPU-bound вычисления в Data Science (NumPy, PyTorch, Scikit-learn): Си/CUDA-расширения освобождают GIL (Py_BEGIN_ALLOW_THREADS), обеспечивая истинный параллелизм на всех ядрах CPU и GPU.',
        en: 'CPU-bound numerical computing: libraries like NumPy and PyTorch release the GIL in C/CUDA extensions for full multicore speedup.',
      },
      {
        ru: 'Для чистого CPU-bound кода на Python: используйте multiprocessing, ProcessPoolExecutor или Ray вместо threading.',
        en: 'For pure CPU-bound Python code: prefer multiprocessing or ProcessPoolExecutor over threading to bypass GIL.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Почему многопоточный CPU-bound код на Python работает МЕДЛЕННЕЕ однопоточного? Из-за накладных расходов (overhead) на постоянную конкуренцию потоков за захват и освобождение GIL (lock contention) и переключение контекста.',
        en: 'Why is multithreaded CPU-bound Python code slower than single-threaded? Lock contention overhead and continuous thread context switching over the GIL.',
      },
      {
        ru: 'Революция Python 3.13 (PEP 703): добавлена экспериментальная сборка без GIL (Free-threaded CPython nogil), использующая mimalloc и побайтовое гранулированное блокирование.',
        en: 'Python 3.13 (PEP 703): introduced free-threaded CPython build (nogil) utilizing mimalloc and biased reference counting.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-6-modules-perf',
      title: { ru: 'Модули, обработка исключений и почему чистый Python медленный для ML', en: 'Modules, Exceptions & Why Pure Python is Slow' },
    },
    tags: ['gil', 'python', 'thread', 'multithreading', 'multiprocessing', 'cpython', 'concurrency', 'параллелизм'],
  },
  {
    id: 'python-decorator',
    term: { ru: 'Декоратор (@decorator)', en: 'Decorator Pattern (@decorator)' },
    englishName: 'Python Decorator / Higher-Order Function',
    category: 'python',
    formulaLatex: '@\\text{dec} \\implies f = \\text{dec}(f) \\quad \\text{или} \\quad @\\text{dec}(\\text{arg}) \\implies f = \\text{dec}(\\text{arg})(f)',
    formulaDescription: {
      ru: 'Декоратор принимает целевую функцию f, оборачивает ее в wrapper и возвращает новую функцию с расширенным поведением.',
      en: 'A decorator accepts a target function f, wraps it, and returns a new callable with enhanced functionality.',
    },
    shortDefinition: {
      ru: 'Функция высшего порядка, принимающая другую функцию или класс в качестве аргумента и расширяющая их функционал без прямого изменения исходного кода.',
      en: 'A higher-order function that takes another function or class as an argument, dynamically augmenting its behavior without mutating its source code.',
    },
    whenToUse: [
      {
        ru: 'Замер времени обучения моделей и инференса (@timer, @benchmark).',
        en: 'Timing model training epochs and inference latency (@timer, @benchmark).',
      },
      {
        ru: 'Мемоизация и кеширование вычислений функций с чистой логикой (@functools.lru_cache, @functools.cache).',
        en: 'Memoization and caching expensive deterministic calculations via @functools.lru_cache.',
      },
      {
        ru: 'Маршрутизация в веб-фреймворках (FastAPI @app.get(), Flask @app.route()) и проверка прав доступа.',
        en: 'API routing in web frameworks (FastAPI @app.get(), Flask @app.route()) and authentication checks.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Всегда используйте @functools.wraps(func) внутри wrapper! Без него оборачиваемая функция теряет исходное имя __name__, строку документации __doc__ и сигнатуру.',
        en: 'Always apply @functools.wraps(func) on wrapper to preserve original __name__, __doc__, and inspection metadata.',
      },
      {
        ru: 'Порядок применения декораторов: @dec1 над @dec2 означает f = dec1(dec2(f)) — сначала оборачивает нижний, а выполняется первым верхний.',
        en: 'Stacking order: @dec1 above @dec2 evaluates as dec1(dec2(f)) (bottom-up wrapping, top-down execution).',
      },
      {
        ru: 'Декоратор с аргументами требует трех уровней вложенности: внешняя функция для аргументов, декоратор и сам wrapper.',
        en: 'Decorators with arguments require a 3-tier nested closure: outer factory, decorator, and wrapper.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-4-functions-decorators',
      title: { ru: 'Функции, замыкания, *args/**kwargs и декораторы в ML-пайплайнах', en: 'Functions, Closures, *args/**kwargs & Decorators' },
    },
    tags: ['decorator', 'wraps', 'lru_cache', 'closure', 'декоратор', 'замыкание', 'wrapper'],
  },
  {
    id: 'python-generator-iterator',
    term: { ru: 'Генератор и Итератор (yield)', en: 'Generator & Iterator (yield)' },
    englishName: 'Generators, Iterators & Iterator Protocol',
    category: 'python',
    formulaLatex: '\\text{Memory: } O(1), \\quad \\text{Protocol: } \\text{iter}(obj) \\to \\text{it}, \\quad \\text{next}(it) \\to x_i, \\quad \\dots \\to \\text{StopIteration}',
    formulaDescription: {
      ru: 'Итератор реализует __iter__() и __next__(). Генераторная функция с yield сохраняет локальный фрейм стека между вызовами.',
      en: 'Iterators implement __iter__() and __next__(). Generator functions preserve local execution frame across yields.',
    },
    shortDefinition: {
      ru: 'Специальная функция с ключевым словом yield, возвращающая ленивый итерируемый объект. Значения вычисляются на лету по требованию (lazy evaluation) с константной памятью O(1).',
      en: 'A lazy evaluation construct utilizing the yield keyword that produces stream values on-demand with O(1) auxiliary memory footprint.',
    },
    whenToUse: [
      {
        ru: 'Потоковое чтение гигантских датасетов (CSV, JSON, логи на 50+ Гб), не помещающихся целиком в оперативную память.',
        en: 'Streaming multi-gigabyte training datasets line-by-line without exhausting host RAM.',
      },
      {
        ru: 'Батчинг данных и пайплайны генерации обучающих сэмплов в PyTorch DataLoader и TensorFlow Dataset.',
        en: 'Batching pipelines and continuous sample streams in PyTorch DataLoader.',
      },
      {
        ru: 'Бесконечные последовательности данных (потоки токенов, генерация синтетических данных, временные ряды).',
        en: 'Infinite series generation (sensor time series streams, real-time token streaming).',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Генератор одноразовый (exhaustible)! После того, как цикл прошел по генератору и вызвал StopIteration, повторный проход вернет пустоту. Для повторного обхода генератор нужно вызвать заново.',
        en: 'Generators are single-pass: once exhausted (StopIteration raised), subsequent iteration yields zero elements.',
      },
      {
        ru: 'yield from iterable делегирует генерацию подгенератору или коллекции напрямую, оптимизируя накладные расходы цикла.',
        en: 'yield from delegates to sub-generators with bidirectional send() pipeline support.',
      },
      {
        ru: 'Генераторные выражения (x for x in data) создают ленивый генератор, в отличие от списковых включений [x for x in data], аллоцирующих список в куче целиком.',
        en: '(x for x in seq) creates a lazy generator, whereas [x for x in seq] eagerly allocates full list memory in heap.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-3-comprehensions-generators',
      title: { ru: 'Comprehensions, Итераторы и Генераторы: эффективная работа с памятью', en: 'Comprehensions, Iterators & Generators' },
    },
    tags: ['generator', 'iterator', 'yield', 'lazy', 'генератор', 'итератор', 'память'],
  },
  {
    id: 'python-context-manager',
    term: { ru: 'Менеджер контекста (with)', en: 'Context Manager (with statement)' },
    englishName: 'Context Manager (__enter__, __exit__)',
    category: 'python',
    formulaLatex: '\\text{with } \\text{mgr} \\text{ as } x: \\; \\dots \\iff x = \\text{mgr.\\_\\_enter\\_\\_}(), \\; \\dots \\; \\text{finally: } \\text{mgr.\\_\\_exit\\_\\_}(\\text{exc})',
    formulaDescription: {
      ru: 'Гарантирует выполнение блока финализации __exit__ даже при возникновении исключения внутри блока with.',
      en: 'Guarantees execution of cleanup logic in __exit__ even if unhandled exceptions arise.',
    },
    shortDefinition: {
      ru: 'Языковая конструкция для детерминированного выделения и освобождения ресурсов (паттерн RAII), инкапсулирующая блок try-finally через методы __enter__ и __exit__.',
      en: 'Deterministic resource management pattern (RAII) encapsulating setup and teardown logic via __enter__ and __exit__ dunder methods.',
    },
    whenToUse: [
      {
        ru: 'Инференс нейросетей в PyTorch: with torch.no_grad(): отключает построение графа автодифференцирования, существенно экономя видеопамять.',
        en: 'Deep learning inference: with torch.no_grad() and with torch.inference_mode() deactivate autograd tracking.',
      },
      {
        ru: 'Безопасная работа с файлами, сокетами и транзакциями баз данных (автоматический commit или rollback при ошибке).',
        en: 'File handles, network connections, and database transactions (auto-commit/rollback).',
      },
      {
        ru: 'Мьютексы и блокировки в параллельном программировании: with lock: гарантирует освобождение блокировки.',
        en: 'Concurrency synchronization: with lock: guarantees lock release upon leaving scope.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Подавление исключений: если метод __exit__ возвращает True, Python подавляет возникшее исключение и продолжает выполнение скрипта. Если возвращает False (или None), исключение пробрасывается дальше.',
        en: 'Exception suppression: returning True from __exit__ silences the exception, whereas returning False/None propagates it up.',
      },
      {
        ru: 'contextlib.@contextmanager позволяет создавать контекстный менеджер из простой функции-генератора с одним yield без написания класса.',
        en: 'contextlib.@contextmanager enables lightweight generator-based context managers with a single yield.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-5-oop-dunder',
      title: { ru: 'ООП в Python для ML: классы, дандер-методы', en: 'OOP in Python for ML: Classes & Dunder Methods' },
    },
    tags: ['contextmanager', 'with', 'enter', 'exit', 'no_grad', 'менеджер контекста'],
  },
  {
    id: 'python-dunder-methods',
    term: { ru: 'Дандер-методы и Магические методы', en: 'Dunder Methods (Magic Methods)' },
    englishName: 'Double Underscore Methods / Python Data Model',
    category: 'python',
    formulaLatex: 'x(y) \\iff x\\text{.\\_\\_call\\_\\_}(y), \\quad x[i] \\iff x\\text{.\\_\\_getitem\\_\\_}(i), \\quad \\text{len}(x) \\iff x\\text{.\\_\\_len\\_\\_}()',
    formulaDescription: {
      ru: 'Дандер-методы позволяют кастомным классам встраиваться во встроенные протоколы Python и синтаксический сахар.',
      en: 'Dunder hooks integrate user-defined classes into native Python protocols and operator overloading.',
    },
    shortDefinition: {
      ru: 'Специальные методы с двойным подчеркиванием (__init__, __call__, __repr__, __len__), определяющие поведение объектов при вызове операторов, функций и синтаксических конструкций языка.',
      en: 'Special methods enclosed in double underscores that implement operator overloading and object protocol integration in the CPython data model.',
    },
    whenToUse: [
      {
        ru: 'Кастомные слои и модели в PyTorch: переопределение __init__ и forward (вызываемого через __call__).',
        en: 'PyTorch models (nn.Module): __call__ manages forward hooks and computation graphs.',
      },
      {
        ru: 'Кастомные датасеты PyTorch: реализация __len__ и __getitem__ для индексации data[idx].',
        en: 'PyTorch Dataset protocol: implementing __len__ and __getitem__ for random sample batching.',
      },
      {
        ru: 'Перегрузка арифметических операторов (__add__, __mul__) для математических векторов и матриц.',
        en: 'Operator overloading (__add__, __matmul__) in scientific computing tensors.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Почему в PyTorch нужно вызывать model(x), а не model.forward(x)? Метод __call__ базового класса nn.Module регистрирует pre/post forward hooks, управляет профилированием и проверкой типов, после чего уже вызывает forward(). Прямой вызов forward() ломает хуки!',
        en: 'Never call model.forward(x) directly: nn.Module.__call__ registers forward hooks, backward tracking, and profile listeners.',
      },
      {
        ru: 'Разница между __repr__ и __str__: __repr__ предназначен для разработчиков (должен быть точным, однозначным), __str__ — для красивого вывода пользователю.',
        en: '__repr__ is for developers and debugging (unambiguous), whereas __str__ is for clean user-facing representations.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-5-oop-dunder',
      title: { ru: 'ООП в Python для ML: классы, дандер-методы и написание кастомных моделей', en: 'OOP in Python for ML: Classes & Dunder Methods' },
    },
    tags: ['dunder', 'magic methods', 'call', 'getitem', 'repr', 'дандер', 'ооп'],
  },
  {
    id: 'python-mutability-memory',
    term: { ru: 'Изменяемость и Ссылочная модель памяти', en: 'Mutability & Reference Memory Model' },
    englishName: 'Mutability, Object Identity & Deepcopy',
    category: 'python',
    formulaLatex: 'a = b \\implies \\text{id}(a) = \\text{id}(b), \\quad a \\text{ is } b \\iff \\text{id}(a) == \\text{id}(b), \\quad a == b \\iff a\\text{.\\_\\_eq\\_\\_}(b)',
    formulaDescription: {
      ru: 'is проверяет идентичность указателей в куче; == проверяет равенство значений объектов.',
      en: 'is checks memory pointer identity; == checks equality of contents.',
    },
    shortDefinition: {
      ru: 'Модель, в которой переменные — это именованные ссылки на объекты в куче. Неизменяемые (immutable: int, float, str, tuple) создают новый объект при изменении, изменяемые (mutable: list, dict, set) меняются по месту.',
      en: 'CPython object model where variables are pointers to heap objects. Immutable types generate new instances on modification; mutable types mutate in-place.',
    },
    whenToUse: [
      {
        ru: 'Передача параметров в функции: понимание, что списки и словари передаются по ссылке (pass-by-assignment) и могут быть изменены внутри функции.',
        en: 'Understanding pass-by-object-reference when functions accept lists or dictionaries.',
      },
      {
        ru: 'Клонирование весов моделей и конфигураций: выбор между поверхностной копией (copy.copy()) и глубокой рекурсивной копией (copy.deepcopy()).',
        en: 'Cloning hyperparameter dictionaries or model weights: shallow copy vs deepcopy.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Ловушка изменяемого значения по умолчанию: def add(x, lst=[]). Список lst создается один раз при определении функции, поэтому последующие вызовы накапливают элементы! Решение: lst=None.',
        en: 'Mutable default argument trap: def func(x, lst=[]) reuses the same heap list across invocations. Always use lst=None.',
      },
      {
        ru: 'Кеширование малых целых чисел (Small Integer Caching): CPython кеширует числа от -5 до 256, поэтому x = 100; y = 100 -> x is y вернет True, но для 1000 вернет False.',
        en: 'Small integer caching in CPython: integers in [-5, 256] are pre-allocated singletons.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-1-syntax-memory',
      title: { ru: 'Синтаксис, строгая динамическая типизация и модель памяти Python', en: 'Syntax, Dynamic Typing & Memory Model' },
    },
    tags: ['mutability', 'immutable', 'is', 'id', 'deepcopy', 'изменяемость', 'память'],
  },
  {
    id: 'python-data-structures-complexity',
    term: { ru: 'Временная сложность коллекций (Big-O в Python)', en: 'Python Data Structures Complexity (Big-O)' },
    englishName: 'CPython Collections Big-O: list, dict, set, deque',
    category: 'python',
    formulaLatex: '\\text{Lookup in } \\text{dict}/\\text{set}: O(1) \\text{ avg}, \\quad \\text{in } \\text{list}: O(N), \\quad \\text{Append list}: O(1) \\text{ amortized}',
    formulaDescription: {
      ru: 'Хеш-таблицы (dict, set) обеспечивают O(1) поиск по ключу; списки (list) требуют O(N) линейного сканирования.',
      en: 'Hash tables grant O(1) average lookup; contiguous dynamic arrays demand O(N) linear scan.' }
    ,
    shortDefinition: {
      ru: 'Теоретическая и практическая сложность базовых операций CPython: списки (динамический массив), словари и множества (хеш-таблицы с открытой адресацией), деки (двусвязный список блоков).',
      en: 'Algorithmic time complexity of CPython primitives: list (dynamic array), dict/set (open addressing hash table), deque (doubly-linked chunked list).' }
    ,
    whenToUse: [
      {
        ru: 'Проверка принадлежности элемента в миллионах строк: if x in items — обязано быть set или dict (O(1)), иначе list займет часы (O(N)).',
        en: 'High-throughput membership tests: if x in set_data runs in O(1) vs O(N) in lists.',
      },
      {
        ru: 'Очереди FIFO: использование collections.deque для popleft() за O(1), в отличие от list.pop(0) за O(N).',
        en: 'FIFO queues: collections.deque offers O(1) append/popleft vs O(N) memory shift in lists.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Почему list.insert(0, x) медленный? Потому что список в CPython — непрерывный массив указателей в памяти, и вставка в начало сдвигает все N элементов на одну ячейку вправо (O(N)).',
        en: 'list.insert(0) is O(N) because contiguous memory elements must shift to make room.',
      },
      {
        ru: 'Что может быть ключом словаря? Только хешируемый (hashable) объект, реализующий __hash__ и __eq__, чье значение не меняется в течение жизни (кортежи, строки, frozenset). Список list или словарь dict вызовут TypeError: unhashable type.',
        en: 'Dict keys must be immutable and hashable (__hash__ and __eq__). Lists and dicts trigger TypeError: unhashable type.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-2-data-structures',
      title: { ru: 'Встроенные коллекции: List, Tuple, Dict, Set и модуль collections', en: 'Built-in Collections: List, Tuple, Dict, Set & collections' },
    },
    tags: ['big-o', 'complexity', 'dict', 'set', 'list', 'deque', 'сложность', 'хеш-таблица'],
  },
  {
    id: 'python-garbage-collector',
    term: { ru: 'Сборщик мусора и Подсчет ссылок', en: 'Garbage Collector & Reference Counting' },
    englishName: 'CPython Garbage Collector & Cyclic GC',
    category: 'python',
    formulaLatex: '\\text{RefCount}(obj) = 0 \\implies \\text{Free Memory Immediately}, \\quad \\text{Generations: } G_0 \\to G_1 \\to G_2',
    formulaDescription: {
      ru: 'Основной механизм — Reference Counting. Циклический GC ищет недостижимые циклические ссылки среди трех поколений объектов.',
      en: 'Primary mechanism: Reference Counting. Generational cyclic GC detects circular references across G0, G1, G2.',
    },
    shortDefinition: {
      ru: 'Двухуровневая система управления памятью CPython: детерминированное освобождение памяти при обнулении счетчика ссылок объекта плюс циклический сборщик мусора по поколениям (Generational Cyclic GC).',
      en: 'Two-tier memory management in CPython: immediate deallocation via reference counting plus generational cyclic GC for isolated reference loops.',
    },
    whenToUse: [
      {
        ru: 'Устранение утечек памяти (Memory Leaks) в долгоживущих сервисах инференса моделей и воркерах Celery.',
        en: 'Debugging memory leaks in persistent FastAPI services or distributed training workers.',
      },
      {
        ru: 'Слабые ссылки (weakref): кеширование объектов без увеличения счетчика ссылок, позволяя GC удалять их при нехватке RAM.',
        en: 'Weak references (weakref.ref): caching heavy artifacts without hindering garbage reclamation.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Почему подсчета ссылок недостаточно? Циклические ссылки (A ссылается на B, а B на A) держат RefCount >= 1 даже после удаления внешних переменных. Для их обнаружения работает модуль gc.',
        en: 'Reference counting fails on circular references (A -> B -> A). The gc module runs graph cycle detection.',
      },
      {
        ru: 'sys.getrefcount(x) возвращает на 1 больше ожидаемого, так как передача x в саму функцию getrefcount создает временную ссылку!',
        en: 'sys.getrefcount(x) returns N+1 because the function parameter itself increments the reference count.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-1-syntax-memory',
      title: { ru: 'Синтаксис, строгая динамическая типизация и модель памяти Python', en: 'Syntax, Dynamic Typing & Memory Model' },
    },
    tags: ['gc', 'garbage collector', 'reference counting', 'сборщик мусора', 'утечки памяти', 'weakref'],
  },
  {
    id: 'python-args-kwargs',
    term: { ru: '*args и **kwargs (Распаковка аргументов)', en: '*args and **kwargs (Argument Unpacking)' },
    englishName: 'Variadic Arguments & Unpacking Operators (*, **)',
    category: 'python',
    formulaLatex: 'f(*\\text{args}, **\\text{kwargs}) \\implies \\text{args} \\in \\text{tuple}, \\; \\text{kwargs} \\in \\text{dict}',
    formulaDescription: {
      ru: '* запаковывает позиционные аргументы в кортеж, ** запаковывает именованные аргументы в словарь.',
      en: '* packs excess positional arguments into a tuple; ** packs keywords into a dict.',
    },
    shortDefinition: {
      ru: 'Синтаксис переменного числа аргументов функции: *args собирает произвольное количество позиционных аргументов в кортеж, **kwargs — именованные аргументы в словарь. Также используются для распаковки коллекций.',
      en: 'Syntax for variadic function parameters: *args gathers positional parameters into a tuple, while **kwargs gathers keyword parameters into a dictionary.' }
    ,
    whenToUse: [
      {
        ru: 'Написание универсальных декораторов: def wrapper(*args, **kwargs): return func(*args, **kwargs).',
        en: 'Universal decorators forwarding arbitrary arguments to target functions.',
      },
      {
        ru: 'Наследование и вызов родительского конструктора: super().__init__(*args, **kwargs).',
        en: 'Subclass constructor chaining: super().__init__(*args, **kwargs).',
      },
      {
        ru: 'Объединение словарей в Python 3.5+: combined = {**dict1, **dict2} или dict1 | dict2 в 3.9+.',
        en: 'Dictionary merging and parameter forwarding in ML pipelines.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Одиночная звездочка * в сигнатуре функции: def func(a, *, b): заставляет передавать аргумент b СТРОГО по имени (keyword-only argument).',
        en: 'Bare * in function definition forces all subsequent parameters to be strictly keyword-only.',
      },
      {
        ru: 'Слеш / в сигнатуре: def func(a, /, b): запрещает передавать параметр a по имени (positional-only argument, доступен с Python 3.8).',
        en: 'Positional-only slash / forces preceding arguments to be strictly positional.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-4-functions-decorators',
      title: { ru: 'Функции, замыкания, *args/**kwargs и декораторы в ML-пайплайнах', en: 'Functions, Closures, *args/**kwargs & Decorators' },
    },
    tags: ['args', 'kwargs', 'unpacking', 'распаковка', 'сигнатура', 'keyword-only'],
  },
  {
    id: 'python-comprehensions',
    term: { ru: 'Comprehensions (Списковые включения)', en: 'Comprehensions (List, Dict, Set)' },
    englishName: 'List, Dict & Set Comprehensions',
    category: 'python',
    formulaLatex: '[f(x) \\text{ for } x \\text{ in } X \\text{ if } p(x)] \\equiv \\text{map}(f, \\text{filter}(p, X))',
    formulaDescription: {
      ru: 'Декларативное создание коллекций через цикл и опциональный предикат-фильтр.',
      en: 'Declarative collection comprehension mapping and filtering elements.',
    },
    shortDefinition: {
      ru: 'Идиоматический декларативный синтаксис Python для создания новых списков, словарей и множеств на основе существующих итерируемых объектов с фильтрацией и трансформацией.',
      en: 'Idiomatic declarative syntax in Python for generating lists, sets, and dictionaries from iterables via mapping and filtering.',
    },
    whenToUse: [
      {
        ru: 'Предобработка признаков: [clean(x) for x in raw_features if x is not None].',
        en: 'Feature transformations: [clean(x) for x in raw_features if x is not None].',
      },
      {
        ru: 'Создание словарей соответствия (label-to-id mapping): {label: idx for idx, label in enumerate(classes)}.',
        en: 'Vocab and label encoders: {label: idx for idx, label in enumerate(classes)}.',
      },
      {
        ru: 'Быстрая фильтрация уникальных значений во множество: {x.strip().lower() for x in tags}.',
        en: 'Unique element deduplication into sets.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Comprehension быстрее явного цикла for с append()! CPython оптимизирует списковые включения на уровне Си-байткода (инструкция LIST_APPEND без постоянного поиска атрибута append в куче).',
        en: 'Comprehensions run faster than for-loops with .append() due to C-level LIST_APPEND bytecode.',
      },
      {
        ru: 'Не злоупотребляйте вложенными включениями более 2 уровней — это резко снижает читаемость кода (Zen of Python: Readability counts).',
        en: 'Avoid nesting more than 2 loops: maintain code readability over syntactic compaction.',
      },
    ],
    lessonPath: {
      moduleId: 'python-foundations',
      lessonId: 'py-3-comprehensions-generators',
      title: { ru: 'Comprehensions, Итераторы и Генераторы: эффективная работа с памятью', en: 'Comprehensions, Iterators & Generators' },
    },
    tags: ['comprehension', 'list comprehension', 'dict comprehension', 'списковые включения', 'генерация списков'],
  },

  // ==========================================
  // 1. МЕТРИКИ КАЧЕСТВА / METRICS
  // ==========================================
  {
    id: 'f1-score',
    term: { ru: 'F1-мера (F1-Score)', en: 'F1 Score (Balanced F-Measure)' },
    englishName: 'F1 Score / Dice Coefficient',
    category: 'metrics',
    formulaLatex: 'F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}} = \\frac{2 \\cdot TP}{2 \\cdot TP + FP + FN}',
    formulaDescription: {
      ru: 'Precision = TP / (TP + FP) — точность, Recall = TP / (TP + FN) — полнота.',
      en: 'Precision = TP / (TP + FP), Recall = TP / (TP + FN).',
    },
    shortDefinition: {
      ru: 'Гармоническое среднее между точностью (Precision) и полнотой (Recall), отражающее баланс между ложными срабатываниями и пропусками целевых объектов.',
      en: 'Harmonic mean of Precision and Recall, measuring the trade-off between false alarms (FP) and missed positive detections (FN).',
    },
    whenToUse: [
      {
        ru: 'При сильном дисбалансе классов (например, 99% нормальных транзакций и 1% мошенничества), где Accuracy неинформативна.',
        en: 'Under heavy class imbalance (e.g. 99% normal transactions and 1% fraud), where Accuracy is misleading.',
      },
      {
        ru: 'Когда одинаково критичны как ошибки первого рода (FP), так и ошибки второго рода (FN).',
        en: 'When both Type I errors (False Positives) and Type II errors (False Negatives) carry high business or clinical costs.',
      },
      {
        ru: 'В задачах классификации текстов, поиска аномалий и медицинской диагностики.',
        en: 'Standard benchmark in text categorization, anomaly detection, and medical diagnostics.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Почему именно гармоническое среднее, а не арифметическое? Гармоническое среднее жестко штрафует модель, если хотя бы одна из метрик стремится к нулю. Если Precision = 1.0, а Recall = 0.0, арифметическое среднее даст 0.5, а F1 даст ровно 0.',
        en: 'Why harmonic mean instead of arithmetic mean? The harmonic mean severely penalizes extreme discrepancies: if Precision = 1.0 and Recall = 0.0, the arithmetic mean is 0.5, while F1 strictly drops to 0.0.',
      },
      {
        ru: 'Обобщение F_beta: при beta = 2 полнота вдвое важнее точности (F2), при beta = 0.5 приоритет отдается точности (F0.5).',
        en: 'F_beta generalization: when beta = 2, Recall is weighted twice as heavily as Precision (F2); when beta = 0.5, Precision is prioritized (F0.5).',
      },
    ],
    lessonPath: {
      moduleId: 'data-wrangling-eda',
      lessonId: 'eda-4-validation-metrics',
      title: { ru: 'Валидация моделей и метрики качества', en: 'Model Validation & Evaluation Metrics' },
    },
    tags: ['f1', 'f-score', 'precision', 'recall', 'imbalance', 'метрика', 'классификация'],
  },
  {
    id: 'roc-auc',
    term: { ru: 'ROC-AUC (Площадь под ROC-кривой)', en: 'ROC-AUC (Area Under ROC Curve)' },
    englishName: 'Receiver Operating Characteristic - Area Under Curve',
    category: 'metrics',
    formulaLatex: '\\text{TPR} = \\frac{TP}{TP + FN}, \\quad \\text{FPR} = \\frac{FP}{FP + TN}, \\quad \\text{AUC} = \\int_0^1 \\text{TPR}(\\text{FPR}) \\, d\\text{FPR}',
    formulaDescription: {
      ru: 'TPR (True Positive Rate) — полнота; FPR (False Positive Rate) — доля ложных срабатываний среди всех отрицательных объектов.',
      en: 'TPR (True Positive Rate) = Recall; FPR (False Positive Rate) = FP / (FP + TN).',
    },
    shortDefinition: {
      ru: 'Площадь под кривой ошибок (ROC), измеряющая способность классификатора ранжировать положительные объекты выше отрицательных независимо от выбранного порога вероятности.',
      en: 'Area under the ROC curve measuring a binary classifier\'s ability to rank a random positive instance higher than a random negative instance across all decision thresholds.',
    },
    whenToUse: [
      {
        ru: 'Оценка качества бинарного классификатора до выбора конкретного порога принятия решений (threshold).',
        en: 'Evaluating binary classification ranking ability before selecting a specific decision threshold.',
      },
      {
        ru: 'Вероятностная интерпретация: ROC-AUC равен вероятности того, что случайно выбранный положительный объект получит скор выше отрицательного.',
        en: 'Probabilistic interpretation: ROC-AUC equals P(Score(Positive) > Score(Negative)).',
      },
      {
        ru: 'Кредитный скоринг, ранжирование кандидатов, предсказание оттока (Churn).',
        en: 'Credit scoring, candidate ranking, and churn prediction.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'ROC-AUC инвариантен к балансу классов (FPR делится на общее число отрицательных объектов), поэтому при экстремальном дисбалансе (например, 1 к 10 000) ROC-AUC может быть обманчиво высоким (>0.98). В таких случаях используют PR-AUC.',
        en: 'ROC-AUC is insensitive to class imbalance because FPR normalizes by total negatives. Under extreme imbalance (e.g., 1:10,000), ROC-AUC can be deceptively high (>0.98); use PR-AUC instead.',
      },
      {
        ru: 'Случайный классификатор дает AUC = 0.5; идеальный — 1.0; если AUC < 0.5 — инвертировав предсказания, получим 1 - AUC.',
        en: 'Random guessing gives AUC = 0.5; a perfect model gives 1.0; if AUC < 0.5, inverting predictions yields 1 - AUC.',
      },
    ],
    lessonPath: {
      moduleId: 'data-wrangling-eda',
      lessonId: 'eda-4-validation-metrics',
      title: { ru: 'Валидация моделей и метрики качества', en: 'Model Validation & Evaluation Metrics' },
    },
    tags: ['roc', 'auc', 'roc-auc', 'tpr', 'fpr', 'threshold', 'ranking'],
  },
  {
    id: 'pr-auc',
    term: { ru: 'PR-AUC (Площадь под PR-кривой)', en: 'PR-AUC (Precision-Recall AUC / AP)' },
    englishName: 'Precision-Recall Area Under Curve / Average Precision',
    category: 'metrics',
    formulaLatex: '\\text{PR-AUC} = \\int_0^1 \\text{Precision}(\\text{Recall}) \\, d\\text{Recall} \\approx \\sum_{k} (R_k - R_{k-1}) \\cdot P_k',
    formulaDescription: {
      ru: 'Кусочно-линейная сумма точности по всем достижимым уровням полноты.',
      en: 'Discrete trapezoidal or step sum of Precision across all unique Recall thresholds.',
    },
    shortDefinition: {
      ru: 'Площадь под кривой Precision-Recall, оценивающая качество ранжирования исключительно для редкого целевого класса.',
      en: 'Area under the Precision-Recall curve focusing strictly on the rare positive class without being diluted by True Negatives.',
    },
    whenToUse: [
      {
        ru: 'Экстремальный дисбаланс классов (детектирование фрода, кликабельность рекламы CTR, редкие дефекты).',
        en: 'Severe class imbalance (financial fraud, ad click prediction CTR, manufacturing defect detection).',
      },
      {
        ru: 'Когда число отрицательных примеров огромно, и True Negatives не должны завышать метрику.',
        en: 'When the number of true negatives is overwhelming and should not inflate evaluation metrics.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'В отличие от ROC-AUC, baseline для случайной модели в PR-AUC равен не 0.5, а доле положительного класса в выборке: P / (P + N).',
        en: 'Unlike ROC-AUC (where random baseline is always 0.5), random baseline in PR-AUC equals the positive class prevalence: P / (P + N).',
      },
    ],
    lessonPath: {
      moduleId: 'data-wrangling-eda',
      lessonId: 'eda-4-validation-metrics',
      title: { ru: 'Валидация моделей и метрики качества', en: 'Model Validation & Evaluation Metrics' },
    },
    tags: ['pr-auc', 'average precision', 'ap', 'precision-recall', 'rare class'],
  },
  {
    id: 'map-detection',
    term: { ru: 'mAP (Mean Average Precision)', en: 'mAP (Mean Average Precision)' },
    englishName: 'Mean Average Precision in Object Detection',
    category: 'metrics',
    formulaLatex: '\\text{mAP} = \\frac{1}{C} \\sum_{c=1}^C \\text{AP}_c, \\quad \\text{mAP@[0.5:0.95]} = \\frac{1}{10} \\sum_{\\text{IoU}=0.50}^{0.95} \\text{mAP}_{\\text{IoU}}',
    formulaDescription: {
      ru: 'C — число классов; AP_c — площадь под PR-кривой для класса c при фиксированном пороге IoU.',
      en: 'C is number of classes; AP_c is the area under the PR curve for class c at a given IoU threshold.',
    },
    shortDefinition: {
      ru: 'Главная метрика качества детекции объектов, усредняющая Average Precision по всем классам и порогам пересечения боксов (IoU).',
      en: 'Primary benchmark metric for object detection, averaging Average Precision across all object classes and IoU thresholds.',
    },
    whenToUse: [
      {
        ru: 'Бенчмаркинг моделей детекции объектов (YOLO, Faster R-CNN, DETR, SSD).',
        en: 'Benchmarking object detection architectures (YOLO, Faster R-CNN, DETR, SSD).',
      },
      {
        ru: 'mAP@0.5 требует попадания бокса с IoU >= 50%; mAP@[0.5:0.95] (стандарт COCO) усредняет пороги от 0.50 до 0.95 с шагом 0.05.',
        en: 'mAP@0.5 requires bounding box overlap IoU >= 50%; mAP@[0.5:0.95] (COCO standard) averages over 10 thresholds from 0.50 to 0.95 with step 0.05.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Для расчета AP предсказанные боксы сортируются по confidence убыванию, а каждое сопоставление с ground-truth классифицируется через Greedy Matching (один ground-truth бокс может быть сопоставлен максимум один раз).',
        en: 'To calculate AP, predicted bounding boxes are sorted descending by confidence, and matched greedily with ground-truth boxes (each ground-truth box can only be matched once).',
      },
    ],
    lessonPath: {
      moduleId: 'computer-vision-deep-learning',
      lessonId: 'cv-3-detection-yolo-detr',
      title: { ru: 'Детекция объектов: YOLO, Faster R-CNN, DETR и NMS', en: 'Object Detection: YOLO, Faster R-CNN, DETR & NMS' },
    },
    tags: ['map', 'average precision', 'coco', 'detection', 'iou', 'yolo'],
  },
  {
    id: 'mse-loss',
    term: { ru: 'MSE и RMSE (Среднеквадратичная ошибка)', en: 'MSE & RMSE (Mean Squared Error)' },
    englishName: 'Mean Squared Error & Root Mean Squared Error',
    category: 'metrics',
    formulaLatex: '\\text{MSE} = \\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2, \\quad \\text{RMSE} = \\sqrt{\\text{MSE}}',
    formulaDescription: {
      ru: 'y_i — истинное значение, hat{y}_i — прогноз модели, N — число наблюдений.',
      en: 'y_i is ground truth, hat{y}_i is model prediction, N is sample count.',
    },
    shortDefinition: {
      ru: 'Квадратичная функция потерь и метрика регрессии, штрафующая ошибки пропорционально их квадрату.',
      en: 'Quadratic loss function and regression metric that penalizes larger prediction errors quadratically.',
    },
    whenToUse: [
      {
        ru: 'Классические задачи регрессии (прогнозирование непрерывных величин: цен, спроса, температуры).',
        en: 'Classic continuous regression tasks (prices, sales volume, sensor forecasting).',
      },
      {
        ru: 'Когда большие промахи модели категорически недопустимы (квадрат ошибки многократно усиливает влияние выбросов).',
        en: 'When large deviations are unacceptable and must be heavily penalized.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'MSE соответствует оценке максимального правдоподобия (MLE) в предположении нормального распределения шума: epsilon ~ N(0, sigma^2).',
        en: 'MSE corresponds to Maximum Likelihood Estimation (MLE) under the assumption of Gaussian noise: epsilon ~ N(0, sigma^2).',
      },
      {
        ru: 'Минимум MSE математически достигается в условном математическом ожидании: hat{y}(x) = E[y | x].',
        en: 'The theoretical minimizer of MSE is the conditional expectation: hat{y}(x) = E[y | x].',
      },
    ],
    lessonPath: {
      moduleId: 'linear-models',
      lessonId: 'linear-1-analytical-ols',
      title: { ru: 'Аналитическое решение МНК и сингулярное разложение (SVD)', en: 'Analytical OLS Solution & SVD' },
    },
    tags: ['mse', 'rmse', 'regression', 'loss', 'ols', 'квадратичная ошибка'],
  },
  {
    id: 'cross-entropy',
    term: { ru: 'Кросс-энтропия (Cross-Entropy Loss / Log Loss)', en: 'Cross-Entropy Loss (Log Loss)' },
    englishName: 'Categorical & Binary Cross-Entropy Loss',
    category: 'metrics',
    formulaLatex: '\\mathcal{L}_{\\text{BCE}} = -\\frac{1}{N} \\sum_{i=1}^N \\big[ y_i \\ln(\\hat{p}_i) + (1 - y_i) \\ln(1 - \\hat{p}_i) \\big], \\quad \\mathcal{L}_{\\text{CCE}} = -\\sum_{c=1}^C y_c \\ln(\\hat{p}_c)',
    formulaDescription: {
      ru: 'y_i in {0, 1} — истинный класс, hat{p}_i — предсказанная вероятность.',
      en: 'y_i in {0, 1} is true class label, hat{p}_i is predicted probability.',
    },
    shortDefinition: {
      ru: 'Стандартная функция потерь для классификации, измеряющая расхождение между истинным распределением меток и предсказанными вероятностями модели.',
      en: 'Standard classification loss measuring the divergence between ground-truth labels and predicted probability distributions.',
    },
    whenToUse: [
      {
        ru: 'Обучение нейронных сетей и логистической регрессии на классификацию (BCE для 2 классов, Categorical CE для C классов).',
        en: 'Training neural networks and logistic regression for classification (BCE for 2 classes, CCE for C classes).',
      },
      {
        ru: 'В паре с Softmax на выходе многоклассовой сети или Sigmoid для бинарной.',
        en: 'Paired with Softmax for multi-class outputs or Sigmoid for binary classification.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Эквивалентна минимизации KL-дивергенции между эмпирическим распределением меток и предсказанием модели.',
        en: 'Minimizing Cross-Entropy is mathematically equivalent to minimizing the KL-divergence between target and predicted distributions.',
      },
      {
        ru: 'Штрафует модель бесконечно большим лоссом, если модель уверена на 100% в неверном классе (ln(0) -> -inf).',
        en: 'Heavily penalizes confident wrong predictions with asymptotic infinity (ln(0) -> -inf).',
      },
    ],
    lessonPath: {
      moduleId: 'linear-models',
      lessonId: 'linear-3-logistic-regression-mle',
      title: { ru: 'Логистическая регрессия, Log-Loss и метод MLE', en: 'Logistic Regression, Log-Loss & MLE' },
    },
    tags: ['cross-entropy', 'logloss', 'classification', 'softmax', 'sigmoid', 'loss'],
  },

  // ==========================================
  // 2. РЕГУЛЯРИЗАЦИЯ И ОПТИМИЗАТОРЫ
  // ==========================================
  {
    id: 'l1-regularization',
    term: { ru: 'L1-регуляризация (Lasso)', en: 'L1 Regularization (Lasso)' },
    englishName: 'L1 Regularization / Least Absolute Shrinkage and Selection Operator',
    category: 'regularization',
    formulaLatex: '\\mathcal{L}_{L_1}(w) = \\mathcal{L}_0(w) + \\lambda \\|w\\|_1 = \\mathcal{L}_0(w) + \\lambda \\sum_{j=1}^D |w_j|',
    formulaDescription: {
      ru: 'L_0(w) — исходная функция потерь, lambda > 0 — сила регуляризации.',
      en: 'L_0(w) is unregularized loss, lambda > 0 controls regularization strength.',
    },
    shortDefinition: {
      ru: 'Метод регуляризации, добавляющий штраф, пропорциональный сумме модулей весов, и приводящий к строгому занулению неинформативных весов (разреженности).',
      en: 'Regularization adding a penalty proportional to the sum of absolute weight values, driving non-informative coefficients to exactly zero (sparsity).',
    },
    whenToUse: [
      {
        ru: 'Отбор признаков (Feature Selection): когда признаков много (D > N), и большинство из них шумовые.',
        en: 'Embedded feature selection: when features outnumber samples (D > N) and many are redundant noise.',
      },
      {
        ru: 'Создание компактных, интерпретируемых моделей с разреженными матрицами коэффициентов.',
        en: 'Building sparse, highly interpretable linear models with zeroed-out features.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Почему L1 зануляет веса, а L2 — нет? Геометрически: допустимая область L1 — ромб/октаэдр с острыми углами на осях. Линии уровня функции потерь почти всегда касаются ромба именно в его вершинах, где координаты равны нулю.',
        en: 'Why does L1 zero out weights while L2 only shrinks them? Geometrically, the L1 constraint region is a diamond with sharp vertices along coordinate axes. Loss contours usually intersect at vertices where coordinates equal zero.',
      },
      {
        ru: 'L1-штраф не дифференцируем в нуле (|w| = 0), поэтому оптимизируется через субградиенты или Coordinate Descent.',
        en: 'L1 is non-differentiable at zero (|w| = 0), requiring subgradient descent or coordinate descent for optimization.',
      },
    ],
    lessonPath: {
      moduleId: 'linear-models',
      lessonId: 'linear-2-regularization-ridge-lasso',
      title: { ru: 'Регуляризация: Ridge, Lasso, ElasticNet', en: 'Regularization: Ridge, Lasso, ElasticNet' },
    },
    tags: ['l1', 'lasso', 'regularization', 'feature selection', 'sparsity', 'разреженность'],
  },
  {
    id: 'l2-regularization',
    term: { ru: 'L2-регуляризация (Ridge / Weight Decay)', en: 'L2 Regularization (Ridge / Weight Decay)' },
    englishName: 'L2 Regularization / Ridge Regression / Tikhonov',
    category: 'regularization',
    formulaLatex: '\\mathcal{L}_{L_2}(w) = \\mathcal{L}_0(w) + \\frac{\\lambda}{2} \\|w\\|_2^2 = \\mathcal{L}_0(w) + \\frac{\\lambda}{2} \\sum_{j=1}^D w_j^2',
    formulaDescription: {
      ru: 'lambda > 0 — гиперпараметр регуляризации; градиент штрафа: lambda * w.',
      en: 'lambda > 0 is regularization strength; gradient of penalty is lambda * w.',
    },
    shortDefinition: {
      ru: 'Метод регуляризации, пропорционально уменьшающий абсолютные величины весов, препятствуя переобучению и подавляя мультиколлинеарность.',
      en: 'Regularization penalizing squared weight magnitude, smoothly shrinking parameters towards zero to prevent overfitting and resolve multicollinearity.',
    },
    whenToUse: [
      {
        ru: 'Борьба с переобучением при корреляции между признаками (мультиколлинеарность).',
        en: 'Preventing overfitting when input features are highly correlated (multicollinearity).',
      },
      {
        ru: 'Делает матрицу X^T X + lambda * I строго невырожденной (обратимой) при аналитическом МНК.',
        en: 'Guarantees that X^T X + lambda * I is strictly non-singular and invertible in analytical OLS.',
      },
      {
        ru: 'В нейросетях реализуется как Weight Decay: w_{t+1} = (1 - eta * lambda) * w_t - eta * grad.',
        en: 'Implemented as Weight Decay in neural nets: w_{t+1} = (1 - eta * lambda) * w_t - eta * grad.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'L2 никогда строго не зануляет веса в 0, а лишь равномерно стягивает их к нулю.',
        en: 'L2 never forces coefficients strictly to zero; it shrinks all weights asymptotically towards zero.',
      },
      {
        ru: 'Байесовская интерпретация: L2 эквивалентна априорному нормальному распределению весов (Gaussian Prior) w ~ N(0, sigma^2). L1 соответствует распределению Лапласа.',
        en: 'Bayesian view: L2 corresponds to a zero-mean Gaussian prior w ~ N(0, sigma^2); L1 corresponds to a Laplace prior.',
      },
    ],
    lessonPath: {
      moduleId: 'linear-models',
      lessonId: 'linear-2-regularization-ridge-lasso',
      title: { ru: 'Регуляризация: Ridge, Lasso, ElasticNet', en: 'Regularization: Ridge, Lasso, ElasticNet' },
    },
    tags: ['l2', 'ridge', 'weight decay', 'regularization', 'multicollinearity'],
  },
  {
    id: 'adamw-optimizer',
    term: { ru: 'Оптимизатор AdamW', en: 'AdamW Optimizer' },
    englishName: 'Adam with Decoupled Weight Decay',
    category: 'regularization',
    formulaLatex: 'm_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t, \\quad v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2, \\quad \\theta_{t+1} = \\theta_t (1 - \\eta \\lambda) - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t',
    formulaDescription: {
      ru: 'm_t — первый момент (скорость), v_t — второй момент (адаптивный шаг), lambda — коэффициент разделенного weight decay.',
      en: 'm_t is 1st moment, v_t is 2nd raw moment, lambda is decoupled weight decay factor.',
    },
    shortDefinition: {
      ru: 'Стандарт де-факто для обучения трансформеров и LLM: алгоритм Adam с корректно отделенным от адаптивного шага затуханием весов (Weight Decay).',
      en: 'De facto standard optimizer for Transformers and LLMs: Adam with decoupled weight decay separated from adaptive learning rate scaling.',
    },
    whenToUse: [
      {
        ru: 'Обучение современных языковых моделей (LLM), трансформеров (GPT, BERT, ViT) и глубоких нейросетей.',
        en: 'Pretraining and fine-tuning modern Transformers (GPT, BERT, ViT, Llama) and deep neural architectures.',
      },
      {
        ru: 'Когда классический Adam с L2-штрафом затухал медленнее для параметров с большими градиентами.',
        en: 'Resolving the flaw in classic Adam where weights with large historical gradients decayed slower.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'В классическом Adam добавление L2 к функции потерь приводило к тому, что веса с большими градиентами штрафовались МЕНЬШЕ (из-за деления на sqrt(v_t)). В AdamW штраф 1 - eta * lambda вынесен из адаптивного обновления.',
        en: 'In original Adam, adding L2 penalty to the loss caused weights with large gradients to decay LESS due to division by sqrt(v_t). AdamW directly applies (1 - eta * lambda) to weights.',
      },
    ],
    lessonPath: {
      moduleId: 'pytorch-pandas-sklearn',
      lessonId: 'pt-2-autograd-optimizers',
      title: { ru: 'Autograd и алгоритмы оптимизации (SGD, AdamW)', en: 'Autograd & Optimizers (SGD, AdamW)' },
    },
    tags: ['adam', 'adamw', 'optimizer', 'weight decay', 'learning rate', 'llm'],
  },
  {
    id: 'dropout',
    term: { ru: 'Dropout (Дропаут)', en: 'Dropout & Inverted Dropout' },
    englishName: 'Dropout Regularization',
    category: 'regularization',
    formulaLatex: 'm_i \\sim \\text{Bernoulli}(1 - p), \\quad y_i = \\frac{1}{1 - p} \\cdot m_i \\cdot x_i',
    formulaDescription: {
      ru: 'p — вероятность отключения нейрона; множитель 1 / (1 - p) масштабирует активации во время обучения (Inverted Dropout).',
      en: 'p is dropout probability; 1 / (1 - p) scales activations during training (Inverted Dropout).',
    },
    shortDefinition: {
      ru: 'Техника регуляризации нейросетей, случайно обнуляющая долю нейронов во время обучения, предотвращая ко-адаптацию признаков.',
      en: 'Regularization randomly zeroing activations during training with probability p to prevent feature co-adaptation.',
    },
    whenToUse: [
      {
        ru: 'Предотвращение переобучения полносвязных и сверточных слоев глубоких нейросетей.',
        en: 'Preventing overfitting in dense and convolutional layers of deep neural networks.',
      },
      {
        ru: 'Интерпретируется как эффективное ансамблирование экспоненциального числа подсетей с общими весами.',
        en: 'Implicitly ensembles an exponential number of sub-networks with shared weights.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'На этапе инференса (eval) Dropout полностью отключается (m = 1). Благодаря Inverted Dropout активации не требуют домножения на 1 - p на инференсе.',
        en: 'During inference (eval), Dropout is turned off (m = 1). Inverted Dropout ensures no scaling is required at test time.',
      },
      {
        ru: 'Monte-Carlo Dropout: если оставить Dropout включенным во время инференса и сделать N прогонов, можно оценить эпистемическую неопределенность модели.',
        en: 'Monte Carlo Dropout: keeping dropout active during inference across N stochastic passes provides epistemic uncertainty estimates.',
      },
    ],
    lessonPath: {
      moduleId: 'pytorch-pandas-sklearn',
      lessonId: 'pt-3-nn-module',
      title: { ru: 'Анатомия torch.nn.Module и регуляризация', en: 'torch.nn.Module Anatomy & Regularization' },
    },
    tags: ['dropout', 'regularization', 'overfitting', 'neural network'],
  },

  // ==========================================
  // 3. АРХИТЕКТУРЫ И СЛОИ
  // ==========================================
  {
    id: 'self-attention',
    term: { ru: 'Self-Attention (Внимание к себе)', en: 'Scaled Dot-Product Self-Attention' },
    englishName: 'Scaled Dot-Product Attention (Vaswani et al.)',
    category: 'architectures',
    formulaLatex: '\\text{Attention}(Q, K, V) = \\text{Softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} + M \\right) V',
    formulaDescription: {
      ru: 'Q, K, V — проекции входа (Queries, Keys, Values); d_k — размерность ключа; M — причинная маска.',
      en: 'Q, K, V are linear projections; d_k is key head dimension; M is causal mask.',
    },
    shortDefinition: {
      ru: 'Фундаментальный механизм трансформеров, вычисляющий контекстные веса внимания между каждой парой токенов последовательности.',
      en: 'Core mechanism of Transformer architectures computing pairwise contextual attention weights between all tokens in a sequence.',
    },
    whenToUse: [
      {
        ru: 'Моделирование длинных контекстных зависимостей в тексте, коде и изображениях без рекуррентности (RNN).',
        en: 'Capturing long-range contextual relationships in text, code, audio, and vision without recurrence (RNNs).',
      },
      {
        ru: 'Сложность по времени и памяти: O(N^2) от длины контекста N.',
        en: 'Computational time and memory complexity scales as O(N^2) with context length N.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Зачем делить на sqrt(d_k)? При большой размерности d_k скалярное произведение q * k имеет дисперсию d_k. Без деления аргументы Softmax становятся огромными, Softmax насыщается, градиенты затухают (Vanishing Gradient).',
        en: 'Why divide by sqrt(d_k)? For large d_k, dot products grow large in magnitude, pushing Softmax into saturated regions with vanishing gradients. Dividing by sqrt(d_k) preserves unit variance.',
      },
    ],
    lessonPath: {
      moduleId: 'pytorch-pandas-sklearn',
      lessonId: 'pt-7-transformer-theory',
      title: { ru: 'Архитектура Transformer: Scaled Dot-Product Attention', en: 'Transformer Architecture: Scaled Dot-Product Attention' },
    },
    tags: ['attention', 'self-attention', 'transformer', 'softmax', 'qkv', 'трансформер'],
  },
  {
    id: 'batch-norm',
    term: { ru: 'Batch Normalization (BatchNorm)', en: 'Batch Normalization (BatchNorm)' },
    englishName: 'Batch Normalization (Ioffe & Szegedy)',
    category: 'architectures',
    formulaLatex: '\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}, \\quad y_i = \\gamma \\hat{x}_i + \\beta',
    formulaDescription: {
      ru: 'mu_B, sigma_B^2 — статистики по текущему мини-батчу; gamma, beta — обучаемые параметры масштаба и сдвига.',
      en: 'mu_B, sigma_B^2 are mini-batch statistics; gamma, beta are learnable affine parameters.',
    },
    shortDefinition: {
      ru: 'Слой нормализации активаций по размерности батча, ускоряющий сходимость и стабилизирующий ландшафт функции потерь в глубоких CNN.',
      en: 'Normalizes layer inputs across the mini-batch dimension, accelerating training and smoothing loss landscapes in deep CNNs.',
    },
    whenToUse: [
      {
        ru: 'Сверточные нейросети (CNN, ResNet, MobileNet) для компьютерного зрения.',
        en: 'Convolutional neural networks (CNNs, ResNets) in computer vision.',
      },
      {
        ru: 'Позволяет использовать более высокий Learning Rate и снижает чувствительность к начальной инициализации весов.',
        en: 'Enables higher learning rates and reduces sensitivity to parameter initialization.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'BatchNorm непригоден для малых батчей (batch_size < 8) и последовательностей переменной длины (NLP). Во время инференса используются накопленные running_mean и running_var.',
        en: 'BatchNorm performs poorly with small batches (batch_size < 8) and dynamic sequence lengths. During inference, it uses running_mean and running_var accumulated during training.',
      },
    ],
    lessonPath: {
      moduleId: 'computer-vision-deep-learning',
      lessonId: 'cv-2-resnet-mobilenet-vit',
      title: { ru: 'Классические и современные архитектуры: ResNet, ViT', en: 'Deep Architectures: ResNet, MobileNet, ViT' },
    },
    tags: ['batchnorm', 'normalization', 'cnn', 'resnet', 'layer'],
  },
  {
    id: 'layer-norm',
    term: { ru: 'Layer Normalization & RMSNorm', en: 'Layer Normalization & RMSNorm' },
    englishName: 'Layer Normalization (Ba, Kiros, Hinton) & RMSNorm',
    category: 'architectures',
    formulaLatex: '\\text{LN}(x) = \\frac{x - \\mu_L}{\\sqrt{\\sigma_L^2 + \\epsilon}} \\odot \\gamma + \\beta, \\quad \\text{RMSNorm}(x) = \\frac{x}{\\sqrt{\\frac{1}{d} \\sum_{j=1}^d x_j^2 + \\epsilon}} \\odot \\gamma',
    formulaDescription: {
      ru: 'Статистики рассчитываются индивидуально для каждого токена по размерности скрытых признаков d.',
      en: 'Statistics computed independently per token across feature dimension d.',
    },
    shortDefinition: {
      ru: 'Нормализация скрытых состояний токенов поперек признаков, стандарт для архитектур Transformer и современных LLM.',
      en: 'Normalizes hidden states across feature dimensions independently per token; the universal standard in Transformers and LLMs.',
    },
    whenToUse: [
      {
        ru: 'Трансформеры (GPT-4, LLaMA, Claude, DeepSeek, BERT), авторегрессионные языковые модели.',
        en: 'Transformers and autoregressive LLMs (Llama-3, GPT-4, DeepSeek, Claude, BERT).',
      },
      {
        ru: 'Не зависит от размера батча и одинаково работает при batch_size = 1 на инференсе.',
        en: 'Independent of batch size, performing identically during training and batch_size = 1 inference.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'RMSNorm (Root Mean Square Norm) не вычитает среднее mu, а только делит на среднеквадратичную норму, экономя ~7% вычислений без потери качества.',
        en: 'RMSNorm skips mean-centering, dividing strictly by the root mean square, reducing compute by ~7% without loss in model accuracy.',
      },
      {
        ru: 'Pre-LN vs Post-LN: современные LLM используют Pre-LN (нормализация перед блоком внимания), устраняя затухание градиентов при обучении сверхглубоких сетей.',
        en: 'Pre-LN vs Post-LN: modern LLMs place normalization before the attention sub-layer (Pre-LN), preventing gradient vanishing during deep model training.',
      },
    ],
    lessonPath: {
      moduleId: 'pytorch-pandas-sklearn',
      lessonId: 'pt-7-transformer-theory',
      title: { ru: 'Архитектура Transformer: Scaled Dot-Product Attention', en: 'Transformer Architecture: Scaled Dot-Product Attention' },
    },
    tags: ['layernorm', 'rmsnorm', 'transformer', 'normalization', 'llm', 'llama'],
  },

  // ==========================================
  // 4. КОМПЬЮТЕРНОЕ ЗРЕНИЕ / CV
  // ==========================================
  {
    id: 'iou-jaccard',
    term: { ru: 'IoU (Intersection over Union / Коэффициент Жаккара)', en: 'IoU (Intersection over Union / Jaccard Index)' },
    englishName: 'Intersection over Union / Jaccard Index',
    category: 'cv',
    formulaLatex: '\\text{IoU}(A, B) = \\frac{|A \\cap B|}{|A \\cup B|} = \\frac{|A \\cap B|}{|A| + |B| - |A \\cap B|}',
    formulaDescription: {
      ru: 'A и B — площади ограничивающих рамок (Bounding Boxes) или масок сегментации.',
      en: 'A and B are bounding box areas or binary segmentation masks.',
    },
    shortDefinition: {
      ru: 'Метрика геометрического перекрытия двух областей, принимающая значения от 0 (нет пересечения) до 1 (полное совпадение).',
      en: 'Geometric overlap metric bounded between 0 (disjoint) and 1 (exact spatial alignment).',
    },
    whenToUse: [
      {
        ru: 'Оценка качества детекции объектов (порог совпадения предсказания с Ground Truth).',
        en: 'Object detection evaluation (matching predicted boxes with ground truth).',
      },
      {
        ru: 'Ключевой критерий фильтрации дубликатов в алгоритме NMS (Non-Maximum Suppression).',
        en: 'Core overlap criterion in Non-Maximum Suppression (NMS) duplicate filtering.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Если рамки не пересекаются, IoU = 0 и его градиент равен нулю. Поэтому для функций потерь используют GIoU, DIoU и CIoU.',
        en: 'When boxes do not overlap, IoU = 0 with zero gradient. GIoU, DIoU, and CIoU introduce distance and aspect ratio terms to maintain gradients.',
      },
    ],
    lessonPath: {
      moduleId: 'computer-vision-deep-learning',
      lessonId: 'cv-3-detection-yolo-detr',
      title: { ru: 'Детекция объектов: YOLO, Faster R-CNN, DETR и NMS', en: 'Object Detection: YOLO, Faster R-CNN, DETR & NMS' },
    },
    tags: ['iou', 'jaccard', 'bbox', 'detection', 'segmentation'],
  },
  {
    id: 'nms',
    term: { ru: 'NMS (Подавление немаксимумов)', en: 'Non-Maximum Suppression (NMS)' },
    englishName: 'Non-Maximum Suppression Algorithm',
    category: 'cv',
    formulaLatex: '\\text{Discard } B_j \\iff \\text{IoU}(B_{\\text{max}}, B_j) > \\text{IoU}_{\\text{thresh}} \\quad \\text{for } j \\neq \\text{max}',
    formulaDescription: {
      ru: 'B_max — рамка с наивысшим скором уверенности; IoU_thresh — порог подавления дубликатов.',
      en: 'B_max is highest confidence box; IoU_thresh is suppression overlap threshold.',
    },
    shortDefinition: {
      ru: 'Пост-процессинговый алгоритм детекции объектов, удаляющий дублирующие перекрывающиеся рамки одного и того же объекта.',
      en: 'Post-processing algorithm in object detection that eliminates redundant overlapping bounding boxes for the same object.',
    },
    whenToUse: [
      {
        ru: 'Финальный этап работы One-stage и Two-stage детекторов (YOLO, SSD, Faster R-CNN).',
        en: 'Final post-processing stage in anchor-based and anchor-free object detectors (YOLO, Faster R-CNN).',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Классический NMS может ошибочно подавить рамку настоящего соседнего объекта в плотной толпе. Решения: Soft-NMS или архитектуры без NMS (DETR).',
        en: 'Greedy NMS can mistakenly suppress adjacent distinct objects in crowded scenes. Solutions: Soft-NMS (confidence decay) or NMS-free models (DETR bipartite matching).',
      },
    ],
    lessonPath: {
      moduleId: 'computer-vision-deep-learning',
      lessonId: 'cv-3-detection-yolo-detr',
      title: { ru: 'Детекция объектов: YOLO, Faster R-CNN, DETR и NMS', en: 'Object Detection: YOLO, Faster R-CNN, DETR & NMS' },
    },
    tags: ['nms', 'non-maximum suppression', 'yolo', 'detection', 'bounding box'],
  },

  // ==========================================
  // 5. NLP & LLM
  // ==========================================
  {
    id: 'lora-peft',
    term: { ru: 'LoRA (Низкоранговая адаптация весов)', en: 'LoRA (Low-Rank Adaptation)' },
    englishName: 'Low-Rank Adaptation of Large Language Models (Hu et al.)',
    category: 'nlp_llm',
    formulaLatex: 'W = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r} (B \\cdot A), \\quad A \\in \\mathbb{R}^{r \\times d_{\\text{in}}}, \\; B \\in \\mathbb{R}^{d_{\\text{out}} \\times r}, \\; r \\ll \\min(d_{\\text{in}}, d_{\\text{out}})',
    formulaDescription: {
      ru: 'W_0 — замороженные базовые веса; B и A — обучаемые матрицы низкого ранга r; alpha — масштаб.',
      en: 'W_0 is frozen base weight; B and A are trainable low-rank matrices of rank r; alpha is scale factor.',
    },
    shortDefinition: {
      ru: 'Метод эффективного дообучения (PEFT), факторизующий матрицу обновления весов через произведение двух матриц низкого ранга, сокращая число обучаемых параметров на 99%.',
      en: 'Parameter-Efficient Fine-Tuning (PEFT) method decomposing weight updates into two low-rank matrices, reducing trainable parameters by up to 99%.',
    },
    whenToUse: [
      {
        ru: 'Дообучение миллиардных LLM (Llama, Mistral, Qwen) на одной потребительской видеокарте.',
        en: 'Fine-tuning multi-billion parameter LLMs (Llama-3, Qwen-2.5) on a single consumer GPU.',
      },
      {
        ru: 'Нулевая задержка на инференсе: после обучения веса сливаются с базовой моделью: W_merged = W_0 + (alpha / r) * B * A.',
        en: 'Zero inference overhead: adapter weights can be permanently merged back into base weights: W_merged = W_0 + (alpha / r) * B * A.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Инициализация: матрица A инициализируется случайными числами из гауссианы, а матрица B — строго нулями. Это гарантирует, что в начале обучения Delta W = B * A = 0.',
        en: 'Initialization: matrix A is initialized from a Gaussian distribution, while matrix B is strictly zero-initialized, ensuring Delta W = 0 at training onset.',
      },
    ],
    lessonPath: {
      moduleId: 'pytorch-pandas-sklearn',
      lessonId: 'pt-9-llm',
      title: { ru: 'Современный стек LLM: предобучение и тюнинг (LoRA, QLoRA)', en: 'Modern LLM Stack: Pretraining & Tuning (LoRA, QLoRA)' },
    },
    tags: ['lora', 'peft', 'fine-tuning', 'llm', 'adapters', 'низкий ранг'],
  },
  {
    id: 'temperature-sampling',
    term: { ru: 'Температура сэмплирования (Temperature)', en: 'Sampling Temperature in LLMs' },
    englishName: 'Softmax Temperature Scaling',
    category: 'nlp_llm',
    formulaLatex: 'p_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}, \\quad T > 0',
    formulaDescription: {
      ru: 'z_i — сырые логиты токена i из языковой модели, T — параметр температуры.',
      en: 'z_i is unnormalized logit for token i, T is temperature scalar.',
    },
    shortDefinition: {
      ru: 'Гиперпараметр декодирования текста, управляющий степенью энтропии и случайности вероятностного распределения токенов.',
      en: 'Decoding hyperparameter controlling entropy and sharpness of the next-token probability distribution in autoregressive models.',
    },
    whenToUse: [
      {
        ru: 'T -> 0 (Greedy search): распределение становится вырожденным, выбирается только токен с максимальным логитом (код, математика).',
        en: 'T -> 0 (Greedy search): collapses distribution to deterministic argmax mode (code generation, math, factual queries).',
      },
      {
        ru: 'T = 0.7 - 0.9: сбалансированная генерация связных и разнообразных ответов (диалоги, тексты).',
        en: 'T = 0.7 - 0.9: sweet spot balancing fluency, coherence, and creativity (chatbots, writing).',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Температура не меняет порядок ранжирования логитов (z_a > z_b implies z_a / T > z_b / T), но меняет кривизну Softmax.',
        en: 'Temperature preserves the monotonic ranking of logits (z_a > z_b implies z_a / T > z_b / T) but alters relative probability mass.',
      },
    ],
    lessonPath: {
      moduleId: 'pytorch-pandas-sklearn',
      lessonId: 'pt-9-llm',
      title: { ru: 'Современный стек LLM: предобучение и тюнинг (LoRA, QLoRA)', en: 'Modern LLM Stack: Pretraining & Tuning (LoRA, QLoRA)' },
    },
    tags: ['temperature', 'sampling', 'llm', 'decoding', 'softmax', 'генерация'],
  },

  // ==========================================
  // 6. RL & ALIGNMENT
  // ==========================================
  {
    id: 'bellman-equation',
    term: { ru: 'Уравнение Беллмана (Bellman Equation)', en: 'Bellman Optimality Equation' },
    englishName: 'Bellman Optimality Equation for Q-function',
    category: 'rl',
    formulaLatex: 'Q^*(s, a) = \\mathcal{R}(s, a) + \\gamma \\sum_{s\'} \\mathcal{P}(s\' \\mid s, a) \\max_{a\'} Q^*(s\', a\')',
    formulaDescription: {
      ru: 's — состояние, a — действие, R — немедленная награда, gamma — фактор дисконтирования.',
      en: 's is state, a is action, R is immediate reward, gamma is discount factor.',
    },
    shortDefinition: {
      ru: 'Рекуррентное уравнение обучения с подкреплением, выражающее ценность текущего действия через сумму немедленной награды и дисконтированной ценности следующего состояния.',
      en: 'Foundational recursive relationship in Reinforcement Learning decomposing optimal action-value into immediate reward plus discounted future value.',
    },
    whenToUse: [
      {
        ru: 'Теоретическая основа алгоритмов Dynamic Programming, Q-Learning, DQN и Actor-Critic.',
        en: 'Mathematical foundation of Dynamic Programming, Q-Learning, DQN, and Actor-Critic algorithms.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Опирается на Марковское свойство: будущее зависит только от текущего состояния s, а не от предыстории.',
        en: 'Relies strictly on the Markov property: transitions depend solely on current state s and action a, independent of history.',
      },
    ],
    lessonPath: {
      moduleId: 'reinforcement-learning-course',
      lessonId: 'rl-1-foundations-mdp-bellman',
      title: { ru: 'Основы RL: Марковские процессы (MDP) и уравнение Беллмана', en: 'RL Foundations: MDPs & Bellman Equation' },
    },
    tags: ['bellman', 'q-learning', 'rl', 'mdp', 'discount', 'q-функция'],
  },
  {
    id: 'ppo-algorithm',
    term: { ru: 'Алгоритм PPO (Proximal Policy Optimization)', en: 'PPO (Proximal Policy Optimization)' },
    englishName: 'Proximal Policy Optimization (Schulman et al.)',
    category: 'rl',
    formulaLatex: '\\mathcal{L}^{\\text{CLIP}}(\\theta) = \\hat{\\mathbb{E}}_t \\left[ \\min\\left( r_t(\\theta) \\hat{A}_t, \\; \\text{clip}(r_t(\\theta), 1 - \\epsilon, 1 + \\epsilon) \\hat{A}_t \\right) \\right]',
    formulaDescription: {
      ru: 'r_t(theta) — отношение вероятностей новой и старой стратегий; A_t — оценка преимущества (Advantage); epsilon — порог клиппинга.',
      en: 'r_t(theta) is probability ratio pi_theta / pi_old; A_t is advantage estimate; epsilon is clipping parameter.',
    },
    shortDefinition: {
      ru: 'Стабильный алгоритм градиента стратегии Actor-Critic, ограничивающий величину шага обновления политики с помощью клиппинга.',
      en: 'Actor-Critic policy gradient algorithm preventing destructive large policy updates via clipped probability ratio bounds.',
    },
    whenToUse: [
      {
        ru: 'Классический этап RLHF для обучения моделей Instruct/Chat (InstructGPT, ChatGPT).',
        en: 'Standard RLHF training pipeline for aligning chat and instruction-following LLMs.',
      },
      {
        ru: 'Робототехника и управление агентами в непрерывных пространствах действий.',
        en: 'Robotics and continuous control benchmarks.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Клиппинг 1 +- epsilon предотвращает коллапс стратегии без тяжелого вычисления обратной матрицы Фишера (как в TRPO).',
        en: 'Clipping to [1 - eps, 1 + eps] avoids catastrophic policy collapse without computing costly Fisher Information matrix inverses as in TRPO.',
      },
    ],
    lessonPath: {
      moduleId: 'reinforcement-learning-course',
      lessonId: 'rl-2-key-algorithms-dqn-ppo',
      title: { ru: 'Ключевые алгоритмы: DQN, Policy Gradient и PPO', en: 'Key RL Algorithms: DQN, Policy Gradient & PPO' },
    },
    tags: ['ppo', 'rlhf', 'policy gradient', 'actor-critic', 'clip', 'выравнивание'],
  },
  {
    id: 'dpo-alignment',
    term: { ru: 'DPO (Direct Preference Optimization)', en: 'DPO (Direct Preference Optimization)' },
    englishName: 'Direct Preference Optimization (Rafailov et al.)',
    category: 'rl',
    formulaLatex: '\\mathcal{L}_{\\text{DPO}}(\\theta) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\ln \\sigma\\left( \\beta \\ln \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\ln \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)} \\right) \\right]',
    formulaDescription: {
      ru: 'y_w — выигравший ответ (chosen), y_l — отвергнутый (rejected), pi_ref — замороженная референсная модель SFT.',
      en: 'y_w is chosen response, y_l is rejected response, pi_ref is frozen reference SFT policy.',
    },
    shortDefinition: {
      ru: 'Метод выравнивания LLM по предпочтениям человека напрямую через функцию потерь бинарного выбора БЕЗ отдельной Reward-модели и БЕЗ PPO.',
      en: 'Direct preference alignment framework training LLMs directly on pairwise human feedback without learning a separate reward model or running PPO.',
    },
    whenToUse: [
      {
        ru: 'Пост-тренинг современных открытых LLM (Llama-3, Qwen-2.5, Zephyr) для устранения токсичности и повышения полезности.',
        en: 'Post-training alignment for modern open LLMs (Llama-3, Qwen-2.5) to increase helpfulness and reduce toxicity.',
      },
      {
        ru: 'В 3-5 раз быстрее и значительно стабильнее, чем классический RLHF PPO.',
        en: '3-5x faster and drastically more stable than complex multi-stage RLHF pipelines.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'DPO доказывает аналитическую эквивалентность между оптимальной стратегией с KL-штрафом и неявной функцией награды r(x, y) = beta * ln(pi_theta / pi_ref).',
        en: 'DPO analytically derives that the optimal policy under a KL constraint implicitly parameterizes the reward function r(x, y) = beta * ln(pi_theta / pi_ref).',
      },
    ],
    lessonPath: {
      moduleId: 'reinforcement-learning-course',
      lessonId: 'rl-3-modern-llm-rlhf-dpo-grpo',
      title: { ru: 'Современный RL для языковых моделей: RLHF, DPO и GRPO', en: 'Modern LLM RL: RLHF, DPO & GRPO (DeepSeek-R1)' },
    },
    tags: ['dpo', 'alignment', 'rlhf', 'llm', 'preferences', 'human feedback'],
  },
  {
    id: 'grpo-deepseek',
    term: { ru: 'GRPO (Group Relative Policy Optimization)', en: 'GRPO (Group Relative Policy Optimization)' },
    englishName: 'Group Relative Policy Optimization (DeepSeek R1 / Math)',
    category: 'rl',
    formulaLatex: '\\hat{A}_{i} = \\frac{r_i - \\text{mean}(\\{r_1, \\dots, r_G\\})}{\\text{std}(\\{r_1, \\dots, r_G\\}) + \\epsilon}, \\quad \\mathcal{L} = \\frac{1}{G} \\sum_{i=1}^G \\min(r_t \\hat{A}_i, \\text{clip}(r_t, 1 \\pm \\epsilon) \\hat{A}_i)',
    formulaDescription: {
      ru: 'Для каждого промпта генерируется группа из G ответов; преимущество A_i вычисляется нормализацией наград внутри группы.',
      en: 'A group of G responses is generated per prompt; advantage A_i is computed by normalizing rewards within the group.',
    },
    shortDefinition: {
      ru: 'Алгоритм RL, разработанный DeepSeek для моделей рассуждений (Reasoning R1), исключающий тяжелую модель критика (Critic Network).',
      en: 'Reinforcement learning algorithm introduced by DeepSeek for reasoning models (R1) that completely eliminates the separate Critic neural network.',
    },
    whenToUse: [
      {
        ru: 'Обучение цепочек рассуждений (Chain-of-Thought, CoT) и математических моделей (DeepSeek-R1).',
        en: 'Training reasoning chains (Chain-of-Thought) and math/coding problem solvers (DeepSeek-R1).',
      },
      {
        ru: 'Экономит до 50% видеопамяти при RL-обучении за счет полного отказа от поддержания отдельной нейросети Critic.',
        en: 'Saves ~50% GPU memory during training by discarding the heavy Value/Critic network.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'В PPO модель Critic имеет размер Actor (например, 70B), удваивая расход VRAM. GRPO использует среднее по группе ответов как бейзлайн.',
        en: 'In classic PPO, the Critic network equals the Actor model size, doubling VRAM requirements. GRPO substitutes the Critic with empirical intra-group response statistics.',
      },
    ],
    lessonPath: {
      moduleId: 'reinforcement-learning-course',
      lessonId: 'rl-3-modern-llm-rlhf-dpo-grpo',
      title: { ru: 'Современный RL для языковых моделей: RLHF, DPO и GRPO', en: 'Modern LLM RL: RLHF, DPO & GRPO (DeepSeek-R1)' },
    },
    tags: ['grpo', 'deepseek', 'deepseek-r1', 'rl', 'reasoning', 'critic'],
  },

  // ==========================================
  // 7. СТАТИСТИКА И ТЕОРВЕР
  // ==========================================
  {
    id: 'p-value',
    term: { ru: 'p-уровень значимости (p-value)', en: 'p-value in Hypothesis Testing' },
    englishName: 'p-value / Probability Value',
    category: 'statistics',
    formulaLatex: 'p = P(T(X) \\ge T_{\\text{obs}} \\mid H_0)',
    formulaDescription: {
      ru: 'Вероятность получить значение статистики не менее экстремальное, чем наблюдаемое, при истинности нулевой гипотезы H_0.',
      en: 'Probability of observing test statistic as or more extreme than T_obs assuming null hypothesis H_0 is true.',
    },
    shortDefinition: {
      ru: 'Мера доказательства против нулевой гипотезы: если p < alpha (обычно 0.05), нулевая гипотеза отвергается в пользу альтернативной.',
      en: 'Statistical evidence against the null hypothesis: if p < alpha (typically 0.05), H_0 is rejected in favor of H_1.',
    },
    whenToUse: [
      {
        ru: 'A/B-тестирование продуктовых метрик (конверсия, выручка, клики).',
        en: 'A/B testing online product experiments (conversion rate, revenue, retention).',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Частая ошибка: p-value — это НЕ вероятность того, что H_0 верна! Это условная вероятность наблюдения таких данных при условии истинности H_0.',
        en: 'Common misconception: p-value is NOT the probability that H_0 is true! It is P(Data | H_0 is true), not P(H_0 is true | Data).',
      },
    ],
    lessonPath: {
      moduleId: 'ab-testing-experimentation',
      lessonId: 'ab-2-stats-hypothesis-testing',
      title: { ru: 'Проверка гипотез в A/B: t-тест, критерий Манна-Уитни, p-value', en: 'Hypothesis Testing in A/B: t-test, Mann-Whitney & p-value' },
    },
    tags: ['p-value', 'statistics', 'a/b testing', 'hypothesis', 'null hypothesis'],
  },
  {
    id: 'bayes-theorem',
    term: { ru: 'Теорема Байеса', en: 'Bayes\' Theorem' },
    englishName: 'Bayes\' Theorem for Conditional Probability',
    category: 'statistics',
    formulaLatex: 'P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)} = \\frac{P(B \\mid A) \\cdot P(A)}{\\sum_i P(B \\mid A_i) P(A_i)}',
    formulaDescription: {
      ru: 'P(A|B) — апостериорная вероятность, P(A) — априорная, P(B|A) — правдоподобие, P(B) — маргинальное свидетельство.',
      en: 'P(A|B) is posterior, P(A) is prior, P(B|A) is likelihood, P(B) is evidence.',
    },
    shortDefinition: {
      ru: 'Фундаментальная теорема теории вероятностей, позволяющая пересчитывать вероятность гипотезы при поступлении новых эмпирических свидетельств.',
      en: 'Core theorem of probability describing how to update the probability of a hypothesis given newly observed evidence.',
    },
    whenToUse: [
      {
        ru: 'Наивный байесовский классификатор (Naive Bayes) для фильтрации спама и текстов.',
        en: 'Naive Bayes text and spam classification.',
      },
      {
        ru: 'Анализ редких событий: парадокс базовой частоты (Base Rate Fallacy).',
        en: 'Base Rate Fallacy diagnostics in rare disease and anomaly testing.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Если болезнь встречается у 0.1% людей (P(A) = 0.001), а тест точен на 99%, то при положительном тесте реальная вероятность заболеть составляет лишь ~9%!',
        en: 'If a disease affects 0.1% of people (P(A) = 0.001) and a test is 99% accurate, a positive test result only implies a ~9% actual chance of having the disease.',
      },
    ],
    lessonPath: {
      moduleId: 'probabilistic-models',
      lessonId: 'prob-1-probability-spaces-bayes',
      title: { ru: 'Вероятностные пространства и теорема Байеса', en: 'Probability Spaces & Bayes\' Theorem' },
    },
    tags: ['bayes', 'conditional probability', 'prior', 'posterior', 'likelihood'],
  },
  {
    id: 'kl-divergence',
    term: { ru: 'KL-дивергенция (Расхождение Кульбака — Лейблера)', en: 'Kullback-Leibler (KL) Divergence' },
    englishName: 'Relative Entropy / KL Divergence',
    category: 'statistics',
    formulaLatex: 'D_{\\text{KL}}(P \\parallel Q) = \\sum_{x} P(x) \\ln\\left( \\frac{P(x)}{Q(x)} \\right) = \\mathbb{E}_{x \\sim P}\\left[\\ln P(x) - \\ln Q(x)\\right]',
    formulaDescription: {
      ru: 'P — истинное распределение, Q — модельное (приближающее) распределение.',
      en: 'P is target distribution, Q is model approximation distribution.',
    },
    shortDefinition: {
      ru: 'Асимметричная мера того, насколько распределение вероятностей Q отличается от эталонного распределения P.',
      en: 'Asymmetric statistical distance measuring how much information is lost when distribution Q is used to approximate P.',
    },
    whenToUse: [
      {
        ru: 'Вариационные автокодировщики (VAE): регуляризация скрытого пространства.',
        en: 'Variational Autoencoders (VAE) latent space regularization.',
      },
      {
        ru: 'RLHF и DPO: штраф за уход политики от референсной модели.',
        en: 'RLHF and DPO policy drift penalties.',
      },
      {
        ru: 'Дистилляция знаний (Knowledge Distillation) между Teacher и Student.',
        en: 'Teacher-to-Student knowledge distillation loss.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'KL-дивергенция НЕ является метрикой расстояния: она асимметрична D_KL(P || Q) != D_KL(Q || P) и не удовлетворяет неравенству треугольника.',
        en: 'KL divergence is NOT a true distance metric: it is asymmetric D_KL(P || Q) != D_KL(Q || P) and violates the triangle inequality.',
      },
    ],
    lessonPath: {
      moduleId: 'reinforcement-learning-course',
      lessonId: 'rl-3-modern-llm-rlhf-dpo-grpo',
      title: { ru: 'Современный RL для языковых моделей: RLHF, DPO и GRPO', en: 'Modern LLM RL: RLHF, DPO & GRPO' },
    },
    tags: ['kl', 'kl-divergence', 'entropy', 'vae', 'distillation', 'relative entropy'],
  },

  // ==========================================
  // 8. КЛАССИЧЕСКИЙ ML
  // ==========================================
  {
    id: 'bias-variance-tradeoff',
    term: { ru: 'Дилемма смещения и дисперсии', en: 'Bias-Variance Tradeoff' },
    englishName: 'Bias-Variance Decomposition of Expected Error',
    category: 'classical_ml',
    formulaLatex: '\\mathbb{E}[(y - \\hat{f}(x))^2] = \\text{Bias}^2[\\hat{f}(x)] + \\text{Var}[\\hat{f}(x)] + \\sigma^2',
    formulaDescription: {
      ru: 'Bias^2 — ошибка упрощения (недообучение); Var — чувствительность к выборке (переобучение); sigma^2 — неустранимый шум.',
      en: 'Bias^2 is underfitting error; Var is sensitivity to training data fluctuations (overfitting); sigma^2 is irreducible noise.',
    },
    shortDefinition: {
      ru: 'Фундаментальный компромисс в ML: попытка снизить смещение (усложняя модель) увеличивает дисперсию ее предсказаний.',
      en: 'Fundamental ML tradeoff: reducing bias via higher model complexity inevitably increases prediction variance.',
    },
    whenToUse: [
      {
        ru: 'Бэггинг (Bagging / Random Forest) снижает дисперсию (Variance reduction).',
        en: 'Bagging (Random Forest) reduces model variance through averaging.',
      },
      {
        ru: 'Бустинг (Boosting / GBDT) последовательно снижает смещение (Bias reduction).',
        en: 'Boosting (GBDT) iteratively reduces bias through sequential residual fitting.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Двойной спуск (Double Descent) в современном Deep Learning: при сильной сверхпараметризации тестовая ошибка сначала растет, а затем снова падает.',
        en: 'Modern Double Descent phenomenon: in overparameterized regimes (parameters >> data), test error peaks at the interpolation threshold and then decreases again.',
      },
    ],
    lessonPath: {
      moduleId: 'decision-trees-ensembles',
      lessonId: 'dt-3-random-forest-bagging',
      title: { ru: 'Случайный лес (Random Forest), бэггинг и OOB-оценка', en: 'Random Forest, Bagging & OOB Error' },
    },
    tags: ['bias', 'variance', 'tradeoff', 'overfitting', 'underfitting', 'ансамбли'],
  },
  {
    id: 'gini-impurity',
    term: { ru: 'Критерий Джини (Gini Impurity)', en: 'Gini Impurity (CART Trees)' },
    englishName: 'Gini Impurity Index for Decision Trees',
    category: 'classical_ml',
    formulaLatex: 'G = 1 - \\sum_{k=1}^K p_k^2 = \\sum_{k \\neq j} p_k p_j',
    formulaDescription: {
      ru: 'p_k — доля объектов класса k в узле дерева решений; K — число классов.',
      en: 'p_k is proportion of class k samples in node; K is number of classes.',
    },
    shortDefinition: {
      ru: 'Критерий неоднородности узла в деревьях решений (CART), отражающий вероятность ошибочной классификации при случайном присвоении метки.',
      en: 'Impurity criterion in decision trees measuring probability of misclassifying a randomly chosen element from the node.',
    },
    whenToUse: [
      {
        ru: 'Стандартный критерий расщепления в алгоритме CART и Scikit-learn DecisionTreeClassifier.',
        en: 'Default splitting criterion in Scikit-learn DecisionTreeClassifier and CART algorithm.',
      },
      {
        ru: 'Вычисляется быстрее энтропии Шеннона, так как не требует логарифмов.',
        en: 'Faster to compute than Shannon entropy because it avoids logarithmic operations.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Для чистейшего листа G = 0. При двух равных классах (50/50) G = 0.5, тогда как энтропия равна 1.0.',
        en: 'For a pure node, G = 0. For binary 50/50 split, G = 0.5, while entropy reaches 1.0.',
      },
    ],
    lessonPath: {
      moduleId: 'decision-trees-ensembles',
      lessonId: 'dt-1-cart-split-criteria',
      title: { ru: 'Деревья решений CART: критерии расщепления', en: 'Decision Trees CART: Splitting Criteria' },
    },
    tags: ['gini', 'decision tree', 'cart', 'impurity', 'дерево решений'],
  },
  {
    id: 'cosine-similarity',
    term: { ru: 'Косинусное сходство (Cosine Similarity)', en: 'Cosine Similarity & Distance' },
    englishName: 'Cosine Similarity & Cosine Distance',
    category: 'classical_ml',
    formulaLatex: '\\text{sim}(u, v) = \\frac{u \\cdot v}{\\|u\\|_2 \\|v\\|_2} = \\frac{\\sum_{i=1}^d u_i v_i}{\\sqrt{\\sum u_i^2} \\cdot \\sqrt{\\sum v_i^2}}, \\quad d_{\\cos} = 1 - \\text{sim}(u, v)',
    formulaDescription: {
      ru: 'u, v — векторы признаков или эмбеддингов. Значения sim in [-1, 1].',
      en: 'u, v are feature vectors or dense embeddings. Range is [-1, 1].',
    },
    shortDefinition: {
      ru: 'Косинус угла между двумя векторами, измеряющий совпадение их направления независимо от их длины.',
      en: 'Cosine of the angle between two multi-dimensional vectors, measuring directional orientation regardless of magnitude.',
    },
    whenToUse: [
      {
        ru: 'Векторный поиск (Vector Search / RAG), сравнение семантических текстовых эмбеддингов.',
        en: 'Vector databases (RAG), dense embedding retrieval (OpenAI, BGE, Cohere).',
      },
      {
        ru: 'Рекомендательные системы (Collaborative Filtering).',
        en: 'Collaborative filtering and item-item recommendation similarity.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Если векторы L2-нормализованы к единице, косинусное сходство равно обычному скалярному произведению (Dot Product).',
        en: 'When vectors are L2-normalized to unit norm (||u|| = 1), cosine similarity equals standard dot product u . v.',
      },
    ],
    lessonPath: {
      moduleId: 'metric-methods',
      lessonId: 'metric-1-knn-metrics',
      title: { ru: 'Метрические пространства и метод kNN', en: 'Metric Spaces & k-Nearest Neighbors (kNN)' },
    },
    tags: ['cosine', 'embeddings', 'vector search', 'rag', 'сходство'],
  },

  // ==========================================
  // 9. БЕЗОПАСНОСТЬ, ЭТИКА & MLOPS
  // ==========================================
  {
    id: 'prompt-injection',
    term: { ru: 'Промпт-инъекция (Prompt Injection)', en: 'Prompt Injection (Direct & Indirect)' },
    englishName: 'Direct & Indirect Prompt Injection Attacks',
    category: 'safety_mlops',
    formulaLatex: '\\text{Risk}: \\; \\text{LLM}(\\text{SystemPrompt} \\oplus \\text{UntrustedInput}) \\to \\text{AdversarialControl}',
    formulaDescription: {
      ru: 'Эксплуатация отсутствия строгого разделения между управляющими инструкциями и пользовательскими данными в LLM.',
      en: 'Exploitation of unified data-instruction streams in LLM architectures.',
    },
    shortDefinition: {
      ru: 'Уязвимость систем на базе LLM, при которой злоумышленник внедряет текст, переопределяющий исходные системные инструкции модели.',
      en: 'Vulnerability where adversarial input overrides developer system instructions, hijacking model behavior.',
    },
    whenToUse: [
      {
        ru: 'Прямая атака (Jailbreak): попытка заставить модель игнорировать правила безопасности.',
        en: 'Direct jailbreaking: instructing the model to bypass safety guardrails.',
      },
      {
        ru: 'Косвенная инъекция (Indirect): скрытые инструкции внутри веб-страниц или документов, читаемых агентом.',
        en: 'Indirect prompt injection: hostile instructions embedded in third-party web pages or documents accessed via tools.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Защита в глубину: валидация схемы вывода (Structured Outputs), изоляция прав инструментов (Tool Sandboxing), внешние классификаторы (Llama Guard).',
        en: 'Defense-in-depth: structured schema outputs (Pydantic), tool privilege separation, and dedicated guardrail models (Llama Guard).',
      },
    ],
    lessonPath: {
      moduleId: 'ai-safety-ethics-course',
      lessonId: 'safe-2-prompt-injection-redteaming',
      title: { ru: 'Безопасность LLM: Prompt Injection и Red Teaming', en: 'LLM Security: Prompt Injection & Red Teaming' },
    },
    tags: ['prompt injection', 'security', 'jailbreak', 'llm', 'red teaming', 'безопасность'],
  },
  {
    id: 'differential-privacy',
    term: { ru: 'Дифференциальная приватность', en: '(ε, δ)-Differential Privacy' },
    englishName: '(ε, δ)-Differential Privacy (Dwork et al.)',
    category: 'safety_mlops',
    formulaLatex: 'P(\\mathcal{M}(D_1) \\in S) \\le e^{\\epsilon} \\cdot P(\\mathcal{M}(D_2) \\in S) + \\delta',
    formulaDescription: {
      ru: 'D_1 и D_2 — две соседние базы данных, отличающиеся ровно на одну запись пользователя; epsilon — бюджет приватности.',
      en: 'D_1 and D_2 are adjacent datasets differing by one record; epsilon is privacy budget.',
    },
    shortDefinition: {
      ru: 'Математически строгий стандарт анонимизации, гарантирующий, что присутствие одного человека в датасете не повлияет на результат модели.',
      en: 'Rigorous mathematical privacy guarantee ensuring that adding or removing a single individual has negligible impact on algorithm output.',
    },
    whenToUse: [
      {
        ru: 'Обучение нейросетей на конфиденциальных медицинских и финансовых данных с помощью DP-SGD.',
        en: 'Training models on confidential medical or financial records using Differentially Private SGD (DP-SGD).',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Чем меньше epsilon, тем сильнее зашумление и выше приватность, но ниже итоговая точность (Privacy-Utility Tradeoff).',
        en: 'Smaller epsilon means stronger privacy via higher noise injection, trading off downstream model utility (Privacy-Utility Tradeoff).',
      },
    ],
    lessonPath: {
      moduleId: 'ai-safety-ethics-course',
      lessonId: 'safe-3-data-privacy-differential',
      title: { ru: 'Приватность данных: Differential Privacy и DP-SGD', en: 'Data Privacy: Differential Privacy & DP-SGD' },
    },
    tags: ['differential privacy', 'privacy', 'dp-sgd', 'epsilon', 'анонимизация'],
  },
  {
    id: 'data-drift',
    term: { ru: 'Data Drift и Concept Drift', en: 'Data Drift & Concept Drift' },
    englishName: 'Covariate Shift vs Concept Drift',
    category: 'safety_mlops',
    formulaLatex: '\\text{Data Drift}: P_t(X) \\neq P_{t-1}(X), \\; P(Y \\mid X) = \\text{const}; \\quad \\text{Concept Drift}: P_t(Y \\mid X) \\neq P_{t-1}(Y \\mid X)',
    formulaDescription: {
      ru: 'Data Drift (ковариатный сдвиг) — изменились входные признаки; Concept Drift — изменилась сама связь признаков с целевой переменной.',
      en: 'Data Drift is a shift in feature distribution P(X); Concept Drift is a change in the mapping P(Y | X).',
    },
    shortDefinition: {
      ru: 'Деградация качества ML-модели в проде из-за сдвига распределения признаков (Data Drift) или изменения паттерна поведения целевой метки (Concept Drift).',
      en: 'Production ML performance decay caused by shifts in input distributions (Data Drift) or fundamental changes in underlying relationships (Concept Drift).',
    },
    whenToUse: [
      {
        ru: 'Мониторинг моделей в проде: метрики PSI (Population Stability Index), тест Колмогорова-Смирнова (KS-test).',
        en: 'Production monitoring using Population Stability Index (PSI) and Kolmogorov-Smirnov test (KS-test).',
      },
      {
        ru: 'Автоматический триггер для переобучения моделей (Retraining Pipeline).',
        en: 'Automated triggering of continuous model retraining pipelines.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'Пример Concept Drift: покупательские привычки людей кардинально изменились в период пандемии при тех же ценах и товарах.',
        en: 'Classic Concept Drift example: consumer purchasing patterns shift abruptly during macroeconomic crises despite identical product features.',
      },
    ],
    lessonPath: {
      moduleId: 'mlops-production-pipeline',
      lessonId: 'mlops-4-monitoring-drift',
      title: { ru: 'Мониторинг моделей: обнаружение Data & Concept Drift', en: 'Model Monitoring: Data & Concept Drift Detection' },
    },
    tags: ['drift', 'data drift', 'concept drift', 'mlops', 'monitoring', 'psi'],
  },
  {
    id: 'quantization-affine',
    term: { ru: 'Квантование нейросетей (INT8 PTQ)', en: 'Neural Network Quantization (INT8 PTQ)' },
    englishName: 'Affine (Asymmetric) & Symmetric INT8 Quantization',
    category: 'regularization',
    formulaLatex: 'q = \\text{clip}\\left( \\left\\lfloor \\frac{x}{S} \\right\\rceil + Z, \\; -128, \\; 127 \\right), \\quad S = \\frac{x_{\\max} - x_{\\min}}{255}, \\quad Z = \\text{round}\\left(-\\frac{x_{\\min}}{S}\\right) - 128',
    formulaDescription: {
      ru: 'S — масштаб (Scale), Z — нулевая точка (Zero-point), q — 8-битный квантованный вес.',
      en: 'S is scale, Z is zero-point, q is 8-bit quantized integer.',
    },
    shortDefinition: {
      ru: 'Сжатие весов и активаций нейросетей из формата FP32/FP16 в целочисленный INT8/INT4 для 2-4 кратного сокращения видеопамяти и ускорения инференса.',
      en: 'Compressing model weights and activations from FP32/FP16 into INT8/INT4, slashing memory footprint by 2-4x and accelerating inference.',
    },
    whenToUse: [
      {
        ru: 'Инференс больших языковых моделей (LLM) на GPU и edge-устройствах (AWQ, GPTQ, GGUF, bitsandbytes).',
        en: 'High-throughput LLM serving and edge deployment (AWQ, GPTQ, GGUF, bitsandbytes).',
      },
      {
        ru: 'Устранение бутылочного горлышка пропускной способности памяти (Memory Bandwidth Bottleneck).',
        en: 'Overcoming memory bandwidth bottlenecks in memory-bound autoregressive decoding.',
      },
    ],
    interviewCaveats: [
      {
        ru: 'PTQ (Post-Training Quantization) квантует готовую модель без обучения. QAT (Quantization-Aware Training) моделирует ошибку округления во время обучения.',
        en: 'PTQ quantizes weights after training without gradient updates. QAT simulates rounding errors during training via fake quantization to preserve precision.',
      },
    ],
    lessonPath: {
      moduleId: 'model-optimization-inference',
      lessonId: 'opt-1-quantization-ptq-qat',
      title: { ru: 'Квантование нейросетей: PTQ, QAT и форматы LLM', en: 'Neural Quantization: PTQ, QAT & LLM Formats' },
    },
    tags: ['quantization', 'int8', 'ptq', 'qat', 'gguf', 'awq', 'квантование', 'сжатие'],
  },
];
