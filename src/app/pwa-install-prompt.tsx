import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeStorage } from '@/lib/storage';

const STORAGE_KEY = 'pwaInstallDismissed';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export const PwaInstallPrompt = () => {
    const { t } = useTranslation();
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        if (safeStorage.getItem(STORAGE_KEY)) return;

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setPromptEvent(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstall = async () => {
        if (!promptEvent) return;
        await promptEvent.prompt();
        setPromptEvent(null);
    };

    const handleDismiss = () => {
        safeStorage.setItem(STORAGE_KEY, 'true');
        setPromptEvent(null);
    };

    if (!promptEvent) return null;

    return (
        <div className='fixed right-0 bottom-0 left-0 z-50 border-t border-white/20 bg-white/95 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/95'>
            <div className='container mx-auto flex items-center gap-4 px-4 py-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
                    <Download className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium dark:text-gray-100'>{t('pwa.install')}</p>
                    <p className='text-muted-foreground text-xs'>{t('pwa.installDescription')}</p>
                </div>
                <div className='flex gap-2'>
                    <Button size='sm' onClick={handleInstall}>
                        {t('pwa.install')}
                    </Button>
                    <Button size='sm' variant='outline' onClick={handleDismiss}>
                        {t('pwa.close')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
