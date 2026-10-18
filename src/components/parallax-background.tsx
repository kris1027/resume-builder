import { motion } from 'motion/react';
import { GeometricShapes } from '@/components/geometric-shapes';
import { useParallax } from '@/hooks/use-parallax';

// Decorative gradient, dot grid and shapes behind the builder and template pages
export const ParallaxBackground = () => {
    const { ref: gradientRef, y: gradientY } = useParallax({ yRange: 30 });
    const { ref: dotsRef, y: dotsY } = useParallax({ yRange: 15 });
    const { ref: shapesRef, y: shapesY } = useParallax({ yRange: 40 });

    return (
        <>
            {/* Background gradient mesh */}
            <motion.div
                ref={gradientRef}
                style={{ y: gradientY }}
                className='animate-gradient-shift pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/80'
                aria-hidden='true'
            />

            {/* Dot grid pattern */}
            <motion.div
                ref={dotsRef}
                style={{
                    y: dotsY,
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
                className='pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]'
                aria-hidden='true'
            />

            {/* Geometric shapes */}
            <motion.div
                ref={shapesRef}
                style={{ y: shapesY }}
                className='pointer-events-none absolute inset-0'
            >
                <GeometricShapes />
            </motion.div>
        </>
    );
};
