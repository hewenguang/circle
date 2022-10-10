const path = require('path');
const glob = require('glob');
const Webpack = require('webpack');
const Webpackbar = require('webpackbar');
const InlineCss = require('./plugin/inline-css');
const EslintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { SRC, PUBLIC, CRX_V3, FIREFOX } = require('./config.json');

const entry = {};
// 基座应用
['app', 'worker', 'option'].map((item) => {
  entry[item] = path.resolve(__dirname, `${SRC}/${item}.ts`);
});
// 插件
glob.sync('src/widget/*/index.{ts,tsx}').forEach((item) => {
  const keys = item.split('/');
  entry[`${keys[1]}/${keys[2]}`] = path.resolve(__dirname, `../${item}`);
});

module.exports = {
  entry,
  target: 'web',
  devtool: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, SRC),
      '@cache': path.resolve(__dirname, '../.cache'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  'root-entry-name': 'default', //'variable'
                },
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new Webpackbar(),
    new InlineCss(),
    new EslintPlugin(),
    new StylelintPlugin({
      fix: true,
      context: './src',
      extensions: ['css', 'less'],
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
    }),
    new Webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/(zh-cn)$/),
    new HtmlWebpackPlugin({
      inject: 'body',
      chunks: ['option'],
      filename: 'option.html',
      template: path.resolve(__dirname, `${PUBLIC}/template/option.html`),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, `${PUBLIC}/ext`),
        },
        {
          from: path.resolve(
            __dirname,
            `${PUBLIC}/manifest${FIREFOX ? '-ff' : ''}${
              CRX_V3 ? '-new' : ''
            }.json`
          ),
          to: 'manifest.json',
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 1000,
      cacheGroups: {
        react: {
          test: /react|react-dom|classnames/,
          name: 'widget/react',
          chunks: 'initial',
          priority: -2,
        },
        antd: {
          test: /lodash|moment|antd|@ant-design|@ctrl\/tinycolor|node_modules\/rc-*?|async-validator|@babel\/runtime|regenerator-runtime|dom-align|scheduler|resize-observer-polyfill|copy-to-clipboard|compute-scroll-into-view|scroll-into-view-if-needed|memoize-one|json2mq|string-convert|shallowequal|toggle-selection|[\\/]component\/wrapper[\\/]/,
          name: 'widget/antd',
          chunks: 'initial',
          priority: -3,
        },
      },
    },
  },
};
