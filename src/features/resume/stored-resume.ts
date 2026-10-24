import { safeStorage } from '@/lib/storage';
import type { GdprConsentProps, PersonalInfoProps, ResumeData } from '@/features/resume/form-types';

export const EMPTY_PERSONAL_INFO: PersonalInfoProps = {
    firstName: '',
    lastName: '',
    location: '',
    title: '',
    phone: '',
    email: '',
    website: '',
    linkedin: '',
    github: '',
};

export const EMPTY_GDPR_CONSENT: GdprConsentProps = { enabled: false, companyName: '' };

export type StoredResume = Required<ResumeData> & { templateId?: string };

// Backfill keys missing from older saves or partial PDF imports
export const normalizeResume = (data: Partial<StoredResume>): StoredResume => ({
    templateId: data.templateId,
    personalInfo: { ...EMPTY_PERSONAL_INFO, ...data.personalInfo },
    experiences: data.experiences ?? [],
    education: data.education ?? [],
    skills: data.skills ?? [],
    languages: data.languages ?? [],
    interests: data.interests ?? [],
    gdprConsent: { ...EMPTY_GDPR_CONSENT, ...data.gdprConsent },
});

export const loadStoredResume = (): StoredResume | null => {
    const storedData = safeStorage.getItem('resumeData');
    if (!storedData) return null;
    try {
        return normalizeResume(JSON.parse(storedData));
    } catch {
        if (import.meta.env.DEV) console.warn('Failed to parse stored resume data');
        return null;
    }
};
