import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
    // same compiler as vite.config.ts, so tests run the memoized components
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, 'src'),
            'virtual:pwa-register/react': resolve(
                import.meta.dirname,
                'src/test/pwa-register-mock.ts',
            ),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/test/**',
                'src/routeTree.gen.ts',
                'src/**/*.test.{ts,tsx}',
                'src/routes/**',
                'src/main.tsx',
            ],
            thresholds: {
                lines: 50,
                functions: 50,
                branches: 50,
                statements: 50,
            },
        },
    },
});
