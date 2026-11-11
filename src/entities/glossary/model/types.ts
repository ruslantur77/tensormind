import { LocalizedString } from '@/shared/lib/schemas';

export type GlossaryCategory =
  | 'all'
  | 'python'           // Python для ML (GIL, Декораторы, Генераторы, Дандеры...)
  | 'metrics'          // Метрики качества (F1, ROC-AUC, mAP, MSE...)
  | 'regularization'   // Регуляризация и оптимизаторы (L1, L2, AdamW, Dropout...)
  | 'architectures'    // Архитектуры и слои (Self-Attention, BatchNorm, LayerNorm...)
  | 'cv'               // Компьютерное зрение (IoU, NMS, Receptive Field...)
  | 'nlp_llm'          // NLP и LLM (LoRA, PagedAttention, Temperature, Speculative...)
  | 'classical_ml'     // Классический ML (Gini, Bias-Variance, Bagging, Boosting...)
  | 'statistics'       // Статистика и теорвер (p-value, Bayes, CLT, KL...)
  | 'rl'               // Reinforcement Learning (Bellman, PPO, DPO, GRPO...)
  | 'safety_mlops';    // Этика, приватность и MLOps (Prompt Injection, Drift...)

export interface GlossaryTerm {
  id: string;
  term: LocalizedString;               // Название (ru + en)
  englishName: string;                 // Английский эквивалент / альтернативные названия
  category: GlossaryCategory;
  formulaLatex: string;                // LaTeX выражение для KaTeX
  formulaDescription?: LocalizedString;// Расшифровка переменных формулы (ru + en)
  shortDefinition: LocalizedString;    // Краткое емкое определение (ru + en)
  whenToUse: LocalizedString[];        // Для чего и когда применять (ru + en)
  interviewCaveats?: LocalizedString[];// Тонкости и частые каверзные вопросы (ru + en)
  lessonPath?: {
    moduleId: string;
    lessonId: string;
    title: LocalizedString;
  };
  tags: string[];                      // Поисковые теги (ru + en)
}

export interface GlossaryCategoryMeta {
  id: GlossaryCategory;
  label: { ru: string; en: string };
  icon: string;
  color: string;
}
