import { db, AchievementRecord } from '@/shared/lib/db';
import { fireCelebrationConfetti } from '@/shared/ui/Confetti';
import { platform } from '@/shared/lib/platform';

export interface AchievementMeta {
  id: string;
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
  icon: string;
  xpReward: number;
}

export const ACHIEVEMENTS_LIST: AchievementMeta[] = [
  {
    id: 'first_lesson',
    titleRu: 'Первый шаг в ML',
    titleEn: 'First Step in ML',
    descRu: 'Завершить свой первый урок по теории',
    descEn: 'Complete your first theory lesson',
    icon: 'first_lesson',
    xpReward: 50,
  },
  {
    id: 'python_guru',
    titleRu: 'Питон-мастер',
    titleEn: 'Python Guru',
    descRu: 'Завершить модуль «Основы Python для Data Science и ML»',
    descEn: 'Complete the "Python Foundations for Data Science & ML" module',
    icon: 'python_guru',
    xpReward: 120,
  },
  {
    id: 'lessons_5',
    titleRu: 'Жажда знаний',
    titleEn: 'Avid Learner',
    descRu: 'Успешно завершить 5 уроков по теории',
    descEn: 'Complete 5 theory lessons',
    icon: 'lessons_5',
    xpReward: 80,
  },
  {
    id: 'lessons_15',
    titleRu: 'Теоретик Data Science',
    titleEn: 'ML Scholar',
    descRu: 'Завершить 15 уроков по теории машинного обучения',
    descEn: 'Complete 15 theory lessons',
    icon: 'lessons_15',
    xpReward: 200,
  },
  {
    id: 'cards_master_25',
    titleRu: 'Начинающий мнемонист',
    titleEn: 'Junior Mnemonist',
    descRu: 'Повторить 25 карточек с помощью SRS',
    descEn: 'Review 25 flashcards using SRS',
    icon: 'cards_master_25',
    xpReward: 50,
  },
  {
    id: 'cards_master_100',
    titleRu: 'Мастер тензоров',
    titleEn: 'Tensor Master',
    descRu: 'Повторить 100 карточек',
    descEn: 'Review 100 flashcards',
    icon: 'cards_master_100',
    xpReward: 150,
  },
  {
    id: 'cards_master_250',
    titleRu: 'Нейроархивариус',
    titleEn: 'Memory Titan',
    descRu: 'Повторить 250 карточек с помощью SRS',
    descEn: 'Review 250 flashcards using SRS',
    icon: 'cards_master_250',
    xpReward: 300,
  },
  {
    id: 'streak_3',
    titleRu: 'Набирая обороты',
    titleEn: 'Building Momentum',
    descRu: 'Заниматься 3 дня подряд',
    descEn: 'Study 3 days in a row',
    icon: 'streak_3',
    xpReward: 50,
  },
  {
    id: 'streak_7',
    titleRu: 'Железная дисциплина',
    titleEn: 'Unstoppable Focus',
    descRu: 'Удержать стрик 7 дней подряд',
    descEn: 'Maintain a 7-day study streak',
    icon: 'streak_7',
    xpReward: 200,
  },
  {
    id: 'streak_14',
    titleRu: 'Несокрушимая воля',
    titleEn: '14-Day Legend',
    descRu: 'Удержать стрик 14 дней подряд',
    descEn: 'Maintain a 14-day study streak',
    icon: 'streak_14',
    xpReward: 350,
  },
  {
    id: 'streak_30',
    titleRu: 'Месяц дисциплины',
    titleEn: '30-Day Master',
    descRu: 'Заниматься каждый день на протяжении 30 дней подряд',
    descEn: 'Maintain a 30-day study streak without missing a day',
    icon: 'streak_30',
    xpReward: 500,
  },
  {
    id: 'streak_100',
    titleRu: 'Легенда машинного обучения',
    titleEn: 'Centurion of ML',
    descRu: 'Удержать стрик 100 дней подряд — абсолютная преданность цели',
    descEn: 'Maintain a 100-day study streak — true mastery of habit',
    icon: 'streak_100',
    xpReward: 1000,
  },
  {
    id: 'perfect_quiz',
    titleRu: 'Абсолютная точность',
    titleEn: 'Flawless Precision',
    descRu: 'Сдать любой тест на 100% правильных ответов',
    descEn: 'Complete any quiz with a 100% score',
    icon: 'perfect_quiz',
    xpReward: 75,
  },
  {
    id: 'quiz_veteran_5',
    titleRu: 'Ветеран тестов',
    titleEn: 'Quiz Veteran',
    descRu: 'Успешно пройти 5 проверочных тестов',
    descEn: 'Complete 5 quiz assessments',
    icon: 'quiz_veteran_5',
    xpReward: 100,
  },
  {
    id: 'exam_passed',
    titleRu: 'Магистр ML',
    titleEn: 'ML Graduate',
    descRu: 'Сдать экзамен с результатом от 80%',
    descEn: 'Pass an exam with 80% or higher',
    icon: 'exam_passed',
    xpReward: 250,
  },
  {
    id: 'speedrun_ace',
    titleRu: 'Спидраннер',
    titleEn: 'Speedrunner',
    descRu: 'Набрать от 300 очков в режиме спидрана',
    descEn: 'Score at least 300 points in speedrun',
    icon: 'speedrun_ace',
    xpReward: 100,
  },
  {
    id: 'speedrun_500',
    titleRu: 'Гипердрайв',
    titleEn: 'Hyperdrive',
    descRu: 'Набрать от 500 очков в режиме спидрана',
    descEn: 'Score at least 500 points in speedrun',
    icon: 'speedrun_500',
    xpReward: 150,
  },
  {
    id: 'mlops_architect',
    titleRu: 'MLOps Архитектор',
    titleEn: 'MLOps Architect',
    descRu: 'Завершить все уроки модуля «MLOps и Продакшн»',
    descEn: 'Complete all lessons in "MLOps & Production" module',
    icon: 'mlops_architect',
    xpReward: 150,
  },
  {
    id: 'backup_safe',
    titleRu: 'Хранитель данных',
    titleEn: 'Data Custodian',
    descRu: 'Сделать первый бэкап прогресса в JSON',
    descEn: 'Export your first JSON progress backup',
    icon: 'backup_safe',
    xpReward: 30,
  },
];

export const achievementRepository = {
  async getUnlocked(): Promise<AchievementRecord[]> {
    return await db.achievements.toArray();
  },

  async isUnlocked(achievementId: string): Promise<boolean> {
    const record = await db.achievements.get(achievementId);
    return !!record;
  },

  async unlock(achievementId: string): Promise<boolean> {
    const existing = await db.achievements.get(achievementId);
    if (existing) return false;

    const record: AchievementRecord = {
      achievementId,
      unlockedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.achievements.put(record);

    platform.haptics.success();
    fireCelebrationConfetti();
    return true;
  },
};
