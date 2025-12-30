const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Expo 54 + Router 필수
config.resolver.sourceExts.push('cjs');

module.exports = withNativeWind(config, {
    input: './global.css',
});
