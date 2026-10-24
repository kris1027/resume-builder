import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import './index.css';
import '@/i18n/config';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error ?? event.message);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <ErrorBoundary>
                <RouterProvider router={router} />
            </ErrorBoundary>
        </StrictMode>,
    );
}
