import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    plugins: [ bundleSize() ],
    output: [
      {
        file: 'dist/fast-kde.mjs',
        format: 'es',
        name: 'kde'
      },
      {
        file: 'dist/fast-kde.min.js',
        format: 'umd',
        sourcemap: true,
        plugins: [ terser({ ecma: 2018 }) ],
        name: 'kde'
      }
    ]
  }
];
