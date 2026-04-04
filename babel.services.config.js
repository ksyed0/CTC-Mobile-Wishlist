// Babel config for transpiling TypeScript service tests via babel-jest.
// Uses only packages that are already installed (no @babel/preset-env required).
module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-nullish-coalescing-operator',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-transform-object-rest-spread',
  ],
};
