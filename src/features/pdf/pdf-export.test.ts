import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/pdf/pdfjs-singleton', () => ({
    getPdfjs: vi.fn(),
}));

import { generateResumeFilename, countPdfPages } from './pdf-export';
import { getPdfjs } from '@/features/pdf/pdfjs-singleton';

describe('generateResumeFilename', () => {
    it('builds filename from first and last name', () => {
        expect(generateResumeFilename('John', 'Doe')).toBe('John-Doe-Resume.pdf');
    });

    it('uses only first name when last name is missing', () => {
        expect(generateResumeFilename('John')).toBe('John-Resume.pdf');
    });

    it('uses only last name when first name is missing', () => {
        expect(generateResumeFilename(undefined, 'Doe')).toBe('Doe-Resume.pdf');
    });

    it('falls back to "my" when no names provided', () => {
        expect(generateResumeFilename()).toBe('my-Resume.pdf');
    });

    it('falls back to "my" when names are empty strings', () => {
        expect(generateResumeFilename('', '')).toBe('my-Resume.pdf');
    });
});

describe('countPdfPages', () => {
    function makeGetDocument(numPages: number) {
        return vi.fn().mockReturnValue({
            promise: Promise.resolve({ numPages }),
            destroy: vi.fn().mockResolvedValue(undefined),
        });
    }

    it('returns the numPages from pdfjs', async () => {
        vi.mocked(getPdfjs).mockResolvedValue({
            getDocument: makeGetDocument(3),
        } as never);

        const blob = new Blob(['fake pdf'], { type: 'application/pdf' });
        expect(await countPdfPages(blob)).toBe(3);
    });

    it('returns 1 when pdfjs throws', async () => {
        vi.mocked(getPdfjs).mockResolvedValue({
            getDocument: vi.fn().mockReturnValue({
                promise: Promise.reject(new Error('parse error')),
                destroy: vi.fn().mockResolvedValue(undefined),
            }),
        } as never);

        const blob = new Blob(['not a pdf'], { type: 'application/pdf' });
        expect(await countPdfPages(blob)).toBe(1);
    });
});
