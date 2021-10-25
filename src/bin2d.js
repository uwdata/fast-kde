export function bin2d(data, x, y, w, x0, x1, xn, y0, y1, yn) {
  const grid = new Float64Array(xn * yn);
  const xdelta = (xn - 1) / (x1 - x0);
  const ydelta = (yn - 1) / (y1 - y0);

  for (let i = 0; i < data.length; ++i) {
    const d = data[i];
    const xi = (x(d, i, data) - x0) * xdelta;
    const yi = (y(d, i, data) - y0) * ydelta;
    const wi = w(d, i, data);

    // skip NaN and Infinite values
    if (!(Number.isFinite(xi) && Number.isFinite(yi) && Number.isFinite(wi))) {
      continue;
    }

    const xu = Math.floor(xi);
    const xv = xu + 1;
    const yu = Math.floor(yi);
    const yv = yu + 1;

    if (0 <= xu && xv < xn) {
      if (0 <= yu && yv < yn) {
        grid[xu + yu * xn] += (xv - xi) * (yv - yi) * wi;
        grid[xu + yv * xn] += (xv - xi) * (yi - yu) * wi;
        grid[xv + yu * xn] += (xi - xu) * (yv - yi) * wi;
        grid[xv + yv * xn] += (xi - xu) * (yi - yu) * wi;
      } else if (yu === -1) {
        grid[xu + yv * xn] += (xv - xi) * (yi - yu) * wi;
        grid[xv + yv * xn] += (xi - xu) * (yi - yu) * wi;
      } else if (yv === yn) {
        grid[xv + yu * xn] += (xi - xu) * (yv - yi) * wi;
        grid[xu + yu * xn] += (xv - xi) * (yv - yi) * wi;
      }
    } else if (xu === -1) {
      if (0 <= yu && yv < yn) {
        grid[xv + yu * xn] += (xi - xu) * (yv - yi) * wi;
        grid[xv + yv * xn] += (xi - xu) * (yi - yu) * wi;
      } else if (yu === -1) {
        grid[xv + yv * xn] += (xi - xu) * (yi - yu) * wi;
      } else if (yv === yn) {
        grid[xv + yu * xn] += (xi - xu) * (yv - yi) * wi;
      }
    } else if (xv === xn) {
      if (0 <= yu && yv < yn) {
        grid[xu + yu * xn] += (xv - xi) * (yv - yi) * wi;
        grid[xu + yv * xn] += (xv - xi) * (yi - yu) * wi;
      } else if (yu === -1) {
        grid[xu + yv * xn] += (xv - xi) * (yi - yu) * wi;
      } else if (yv === yn) {
        grid[xu + yu * xn] += (xv - xi) * (yv - yi) * wi;
      }
    }
  }

  return grid;
}
