import { rgb } from 'd3-color';

export function heatmap(
  grid,
  w,
  h,
  color = opacityMap(0, 0, 0),
  [lo, hi] = [min(grid, 0), max(grid, 0)],
  canvas = createCanvas(w, h),
  paletteSize = 256
) {
  const norm = 1 / (hi - lo);
  const ctx = canvas.getContext('2d');
  const img = ctx.getImageData(0, 0, w, h);
  const pix = img.data;
  const size = paletteSize - 1;
  const palette = buildPalette(size, color);

  for (let j = 0, k = 0; j < h; ++j) {
    for (let i = 0, row = (h - j - 1) * w; i < w; ++i, k += 4) {
      const v = Math.min(1, Math.max(grid[i + row] - lo, 0) * norm);
      const c = (size * v) << 2;
      pix[k + 0] = palette[c + 0];
      pix[k + 1] = palette[c + 1];
      pix[k + 2] = palette[c + 2];
      pix[k + 3] = palette[c + 3];
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas;
}

function buildPalette(size, interp) {
  const p = new Uint8ClampedArray(4 * (size + 1));
  for (let i = 0; i <= size; ++i) {
    const v = interp(i / size);
    const {r, g, b, opacity = 1} = typeof v === 'string' ? rgb(v) : v;
    const k = i << 2;
    p[k + 0] = r;
    p[k + 1] = g;
    p[k + 2] = b;
    p[k + 3] = (255 * opacity) | 0;
  }
  return p;
}

function createCanvas(w, h) {
  if (typeof document !== 'undefined') {
    // eslint-disable-next-line no-undef
    const c = document.createElement('canvas');
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    return c;
  }
  throw 'Can not create a canvas instance, provide a canvas as a parameter.';
}

function max(array, v) {
  const n = array.length;
  for (let i = 0; i < n; ++i) {
    if (array[i] > v) v = array[i];
  }
  return v;
}

function min(array, v) {
  const n = array.length;
  for (let i = 0; i < n; ++i) {
    if (array[i] < v) v = array[i];
  }
  return v;
}

export function opacityMap(r, g, b) {
  return opacity => ({ r, g, b, opacity });
}
