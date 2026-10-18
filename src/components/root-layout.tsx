import { HeadContent, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/contexts/theme-context';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PrivacyNotice } from '@/components/privacy-notice';
import { PwaReloadPrompt } from '@/components/pwa-reload-prompt';
import { PwaInstallPrompt } from '@/components/pwa-install-prompt';
import { OfflineIndicator } from '@/components/offline-indicator';
import { useTranslation } from 'react-i18next';

export const RootLayout = () => {
    const { t } = useTranslation();

    return (
        <>
            <HeadContent />
            <ThemeProvider defaultTheme='system'>
                <a
                    href='#main-content'
                    className='focus:bg-background focus:text-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-lg focus:ring-2'
                >
                    {t('accessibility.skipToContent')}
                </a>
                <div className='bg-background text-foreground min-h-screen transition-colors'>
                    <main id='main-content' className='flex-1'>
                        <ErrorBoundary>
                            <Outlet />
                        </ErrorBoundary>
                    </main>
                </div>
                <OfflineIndicator />
                <PrivacyNotice />
                <PwaInstallPrompt />
                <PwaReloadPrompt />
            </ThemeProvider>
        </>
    );
};
