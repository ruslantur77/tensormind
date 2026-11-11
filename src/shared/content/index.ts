import { ModuleMeta, Lesson, Card, QuizQuestion, ModuleMetaSchema, LessonSchema, CardSchema, QuizQuestionSchema } from '@/shared/lib/schemas';
import { pythonFoundationsMeta, pythonFoundationsLessons, pythonFoundationsCards, pythonFoundationsQuiz } from './modules/python-foundations';
import { combinatoricsMeta, combinatoricsLessons, combinatoricsCards, combinatoricsQuiz } from './modules/combinatorics';
import { linearModelsMeta, linearModelsLessons, linearModelsCards, linearModelsQuiz } from './modules/linear-models';
import { probabilisticMeta, probabilisticLessons, probabilisticCards, probabilisticQuiz } from './modules/probabilistic';
import { metricMethodsMeta, metricMethodsLessons, metricMethodsCards, metricMethodsQuiz } from './modules/metric-methods';
import { svmPcaMeta, svmPcaLessons, svmPcaCards, svmPcaQuiz } from './modules/svm-pca';
import { decisionTreesMeta, decisionTreesLessons, decisionTreesCards, decisionTreesQuiz } from './modules/decision-trees';
import { boostingNnMeta, boostingNnLessons, boostingNnCards, boostingNnQuiz } from './modules/boosting-nn';
import { gameTheoryMeta, gameTheoryLessons, gameTheoryCards, gameTheoryQuiz } from './modules/game-theory';
import { pytorchPandasSklearnMeta, pytorchPandasSklearnLessons, pytorchPandasSklearnCards, pytorchPandasSklearnQuiz } from './modules/pytorch-pandas-sklearn';
import { dataWranglingEdaMeta, dataWranglingEdaLessons, dataWranglingEdaCards, dataWranglingEdaQuiz } from './modules/data-wrangling-eda';
import { mlopsProductionMeta, mlopsProductionLessons, mlopsProductionCards, mlopsProductionQuiz } from './modules/mlops-production';
import { recsysMeta, recsysLessons, recsysCards, recsysQuiz } from './modules/recsys';
import { dataLabelingMeta, dataLabelingLessons, dataLabelingCards, dataLabelingQuiz } from './modules/data-labeling-cv-audio';
import { aiAssistedDevMeta, aiAssistedDevLessons, aiAssistedDevCards, aiAssistedDevQuiz } from './modules/ai-assisted-dev-agents';
import { abTestingMeta, abTestingLessons, abTestingCards, abTestingQuiz } from './modules/ab-testing';
import { mlSystemDesignMeta, mlSystemDesignLessons, mlSystemDesignCards, mlSystemDesignQuiz } from './modules/ml-system-design';
import { timeSeriesMeta, timeSeriesLessons, timeSeriesCards, timeSeriesQuiz } from './modules/time-series';
import { modelOptimizationMeta, modelOptimizationLessons, modelOptimizationCards, modelOptimizationQuiz } from './modules/model-optimization';
import { aiSafetyEthicsMeta, aiSafetyEthicsLessons, aiSafetyEthicsCards, aiSafetyEthicsQuiz } from './modules/ai-safety-ethics';
import { reinforcementLearningMeta, reinforcementLearningLessons, reinforcementLearningCards, reinforcementLearningQuiz } from './modules/reinforcement-learning';
import { computerVisionMeta, computerVisionLessons, computerVisionCards, computerVisionQuiz } from './modules/computer-vision';
import { BLITZ_QUESTIONS } from './blitz-questions';

export interface FullModule {
  meta: ModuleMeta;
  lessons: Lesson[];
  cards: Card[];
  quiz: QuizQuestion[];
}

