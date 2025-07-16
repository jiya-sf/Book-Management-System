import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/js-with-ts', 
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
  '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.jest.json' }],
},
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};

export default config;
