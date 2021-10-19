export function extent(data, x, pad = 0) {
  const n = data.length;
  let lo;
  let hi;
  for (let i = 0; i < n; ++i) {
    const v = x(data[i], i, data);
    if (v != null) {
      if (lo === undefined) {
        if (v >= v) lo = hi = v;
      } else {
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
  }
  return [lo - pad, hi + pad];
}
