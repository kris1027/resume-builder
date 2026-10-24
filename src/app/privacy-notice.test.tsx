import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { PrivacyNotice } from './privacy-notice';
import { safeStorage } from '@/lib/storage';

describe('PrivacyNotice', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should show the privacy notice when not previously accepted', () => {
        render(<PrivacyNotice />);

        expect(screen.getByText('Your data stays private')).toBeInTheDocument();
        expect(
            screen.getByText(
                'All your resume data is stored locally in your browser. Nothing is sent to any server.',
            ),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument();
    });

    it('should not show the privacy notice when previously accepted', () => {
        safeStorage.setItem('privacyNoticeAccepted', 'true');

        render(<PrivacyNotice />);

        expect(screen.queryByText('Your data stays private')).not.toBeInTheDocument();
    });

    it('should dismiss and persist acceptance when "Got it" is clicked', async () => {
        render(<PrivacyNotice />);

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: 'Got it' }));

        expect(screen.queryByText('Your data stays private')).not.toBeInTheDocument();
        expect(safeStorage.getItem('privacyNoticeAccepted')).toBe('true');
    });
});
