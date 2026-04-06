// Babel config for component tests — supports JSX + TypeScript + RN transforms.
// Uses the automatic JSX runtime so component files don't need `import React`.
// Used by jest.config.js for *.tsx component test files.
module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-nullish-coalescing-operator',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-transform-object-rest-spread',
  ],
};
