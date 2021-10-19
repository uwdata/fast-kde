// Scott, D. W. (1992) Multivariate Density Estimation:
// Theory, Practice, and Visualization. Wiley.
export function nrd(data, x) {
  const values = data.map(x).filter(v => v != null && v >= v);
  values.sort((a, b) => a - b);
  const sd = stdev(values);
  const q1 = quantile(values, 0.25);
  const q3 = quantile(values, 0.75);

  const n = values.length,
        h = (q3 - q1) / 1.34,
        v = Math.min(sd, h) || sd || Math.abs(q1) || 1;

  return 1.06 * v * Math.pow(n, -0.2);
}

function stdev(values) {
  const n = values.length;
  let count = 0;
  let delta;
  let mean = 0;
  let sum = 0;
  for (let i = 0; i < n; ++i) {
    const value = values[i];
    delta = value - mean;
    mean += delta / ++count;
    sum += delta * (value - mean);
  }
  return count > 1 ? Math.sqrt(sum / (count - 1)) : NaN;
}

function quantile(values, p) {
  const n = values.length;

  if (!n) return NaN;
  if ((p = +p) <= 0 || n < 2) return values[0];
  if (p >= 1) return values[n - 1];

  const i = (n - 1) * p;
  const i0 = Math.floor(i);
  const v0 = values[i0];
  return v0 + (values[i0 + 1] - v0) * (i - i0);
}
