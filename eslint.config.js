import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

// One way import rule from spec 0002: pages, then the resume domain, then shared code.
const PAGE_AREAS = ['landing', 'gallery', 'builder', 'preview'];
const noParent = { group: ['../*', '../**'], message: 'Use the @/ alias, never ../ (spec 0002).' };
const ban = (paths, why) => ({ group: paths, message: `${why} (spec 0002).` });

// ESLint applies the last matching block for a rule, so every block repeats noParent.
const restrict = (files, bans) => ({
    files,
    rules: { 'no-restricted-imports': ['error', { patterns: [noParent, ...bans] }] },
});

const featureDirs = (names) => names.map((n) => `@/features/${n}/**`);
const entryBan = ban(
    ['@/app/**', '@/routes/**'],
    'Features and shared code never import the app shell or routes',
);

export default defineConfig([
    globalIgnores(['dist', '.agents']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
    {
        files: ['src/test/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
    { ...restrict(['src/**/*.{ts,tsx}'], []), ignores: ['src/routeTree.gen.ts'] },
    restrict(
        ['src/{components,lib,hooks,i18n}/**/*.{ts,tsx}'],
        [ban(['@/features/**'], 'Shared code never imports a feature area'), entryBan],
    ),
    restrict(
        ['src/features/resume/**/*.{ts,tsx}'],
        [
            ban(
                featureDirs([...PAGE_AREAS, 'templates', 'pdf']),
                'resume is the bottom domain area',
            ),
            entryBan,
        ],
    ),
    restrict(
        ['src/features/templates/**/*.{ts,tsx}'],
        [
            ban(featureDirs([...PAGE_AREAS, 'pdf']), 'templates may import only resume and shared'),
            entryBan,
        ],
    ),
    restrict(
        ['src/features/pdf/**/*.{ts,tsx}'],
        [
            ban(featureDirs(PAGE_AREAS), 'pdf may import only templates, resume and shared'),
            entryBan,
        ],
    ),
    ...PAGE_AREAS.map((area) =>
        restrict(
            [`src/features/${area}/**/*.{ts,tsx}`],
            [
                ban(
                    featureDirs(PAGE_AREAS.filter((a) => a !== area)),
                    'Page areas never import each other',
                ),
                entryBan,
            ],
        ),
    ),
    restrict(
        ['src/app/**/*.{ts,tsx}'],
        [ban(['@/routes/**'], 'The app shell never imports routes')],
    ),
    eslintConfigPrettier,
]);
