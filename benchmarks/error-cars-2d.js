import { cars } from './util/data.js';
import { err_interp2d } from './util/err_interp.js';
import {
  grid2d_linear, grid2d_simple,
  kdeBox2d, kdeCDF2d, kdeDeriche2d, kdeExtBox2d
} from '../src/index.js';

export default async function() {
  const cars_xy = await cars();
  const dom_xy = [[0, 1], [0, 1]];
  const WIDTH = 512;

  const type = ['Simple', 'Linear'];
  const bins = [256, 512];
  const bw = Array.from({ length: 20 }, (d, i) => 0.01 + 0.01 * i);
  const data = [];

  for (let wi = 0; wi < bw.length; ++wi) {
    const w = bw[wi];
    const cdf = kdeCDF2d(cars_xy, dom_xy, [WIDTH, WIDTH], [w, w]);

    for (let bi = 0; bi < bins.length; ++bi) {
      const n = bins[bi];

      for (let ti = 0; ti < type.length; ++ti) {
        const t = type[ti];
        const gridFunc = t === 'Simple' ? grid2d_simple : grid2d_linear;
        const grid = t + ' Binning';

        const der = kdeDeriche2d(cars_xy, dom_xy, [n, n], [w, w], gridFunc);
        const box = kdeBox2d(cars_xy, dom_xy, [n, n], [w, w], gridFunc);
        const ebx = kdeExtBox2d(cars_xy, dom_xy, [n, n], [w, w], gridFunc);

        const dere = err_interp2d(cdf, der);
        const ebxe = err_interp2d(cdf, ebx);
        const boxe = err_interp2d(cdf, box);

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
      }
    }
  }

  return data;
}
