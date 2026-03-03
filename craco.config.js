module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Filter out source-map-loader from all rules
      const rules = webpackConfig.module.rules.find(rule => Array.isArray(rule.oneOf));
      if (rules && rules.oneOf) {
        rules.oneOf = rules.oneOf.filter(
          rule => !(rule.loader && rule.loader.includes('source-map-loader'))
        );
      }
      
      // Also filter from top-level rules
      webpackConfig.module.rules = webpackConfig.module.rules.filter(
        rule => !(rule.loader && rule.loader.includes('source-map-loader'))
      );
      
      return webpackConfig;
    },
  },
};
