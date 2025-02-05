module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
        ['module:react-native-dotenv', {
            moduleName: '@env',
            path: '.env',
            allowlist: null,
            blocklist: null,
            safe: false,
            allowUndefined: true,
        }],
        'react-native-reanimated/plugin'  // ✅ Este deve ser o último plugin
    ],
};
