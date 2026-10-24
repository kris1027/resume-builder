import { useTranslation } from 'react-i18next';
import { DeveloperTemplate } from '@/features/templates/html/developer-template';
import { sampleResumeData } from '@/features/resume/sample-resume-data';
import { sampleResumeDataPl } from '@/features/resume/sample-resume-data-pl';
import { TemplateCardPreview } from './template-card-preview';

export const DeveloperPreview = () => {
    const { i18n } = useTranslation();
    const isPolish = i18n.language === 'pl';

    return (
        <TemplateCardPreview>
            <DeveloperTemplate data={isPolish ? sampleResumeDataPl : sampleResumeData} />
        </TemplateCardPreview>
    );
};
