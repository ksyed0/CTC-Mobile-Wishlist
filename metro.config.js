// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow Metro to bundle .html files so we can require() the catalog
config.resolver.assetExts.push('html');

module.exports = config;
