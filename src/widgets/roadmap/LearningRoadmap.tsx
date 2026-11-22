import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  ArrowDown,
  Compass,
} from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { ModuleIcon } from '@/shared/ui/AppIcons';
import { contentRegistry } from '@/shared/content';
import { platform } from '@/shared/lib/platform';
import { MathText } from '@/shared/lib/katex/MathText';

export type FlowType = 'sequential' | 'parallel' | 'specialization';

export interface RoadmapNode {
  moduleId: string;
  flowType: FlowType;
  badgeRu: string;
  badgeEn: string;
  roleRu: string;
  roleEn: string;
  tipRu: string;
  tipEn: string;
}

export interface RoadmapStage {
  id: string;
  stepNumber: number;
  titleRu: string;
  titleEn: string;
  subtitleRu: string;
  subtitleEn: string;
  mode: 'sequential' | 'parallel' | 'specialization';
  nodes: RoadmapNode[];
}

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: 'stage-1',
    stepNumber: 1,
    titleRu: 'Языковой базис и культура кода',
    titleEn: 'Programming Foundations & Code Hygiene',
    subtitleRu: 'Обязательный старт: модель памяти, структуры данных и ООП до перехода к вычислениям',
    subtitleEn: 'Mandatory start: memory model, collections, and OOP before tensor operations',
    mode: 'sequential',
    nodes: [
      {
        moduleId: 'python-foundations',
        flowType: 'sequential',
        badgeRu: 'Обязательно',
        badgeEn: 'Mandatory',
        roleRu: 'Фундамент языка',
        roleEn: 'Core Language',
        tipRu: 'Синтаксис, структуры данных, ООП, а также деревья (BST, DFS/BFS) и графы (DAG, топосортировка) для собеседований.',
        tipEn: 'Syntax, OOP, plus binary trees (BST, DFS/BFS) and graphs (DAG, topological sort) for ML tech interviews.',
      },
    ],
  },
  {
    id: 'stage-2',
    stepNumber: 2,
    titleRu: 'Данные, продуктовая аналитика и математика',
    titleEn: 'Data, Product Analytics & Mathematical Base',
    subtitleRu: 'Параллельные ветки: SQL, EDA, BI, A/B-тестирование (CUPED), разметка данных и дискретная математика',
    subtitleEn: 'Parallel branches: SQL, EDA, BI, A/B testing (CUPED), data labeling, and discrete math',
    mode: 'parallel',
    nodes: [
      {
        moduleId: 'data-wrangling-eda',
        flowType: 'parallel',
        badgeRu: 'Параллельно',
        badgeEn: 'Parallel',
        roleRu: 'Инженерия данных и BI',
        roleEn: 'Data Engineering & BI',
        tipRu: 'SQL (оконные функции, CTE), EDA, Feature Engineering, Pandas, Polars, а также дашборды в Power BI и Excel.',
        tipEn: 'SQL (window functions, CTE), EDA, Feature Engineering, Pandas, Polars, plus dashboards in Power BI & Excel.',
      },
      {
        moduleId: 'ab-testing-experimentation',
        flowType: 'parallel',
        badgeRu: 'Параллельно: DA',
        badgeEn: 'Parallel: DA',
        roleRu: 'A/B тесты и продуктовая аналитика',
        roleEn: 'A/B Testing & Product Analytics',
        tipRu: 'Гипотезы, MDE, расчет выборки, t-тест Уэлча, бутстрэп, ускорение тестов через CUPED, SRM и Switchback в маркетплейсах.',
        tipEn: 'Hypotheses, MDE, sample size, Welch t-test, bootstrap, CUPED variance reduction, SRM, and Switchback designs.',
      },
      {
        moduleId: 'data-labeling-cv-audio',
        flowType: 'parallel',
        badgeRu: 'Параллельно',
        badgeEn: 'Parallel',
        roleRu: 'Разметка и аугментации',
        roleEn: 'Data Labeling & Augmentation',
        tipRu: 'Label Studio, CVAT, COCO, YOLO, Albumentations (MixUp/CutMix), torchaudio (SpecAugment) и Active Learning.',
        tipEn: 'Label Studio, CVAT, COCO/YOLO formats, Albumentations (MixUp/CutMix), torchaudio (SpecAugment), and Active Learning.',
      },
      {
        moduleId: 'combinatorics',
        flowType: 'parallel',
        badgeRu: 'Параллельно',
        badgeEn: 'Parallel',
        roleRu: 'Дискретная математика',
        roleEn: 'Discrete Math',
        tipRu: 'Правила суммы и произведения, сочетания, размещения и математический бутстрэп.',
        tipEn: 'Combinatorial rules, permutations, combinations, and statistical bootstrap.',
      },
      {
        moduleId: 'probabilistic',
        flowType: 'sequential',
        badgeRu: 'Обязательно',
        badgeEn: 'Mandatory',
        roleRu: 'Вероятностный подход',
        roleEn: 'Probabilistic ML',
        tipRu: 'Постановка задач Supervised/Unsupervised, формула Байеса и Naive Bayes классификатор.',
        tipEn: 'ML formulations, Bayes theorem, Naive Bayes classifier, and likelihood modeling.',
      },
    ],
  },
  {
    id: 'stage-3',
    stepNumber: 3,
    titleRu: 'Классический ML и оптимизация',
    titleEn: 'Classical ML & Numerical Optimization',
    subtitleRu: 'Базовая теория: линейные гиперплоскости, градиентный спуск и метрики',
    subtitleEn: 'Core mathematical foundation: linear hyperplanes, gradient descent, and metrics',
    mode: 'sequential',
    nodes: [
      {
        moduleId: 'linear-models',
        flowType: 'sequential',
        badgeRu: 'Обязательно',
        badgeEn: 'Mandatory',
        roleRu: 'Линейные модели',
        roleEn: 'Linear Models',
        tipRu: 'Аналитический МНК (OLS), логистическая регрессия, регуляризация L1/L2 и оптимизаторы GD/SGD/Adam.',
        tipEn: 'Analytical OLS, logistic regression, L1/L2 regularization, and convex optimizers.',
      },
      {
        moduleId: 'metric-methods',
        flowType: 'parallel',
        badgeRu: 'Параллельно',
        badgeEn: 'Parallel',
        roleRu: 'Геометрический подход',
        roleEn: 'Geometric Methods',
        tipRu: 'k-Nearest Neighbors, проклятие размерности и кластеризация (K-Means, DBSCAN).',
        tipEn: 'k-NN, distance concentration, and unsupervised clustering (K-Means, DBSCAN).',
      },
      {
        moduleId: 'svm-pca',
        flowType: 'sequential',
        badgeRu: 'Обязательно',
        badgeEn: 'Mandatory',
        roleRu: 'Разделение и метрики',
        roleEn: 'Separation & Metrics',
        tipRu: 'Kernel Trick в SVM, PCA/SVD сжатие размерности и метрики (ROC-AUC, Precision, Recall).',
        tipEn: 'Kernel SVM, PCA/SVD dimensionality reduction, and evaluation metrics.',
      },
    ],
  },
  {
    id: 'stage-4',
    stepNumber: 4,
    titleRu: 'Табличный State-of-the-Art: Деревья и Бустинг',
    titleEn: 'Tabular SOTA: Decision Trees & Boosting',
    subtitleRu: 'Последовательно: от одиночных деревьев к мощнейшим ансамблям индустрии',
    subtitleEn: 'Sequential path: from single CART trees to production ensemble algorithms',
    mode: 'sequential',
    nodes: [
      {
        moduleId: 'decision-trees',
        flowType: 'sequential',
        badgeRu: 'Обязательно',
        badgeEn: 'Mandatory',
        roleRu: 'Деревья и лес',
        roleEn: 'Trees & Forests',
        tipRu: 'Критерии Джини и энтропия, алгоритм CART, Random Forest, Feature Importance и SHAP.',
        tipEn: 'Gini impurity, CART trees, Random Forest bagging, and feature interpretability.',
      },
      {
        moduleId: 'boosting-nn',
        flowType: 'sequential',
        badgeRu: 'Обязательно',
        badgeEn: 'Mandatory',
        roleRu: 'Градиентный бустинг',
        roleEn: 'Gradient Boosting',
        tipRu: 'GBDT, XGBoost, CatBoost, LightGBM (GOSS, Leaf-wise), а также перцептроны и Backpropagation.',
        tipEn: 'GBDT, XGBoost, CatBoost, LightGBM, plus multi-layer perceptron backpropagation.',
      },
      {
        moduleId: 'time-series-forecasting',
        flowType: 'parallel',
        badgeRu: 'Параллельно: Аналитика & Прогноз',
        badgeEn: 'Parallel: Forecasting Track',
        roleRu: 'Временные ряды',
        roleEn: 'Time Series',
        tipRu: 'ARIMA, SARIMAX, библиотека Prophet, TimeSeriesSplit без заглядывания в будущее, лаги и прогнозирование на LightGBM.',
        tipEn: 'ARIMA, SARIMAX, Prophet library, leak-free TimeSeriesSplit, lag feature engineering, and LightGBM.',
      },
    ],
  },
  {
    id: 'stage-5',
    stepNumber: 5,
    titleRu: 'Специализации и современные архитектуры',
    titleEn: 'Specializations & Modern Architectures',
    subtitleRu: 'Параллельные ветки: Deep Learning & LLM, RecSys, RL & GRPO (DeepSeek-R1) или состязательные модели (GAN)',
    subtitleEn: 'Parallel branches: Deep Learning & LLMs, RecSys, RL & GRPO (DeepSeek-R1), or adversarial GAN research',
    mode: 'specialization',
    nodes: [
      {
        moduleId: 'pytorch-pandas-sklearn',
        flowType: 'specialization',
        badgeRu: 'Специализация: DL & GenAI',
        badgeEn: 'Specialization: DL & GenAI',
        roleRu: 'Deep Learning & PyTorch',
        roleEn: 'Deep Learning & PyTorch',
        tipRu: 'Тензоры PyTorch, Autograd, CNN/ResNet, RNN/LSTM, Трансформеры, Attention, LoRA/PEFT, RAG и Агенты (LangChain, LlamaIndex).',
        tipEn: 'PyTorch tensors, Autograd, CNNs, RNNs, Transformers, Attention, PEFT (LoRA), RAG, and Agents (LangChain, LlamaIndex).',
      },
      {
        moduleId: 'recsys',
        flowType: 'specialization',
        badgeRu: 'Специализация: RecSys',
        badgeEn: 'Specialization: RecSys',
        roleRu: 'Рекомендательные системы',
        roleEn: 'Recommender Systems',
        tipRu: 'Коллаборативная фильтрация, FunkSVD, ALS, Two-Tower нейросети, ANN-поиск (FAISS/HNSW) и метрика NDCG@k.',
        tipEn: 'Collaborative filtering, FunkSVD, ALS, Two-Tower neural networks, ANN search, and NDCG@k ranking.',
      },
      {
        moduleId: 'reinforcement-learning',
        flowType: 'specialization',
        badgeRu: 'Специализация: RL & Reasoning',
        badgeEn: 'Specialization: RL & Reasoning',
        roleRu: 'Обучение с подкреплением',
        roleEn: 'Reinforcement Learning',
        tipRu: 'MDP, Bellman, DQN, REINFORCE, Actor-Critic, PPO и передовые методы LLM: RLHF, DPO и GRPO (DeepSeek-R1 без критика).',
        tipEn: 'MDP, Bellman, DQN, REINFORCE, Actor-Critic, PPO, and frontier LLM methods: RLHF, DPO, and GRPO (DeepSeek-R1 without critic).',
      },
      {
        moduleId: 'computer-vision',
        flowType: 'specialization',
        badgeRu: 'Специализация: CV',
        badgeEn: 'Specialization: CV',
        roleRu: 'Компьютерное зрение',
        roleEn: 'Computer Vision',
        tipRu: 'Свертки (Dilated, Depthwise, Transposed), im2col, Receptive Field, ResNet/ViT, mAP@0.5:0.95, NMS, RoI Align, YOLO vs Faster R-CNN и DETR.',
        tipEn: 'Convolutions (Dilated, Depthwise, Transposed), im2col, Receptive Field, ResNet/ViT, mAP@0.5:0.95, NMS, RoI Align, YOLO vs Faster R-CNN, and DETR.',
      },
      {
        moduleId: 'game-theory',
        flowType: 'specialization',
        badgeRu: 'Специализация: AI Research',
        badgeEn: 'Specialization: AI Research',
        roleRu: 'Теория игр и GAN',
        roleEn: 'Game Theory & GANs',
        tipRu: 'Равновесие Нэша, минимакс, состязательные атаки (FGSM) и генеративные сети GAN.',
        tipEn: 'Nash equilibrium, minimax formulation, adversarial robustness, and GAN models.',
      },
    ],
  },
  {
    id: 'stage-6',
    stepNumber: 6,
    titleRu: 'Продакшн, MLOps, Оптимизация и Безопасность',
    titleEn: 'Production, MLOps, Optimization & Safety',
    subtitleRu: 'Финальный этап: Docker, FastAPI, ML System Design, сжатие моделей (TensorRT, vLLM), безопасность ИИ и агенты',
    subtitleEn: 'Final stage: Docker, FastAPI, ML System Design, model compression (TensorRT, vLLM), AI safety & agents',
    mode: 'specialization',
    nodes: [
      {
        moduleId: 'mlops-production',
        flowType: 'specialization',
        badgeRu: 'Специализация: MLOps',
        badgeEn: 'Specialization: MLOps',
        roleRu: 'MLOps Инженерия',
        roleEn: 'MLOps Engineering',
        tipRu: 'Git гигиена, Docker контейнеры, FastAPI REST API, MLflow / DVC и мониторинг Data/Concept Drift.',
        tipEn: 'Git for ML, Docker, FastAPI microservices, MLflow/DVC, and production drift telemetry.',
      },
      {
        moduleId: 'ml-system-design',
        flowType: 'specialization',
        badgeRu: 'Специализация: System Design',
        badgeEn: 'Specialization: System Design',
        roleRu: 'ML System Design',
        roleEn: 'ML System Design',
        tipRu: 'Фреймворк собеседования, Feature Store, двухэтапный поиск (Retrieval + Re-ranking), Triton/vLLM и сквозной кейс антифрода (SLA < 50мс).',
        tipEn: 'Interview framework, Feature Store, two-stage retrieval, Triton/vLLM serving, and banking fraud detection case study (SLA < 50ms).',
      },
      {
        moduleId: 'model-optimization-inference',
        flowType: 'specialization',
        badgeRu: 'Специализация: Оптимизация',
        badgeEn: 'Specialization: Optimization',
        roleRu: 'Оптимизация инференса',
        roleEn: 'Inference Optimization',
        tipRu: 'Квантование (PTQ, QAT, AWQ, GPTQ), дистилляция знаний Хинтона, ONNX Runtime, NVIDIA TensorRT и PagedAttention (vLLM).',
        tipEn: 'Quantization (PTQ, QAT, AWQ, GPTQ), knowledge distillation, ONNX Runtime, TensorRT, and PagedAttention (vLLM).',
      },
      {
        moduleId: 'ai-safety-ethics',
        flowType: 'specialization',
        badgeRu: 'Специализация: Безопасность',
        badgeEn: 'Specialization: Safety & Privacy',
        roleRu: 'Безопасность и Этика ИИ',
        roleEn: 'AI Safety & Ethics',
        tipRu: 'Algorithmic Bias, метрики справедливости, защита от Prompt Injection (Jailbreak, Guardrails), дифференциальная приватность (DP-SGD) и выравнивание (DPO).',
        tipEn: 'Algorithmic bias, fairness metrics, prompt injection defense, differential privacy (DP-SGD), and alignment (DPO).',
      },
      {
        moduleId: 'ai-assisted-dev-agents',
        flowType: 'specialization',
        badgeRu: 'Специализация: AI Dev',
        badgeEn: 'Specialization: AI Dev',
        roleRu: 'AI-Агенты и Harness',
        roleEn: 'AI Agents & Harness',
        tipRu: 'Терминальные агенты (Claude Code, OpenCode), протокол MCP, паттерн ReAct, тестовые стенды DeepSeek Harness и бенчмарк SWE-bench.',
        tipEn: 'Terminal agents (Claude Code, OpenCode), MCP protocol, ReAct pattern, DeepSeek Harness testbeds, and SWE-bench.',
      },
    ],
  },
];

