import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator = () => {
    const { t } = useTranslation();
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className='fixed top-0 right-0 left-0 z-50 bg-amber-500 text-white'>
            <div className='container mx-auto flex items-center justify-center gap-2 px-4 py-2'>
                <WifiOff className='h-4 w-4' />
                <p className='text-sm font-medium'>{t('pwa.offline')}</p>
            </div>
        </div>
    );
};
