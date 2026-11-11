import { ModuleMeta, Lesson, Card, QuizQuestion } from '@/shared/lib/schemas';

export const aiAssistedDevMeta: ModuleMeta = {
  id: 'ai-assisted-dev-agents',
  title: {
    ru: 'AI в разработке: Терминал, IDE, Агенты и Harness',
    en: 'AI-Assisted Dev: Terminal, IDE, Agents & Evaluation Harness',
  },
  description: {
    ru: 'Современный инструментарий разработчика с ИИ: терминальные агенты (Claude Code, Aider, OpenCode), IDE-интеграции (Codex, Copilot), протокол MCP, паттерны ReAct и Tool Use, тестовые и бенчмарк-обвязки (DeepSeek Harness, Antigravity, SWE-bench).',
    en: 'Modern AI developer workflows: terminal CLI agents (Claude Code, Aider, OpenCode), IDE assistants (Codex, Copilot), Model Context Protocol (MCP), ReAct tool-use patterns, and agent evaluation harnesses (DeepSeek Harness, Antigravity, SWE-bench).',
  },
  order: 15,
  icon: 'ai-assisted-dev-agents',
  estimatedMinutes: 90,
  isPlaceholder: false,
};

export const aiAssistedDevLessons: Lesson[] = [
  {
    id: 'ai-dev-1-ide-terminal',
    moduleId: 'ai-assisted-dev-agents',
    title: {
      ru: 'Эволюция AI в разработке: от автокомплита к CLI-агентам (Claude Code, Codex, Aider)',
      en: 'Evolution of AI in Development: From Autocomplete to CLI Agents (Claude Code, Codex, Aider)',
    },
    order: 1,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### От подсказок в редакторе к автономным инженерам
За последние годы роль искусственного интеллекта в разработке программного обеспечения прошла три фундаментальных этапа:
1. **Инлайн-автодополнение (2021–2023):** GitHub Copilot, OpenAI Codex. Модели дописывают следующую строчку или тело функции на основе локального файла.
2. **Чат в IDE (2023–2024):** Cursor, Windsurf, Copilot Chat. Разработчик общается в боковой панели, модель видит открытые вкладки и может вносить точечные правки.
3. **Терминальные автономные CLI-агенты (2025–2026):** **Claude Code**, **Aider**, **OpenCode**, **Codex CLI**. Агент живет прямо в bash-терминале, индексирует весь репозиторий через Git, читает логи компилятора, сам запускает тесты и автоматически фиксит ошибки.

---

#### 1. Почему терминал побеждает чат в браузере?
Терминальные агенты обладают суперсилой: они находятся в одном процессе с вашей операционной системой и кодовой базой.
* **Доступ к Git:** Агент смотрит \`git status\`, формирует чистые атомарные коммиты и создает ветки.
* **Быстрый семантический поиск:** Использование инструментов вроде \`ripgrep\` (\`rg\`) и \`find\` для мгновенного нахождения объявлений классов и вызовов функций в миллионах строк кода без забивания контекстного окна мусором.
* **Feedback Loop (Обратная связь):** Агент написал код -> запустил \`npm test\` или \`pytest\` -> увидел Traceback -> сам исправил ошибку без участия человека.

---

#### 2. Архитектура Claude Code и терминальных инструментов
\`\`\`bash
# Типичный вызов Claude Code в терминале разработчика
claude "Добавь эндпоинт /api/v1/metrics с подсчетом активных сессий и покрой pytest тестами"
\`\`\`
Что происходит под капотом:
1. **Repository Map (Карта репозитория):** Агент строит AST (абстрактное синтаксическое дерево) ключевых файлов проекта (с помощью tree-sitter), чтобы понимать сигнатуры функций и типы данных всего проекта в пределах ~10-20k токенов.
2. **Diff Patch Engine:** Модель возвращает изменения не в виде полной перезаписи файла, а в виде компактного Unified Diff (\`git diff\`). Это экономит 90% исходящих токенов и гарантирует отсутствие случайного удаления соседних функций.
3. **Безопасность выполнения:** Команды \`git commit\`, \`rm\` или сетевые запросы требуют явного подтверждения разработчика или выполняются в изолированном Sandbox-контейнере.
`,
      en: `### From Inline Autocomplete to Autonomous CLI Agents
AI programming tools evolved through three waves: inline completion (Copilot/Codex), IDE sidecar chat (Cursor), and terminal CLI agents (Claude Code, Aider, OpenCode).

---

#### 1. Why Terminal Agents Outperform Browser Chats
Terminal-resident agents share execution context with your OS and build environment:
* Native git workflow (staging, atomic commits, diff inspection).
* Instant codebase indexing via AST graphs and ripgrep.
* Tight test feedback loops: write code -> run test suite -> parse traceback -> self-heal.

---

#### 2. Architecture & Unified Diffs
Agents emit compact unified diffs rather than entire file rewrites, preserving code hygiene and minimizing token consumption.
`,
    },
    commonMistakes: [
      {
        ru: 'Копирование всего содержимого гигантских файлов в веб-чат вручную вместо использования CLI-агента с автоматическим поиском по AST и ripgrep.',
        en: 'Pasting entire megabyte files into web chat interfaces manually instead of letting CLI agents leverage semantic AST maps and ripgrep.',
      },
      {
        ru: 'Слепое принятие масштабных правок без предварительного просмотра git diff (агент может случайно удалить неявные зависимости или комментарии).',
        en: 'Blindly accepting multi-file rewrites without inspecting git diffs for dropped edge cases or side-effects.',
      },
      {
        ru: 'Запуск CLI-агента без настроенного тестового набора (без pytest/jest агент не может объективно верифицировать правильность своего решения).',
        en: 'Running autonomous agents on projects devoid of automated tests, eliminating the self-verification feedback loop.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-aidev-1-1',
        question: {
          ru: 'Какое главное преимущество терминальных CLI-агентов (таких как Claude Code или Aider) перед веб-чатами с ИИ?',
          en: 'What is the primary advantage of terminal CLI agents (like Claude Code or Aider) over browser-based AI chats?',
        },
        options: [
          'Прямой доступ к терминалу: агент может сам запускать линтеры, выполнять тесты и итерироваться по ошибкам компиляции',
          'Они вообще не используют нейросети и работают быстрее',
          'Они требуют отключения интернета и локальной базы данных',
          'Они могут редактировать только один файл за раз',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Терминальный агент имеет замкнутый цикл обратной связи (Feedback Loop): он сам пишет код, запускает тесты (pytest, vitest) и в случае падения ошибки видит реальный traceback и чинит его.',
          en: 'CLI agents run inside the dev environment, allowing an autonomous feedback loop: write code -> run compiler/tests -> inspect real runtime traces -> fix.',
        },
      },
      {
        id: 'q-aidev-1-2',
        question: {
          ru: 'Зачем в современных AI-агентах для редактирования кода используются Unified Diffs вместо отправки файла целиком?',
          en: 'Why do modern code agents use Unified Diffs instead of returning whole file contents?',
        },
        options: [
          'Diffs кардинально экономят исходящие токены, работают быстрее и минимизируют риск случайного затирания соседнего кода',
          'Diffs позволяют коду компилироваться без интерпретатора Python',
          'Модели не умеют генерировать текст длиннее 100 символов',
          'Это требуется стандартами операционной системы Windows',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Передача только изменений (diff) экономит до 90% токенов генерации, снижает задержку и предотвращает случайное удаление несвязанных функций из файла.',
          en: 'Returning diff hunks saves token bandwidth, reduces latency, and prevents accidental deletion of unmodified surrounding functions.',
        },
      },
      {
        id: 'q-aidev-1-3',
        question: {
          ru: 'Что такое Repository Map (карта репозитория) в архитектуре кодинг-агентов (например, в Aider или OpenCode)?',
          en: 'What is a Repository Map in coding agent architectures (e.g. Aider or OpenCode)?',
        },
        options: [
          'Компактный граф сигнатур классов, функций и их зависимостей, построенный с помощью AST-парсера (tree-sitter), помещающийся в контекст LLM',
          'Географическая карта серверов GitHub',
          'Список всех паролей и API-ключей в репозитории',
          'Архив скомпилированных бинарных файлов проекта',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Repo Map парсит репозиторий через tree-sitter, извлекая только сигнатуры функций, имена классов и связи, что дает модели панорамное понимание архитектуры всего проекта при минимальном расходе токенов.',
          en: 'A Repo Map extracts abstract syntax tree (AST) signatures across all files, giving the LLM a condensed structural overview without loading raw bodies.',
        },
      },
    ],
  },
  {
    id: 'ai-dev-2-prompting-structured',
    moduleId: 'ai-assisted-dev-agents',
    title: {
      ru: 'Промпт-инжиниринг и API для разработчиков: System Prompts, CoT и Structured Outputs',
      en: 'Prompt Engineering & Dev APIs: System Prompts, CoT & Structured Outputs',
    },
    order: 2,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: {
      ru: `### Программирование LLM: от текста к надежным структурам данных
При интеграции больших языковых моделей в реальные приложения или микросервисы критически важно получать детерминированные, валидные структуры данных вместо свободного художественного текста.

---

#### 1. Анатомия эффективного системного промпта (System Prompt)
Системный промпт задает роль, ограничения и поведенческий контракт модели.
* **Роль и экспертиза:** Четкое определение уровня знаний (например, «Ты Senior Staff Python-инженер, специализирующийся на asyncio и high-load»).
* **Негативные ограничения (Negative Constraints):** Что модели **запрещено** делать (например, «Никогда не используй устаревший синтаксис typing.Optional, используй объединения \`A | None\`»).
* **Output Format:** Указание вернуть строго JSON без вступительных слов («Here is your code:») и без markdown-блоков, если ожидается raw-ответ.

---

#### 2. Chain-of-Thought (CoT) и скрытые рассуждения
При решении сложных алгоритмических задач прямая генерация ответа часто приводит к логическим галлюцинациям.
* **Техника «Подумай шаг за шагом»:** Модели дается пространство для рассуждений до генерации финального ответа. В современных Reasoning-моделях (o1, o3, DeepSeek-R1) этот процесс скрыт в специальном блоке \`<thought>...\` и оптимизирован через Reinforcement Learning (RL).
* **Паттерн Scratchpad (Черновик):** Разработчик явно просит модель сначала выписать ключевые инварианты и крайние случаи (Edge Cases), и только затем писать реализацию.

---

#### 3. Structured Outputs и Pydantic Schema
Современные API (OpenAI, Gemini, Anthropic) поддерживают принудительное соответствие JSON-схеме на уровне механизма генерации (Grammar-guided decoding). Модель физически не может сгенерировать токен, нарушающий грамматику схемы!

\`\`\`python
from pydantic import BaseModel, Field
from typing import List

class CodeReviewIssue(BaseModel):
    file_path: str = Field(description="Путь к файлу")
    line_number: int = Field(description="Номер строки с ошибкой")
    severity: str = Field(description="Уровень критичности: low | medium | critical")
    suggestion: str = Field(description="Рекомендация по исправлению")

class CodeReviewReport(BaseModel):
    summary: str
    total_issues: int
    issues: List[CodeReviewIssue]

# При вызове через API:
# response = client.beta.chat.completions.parse(
#     model="gpt-4o",
#     messages=[{"role": "user", "content": code_diff}],
#     response_format=CodeReviewReport,
# )
\`\`\`
*Преимущество:* 100% гарантия валидного JSON, отсутствие поломок при десериализации в Pydantic-модели бэкенда.
`,
      en: `### LLM Programming: System Prompts, Reasoning & Structured Outputs
Reliable AI services require deterministic data structures over unstructured prose.

---

#### 1. System Prompt Engineering
Establishes role authority, operational domain constraints, negative invariants, and schema expectations.

---

#### 2. Chain-of-Thought & Reasoning Models
Decomposes complex logic into intermediate reasoning steps, either prompted or natively reinforced (DeepSeek-R1, o-series).

---

#### 3. Guaranteed Structured Outputs
Grammar-guided decoding enforces exact Pydantic/JSON schemas directly at token generation time, eliminating parsing exceptions.
`,
    },
    commonMistakes: [
      {
        ru: 'Парсинг JSON из ответа модели регулярными выражениями вместо использования официального режима Structured Outputs / response_format: json_schema.',
        en: 'Using brittle regex to extract JSON from markdown wrappers instead of leveraging native API Structured Outputs with schema enforcement.',
      },
      {
        ru: 'Перегрузка промпта сотней противоречивых инструкций («будь креативным, но абсолютно точным и кратким»), что расфокусирует внимание модели.',
        en: 'Overloading prompts with contradictory behavioral directives, diluting model attention.',
      },
      {
        ru: 'Игнорирование обработки кодов ошибок 429 (Rate Limit) и сетевых тайм-аутов при вызовах LLM (обязателен Exponential Backoff).',
        en: 'Omitting exponential backoff retry logic for HTTP 429 rate limit responses.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-aidev-2-1',
        question: {
          ru: 'Каким образом режим Structured Outputs в современных API гарантирует валидность сгенерированного JSON?',
          en: 'How does Structured Outputs mode in modern APIs guarantee JSON schema validity?',
        },
        options: [
          'На уровне декодирования токенов маскируются все токены, которые нарушают грамматику заданной JSON-схемы',
          'Модель просто читает учебник по JSON перед каждым запросом',
          'Сервер отправляет запрос повторно 100 раз, пока случайно не получится правильный JSON',
          'JSON генерируется сторонней библиотекой Python без участия нейросети',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'В Structured Outputs используется Grammar-Guided Decoding: движок инференса на каждом шаге маскирует логиты недопустимых токенов, физически не позволяя модели нарушить структуру схемы.',
          en: 'Grammar-guided decoding applies state-machine token masking during sampling, making syntactic schema violations mathematically impossible.',
        },
      },
      {
        id: 'q-aidev-2-2',
        question: {
          ru: 'В чем заключается фундаментальная польза Chain-of-Thought (рассуждения шаг за шагом) перед прямой генерацией ответа?',
          en: 'What is the fundamental benefit of Chain-of-Thought reasoning over zero-shot direct answers?',
        },
        options: [
          'Модель распределяет вычислительные ресурсы на промежуточные шаги логики, снижая риск ошибок в сложных выводах',
          'Модель тратит меньше оперативной памяти на сервере',
          'Ответ генерируется в три раза быстрее',
          'Это позволяет запускать модели вообще без электричества',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Трансформер выполняет фиксированное число матричных умножений на каждый сгенерированный токен. Генерация промежуточных рассуждений дает модели дополнительную вычислительную емкость для проверки гипотез.',
          en: 'Transformers perform a fixed amount of computation per token. Generating reasoning steps allows the model to allocate more compute to complex inference.',
        },
      },
      {
        id: 'q-aidev-2-3',
        question: {
          ru: 'Какую стратегию повторных запросов (retry) необходимо использовать при получении от LLM API ошибки HTTP 429 (Rate Limit Exceeded)?',
          en: 'Which retry strategy should be used when receiving an HTTP 429 (Rate Limit) from an LLM API?',
        },
        options: [
          'Экспоненциальное откладывание со случайным джиттером (Exponential Backoff with Jitter)',
          'Бесконечный цикл while True с немедленным повтором запроса без пауз',
          'Немедленное удаление базы данных проекта',
          'Перезагрузка физического сервера',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Exponential Backoff с джиттером увеличивает интервалы между попытками (1s, 2s, 4s, 8s...) со случайным сдвигом, снижая пиковую нагрузку на провайдера и устраняя Thundering Herd эффект.',
          en: 'Exponential backoff with jitter spreads retry intervals progressively, preventing synchronized retry spikes (thundering herd).',
        },
      },
    ],
  },
  {
    id: 'ai-dev-3-agents-tools-mcp',
    moduleId: 'ai-assisted-dev-agents',
    title: {
      ru: 'Автономные агенты, вызов инструментов (Tool Use) и протокол MCP',
      en: 'Autonomous Agents, Tool Calling & the Model Context Protocol (MCP)',
    },
    order: 3,
    estimatedMinutes: 25,
    draft: false,
    theoryMarkdown: {
      ru: `### Анатомия AI-Агента: ReAct и вызов внешних инструментов
Простая языковая модель заперта в рамках своих весов: она не знает текущего времени, не видит ваш приватный код и не может выполнить скрипт. **Агент** превращает LLM в систему принятия решений, подключенную к внешнему миру через инструменты (Tools).

---

#### 1. Цикл ReAct (Reasoning + Acting)
Паттерн ReAct (Yao et al.) объединяет рассуждение модели и выполнение действий в интерактивный цикл:
1. **Thought (Мысль):** Модель анализирует текущую цель и состояние среды: *«Мне нужно найти, где определена функция calculate_loss. Для этого я использую инструмент поиска по файлам».*
2. **Action (Действие):** Модель формирует вызов инструмента (Tool Call) в виде JSON: \`{"tool": "ripgrep", "args": {"pattern": "def calculate_loss"}}\`.
3. **Observation (Наблюдение):** Среда выполнения (Sandbox/Terminal) выполняет команду и возвращает реальный вывод обратно в контекст модели: *«src/models/loss.py:42: def calculate_loss(y_pred, y_true):»*.
4. **Повторение:** Цикл повторяется до достижения цели (\`Finish\`).

---

#### 2. Протокол MCP (Model Context Protocol от Anthropic)
Раньше каждый сервис писал собственные кастомные плагины для подключения инструментов к моделям. **MCP (Model Context Protocol)** — открытый стандарт индустрии (как USB-C для AI):
* **MCP Client:** Среда разработки (например, Claude Code, Cursor, Zed, Goose).
* **MCP Server:** Легковесный процесс, предоставляющий стандартизированный доступ к данным или действиям (например, MCP-сервер для PostgreSQL, GitHub, GitLab, Brave Search, Filesystem).
* **Принцип работы:** Клиент запускает MCP-сервер через stdio или SSE (Server-Sent Events), запрашивает манифест доступных инструментов и безопасно проксирует вызовы.

\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/mldb"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
    }
  }
}
\`\`\`

---

#### 3. Безопасность и песочницы (Sandboxing)
Предоставление агенту доступа к терминалу несет серьезные риски (галлюцинация команды \`rm -rf /\`, утечка секретов через \`curl\`).
* **Контейнеризация:** Выполнение опасных действий в одноразовых Docker-контейнерах или микро-ВМ (Firecracker).
* **Human-in-the-Loop:** Требование явного подтверждения разработчика на деструктивные действия (удаление файлов, пуш в \`main\`, транзакции в БД).
`,
      en: `### Autonomous Agents, Tool Calling & the Model Context Protocol (MCP)
An agent turns an LLM into an active problem-solving engine connected to real tools.

---

#### 1. ReAct Pattern (Reason + Act + Observe)
Iterative loop: Thought -> Action (Tool Call JSON) -> Observation (Execution result) -> Repeat until task completion.

---

#### 2. Model Context Protocol (MCP)
Anthropic's open standard unifying tool and data connectivity. MCP clients (Claude Code, IDEs) interface with MCP servers (Postgres, GitHub, Filesystem) over stdio or SSE.

---

#### 3. Security & Sandboxing
Running arbitrary agent-generated code requires Docker/Firecracker isolation and human confirmation on destructive actions.
`,
    },
    commonMistakes: [
      {
        ru: 'Запуск автономных агентов с правами суперпользователя (root) на рабочей машине без контейнерной изоляции.',
        en: 'Running unconstrained autonomous agents as root on bare-metal host machines without sandboxing.',
      },
      {
        ru: 'Бесконечный зацикленный вызов инструментов (Agent Loop): отсутствие жесткого лимита максимального числа итераций (max_iterations) приводит к исчерпанию баланса API.',
        en: 'Failing to enforce maximum iteration limits on agent loops, risking infinite recursion and runaway API bills.',
      },
      {
        ru: 'Перегрузка контекста огромными сырыми выводами команд (например, вывод cat на 50 000 строк вместо grep или постраничного чтения).',
        en: 'Flooding agent context windows with massive command outputs instead of targeted grep or pagination.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-aidev-3-1',
        question: {
          ru: 'Какова последовательность шагов в классическом агентном цикле ReAct?',
          en: 'What is the sequence of steps in the classical ReAct agent loop?',
        },
        options: [
          'Thought (Рассуждение) -> Action (Вызов инструмента) -> Observation (Получение результата из среды) -> Повторение',
          'Deploy -> Delete -> Restart -> Sleep',
          'Training -> Quantization -> Pruning -> Inference',
          'Commit -> Push -> Merge -> Rebase',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'ReAct расшифровывается как Reasoning + Acting: модель формулирует мысль (Thought), выбирает действие/инструмент (Action), получает вывод команды (Observation) и повторяет шаг до решения задачи.',
          en: 'ReAct stands for Reasoning + Acting, operating in a continuous loop: formulate thought -> trigger tool action -> observe environment output -> repeat.',
        },
      },
      {
        id: 'q-aidev-3-2',
        question: {
          ru: 'Что представляет собой протокол MCP (Model Context Protocol), представленный Anthropic?',
          en: 'What is the Model Context Protocol (MCP) introduced by Anthropic?',
        },
        options: [
          'Открытый стандарт для единообразного подключения AI-агентов к внешним инструментам, базам данных и сервисам (через клиент-серверную архитектуру)',
          'Новый язык программирования для замены Python',
          'Протокол шифрования Wi-Fi сетей',
          'Специальный видеокодек для сжатия фильмов',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'MCP стандартизирует способ, которым LLM-клиенты (Claude Code, IDE) обнаруживают и вызывают инструменты внешних серверов (БД, репозитории, API), устраняя необходимость писать кастомные коннекторы под каждого провайдера.',
          en: 'MCP is an open standard that decouples AI models from proprietary integrations, providing a standard interface for tools, prompts, and resources.',
        },
      },
      {
        id: 'q-aidev-3-3',
        question: {
          ru: 'Какая мера предосторожности критически необходима для предотвращения зависания и бесконечных затрат токенов в агентных системах?',
          en: 'Which safeguard is essential to prevent infinite hangs and runaway token costs in agent loops?',
        },
        options: [
          'Установка жесткого лимита максимального числа шагов (max_iterations / max_turns) и лимита на бюджет токенов',
          'Запрет на использование циклов for в коде агента',
          'Запуск агента только по выходным дням',
          'Отказ от использования функций логирования',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Без лимита max_iterations агент, столкнувшись с циклической ошибкой (например, падающим тестом), может уйти в бесконечный цикл правок, исчерпав весь бюджет API.',
          en: 'Enforcing maximum iteration bounds and token budgets prevents agents from getting trapped in infinite failure loops.',
        },
      },
    ],
  },
  {
    id: 'ai-dev-4-harness-benchmarks',
    moduleId: 'ai-assisted-dev-agents',
    title: {
      ru: 'Тестовые обвязки (Harness), Antigravity, DeepSeek Harness и SWE-bench',
      en: 'Evaluation Harnesses, Antigravity, DeepSeek Harness & SWE-bench',
    },
    order: 4,
    estimatedMinutes: 20,
    draft: false,
    theoryMarkdown: {
      ru: `### Как объективно измерить силу кодинг-агента: Мир Evaluation Harness
В сфере разработки AI-агентов фразы «эта модель кажется умнее» не имеют ценности. В индустрии принят подход строгого бенчмаркинга через **Evaluation Harness (испытательный стенд / обвязку)**.

---

#### 1. Что такое Harness (Тестовая обвязка)?
**Harness** — это программная инфраструктура, которая:
1. Берет реальную задачу (например, реальный Issue из репозитория Django, SymPy или PyTorch).
2. Разворачивает изолированное чистое окружение (Docker-контейнер с нужной версией Python и установленными зависимостями).
3. Передает задачу агенту (Antigravity, DeepSeek Harness, SWE-agent, Claude Code).
4. Записывает все действия агента (bash-команды, правки файлов, git commit).
5. Применяет созданный агентом git-патч к кодовой базе.
6. Запускает скрытый набор интеграционных тестов (Fail-to-Pass тесты), проверяя, решена ли проблема и не сломался ли старый функционал (Pass-to-Pass).
7. Выдает объективный бинарный вердикт: **RESOLVED** или **FAILED**.

---

#### 2. Золотой стандарт: SWE-bench
**SWE-bench (Software Engineering Benchmark)** — эталонный академический и индустриальный бенчмарк, составленный из 2 294 реальных Pull Request и Issues из 12 популярнейших Python open-source репозиториев (scikit-learn, django, sympy, requests и др.).
* **SWE-bench Verified:** Человечески верифицированное подмножество из 500 задач с однозначными описаниями и надежными тестами.
* **Метрика Resolve Rate:** Доля задач, в которых созданный агентом патч успешно прошел все тесты. Если в 2023 году модели решали < 2% задач, то в 2025–2026 году ведущие системы (Claude / Claude Code, DeepSeek / DeepSeek Harness, Antigravity) преодолели планку 50–70%+.

---

#### 3. DeepSeek Harness и специализированные стенды
Команда DeepSeek при обучении моделей DeepSeek-V3 и DeepSeek-R1 разработала собственные высокоскоростные Harness-обвязки:
* **Среды изоляции:** Тысячи параллельных легковесных песочниц, выполняющих компиляцию кода за миллисекунды.
* **RL-Reward на основе тестов:** В процессе Reinforcement Learning модель получает положительную награду (Reward) только тогда, когда сгенерированный код компилируется без ошибок и проходит 100% модульных тестов.
* **Агентные паттерны Antigravity:** Архитектуры, разделяющие планировщика (Planner), исследователя кодовой базы (Explorer) и верификатора тестов (Verifier) для минимизации регрессий.

\`\`\`
[Issue / Задача] ──> [Harness: Создание Docker]
                            │
                            ▼
                     [Agent Loop] ◄───► [Sandbox Bash/Edit]
                            │ (Patch generated)
                            ▼
                     [Git Apply Patch]
                            │
                            ▼
              [Run Pytest: Fail-to-Pass]
                     ├── PASS ──> [RESOLVED (100%)]
                     └── FAIL ──> [FAILED (0%)]
\`\`\`
`,
      en: `### Measuring Coding Agents: Evaluation Harnesses & SWE-bench
Subjective impressions have no place in agent engineering; automated Evaluation Harnesses deliver rigorous benchmarks.

---

#### 1. What is an Agent Evaluation Harness?
An automated test rig that:
* Spins up isolated, reproducible Docker sandbox environments.
* Feeds task specifications/issues to the agent.
* Captures generated git patches.
* Runs hidden test suites (Fail-to-Pass and Pass-to-Pass).
* Outputs a deterministic RESOLVED/FAILED scorecard.

---

#### 2. SWE-bench & SWE-bench Verified
The industry gold standard evaluating agents on real-world GitHub issues from major repositories (django, sympy, scikit-learn).

---

#### 3. DeepSeek Harness & Test-Driven Reinforcement Learning
Test execution outputs serve directly as automated reward signals in RL training loops for models like DeepSeek-R1.
`,
    },
    commonMistakes: [
      {
        ru: 'Тестирование патчей агента на той же машине без изоляции (агент может случайно удалить зависимости или пропатчить глобальное системное окружение).',
        en: 'Running agent test evaluations without container isolation, risking host corruption.',
      },
      {
        ru: 'Проверка только тех тестов, которые написал сам агент (агент может подогнать тесты под свой ошибочный код вместо прохождения эталонного теста).',
        en: 'Evaluating agents only on self-authored unit tests rather than hidden, ground-truth reference test suites.',
      },
      {
        ru: 'Смешение тестов: необходимо проверять не только исправление бага (Fail-to-Pass), но и сохранение работоспособности всей остальной системы (Pass-to-Pass).',
        en: 'Checking only bug resolution while ignoring regression tests across existing project features.',
      },
    ],
    checkpointQuiz: [
      {
        id: 'q-aidev-4-1',
        question: {
          ru: 'Какова главная цель Evaluation Harness (тестовой обвязки) для AI-кодинг-агентов?',
          en: 'What is the primary goal of an Evaluation Harness for AI coding agents?',
        },
        options: [
          'Автоматический запуск агента в изолированной песочнице на реальных задачах и проверка решения скрытым набором тестов для объективной оценки',
          'Снижение стоимости видеокарт в магазинах',
          'Перевод кода с языка Python на HTML',
          'Шифрование исходного кода от конкурентов',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Harness изолированно разворачивает задачу, запускает агента, применяет сгенерированный diff и запускает эталонные юнит-тесты, давая объективную оценку Resolve Rate.',
          en: 'An evaluation harness manages environment provisioning, agent execution, patch application, and hidden test execution for reproducible scoring.',
        },
      },
      {
        id: 'q-aidev-4-2',
        question: {
          ru: 'Что проверяет критерий Fail-to-Pass в бенчмарках уровня SWE-bench?',
          en: 'What does the Fail-to-Pass criterion evaluate in SWE-bench tests?',
        },
        options: [
          'Тесты, которые падали на исходной забагованной версии репозитория, должны стать успешно пройденными после применения патча агента',
          'Все файлы проекта должны быть удалены агентом',
          'Модель должна отказаться отвечать на вопрос',
          'Время работы процессора должно превысить 1 час',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'Fail-to-Pass — это тесты, выявляющие конкретный баг: до патча агента они падают (Fail), а после корректного исправления должны успешно проходить (Pass).',
          en: 'Fail-to-Pass tests target the specific bug: failing on the unpatched repo and turning green once properly resolved.',
        },
      },
      {
        id: 'q-aidev-4-3',
        question: {
          ru: 'Как команды вроде DeepSeek используют Harness в процессе Reinforcement Learning (RL) обучения моделей-рассуждателей?',
          en: 'How do teams like DeepSeek utilize Harness environments during Reinforcement Learning (RL) training?',
        },
        options: [
          'Используют успешное прохождение модульных тестов и компиляцию кода как автоматическую функцию награды (Reward Signal) для модели',
          'Вручную проверяют каждый ответ тысячами программистов',
          'Отказываются от использования GPU',
          'Обучают модель только на открытых книгах по литературе',
        ],
        correctAnswer: 0,
        explanation: {
          ru: 'При обучении рассуждающих моделей (R1) среда Harness автоматически компилирует код и прогоняет тесты; успешный вердикт служит математической функцией награды без участия человека.',
          en: 'Compiler and test suite execution in automated sandboxes provides ground-truth deterministic reward signals during RL training.',
        },
      },
    ],
  },
];

