export function accessor(x, fallback) {
  return x == null ? fallback
    : typeof x === 'function' ? x
    : d => d[x];
}
