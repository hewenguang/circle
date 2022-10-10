const path = require('path');
const Webpack = require('webpack');
const common = require('./common');
const webpackMerge = require('webpack-merge');
const HotReload = require('./plugin/hot-reload');
const { DEV, PORT, CRX_V3 } = require('./config.json');

module.exports = webpackMerge.merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, DEV),
    publicPath: '/',
  },
  plugins: [
    new Webpack.DefinePlugin({
      DEBUG: JSON.stringify(true),
      CRX_V3: JSON.stringify(CRX_V3),
    }),
    new HotReload({
      port: PORT,
      entry: /(app|option)\.js/,
      worker: /worker/,
      dist: path.resolve(__dirname, DEV),
    }),
  ],
});
