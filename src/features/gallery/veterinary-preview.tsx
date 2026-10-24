import { useTranslation } from 'react-i18next';
import { VeterinaryTemplate } from '@/components/templates/veterinary-template';
import { sampleVeterinaryResumeData } from '@/data/sample-resume-data';
import { sampleVeterinaryResumeDataPl } from '@/data/sample-resume-data-pl';
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
