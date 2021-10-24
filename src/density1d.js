import { accessor } from './accessor.js';
import { bin1d } from './bin1d.js';
import { dericheConfig, dericheConv1d } from './deriche.js';
import { extent as densityExtent } from './extent.js';
import { nrd } from './nrd.js';

export function density1d(data, options = {}) {
  const { adjust = 1, pad = 3, bins = 512 } = options;
  const x = accessor(options.x, x => x);
  const w = accessor(options.weight, () => 1 / data.length);

  let bandwidth = options.bandwidth ?? adjust * nrd(data, x);

  const [lo, hi] = options.extent ?? densityExtent(data, x, pad * bandwidth);
  const grid = bin1d(data, x, w, lo, hi, bins);
  const delta = (hi - lo) / (bins - 1);
  const neg = grid.some(v => v < 0);

  let config = dericheConfig(bandwidth / delta, neg);
  let result;

  function* points(x = 'x', y = 'y') {
    const result = estimator.grid();
    const scale = 1 / delta;
    for (let i = 0; i < bins; ++i) {
      yield {
        [x]: lo + i * delta,
        [y]: result[i] * scale
      };
    }
  }

  const estimator = {
    [Symbol.iterator]: points,
    points,
    grid: () => result || (result = dericheConv1d(config, grid, bins)),
    extent: () => [lo, hi],
    bandwidth(_) {
      if (arguments.length) {
        if (_ !== bandwidth) {
          bandwidth = _;
          result = null;
          config = dericheConfig(bandwidth / delta, neg);
        }
        return estimator;
      } else {
        return bandwidth;
      }
    }
  };

  return estimator;
}
