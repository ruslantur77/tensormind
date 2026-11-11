import { z } from 'zod';

// Zod schemas for Content
export const ModuleMetaSchema = z.object({
  id: z.string(),
  title: z.object({
    ru: z.string(),
    en: z.string(),
  }),
  description: z.object({
    ru: z.string(),
    en: z.string(),
  }),
  order: z.number(),
  icon: z.string(),
  estimatedMinutes: z.number(),
  isPlaceholder: z.boolean().optional(),
});

export type ModuleMeta = z.infer<typeof ModuleMetaSchema>;

export const LocalizedStringSchema = z.union([
  z.string(),
  z.object({
    ru: z.string(),
    en: z.string(),
  }),
]);

export type LocalizedString = z.infer<typeof LocalizedStringSchema>;

export function getLocalized(
  val: LocalizedString | undefined,
  lang: string = 'ru'
): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return lang === 'en' && val.en ? val.en : (val.ru || '');
}

export const LessonPracticeTaskSchema = z.object({
  id: z.string().optional(),
  title: LocalizedStringSchema,
  taskType: z.enum([
    'implement_class',
    'train_model',
    'write_function',
    'data_pipeline',
    'algorithm',
    'system_design',
  ]).default('implement_class'),
  taskMode: z.enum(['interactive_ide', 'local_project']).default('interactive_ide').optional(),
  language: z.enum(['python', 'sql']).default('python').optional(),
  description: LocalizedStringSchema,
  starterCode: z.string(),
  solutionCode: z.string(),
  hints: z.array(LocalizedStringSchema).optional(),
  testCases: z.array(z.object({
    name: LocalizedStringSchema,
    input: z.string().optional(),
    expectedOutput: z.string().optional(),
    testCode: z.string().optional(),
    codeSnippet: z.string().optional(),
  })).optional(),
  expectedOutput: z.string().optional(),
  explanation: LocalizedStringSchema.optional(),
  // Local/Colab project specific fields
  datasetInfo: z.object({
    name: z.string(),
    url: z.string().optional(),
    description: LocalizedStringSchema.optional(),
  }).optional(),
  steps: z.array(LocalizedStringSchema).optional(),
  targetBenchmark: LocalizedStringSchema.optional(),
  colabSnippet: z.string().optional(),
});

export type LessonPracticeTask = z.infer<typeof LessonPracticeTaskSchema>;

export const LessonSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  title: LocalizedStringSchema,
  order: z.number(),
  estimatedMinutes: z.number(),
  draft: z.boolean().default(true),
  theoryMarkdown: LocalizedStringSchema,
  svgDiagram: z.string().optional(),
  commonMistakes: z.array(LocalizedStringSchema).optional(),
  practicalTask: LessonPracticeTaskSchema.optional(),
  checkpointQuiz: z.array(
    z.object({
      id: z.string(),
      question: LocalizedStringSchema,
      options: z.array(LocalizedStringSchema),
      correctAnswer: z.number(), // index 0..n
      explanation: LocalizedStringSchema,
    })
  ).optional(),
});

export type Lesson = z.infer<typeof LessonSchema>;

// Discriminated union for Card (flip | cloze)
export const CardSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    moduleId: z.string(),
    lessonId: z.string().optional(),
    type: z.literal('flip'),
    front: LocalizedStringSchema,
    back: LocalizedStringSchema,
    tags: z.array(z.string()).default([]),
  }),
  z.object({
    id: z.string(),
    moduleId: z.string(),
    lessonId: z.string().optional(),
    type: z.literal('cloze'),
    clozeText: LocalizedStringSchema, // e.g. "Градиентный спуск минимизирует {{c1::функцию потерь}}."
    answer: LocalizedStringSchema,
    tags: z.array(z.string()).default([]),
  }),
]);

export type Card = z.infer<typeof CardSchema>;

// Quiz Question schema
export const QuizQuestionSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('single'),
    question: LocalizedStringSchema,
    options: z.array(LocalizedStringSchema),
    correctAnswer: z.number(),
    explanation: LocalizedStringSchema,
    tag: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('multiple'),
    question: LocalizedStringSchema,
    options: z.array(LocalizedStringSchema),
    correctAnswers: z.array(z.number()),
    explanation: LocalizedStringSchema,
    tag: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('numeric'),
    question: LocalizedStringSchema,
    numericAnswer: z.number(),
    tolerance: z.number().default(0.01),
    explanation: LocalizedStringSchema,
    tag: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('formula'),
    question: LocalizedStringSchema,
    formulaAnswer: z.string(), // normalized comparison
    explanation: LocalizedStringSchema,
    tag: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('code_fill'),
    question: LocalizedStringSchema,
    codeSnippet: z.string(), // Code snippet containing `___` placeholder
    options: z.array(z.string()),
    correctAnswer: z.number(), // index in options
    explanation: LocalizedStringSchema,
    tag: z.string().optional(),
    language: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  }),
]);

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

// Backup Zod Schema
export const BackupSchema = z.object({
  schemaVersion: z.number(),
  contentVersion: z.string(),
  exportedAt: z.string(),
  profiles: z.array(z.any()),
  cardStates: z.array(z.any()),
  reviewLogs: z.array(z.any()),
  quizAttempts: z.array(z.any()),
  lessonProgress: z.array(z.any()),
  xpEvents: z.array(z.any()),
  achievements: z.array(z.any()),
  streakState: z.array(z.any()),
  speedrunRecords: z.array(z.any()),
  settings: z.array(z.any()),
  meta: z.array(z.any()),
});

export type BackupData = z.infer<typeof BackupSchema>;
