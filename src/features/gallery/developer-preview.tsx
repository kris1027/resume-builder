import { useTranslation } from 'react-i18next';
import { DeveloperTemplate } from '@/components/templates/developer-template';
import { sampleResumeData } from '@/data/sample-resume-data';
import { sampleResumeDataPl } from '@/data/sample-resume-data-pl';
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
