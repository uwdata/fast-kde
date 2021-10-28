export function bin1d(data, x, weight, lo, hi, n) {
  const grid = new Float64Array(n);
  const delta = (n - 1) / (hi - lo);

  for (let i = 0; i < data.length; ++i) {
    const d = data[i];
    const xi = x(d, i, data);
    const wi = weight(d, i, data);

    // skip NaN and Infinite values
    if (!(Number.isFinite(xi) && Number.isFinite(wi))) {
      continue;
    }

    const p = (xi - lo) * delta;
    const u = Math.floor(p);
    const v = u + 1;

    if (0 <= u && v < n) {
      grid[u] += (v - p) * wi;
      grid[v] += (p - u) * wi;
    } else if (u === -1) {
      grid[v] += (p - u) * wi;
    } else if (v === n) {
      grid[u] += (v - p) * wi;
    }
  }

  return grid;
}
