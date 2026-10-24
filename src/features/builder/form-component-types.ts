// Shared types for form section components
// These types provide typing for TanStack Form API usage in components

export type FormField = {
    name: string;
    state: {
        value: unknown;
        meta: {
            errors: ReadonlyArray<string | { message: string } | undefined>;
            isTouched: boolean;
            isValid: boolean;
        };
    };
    handleBlur: () => void;
    handleChange: (value: unknown) => void;
};

export type FormApi = {
    Field: React.FC<{
        name: string;
        children: (field: FormField) => React.ReactNode;
    }>;
    getFieldValue: (name: string) => unknown;
    setFieldValue: (name: string, value: unknown) => void;
    state: {
        values: unknown;
    };
};
