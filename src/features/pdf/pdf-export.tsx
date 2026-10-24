import type { ResumeData } from '@/types/form-types';
import type { TemplateId } from '@/lib/template-ids';
import { normalizeLang } from '@/lib/app-lang';
import { getPdfjs } from '@/features/pdf/pdfjs-singleton';

export interface PDFExportOptions {
    filename?: string;
    compactScale?: number;
    lang?: string;
}

export async function exportToPDF(
    resumeData: ResumeData,
    templateId: TemplateId,
    options: PDFExportOptions = {},
): Promise<void> {
    const { filename = 'resume.pdf', compactScale = 0, lang: rawLang = 'en' } = options;
    const lang = normalizeLang(rawLang);

    const [{ pdf }, { DeveloperPDF }, { DefaultPDF }, { VeterinaryPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/features/templates/pdf/developer-pdf'),
        import('@/features/templates/pdf/default-pdf'),
        import('@/features/templates/pdf/veterinary-pdf'),
    ]);

    const element =
        templateId === 'developer' ? (
            <DeveloperPDF data={resumeData} compactScale={compactScale} lang={lang} />
        ) : templateId === 'default' ? (
            <DefaultPDF data={resumeData} compactScale={compactScale} lang={lang} />
        ) : (
            <VeterinaryPDF data={resumeData} compactScale={compactScale} lang={lang} />
        );

    const blob = await pdf(element).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    requestAnimationFrame(() => setTimeout(() => URL.revokeObjectURL(url), 1000));
}

export async function countPdfPages(blob: Blob): Promise<number> {
    const { getDocument } = await getPdfjs();
    const buf = await blob.arrayBuffer();
    const loadingTask = getDocument({ data: new Uint8Array(buf) });
    try {
        const pdfDoc = await loadingTask.promise;
        return pdfDoc.numPages;
    } catch {
        return 1;
    } finally {
        await loadingTask.destroy();
    }
}

export function generateResumeFilename(firstName?: string, lastName?: string): string {
    const nameParts = [firstName, lastName].filter(Boolean);
    const name = nameParts.length > 0 ? nameParts.join('-') : 'my';
    return `${name}-Resume.pdf`;
}
