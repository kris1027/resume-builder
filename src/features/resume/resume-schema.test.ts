import { describe, expect, it } from 'vitest';

import { resumeFormSchema } from './resume-schema';

const validForm = {
    templateId: 'developer',
    personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        location: 'Warsaw, Poland',
        title: 'Software Engineer',
        phone: '+48 123 456 789',
        email: 'john@example.com',
        website: 'https://johndoe.com',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
    },
    experiences: [
        {
            company: 'ACME',
            position: 'Developer',
            location: 'Remote',
            startDate: '2023-01',
            endDate: '',
            current: true,
            description: '- Built things',
        },
    ],
    education: [
        {
            institution: 'MIT',
            degree: 'BSc',
            field: 'CS',
            startDate: '2019-09',
            endDate: '2023-06',
            description: '',
        },
    ],
    skills: [{ name: 'TypeScript' }],
    languages: [{ language: 'English', proficiency: 'C2' as const }],
    interests: [{ name: 'Hiking' }],
    gdprConsent: { enabled: true, companyName: 'ACME Corp' },
};

describe('resumeFormSchema', () => {
    it('accepts a fully valid form', () => {
        const result = resumeFormSchema.safeParse(validForm);
        expect(result.success).toBe(true);
    });

    describe('personalInfo — required fields', () => {
        it('rejects empty firstName', () => {
            const data = {
                ...validForm,
                personalInfo: { ...validForm.personalInfo, firstName: '' },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                const messages = result.error.issues.map((i) => i.message);
                expect(messages).toContain('validation.firstNameRequired');
            }
        });

        it('rejects empty lastName', () => {
            const data = {
                ...validForm,
                personalInfo: { ...validForm.personalInfo, lastName: '' },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                const messages = result.error.issues.map((i) => i.message);
                expect(messages).toContain('validation.lastNameRequired');
            }
        });

        it('rejects empty email', () => {
            const data = {
                ...validForm,
                personalInfo: { ...validForm.personalInfo, email: '' },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                const messages = result.error.issues.map((i) => i.message);
                expect(messages).toContain('validation.emailRequired');
            }
        });
    });

    describe('email validation', () => {
        it('rejects invalid email format', () => {
            const data = {
                ...validForm,
                personalInfo: { ...validForm.personalInfo, email: 'not-an-email' },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                const messages = result.error.issues.map((i) => i.message);
                expect(messages).toContain('validation.invalidEmail');
            }
        });

        it('accepts valid email', () => {
            const data = {
                ...validForm,
                personalInfo: { ...validForm.personalInfo, email: 'test@domain.com' },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe('optional fields', () => {
        it('accepts empty optional strings', () => {
            const data = {
                ...validForm,
                personalInfo: {
                    ...validForm.personalInfo,
                    location: '',
                    title: '',
                    phone: '',
                    website: '',
                    linkedin: '',
                    github: '',
                },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe('language proficiency enum', () => {
        const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE'] as const;

        it.each(validLevels)('accepts %s', (level) => {
            const data = {
                ...validForm,
                languages: [{ language: 'Test', proficiency: level }],
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('rejects invalid proficiency value', () => {
            const data = {
                ...validForm,
                languages: [{ language: 'Test', proficiency: 'X9' }],
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });

    describe('gdprConsent', () => {
        it('validates boolean enabled and string companyName', () => {
            const data = {
                ...validForm,
                gdprConsent: { enabled: false, companyName: '' },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('rejects non-boolean enabled', () => {
            const data = {
                ...validForm,
                gdprConsent: { enabled: 'yes', companyName: '' },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });

    describe('max-length constraints', () => {
        it('rejects firstName exceeding 100 characters', () => {
            const data = {
                ...validForm,
                personalInfo: { ...validForm.personalInfo, firstName: 'a'.repeat(101) },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                const messages = result.error.issues.map((i) => i.message);
                expect(messages).toContain('validation.maxLength');
            }
        });

        it('rejects lastName exceeding 100 characters', () => {
            const data = {
                ...validForm,
                personalInfo: { ...validForm.personalInfo, lastName: 'a'.repeat(101) },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('rejects email exceeding 254 characters', () => {
            const data = {
                ...validForm,
                personalInfo: {
                    ...validForm.personalInfo,
                    email: 'a'.repeat(243) + '@example.com',
                },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('rejects phone exceeding 30 characters', () => {
            const data = {
                ...validForm,
                personalInfo: { ...validForm.personalInfo, phone: '1'.repeat(31) },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('rejects website exceeding 200 characters', () => {
            const data = {
                ...validForm,
                personalInfo: { ...validForm.personalInfo, website: 'a'.repeat(201) },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('rejects experience description exceeding 2000 characters', () => {
            const data = {
                ...validForm,
                experiences: [{ ...validForm.experiences[0], description: 'a'.repeat(2001) }],
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('rejects skill name exceeding 100 characters', () => {
            const data = {
                ...validForm,
                skills: [{ name: 'a'.repeat(101) }],
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('rejects language name exceeding 100 characters', () => {
            const data = {
                ...validForm,
                languages: [{ language: 'a'.repeat(101), proficiency: 'C2' as const }],
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('rejects gdprConsent companyName exceeding 200 characters', () => {
            const data = {
                ...validForm,
                gdprConsent: { enabled: true, companyName: 'a'.repeat(201) },
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('accepts values at the max limit', () => {
            const data = {
                ...validForm,
                personalInfo: {
                    ...validForm.personalInfo,
                    firstName: 'a'.repeat(100),
                    lastName: 'a'.repeat(100),
                    phone: '1'.repeat(30),
                },
                skills: [{ name: 'a'.repeat(100) }],
            };
            const result = resumeFormSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    it('collects multiple errors on invalid form', () => {
        const data = {
            ...validForm,
            personalInfo: {
                ...validForm.personalInfo,
                firstName: '',
                lastName: '',
                email: '',
            },
        };
        const result = resumeFormSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
        }
    });
});
