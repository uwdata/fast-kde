#!/usr/bin/env node

const { benchmarks } = require('..');
const { performance } = require('perf_hooks');
const { writeFileSync } = require('fs');

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
