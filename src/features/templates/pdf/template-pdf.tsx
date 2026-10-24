import type { ResumeData } from '@/features/resume/form-types';
import type { TemplateId } from '@/lib/template-ids';
import type { AppLang } from '@/lib/app-lang';
import { DeveloperPDF } from '@/features/templates/pdf/developer-pdf';
import { DefaultPDF } from '@/features/templates/pdf/default-pdf';
import { VeterinaryPDF } from '@/features/templates/pdf/veterinary-pdf';

// One map from template id to PDF component, shared by the preview and the export.
const TEMPLATE_PDFS = {
    developer: DeveloperPDF,
    default: DefaultPDF,
    veterinary: VeterinaryPDF,
} satisfies Record<TemplateId, unknown>;

interface TemplatePDFProps {
    data: ResumeData;
    templateId: TemplateId;
    compactScale: number;
    lang: AppLang;
}

export function TemplatePDF({ templateId, ...props }: TemplatePDFProps) {
    const SelectedPDF = TEMPLATE_PDFS[templateId];
    return <SelectedPDF {...props} />;
}
