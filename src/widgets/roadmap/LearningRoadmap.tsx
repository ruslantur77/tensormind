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
import { Badge } from '@/shared/ui/Badge';
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
        badgeRu: 'Базовый трек',
        badgeEn: 'Core Foundation',
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
        badgeRu: 'Базовый трек',
        badgeEn: 'Core Foundation',
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
        badgeRu: 'Базовый трек',
        badgeEn: 'Core Foundation',
        roleRu: 'Деревья и лес',
        roleEn: 'Trees & Forests',
        tipRu: 'Критерии Джини и энтропия, алгоритм CART, Random Forest, Feature Importance и SHAP.',
        tipEn: 'Gini impurity, CART trees, Random Forest bagging, and feature interpretability.',
      },
      {
        moduleId: 'boosting-nn',
        flowType: 'sequential',
        badgeRu: 'Базовый трек',
        badgeEn: 'Core Foundation',
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Roadmap Legend */}
      <div className="p-4 sm:p-5 rounded-2xl aero-glass border border-slate-200/80 dark:border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-500 shrink-0" />
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
          {/* Sequential (Core) */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-slate-800 dark:text-slate-200">
            <span className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)] shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold block text-violet-700 dark:text-violet-300">
                {lang === 'en' ? 'Core Track (Sequential)' : 'Базовый трек (последовательно)'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block">
                {lang === 'en' ? 'Fundamental base for next topics' : 'Фундаментальная основа для следующих тем'}
              </span>
            </div>
          </div>

          {/* Parallel */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-800 dark:text-slate-200">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold block text-emerald-700 dark:text-emerald-300">
                {lang === 'en' ? 'Parallel Branches' : 'Параллельные ветки'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block">
                {lang === 'en' ? 'Can be learned simultaneously' : 'Можно изучать параллельно или по выбору'}
              </span>
            </div>
          </div>

          {/* Specialization (Blue) */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-slate-800 dark:text-slate-200">
            <span className="w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)] shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold block text-sky-700 dark:text-sky-300">
                {lang === 'en' ? 'Specializations & MLOps' : 'Специализации и MLOps'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight block">
                {lang === 'en' ? 'Deep Learning, LLMs & Production' : 'Глубокое обучение, LLM и продакшн'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Stages */}
      <div className="space-y-7 relative">
        {ROADMAP_STAGES.map((stage, stageIdx) => {
          const isLastStage = stageIdx === ROADMAP_STAGES.length - 1;

          return (
            <div key={stage.id} className="relative space-y-4">
              {/* Stage Milestone Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                  {stage.stepNumber}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {lang === 'en' ? stage.titleEn : stage.titleRu}
                    </h3>
                    <Badge
                      variant={
                        stage.mode === 'sequential'
                          ? 'violet'
                          : stage.mode === 'specialization'
                          ? 'cyan'
                          : 'success'
                      }
                      size="sm"
                    >
                      {stage.mode === 'sequential'
                        ? (lang === 'en' ? 'Sequential' : 'Последовательно')
                        : stage.mode === 'specialization'
                        ? (lang === 'en' ? 'Specialization' : 'Специализация')
                        : (lang === 'en' ? 'Parallel tracks' : 'Параллельные ветки')}
                    </Badge>
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

                  // Distinct color matching legend
                  const barColorClass =
                    isDone
                      ? 'bg-emerald-500'
                      : node.flowType === 'sequential'
                      ? 'bg-violet-500'
                      : node.flowType === 'specialization'
                      ? 'bg-sky-500'
                      : 'bg-emerald-500';

                  const badgeVariant =
                    node.flowType === 'sequential'
                      ? 'violet'
                      : node.flowType === 'specialization'
                      ? 'cyan'
                      : 'success';

                  return (
                    <Card
                      key={node.moduleId}
                      interactive
                      onClick={() => handleOpenModule(node.moduleId)}
                      className={`p-4 sm:p-5 flex flex-col justify-between gap-3.5 transition-all cursor-pointer relative overflow-hidden group ${
                        isDone
                          ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                          : isInProgress
                          ? 'border-sky-500/50 bg-sky-500/5 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
                          : 'hover:border-sky-500/40'
                      }`}
                    >
                      {/* Top flow indicator bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1 ${barColorClass}`} />

                      <div className="space-y-3">
                        {/* Row 1: Order + Role Tag on Left, Badge on Right */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-extrabold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shrink-0">
                              #{mod.meta.order}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                              {lang === 'en' ? node.roleEn : node.roleRu}
                            </span>
                          </div>

                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {lang === 'en' ? 'Done' : 'Пройден'}
                            </span>
                          ) : (
                            <Badge variant={badgeVariant} size="sm" className="shrink-0 font-medium">
                              {lang === 'en' ? node.badgeEn : node.badgeRu}
                            </Badge>
                          )}
                        </div>

                        {/* Row 2: Module Icon + Full-width Title */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shrink-0 shadow-xs">
                            <ModuleIcon moduleId={mod.meta.id} className="w-5 h-5" />
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex-1 pt-0.5">
                            {mod.meta.title[lang]}
                          </h4>
                        </div>

                        {/* Row 3: Pedagogical Tip */}
                        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          <MathText text={lang === 'en' ? node.tipEn : node.tipRu} inlineOnly />
                        </div>
                      </div>

                      {/* Card Footer: Metadata and Progress */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-white/5">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 shrink-0" />
                            {mod.meta.estimatedMinutes} мин
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <BookOpen className="w-3 h-3 shrink-0" />
                            {mod.lessons.length} уроков
                          </span>
                          <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                            {Math.round(progress)}%
                          </span>
                        </div>

                        <ProgressBar
                          value={progress}
                          height="sm"
                          variant={isDone ? 'success' : 'cyan'}
                        />

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {isDone
                              ? (lang === 'en' ? 'Completed' : 'Пройден полностью')
                              : isInProgress
                              ? (lang === 'en' ? 'In progress' : 'В процессе изучения')
                              : (lang === 'en' ? 'Ready to start' : 'Готов к изучению')}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform">
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
                    <div className="w-0.5 h-6 bg-gradient-to-b from-slate-300 dark:from-slate-700 to-sky-500" />
                    <div className="p-1 rounded-full bg-sky-500 text-white shadow-sm">
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
