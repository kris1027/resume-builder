import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormSectionCard } from '@/features/builder/form-sections/form-section-card';
import type { InterestProps } from '@/features/resume/form-types';
import { Plus, Heart, X, GripVertical } from 'lucide-react';
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

interface InterestsSectionProps {
    form: FormApi;
    addInterest: () => void;
    removeInterest: (index: number) => void;
    reorderInterests: (oldIndex: number, newIndex: number) => void;
}

interface SortableInterestItemProps {
    id: string;
    index: number;
    interest: InterestProps;
    removeInterest: (index: number) => void;
}

const SortableInterestItem = ({
    id,
    index,
    interest,
    removeInterest,
}: SortableInterestItemProps) => {
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
                {interest.name}
            </span>
            <button
                type='button'
                onClick={() => removeInterest(index)}
                className='opacity-0 transition-opacity group-hover:opacity-100'
                aria-label={t('accessibility.removeInterest')}
            >
                <X className='h-3 w-3 text-slate-400 hover:text-red-500' />
            </button>
        </div>
    );
};

export const InterestsSection = ({
    form,
    removeInterest,
    reorderInterests,
}: InterestsSectionProps) => {
    const { t } = useTranslation();
    const [interestInput, setInterestInput] = useState('');

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

    const handleAddInterest = () => {
        if (interestInput.trim()) {
            form.setFieldValue('interests', [
                ...(form.getFieldValue('interests') as InterestProps[]),
                { name: interestInput.trim() },
            ]);
            setInterestInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddInterest();
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const interests = form.getFieldValue('interests') as InterestProps[];
            const oldIndex = interests.findIndex((_, i) => `interest-${i}` === active.id);
            const newIndex = interests.findIndex((_, i) => `interest-${i}` === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderInterests(oldIndex, newIndex);
            }
        }
    };

    return (
        <FormSectionCard
            icon={Heart}
            iconGradient='from-rose-500 to-pink-600'
            title={t('sections.interests.title')}
            description={t('sections.interests.description')}
        >
            <div className='space-y-4'>
                <div className='flex gap-2'>
                    <Input
                        placeholder={t('placeholders.interest')}
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button
                        type='button'
                        onClick={handleAddInterest}
                        disabled={!interestInput.trim()}
                        className='bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700'
                    >
                        <Plus className='mr-2 h-4 w-4' />
                        {t('sections.interests.add')}
                    </Button>
                </div>

                <form.Field name='interests'>
                    {(field) => {
                        const interestItems = field.state.value as InterestProps[];
                        return (
                            <div>
                                {interestItems.length === 0 ? (
                                    <div className='py-8 text-center'>
                                        <div className='mx-auto mb-3 inline-flex rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 p-2.5 text-white/60 shadow-inner'>
                                            <Heart className='h-6 w-6' />
                                        </div>
                                        <p className='font-display font-medium text-slate-500 dark:text-slate-400'>
                                            {t('sections.interests.empty')}
                                        </p>
                                        <p className='mt-1 text-sm text-slate-400 dark:text-slate-500'>
                                            {t('sections.interests.emptyHint')}
                                        </p>
                                    </div>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={interestItems.map(
                                                (_: InterestProps, index: number) =>
                                                    `interest-${index}`,
                                            )}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            <div className='flex flex-wrap gap-2'>
                                                {interestItems.map(
                                                    (interest: InterestProps, index: number) => (
                                                        <SortableInterestItem
                                                            key={`interest-${index}`}
                                                            id={`interest-${index}`}
                                                            index={index}
                                                            interest={interest}
                                                            removeInterest={removeInterest}
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
