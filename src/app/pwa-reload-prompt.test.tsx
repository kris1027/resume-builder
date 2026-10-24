import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { PwaReloadPrompt } from './pwa-reload-prompt';

const mockSetOfflineReady = vi.fn();
const mockSetNeedRefresh = vi.fn();
const mockUpdateServiceWorker = vi.fn();

let mockOfflineReady = false;
let mockNeedRefresh = false;

vi.mock('@/test/pwa-register-mock', () => ({
    useRegisterSW: () => ({
        offlineReady: [mockOfflineReady, mockSetOfflineReady],
        needRefresh: [mockNeedRefresh, mockSetNeedRefresh],
        updateServiceWorker: mockUpdateServiceWorker,
    }),
}));

describe('PwaReloadPrompt', () => {
    beforeEach(() => {
        mockOfflineReady = false;
        mockNeedRefresh = false;
        vi.clearAllMocks();
    });

    it('should not render when neither offline ready nor needs refresh', () => {
        render(<PwaReloadPrompt />);

        expect(screen.queryByText('App ready to work offline')).not.toBeInTheDocument();
        expect(screen.queryByText('New version available')).not.toBeInTheDocument();
    });

    it('should show offline ready message', () => {
        mockOfflineReady = true;

        render(<PwaReloadPrompt />);

        expect(screen.getByText('App ready to work offline')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Reload' })).not.toBeInTheDocument();
    });

    it('should show new version message with reload button', () => {
        mockNeedRefresh = true;

        render(<PwaReloadPrompt />);

        expect(screen.getByText('New version available')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    });

    it('should call updateServiceWorker when reload is clicked', async () => {
        mockNeedRefresh = true;
        const user = userEvent.setup();

        render(<PwaReloadPrompt />);

        await user.click(screen.getByRole('button', { name: 'Reload' }));

        expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
    });

    it('should dismiss when close is clicked', async () => {
        mockNeedRefresh = true;
        const user = userEvent.setup();

        render(<PwaReloadPrompt />);

        await user.click(screen.getByRole('button', { name: 'Close' }));

        expect(mockSetOfflineReady).toHaveBeenCalledWith(false);
        expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);
    });

    it('should auto-dismiss offline ready after 5 seconds', () => {
        vi.useFakeTimers();
        mockOfflineReady = true;

        render(<PwaReloadPrompt />);

        expect(screen.getByText('App ready to work offline')).toBeInTheDocument();

        vi.advanceTimersByTime(5000);

        expect(mockSetOfflineReady).toHaveBeenCalledWith(false);

        vi.useRealTimers();
    });
});
