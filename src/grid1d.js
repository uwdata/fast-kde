export function grid1d_simple(data, n, lo, scale, offset = 0) {
  const grid = new Float64Array(n);

  for (let i = 0; i < data.length; ++i) {
    const u = (offset + scale * (data[i] - lo)) | 0;
    if (0 <= u && u < n) grid[u] += 1;
  }

  return grid;
}

export function grid1d_linear(data, n, lo, scale, offset = 0) {
  const grid = new Float64Array(n);

  for (let i = 0; i < data.length; ++i) {
    const x = offset + scale * (data[i] - lo) - 0.5;
    const u = x | 0;
    const v = u + 1;
    if (0 <= u && u < n) grid[u] += (v - x);
    if (0 <= v && v < n) grid[v] += (x - u);
  }

  return grid;
}
