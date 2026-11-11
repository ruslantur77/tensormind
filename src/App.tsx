import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/app/layouts/MainLayout';
import { HomePage } from '@/pages/home/HomePage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { ModulePage } from '@/pages/module/ModulePage';
import { LessonPage } from '@/pages/lesson/LessonPage';
import { PracticePage } from '@/pages/practice/PracticePage';
import { QuizPage } from '@/pages/quiz/QuizPage';
import { StatsPage } from '@/pages/stats/StatsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { GlossaryPage } from '@/pages/glossary/GlossaryPage';
import { initializeDatabase } from '@/shared/lib/db';
import { profileRepository } from '@/entities/profile/model/repository';
import { platform } from '@/shared/lib/platform';
import { applyTheme } from '@/shared/lib/theme';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    async function setupApp() {
      try {
        await initializeDatabase();
        const profile = await profileRepository.getProfile();
        if (profile) {
          setHasProfile(true);
          applyTheme(profile.theme || 'dark');
        } else {
          setHasProfile(false);
          applyTheme('dark');
        }
      } catch (err) {
        console.error('Failed to initialize app', err);
      } finally {
        setIsReady(true);
      }
    }

    setupApp();
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222426] text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-xl border border-white/20 flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="TensorMind"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-wider">
            TENSORMIND INITIALIZING...
          </span>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/module/:moduleId" element={<ModulePage />} />
          <Route path="/module/:moduleId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/cards" element={<PracticePage initialTab="cards" />} />
          <Route path="/speedrun" element={<PracticePage initialTab="speedrun" />} />
          <Route path="/exam" element={<PracticePage initialTab="exam" />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
