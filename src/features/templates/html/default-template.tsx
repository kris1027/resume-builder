import type { ResumeData } from '@/types/form-types';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { formatLinkedinDisplay } from '@/lib/utils';
import { DescriptionList } from '@/features/templates/html/description-list';
import { useTranslation } from 'react-i18next';
import { formatCVDateShort, formatCVYear } from '@/lib/date-utils';

interface DefaultTemplateProps {
    data: ResumeData;
}

export function DefaultTemplate({ data }: DefaultTemplateProps) {
    const { t } = useTranslation();
    const { personalInfo, experiences, education, skills, languages, interests, gdprConsent } =
        data;

    return (
        <div className="bg-white font-['Montserrat'] text-gray-800">
            {/* Header Section - Modern Executive Style */}
            <div className='mb-6 bg-gradient-to-b from-gray-50 to-white px-8 pt-8 pb-6'>
                <h1 className='mb-2 text-center text-4xl font-light tracking-wider uppercase'>
                    {personalInfo.firstName}{' '}
                    <span className='font-bold'>{personalInfo.lastName}</span>
                </h1>
                {personalInfo.title && (
                    <p className='mb-4 text-center text-lg font-light tracking-wide text-gray-600'>
                        {personalInfo.title}
                    </p>
                )}

                {/* Contact Information - Horizontal layout */}
                <div className='flex flex-wrap justify-center gap-6 border-t border-gray-200 pt-4 text-sm font-light text-gray-600'>
                    {personalInfo.location && (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personalInfo.location)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1 hover:underline'
                        >
                            <MapPin className='h-3 w-3' />
                            {personalInfo.location}
                        </a>
                    )}
                    {personalInfo.email && (
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className='flex items-center gap-1 hover:underline'
                        >
                            <Mail className='h-3 w-3' />
                            {personalInfo.email}
                        </a>
                    )}
                    {personalInfo.phone && (
                        <a
                            href={`tel:${personalInfo.phone}`}
                            className='flex items-center gap-1 hover:underline'
                        >
                            <Phone className='h-3 w-3' />
                            {personalInfo.phone}
                        </a>
                    )}
                    {personalInfo.linkedin && (
                        <a
                            href={personalInfo.linkedin}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1 hover:underline'
                        >
                            <Globe className='h-3 w-3' />
                            {formatLinkedinDisplay(personalInfo.linkedin)}
                        </a>
                    )}
                </div>
            </div>

            <div className='px-8 pb-8'>
                {/* Professional Experience */}
                <section className='mb-6'>
                    <h2 className='mb-4 border-b-2 border-gray-900 pb-2 text-sm font-bold tracking-[0.2em] text-gray-700 uppercase'>
                        {t('cv.professionalExperience')}
                    </h2>
                    <div className='space-y-4'>
                        {experiences.map((exp, index) => (
                            <div key={index} className='mb-4'>
                                <div className='mb-1 flex items-baseline justify-between'>
                                    <h3 className='text-base font-semibold'>
                                        <span className='text-gray-900'>{exp.position}</span>{' '}
                                        <span className='font-light text-gray-400'>|</span>{' '}
                                        <span className='font-bold text-gray-700'>
                                            {exp.company}
                                        </span>
                                    </h3>
                                    <span className='text-sm font-light text-gray-500'>
                                        {formatCVDateShort(exp.startDate)} –{' '}
                                        {exp.current
                                            ? t('cv.present')
                                            : formatCVDateShort(exp.endDate)}
                                    </span>
                                </div>
                                {exp.location && (
                                    <p className='mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase'>
                                        {exp.location}
                                    </p>
                                )}
                                <DescriptionList
                                    description={exp.description}
                                    className='text-sm leading-relaxed font-light text-gray-700'
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                {education.length > 0 && (
                    <section className='mb-6'>
                        <h2 className='mb-4 border-b-2 border-gray-900 pb-2 text-sm font-bold tracking-[0.2em] text-gray-700 uppercase'>
                            {t('cv.education')}
                        </h2>
                        <div className='space-y-3'>
                            {education.map((edu, index) => (
                                <div key={index}>
                                    <div className='mb-1 flex items-baseline justify-between'>
                                        <h3 className='text-base font-semibold'>
                                            <span className='text-gray-900'>{edu.degree}</span>{' '}
                                            <span className='font-bold text-gray-700'>
                                                {edu.field}
                                            </span>
                                        </h3>
                                        <span className='text-sm font-light text-gray-500'>
                                            {formatCVYear(edu.startDate)} –{' '}
                                            {formatCVYear(edu.endDate)}
                                        </span>
                                    </div>
                                    <p className='text-sm font-medium text-gray-600'>
                                        {edu.institution}
                                    </p>
                                    {edu.description && (
                                        <p className='mt-1 text-sm font-light text-gray-600'>
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Two Column Section for Skills and Languages */}
                <div className='grid grid-cols-2 gap-8'>
                    {/* Skills */}
                    <section className='mb-6'>
                        <h2 className='mb-4 border-b-2 border-gray-900 pb-2 text-sm font-bold tracking-[0.2em] text-gray-700 uppercase'>
                            {t('cv.coreCompetencies')}
                        </h2>
                        <div className='flex flex-wrap gap-2'>
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className='rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Languages */}
                    {languages.length > 0 && (
                        <section className='mb-6'>
                            <h2 className='mb-4 border-b-2 border-gray-900 pb-2 text-sm font-bold tracking-[0.2em] text-gray-700 uppercase'>
                                {t('cv.languages')}
                            </h2>
                            <div className='space-y-1'>
                                {languages.map((lang, index) => (
                                    <div key={index} className='flex justify-between text-sm'>
                                        <span className='font-medium'>{lang.language}</span>
                                        <span className='font-light text-gray-500'>
                                            {lang.proficiency === 'NATIVE'
                                                ? t('proficiency.NATIVE')
                                                : lang.proficiency}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Interests - Optional, more subtle */}
                {interests.length > 0 && (
                    <section className='mt-6'>
                        <h2 className='mb-4 border-b-2 border-gray-900 pb-2 text-sm font-bold tracking-[0.2em] text-gray-700 uppercase'>
                            {t('cv.interests')}
                        </h2>
                        <p className='text-sm font-light text-gray-600'>
                            {interests.map((interest) => interest.name).join(' • ')}
                        </p>
                    </section>
                )}

                {/* GDPR Consent Clause */}
                {gdprConsent?.enabled && (
                    <div className='mt-8 border-t border-gray-200 pt-4'>
                        <p className='text-xs leading-relaxed font-light text-gray-400 italic'>
                            {gdprConsent.companyName?.trim()
                                ? t('cv.gdprConsent', { companyName: gdprConsent.companyName })
                                : t('cv.gdprConsentGeneric')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
