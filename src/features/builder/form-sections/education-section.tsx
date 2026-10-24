import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormSectionCard } from '@/features/builder/form-sections/form-section-card';
import type { EducationProps } from '@/features/resume/form-types';
import { Trash2, Plus, GraduationCap, GripVertical } from 'lucide-react';
import type { FormApi } from '@/features/builder/form-component-types';
import { useTranslation } from 'react-i18next';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EducationSectionProps {
    form: FormApi;
    addEducation: () => void;
    removeEducation: (index: number) => void;
    reorderEducation: (oldIndex: number, newIndex: number) => void;
}

interface SortableEducationItemProps {
    id: string;
    index: number;
    form: FormApi;
    removeEducation: (index: number) => void;
}

const SortableEducationItem = ({
    id,
    index,
    form,
    removeEducation,
}: SortableEducationItemProps) => {
    const { t } = useTranslation();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: 'relative' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`space-y-4 rounded-xl border border-slate-200/60 bg-white/40 p-6 backdrop-blur-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-white/[0.02] dark:hover:shadow-indigo-500/5 ${isDragging ? 'shadow-lg ring-2 ring-indigo-500/20' : ''}`}
        >
            <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        className='cursor-grab touch-none rounded p-1 transition-colors hover:bg-slate-100 active:cursor-grabbing dark:hover:bg-white/10'
                        aria-label={t('accessibility.dragToReorder')}
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className='h-5 w-5 text-slate-400' />
                    </button>
                    <h4 className='font-display text-lg font-semibold text-slate-700 dark:text-slate-300'>
                        {t('sections.education.item', { number: index + 1 })}
                    </h4>
                </div>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeEducation(index)}
                    className='text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400'
                    aria-label={t('accessibility.removeEducation')}
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <form.Field name={`education[${index}].institution`}>
                    {(subField) => (
                        <div className='space-y-2'>
                            <Label htmlFor={subField.name}>{t('form.institution')}</Label>
                            <Input
                                id={subField.name}
                                name={subField.name}
                                value={subField.state.value as string}
                                onBlur={subField.handleBlur}
                                onChange={(e) => subField.handleChange(e.target.value)}
                                placeholder={t('placeholders.institution')}
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name={`education[${index}].degree`}>
                    {(subField) => (
                        <div className='space-y-2'>
                            <Label htmlFor={subField.name}>{t('form.degree')}</Label>
                            <Input
                                id={subField.name}
                                name={subField.name}
                                value={subField.state.value as string}
                                onBlur={subField.handleBlur}
                                onChange={(e) => subField.handleChange(e.target.value)}
                                placeholder={t('placeholders.degree')}
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name={`education[${index}].field`}>
                    {(subField) => (
                        <div className='space-y-2'>
                            <Label htmlFor={subField.name}>{t('form.field')}</Label>
                            <Input
                                id={subField.name}
                                name={subField.name}
                                value={subField.state.value as string}
                                onBlur={subField.handleBlur}
                                onChange={(e) => subField.handleChange(e.target.value)}
                                placeholder={t('placeholders.field')}
                            />
                        </div>
                    )}
                </form.Field>

                <div className='grid grid-cols-2 gap-2'>
                    <form.Field name={`education[${index}].startDate`}>
                        {(subField) => (
                            <div className='space-y-2'>
                                <Label htmlFor={subField.name}>{t('form.startDate')}</Label>
                                <DatePicker
                                    id={subField.name}
                                    name={subField.name}
                                    value={subField.state.value as string}
                                    onChange={(date) =>
                                        subField.handleChange(date ? date.toISOString() : '')
                                    }
                                    yearOnly
                                    placeholder='Select year'
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name={`education[${index}].endDate`}>
                        {(subField) => (
                            <div className='space-y-2'>
                                <Label htmlFor={subField.name}>{t('form.endDate')}</Label>
                                <DatePicker
                                    id={subField.name}
                                    name={subField.name}
                                    value={subField.state.value as string}
                                    onChange={(date) =>
                                        subField.handleChange(date ? date.toISOString() : '')
                                    }
                                    yearOnly
                                    placeholder='Select year'
                                />
                            </div>
                        )}
                    </form.Field>
                </div>
            </div>

            <form.Field name={`education[${index}].description`}>
                {(subField) => (
                    <div className='space-y-2'>
                        <Label htmlFor={subField.name}>{t('form.description')}</Label>
                        <Textarea
                            id={subField.name}
                            name={subField.name}
                            value={subField.state.value as string}
                            onBlur={subField.handleBlur}
                            onChange={(e) => subField.handleChange(e.target.value)}
                            placeholder='GPA, relevant coursework, achievements...'
                            className='min-h-[100px] resize-none'
                        />
                    </div>
                )}
            </form.Field>
        </div>
    );
};

export const EducationSection = ({
    form,
    addEducation,
    removeEducation,
    reorderEducation,
}: EducationSectionProps) => {
    const { t } = useTranslation();
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const education = form.getFieldValue('education') as EducationProps[];
            const oldIndex = education.findIndex((_, i) => `education-${i}` === active.id);
            const newIndex = education.findIndex((_, i) => `education-${i}` === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderEducation(oldIndex, newIndex);
            }
        }
    };

    return (
        <FormSectionCard
            icon={GraduationCap}
            iconGradient='from-violet-500 to-purple-600'
            title={t('sections.education.title')}
            description={t('sections.education.description')}
            headerAction={
                <Button
                    type='button'
                    onClick={addEducation}
                    className='bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg'
                >
                    <Plus className='mr-2 h-4 w-4' />
                    {t('sections.education.add')}
                </Button>
            }
        >
            <form.Field name='education'>
                {(field) => {
                    const educationItems = field.state.value as EducationProps[];
                    return (
                        <div className='space-y-6'>
                            {educationItems.length === 0 && (
                                <div className='py-8 text-center'>
                                    <div className='mx-auto mb-3 inline-flex rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-2.5 text-white/60 shadow-inner'>
                                        <GraduationCap className='h-6 w-6' />
                                    </div>
                                    <p className='font-display font-medium text-slate-500 dark:text-slate-400'>
                                        {t('sections.education.empty')}
                                    </p>
                                    <p className='mt-1 text-sm text-slate-400 dark:text-slate-500'>
                                        {t('sections.education.emptyHint')}
                                    </p>
                                </div>
                            )}
                            {educationItems.length > 0 && (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={educationItems.map(
                                            (_: EducationProps, index: number) =>
                                                `education-${index}`,
                                        )}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className='space-y-6'>
                                            {educationItems.map(
                                                (_: EducationProps, index: number) => (
                                                    <SortableEducationItem
                                                        key={`education-${index}`}
                                                        id={`education-${index}`}
                                                        index={index}
                                                        form={form}
                                                        removeEducation={removeEducation}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    );
                }}
            </form.Field>
        </FormSectionCard>
    );
};
