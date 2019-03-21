var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/clarety-widgets.js',
  output: {
    path: path.resolve('lib'),
    filename: 'clarety-widgets.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] },
      },
    ],
  }
}
