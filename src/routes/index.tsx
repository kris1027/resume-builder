import IndexPage from '@/features/landing/landing-page';
import { createFileRoute } from '@tanstack/react-router';
import { SITE_URL, SEO_DEFAULTS } from '@/lib/seo';

export const Route = createFileRoute('/')({
    head: () => ({
        meta: [
            { title: `${SEO_DEFAULTS.siteName} - Create Professional Resumes in Minutes` },
            {
                property: 'og:title',
                content: `${SEO_DEFAULTS.siteName} - Create Professional Resumes in Minutes`,
            },
            { property: 'og:url', content: SITE_URL },
            {
                name: 'twitter:title',
                content: `${SEO_DEFAULTS.siteName} - Create Professional Resumes in Minutes`,
            },
        ],
        links: [{ rel: 'canonical', href: SITE_URL }],
    }),
    component: IndexPage,
});
