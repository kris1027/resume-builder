import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/ui/field-error';
import { FormSectionCard } from '@/features/builder/form-sections/form-section-card';
import { User } from 'lucide-react';
import type { FormApi } from '@/features/builder/form-component-types';
import { useTranslation } from 'react-i18next';

type PersonalInfoSectionProps = {
    form: FormApi;
};

export const PersonalInfoSection = ({ form }: PersonalInfoSectionProps) => {
    const { t } = useTranslation();

    return (
        <FormSectionCard
            icon={User}
            iconGradient='from-blue-500 to-indigo-600'
            title={t('sections.personalInfo.title')}
            description={t('sections.personalInfo.description')}
        >
            <div className='space-y-6'>
                {/* Row 1: First Name, Last Name */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <form.Field name='personalInfo.firstName'>
                        {(field) => (
                            <div className='space-y-2'>
                                <Label htmlFor={field.name} className='flex items-center gap-1'>
                                    {t('form.firstName')} <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('placeholders.firstName')}
                                    className={`transition-all ${field.state.meta.isTouched && !field.state.meta.isValid ? 'border-red-500' : ''}`}
                                />
                                <FieldError
                                    errors={field.state.meta.errors}
                                    isTouched={field.state.meta.isTouched}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name='personalInfo.lastName'>
                        {(field) => (
                            <div className='space-y-2'>
                                <Label htmlFor={field.name} className='flex items-center gap-1'>
                                    {t('form.lastName')} <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('placeholders.lastName')}
                                    className={`transition-all ${field.state.meta.isTouched && !field.state.meta.isValid ? 'border-red-500' : ''}`}
                                />
                                <FieldError
                                    errors={field.state.meta.errors}
                                    isTouched={field.state.meta.isTouched}
                                />
                            </div>
                        )}
                    </form.Field>
                </div>

                {/* Row 2: Professional Title (full width) */}
                <div className='grid grid-cols-1 gap-6'>
                    <form.Field name='personalInfo.title'>
                        {(field) => (
                            <div className='space-y-2'>
                                <Label htmlFor={field.name}>{t('form.professionalTitle')}</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('placeholders.professionalTitle')}
                                />
                            </div>
                        )}
                    </form.Field>
                </div>

                {/* Row 3: Location, Email, Phone */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    <form.Field name='personalInfo.location'>
                        {(field) => (
                            <div className='space-y-2'>
                                <Label htmlFor={field.name}>{t('form.location')}</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('placeholders.location')}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name='personalInfo.email'>
                        {(field) => (
                            <div className='space-y-2'>
                                <Label htmlFor={field.name} className='flex items-center gap-1'>
                                    {t('form.email')} <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type='email'
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('placeholders.email')}
                                    className={`transition-all ${field.state.meta.isTouched && !field.state.meta.isValid ? 'border-red-500' : ''}`}
                                />
                                <FieldError
                                    errors={field.state.meta.errors}
                                    isTouched={field.state.meta.isTouched}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name='personalInfo.phone'>
                        {(field) => (
                            <div className='space-y-2'>
                                <Label htmlFor={field.name}>{t('form.phone')}</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type='tel'
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('placeholders.phone')}
                                />
                            </div>
                        )}
                    </form.Field>
                </div>

                {/* Row 4: Website, LinkedIn, GitHub */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    <form.Field name='personalInfo.website'>
                        {(field) => (
                            <div className='space-y-2'>
                                <Label htmlFor={field.name}>{t('form.website')}</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type='url'
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('placeholders.website')}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name='personalInfo.linkedin'>
                        {(field) => (
                            <div className='space-y-2'>
                                <Label htmlFor={field.name}>{t('form.linkedin')}</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type='url'
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('placeholders.linkedin')}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name='personalInfo.github'>
                        {(field) => (
                            <div className='space-y-2'>
                                <Label htmlFor={field.name}>{t('form.github')}</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type='url'
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={t('placeholders.github')}
                                />
                            </div>
                        )}
                    </form.Field>
                </div>
            </div>
        </FormSectionCard>
    );
};