export const aiAssistedDevCards: Card[] = [
  {
    id: 'card-aidev-react',
    moduleId: 'ai-assisted-dev-agents',
    type: 'flip',
    front: {
      ru: 'Что такое паттерн ReAct в архитектуре AI-агентов?',
      en: 'What is the ReAct pattern in AI agent architectures?',
    },
    back: {
      ru: 'Цикл взаимодействия: **Thought** (рассуждение о текущей цели) -> **Action** (вызов инструмента в виде JSON) -> **Observation** (чтение вывода команды из среды) -> повторение до решения задачи.',
      en: 'An interaction cycle: **Thought** (reasoning on goal) -> **Action** (invoking tool JSON) -> **Observation** (reading runtime output) -> repeat until completion.',
    },
    tags: ['ai-agents', 'react-pattern', 'tool-use'],
  },
  {
    id: 'card-aidev-mcp',
    moduleId: 'ai-assisted-dev-agents',
    type: 'cloze',
    clozeText: {
      ru: 'Протокол {{c1::MCP (Model Context Protocol)}} от Anthropic стандартизирует подключение AI-ассистентов к внешним инструментам, репозиториям и базам данных через {{c2::клиент-серверную архитектуру}}.',
      en: 'The {{c1::MCP (Model Context Protocol)}} standardizes how AI agents connect to external tools, repositories, and databases via a {{c2::client-server architecture}}.',
    },
    answer: {
      ru: 'MCP (Model Context Protocol) и клиент-серверную архитектуру',
      en: 'MCP (Model Context Protocol) and client-server architecture',
    },
    tags: ['mcp', 'anthropic', 'protocols'],
  },
  {
    id: 'card-aidev-swebench',
    moduleId: 'ai-assisted-dev-agents',
    type: 'flip',
    front: {
      ru: 'Что такое SWE-bench и как он оценивает кодинг-агентов?',
      en: 'What is SWE-bench and how does it evaluate coding agents?',
    },
    back: {
      ru: 'Индустриальный бенчмарк на основе реальных GitHub Issues. Агент генерирует git diff, который тестируется на скрытом наборе Fail-to-Pass и Pass-to-Pass тестов в изолированном Docker-контейнере.',
      en: 'An industry benchmark based on real GitHub issues. The agent emits a git diff tested against hidden Fail-to-Pass and regression suites in Docker.',
    },
    tags: ['swe-bench', 'evaluation', 'benchmarks'],
  },
  {
    id: 'card-aidev-structured',
    moduleId: 'ai-assisted-dev-agents',
    type: 'cloze',
    clozeText: {
      ru: 'Режим {{c1::Structured Outputs}} гарантирует валидность JSON за счет {{c2::маскирования недопустимых токенов}} (grammar-guided decoding) прямо в процессе генерации.',
      en: 'The {{c1::Structured Outputs}} mode guarantees schema validity via {{c2::grammar-guided token masking}} directly during autoregressive sampling.',
    },
    answer: {
      ru: 'Structured Outputs и маскирования недопустимых токенов',
      en: 'Structured Outputs and grammar-guided token masking',
    },
    tags: ['structured-outputs', 'json-schema'],
  },
];

