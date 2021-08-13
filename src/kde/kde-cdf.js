const { pnorm } = require('./pnorm');

module.exports = {
  kdeCDF1d,
  kdeCDF2d
};

function kdeCDF1d(data, domain, steps, bandwidth) {
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

function kdeCDF2d(data, domains, steps, bandwidths) {
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
