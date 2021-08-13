module.exports = { rnorm };

let next = NaN;

function rnorm(mean = 0, stdev = 1) {
  let x = 0;
  let y = 0;
  let rds = 0;

  if (!Number.isNaN(next)) {
    x = next;
    next = NaN;
  } else {
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      rds = x * x + y * y;
    } while (rds == 0 || rds > 1);

    // Box-Muller transform
    const c = Math.sqrt(-2 * Math.log(rds) / rds);
    x *= c;
    next = y * c;
  }

  return mean + x * stdev;
}
