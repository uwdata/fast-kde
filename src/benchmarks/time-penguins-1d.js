const { penguins } = require('./data');
const { grid1d_shifted } = require('../kde/grid1d');
const { kdeCDF1d } = require('../kde/kde-cdf');
const { kdeBox1d } = require('../kde/kde-box');
const { kdeDeriche1d } = require('../kde/kde-deriche');
const { kdeExtBox1d } = require('../kde/kde-extbox');
const { nrd } = require('../kde/nrd');
const { rnorm } = require('../kde/rnorm');
const { performance } = require('perf_hooks');

module.exports = async function() {
  const masses = await penguins();
  const pdomain = [2000, 7000];
  const mn = masses.length;
  const mw = nrd(masses);
  const sample = () => Math.round(rnorm(masses[(mn * Math.random()) | 0], mw));

  const m = 512;
  const gridFunc = grid1d_shifted;
  const sizes = [
    1e2, 1e3, 1e4,
    1e2, 2e2, 3e2, 4e2, 5e2, 6e2, 7e2, 8e2, 9e2,
    1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3, 9e3,
    1e4, 2e4, 3e4, 4e4, 5e4, 6e4, 7e4, 8e4, 9e4,
    1e5, 2e5, 3e5, 4e5, 5e5, 6e5, 7e5, 8e5, 9e5,
    1e6, 2e6, 3e6, 4e6, 5e6, 6e6, 7e6, 8e6, 9e6, 1e7
  ];
  const bw = [100, 150, 200, 250, 300];

  const data = [];

  for (let si = 0; si < sizes.length; ++si) {
    // generate data set of desired size
    const n = sizes[si];
    const values = new Int32Array(n);
    for (let i = 0; i < n; ++i) values[i] = sample();

    // get calculation time for sample bandwidths
    let td = 0, tb = 0, te = 0, tg = 0;
    for (let bi = 0; bi < bw.length; ++bi) {
      const w = bw[bi];

      // this is where direct calculation exceeds the plot
      if (n < 3e4) {
        const tt = performance.now();
        kdeCDF1d(values, pdomain, m, w);
        tg += performance.now() - tt;
      }

      const t0 = performance.now();
      kdeDeriche1d(values, pdomain, m, w, gridFunc);
      const t1 = performance.now();
      kdeExtBox1d(values, pdomain, m, w, gridFunc);
      const t2 = performance.now();
      kdeBox1d(values, pdomain, m, w, gridFunc);
      const t3 = performance.now();
      td += t1 - t0;
      te += t2 - t1;
      tb += t3 - t2;
    }

    if (n < 3e4) {
      data.push({ method: 'Direct',  size: n, time: tg / bw.length });
    }
    data.push({ method: 'Box',     size: n, time: tb / bw.length });
    data.push({ method: 'ExtBox',  size: n, time: te / bw.length });
    data.push({ method: 'Deriche', size: n, time: td / bw.length });
  }

  return data.slice(12); // drop warm-up trials
};
