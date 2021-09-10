# Fast & Accurate Gaussian Kernel Density Estimation

Methods and benchmarks for fast, approximate Gaussian kernel density estimation.

This repo contains code (`src/`) and benchmark (`benchmarks/`) scripts for the VIS 2021 Short Paper "Fast & Accurate Gaussian Kernel Density Estimation". All code is written as ESM modules. Running benchmarks requires node.js version 13.2 or higher.

## Build Instructions

To build a bundle (ESM module or minified UMD):

1. Run `yarn` to install dependencies.
2. Run `yarn build` to build the bundles.

Compiled bundles will be written to the `dist` directory.

## Benchmark Instructions

1. Run `yarn` to install dependencies.
2. Run `yarn benchmarks` to run benchmarks.
3. Wait until the benchmarks complete...

Benchmark result datasets will be written to the `results` directory as JSON files.

## API Documentation

### Density Estimate Helpers

Convenience methods for performing 1D or 2D density estimation.

<hr/><a id="density1d" href="#density1d">#</a>
<i>kde</i>.<b>density1d</b>()

Creates a new 1D density estimate helper with default settings.

*Example*

```js
// perform 1D estimation with bandwidth = 1 over domain [0, 10]
// use default grid size (512) and method (kdeDeriche1d)
// returns an array of [ { x, value }, ... ] points
kde.density1d()
  .bandwidth(1)
  .extent([0, 10])
  .points([1, 2, 5, 5, 6, 9])
```

<a name="_density1d" href="#_density1d">#</a>
<i>density1d</i>(<i>data</i>)

