import { useTranslation } from 'react-i18next';
import { DefaultTemplate } from '@/components/templates/default-template';
import { sampleDefaultResumeData } from '@/data/sample-resume-data';
import { sampleDefaultResumeDataPl } from '@/data/sample-resume-data-pl';
import { TemplateCardPreview } from './template-card-preview';

export const DefaultPreview = () => {
    const { i18n } = useTranslation();
    const isPolish = i18n.language === 'pl';

    return (
        <TemplateCardPreview>
            <DefaultTemplate
                data={isPolish ? sampleDefaultResumeDataPl : sampleDefaultResumeData}
            />
        </TemplateCardPreview>
    );
};
