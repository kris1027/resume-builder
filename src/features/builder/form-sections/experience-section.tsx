import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormSectionCard } from '@/features/builder/form-sections/form-section-card';
import type { ExperienceProps } from '@/features/resume/form-types';
import { Trash2, Plus, Briefcase, GripVertical } from 'lucide-react';
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

interface ExperienceSectionProps {
    form: FormApi;
    addExperience: () => void;
    removeExperience: (index: number) => void;
    reorderExperiences: (oldIndex: number, newIndex: number) => void;
}

interface SortableExperienceItemProps {
    id: string;
    index: number;
    form: FormApi;
    removeExperience: (index: number) => void;
}

const SortableExperienceItem = ({
    id,
    index,
    form,
    removeExperience,
}: SortableExperienceItemProps) => {
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
                        {t('sections.experience.item', { number: index + 1 })}
                    </h4>
                </div>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeExperience(index)}
                    className='text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400'
                    aria-label={t('accessibility.removeExperience')}
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <form.Field name={`experiences[${index}].company`}>
                    {(subField) => (
                        <div className='space-y-2'>
                            <Label htmlFor={subField.name}>{t('form.company')}</Label>
                            <Input
                                id={subField.name}
                                name={subField.name}
                                value={subField.state.value as string}
                                onBlur={subField.handleBlur}
                                onChange={(e) => subField.handleChange(e.target.value)}
                                placeholder={t('placeholders.company')}
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name={`experiences[${index}].position`}>
                    {(subField) => (
                        <div className='space-y-2'>
                            <Label htmlFor={subField.name}>{t('form.position')}</Label>
                            <Input
                                id={subField.name}
                                name={subField.name}
                                value={subField.state.value as string}
                                onBlur={subField.handleBlur}
                                onChange={(e) => subField.handleChange(e.target.value)}
                                placeholder={t('placeholders.position')}
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name={`experiences[${index}].location`}>
                    {(subField) => (
                        <div className='space-y-2'>
                            <Label htmlFor={subField.name}>{t('form.location')}</Label>
                            <Input
                                id={subField.name}
                                name={subField.name}
                                value={subField.state.value as string}
                                onBlur={subField.handleBlur}
                                onChange={(e) => subField.handleChange(e.target.value)}
                                placeholder={t('placeholders.locationJob')}
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name={`experiences[${index}].startDate`}>
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
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name={`experiences[${index}].endDate`}>
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
                                disabled={
                                    form.getFieldValue(`experiences[${index}].current`) as boolean
                                }
                            />
                        </div>
                    )}
                </form.Field>
            </div>

            <form.Field name={`experiences[${index}].current`}>
                {(subField) => (
                    <div className='flex items-center space-x-2 rounded-lg border border-slate-200/60 bg-slate-50/60 p-3 dark:border-white/5 dark:bg-white/[0.03]'>
                        <Checkbox
                            id={subField.name}
                            name={subField.name}
                            checked={subField.state.value as boolean}
                            onCheckedChange={(checked) => subField.handleChange(!!checked)}
                        />
                        <Label
                            htmlFor={subField.name}
                            className='cursor-pointer text-slate-700 dark:text-slate-300'
                        >
                            {t('form.currentlyWorking')}
                        </Label>
                    </div>
                )}
            </form.Field>

            <form.Field name={`experiences[${index}].description`}>
                {(subField) => (
                    <div className='space-y-2'>
                        <Label htmlFor={subField.name}>{t('form.description')}</Label>
                        <Textarea
                            id={subField.name}
                            name={subField.name}
                            value={subField.state.value as string}
                            onBlur={subField.handleBlur}
                            onChange={(e) => {
                                let value = e.target.value;
                                // Add bullet point at the start if empty and user starts typing
                                if (value.length === 1 && value !== '•') {
                                    value = '• ' + value;
                                }
                                subField.handleChange(value);
                            }}
                            onPaste={(e) => {
                                // Handle pasting into empty field - add bullet point
                                if (
                                    !(subField.state.value as string) ||
                                    (subField.state.value as string).length === 0
                                ) {
                                    const pastedText = e.clipboardData.getData('text');
                                    if (pastedText && !pastedText.trimStart().startsWith('•')) {
                                        e.preventDefault();
                                        subField.handleChange('• ' + pastedText.trimStart());
                                    }
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const target = e.target as HTMLTextAreaElement;
                                    const { selectionStart, selectionEnd, value } = target;
                                    const newValue =
                                        value.substring(0, selectionStart) +
                                        '\n• ' +
                                        value.substring(selectionEnd);
                                    subField.handleChange(newValue);
                                    // Set cursor position after the bullet point (requestAnimationFrame ensures DOM has updated)
                                    requestAnimationFrame(() => {
                                        target.selectionStart = target.selectionEnd =
                                            selectionStart + 3;
                                    });
                                }
                            }}
                            placeholder={t('placeholders.description')}
                            className='min-h-[120px] resize-none'
                        />
                        <p className='text-xs text-slate-500'>
                            {t('sections.experience.bulletHint')}
                        </p>
                    </div>
                )}
            </form.Field>
        </div>
    );
};

export const ExperienceSection = ({
    form,
    addExperience,
    removeExperience,
    reorderExperiences,
}: ExperienceSectionProps) => {
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
            const experiences = form.getFieldValue('experiences') as ExperienceProps[];
            const oldIndex = experiences.findIndex((_, i) => `experience-${i}` === active.id);
            const newIndex = experiences.findIndex((_, i) => `experience-${i}` === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderExperiences(oldIndex, newIndex);
            }
        }
    };

    return (
        <FormSectionCard
            icon={Briefcase}
            iconGradient='from-emerald-500 to-teal-600'
            title={t('sections.experience.title')}
            description={t('sections.experience.description')}
            headerAction={
                <Button
                    type='button'
                    onClick={addExperience}
                    className='bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg'
                >
                    <Plus className='mr-2 h-4 w-4' />
                    {t('sections.experience.add')}
                </Button>
            }
        >
            <form.Field name='experiences'>
                {(field) => {
                    const experiences = field.state.value as ExperienceProps[];
                    return (
                        <div className='space-y-6'>
                            {experiences.length === 0 && (
                                <div className='py-8 text-center'>
                                    <div className='mx-auto mb-3 inline-flex rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 text-white/60 shadow-inner'>
                                        <Briefcase className='h-6 w-6' />
                                    </div>
                                    <p className='font-display font-medium text-slate-500 dark:text-slate-400'>
                                        {t('sections.experience.empty')}
                                    </p>
                                    <p className='mt-1 text-sm text-slate-400 dark:text-slate-500'>
                                        {t('sections.experience.emptyHint')}
                                    </p>
                                </div>
                            )}
                            {experiences.length > 0 && (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={experiences.map(
                                            (_: ExperienceProps, index: number) =>
                                                `experience-${index}`,
                                        )}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className='space-y-6'>
                                            {experiences.map(
                                                (_: ExperienceProps, index: number) => (
                                                    <SortableExperienceItem
                                                        key={`experience-${index}`}
                                                        id={`experience-${index}`}
                                                        index={index}
                                                        form={form}
                                                        removeExperience={removeExperience}
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
