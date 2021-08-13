module.exports = {
  grid1d_shifted,
  grid1d_simple
};

function grid1d_simple(data, lo, scale, n, offset = 0) {
  const grid = new Float64Array(n);

  // simple binning
  for (let i = 0; i < data.length; ++i) {
    const u = (offset + scale * (data[i] - lo)) | 0;
    if (0 <= u && u < n) {
      grid[u] += 1;
    }
  }

  return grid;
}

function grid1d_shifted(data, lo, scale, n, offset = 0) {
  const grid = new Float64Array(n);

  // shifted linear binning
  for (let i = 0; i < data.length; ++i) {
    const x = offset + scale * (data[i] - lo);
    const u = x | 0;
    const d = x - u;
    if (d < 0.5) {
      if (u > 0) grid[u-1] += 0.5 - d;
      grid[u] += 0.5 + d;
    } else if (d > 0.5) {
      grid[u] += 1.5 - d;
      if (u + 1 < n) grid[u + 1] += d - 0.5;
    } else {
      grid[u] += 1;
    }
  }

  return grid;
}
