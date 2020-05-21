const config = {
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: {
        module: 'commonjs',
        target: 'ES2019',
        lib: ['es5', 'es6'],
        moduleResolution: 'node',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        noImplicitAny: true,
        sourceMap: true,
      },
    },
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/../../backend/src/', './'],
};
module.exports = config;
