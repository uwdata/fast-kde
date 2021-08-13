module.exports = { pnorm };

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
