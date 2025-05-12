const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  config.resolver.sourceExts = [...config.resolver.sourceExts, "cjs"];

  config.resolver.unstable_enablePackageExports = false;

  return config;
})();