const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  reactStrictMode: true,
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  pwa: {
    dest: 'public',
    register: process.env !== 'development',
    skipWaiting: true,
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/],
  },
})
