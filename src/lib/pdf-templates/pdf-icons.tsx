import { Svg, Path, Circle, Rect } from '@react-pdf/renderer';

/**
 * Lucide-style contact icons recreated as @react-pdf/renderer SVG primitives.
 *
 * lucide-react components cannot render inside react-pdf (different renderer),
 * so these mirror the same 24x24 stroke icons used by the on-screen templates
 * (see src/components/templates/*). Keep path data in sync with lucide if the
 * UI icons change.
 */
interface PDFIconProps {
    size?: number;
    color?: string;
}

const STROKE_WIDTH = 2;

function IconBase({
    size = 9,
    color = '#000000',
    children,
}: PDFIconProps & { children: React.ReactNode }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox='0 0 24 24'
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            {children}
        </Svg>
    );
}

export function GlobeIcon(props: PDFIconProps) {
    return (
        <IconBase {...props}>
            <Circle cx='12' cy='12' r='10' />
            <Path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' />
            <Path d='M2 12h20' />
        </IconBase>
    );
}

export function MailIcon(props: PDFIconProps) {
    return (
        <IconBase {...props}>
            <Rect width='20' height='16' x='2' y='4' rx='2' />
            <Path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
        </IconBase>
    );
}

export function PhoneIcon(props: PDFIconProps) {
    return (
        <IconBase {...props}>
            <Path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
        </IconBase>
    );
}

export function MapPinIcon(props: PDFIconProps) {
    return (
        <IconBase {...props}>
            <Path d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' />
            <Circle cx='12' cy='10' r='3' />
        </IconBase>
    );
}

export function GithubIcon(props: PDFIconProps) {
    return (
        <IconBase {...props}>
            <Path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
            <Path d='M9 18c-4.51 2-5-2-7-2' />
        </IconBase>
    );
}

export function LinkedinIcon(props: PDFIconProps) {
    return (
        <IconBase {...props}>
            <Path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
            <Rect width='4' height='12' x='2' y='9' />
            <Circle cx='4' cy='4' r='2' />
        </IconBase>
    );
}
