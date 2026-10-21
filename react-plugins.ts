import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// React plus the React Compiler, shared by vite.config.ts and vitest.config.ts
// so the tests run the same memoized components as the build
export const reactPlugins = () => [react(), babel({ presets: [reactCompilerPreset()] })];
