import unix from '@/utils/unix';

type Items = Array<{
  id: string;
  title: string;
  deny: boolean;
  changed: number;
}>;

export function format(value: Items) {
  return value
    .sort(function (prev, next) {
      return next.changed - prev.changed;
    })
    .map(function (item) {
      return `${item.id} | ${item.title}`;
    })
    .join('\n');
}

export function parser(value: string = '', state?: boolean) {
  const data: Items = [];
  const rules = value.split('\n');
  if (rules.length <= 0) {
    return data;
  }
  rules.reverse().forEach((item) => {
    const rule = item.split(/\||｜/);
    const id = (rule[0] || '').trim();
    const title = (rule[1] || '').trim();
    if (!id) {
      return;
    }
    data.push({
      id,
      title,
      deny: !!state,
      changed: unix(),
    });
  });
  return data;
}
