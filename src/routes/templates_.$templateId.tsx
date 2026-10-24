import { createFileRoute } from '@tanstack/react-router';
import { TemplatePage } from '@/features/gallery/template-page';
import { SITE_URL, SEO_DEFAULTS, TEMPLATE_NAMES } from '@/lib/seo';
import type { TemplateId } from '@/lib/template-ids';

export const Route = createFileRoute('/templates_/$templateId')({
    head: ({ params }) => {
        const templateName = TEMPLATE_NAMES[params.templateId as TemplateId] ?? params.templateId;
        const title = `${templateName} Template | ${SEO_DEFAULTS.siteName}`;
        const url = `${SITE_URL}/templates/${params.templateId}`;

        return {
            meta: [
                { title },
                { property: 'og:title', content: title },
                { property: 'og:url', content: url },
                { name: 'twitter:title', content: title },
            ],
            links: [{ rel: 'canonical', href: url }],
        };
    },
    component: TemplatePage,
});
