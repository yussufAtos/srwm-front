const PROXY_CONFIG = [
  {
    context: ['/dev'],
    target: 'http://vspar-iris-d-wsback-31.afp.com:8585',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    pathRewrite: {
      '^/dev': '',
    },
  },

  {
    context: ['/wsm'],
    target: 'http://vspar-iris-v-wsback-31.afp.com:8585',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    pathRewrite: {},
  },
]

module.exports = PROXY_CONFIG
