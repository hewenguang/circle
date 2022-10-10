import { debug } from '@/config';

export default function (...args: any) {
  debug && console.log.apply(null, args);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function log(...args: any) {}
