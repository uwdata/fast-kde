import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';

const external = [ 'd3-color' ];
const globals = { 'd3-color': 'd3' };

export default [
  {
    input: 'src/index.js',
    plugins: [ bundleSize() ],
    external,
    output: [
      {
        file: 'dist/fast-kde.mjs',
        format: 'es',
        globals
      },
      {
        file: 'dist/fast-kde.min.js',
        format: 'umd',
        globals,
        sourcemap: true,
        plugins: [ terser({ ecma: 2018 }) ],
        name: 'kde'
      }
    ]
  }
];
