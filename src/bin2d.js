export function bin2d(data, x, y, w, x0, x1, xn, y0, y1, yn) {
  const grid = new Float64Array(xn * yn);
  const xdelta = (xn - 1) / (x1 - x0);
  const ydelta = (yn - 1) / (y1 - y0);

  for (let i = 0; i < data.length; ++i) {
    const d = data[i];
    const xi = x(d, i, data);
    const yi = y(d, i, data);
    const wi = w(d, i, data);

    // skip NaN and Infinite values
    if (!(Number.isFinite(xi) && Number.isFinite(yi) && Number.isFinite(wi))) {
      continue;
    }

    const xp = (xi - x0) * xdelta;
    const xu = Math.floor(xp);
    const xv = xu + 1;
    const yp = (yi - y0) * ydelta;
    const yu = Math.floor(yp);
    const yv = yu + 1;

    if (0 <= xu && xv < xn) {
      if (0 <= yu && yv < yn) {
        grid[xu + yu * xn] += (xv - xp) * (yv - yp) * wi;
        grid[xu + yv * xn] += (xv - xp) * (yp - yu) * wi;
        grid[xv + yu * xn] += (xp - xu) * (yv - yp) * wi;
        grid[xv + yv * xn] += (xp - xu) * (yp - yu) * wi;
      } else if (yu === -1) {
        grid[xu + yv * xn] += (xv - xp) * (yp - yu) * wi;
        grid[xv + yv * xn] += (xp - xu) * (yp - yu) * wi;
      } else if (yv === yn) {
        grid[xv + yu * xn] += (xp - xu) * (yv - yp) * wi;
        grid[xu + yu * xn] += (xv - xp) * (yv - yp) * wi;
      }
    } else if (xu === -1) {
      if (0 <= yu && yv < yn) {
        grid[xv + yu * xn] += (xp - xu) * (yv - yp) * wi;
        grid[xv + yv * xn] += (xp - xu) * (yp - yu) * wi;
      } else if (yu === -1) {
        grid[xv + yv * xn] += (xp - xu) * (yp - yu) * wi;
      } else if (yv === yn) {
        grid[xv + yu * xn] += (xp - xu) * (yv - yp) * wi;
      }
    } else if (xv === xn) {
      if (0 <= yu && yv < yn) {
        grid[xu + yu * xn] += (xv - xp) * (yv - yp) * wi;
        grid[xu + yv * xn] += (xv - xp) * (yp - yu) * wi;
      } else if (yu === -1) {
        grid[xu + yv * xn] += (xv - xp) * (yp - yu) * wi;
      } else if (yv === yn) {
        grid[xu + yu * xn] += (xv - xp) * (yv - yp) * wi;
      }
    }
  }

  return grid;
}
