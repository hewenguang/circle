export default function (data: any) {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.sort(
    (prev: any, next: any) => (prev.priority || 0) - (next.priority || 0)
  );
}
