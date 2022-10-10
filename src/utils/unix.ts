export default function (timestamp: number = Date.now()) {
  return Math.floor(timestamp / 1000);
}
