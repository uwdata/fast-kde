import { penguins } from './util/data.js';
import { err_interp1d } from './util/err_interp.js';
import {
  grid1d_linear, grid1d_simple,
  kdeBox1d, kdeCDF1d, kdeDeriche1d, kdeExtBox1d
} from '../src/index.js';

export default async function() {
  const masses = await penguins();
  const domain = [2000, 7000];

  const WIDTH = 1024;
  const type = ['Simple', 'Linear'];
  const bins = [256, 512];
  const bw = Array.from({ length: 99 }, (d, i) => 20 + 10 * i);
  const data = [];

  type.forEach(t => {
    const gridFunc = t === 'Simple' ? grid1d_simple : grid1d_linear;
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
}
