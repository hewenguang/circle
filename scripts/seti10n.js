const path = require('path');
const glob = require('glob');
const { readFileSync, writeFileSync } = require('fs');

const counter = 4;
const i10nItem = ['en', 'ja', 'ko', 'th', 'zh_TW'][counter];
const data = readFileSync(
  path.resolve(__dirname, `../.cache/i10n/${i10nItem}.txt`)
);
const result = data
  .toString()
  .split('\n\n')
  .map((item) => item.split('\n'));

glob.sync('src/widget/*/i10n/zh-CN.json').forEach((item, index) => {
  const name = item.split('/')[2];
  const lang = result[index];
  const file = readFileSync(path.resolve(__dirname, `../${item}`));
  const manifest = JSON.parse(file);
  const itemLang = {};
  Object.keys(manifest).forEach((key, keyIndex) => {
    itemLang[key] = lang[keyIndex];
  });
  writeFileSync(
    path.join(__dirname, `../src/widget/${name}/i10n/${i10nItem}.json`),
    JSON.stringify(itemLang, null, ' ')
  );
});
