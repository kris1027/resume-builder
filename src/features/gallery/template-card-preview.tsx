import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const A4_WIDTH_PX = 794;

type TemplateCardPreviewProps = {
    children: ReactNode;
};

export const TemplateCardPreview = ({ children }: TemplateCardPreviewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setScale(entry.contentRect.width / A4_WIDTH_PX);
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className='relative h-full w-full overflow-hidden'>
            {scale > 0 && (
                <div
                    className='pointer-events-none absolute top-0 left-0 origin-top-left'
                    style={{
                        width: A4_WIDTH_PX,
                        transform: `scale(${scale})`,
                    }}
                >
                    {children}
                </div>
            )}
            {/* Bottom fade to hide the hard clip edge */}
            <div className='absolute right-0 bottom-0 left-0 h-1/4 bg-gradient-to-t from-slate-100 via-slate-100/80 to-transparent dark:from-slate-900/90 dark:via-slate-900/60' />
        </div>
    );
};
