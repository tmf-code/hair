module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsConfig: {
        target: 'ES2020',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        checkJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: 'ES2020',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        sourceMap: true,
        noEmit: true,
        jsx: 'react',
      },
    },
  },
};
