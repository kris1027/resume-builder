import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormSectionCard } from '@/features/builder/form-sections/form-section-card';
import type { SkillProps } from '@/types/form-types';
import { Plus, Code, X, GripVertical } from 'lucide-react';
import { useState } from 'react';
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
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SkillsSectionProps {
    form: FormApi;
    addSkill: () => void;
    removeSkill: (index: number) => void;
    reorderSkills: (oldIndex: number, newIndex: number) => void;
}

interface SortableSkillItemProps {
    id: string;
    index: number;
    skill: SkillProps;
    removeSkill: (index: number) => void;
}

const SortableSkillItem = ({ id, index, skill, removeSkill }: SortableSkillItemProps) => {
    const { t } = useTranslation();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center gap-1 rounded-full border border-slate-200/60 bg-white/60 px-3 py-1.5 backdrop-blur-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:hover:shadow-indigo-500/5 ${isDragging ? 'shadow-lg ring-2 ring-indigo-500/20' : ''}`}
        >
            <button
                type='button'
                className='cursor-grab touch-none rounded p-0.5 transition-colors hover:bg-slate-100 active:cursor-grabbing dark:hover:bg-white/10'
                aria-label={t('accessibility.dragToReorder')}
                {...attributes}
                {...listeners}
            >
                <GripVertical className='h-3 w-3 text-slate-400' />
            </button>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                {skill.name}
            </span>
            <button
                type='button'
                onClick={() => removeSkill(index)}
                className='opacity-0 transition-opacity group-hover:opacity-100'
                aria-label={t('accessibility.removeSkill')}
            >
                <X className='h-3 w-3 text-slate-400 hover:text-red-500' />
            </button>
        </div>
    );
};

export const SkillsSection = ({ form, removeSkill, reorderSkills }: SkillsSectionProps) => {
    const { t } = useTranslation();
    const [skillInput, setSkillInput] = useState('');

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

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            form.setFieldValue('skills', [
                ...(form.getFieldValue('skills') as SkillProps[]),
                { name: skillInput.trim() },
            ]);
            setSkillInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const skills = form.getFieldValue('skills') as SkillProps[];
            const oldIndex = skills.findIndex((_, i) => `skill-${i}` === active.id);
            const newIndex = skills.findIndex((_, i) => `skill-${i}` === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderSkills(oldIndex, newIndex);
            }
        }
    };

    return (
        <FormSectionCard
            icon={Code}
            iconGradient='from-amber-500 to-orange-600'
            title={t('sections.skills.title')}
            description={t('sections.skills.description')}
        >
            <div className='space-y-4'>
                <div className='flex gap-2'>
                    <Input
                        placeholder={t('placeholders.skill')}
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button
                        type='button'
                        onClick={handleAddSkill}
                        disabled={!skillInput.trim()}
                        className='bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700'
                    >
                        <Plus className='mr-2 h-4 w-4' />
                        {t('sections.skills.add')}
                    </Button>
                </div>

                <form.Field name='skills'>
                    {(field) => {
                        const skillItems = field.state.value as SkillProps[];
                        return (
                            <div>
                                {skillItems.length === 0 ? (
                                    <div className='py-8 text-center'>
                                        <div className='mx-auto mb-3 inline-flex rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 text-white/60 shadow-inner'>
                                            <Code className='h-6 w-6' />
                                        </div>
                                        <p className='font-display font-medium text-slate-500 dark:text-slate-400'>
                                            {t('sections.skills.empty')}
                                        </p>
                                        <p className='mt-1 text-sm text-slate-400 dark:text-slate-500'>
                                            {t('sections.skills.emptyHint')}
                                        </p>
                                    </div>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={skillItems.map(
                                                (_: SkillProps, index: number) => `skill-${index}`,
                                            )}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            <div className='flex flex-wrap gap-2'>
                                                {skillItems.map(
                                                    (skill: SkillProps, index: number) => (
                                                        <SortableSkillItem
                                                            key={`skill-${index}`}
                                                            id={`skill-${index}`}
                                                            index={index}
                                                            skill={skill}
                                                            removeSkill={removeSkill}
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
            </div>
        </FormSectionCard>
    );
};
