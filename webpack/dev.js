const path = require('path');
const config = require('./config.json');
const MiniCssExtractPlugin =  require('mini-css-extract-plugin');
const { getHTMLPlugins, getOutput, getCopyPlugins, getEntry } = require('./utils');

const generalConfig = {
  mode: 'development',
  devtool: false,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      resolve: {
        extensions: ['.js', '.jsx']
      },
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        }
      },
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        }
      }, 'eslint-loader'],
    },
    {
      test: /\.(css|less)$/,
      use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled:true
          }
        }
      }],
    }],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, `${config.chromePath}/`),
    },
    extensions: ['.js', '.jsx'],
  },
};

module.exports = [
  {
    ...generalConfig,
    entry: getEntry(config.chromePath, config.devDirectory),
    output: getOutput('chrome', config.devDirectory),
    plugins: [
      ...getHTMLPlugins('chrome', config.devDirectory, config.chromePath),
      ...getCopyPlugins('chrome', config.devDirectory, config.chromePath),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
  },
  // {
  //   ...generalConfig,
  //   entry: getEntry(config.operaPath),
  //   output: getOutput('opera', config.devDirectory),
  //   plugins: [
  //     ...getHTMLPlugins('opera', config.devDirectory, config.operaPath),
  //     ...getCopyPlugins('opera', config.devDirectory, config.operaPath),
  //   ],
  // },
  // {
  //   ...generalConfig,
  //   entry: getEntry(config.firefoxPath),
  //   output: getOutput('firefox', config.devDirectory),
  //   plugins: [
  //     ...getFirefoxCopyPlugins('firefox', config.devDirectory, config.firefoxPath),
  //     ...getFirefoxCopyPlugins('firefox', config.devDirectory, config.firefoxPath),
  //   ],
  // },
];