const rawModules: FullModule[] = [
  { meta: pythonFoundationsMeta, lessons: pythonFoundationsLessons, cards: pythonFoundationsCards, quiz: pythonFoundationsQuiz },
  { meta: dataWranglingEdaMeta, lessons: dataWranglingEdaLessons, cards: dataWranglingEdaCards, quiz: dataWranglingEdaQuiz },
  { meta: abTestingMeta, lessons: abTestingLessons, cards: abTestingCards, quiz: abTestingQuiz },
  { meta: dataLabelingMeta, lessons: dataLabelingLessons, cards: dataLabelingCards, quiz: dataLabelingQuiz },
  { meta: combinatoricsMeta, lessons: combinatoricsLessons, cards: combinatoricsCards, quiz: combinatoricsQuiz },
  { meta: probabilisticMeta, lessons: probabilisticLessons, cards: probabilisticCards, quiz: probabilisticQuiz },
  { meta: linearModelsMeta, lessons: linearModelsLessons, cards: linearModelsCards, quiz: linearModelsQuiz },
  { meta: metricMethodsMeta, lessons: metricMethodsLessons, cards: metricMethodsCards, quiz: metricMethodsQuiz },
  { meta: svmPcaMeta, lessons: svmPcaLessons, cards: svmPcaCards, quiz: svmPcaQuiz },
  { meta: decisionTreesMeta, lessons: decisionTreesLessons, cards: decisionTreesCards, quiz: decisionTreesQuiz },
  { meta: boostingNnMeta, lessons: boostingNnLessons, cards: boostingNnCards, quiz: boostingNnQuiz },
  { meta: pytorchPandasSklearnMeta, lessons: pytorchPandasSklearnLessons, cards: pytorchPandasSklearnCards, quiz: pytorchPandasSklearnQuiz },
  { meta: gameTheoryMeta, lessons: gameTheoryLessons, cards: gameTheoryCards, quiz: gameTheoryQuiz },
  { meta: mlopsProductionMeta, lessons: mlopsProductionLessons, cards: mlopsProductionCards, quiz: mlopsProductionQuiz },
  { meta: recsysMeta, lessons: recsysLessons, cards: recsysCards, quiz: recsysQuiz },
  { meta: aiAssistedDevMeta, lessons: aiAssistedDevLessons, cards: aiAssistedDevCards, quiz: aiAssistedDevQuiz },
  { meta: mlSystemDesignMeta, lessons: mlSystemDesignLessons, cards: mlSystemDesignCards, quiz: mlSystemDesignQuiz },
  { meta: timeSeriesMeta, lessons: timeSeriesLessons, cards: timeSeriesCards, quiz: timeSeriesQuiz },
  { meta: modelOptimizationMeta, lessons: modelOptimizationLessons, cards: modelOptimizationCards, quiz: modelOptimizationQuiz },
  { meta: aiSafetyEthicsMeta, lessons: aiSafetyEthicsLessons, cards: aiSafetyEthicsCards, quiz: aiSafetyEthicsQuiz },
  { meta: reinforcementLearningMeta, lessons: reinforcementLearningLessons, cards: reinforcementLearningCards, quiz: reinforcementLearningQuiz },
  { meta: computerVisionMeta, lessons: computerVisionLessons, cards: computerVisionCards, quiz: computerVisionQuiz },
];

// Validate content with Zod safely without crashing
function validateAndLoadModules(): FullModule[] {
  const loaded: FullModule[] = [];

  for (const mod of rawModules) {
    try {
      const validMeta = ModuleMetaSchema.parse(mod.meta);
      const validLessons = mod.lessons.map(l => LessonSchema.parse(l));
      const validCards = mod.cards.map(c => CardSchema.parse(c));
      const validQuiz = mod.quiz.map(q => QuizQuestionSchema.parse(q));

      loaded.push({
        meta: validMeta,
        lessons: validLessons,
        cards: validCards,
        quiz: validQuiz,
      });
    } catch (err) {
      console.error(`Validation error in module ${mod.meta.id}:`, err);
      // Fallback: still load with raw data to keep app functional
      loaded.push(mod);
    }
  }

  return loaded.sort((a, b) => a.meta.order - b.meta.order);
}

export const contentRegistry = {
  modules: validateAndLoadModules(),

  getModule(id: string): FullModule | undefined {
    return this.modules.find(m => m.meta.id === id);
  },

  getAllModules(): FullModule[] {
    return this.modules;
  },

  getLesson(moduleId: string, lessonId: string): Lesson | undefined {
    const mod = this.getModule(moduleId);
    return mod?.lessons.find(l => l.id === lessonId);
  },

  getAllCards(): Card[] {
    return this.modules.flatMap(m => m.cards);
  },

  getCardsByModule(moduleId: string): Card[] {
    return this.getModule(moduleId)?.cards || [];
  },

  getAllQuizQuestions(): QuizQuestion[] {
    const moduleQuizzes = this.modules.flatMap(m => m.quiz);
    return [...moduleQuizzes, ...BLITZ_QUESTIONS];
  },

  getBlitzQuestions(): QuizQuestion[] {
    return BLITZ_QUESTIONS;
  },

  getQuizQuestionsByModule(moduleId: string): QuizQuestion[] {
    return this.getModule(moduleId)?.quiz || [];
  },

  getAllValidCardIds(): Set<string> {
    return new Set(this.getAllCards().map(c => c.id));
  },

  getAllValidLessonIds(): Set<string> {
    return new Set(this.modules.flatMap(m => m.lessons.map(l => l.id)));
  },
};
