import { describe, expect, it } from 'vitest';

import { buildResumeMetadata, parseResumeMetadata } from './resume-metadata';
import type { ResumeData } from '@/features/resume/form-types';

describe('embedded resume metadata round-trip', () => {
    const data: ResumeData = {
        personalInfo: {
            firstName: 'Ada',
            lastName: 'Lovelace',
            location: 'London, UK',
            title: 'Engineer',
            phone: '+441234567890',
            email: 'ada@example.com',
            website: '',
            linkedin: '',
            github: '',
        },
        experiences: [
            {
                company: 'Analytical Engine Co',
                position: 'Programmer',
                location: 'London',
                startDate: '1843-01',
                endDate: '',
                current: true,
                description: 'First algorithm',
            },
        ],
        education: [],
        skills: [{ name: 'Mathematics' }, { name: 'Logic' }],
        languages: [{ language: 'English', proficiency: 'NATIVE' }],
        interests: [{ name: 'Music' }],
        gdprConsent: { enabled: true, companyName: 'Babbage Ltd' },
    };

    it('should parse back to the same form values and templateId when built from resume data', () => {
        const raw = buildResumeMetadata('veterinary', data);
        const parsed = parseResumeMetadata(raw);

        expect(parsed).not.toBeNull();
        expect(parsed?.templateId).toBe('veterinary');
        expect(parsed?.personalInfo.firstName).toBe('Ada');
        expect(parsed?.skills).toEqual(data.skills);
        expect(parsed?.experiences[0].current).toBe(true);
        expect(parsed?.gdprConsent).toEqual(data.gdprConsent);
    });

    it('should return null when the input is undefined, not JSON, or an unknown version', () => {
        expect(parseResumeMetadata(undefined)).toBeNull();
        expect(parseResumeMetadata('Mathematics, Logic')).toBeNull();
        expect(
            parseResumeMetadata(JSON.stringify({ v: 99, data, templateId: 'default' })),
        ).toBeNull();
    });
});
