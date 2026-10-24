import { useTranslation } from 'react-i18next';
import { VeterinaryTemplate } from '@/features/templates/html/veterinary-template';
import { sampleVeterinaryResumeData } from '@/features/resume/sample-resume-data';
import { sampleVeterinaryResumeDataPl } from '@/features/resume/sample-resume-data-pl';
import { TemplateCardPreview } from './template-card-preview';

export const VeterinaryPreview = () => {
    const { i18n } = useTranslation();
    const isPolish = i18n.language === 'pl';

    return (
        <TemplateCardPreview>
            <VeterinaryTemplate
                data={isPolish ? sampleVeterinaryResumeDataPl : sampleVeterinaryResumeData}
            />
        </TemplateCardPreview>
    );
};
