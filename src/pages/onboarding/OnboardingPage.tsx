import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import { GlassPanel } from '@/shared/ui/GlassPanel';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { profileRepository } from '@/entities/profile/model/repository';
import { streakRepository } from '@/entities/streak/model/repository';
import { platform } from '@/shared/lib/platform';

export const OnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<number>(15);
  const [nameError, setNameError] = useState('');

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError(t('onboarding.name_error'));
      platform.haptics.error();
      return;
    }

    await profileRepository.createProfile(name, selectedGoal);
    await streakRepository.recordActivityToday();
    platform.haptics.success();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Icon & Welcome */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-200 dark:border-white/20 mx-auto">
            <img
              src="/logo.png"
              alt="TensorMind"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {t('onboarding.step1_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('onboarding.step1_subtitle')}
          </p>
        </div>

        <GlassPanel glow className="p-6">
          <form onSubmit={handleStart} className="space-y-5">
            {/* Name Input */}
            <Input
              label={t('onboarding.name_label')}
              placeholder={t('onboarding.name_placeholder')}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              error={nameError}
              autoFocus
            />

            {/* Daily Goal Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                {t('onboarding.goal_title')}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: 5, label: t('onboarding.goal_cards_light'), tag: 'Базовый' },
                  { value: 15, label: t('onboarding.goal_cards_option'), tag: 'Рекомендуется' },
                  { value: 30, label: t('onboarding.goal_cards_intense'), tag: 'Интенсив' },
                ].map((item) => (
                  <div
                    key={item.value}
                    onClick={() => {
                      platform.haptics.light();
                      setSelectedGoal(item.value);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      selectedGoal === item.value
                        ? 'border-sky-400 bg-sky-500/15 text-white'
                        : 'border-white/10 hover:border-white/20 bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedGoal === item.value
                            ? 'border-sky-400 bg-sky-400'
                            : 'border-slate-500'
                        }`}
                      >
                        {selectedGoal === item.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                    </div>
                    {item.tag && (
                      <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {t('onboarding.start_btn')}
            </Button>
          </form>
        </GlassPanel>
      </div>
    </div>
  );
};
