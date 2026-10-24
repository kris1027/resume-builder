import type { ResumeData, ResumeFormValues } from '@/types/form-types';
import type { TemplateId } from '@/lib/template-ids';

/**
 * Versioned payload embedded in exported PDFs so they can be loaded back exactly.
 * Stored in the PDF `creator` metadata field (keeps `keywords` human-readable).
 */
interface ResumeMetadataPayload {
    v: 1;
    templateId: TemplateId;
    data: ResumeData;
}

/**
 * Build the JSON string embedded in the PDF `creator` metadata field on export.
 */
export function buildResumeMetadata(templateId: TemplateId, data: ResumeData): string {
    const payload: ResumeMetadataPayload = { v: 1, templateId, data };
    return JSON.stringify(payload);
}

/**
 * Parse the embedded metadata payload back into form values.
 * Returns null when the string is absent, not our JSON, or an unknown version.
 */
export function parseResumeMetadata(raw: string | undefined): ResumeFormValues | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as Partial<ResumeMetadataPayload>;
        if (parsed.v !== 1 || !parsed.data || !parsed.templateId) return null;
        return {
            ...parsed.data,
            templateId: parsed.templateId,
            gdprConsent: parsed.data.gdprConsent ?? { enabled: false, companyName: '' },
        };
    } catch {
        return null;
    }
}