export const aiAssistedDevQuiz: QuizQuestion[] = [
  {
    id: 'quiz-aidev-1',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какой инструмент позволяет терминальным агентам вроде Claude Code или Aider быстро понимать архитектуру репозитория без превышения контекстного окна?',
      en: 'What mechanism allows CLI agents like Claude Code or Aider to grasp repository architecture within token limits?',
    },
    options: [
      {
        ru: 'Repository Map на основе AST-парсера (tree-sitter), содержащий только сигнатуры функций и классов',
        en: 'Repository Map based on AST parsing (tree-sitter) containing function and class signatures',
      },
      { ru: 'Загрузка всех видеофайлов с рабочего стола', en: 'Loading all video files from desktop' },
      { ru: 'Полная декомпиляция всех бинарных библиотек C++', en: 'Full decompilation of C++ binaries' },
      { ru: 'Случайный выбор 3 строк из каждого файла', en: 'Random selection of 3 lines per file' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Repo Map с помощью tree-sitter строит компактную карту сигнатур и отношений классов, укладываясь в 10–20k токенов вместо мегабайтов исходников.',
      en: 'A tree-sitter AST repository map summarizes class and function signatures concisely without exceeding context budgets.',
    },
    tag: 'ai-cli-tools',
  },
  {
    id: 'quiz-aidev-2',
    type: 'single',
    difficulty: 'easy',
    question: {
      ru: 'Почему Unified Diff является предпочтительным форматом внесения изменений для кодинг-агентов?',
      en: 'Why are Unified Diffs the preferred code modification format for coding agents?',
    },
    options: [
      {
        ru: 'Они содержат только измененные строки и контекст, что экономит токены и защищает от стирания несвязанного кода',
        en: 'They transmit only changed hunks, conserving tokens and preventing accidental code loss',
      },
      { ru: 'Они работают только на компьютерах Apple', en: 'They only run on Apple computers' },
      { ru: 'Diff файлы невозможно прочитать человеку', en: 'Diffs cannot be read by humans' },
      { ru: 'Они автоматически компилируют проект в байт-код', en: 'They automatically compile project to bytecode' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Diff содержит только патч с номерами строк, что экономит до 90% исходящих токенов и гарантирует сохранность остального содержимого файла.',
      en: 'Diff hunks transmit only changed sections, saving token bandwidth and preserving unchanged lines.',
    },
    tag: 'agent-diffs',
  },
  {
    id: 'quiz-aidev-3',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Что из перечисленного является ключевой функцией тестовой обвязки (Evaluation Harness)?',
      en: 'Which of the following is a key responsibility of an Evaluation Harness?',
    },
    options: [
      {
        ru: 'Изолированное создание окружения, запуск агента, наложение патча и автоматический прогон эталонных тестов',
        en: 'Isolated environment setup, agent orchestration, patch application, and automated test suite evaluation',
      },
      { ru: 'Написание маркетинговых текстов для соцсетей', en: 'Writing social media marketing copy' },
      { ru: 'Сбор персональных данных пользователей', en: 'Collecting user personal data' },
      { ru: 'Майнинг криптовалюты во время простоя процессора', en: 'Mining cryptocurrency during idle time' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'Harness берет на себя всю рутину воспроизводимого тестирования: подъем Docker, передачу промпта агенту, применение сгенерированного патча и запуск скрытых pytest тестов.',
      en: 'The harness orchestrates container lifecycle, task injection, patch capture, and automated evaluation suites.',
    },
    tag: 'evaluation-harness',
  },
  {
    id: 'quiz-aidev-4',
    type: 'single',
    difficulty: 'medium',
    question: {
      ru: 'Какую роль играет Model Context Protocol (MCP) в современной разработке с ИИ?',
      en: 'What role does the Model Context Protocol (MCP) play in modern AI development?',
    },
    options: [
      {
        ru: 'Предоставляет единый протокол для взаимодействия AI-клиентов с внешними серверами инструментов и данных',
        en: 'Provides a standardized open protocol for AI clients to communicate with external tool and data servers',
      },
      { ru: 'Заменяет собой протокол передачи данных TCP/IP', en: 'Replaces TCP/IP internet protocol' },
      { ru: 'Автоматически удаляет неиспользуемые переменные в коде', en: 'Automatically removes unused variables' },
      { ru: 'Ограничивает скорость интернета во время обучения нейросети', en: 'Throttles network speed during model training' },
    ],
    correctAnswer: 0,
    explanation: {
      ru: 'MCP унифицирует доступ к инструментам: один раз написанный MCP-сервер (например, для БД или GitHub) сразу работает во всех MCP-совместимых клиентах (Claude Code, Cursor и др.).',
      en: 'MCP provides a standardized interface enabling any AI client to discover and invoke tools from any compatible server.',
    },
    tag: 'mcp-protocol',
  },
];
