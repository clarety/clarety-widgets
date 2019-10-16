module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false,
  },
  devServer: {
    hot: false,
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
          'cart':         './src/cart',
          'checkout':     './src/checkout',
          'donate':       './src/donate',
          'form':         './src/form',
          'registration': './src/registration',
          'shared':       './src/shared',
          'subscribe':    './src/subscribe',
        },
      }],
    ],
  },
};
