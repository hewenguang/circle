const path = require('path');
const glob = require('glob');
const { readFileSync, writeFileSync } = require('fs');

const wrapper = (data) => {
  return data
    .map((item) => Object.values(item.manifest).join('\n'))
    .join('\n\n');
};

const i10n = [];
glob.sync('src/widget/*/i10n/zh-CN.json').forEach((item) => {
  const name = item.split('/')[2];
  const file = readFileSync(path.resolve(__dirname, `../${item}`));
  const manifest = JSON.parse(file);
  i10n.push({
    name,
    manifest,
  });
});

writeFileSync(path.join(__dirname, '../.cache/i10n/zh-CN.txt'), wrapper(i10n));
