import assert from 'assert';
import { density1d } from '../src/index.js';

function gaussian(x, u, sd) {
  const d = (x - u) / sd;
  return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * d * d);
}

it('density1d computes 1d density', () => {
  const u = 5;
  const sd = 0.5;
  const kde = density1d([u], { bandwidth: sd, extent: [0, 10], size: 512 });
  const maxDiff = Array.from(kde).reduce((m, d) => {
    return Math.max(m, Math.abs(d.y - gaussian(d.x, u, sd)));
  }, 0);
  assert.strictEqual(maxDiff < 0.001, true);
});
