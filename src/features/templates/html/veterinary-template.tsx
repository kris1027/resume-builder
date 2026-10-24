import type { ResumeData } from '@/features/resume/form-types';
import { Mail, Phone, Globe, MapPin, Stethoscope, Award, Heart, Briefcase } from 'lucide-react';
import { formatLinkedinDisplay } from '@/lib/utils';
import { DescriptionList } from '@/features/templates/html/description-list';
import { useTranslation } from 'react-i18next';
import { formatCVDateShort, formatCVYear } from '@/lib/date-utils';

interface VeterinaryTemplateProps {
    data: ResumeData;
}

export function VeterinaryTemplate({ data }: VeterinaryTemplateProps) {
    const { t } = useTranslation();
    const { personalInfo, experiences, education, skills, languages, interests, gdprConsent } =
        data;

    return (
        <div className="bg-white font-['Lato'] text-gray-800">
            {/* Header Section - Medical/Veterinary Style */}
            <div className='border-b-3 border-emerald-600 bg-gradient-to-r from-emerald-50 to-teal-50 px-8 pt-8 pb-6'>
                <div className='mb-3 flex items-center justify-center'>
                    <div className='mr-3 rounded-full bg-emerald-100 p-2'>
                        <Stethoscope className='h-6 w-6 text-emerald-600' />
                    </div>
                    <h1 className="font-['Merriweather'] text-3xl font-light">
                        <span className='font-bold'>
                            {personalInfo.firstName} {personalInfo.lastName}
                        </span>
                    </h1>
                </div>

                {personalInfo.title && (
                    <p className='mb-4 text-center text-lg font-medium text-emerald-700'>
                        {personalInfo.title}
                    </p>
                )}

                {/* Contact Information - Clean layout */}
                <div className='flex flex-wrap justify-center gap-4 text-sm text-gray-600'>
                    {personalInfo.location && (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personalInfo.location)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm transition-shadow hover:shadow-md'
                        >
                            <MapPin className='h-3 w-3 text-emerald-600' />
                            {personalInfo.location}
                        </a>
                    )}
                    {personalInfo.email && (
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className='flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm transition-shadow hover:shadow-md'
                        >
                            <Mail className='h-3 w-3 text-emerald-600' />
                            {personalInfo.email}
                        </a>
                    )}
                    {personalInfo.phone && (
                        <a
                            href={`tel:${personalInfo.phone}`}
                            className='flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm transition-shadow hover:shadow-md'
                        >
                            <Phone className='h-3 w-3 text-emerald-600' />
                            {personalInfo.phone}
                        </a>
                    )}
                    {personalInfo.linkedin && (
                        <a
                            href={personalInfo.linkedin}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm transition-shadow hover:shadow-md'
                        >
                            <Globe className='h-3 w-3 text-emerald-600' />
                            {formatLinkedinDisplay(personalInfo.linkedin)}
                        </a>
                    )}
                </div>
            </div>

            <div className='p-8'>
                <div className='grid grid-cols-[1fr,380px] gap-8'>
                    {/* Left Column - Main Content */}
                    <div className='space-y-6'>
                        {/* Work Experience */}
                        <section>
                            <div className='mb-4 flex items-center gap-2'>
                                <Briefcase className='h-5 w-5 text-emerald-600' />
                                <h2 className="font-['Merriweather'] text-xl font-bold text-emerald-700">
                                    {t('cv.workExperience')}
                                </h2>
                            </div>
                            <div className='space-y-6 border-l-2 border-emerald-200 pl-4'>
                                {experiences.map((exp, index) => (
                                    <div key={index} className='relative'>
                                        <div className='absolute -left-[22px] h-3 w-3 rounded-full border-2 border-white bg-emerald-600'></div>
                                        <div className='mb-2'>
                                            <h3 className='text-lg font-bold text-gray-800'>
                                                {exp.position}
                                            </h3>
                                            <p className='font-medium text-emerald-600'>
                                                {exp.company}
                                            </p>
                                            <p className='text-sm text-gray-500'>
                                                {formatCVDateShort(exp.startDate)} -{' '}
                                                {exp.current
                                                    ? t('cv.present')
                                                    : formatCVDateShort(exp.endDate)}
                                                {exp.location && ` • ${exp.location}`}
                                            </p>
                                        </div>
                                        <DescriptionList
                                            description={exp.description}
                                            className='text-sm leading-relaxed text-gray-700'
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education & Training */}
                        {education.length > 0 && (
                            <section>
                                <div className='mb-4 flex items-center gap-2'>
                                    <Award className='h-5 w-5 text-emerald-600' />
                                    <h2 className="font-['Merriweather'] text-xl font-bold text-emerald-700">
                                        {t('cv.educationTraining')}
                                    </h2>
                                </div>
                                <div className='space-y-4'>
                                    {education.map((edu, index) => (
                                        <div
                                            key={index}
                                            className='border-l-2 border-emerald-200 pl-4'
                                        >
                                            <h3 className='font-bold text-emerald-600'>
                                                {edu.degree} {edu.field}
                                            </h3>
                                            <p className='font-medium text-gray-700'>
                                                {edu.institution}
                                            </p>
                                            <p className='text-sm text-gray-500'>
                                                {formatCVYear(edu.startDate)} -{' '}
                                                {formatCVYear(edu.endDate)}
                                            </p>
                                            {edu.description && (
                                                <p className='mt-2 text-sm text-gray-600'>
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Skills & Additional Info */}
                    <div className='space-y-6'>
                        {/* Skills */}
                        <section className='rounded-lg bg-emerald-50 p-5'>
                            <h2 className="mb-4 font-['Merriweather'] text-lg font-bold text-emerald-700">
                                {t('cv.skills')}
                            </h2>
                            <div className='flex flex-wrap gap-2'>
                                {skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className='rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700'
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Languages */}
                        {languages.length > 0 && (
                            <section className='rounded-lg bg-teal-50 p-5'>
                                <h2 className="mb-4 font-['Merriweather'] text-lg font-bold text-teal-700">
                                    {t('cv.languages')}
                                </h2>
                                <div className='space-y-3'>
                                    {languages.map((lang, index) => (
                                        <div
                                            key={index}
                                            className='flex items-center justify-between'
                                        >
                                            <span className='font-medium text-gray-700'>
                                                {lang.language}
                                            </span>
                                            <div className='flex gap-1'>
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-2 w-2 rounded-full ${
                                                            level <=
                                                            (lang.proficiency === 'NATIVE'
                                                                ? 5
                                                                : lang.proficiency === 'C2'
                                                                  ? 5
                                                                  : lang.proficiency === 'C1'
                                                                    ? 4
                                                                    : lang.proficiency === 'B2'
                                                                      ? 3
                                                                      : lang.proficiency === 'B1'
                                                                        ? 2
                                                                        : lang.proficiency === 'A2'
                                                                          ? 2
                                                                          : 1)
                                                                ? 'bg-teal-600'
                                                                : 'bg-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Special Interests */}
                        {interests.length > 0 && (
                            <section className='rounded-lg bg-orange-50 p-5'>
                                <div className='mb-4 flex items-center gap-2'>
                                    <Heart className='h-4 w-4 text-orange-600' />
                                    <h2 className="font-['Merriweather'] text-lg font-bold text-orange-700">
                                        {t('cv.specialInterests')}
                                    </h2>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className='rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1.5 text-sm font-medium text-orange-800'
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
