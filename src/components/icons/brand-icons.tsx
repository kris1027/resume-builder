import type { SVGProps } from 'react';
import { GITHUB_ICON, LINKEDIN_ICON } from '@/lib/brand-icon-paths';
import { cn } from '@/lib/utils';

/**
 * Brand icons removed from lucide-react in 1.0, recreated with the same lucide
 * stroke style. Path data lives in @/lib/brand-icon-paths, shared with the PDF icons.
 */
type BrandIconProps = SVGProps<SVGSVGElement>;

const BrandIconBase = ({ className, children, ...props }: BrandIconProps) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        className={cn('lucide', className)}
        {...props}
    >
        {children}
    </svg>
);

export const GithubIcon = (props: BrandIconProps) => (
    <BrandIconBase {...props}>
        {GITHUB_ICON.paths.map((d) => (
            <path key={d} d={d} />
        ))}
    </BrandIconBase>
);

export const LinkedinIcon = (props: BrandIconProps) => (
    <BrandIconBase {...props}>
        <path d={LINKEDIN_ICON.path} />
        <rect {...LINKEDIN_ICON.rect} />
        <circle {...LINKEDIN_ICON.circle} />
    </BrandIconBase>
);
