import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeStorage } from '@/lib/storage';

const STORAGE_KEY = 'privacyNoticeAccepted';

export const PrivacyNotice = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(() => !safeStorage.getItem(STORAGE_KEY));

    const handleAccept = () => {
        safeStorage.setItem(STORAGE_KEY, 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className='fixed right-0 bottom-0 left-0 z-50 border-t border-white/20 bg-white/95 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/95'>
            <div className='container mx-auto flex items-center gap-4 px-4 py-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30'>
                    <Shield className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='text-sm font-medium dark:text-gray-100'>{t('privacy.notice')}</p>
                    <p className='text-muted-foreground text-xs'>{t('privacy.details')}</p>
                </div>
                <Button size='sm' variant='outline' onClick={handleAccept}>
                    {t('privacy.accept')}
                </Button>
            </div>
        </div>
    );
};
