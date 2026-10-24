import { Star } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { FormSectionCard } from './form-section-card';

describe('FormSectionCard', () => {
    it('renders title and description', () => {
        render(
            <FormSectionCard
                icon={Star}
                iconGradient='from-blue-500 to-indigo-500'
                title='Test Title'
                description='Test description'
            >
                <p>Content</p>
            </FormSectionCard>,
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <FormSectionCard
                icon={Star}
                iconGradient='from-blue-500 to-indigo-500'
                title='Title'
                description='Desc'
            >
                <p>Child content here</p>
            </FormSectionCard>,
        );
        expect(screen.getByText('Child content here')).toBeInTheDocument();
    });

    it('renders optional headerAction', () => {
        render(
            <FormSectionCard
                icon={Star}
                iconGradient='from-blue-500 to-indigo-500'
                title='Title'
                description='Desc'
                headerAction={<button>Action</button>}
            >
                <p>Content</p>
            </FormSectionCard>,
        );
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('does not render headerAction when not provided', () => {
        render(
            <FormSectionCard
                icon={Star}
                iconGradient='from-blue-500 to-indigo-500'
                title='Title'
                description='Desc'
            >
                <p>Content</p>
            </FormSectionCard>,
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
