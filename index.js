module.exports = {
  benchmarks: {
    'error-impulse-1d': require('./src/benchmarks/error-impulse-1d'),
    'error-penguins-1d': require('./src/benchmarks/error-penguins-1d'),
    'time-penguins-1d': require('./src/benchmarks/time-penguins-1d'),
    'error-cars-2d': require('./src/benchmarks/error-cars-2d'),
    'time-cars-2d': require('./src/benchmarks/time-cars-2d')
  }
};