Computes a 1D Gaussian kernel density estimate using the current settings for the given *data* and returns a Float64Array of gridded density values. To instead produce an array of objects containing coordinate values and density estimates, use [density1d.points()](#density1d_points).

<a name="density1d_points" href="#density1d_points">#</a>
<i>density1d</i>.<b>points</b>(<i>data</i>)

Computes a 1D Gaussian kernel density estimate using the current settings for the given *data* and returns an array of objects containing the grid coordinate value (`x`) and density value (`value`).

<a name="density1d_x" href="#density1d_x">#</a>
<i>density1d</i>.<b>x</b>([<i>x</i>])

Get or set the *x* coordinate getter for the input data. Defaults to the identity function, which assumes a flat array of values.

<a name="density1d_grid" href="#density1d_grid">#</a>
<i>density1d</i>.<b>grid</b>([<i>grid</i>])

Get or set the *grid* function for binning the input data into a one-dimensional grid, such as [grid1d_linear](#grid1d_linear) (the default) or [grid1d_simple](#grid1d_simple).

<a name="density1d_size" href="#density1d_size">#</a>
<i>density1d</i>.<b>size</b>([<i>size</i>])

Get or set the *size* (default 512) of the binned data grid.

<a name="density1d_bandwidth" href="#density1d_bandwidth">#</a>
<i>density1d</i>.<b>bandwidth</b>([<i>bandwidth</i>])

Get or set the *bandwidth* (standard deviation) of the Gaussian kernel. If set to `null` or zero (the default), the [normal reference density](#nrd) heuristic will be used to select a bandwidth automatically.

<a name="density1d_extent" href="#density1d_extent">#</a>
<i>density1d</i>.<b>extent</b>([<i>extent</i>])

Get or set the *extent* ([x0, x1]) of the data domain over which to perform density estimation. Any data points outside this extent will be ignored. The value defaults to [0, 1]. Note that the estimation helper does _not_ automatically select a domain based on the input data.

<a name="density1d_method" href="#density1d_method">#</a>
<i>density1d</i>.<b>method</b>([<i>method</i>])

Get or set the density estimation *method* to use. One of [kdeDeriche1d](#kdeDeriche1d) (the default), [kdeBox1d](#kdeBox1d), [kdeExtBox1d](#kdeExtBox1d), or [kdeCDF1d](#kdeCDF1d).


<hr/><a id="density2d" href="#density2d">#</a>
<i>kde</i>.<b>density2d</b>()

Creates a new 2D density estimate helper with default settings.

*Example*

```js
// perform 2D estimation with bandwidth = 1 over domain [[0, 10], [0, 10]]
// use default grid size ([256, 256]) and method (kdeDeriche2d)
// returns an array of [ { x, y, value }, ... ] points
kde.density2d()
  .bandwidth([1, 1])
  .extent([[0, 10], [0, 10]])
  .points([[1, 1], [1, 2], [5, 4], [5, 3], [6, 2], [8, 7]])
```

<a name="_density2d" href="#_density2d">#</a>
<i>density2d</i>(<i>data</i>)

Computes a 2D Gaussian kernel density estimate for the given *data* using the current settings and returns a Float64Array of gridded density values. To instead produce an array of objects containing coordinate values and density estimates, use [density2d.points()](#density2d_points).

<a name="density2d_points" href="#density2d_points">#</a>
<i>density2d</i>.<b>points</b>(<i>data</i>)

Computes a 2D Gaussian kernel density estimate for the given *data* using the current settings and returns an array of objects containing the grid coordinate (`x`, `y`) and density (`value`) values.

<a name="density2d_x" href="#density2d_x">#</a>
<i>density2d</i>.<b>x</b>([<i>x</i>])

Get or set the *x* coordinate getter for the input data. Defaults to index 0 (i.e., the first element if individual data points are provided as arrays).

<a name="density2d_y" href="#density2d_y">#</a>
<i>density2d</i>.<b>y</b>([<i>y</i>])

Get or set the *y* coordinate getter for the input data. Defaults to index 1 (i.e., the second element if individual data points are provided as arrays).

<a name="density2d_grid" href="#density2d_grid">#</a>
<i>density2d</i>.<b>grid</b>([<i>grid</i>])

Get or set the *grid* function for binning the input data into a two dimensional grid, such as [grid2d_linear](#grid2d_linear) (the default) or [grid2d_simple](#grid2d_simple).

<a name="density2d_size" href="#density2d_size">#</a>
<i>density2d</i>.<b>size</b>([<i>size</i>])

Get or set the *size* (default [256, 256]) of the binned data grid.

<a name="density2d_bandwidth" href="#density2d_bandwidth">#</a>
<i>density2d</i>.<b>bandwidth</b>([<i>bandwidth</i>])

Get or set the *bandwidth*s (standard deviations) of the Gaussian kernels as a two element array. If an entry is set to `null` or zero (the defaults), the [normal reference density](#nrd) heuristic will be used to select a bandwidth automatically for that dimension.

<a name="density2d_extent" href="#density2d_extent">#</a>
<i>density2d</i>.<b>extent</b>([<i>extent</i>])

Get or set the *extent*s ([[x0, x1], [y0, y1]]) of the data domain over which to perform density estimation. Any data points outside this extent will be ignored. The value defaults to [[0, 1], [0, 1]]. Note that the estimation helper does _not_ automatically select domains based on the input data.

<a name="density2d_method" href="#density2d_method">#</a>
<i>density2d</i>.<b>method</b>([<i>method</i>])

Get or set the density estimation *method* to use. One of [kdeDeriche2d](#kdeDeriche2d) (the default), [kdeBox2d](#kdeBox2d), [kdeExtBox2d](#kdeExtBox2d), or [kdeCDF2d](#kdeCDF2d).


### 1D Density Estimation Methods

<hr/><a id="kdeCDF1d" href="#kdeCDF1d">#</a>
<i>kde</i>.<b>kdeCDF1d</b>(<i>data</i>, <i>extent</i>, <i>size</i>, <i>bandwidth</i>)

Computes a 1D Gaussian kernel density estimate for an array of numeric *data* values via direct calculation of the Gaussian cumulative distribution function. This method can be very slow in practice and is provided only for comparison and testing purposes; see [kdeDeriche1d](#kdeDeriche1d) instead. The *extent* parameter is an [x0, x1] array indicating the data domain over which to compute the estimates. Any data points lying outside this domain will be ignored. The *size* parameter indicates the number of bins (grid steps) to use. The *bandwidth* parameter indicates the width (standard deviation) of the kernel function. Returns a Float64Array of gridded density estimates.

<hr/><a id="kdeBox1d" href="#kdeBox1d">#</a>
<i>kde</i>.<b>kdeBox1d</b>(<i>data</i>, <i>extent</i>, <i>size</i>, <i>bandwidth</i>, <i>grid1d</i>)

Computes a 1D Gaussian kernel density estimate for an array of numeric *data* values using the standard box filtering method. This method is not recommended for normal use, see [kdeDeriche1d](#kdeDeriche1d) instead. The *extent* parameter is an [x0, x1] array indicating the data domain over which to compute the estimates. Any data points lying outside this domain will be ignored. The *size* parameter indicates the number of bins (grid steps) to use. The *bandwidth* parameter indicates the width (standard deviation) of the kernel function. The *grid1d* parameter indicates the binning method to use, such as [grid1d_linear](#grid1d_linear) or [grid1d_simple](#grid1d_simple). Returns a Float64Array of gridded density estimates.

<hr/><a id="kdeExtBox1d" href="#kdeExtBox1d">#</a>
<i>kde</i>.<b>kdeExtBox1d</b>(<i>data</i>, <i>extent</i>, <i>size</i>, <i>bandwidth</i>, <i>grid1d</i>)

Computes a 1D Gaussian kernel density estimate for an array of numeric *data* values using the extended box filtering method, which smooths away the quantization error of standard box filtering. This method is not recommended for normal use, see [kdeDeriche1d](#kdeDeriche1d) instead. The *extent* parameter is an [x0, x1] array indicating the data domain over which to compute the estimates. Any data points lying outside this domain will be ignored. The *size* parameter indicates the number of bins (grid steps) to use. The *bandwidth* parameter indicates the width (standard deviation) of the kernel function. The *grid1d* parameter indicates the binning method to use, such as [grid1d_linear](#grid1d_linear) or [grid1d_simple](#grid1d_simple). Returns a Float64Array of gridded density estimates.

<hr/><a id="kdeDeriche1D" href="#kdeDeriche1D">#</a>
<i>kde</i>.<b>kdeDeriche1D</b>(<i>data</i>, <i>extent</i>, <i>size</i>, <i>bandwidth</i>, <i>grid1d</i>)

Computes a 1D Gaussian kernel density estimate for an array of numeric *data* values using Deriche's recursive filter approximation. This method is recommended for normal use. The *extent* parameter is an [x0, x1] array indicating the data domain over which to compute the estimates. Any data points lying outside this domain will be ignored. The *size* parameter indicates the number of bins (grid steps) to use. The *bandwidth* parameter indicates the width (standard deviation) of the kernel function. The *grid1d* parameter indicates the binning method to use, such as [grid1d_linear](#grid1d_linear) or [grid1d_simple](#grid1d_simple). Returns a Float64Array of gridded density estimates.

### 2D Density Estimation Methods

<hr/><a id="kdeCDF2d" href="#kdeCDF2d">#</a>
<i>kde</i>.<b>kdeCDF2d</b>(<i>data</i>, <i>extent</i>, <i>size</i>, <i>bandwidth</i>)

Computes a 2D Gaussian kernel density estimate for two arrays of numeric *data* values via direct calculation of the Gaussian cumulative distribution function. This method can be very slow in practice and is provided only for comparison and testing purposes; see [kdeDeriche2d](#kdeDeriche2d) instead. The input *data* should be an array with two entries: a numeric x-value array and a numeric y-value array. The *extent* parameter should be an [[x0, x1], [y0, y1]] array of data domain extents. The *size* parameter should be a [sizeX, sizeY] array indicating the grid dimensions. The *bandwidth* parameter should be a [bandwidthX, bandwidthY] array. Returns a Float64Array of gridded density estimates.

<hr/><a id="kdeBox2d" href="#kdeBox2d">#</a>
<i>kde</i>.<b>kdeBox2d</b>(<i>data</i>, <i>extent</i>, <i>size</i>, <i>bandwidth</i>, <i>grid2d</i>)

Computes a 2D Gaussian kernel density estimate for two arrays of numeric *data* values using the standard box filtering method. This method is not recommended for normal use, see [kdeDeriche2d](#kdeDeriche2d) instead. The input *data* should be an array with two entries: a numeric x-value array and a numeric y-value array. The *extent* parameter should be an [[x0, x1], [y0, y1]] array of data domain extents. The *size* parameter should be a [sizeX, sizeY] array indicating the grid dimensions. The *bandwidth* parameter should be a [bandwidthX, bandwidthY] array. The *grid2d* parameter indicates the binning method to use, such as [grid2d_linear](#grid2d_linear) or [grid2d_simple](#grid2d_simple). Returns a Float64Array of gridded density estimates.

<hr/><a id="kdeExtBox2d" href="#kdeExtBox2d">#</a>
<i>kde</i>.<b>kdeExtBox2d</b>(<i>data</i>, <i>extent</i>, <i>size</i>, <i>bandwidth</i>, <i>grid2d</i>)

Computes a 2D Gaussian kernel density estimate for two arrays of numeric *data* values using the extended box filtering method, which smooths away the quantization error of standard box filtering. This method is not recommended for normal use, see [kdeDeriche2d](#kdeDeriche2d) instead. The input *data* should be an array with two entries: a numeric x-value array and a numeric y-value array. The *extent* parameter should be an [[x0, x1], [y0, y1]] array of data domain extents. The *size* parameter should be a [sizeX, sizeY] array indicating the grid dimensions. The *bandwidth* parameter should be a [bandwidthX, bandwidthY] array. The *grid2d* parameter indicates the binning method to use, such as [grid2d_linear](#grid2d_linear) or [grid2d_simple](#grid2d_simple). Returns a Float64Array of gridded density estimates.

<hr/><a id="kdeDeriche1D" href="#kdeDeriche1D">#</a>
<i>kde</i>.<b>kdeDeriche1D</b>(<i>data</i>, <i>extent</i>, <i>size</i>, <i>bandwidth</i>, <i>grid2d</i>)

Computes a 2D Gaussian kernel density estimate for two arrays of numeric *data* values using Deriche's recursive filter approximation. This method is recommended for normal use. The input *data* should be an array with two entries: a numeric x-value array and a numeric y-value array. The *extent* parameter should be an [[x0, x1], [y0, y1]] array of data domain extents. The *size* parameter should be a [sizeX, sizeY] array indicating the grid dimensions. The *bandwidth* parameters should be a [bandwidthX, bandwidthY] array. The *grid2d* parameter indicates the binning method to use, such as [grid2d_linear](#grid2d_linear) or [grid2d_simple](#grid2d_simple). Returns a Float64Array of gridded density estimates.

### Utility Methods

Utility methods for grid construction and bandwidth suggestion.

<hr/><a id="grid1d_linear" href="#grid1d_linear">#</a>
<i>kde</i>.<b>grid1d_linear</b>(<i>data</i>, <i>size</i>, <i>init</i>, <i>scale</i>[, <i>offset</i>])

Bins a set of numeric *data* values into a 1D output grid of size *size*, using linear interpolation of point mass across adjacent bins. The *init* value indicates the minimum grid value for the data domain. The *scale* parameter is a numeric value for scaling data values to a [0, 1] domain. The optional *offset* parameter (default 0) indicates the number of bins by which to offset the start of the data domain, in the case of padded grids with extra spacing. Returns a Float64Array of gridded values.

<hr/><a id="grid1d_simple" href="#grid1d_simple">#</a>
<i>kde</i>.<b>grid1d_linear</b>(<i>data</i>, <i>size</i>, <i>init</i>, <i>scale</i>[, <i>offset</i>])

Bins a set of numeric *data* values into a 1D output grid of size *size*, where the full weight of a point is assigned to the nearest enclosing bin. The *init* value indicates the minimum grid value for the data domain. The *scale* parameter is a numeric value for scaling data values to a [0, 1] domain. The optional *offset* parameter (default 0) indicates the number of bins by which to offset the start of the data domain, in the case of padded grids with extra spacing. Returns a Float64Array of gridded values.

<hr/><a id="grid2d_linear" href="#grid2d_linear">#</a>
<i>kde</i>.<b>grid2d_linear</b>(<i>data</i>, <i>size</i>, <i>init</i>, <i>scale</i>, <i>offset</i>)

Bins a set of numeric *data* values into a 2D output grid of size *size*, using linear interpolation of point mass across adjacent bins. The input *data* should be an array with two entries: a numeric x-value array and a numeric y-value array. The *size* parameter sets the grid dimensions and should be an [sizeX, sizeY] array containing two integers. The *init* parameter ([initX, initY]) indicates the minimum grid values for the data domains. The *scale* parameter ([scaleX, scaleY]) provides numeric values for scaling data values to a [0, 1] domain. The *offset* parameter ([offsetX, offsetY]) indicates the number of bins by which to offset the start of the data domains, in the case of padded grids with extra spacing. Returns a Float64Array of gridded values.

<hr/><a id="grid2d_simple" href="#grid2d_simple">#</a>
<i>kde</i>.<b>grid2d_simple</b>(<i>data</i>, <i>size</i>, <i>init</i>, <i>scale</i>, <i>offset</i>)

Bins a set of numeric *data* values into a 2D output grid  of size *size*, where the full weight of a point is assigned to the nearest enclosing bin. The input *data* should be an array with two entries: a numeric x-value array and a numeric y-value array. The *size* parameter sets the grid dimensions and should be an [sizeX, sizeY] array containing two integers. The *init* parameter ([initX, initY]) indicates the minimum grid values for the data domains. The *scale* parameter ([scaleX, scaleY]) provides numeric values for scaling data values to a [0, 1] domain. The *offset* parameter ([offsetX, offsetY]) indicates the number of bins by which to offset the start of the data domains, in the case of padded grids with extra spacing. Returns a Float64Array of gridded values.

<hr/><a id="nrd" href="#nrd">#</a>
<i>kde</i>.<b>nrd</b>(<i>data</i>)

Calculates a suggested bandwidth for an array of numeric *data* values, using Scott's normal reference distribution (NRD) heuristic.
