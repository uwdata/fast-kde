module.exports = {
  err_interp1d,
  err_interp2d
};

function err_interp1d(a, b) {
  const n = a.length;
  const m = b.length;

  let a_max = 0, b_max = 0;
  for (let i = 0; i < n; ++i) if (a[i] > a_max) a_max = a[i];
  for (let j = 0; j < m; ++j) if (b[j] > b_max) b_max = b[j];

  const interp = n === m
   ? i => b[i]
   : i => {
      const f = i * (m - 1) / (n - 1);
      const j = f | 0;
      if (f === j || f > m - 1) return b[j];
      return (f - j) * b[j + 1] + (1 - (f - j)) * b[j];
    };

  let max = 0, max_idx = -1;
  let rms = 0;
  for (let i = 0; i < n; ++i) {
    const d = 100 * Math.abs(interp(i) / b_max - a[i] / a_max);
    if (d > max) { max = d; max_idx = i; }
    rms += d * d;
  }

  return [Math.sqrt(rms / n), max, max_idx];
}

function err_interp2d(a, b) {
  const n = a.length;
  const m = b.length;
  const nr = Math.sqrt(n) | 0;
  const mr = Math.sqrt(m) | 0;
  const s = (mr - 1) / (nr - 1);

  let a_max = 0, b_max = 0;
  for (let i = 0; i < n; ++i) if (a[i] > a_max) a_max = a[i];
  for (let j = 0; j < m; ++j) if (b[j] > b_max) b_max = b[j];

  const interp = n === m
   ? (i, j) => b[i * mr + j]
   : (i, j) => {
      const x = j * s;
      const u = x | 0;
      const y = i * s;
      const v = y | 0;
      const dy = y - v;
      const dx = x - u;

      const u2 = x >= mr - 1 ? u : u + 1;
      const v2 = y >= mr - 1 ? v : v + 1;
      return dx * dy * b[mr * v2 + u2]
        + dx * (1 - dy) * b[mr * v + u2]
        + (1 - dx) * dy * b[mr * v2 + u]
        + (1 - dx) * (1 - dy) * b[mr * v + u];
    };

  let max = 0, max_idx = -1;
  let rms = 0;
  for (let i = 0; i < nr; ++i) {
    for (let j = 0; j < nr; ++j) {
      const d = 100 * Math.abs(interp(i, j) / b_max - a[i * nr + j] / a_max);
      if (d > max) { max = d; max_idx = i; }
      rms += d * d;
    }
  }

  return [Math.sqrt(rms / n), max, max_idx];
}
