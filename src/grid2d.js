export function grid2d_simple(data, bins, init, scales, offsets) {
  const [x, y] = data;
  const [nx, ny] = bins;
  const [x0, y0] = init;
  const [sx, sy] = scales;
  const [ox, oy] = offsets;
  const grid = new Float64Array(nx * ny);

  for (let i = 0; i < x.length; ++i) {
    const xi = (ox + (sx * (x[i] - x0))) | 0;
    const yi = (ny - 1) - (oy + (sy * (y[i] - y0))) | 0;
    if (0 <= xi && xi < nx && 0 <= yi && yi < ny) {
      grid[xi + yi * nx] += 1;
    }
  }

  return grid;
}

export function grid2d_linear(data, bins, init, scales, offsets) {
  const [x, y] = data;
  const [nx, ny] = bins;
  const [x0, y0] = init;
  const [sx, sy] = scales;
  const [ox, oy] = offsets;
  const grid = new Float64Array(nx * ny);

  for (let i = 0; i < x.length; ++i) {
    const xi = ox + sx * (x[i] - x0) - 0.5;
    const yi = oy + sy * (y[i] - y0) - 0.5;
    const xu = xi | 0;
    const yu = yi | 0;
    const xv = xu + 1;
    const yv = yu + 1;
    const zu = ny - 1 - yu;
    const zv = ny - 1 - yv;

    if (0 <= xu && xu < nx) {
      if (0 <= yu && yu < ny) grid[xu + zu * nx] += (xv - xi) * (yv - yi);
      if (0 <= yv && yv < ny) grid[xu + zv * nx] += (xv - xi) * (yi - yu);
    }
    if (0 <= xv && xv < nx) {
      if (0 <= yu && yu < ny) grid[xv + zu * nx] += (xi - xu) * (yv - yi);
      if (0 <= yv && yv < ny) grid[xv + zv * nx] += (xi - xu) * (yi - yu);
    }
  }

  return grid;
}