interface LearningRoadmapProps {
  completedLessonIds: Set<string>;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ completedLessonIds }) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'en' ? 'en' : 'ru') as 'ru' | 'en';
  const navigate = useNavigate();

  const handleOpenModule = (moduleId: string) => {
    platform.haptics.light();
    navigate(`/module/${moduleId}?from=roadmap`);
  };

  const flowTheme = {
    sequential: {
      text: 'text-[var(--tm-ochre-text)]',
      hoverText: 'group-hover:text-[var(--tm-ochre-text)]',
      bg: 'bg-[var(--tm-ochre-soft)]',
      border: 'border-[var(--tm-ochre-border)]',
      dot: 'bg-[var(--tm-ochre-dot)]',
    },
    parallel: {
      text: 'text-[var(--tm-olive-text)]',
      hoverText: 'group-hover:text-[var(--tm-olive-text)]',
      bg: 'bg-[var(--tm-olive-soft)]',
      border: 'border-[var(--tm-olive-border)]',
      dot: 'bg-[var(--tm-olive-dot)]',
    },
    specialization: {
      text: 'text-[var(--tm-wine-text)]',
      hoverText: 'group-hover:text-[var(--tm-wine-text)]',
      bg: 'bg-[var(--tm-wine-soft)]',
      border: 'border-[var(--tm-wine-border)]',
      dot: 'bg-[var(--tm-wine-dot)]',
    },
  } as const;

  const legendItems = [
    {
      flow: 'sequential' as const,
      title: lang === 'en' ? 'Mandatory (Sequential)' : 'Обязательно (последовательно)',
      hint:
        lang === 'en'
          ? 'Mandatory stage for the following topics'
          : 'Обязательный этап для следующих тем',
    },
    {
      flow: 'parallel' as const,
      title: lang === 'en' ? 'Parallel Branches' : 'Параллельные ветки',
      hint:
        lang === 'en'
          ? 'Can be learned simultaneously'
          : 'Можно изучать параллельно или по выбору',
    },
    {
      flow: 'specialization' as const,
      title: lang === 'en' ? 'Specializations & MLOps' : 'Специализации и MLOps',
      hint:
        lang === 'en'
          ? 'Deep Learning, LLMs & Production'
          : 'Глубокое обучение, LLM и продакшн',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Roadmap Legend */}
      <div className="p-4 sm:p-5 rounded-xl aero-glass space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--tm-card-border)] pb-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[var(--tm-ochre-text)] shrink-0" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'en' ? 'Machine Learning Learning Path' : 'Интерактивная дорожная карта ML-инженера'}
            </h4>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en'
              ? 'Structured path from Python syntax to Production MLOps'
              : 'Проверенный путь от синтаксиса Python до продакшн-деплоя'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {legendItems.map((item) => {
            const theme = flowTheme[item.flow];
            return (
              <div
                key={item.flow}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${theme.bg} ${theme.border}`}
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${theme.dot}`} />
                <div className="space-y-0.5">
                  <span className={`font-semibold block ${theme.text}`}>{item.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block">
                    {item.hint}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap Stages */}
      <div className="space-y-7 relative">
        {ROADMAP_STAGES.map((stage, stageIdx) => {
          const isLastStage = stageIdx === ROADMAP_STAGES.length - 1;
          const stageTheme = flowTheme[stage.mode];

          return (
            <div key={stage.id} className="relative space-y-4">
              {/* Stage Milestone Header */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg border font-semibold text-sm flex items-center justify-center shrink-0 ${stageTheme.bg} ${stageTheme.border} ${stageTheme.text}`}>
                  {stage.stepNumber}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {lang === 'en' ? stage.titleEn : stage.titleRu}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${stageTheme.bg} ${stageTheme.border} ${stageTheme.text}`}>
                      {stage.mode === 'sequential'
                        ? (lang === 'en' ? 'Sequential' : 'Последовательно')
                        : stage.mode === 'specialization'
                        ? (lang === 'en' ? 'Specialization' : 'Специализация')
                        : (lang === 'en' ? 'Parallel tracks' : 'Параллельные ветки')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {lang === 'en' ? stage.subtitleEn : stage.subtitleRu}
                  </p>
                </div>
              </div>

              {/* Node Cards Grid for this stage */}
              <div
                className={`grid gap-3.5 pt-1 ${
                  stage.nodes.length === 1
                    ? 'grid-cols-1'
                    : stage.nodes.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {stage.nodes.map((node) => {
                  const mod = contentRegistry.getModule(node.moduleId);
                  if (!mod) return null;

                  const totalLessons = mod.lessons.length;
                  const completedLessons = mod.lessons.filter(l =>
                    completedLessonIds.has(l.id)
                  ).length;
                  const progress =
                    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
                  const isDone = totalLessons > 0 && completedLessons === totalLessons;
                  const isInProgress = progress > 0 && !isDone;

                  // Warm accent per flow type, matching the legend
                  const nodeTheme = flowTheme[node.flowType];

                  return (
                    <Card
                      key={node.moduleId}
                      interactive
                      onClick={() => handleOpenModule(node.moduleId)}
                      className={`p-4 sm:p-5 flex flex-col justify-between gap-3.5 transition-colors cursor-pointer group ${
                        isDone
                          ? 'border-[var(--tm-sage-border)] bg-[var(--tm-sage-soft)]'
                          : 'hover:border-[var(--tm-card-hover-border)]'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Row 1: Order + Role Tag on Left, Badge on Right */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="px-1.5 py-0.5 rounded-md bg-[var(--tm-surface-inset)] border border-[var(--tm-card-border)] text-[11px] font-numeric font-bold text-slate-700 dark:text-slate-300 shrink-0">
                              #{mod.meta.order}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                              {lang === 'en' ? node.roleEn : node.roleRu}
                            </span>
                          </div>

                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--tm-sage-text)] bg-[var(--tm-sage-soft)] px-2 py-0.5 rounded-full border border-[var(--tm-sage-border)] shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {lang === 'en' ? 'Done' : 'Пройден'}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0 ${nodeTheme.bg} ${nodeTheme.border} ${nodeTheme.text}`}>
                              {lang === 'en' ? node.badgeEn : node.badgeRu}
                            </span>
                          )}
                        </div>

                        {/* Row 2: Module Icon + Full-width Title */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg aero-inset flex items-center justify-center shrink-0">
                            <ModuleIcon moduleId={mod.meta.id} className="w-5 h-5" />
                          </div>
                          <h4 className={`text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug transition-colors flex-1 pt-0.5 ${nodeTheme.hoverText}`}>
                            {mod.meta.title[lang]}
                          </h4>
                        </div>

                        {/* Row 3: Pedagogical Tip */}
                        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          <MathText text={lang === 'en' ? node.tipEn : node.tipRu} inlineOnly />
                        </div>
                      </div>

                      {/* Card Footer: Metadata and Progress */}
                      <div className="space-y-2 pt-2 border-t border-[var(--tm-card-border)]">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 shrink-0" />
                            {mod.meta.estimatedMinutes} мин
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <BookOpen className="w-3 h-3 shrink-0" />
                            {mod.lessons.length} уроков
                          </span>
                          <span className={`font-numeric font-bold ${isDone ? 'text-[var(--tm-sage-text)]' : 'text-[var(--tm-ochre-text)]'}`}>
                            {Math.round(progress)}%
                          </span>
                        </div>

                        <ProgressBar
                          value={progress}
                          height="sm"
                          variant={isDone ? 'sage' : 'ochre'}
                        />

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {isDone
                              ? (lang === 'en' ? 'Completed' : 'Пройден полностью')
                              : isInProgress
                              ? (lang === 'en' ? 'In progress' : 'В процессе изучения')
                              : (lang === 'en' ? 'Ready to start' : 'Готов к изучению')}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${nodeTheme.text}`}>
                            {lang === 'en' ? 'Open' : 'Открыть'} <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Connecting Flow Downward Spine to next stage */}
              {!isLastStage && (
                <div className="flex items-center justify-center py-2">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-[var(--tm-card-border)]" />
                    <div className="p-1 rounded-full bg-[var(--tm-ochre)] text-[#1a1208]">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
