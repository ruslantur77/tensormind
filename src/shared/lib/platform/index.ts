import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export interface IHapticsService {
  light(): Promise<void>;
  medium(): Promise<void>;
  success(): Promise<void>;
  error(): Promise<void>;
}

export interface IStatusBarService {
  setStyle(isDark: boolean): Promise<void>;
  setBackgroundColor(hexColor: string): Promise<void>;
}

export interface IBackupService {
  exportJson(filename: string, jsonString: string): Promise<boolean>;
  pickAndReadJson(): Promise<string | null>;
}

// Capacitor implementation
class CapacitorHapticsService implements IHapticsService {
  async light(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Ignore if not supported
    }
  }

  async medium(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Ignore
    }
  }

  async success(): Promise<void> {
    try {
      await Haptics.notification({ type: 'SUCCESS' as any });
    } catch {
      // Ignore
    }
  }

  async error(): Promise<void> {
    try {
      await Haptics.notification({ type: 'ERROR' as any });
    } catch {
      // Ignore
    }
  }
}

// Web fallback implementation
class WebHapticsService implements IHapticsService {
  async light(): Promise<void> {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
  }

  async medium(): Promise<void> {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }

  async success(): Promise<void> {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 40, 30]);
    }
  }

  async error(): Promise<void> {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  }
}

class CapacitorStatusBarService implements IStatusBarService {
  async setStyle(isDark: boolean): Promise<void> {
    try {
      await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
    } catch {
      // Ignore
    }
  }

  async setBackgroundColor(hexColor: string): Promise<void> {
    try {
      await StatusBar.setBackgroundColor({ color: hexColor });
    } catch {
      // Ignore
    }
  }
}

class WebStatusBarService implements IStatusBarService {
  async setStyle(isDark: boolean): Promise<void> {
    const meta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (meta) {
      meta.setAttribute('content', isDark ? 'black-translucent' : 'default');
    }
  }

  async setBackgroundColor(hexColor: string): Promise<void> {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', hexColor);
    }
  }
}

class CapacitorBackupService implements IBackupService {
  async exportJson(filename: string, jsonString: string): Promise<boolean> {
    try {
      const result = await Filesystem.writeFile({
        path: filename,
        data: jsonString,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      if (await Share.canShare().then(r => r.value).catch(() => false)) {
        await Share.share({
          title: 'TensorMind Backup',
          text: 'TensorMind progress backup',
          url: result.uri,
          dialogTitle: 'Сохранить резервную копию',
        });
        return true;
      }
      return true;
    } catch (e) {
      console.warn('Capacitor share fallback to web download', e);
      return new WebBackupService().exportJson(filename, jsonString);
    }
  }

  async pickAndReadJson(): Promise<string | null> {
    // For file picker on mobile web / Android webview
    return new WebBackupService().pickAndReadJson();
  }
}

class WebBackupService implements IBackupService {
  async exportJson(filename: string, jsonString: string): Promise<boolean> {
    try {
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Try Web Share API with files if supported
      if (typeof navigator !== 'undefined' && navigator.canShare) {
        const file = new File([blob], filename, { type: 'application/json' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'TensorMind Backup',
              text: 'TensorMind progress backup',
            });
            return true;
          } catch (shareErr: any) {
            if (shareErr.name === 'AbortError') return false;
          }
        }
      }

      // Classic Blob download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    } catch (err) {
      console.error('Failed to export JSON', err);
      return false;
    }
  }

  pickAndReadJson(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        try {
          const text = await file.text();
          resolve(text);
        } catch (e) {
          console.error('Failed to read file', e);
          resolve(null);
        }
      };
      input.oncancel = () => resolve(null);
      input.click();
    });
  }
}

const isNative = Capacitor.isNativePlatform();

export const platform = {
  isNative,
  haptics: isNative ? new CapacitorHapticsService() : new WebHapticsService(),
  statusBar: isNative ? new CapacitorStatusBarService() : new WebStatusBarService(),
  backup: isNative ? new CapacitorBackupService() : new WebBackupService(),
};
