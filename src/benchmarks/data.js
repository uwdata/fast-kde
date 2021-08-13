const { loadJSON, op: { max } } = require('arquero');

module.exports = { cars, penguins };

async function cars() {
  const df = (await loadJSON('data/cars.json'))
    .select({ 'Miles_per_Gallon': 'x', 'Horsepower': 'y' })
    .filter(d => d.x > 0 && d.y > 0)
    .derive({
      x: d => d.x / (1.1 * max(d.x)),
      y: d => d.y / (1.1 * max(d.y))
    });

  return [
    df.array('x', Float64Array),
    df.array('y', Float64Array)
  ];
}

async function penguins() {
  const field = 'Body Mass (g)';
  const species = 'Gentoo';
  return (await loadJSON('data/penguins.json'))
    .params({ field, species })
    .filter((d, $) => d.Species === $.species && d[$.field] > 0)
    .array(field, Int32Array);
}
