import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { render, screen } from '@/test/test-utils';
import { OfflineIndicator } from './offline-indicator';

describe('OfflineIndicator', () => {
    const originalOnLine = navigator.onLine;

    beforeEach(() => {
        Object.defineProperty(navigator, 'onLine', {
            value: true,
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(navigator, 'onLine', {
            value: originalOnLine,
            writable: true,
            configurable: true,
        });
    });

    it('should not render when online', () => {
        render(<OfflineIndicator />);

        expect(
            screen.queryByText("You're offline — all features still work"),
        ).not.toBeInTheDocument();
    });

    it('should render when initially offline', () => {
        Object.defineProperty(navigator, 'onLine', { value: false });

        render(<OfflineIndicator />);

        expect(screen.getByText("You're offline — all features still work")).toBeInTheDocument();
    });

    it('should show banner when going offline', () => {
        render(<OfflineIndicator />);

        expect(
            screen.queryByText("You're offline — all features still work"),
        ).not.toBeInTheDocument();

        act(() => {
            Object.defineProperty(navigator, 'onLine', { value: false });
            window.dispatchEvent(new Event('offline'));
        });

        expect(screen.getByText("You're offline — all features still work")).toBeInTheDocument();
    });

    it('should hide banner when coming back online', () => {
        Object.defineProperty(navigator, 'onLine', { value: false });

        render(<OfflineIndicator />);

        expect(screen.getByText("You're offline — all features still work")).toBeInTheDocument();

        act(() => {
            Object.defineProperty(navigator, 'onLine', { value: true });
            window.dispatchEvent(new Event('online'));
        });

        expect(
            screen.queryByText("You're offline — all features still work"),
        ).not.toBeInTheDocument();
    });
});
