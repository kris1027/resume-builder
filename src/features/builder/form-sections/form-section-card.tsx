import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type FormSectionCardProps = {
    icon: LucideIcon;
    iconGradient: string;
    title: string;
    description: string;
    headerAction?: ReactNode;
    children: ReactNode;
};

export const FormSectionCard = ({
    icon: Icon,
    iconGradient,
    title,
    description,
    headerAction,
    children,
}: FormSectionCardProps) => {
    return (
        <div className='group relative rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-white/5 dark:bg-white/[0.03] dark:hover:shadow-indigo-500/5'>
            {/* Hover gradient glow */}
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-violet-50/0 transition-colors duration-300 group-hover:from-indigo-50/50 group-hover:to-violet-50/30 dark:group-hover:from-indigo-500/5 dark:group-hover:to-violet-500/5' />

            <div className='relative'>
                {/* Header */}
                <div className='flex items-start justify-between gap-4 p-6 pb-0'>
                    <div className='flex items-start gap-3'>
                        <div
                            className={`inline-flex shrink-0 rounded-xl bg-gradient-to-br ${iconGradient} p-2.5 text-white shadow-lg`}
                        >
                            <Icon className='h-5 w-5' />
                        </div>
                        <div>
                            <h3 className='font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                                {title}
                            </h3>
                            <p className='mt-0.5 text-sm text-slate-500 dark:text-slate-400'>
                                {description}
                            </p>
                        </div>
                    </div>
                    {headerAction && <div className='shrink-0'>{headerAction}</div>}
                </div>

                {/* Content */}
                <div className='p-6'>{children}</div>
            </div>
        </div>
    );
};
