import { grid1d_linear } from './grid1d.js';
import { kdeDeriche1d } from './kde-deriche.js';
import { nrd } from './nrd.js';

export function density1d() {
  let x;
  let method = kdeDeriche1d;
  let grid = grid1d_linear;
  let size = 512;
  let bandwidth;
  let extent = [0, 1];

  function density(data) {
    const points = x ? data.map(x) : data;
    const bw = bandwidth || nrd(points);
    return method(points, extent, size, bw, grid);
  }

  density.points = function(data) {
    const [lo, hi] = extent;
    const step = (hi - lo) / size;
    return Array.from(
      density(data),
      (value, i) => ({ x: lo + i * step, value })
    );
  };

  density.x = function(_) {
    return arguments.length ? (x = _, this) : x;
  };

  density.grid = function(_) {
    return arguments.length ? (grid = _, this) : grid;
  };

  density.size = function(_) {
    return arguments.length ? (size = _, this) : size;
  };

  density.bandwidth = function(_) {
    return arguments.length ? (bandwidth = _, this) : bandwidth;
  };

  density.extent = function(_) {
    return arguments.length ? (extent = _, this) : extent;
  };

  density.method = function(_) {
    return arguments.length ? (method = _, this) : method;
  };

  return density;
}
