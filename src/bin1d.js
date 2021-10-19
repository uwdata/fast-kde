export function bin1d(data, x, weight, lo, hi, n) {
  const grid = new Float64Array(n);
  const delta = (n - 1) / (hi - lo);

  for (let i = 0; i < data.length; ++i) {
    const d = data[i];
    const p = (x(d, i, data) - lo) * delta;
    const u = Math.floor(p);
    const v = u + 1;
    const w = weight(d, i, data);

    if (0 <= u && v < n) {
      grid[u] += (v - p) * w;
      grid[v] += (p - u) * w;
    } else if (u === -1) {
      grid[v] += (p - u) * w;
    } else if (v === n) {
      grid[u] += (v - p) * w;
    }
  }

  return grid;
}
