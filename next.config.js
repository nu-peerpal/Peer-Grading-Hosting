module.exports = {
  publicRuntimeConfig: {
    // Will be available on both server and client
    AWS_ACCESS_KEY_ID: 'AKIASL7DNOD2T3WW6L7W',
    AWS_SECRET_ACCESS_KEY: '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',
  },
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty'
        }
      }

      return config
    }
  }