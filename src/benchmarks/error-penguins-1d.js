const { penguins } = require('./data');
const { err_interp1d } = require('../kde/err_interp');
const { grid1d_shifted, grid1d_simple } = require('../kde/grid1d');
const { kdeBox1d } = require('../kde/kde-box');
const { kdeCDF1d } = require('../kde/kde-cdf');
const { kdeDeriche1d } = require('../kde/kde-deriche');
const { kdeExtBox1d } = require('../kde/kde-extbox');

module.exports = async function() {
  const masses = await penguins();
  const domain = [2000, 7000];

  const WIDTH = 1024;
  const type = ['Simple', 'Linear'];
  const bins = [256, 512];
  const bw = Array.from({ length: 99 }, (d, i) => 20 + 10 * i);
  const data = [];

  type.forEach(t => {
    const gridFunc = t === 'Simple' ? grid1d_simple : grid1d_shifted;
    const grid = t + ' Binning';
    bins.forEach(n => {
      bw.forEach(w => {
        const cdf = kdeCDF1d(masses, domain, WIDTH, w);
        const ebx = kdeExtBox1d(masses, domain, n, w, gridFunc);
        const der = kdeDeriche1d(masses, domain, n, w, gridFunc);
        const box = kdeBox1d(masses, domain, n, w, gridFunc);

        const dere = err_interp1d(cdf, der);
        const ebxe = err_interp1d(cdf, ebx);
        const boxe = err_interp1d(cdf, box);

        data.push({
          grid,
          method: 'Box',
          bins: n,
          bandwidth: w,
          rms_error: boxe[0],
          max_error: boxe[1]
        });

        data.push({
          grid,
          method: 'ExtBox',
          bins: n,
          bandwidth: w,
          rms_error: ebxe[0],
          max_error: ebxe[1]
        });

        data.push({
          grid,
          method: 'Deriche',
          bins: n,
          bandwidth: w,
          rms_error: dere[0],
          max_error: dere[1]
        });
      });
    });
  });

  return data;
};
