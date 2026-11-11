import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Globe,
  User,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Info,
  Smartphone,
} from 'lucide-react';
import { GlassPanel } from '@/shared/ui/GlassPanel';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { PWAInstallButton } from '@/widgets/pwa/PWAInstallButton';
import { profileRepository } from '@/entities/profile/model/repository';
import { backupManager } from '@/features/backup/model/backupManager';
import { contentRegistry } from '@/shared/content';
import { db } from '@/shared/lib/db';
import { APP_NAME, APP_VERSION, SCHEMA_VERSION, CONTENT_VERSION } from '@/shared/config';
import { platform } from '@/shared/lib/platform';
import { applyTheme } from '@/shared/lib/theme';

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [name, setName] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [isSaved, setIsSaved] = useState(false);

  // Backup & Import
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [pendingFileContent, setPendingFileContent] = useState<string | null>(null);

  // Orphaned
  const [orphanedCards, setOrphanedCards] = useState<string[]>([]);
  const [orphanedLessons, setOrphanedLessons] = useState<string[]>([]);

  useEffect(() => {
    async function loadSettings() {
      const profile = await profileRepository.getProfile();
      if (profile) {
        setName(profile.name);
        setTheme(profile.theme || 'dark');
        setLanguage(profile.language || 'ru');
      }

      // Check orphaned
      const validCardIds = contentRegistry.getAllValidCardIds();
      const validLessonIds = contentRegistry.getAllValidLessonIds();
      const orphaned = await backupManager.getOrphanedItems(validCardIds, validLessonIds);
      setOrphanedCards(orphaned.orphanedCards);
      setOrphanedLessons(orphaned.orphanedLessons);
    }
    loadSettings();
  }, []);

  const handleSaveProfile = async () => {
    platform.haptics.light();
    await profileRepository.updateProfile({ name: name.trim() });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleThemeChange = async (newTheme: 'dark' | 'light' | 'system') => {
    platform.haptics.light();
    setTheme(newTheme);
    applyTheme(newTheme);
    await profileRepository.updateProfile({ theme: newTheme });
  };

  const handleLanguageChange = async (newLang: 'ru' | 'en') => {
    platform.haptics.light();
    setLanguage(newLang);
    await i18n.changeLanguage(newLang);
    await profileRepository.updateProfile({ language: newLang });
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const success = await backupManager.exportBackup();
      if (success) {
        setStatusMessage({ type: 'success', text: t('settings.backup_success') });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e?.message || 'Ошибка экспорта' });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePickImportFile = async () => {
    setStatusMessage(null);
    const content = await platform.backup.pickAndReadJson();
    if (!content) return;

    setPendingFileContent(content);
    setShowReplaceModal(true);
  };

  const handleExecuteImport = async (replaceAll: boolean) => {
    setShowReplaceModal(false);
    if (!pendingFileContent) return;

    const result = await backupManager.importBackup(pendingFileContent, replaceAll);
    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: `Импорт завершён! ${replaceAll ? 'Все данные заменены.' : `Объединено записей: ${result.mergedCount}`}`,
      });
      // Refresh profile state
      const p = await profileRepository.getProfile();
      if (p) {
        setName(p.name);
        setTheme(p.theme);
        setLanguage(p.language);
        i18n.changeLanguage(p.language);
        document.documentElement.setAttribute('data-theme', p.theme);
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Ошибка при валидации файла бэкапа',
      });
    }
    setPendingFileContent(null);
  };

  const handleClearOrphaned = async () => {
    platform.haptics.light();
    await backupManager.clearOrphanedItems(orphanedCards, orphanedLessons);
    setOrphanedCards([]);
    setOrphanedLessons([]);
    setStatusMessage({ type: 'success', text: 'Устаревшие записи успешно очищены' });
  };

  const handleResetProgress = async () => {
    setShowResetModal(false);
    platform.haptics.error();
    await db.transaction('rw', [
      db.cardStates,
      db.reviewLogs,
      db.quizAttempts,
      db.lessonProgress,
      db.xpEvents,
      db.achievements,
      db.streakState,
      db.speedrunRecords,
    ], async () => {
      await db.cardStates.clear();
      await db.reviewLogs.clear();
      await db.quizAttempts.clear();
      await db.lessonProgress.clear();
      await db.xpEvents.clear();
      await db.achievements.clear();
      await db.speedrunRecords.clear();
      await db.streakState.put({
        id: 'current',
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        activeDates: [],
        updatedAt: new Date().toISOString(),
      });
    });
    setStatusMessage({ type: 'success', text: 'Весь прогресс был сброшен' });
  };

  const totalOrphaned = orphanedCards.length + orphanedLessons.length;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sky-600 dark:text-sky-400">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('settings.title')}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Управление профилем, темами и резервным копированием
          </p>
        </div>
      </div>

      {/* Status Alert Toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm animate-fade-in ${
            statusMessage.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="cursor-pointer text-current font-bold">
            ×
          </button>
        </div>
      )}

      {/* General Settings */}
      <GlassPanel className="p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{t('settings.general_section')}</span>
        </h3>

        {/* Name input */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              label={t('settings.user_name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleSaveProfile}
            disabled={!name.trim()}
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : t('settings.save')}
          </Button>
        </div>

        {/* Theme */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            {t('settings.theme')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition ${
                theme === 'dark'
                  ? 'border-sky-500 bg-sky-500/15 text-sky-950 dark:text-white ring-1 ring-sky-500/40'
                  : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-sky-500" />
              <span>{t('settings.theme_dark')}</span>
            </button>

            <button
              onClick={() => handleThemeChange('light')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition ${
                theme === 'light'
                  ? 'border-sky-500 bg-sky-500/15 text-sky-950 dark:text-white ring-1 ring-sky-500/40'
                  : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{t('settings.theme_light')}</span>
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('settings.language')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleLanguageChange('ru')}
              className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                language === 'ru'
                  ? 'border-sky-500 bg-sky-500/15 text-sky-950 dark:text-white ring-1 ring-sky-500/40'
                  : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Русский (RU)
            </button>

            <button
              onClick={() => handleLanguageChange('en')}
              className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                language === 'en'
                  ? 'border-sky-500 bg-sky-500/15 text-sky-950 dark:text-white ring-1 ring-sky-500/40'
                  : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* App Installation (PWA / Offline) */}
      <GlassPanel className="p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {language === 'en' ? 'Install Application (PWA)' : 'Установка приложения (PWA)'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {language === 'en'
                  ? 'Add TensorMind to your home screen for full offline training with zero delays.'
                  : 'Установите TensorMind на главный экран для мгновенного запуска и автономной работы без интернета.'}
              </p>
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-auto">
            <PWAInstallButton />
          </div>
        </div>
      </GlassPanel>

      {/* Backup & Persistence */}
      <GlassPanel className="p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t('settings.data_section')}</span>
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Ваш прогресс хранится исключительно локально в базе данных IndexedDB вашего браузера/устройства. Для сохранения и переноса между устройствами экспортируйте JSON-файл.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Button
            variant="glass"
            size="md"
            fullWidth
            onClick={handleExportBackup}
            disabled={isExporting}
            icon={<Download className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          >
            {t('settings.export_btn')}
          </Button>

          <Button
            variant="glass"
            size="md"
            fullWidth
            onClick={handlePickImportFile}
            icon={<Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          >
            {t('settings.import_btn')}
          </Button>
        </div>

        {/* Reset progress */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/10">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 dark:text-red-400 hover:bg-red-500/10"
            onClick={() => setShowResetModal(true)}
            icon={<Trash2 className="w-4 h-4" />}
          >
            {t('settings.reset_all_btn')}
          </Button>
        </div>
      </GlassPanel>

      {/* Orphaned Items Section */}
      {totalOrphaned > 0 && (
        <GlassPanel className="p-5 space-y-3 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
              {t('settings.orphaned_title')}
            </h4>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            {t('settings.orphaned_desc', { count: totalOrphaned })}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClearOrphaned}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            {t('settings.clear_orphaned_btn')}
          </Button>
        </GlassPanel>
      )}

      {/* About Box */}
      <GlassPanel className="p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{t('settings.about_section')}</span>
        </h3>
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <div className="flex justify-between">
            <span>Приложение:</span>
            <span className="text-slate-900 dark:text-slate-200">{APP_NAME}</span>
          </div>
          <div className="flex justify-between">
            <span>Версия приложения:</span>
            <span className="text-slate-900 dark:text-slate-200">{APP_VERSION}</span>
          </div>
          <div className="flex justify-between">
            <span>Схема IndexedDB:</span>
            <span className="text-slate-900 dark:text-slate-200">v{SCHEMA_VERSION}</span>
          </div>
          <div className="flex justify-between">
            <span>Версия контента:</span>
            <span className="text-slate-900 dark:text-slate-200">{CONTENT_VERSION}</span>
          </div>
          <div className="pt-2 flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-sans font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t('settings.offline_ready')}</span>
          </div>
        </div>
      </GlassPanel>

      {/* Import Choice Modal */}
      <Modal
        isOpen={showReplaceModal}
        onClose={() => setShowReplaceModal(false)}
        title="Параметры импорта бэкапа"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-300">
          <p>
            Как вы хотите применить резервную копию к текущей базе данных?
          </p>

          <div className="space-y-2">
            <div
              onClick={() => handleExecuteImport(false)}
              className="p-3.5 rounded-xl border border-sky-400/40 bg-sky-500/10 hover:bg-sky-500/20 cursor-pointer transition space-y-1"
            >
              <h5 className="font-bold text-sky-800 dark:text-sky-300">1. Умное объединение (Рекомендуется)</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Сравнит записи по дате обновления и оставит самые свежие, добавит отсутствующие попытки и XP.
              </p>
            </div>

            <div
              onClick={() => handleExecuteImport(true)}
              className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 cursor-pointer transition space-y-1"
            >
              <h5 className="font-bold text-red-800 dark:text-red-300">2. Опция «Заменить всё»</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Полностью очистит текущую базу данных устройства и восстановит её из файла.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Сброс прогресса"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-300">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {t('settings.reset_confirm')}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>
              Отмена
            </Button>
            <Button variant="danger" onClick={handleResetProgress}>
              Удалить всё
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
