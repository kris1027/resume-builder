import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { render, screen, userEvent } from '@/test/test-utils';
import { PwaInstallPrompt } from './pwa-install-prompt';
import { safeStorage } from '@/lib/storage';

const fireBeforeInstallPrompt = () => {
    const promptEvent = new Event('beforeinstallprompt') as Event & {
        prompt: () => Promise<void>;
    };
    promptEvent.prompt = vi.fn().mockResolvedValue(undefined);
    act(() => {
        window.dispatchEvent(promptEvent);
    });
    return promptEvent;
};

describe('PwaInstallPrompt', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should not render when no beforeinstallprompt event has fired', () => {
        render(<PwaInstallPrompt />);

        expect(screen.queryByRole('button', { name: 'Install app' })).not.toBeInTheDocument();
    });

    it('should render when beforeinstallprompt event fires', () => {
        render(<PwaInstallPrompt />);

        fireBeforeInstallPrompt();

        expect(screen.getByRole('button', { name: 'Install app' })).toBeInTheDocument();
        expect(
            screen.getByText('Install Resume Builder for quick access and offline use'),
        ).toBeInTheDocument();
    });

    it('should not render when previously dismissed', () => {
        safeStorage.setItem('pwaInstallDismissed', 'true');

        render(<PwaInstallPrompt />);

        fireBeforeInstallPrompt();

        expect(screen.queryByRole('button', { name: 'Install app' })).not.toBeInTheDocument();
    });

    it('should call prompt and hide when install is clicked', async () => {
        const user = userEvent.setup();

        render(<PwaInstallPrompt />);

        const promptEvent = fireBeforeInstallPrompt();

        const installButtons = screen.getAllByRole('button', { name: 'Install app' });
        await user.click(installButtons[0]);

        expect(promptEvent.prompt).toHaveBeenCalled();
        expect(screen.queryByRole('button', { name: 'Install app' })).not.toBeInTheDocument();
    });

    it('should persist dismissal and hide when close is clicked', async () => {
        const user = userEvent.setup();

        render(<PwaInstallPrompt />);

        fireBeforeInstallPrompt();

        await user.click(screen.getByRole('button', { name: 'Close' }));

        expect(screen.queryByRole('button', { name: 'Install app' })).not.toBeInTheDocument();
        expect(safeStorage.getItem('pwaInstallDismissed')).toBe('true');
    });
});
