/* eslint-disable no-console */
import { benchmarks } from './index.js';
import { performance } from 'perf_hooks';
import { writeFileSync } from 'fs';

async function run() {
  for (const name in benchmarks) {
    console.log(`Running benchmark ${name}`);
    const t0 = performance.now();
    const data = await benchmarks[name]();
    const t1 = performance.now();
    writeFileSync(`results/${name}.json`, JSON.stringify(data, 0, 2));
    console.log(` - Done. Elapsed time: ${Math.round(t1-t0)} ms`);
  }
}

run();
