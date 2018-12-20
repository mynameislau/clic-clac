const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/js/clic-clac',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'clic-clac.js',
    library: 'clicClac',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js|\.ts/,
        // Include: [path.resolve(__dirname, 'app/js')]
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/preset-typescript']
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
