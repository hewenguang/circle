export default function (event: KeyboardEvent) {
  const key = (event.key || '').trim().length > 0 ? event.key : event.code;
  if (!key || ['alt', 'control', 'meta', 'shift'].includes(key.toLowerCase())) {
    return;
  }
  const keys = [];
  switch (key) {
    case '？':
      keys.push('?');
      break;
    case 'Escape':
      keys.push('esc');
      break;
    case 'ArrowRight':
      keys.push('→');
      break;
    case 'ArrowLeft':
      keys.push('←');
      break;
    case 'ArrowUp':
      keys.push('↑');
      break;
    case 'ArrowDown':
      keys.push('↓');
      break;
    default:
      keys.push(key);
  }
  event.altKey && keys.unshift('alt');
  event.ctrlKey && keys.unshift('ctrl');
  event.metaKey && keys.unshift('meta');
  // event.shiftKey && keys.unshift('shift');
  if (keys.length <= 0) {
    return;
  }
  return keys.join('+');
}
