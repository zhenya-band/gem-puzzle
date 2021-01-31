const path = require('path');
const {
  CleanWebpackPlugin,
} = require('clean-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'cheap-source-map' : 'source-map',
    watch: !isProduction,
    entry: './js/script.js',
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, 'dist'),
    },
    plugins: [
      new CleanWebpackPlugin(),
    ],
    module: {
      rules: [{
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }],
    },
  };
  return config;
};
