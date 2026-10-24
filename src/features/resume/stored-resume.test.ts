import { describe, it, expect, beforeEach } from 'vitest';
import { EMPTY_GDPR_CONSENT, EMPTY_PERSONAL_INFO, loadStoredResume } from './stored-resume';

describe('loadStoredResume', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should return null when nothing is stored', () => {
        expect(loadStoredResume()).toBeNull();
    });

    it('should return null when the stored data is not valid JSON', () => {
        localStorage.setItem('resumeData', '{not json');
        expect(loadStoredResume()).toBeNull();
    });

    it('should backfill missing keys when the save is from an older version', () => {
        localStorage.setItem(
            'resumeData',
            JSON.stringify({ templateId: 'default', personalInfo: { firstName: 'Ada' } }),
        );

        expect(loadStoredResume()).toEqual({
            templateId: 'default',
            personalInfo: { ...EMPTY_PERSONAL_INFO, firstName: 'Ada' },
            experiences: [],
            education: [],
            skills: [],
            languages: [],
            interests: [],
            gdprConsent: EMPTY_GDPR_CONSENT,
        });
    });
});
