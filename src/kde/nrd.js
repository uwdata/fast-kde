const { table, op } = require('arquero');

module.exports = { nrd };

// Scott, D. W. (1992) Multivariate Density Estimation:
// Theory, Practice, and Visualization. Wiley.
function nrd(data) {
  const { sd, q1, q3 } = table({ data })
    .rollup({
      sd: op.stdev('data'),
      q1: op.quantile('data', 0.25),
      q2: op.quantile('data', 0.75)
    })
    .object();

  const n = data.length,
        h = (q3 - q1) / 1.34,
        v = Math.min(sd, h) || sd || Math.abs(q1) || 1;

  return 1.06 * v * Math.pow(n, -0.2);
}
