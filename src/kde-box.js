export function kdeBox1d(data, domain, steps, bandwidth, grid1d) {
  const K = 3;
  const lo = domain[0];
  const sf = steps / (domain[1] - lo);
  const sd = bandwidth * sf;
  const l = Math.sqrt((12 / K) * sd * sd + 1);
  const r = Math.floor(0.5 * l);
  const d = 2 * r + 1;
  const o = r ? r * K : 0; // offset padding for blur
  const n = 2 * o + steps; // num cells

  // grid
  const grid = grid1d(data, n, lo, sf, o);
  const dest = new Float64Array(n);

  // use box filter to efficiently approximate gaussian kernel
  boxFilterX(grid, dest, n, r);
  boxFilterX(dest, grid, n, r);
  boxFilterX(grid, dest, n, r);

  // scale output values
  const s = 1 / Math.pow(d, K);
  const v = dest;
  for (let i = 0; i < n; ++i) {
    v[i] *= s;
  }

  return v.subarray(o, o + steps);
}

export function kdeBox2d(data, domains, steps, bandwidths, grid2d) {
  const [xdom, ydom] = domains;
  const [xn, yn] = steps;
  const [bwx, bwy] = bandwidths;

  const [x0, x1] = xdom;
  const [y0, y1] = ydom;
  const sx = xn / (x1 - x0);
  const sy = yn / (y1 - y0);

  // calculuate box radii
  const K = 3;
  const sdx = bwx * sx;
  const sdy = bwy * sy;

  const rx = Math.floor(0.5 * Math.sqrt((12 / K) * sdx * sdx + 1));
  const ox = rx ? rx * K : 0; // offset padding for blur
  const nx = 2 * ox + xn; // num cells

  const ry = Math.floor(0.5 * Math.sqrt((12 / K) * sdy * sdy + 1));
  const oy = ry ? ry * K : 0; // offset padding for blur
  const ny = 2 * oy + yn; // num cells

  const grid = grid2d(data, [nx, ny], [x0, y0], [sx, sy], [ox, oy]);
  const dest = new Float64Array(nx * ny);

  const zx = 1 / Math.pow(2 * rx + 1, K);
  const zy = 1 / Math.pow(2 * ry + 1, K);

  // use box filter to approximate gaussian kernel
  // perform K = 3 passes of filtering
  // convolve each row
  for (let row = 0; row < ny; ++row) {
    const g_row = grid.subarray(row * nx);
    const d_row = dest.subarray(row * nx);
    boxFilterX(g_row, d_row, nx, rx);
    boxFilterX(d_row, g_row, nx, rx);
    boxFilterX(g_row, d_row, nx, rx);
  }
  for (let i = 0; i < nx * ny; ++i) {
    dest[i] *= zx;
  }

  // convolve each column
  for (let col = 0; col < nx; ++col) {
    const g_col = grid.subarray(col);
    const d_col = dest.subarray(col);
    boxFilterY(d_col, g_col, ny, ry, nx);
    boxFilterY(g_col, d_col, ny, ry, nx);
    boxFilterY(d_col, g_col, ny, ry, nx);
  }
  for (let i = 0; i < nx * ny; ++i) {
    grid[i] *= zy;
  }

  // copy results to trimmed buffer
  const v = new Float64Array(xn * yn);
  for (let row = 0; row < yn; ++row) {
    const d0 = (oy + row) * nx + ox;
    v.set(grid.subarray(d0, d0 + xn), row * xn);
  }

  return v;
}

function boxFilterX(grid, dest, n, r) {
  // helpful boundaries
  const l = n - r;
  const s = r + 1;

  let a = 0; // accumulator

  // initialize accumulator and window
  for (let i = 0; i < r; ++i) {
    a += grid[i];
  }

  // handle start boundary values
  for (let i = 0; i < s; ++i) {
    a += grid[i + r];
		dest[i] = a;
  }

  // set interior values
  for (let i = s; i < l; ++i) {
    a += grid[i + r] - grid[i - s];
		dest[i] = a;
  }

  // handle end boundary values
  for (let i = l; i < n; ++i) {
    a -= grid[i - s];
		dest[i] = a;
  }
}

function boxFilterY(grid, dest, n, r, stride) {
  // helpful boundaries
  const l = n - r;
  const s = r + 1;
  const rs = r * stride;
  const ss = s * stride;

  let a = 0; // accumulator

  // initialize accumulator and window
  for (let i = 0, k = 0; i < r; ++i, k += stride) {
    a += grid[k];
  }

  // handle start boundary values
  for (let i = 0, k = 0; i < s; ++i, k += stride) {
    a += grid[k + rs];
		dest[k] = a;
  }

  // set interior values
  for (let i = s, k = ss; i < l; ++i, k += stride) {
    a += grid[k + rs] - grid[k - ss];
		dest[k] = a;
  }

  // handle end boundary values
  for (let i = l, k = l * stride; i < n; ++i, k += stride) {
    a -= grid[k - ss];
		dest[k] = a;
  }
}
