import { describe, expect, it } from 'vitest';

import { getLanguageLevels } from './language-levels';

const mockT = (key: string) => key;

describe('getLanguageLevels', () => {
    it('returns 7 levels', () => {
        const levels = getLanguageLevels(mockT as never);
        expect(levels).toHaveLength(7);
    });

    it('includes all European framework values plus NATIVE', () => {
        const levels = getLanguageLevels(mockT as never);
        const values = levels.map((l) => l.value);
        expect(values).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE']);
    });

    it('uses translation keys as labels', () => {
        const levels = getLanguageLevels(mockT as never);
        expect(levels[0].label).toBe('proficiency.A1');
        expect(levels[6].label).toBe('proficiency.NATIVE');
    });
});
