const webpack = require('webpack');
const path = require('path');
const JavaScriptObfuscator = require('webpack-obfuscator');

const config = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [],
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.plugins.push(
      new JavaScriptObfuscator(
        {
          rotateStringArray: true,
          selfDefending: true,
          stringArrayEncoding: 'rc4',
          transformObjectKeys: true,
        },
        ['abc.js'],
      ),
    );
  }

  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  return config;
};
