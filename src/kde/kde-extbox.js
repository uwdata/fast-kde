module.exports = {
  kdeExtBox1d,
  kdeExtBox2d
};

function kdeExtBox1d(data, domain, steps, bandwidth, grid1d) {
  const K = 3;
  const lo = domain[0];
  const sf = (steps) / (domain[1] - lo);
  const sd = bandwidth * sf;
  const s2 = sd * sd;
  const r = Math.floor(0.5 * Math.sqrt((12 / K) * s2 + 1) - 0.5);
  const o = r ? r * K : 0; // offset padding for blur
  const n = 2 * o + steps; // num cells

  const d = 2 * r + 1;
  const a = d * (r * (r + 1) - 3 * s2 / K) /
            (6 * (s2 / K - (r + 1) * (r + 1)));
  const c1 = a / (d + 2 * a);
  const c2 = (1 - a) / (d + 2 * a);

  // grid and sliding window
  const grid = grid1d(data, lo, sf, n, o);
  const dest = new Float64Array(n);

  // use extended box filter to efficiently approximate gaussian kernel
  extBoxFilter(grid, dest, n, r, c1, c2, 1);
  extBoxFilter(dest, grid, n, r, c1, c2, 1);
  extBoxFilter(grid, dest, n, r, c1, c2, 1);
  let v = dest;
  if (K > 3) {
    extBoxFilter(dest, grid, n, r, c1, c2, 1);
    v = grid;
  }
  if (K > 4) {
    extBoxFilter(grid, dest, n, r, c1, c2, 1);
    v = dest;
  }

  return v.subarray(o, o + steps);
}

function kdeExtBox2d(data, domains, steps, bandwidths, grid2d) {
  const [xdom, ydom] = domains;
  const [xn, yn] = steps;
  const [bwx, bwy] = bandwidths;

  const [x0, x1] = xdom;
  const [y0, y1] = ydom;
  const sx = xn / (x1 - x0);
  const sy = yn / (y1 - y0);

  // calculuate extended box coefficients
  const K = 3;
  const sdx = bwx * sx;
  const sdy = bwy * sy;
  const sx2 = sdx * sdx;
  const sy2 = sdy * sdy;

  const rx = Math.floor(0.5 * Math.sqrt((12 / K) * sx2 + 1) - 0.5);
  const ox = rx ? rx * K : 0; // offset padding for blur
  const nx = 2 * ox + xn; // num cells

  const ry = Math.floor(0.5 * Math.sqrt((12 / K) * sy2 + 1) - 0.5);
  const oy = ry ? ry * K : 0; // offset padding for blur
  const ny = 2 * oy + yn; // num cells

  const dx = 2 * rx + 1;
  const ax = dx * (rx * (rx + 1) - 3 * sx2 / K) /
            (6 * (sx2 / K - (rx + 1) * (rx + 1)));
  const c1x = ax / (dx + 2 * ax);
  const c2x = (1 - ax) / (dx + 2 * ax);

  const dy = 2 * ry + 1;
  const ay = dy * (ry * (ry + 1) - 3 * sy2 / K) /
            (6 * (sy2 / K - (ry + 1) * (ry + 1)));
  const c1y = ay / (dy + 2 * ay);
  const c2y = (1 - ay) / (dy + 2 * ay);

  const grid = grid2d(data, [nx, ny], [x0, y0], [sx, sy], [ox, oy]);
  const dest = new Float64Array(nx * ny);

  // use extended box filter to approximate gaussian kernel
  // perform K = 3 passes of filtering

  // convolve each row
  for (let row = 0; row < ny; ++row) {
    const g_row = grid.subarray(row * nx);
    const d_row = dest.subarray(row * nx);
    extBoxFilter(g_row, d_row, nx, rx, c1x, c2x, 1);
    extBoxFilter(d_row, g_row, nx, rx, c1x, c2x, 1);
    extBoxFilter(g_row, d_row, nx, rx, c1x, c2x, 1);
  }

  // convolve each column
  for (let col = 0; col < nx; ++col) {
    const g_col = grid.subarray(col);
    const d_col = dest.subarray(col);
    extBoxFilter(d_col, g_col, ny, ry, c1y, c2y, nx);
    extBoxFilter(g_col, d_col, ny, ry, c1y, c2y, nx);
    extBoxFilter(d_col, g_col, ny, ry, c1y, c2y, nx);
  }

  // copy results to trimmed buffer
  const v = new Float64Array(xn * yn);
  for (let row = 0; row < yn; ++row) {
    const d0 = (oy + row) * nx + ox;
    v.set(grid.subarray(d0, d0 + xn), row * xn);
  }
  return v;
}

function extBoxFilter(src, dest, n, r, c1, c2, stride = 1) {
  const s = r + 1;
  const l = n - s;

  // initialize accumulator
  let a = 0;
  let i = 0;
  for (; i < s; ++i) {
    a += src[i * stride];
  }
  a = (c1 + c2) * a + c1 * src[s * stride];

  // handle starting boundary values
  dest[0] = a;
  for (i = 1; i < s; ++i) {
    a += c1 * src[(i + s) * stride] + c2 * src[(i + r) * stride];
    dest[i * stride] = a;
  }

  // transition to interior
  a += c1 * src[stride * (s >> 1)] + c2 * (src[stride * (s + r)] - src[0]);
  dest[s * stride] = a;

  // handle interior values
  for (i = s + 1; i < l; ++i) {
    a += c1 * (src[(i + s) * stride] - src[(i - s - 1) * stride])
      +  c2 * (src[(i + r) * stride] - src[(i - s) * stride]);
    dest[i * stride] = a;
  }

  // transition to end boundary
  a += -c1 * src[(i - s - 1) * stride] + c2 * (src[s * stride] - src[(i - s) * stride]);
  dest[i * stride] = a;
  i += 1;

  // handle end boundary values
  for (; i < n; ++i) {
    a -= c1 * src[(i - s - 1) * stride] + c2 * src[(i - s) * stride];
    dest[i * stride] = a;
  }

  return dest;
}
