import { accessor } from './accessor.js';
import { bin2d } from './bin2d.js';
import { dericheConfig, dericheConv2d } from './deriche.js';
import { extent as densityExtent } from './extent.js';
import { heatmap } from './heatmap.js';
import { nrd } from './nrd.js';

export function density2d(data, options = {}) {
  const { adjust = 1, pad = 3, bins = [256, 256] } = options;
  const x = accessor(options.x, d => d[0]);
  const y = accessor(options.y, d => d[1]);
  const w = accessor(options.weight, () => 1 / data.length);

  let [
    bwX = adjust * nrd(data, x),
    bwY = adjust * nrd(data, y)
  ] = number2(options.bandwidth);

  const [
    [x0, x1] = densityExtent(data, x, pad * bwX),
    [y0, y1] = densityExtent(data, y, pad * bwY)
  ] = number2_2(options.extent);

  const [binsX, binsY] = number2(bins);

  const grid = bin2d(data, x, y, w, x0, x1, binsX, y0, y1, binsY);
  const deltaX = (x1 - x0) / (binsX - 1);
  const deltaY = (y1 - y0) / (binsY - 1);
  const neg = grid.some(v => v < 0);

  let configX = dericheConfig(bwX / deltaX, neg);
  let configY = dericheConfig(bwY / deltaY, neg);
  let result;

  function* points(x = 'x', y = 'y', z = 'z') {
    const result = estimator.grid();
    const scale = 1 / (deltaX * deltaY);
    for (let k = 0, j = 0; j < binsY; ++j) {
      for (let i = 0; i < binsX; ++i, ++k) {
        yield {
          [x]: x0 + i * deltaX,
          [y]: y0 + j * deltaY,
          [z]: result[k] * scale
        };
      }
    }
  }

  const estimator = {
    [Symbol.iterator]: points,
    points,
    grid: () => result || (result = dericheConv2d(configX, configY, grid, [binsX, binsY])),
    extent: () => [ [x0, x1], [y0, y1] ],
    heatmap: ({ color, clamp, canvas, maxColors } = {}) =>
      heatmap(estimator.grid(), binsX, binsY, color, clamp, canvas, maxColors),
    bandwidth(_) {
      if (arguments.length) {
        const [_0, _1] = number2(_);
        if (_0 !== bwX) {
          result = null;
          configX = dericheConfig((bwX = _0) / deltaX, neg);
        }
        if (_1 !== bwY) {
          result = null;
          configY = dericheConfig((bwY = _1) / deltaY, neg);
        }
        return estimator;
      } else {
        return [bwX, bwY];
      }
    }
  };

  return estimator;
}

function number2(_) {
  return _ == null ? [undefined, undefined]
    : typeof _ === 'number' ? [_, _]
    : _;
}

function number2_2(_) {
  return _ == null ? [undefined, undefined]
    : typeof _[0] === 'number' ? [_, _]
    : _;
}
