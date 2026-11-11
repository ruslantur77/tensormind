import React from 'react';
import {
  Activity,
  Award,
  Bot,
  Box,
  Brain,
  Camera,
  CheckCircle,
  CheckCheck,
  Crop,
  Crown,
  Cpu,
  Database,
  Flame,
  FlaskConical,
  Gamepad2,
  GitBranch,
  GraduationCap,
  LineChart,
  MapPin,
  Medal,
  Network,
  Percent,
  Play,
  Rocket,
  RotateCcw,
  Save,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  Timer,
  Trees,
  Trophy,
  Wrench,
  Zap,
} from 'lucide-react';

export const ModuleIcon: React.FC<{ moduleId: string; className?: string }> = ({
  moduleId,
  className = 'w-6 h-6',
}) => {
  const baseClass = `${className} shrink-0`;
  switch (moduleId) {
    case 'python-foundations':
      return <Terminal className={`${baseClass} text-amber-500 dark:text-amber-400`} />;
    case 'combinatorics':
      return <Box className={`${baseClass} text-cyan-500 dark:text-cyan-400`} />;
    case 'linear-models':
      return <LineChart className={`${baseClass} text-sky-500 dark:text-sky-400`} />;
    case 'probabilistic':
      return <Percent className={`${baseClass} text-indigo-500 dark:text-indigo-400`} />;
    case 'metric-methods':
      return <MapPin className={`${baseClass} text-emerald-500 dark:text-emerald-400`} />;
    case 'svm-pca':
      return <Zap className={`${baseClass} text-amber-500 dark:text-amber-400`} />;
    case 'decision-trees':
      return <Trees className={`${baseClass} text-teal-500 dark:text-teal-400`} />;
    case 'boosting-nn':
      return <Brain className={`${baseClass} text-purple-500 dark:text-purple-400`} />;
    case 'game-theory':
      return <Target className={`${baseClass} text-rose-500 dark:text-rose-400`} />;
    case 'pytorch-pandas-sklearn':
      return <Flame className={`${baseClass} text-orange-500 dark:text-orange-400`} />;
    case 'data-wrangling-eda':
      return <Database className={`${baseClass} text-blue-500 dark:text-blue-400`} />;
    case 'ab-testing-experimentation':
      return <FlaskConical className={`${baseClass} text-indigo-500 dark:text-indigo-400`} />;
    case 'data-labeling-cv-audio':
      return <Crop className={`${baseClass} text-emerald-500 dark:text-emerald-400`} />;
    case 'mlops-production':
      return <GitBranch className={`${baseClass} text-violet-500 dark:text-violet-400`} />;
    case 'recsys':
      return <Sparkles className={`${baseClass} text-pink-500 dark:text-pink-400`} />;
    case 'ai-assisted-dev-agents':
      return <Bot className={`${baseClass} text-cyan-500 dark:text-cyan-400`} />;
    case 'ml-system-design':
      return <Network className={`${baseClass} text-emerald-500 dark:text-emerald-400`} />;
    case 'time-series-forecasting':
      return <Timer className={`${baseClass} text-amber-500 dark:text-amber-400`} />;
    case 'model-optimization-inference':
      return <Cpu className={`${baseClass} text-purple-500 dark:text-purple-400`} />;
    case 'ai-safety-ethics':
      return <ShieldCheck className={`${baseClass} text-emerald-500 dark:text-emerald-400`} />;
    case 'reinforcement-learning':
      return <Gamepad2 className={`${baseClass} text-amber-500 dark:text-amber-400`} />;
    case 'computer-vision':
      return <Camera className={`${baseClass} text-rose-500 dark:text-rose-400`} />;
    default:
      return <Activity className={`${baseClass} text-sky-500 dark:text-sky-400`} />;
  }
};

export const AchievementIcon: React.FC<{ achievementId: string; className?: string }> = ({
  achievementId,
  className = 'w-5 h-5',
}) => {
  const baseClass = `${className} shrink-0`;
  switch (achievementId) {
    case 'first_lesson':
      return <Play className={`${baseClass} text-sky-500 dark:text-sky-400 fill-current`} />;
    case 'python_guru':
      return <Terminal className={`${baseClass} text-amber-500 dark:text-amber-400`} />;
    case 'lessons_5':
      return <Award className={`${baseClass} text-emerald-500 dark:text-emerald-400`} />;
    case 'lessons_15':
      return <GraduationCap className={`${baseClass} text-indigo-500 dark:text-indigo-400`} />;
    case 'cards_master_25':
      return <Brain className={`${baseClass} text-indigo-500 dark:text-indigo-400`} />;
    case 'cards_master_100':
      return <Zap className={`${baseClass} text-amber-500 dark:text-amber-400`} />;
    case 'cards_master_250':
      return <Sparkles className={`${baseClass} text-purple-500 dark:text-purple-400`} />;
    case 'streak_3':
      return <Flame className={`${baseClass} text-orange-500 dark:text-orange-400 fill-current`} />;
    case 'streak_7':
      return <Medal className={`${baseClass} text-yellow-500 dark:text-yellow-400`} />;
    case 'streak_14':
      return <Crown className={`${baseClass} text-amber-500 dark:text-amber-400`} />;
    case 'streak_30':
      return <Flame className={`${baseClass} text-rose-500 dark:text-rose-400 fill-current drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]`} />;
    case 'streak_100':
      return <Trophy className={`${baseClass} text-amber-400 dark:text-amber-300 fill-current drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]`} />;
    case 'perfect_quiz':
      return <Target className={`${baseClass} text-emerald-500 dark:text-emerald-400`} />;
    case 'quiz_veteran_5':
      return <CheckCheck className={`${baseClass} text-cyan-500 dark:text-cyan-400`} />;
    case 'exam_passed':
      return <GraduationCap className={`${baseClass} text-purple-500 dark:text-purple-400`} />;
    case 'speedrun_ace':
      return <Timer className={`${baseClass} text-rose-500 dark:text-rose-400`} />;
    case 'speedrun_500':
      return <Rocket className={`${baseClass} text-rose-500 dark:text-rose-400`} />;
    case 'backup_safe':
      return <Save className={`${baseClass} text-cyan-500 dark:text-cyan-400`} />;
    case 'mlops_architect':
      return <Server className={`${baseClass} text-violet-500 dark:text-violet-400`} />;
    default:
      return <Trophy className={`${baseClass} text-amber-500 dark:text-amber-400`} />;
  }
};
