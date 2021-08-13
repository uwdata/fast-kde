const { cars } = require('./data');
const { grid2d_shifted } = require('../kde/grid2d');
const { kdeBox2d } = require('../kde/kde-box');
const { kdeDeriche2d } = require('../kde/kde-deriche');
const { kdeExtBox2d } = require('../kde/kde-extbox');
const { performance } = require('perf_hooks');

module.exports = async function() {
  const cars_xy = await cars();
  const dom_xy = [[0, 1], [0, 1]];

  const gridFunc = grid2d_shifted;
  const n = 512;
  const bw = [0.1].concat(Array.from({ length: 20 }, (d, i) => 0.01 + 0.01 * i));
  const data = [];
  const iter = 5;

  for (let wi = 0; wi < bw.length; ++wi) {
    const w = bw[wi];

    let td = 0, tb = 0, te = 0;
    for (let i = 0; i < iter; ++i) {
      const t1 = performance.now();
      kdeDeriche2d(cars_xy, dom_xy, [n, n], [w, w], gridFunc);
      const t2 = performance.now();
      kdeBox2d(cars_xy, dom_xy, [n, n], [w, w], gridFunc);
      const t3 = performance.now();
      kdeExtBox2d(cars_xy, dom_xy, [n, n], [w, w], gridFunc);
      const t4 = performance.now();
      td += t2 - t1;
      tb += t3 - t2;
      te += t4 - t3;
    }

    data.push({ method: 'Deriche', bins: n, bandwidth: w, time: td / iter });
    data.push({ method: 'Box',     bins: n, bandwidth: w, time: tb / iter });
    data.push({ method: 'ExtBox',  bins: n, bandwidth: w, time: te / iter });

    const m = (n / 2) | 0;
    td = 0, tb = 0, te = 0;
    for (let i = 0; i < iter * 2; ++i) {
      const t1 = performance.now();
      kdeDeriche2d(cars_xy, dom_xy, [m, m], [w, w], gridFunc);
      const t2 = performance.now();
      kdeBox2d(cars_xy, dom_xy, [m, m], [w, w], gridFunc);
      const t3 = performance.now();
      kdeExtBox2d(cars_xy, dom_xy, [m, m], [w, w], gridFunc);
      const t4 = performance.now();
      td += t2 - t1;
      tb += t3 - t2;
      te += t4 - t3;
    }

    data.push({ method: 'Deriche', bins: m, bandwidth: w, time: 0.5 * td / iter });
    data.push({ method: 'Box',     bins: m, bandwidth: w, time: 0.5 * tb / iter });
    data.push({ method: 'ExtBox',  bins: m, bandwidth: w, time: 0.5 * te / iter });
  }

  return data.slice(6); // drop warm-up trials
};
