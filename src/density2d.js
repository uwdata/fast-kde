import { grid2d_linear } from './grid2d.js';
import { kdeDeriche2d } from './kde-deriche.js';
import { nrd } from './nrd.js';

export function density2d() {
  let x = d => d[0];
  let y = d => d[1];
  let method = kdeDeriche2d;
  let grid = grid2d_linear;
  let size = [256, 256];
  let bandwidth = [0, 0];
  let extent = [[0, 1], [0, 1]];

  function density(data) {
    const points = [
      data.map(v => x(v)),
      data.map(v => y(v))
    ];
    const bw = [
      bandwidth[0] || nrd(points[0]),
      bandwidth[1] || nrd(points[1])
    ];
    return method(points, extent, size, bw, grid);
  }

  density.points = function(data) {
    const [x0, x1] = extent[0];
    const [y0, y1] = extent[1];
    const xstep = (x1 - x0) / size[0];
    const ystep = (y1 - y0) / size[1];
    return Array.from(
      density(data),
      (value, i) => ({
        x: x0 + i * xstep,
        y: y0 + i * ystep,
        value
      })
    );
  };

  density.x = function(_) {
    return arguments.length ? (x = _, this) : x;
  };

  density.y = function(_) {
    return arguments.length ? (y = _, this) : y;
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
