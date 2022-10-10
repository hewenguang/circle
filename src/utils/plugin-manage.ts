export default function (name: string, disabled?: boolean) {
  const app = this;
  return app.option('plugin').then((plugins: Array<string>) => {
    let items = plugins || [];
    if (disabled) {
      items = items.filter((item) => item !== name);
    } else {
      !items.includes(name) && items.push(name);
    }
    return app.option({
      name: 'plugin',
      value: items,
    });
  });
}
