export function kdeCDF1d(data, domain, steps, bandwidth) {
  const n = data.length;
  const lo = domain[0];
  const scale = (domain[1] - lo) / steps;
  const v = new Float64Array(steps);

  let x0 = domain[0];
  for (let k = 0; k < steps; ++k) {
    const x1 = domain[0] + (k + 1) * scale;

    let y = 0;
    for (let i = 0; i < n; ++i) {
      const p0 = pnorm(x0, data[i], bandwidth);
      const p1 = pnorm(x1, data[i], bandwidth);
      y += (p1 - p0);
    }

    v[k] = y;
    x0 = x1;
  }

  return v;
}

export function kdeCDF2d(data, domains, steps, bandwidths) {
  const n = data[0].length;

  const [xdata, ydata] = data;
  const [xdom, ydom] = domains;
  const [xn, yn] = steps;
  const [bwx, bwy] = bandwidths;

  const [x0, x1] = xdom;
  const [y0, y1] = ydom;
  const sx = (x1 - x0) / xn;
  const sy = (y1 - y0) / yn;

  const v = new Float64Array(xn * yn);

  let vy0 = ydom[0];
  for (let i = 0; i < yn; ++i) {
    const vy1 = y0 + (i + 1) * sy;

    let vx0 = xdom[0];
    for (let j = 0; j < xn; ++j) {
      const vx1 = x0 + (j + 1) * sx;

      let z = 0;
      for (let d = 0; d < n; ++d) {
        const py0 = pnorm(vy0, ydata[d], bwy);
        const py1 = pnorm(vy1, ydata[d], bwy);
        const px0 = pnorm(vx0, xdata[d], bwx);
        const px1 = pnorm(vx1, xdata[d], bwx);
        z += (py1 - py0) * (px1 - px0);
      }

      v[(yn - 1 - i) * xn + j] = z;
      vx0 = vx1;
    }
    vy0 = vy1;
  }

  return v;
}

// Approximation from West (2009)
// Better Approximations to Cumulative Normal Functions
function pnorm(value, mean = 0, stdev = 1) {
  const z = (value - mean) / stdev,
        Z = Math.abs(z);
  let cd = 0;

  if (Z <= 37) {
    const exp = Math.exp(-Z * Z / 2);
    let sum;
    if (Z < 7.07106781186547) {
      sum = 3.52624965998911e-02 * Z + 0.700383064443688;
      sum = sum * Z + 6.37396220353165;
      sum = sum * Z + 33.912866078383;
      sum = sum * Z + 112.079291497871;
      sum = sum * Z + 221.213596169931;
      sum = sum * Z + 220.206867912376;
      cd = exp * sum;
      sum = 8.83883476483184e-02 * Z + 1.75566716318264;
      sum = sum * Z + 16.064177579207;
      sum = sum * Z + 86.7807322029461;
      sum = sum * Z + 296.564248779674;
      sum = sum * Z + 637.333633378831;
      sum = sum * Z + 793.826512519948;
      sum = sum * Z + 440.413735824752;
      cd = cd / sum;
    } else {
      sum = Z + 0.65;
      sum = Z + 4 / sum;
      sum = Z + 3 / sum;
      sum = Z + 2 / sum;
      sum = Z + 1 / sum;
      cd = exp / sum / 2.506628274631;
    }
  }

  return z > 0 ? 1 - cd : cd;
}
