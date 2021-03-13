const path = require('path');
const glob = require('glob');
const ZipPlugin = require('zip-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const getHTMLPlugins = (browserDir, outputDir = 'dev', sourceDir = 'src') => [
  new HtmlWebpackPlugin({
    filename: path.resolve(__dirname, `${outputDir}/${browserDir}/option/index.html`),
    template: path.resolve(__dirname, `${sourceDir}/option/index.html`),
    chunks: ['option/index'],
  }),
];

const getOutput = (browserDir, outputDir = 'dev') => {
  return {
    filename: '[name].js',
    path: path.resolve(__dirname, `${outputDir}/${browserDir}`),
  };
};

const getEntry = (sourceDir = 'src', outputDir = 'dev') => {
  const entries = {
    'option/index': path.resolve(__dirname, `${sourceDir}/option/index.jsx`),
    'client/index': path.resolve(__dirname, `${sourceDir}/client/index.js`),
    'server/index': path.resolve(__dirname, `${sourceDir}/server/index.js`),
    'includes/index': path.resolve(__dirname, `${sourceDir}/includes/index.js`),
  };
  outputDir === '../dev' && (entries['server/hotreload'] = path.resolve(__dirname, `${sourceDir}/server/hot-reload.js`));
  glob.sync('src/plugins/*/index.js*').forEach(item => {
    const name = item.split('/')[2];
    entries[`plugins/v2/${name}`] = path.resolve(__dirname, `../${item}`);
  });
  return entries;
};

const getCopyPlugins = (browserDir, outputDir = 'dev', sourceDir = 'src') => [
  new CopyWebpackPlugin({
    patterns: [
      { from: path.resolve(__dirname, `${sourceDir}/assets`), to: path.resolve(__dirname, `${outputDir}/${browserDir}/assets`) },
      { from: path.resolve(__dirname, `${sourceDir}/_locales`), to: path.resolve(__dirname, `${outputDir}/${browserDir}/_locales`) },
      {
        from: path.resolve(__dirname, `${sourceDir}/manifest.json`),
        to: path.resolve(__dirname, `${outputDir}/${browserDir}/manifest.json`),
        transform(content) {
          const manifest = JSON.parse(content.toString());
          outputDir === '../dev' && manifest.background.scripts.push('server/hotreload.js');
          return JSON.stringify(manifest);
        }
      },
    ]
  }),
];

const getFirefoxCopyPlugins = (browserDir, outputDir = 'dev', sourceDir = 'src') => [
  new CopyWebpackPlugin({
    patterns: [
      { from: path.resolve(__dirname, `${sourceDir}/assets`), to: path.resolve(__dirname, `${outputDir}/${browserDir}/assets`) },
      { from: path.resolve(__dirname, `${sourceDir}/_locales`), to: path.resolve(__dirname, `${outputDir}/${browserDir}/_locales`) },
      { from: path.resolve(__dirname, `${sourceDir}/manifest-ff.json`), to: path.resolve(__dirname, `${outputDir}/${browserDir}/manifest.json`) },
    ]
  }),
];

const getZipPlugin = (browserDir, outputDir = 'dist') =>
  new ZipPlugin({
    path: path.resolve(__dirname, `${outputDir}/${browserDir}`),
    filename: browserDir,
    extension: 'zip',
    fileOptions: {
      mtime: new Date(),
      mode: 0o100664,
      compress: true,
      forceZip64Format: false,
    },
    zipOptions: {
      forceZip64Format: false,
    },
});

module.exports = {
  getHTMLPlugins,
  getOutput,
  getCopyPlugins,
  getFirefoxCopyPlugins,
  getZipPlugin,
  getEntry,
};
