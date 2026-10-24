import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FormSectionCard } from '@/features/builder/form-sections/form-section-card';
import { getLanguageLevels } from '@/lib/language-levels';
import type { LanguageProps, LanguageLevelProps } from '@/types/form-types';
import { Trash2, Plus, Globe, GripVertical } from 'lucide-react';
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

interface LanguagesSectionProps {
    form: FormApi;
    addLanguage: () => void;
    removeLanguage: (index: number) => void;
    reorderLanguages: (oldIndex: number, newIndex: number) => void;
}

interface SortableLanguageItemProps {
    id: string;
    index: number;
    form: FormApi;
    removeLanguage: (index: number) => void;
}

const SortableLanguageItem = ({ id, index, form, removeLanguage }: SortableLanguageItemProps) => {
    const { t } = useTranslation();
    const languageLevels = getLanguageLevels(t);
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
            className={`rounded-xl border border-slate-200/60 bg-white/40 p-6 backdrop-blur-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-white/[0.02] dark:hover:shadow-indigo-500/5 ${isDragging ? 'shadow-lg ring-2 ring-indigo-500/20' : ''}`}
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
                        {t('sections.languages.item', { number: index + 1 })}
                    </h4>
                </div>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeLanguage(index)}
                    className='text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400'
                    aria-label={t('accessibility.removeLanguage')}
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <form.Field name={`languages[${index}].language`}>
                    {(subField) => (
                        <div className='space-y-2'>
                            <Label htmlFor={subField.name}>{t('form.language')}</Label>
                            <Input
                                id={subField.name}
                                name={subField.name}
                                value={subField.state.value as string}
                                onBlur={subField.handleBlur}
                                onChange={(e) => subField.handleChange(e.target.value)}
                                placeholder={t('placeholders.language')}
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name={`languages[${index}].proficiency`}>
                    {(subField) => (
                        <div className='space-y-2'>
                            <Label htmlFor={subField.name}>{t('form.proficiency')}</Label>
                            <Select
                                value={subField.state.value as string}
                                onValueChange={(value) =>
                                    subField.handleChange(value as LanguageLevelProps)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t('placeholders.selectProficiency')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {languageLevels.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                            {level.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </form.Field>
            </div>
        </div>
    );
};

export const LanguagesSection = ({
    form,
    addLanguage,
    removeLanguage,
    reorderLanguages,
}: LanguagesSectionProps) => {
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
            const languages = form.getFieldValue('languages') as LanguageProps[];
            const oldIndex = languages.findIndex((_, i) => `language-${i}` === active.id);
            const newIndex = languages.findIndex((_, i) => `language-${i}` === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderLanguages(oldIndex, newIndex);
            }
        }
    };

    return (
        <FormSectionCard
            icon={Globe}
            iconGradient='from-cyan-500 to-blue-600'
            title={t('sections.languages.title')}
            description={t('sections.languages.description')}
            headerAction={
                <Button
                    type='button'
                    onClick={addLanguage}
                    className='bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg'
                >
                    <Plus className='mr-2 h-4 w-4' />
                    {t('sections.languages.add')}
                </Button>
            }
        >
            <form.Field name='languages'>
                {(field) => {
                    const languageItems = field.state.value as LanguageProps[];
                    return (
                        <div className='space-y-4'>
                            {languageItems.length === 0 && (
                                <div className='py-8 text-center'>
                                    <div className='mx-auto mb-3 inline-flex rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 text-white/60 shadow-inner'>
                                        <Globe className='h-6 w-6' />
                                    </div>
                                    <p className='font-display font-medium text-slate-500 dark:text-slate-400'>
                                        {t('sections.languages.empty')}
                                    </p>
                                    <p className='mt-1 text-sm text-slate-400 dark:text-slate-500'>
                                        {t('sections.languages.emptyHint')}
                                    </p>
                                </div>
                            )}
                            {languageItems.length > 0 && (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={languageItems.map(
                                            (_: LanguageProps, index: number) =>
                                                `language-${index}`,
                                        )}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className='space-y-4'>
                                            {languageItems.map(
                                                (_: LanguageProps, index: number) => (
                                                    <SortableLanguageItem
                                                        key={`language-${index}`}
                                                        id={`language-${index}`}
                                                        index={index}
                                                        form={form}
                                                        removeLanguage={removeLanguage}
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
