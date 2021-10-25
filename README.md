# Fast Gaussian Kernel Density Estimation

Fast Gaussian kernel density estimation in 1D or 2D.

This package provides accurate, linear-time O(N + K) estimation using Deriche's approximation and is based on the IEEE VIS 2021 Short Paper [Fast & Accurate Gaussian Kernel Density Estimation](https://idl.cs.washington.edu/papers/fast-kde). _(For the benchmarks in that paper, see [github.com/uwdata/fast-kde-benchmarks](https://github.com/uwdata/fast-kde-benchmarks).)_

## Citation

If you use or build on this package in academic work, please use this citation:

```
@inproceedings{2021-Heer-FastKDE,
 title = {Fast \& Accurate Gaussian Kernel Density Estimation},
 author = {Jeffrey Heer},
 booktitle = {IEEE VIS Short Papers},
 year = {2021},
 url = {http://idl.cs.washington.edu/papers/fast-kde},
}
```

## Usage Examples

For interactive examples, see our [Fast KDE Observable notebook](https://observablehq.com/@uwdata/fast-kde).

### 1D Density Estimation

```js
import { density1d } from 'fast-kde';

const data = [
  {u: 1, v: 1}, {u: 1, v: 2}, {u: 5, v: 4},
  {u: 5, v: 3}, {u: 6, v: 2}, {u: 8, v: 7}
];

// 1d density estimation, with automatic bandwidth and extent
// resulting estimator d1 is an object and also an iterable
let d1 = density1d([1, 1, 5, 5, 6, 8]);

// 1d density estimation, with accessor function
d1 = density1d(data, { x: d => d.u });

// 1d density estimation, with property key accessor
d1 = density1d(data, { x: 'u' });

// 1d density estimation, with given bandwidth and extent
d1 = density1d(data, { x: 'u', bandwidth: 1, extent: [0, 10] });

// efficiently update bandwidth on estimator (extent remains unchanged)
d1.bandwidth(0.5)

// generate array of {x, y} sample points
let p1 = Array.from(d1);

// generate array of {a, b} sample points (instead of {x, y})
p1 = [...d1.points('a', 'b')]

// retrieve internal sample grid array of density estimates
// these values represent the total probability mass in each bin
// they are not (yet) scaled to probability density function estimates
let g1 = d1.grid();
```

### 2D Density Estimation

```js
import { density2d } from 'fast-kde';
import { interpolatePiYG } from 'd3-scale-chromatic';

const data = [
  {u: 1, v: 1}, {u: 1, v: 2}, {u: 5, v: 4},
  {u: 5, v: 3}, {u: 6, v: 2}, {u: 8, v: 7}
];

// 2d density estimation, with automatic bandwidth and extent
let d2 = density2d(data, { x: 'u', y: 'v' });

// 2d density estimation, with bandwidth and extent shared across (x, y)
d2 = density2d(data, { x: 'u', y: 'v', bandwidth: 1, extent: [0, 10] });

// 2d density estimation, with bandwidth and extent that differ across (x, y)
d2 = density2d(data, { x: 'u', y: 'v', bandwidth: [1, 0.5], extent: [[0, 10], [1, 9]] });

// 2d density estimation, with customized x- and y-bin counts
d2 = density2d(data, { x: 'u', y: 'v', bins: [256, 256] });

// generate array of {x, y, z} sample points
let p2 = [...d2];

// generate array of {a, b, v} sample points (instead of {x, y, z})
p2 = [...d2.points('a', 'b', 'v')]

// HTML canvas element with a bins[0] x bins[1] heatmap image
let h2 = d2.heatmap();

// HTML canvas heatmap with custom interpolator from d3-scale-chromatic
h2 = d2.heatmap({ color: interpolatePiYG })

// retrieve internal sample grid array of density estimates
// these values represent the total probability mass in each bin
// they are not (yet) scaled to probability density function estimates
let g2 = d2.grid();
```

## Build Instructions

All code is written as ESM modules, and uses the `"type": "module"` Node.js setting. To build a bundle (ESM module or minified UMD):

1. Run `yarn` to install dependencies.
2. Run `yarn build` to build the bundles.

Compiled bundles will be written to the `dist` directory.

## API Documentation

### 1D Density Estimation

<a id="density1d" href="#density1d">#</a>
<i>kde</i>.<b>density1d</b>(<i>data</i>[, <i>options</i>])

Creates a new 1D density estimator for the input *data*. Returns an estimator object that includes the methods listed below, and also provides an iterator over resulting density points.

* *data*: An array of input data values for which to perform density estimation. The array values may be numbers or objects.
* *options*: Options for configuring density estimation.
  * *x*: An accessor function for input values. By default this is the identity function, corresponding to *data* as an array of numbers. If the *x* option is not function-valued, it will be treated as a key to look up on entries of the input *data*.
  * *weight*: An accessor function for weights. By default all input points are given the same weight. The weight values should sum to one for the output to be a proper probability density estimate. If the *weight* option is not function-valued, it will be treated as a key to look up on entries of the input *data*.
  * *bandwidth*: The kernel bandwidth (standard deviation) to use. If unspecified, the bandwidth is automatically calculated using the [nrd](#nrd) heuristic and the *adjust* option.
  * *adjust*: A fractional value by which to scale (adjust) an automatically calculated bandwidth. For example, an *adjust* value of 0.5 will result in half the automatically-determined bandwidth. This option is ignored if the *bandwidth* option is specified.
  * *extent*: The extent over which to compute kernel density estimation as a two-element array. Note that input data values outside the extent are ignored, potentially resulting in inaccurate densities relative to the full data. If unspecified, the *extent* is automatically calculated based on the input data extent and the *pad* option.
  * *pad*: The amount (in kernel bandwidths) by which to extend an automatically-calculated extent. The default value is `3`, capturing 99% of the density from the most extreme points. Set this value to `0` to trim the density estimate to the minimum and maximum observed data points. This option is ignored if the *extent* option is provided.
  * *bins*: The number of bins to use for the internal grid. The default is 512 bins. The returned density estimate will include a total of *bins* equally-spaced sample points over the *extent*.

*Example*

```js
// perform 1D estimation with bandwidth = 1 over domain [0, 10]
// returns an iterator over [ { x, y }, ... ] points
kde.density1d([1, 2, 5, 5, 6, 9], { bandwidth: 1, extent: [0, 10] })
```

<a id="density1d_grid" href="#density1d_grid">#</a>
<i>density1d</i>.<b>grid</b>()

Returns the internal grid array of total accumulated density values per bin. To instead produce an array of objects containing coordinate values and probability density function estimates, use [density1d.points()](#density1d_points).

<a id="density1d_points" href="#density1d_points">#</a>
<i>density1d</i>.<b>points</b>([<i>x</i>, <i>y</i>])

Returns an iterator over objects containing a sample point (*x*) and density value (*y*).

* *x*: The property name for the sample point (default `"x"`).
* *y*: The property name for the estimated density value (default `"y"`).

<a id="density1d_bandwidth" href="#density1d_bandwidth">#</a>
<i>density1d</i>.<b>bandwidth</b>([<i>bandwidth</i>])

Get or set the *bandwidth* (standard deviation) of the Gaussian kernel. Setting the *bandwidth* will update the estimator efficiently without re-performing binning. The extent will remain unchanged, even if previously determined automatically.

<a id="density1d_extent" href="#density1d_extent">#</a>
<i>density1d</i>.<b>extent</b>()

Get the calculated extent of density estimation as a [min, max] extent array. This method does not support setting the extent to a new value, as this requires re-binning the input data.

<hr/>

### 2D Density Estimation

<a id="density2d" href="#density2d">#</a>
<i>kde</i>.<b>density2d</b>(<i>data</i>[, <i>options</i>])

Creates a new 2D density estimator for the input *data*. Returns an estimator object that includes the methods listed below, and also provides an iterator over resulting density points.

* *data*: An array of input data values for which to perform density estimation.
* *options*: Options for configuring density estimation.
  * *x*: An accessor function for x-dimension input values. The default accessor retrieves index `0`. If the *x* option is not function-valued, it will be treated as a key to look up on entries of the input *data*.
  * *y*: An accessor function for y-dimension input values. The default accessor retrieves index `1`. If the *y* option is not function-valued, it will be treated as a key to look up on entries of the input *data*.
  * *weight*: An accessor function for weights. By default all input points are given the same weight. The weight values should sum to one for the output to be a proper probability density estimate. If the *weight* option is not function-valued, it will be treated as a key to look up on entries of the input *data*.
  * *bandwidth*: The kernel bandwidths (standard deviations) to use. If array-valued, specifies the x- and y-bandwidths separately. If number-valued, sets both the x- and y-bandwidths to the same value. If unspecified, the bandwidths are automatically calculated per-dimension using the [nrd](#nrd) heuristic and the *adjust* option.
  * *adjust*: A fractional value by which to scale (adjust) an automatically calculated bandwidth. For example, an *adjust* value of 0.5 will result in half the automatically-determined bandwidth. This option is ignored if the *bandwidth* option is specified.
  * *extent*: The extent over which to compute kernel density estimation along both the x- and y-dimensions. If an array of arrays is provided, specifies the x- and y-extents separately. If a single two-number array is provided, sets both x- and y-extents to the same value. Note that input data values outside the extent are ignored, potentially resulting in inaccurate densities relative to the full data. If unspecified, the *extent* is automatically calculated based on the input data extent and the *pad* option.
  * *pad*: The amount (in kernel bandwidths) by which to extend an automatically-calculated extent. The default value is `3`, capturing 99% of the density from the most extreme points. Set this value to `0` to trim the density estimate to the minimum and maximum observed data points. This option is ignored if the *extent* option is provided.
  * *bins*: The number of bins to use for the internal grid. The default is `[256, 256]` bins. If array-valued, specifies the x- and y-bins separately. If number-valued, sets both x- and y-bins to the same value. The returned density estimate will include a total of `bins[0] * bins[1]` equally-spaced sample points over the *extent*.

*Example*

```js
// perform 2D estimation with bandwidths [1, 1] over extent [[0, 10], [0, 10]]
// use default grid size ([256, 256])
// returns an iterator over [ { x, y, z }, ... ] points
const data = [[1, 1], [1, 2], [5, 4], [5, 3], [6, 2], [8, 7]];
kde.density2d(data, { bandwidth: 1, extent: [0, 10] })
```

```js
// perform 2D estimation with different bandwidths and extent for x and y
// returns an iterator over [ { x, y, z }, ... ] points
const data = [[1, 1], [1, 2], [5, 4], [5, 3], [6, 2], [8, 7]];
kde.density2d(data, { bandwidth: [1, 0.5], extent: [[1, 9], [1, 8]] })
```

<a id="density2d_grid" href="#density2d_grid">#</a>
<i>density2d</i>.<b>grid</b>()

Returns the internal grid array of total accumulated density values per bin. To instead produce an array of objects containing coordinate values and probability density function estimates, use [density2d.points()](#density2d_points).

<a id="density2d_points" href="#density2d_points">#</a>
<i>density2d</i>.<b>points</b>([<i>x</i>, <i>y</i>, <i>z</i>])

Returns an iterator over objects containing sample points (*x*, *y*) and density value (*z*).

* *x*: The property name for the x-dimension sample point (default `"x"`).
* *y*: The property name for the y-dimension sample point (default `"y"`).
* *z*: The property name for the estimated density value (default `"z"`).

<a id="density2d_bandwidth" href="#density2d_bandwidth">#</a>
<i>density2d</i>.<b>bandwidth</b>([<i>bandwidth</i>])

Get or set the *bandwidth*s (standard deviations) of the Gaussian kernel. If array-valued, specifies the x- and y-bandwidths separately. If number-valued, sets both x- and y-bandwidths to the same value. Setting the *bandwidth* will update the estimator efficiently without re-performing binning. The extent will remain unchanged, even if previously determined automatically.

<a id="density2d_extent" href="#density2d_extent">#</a>
<i>density2d</i>.<b>extent</b>()

Get the calculated extent of density estimation. Returns an array containing the x- and y-dimension extents: [[xmin, xmax], [ymin, ymax]]. This method does not support setting the extent to a new value, as this requires re-binning the input data.

<a id="density2d_heatmap" href="#density2d_heatmap">#</a>
<i>density2d</i>.<b>heatmap</b>([<i>options</i>])

Generate a heatmap image of the 2D density. Returns an HTML [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) element.

* *options*: Options for heatmap image generation.
  * *color*: A color function that maps density values (normalized to the domain [0, 1]) to either valid CSS color strings or to RGB color objects with `r`, `g`, `b` properties (in the range 0-255) and an optional `opacity` property (a fractional value between 0 and 1). If CSS color strings are used, the [d3-color](https://github.com/d3/d3-color) library must also be loaded.
  * *clamp*: Sets the range of density values to a given [min, max] array. Values below the minimum or above the maximum will be clamped to the provided values. Values within the clamped range are then normalized to the domain [0, 1].
  * *canvas*: A [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) element to draw into. If unspecified, a new canvas instance is created with dimensions matching the density estimator *bins* option.
  * *maxColors*: The maximum number of colors (default 256) to use for heatmap generation. This number determines the size of the backing pre-computed palette, and thus the number of times the *color* function is invoked.

<hr/>

### Utility Methods

<a id="nrd" href="#nrd">#</a>
<i>kde</i>.<b>nrd</b>(<i>data</i>, <i>accessor</i>)

Calculates a suggested bandwidth for a set of numeric *data* values, using Scott's normal reference distribution (NRD) heuristic.

<a id="opacityMap" href="#opacityMap">#</a>
<i>kde</i>.<b>opacityMap</b>(<i>r</i>, <i>g</i>, <i>b</i>)

Returns a color map function (compatible with the [heatmap](#density2d_heatmap) *color* option) that ramps the opacity for a fixed set of *r*, *g*, *b* values in the range 0-255.
