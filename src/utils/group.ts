import sort from '@/utils/sort';

export default function (target: any, callback: any) {
  let items = {};
  sort(target).forEach(function (item: any) {
    const groupKey = callback(item);
    const key = typeof groupKey !== 'undefined' ? groupKey : '0';
    !items[key] && (items[key] = []);
    items[key].push(item);
  });
  return items;
}
