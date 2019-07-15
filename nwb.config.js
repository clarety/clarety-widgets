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
          'shared':    './src/shared',
          'form':      './src/form',
          'subscribe': './src/subscribe',
          'donate':    './src/donate',
        },
      }],
    ],
  },
};
