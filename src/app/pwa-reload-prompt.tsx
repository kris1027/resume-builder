import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PwaReloadPrompt = () => {
    const { t } = useTranslation();
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW();

    useEffect(() => {
        if (offlineReady) {
            const timer = setTimeout(() => setOfflineReady(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [offlineReady, setOfflineReady]);

    const handleClose = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (!offlineReady && !needRefresh) return null;

    return (
        <div className='fixed right-0 bottom-0 left-0 z-50 border-t border-white/20 bg-white/95 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/95'>
            <div className='container mx-auto flex items-center gap-4 px-4 py-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30'>
                    <RefreshCw className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                </div>
                <p className='min-w-0 flex-1 text-sm font-medium dark:text-gray-100'>
                    {offlineReady ? t('pwa.offlineReady') : t('pwa.newContent')}
                </p>
                <div className='flex gap-2'>
                    {needRefresh && (
                        <Button size='sm' onClick={() => updateServiceWorker(true)}>
                            {t('pwa.reload')}
                        </Button>
                    )}
                    <Button size='sm' variant='outline' onClick={handleClose}>
                        {t('pwa.close')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
