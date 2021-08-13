module.exports = {
  grid2d_shifted,
  grid2d_simple
};

function grid2d_simple(data, bins, init, scales, offsets) {
  const [x, y] = data;
  const [nx, ny] = bins;
  const [x0, y0] = init;
  const [sx, sy] = scales;
  const [ox, oy] = offsets;
  const grid = new Float64Array(nx * ny);

  for (let i = 0; i < x.length; ++i) {
    const xi = (ox + (sx * (x[i] - x0))) | 0;
    const yi = (ny - 1) - (oy + (sy * (y[i] - y0))) | 0;
    if (xi >= 0 && xi < nx && yi >= 0 && yi < ny) {
      grid[xi + yi * nx] += 1;
    }
  }

  return grid;
}

function grid2d_shifted(data, bins, init, scales, offsets) {
  const [x, y] = data;
  const [nx, ny] = bins;
  const [x0, y0] = init;
  const [sx, sy] = scales;
  const [ox, oy] = offsets;
  const grid = new Float64Array(nx * ny);

  // shifted linear binning
  for (let i = 0; i < x.length; ++i) {
    const xi = ox + sx * (x[i] - x0);
    const yi = oy + sy * (y[i] - y0);

    const u = xi | 0;
    const v = yi | 0;

    const dx = xi - u;
    const dy = yi - v;

    let u1, u2, v1, v2, x1, x2, y1, y2;

    if (dx < 0.5) {
      u1 = u - 1;
      u2 = u;
      x1 = 0.5 - dx;
      x2 = 0.5 + dx;
    } else {
      u1 = u;
      u2 = u + 1;
      x1 = 1.5 - dx;
      x2 = dx - 0.5;
    }

    if (dy < 0.5) {
      v1 = v - 1;//ny - 1 - (v - 1);
      v2 = v;//ny - 1 - v;
      y1 = 0.5 - dy;
      y2 = 0.5 + dy;
    } else {
      v1 = v;//ny - 1 - v;
      v2 = v + 1;//ny - 1 - (v + 1);
      y1 = 1.5 - dy;
      y2 = dy - 0.5;
    }

    v1 = ny - 1 - v1;
    v2 = ny - 1 - v2;

    if (u1 >= 0 && u1 < nx && v1 >= 0 && v1 < ny) grid[v1 * nx + u1] += x1 * y1;
    if (u2 >= 0 && u2 < nx && v1 >= 0 && v1 < ny) grid[v1 * nx + u2] += x2 * y1;
    if (u1 >= 0 && u1 < nx && v2 >= 0 && v2 < ny) grid[v2 * nx + u1] += x1 * y2;
    if (u2 >= 0 && u2 < nx && v2 >= 0 && v2 < ny) grid[v2 * nx + u2] += x2 * y2;
  }

  return grid;
}
