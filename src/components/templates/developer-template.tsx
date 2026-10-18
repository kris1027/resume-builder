import type { ResumeData } from '@/types/form-types';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/brand-icons';
import { formatWebsiteDisplay, formatGithubDisplay, formatLinkedinDisplay } from '@/lib/utils';
import { DescriptionList } from '@/components/description-list';
import { useTranslation } from 'react-i18next';
import { formatCVDate, formatCVYear } from '@/lib/date-utils';

interface DeveloperTemplateProps {
    data: ResumeData;
}

export function DeveloperTemplate({ data }: DeveloperTemplateProps) {
    const { t } = useTranslation();
    const { personalInfo, experiences, education, skills, languages, interests, gdprConsent } =
        data;

    return (
        <div className="bg-white font-['JetBrains_Mono'] text-gray-800">
            {/* Header Section - Developer Style */}
            <div className='bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white'>
                <h1 className='mb-2 text-4xl font-bold'>
                    {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                {personalInfo.title && (
                    <p className='mb-4 text-xl font-normal opacity-95'>{personalInfo.title}</p>
                )}

                <div className='mt-4 flex flex-wrap gap-6 text-sm font-normal'>
                    {personalInfo.website && (
                        <a
                            href={personalInfo.website}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 hover:underline'
                        >
                            <Globe className='h-4 w-4' />
                            <span>{formatWebsiteDisplay(personalInfo.website)}</span>
                        </a>
                    )}
                    {personalInfo.github && (
                        <a
                            href={personalInfo.github}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 hover:underline'
                        >
                            <GithubIcon className='h-4 w-4' />
                            <span>{formatGithubDisplay(personalInfo.github)}</span>
                        </a>
                    )}
                    {personalInfo.linkedin && (
                        <a
                            href={personalInfo.linkedin}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 hover:underline'
                        >
                            <LinkedinIcon className='h-4 w-4' />
                            <span>{formatLinkedinDisplay(personalInfo.linkedin)}</span>
                        </a>
                    )}
                </div>

                <div className='mt-2 flex flex-wrap gap-6 text-sm font-normal'>
                    {personalInfo.location && (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personalInfo.location)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 hover:underline'
                        >
                            <MapPin className='h-4 w-4' />
                            <span>{personalInfo.location}</span>
                        </a>
                    )}
                    {personalInfo.email && (
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className='flex items-center gap-2 hover:underline'
                        >
                            <Mail className='h-4 w-4' />
                            <span>{personalInfo.email}</span>
                        </a>
                    )}
                    {personalInfo.phone && (
                        <a
                            href={`tel:${personalInfo.phone}`}
                            className='flex items-center gap-2 hover:underline'
                        >
                            <Phone className='h-4 w-4' />
                            <span>{personalInfo.phone}</span>
                        </a>
                    )}
                </div>
            </div>

            <div className='p-8'>
                <div className='grid grid-cols-[1fr,400px] gap-8'>
                    {/* Left Column */}
                    <div className='space-y-6'>
                        {/* Work Experience */}
                        <section>
                            <h2 className='mb-4 border-b-2 border-purple-600 pb-2 text-xl font-semibold text-purple-600'>
                                // {t('cv.workExperience').toUpperCase()}
                            </h2>
                            <div className='space-y-6'>
                                {experiences.map((exp, index) => (
                                    <div key={index}>
                                        <div className='mb-2 flex items-start justify-between'>
                                            <div>
                                                <h3 className='text-lg font-semibold'>
                                                    {exp.company}{' '}
                                                    <span className='text-purple-600'>
                                                        | {exp.position}
                                                    </span>
                                                </h3>
                                                <p className='text-sm font-light text-gray-600'>
                                                    {formatCVDate(exp.startDate)} -{' '}
                                                    {exp.current
                                                        ? t('cv.present')
                                                        : formatCVDate(exp.endDate)}
                                                    {exp.location && ` | ${exp.location}`}
                                                </p>
                                            </div>
                                        </div>
                                        <DescriptionList
                                            description={exp.description}
                                            className='text-sm leading-relaxed text-gray-700'
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education */}
                        {education.length > 0 && (
                            <section>
                                <h2 className='mb-4 border-b-2 border-purple-600 pb-2 text-xl font-semibold text-purple-600'>
                                    // {t('cv.education').toUpperCase()}
                                </h2>
                                <div className='space-y-4'>
                                    {education.map((edu, index) => (
                                        <div key={index}>
                                            <h3 className='text-lg font-semibold text-purple-600'>
                                                {edu.field}
                                            </h3>
                                            <p className='text-gray-700'>
                                                {formatCVYear(edu.startDate)} -{' '}
                                                {formatCVYear(edu.endDate)} | {edu.institution}
                                            </p>
                                            {edu.description && (
                                                <p className='mt-2 text-sm text-gray-700'>
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className='space-y-6'>
                        {/* Skills */}
                        <section>
                            <h2 className='mb-4 border-b-2 border-purple-600 pb-2 text-xl font-semibold text-purple-600'>
                                // {t('cv.techStack').toUpperCase()}
                            </h2>
                            <div className='flex flex-wrap gap-2'>
                                {skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className='rounded border border-gray-700 bg-gray-900 px-3 py-1 text-sm font-medium text-green-400'
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Languages */}
                        {languages.length > 0 && (
                            <section>
                                <h2 className='mb-4 border-b-2 border-purple-600 pb-2 text-xl font-semibold text-purple-600'>
                                    // {t('cv.languages').toUpperCase()}
                                </h2>
                                <div className='space-y-3'>
                                    {languages.map((lang, index) => (
                                        <div
                                            key={index}
                                            className='flex items-center justify-between'
                                        >
                                            <span className='font-medium text-gray-800'>
                                                {lang.language}
                                            </span>
                                            <span className='text-purple-600'>
                                                {lang.proficiency === 'NATIVE'
                                                    ? t('proficiency.NATIVE')
                                                    : lang.proficiency}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Interests */}
                        {interests.length > 0 && (
                            <section>
                                <h2 className='mb-4 border-b-2 border-purple-600 pb-2 text-xl font-semibold text-purple-600'>
                                    // {t('cv.interests').toUpperCase()}
                                </h2>
                                <div className='flex flex-wrap gap-3'>
                                    {interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className='rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white'
                                        >
                                            {interest.name}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* GDPR Consent Clause */}
                {gdprConsent?.enabled && (
                    <div className='mt-8 border-t border-gray-200 pt-4'>
                        <p className='text-xs leading-relaxed text-gray-400 italic'>
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
