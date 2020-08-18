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
          'cart':              './src/cart',
          'checkout':          './src/checkout',
          'donate':            './src/donate',
          'file-upload':       './src/file-upload',
          'form':              './src/form',
          'fundraising-start': './src/fundraising-start',
          'lead-gen':          './src/lead-gen',
          'quiz':              './src/quiz',
          'registration':      './src/registration',
          'rsvp':              './src/rsvp',
          'shared':            './src/shared',
          'subscribe':         './src/subscribe',
        },
      }],
    ],
  },
};
