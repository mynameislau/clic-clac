const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/js/expand',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'expand.js',
    library: 'expand',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js/,
        // Include: [path.resolve(__dirname, 'app/js')]
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'es2015',
              'stage-0'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
};
