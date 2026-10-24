import type { LanguageLevelProps } from '@/features/resume/form-types';
import type { TFunction } from 'i18next';

export const getLanguageLevels = (t: TFunction): { value: LanguageLevelProps; label: string }[] => [
    { value: 'A1', label: t('proficiency.A1') },
    { value: 'A2', label: t('proficiency.A2') },
    { value: 'B1', label: t('proficiency.B1') },
    { value: 'B2', label: t('proficiency.B2') },
    { value: 'C1', label: t('proficiency.C1') },
    { value: 'C2', label: t('proficiency.C2') },
    { value: 'NATIVE', label: t('proficiency.NATIVE') },
];
