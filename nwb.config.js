module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false,
  },
  webpack: {
    html: {
      template: 'demo/src/index.html',
    },
  },
  babel: {
    plugins: [
      ['module-resolver', {
        'alias': {
          'cart':          './src/cart',
          'checkout':      './src/checkout',
          'donate':        './src/donate',
          'form':          './src/form',
          'registrations': './src/registrations',
          'shared':        './src/shared',
          'subscribe':     './src/subscribe',
        },
      }],
    ],
  },
};
