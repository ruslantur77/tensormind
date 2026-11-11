import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '@/shared/lib/pwa/usePWAInstall';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

export const PWAInstallButton: React.FC = () => {
  const { t } = useTranslation();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <Button
        variant="glass"
        size="sm"
        onClick={install}
        icon={<Download className="w-4 h-4 text-sky-400" />}
      >
        {t('app.install')}
      </Button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <Button
          variant="glass"
          size="sm"
          onClick={() => setShowIOSGuide(true)}
          icon={<Smartphone className="w-4 h-4 text-sky-400" />}
        >
          {t('app.install')}
        </Button>

        <Modal
          isOpen={showIOSGuide}
          onClose={() => setShowIOSGuide(false)}
          title={t('app.install_ios_title')}
        >
          <div className="space-y-4 text-sm text-slate-300">
            <p>{t('app.install_ios_desc')}</p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-white/10 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">1</span>
                <span>Нажмите иконку «Поделиться» (квадрат со стрелкой вверх)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">2</span>
                <span>Выберите пункт «На экран "Домой"»</span>
              </div>
            </div>
            <Button fullWidth variant="primary" onClick={() => setShowIOSGuide(false)}>
              {t('app.close')}
            </Button>
          </div>
        </Modal>
      </>
    );
  }

  return null;
};
