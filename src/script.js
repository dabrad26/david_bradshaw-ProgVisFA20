const greekCross = {
  primaryColor: '#ed1b2e',
  borderWidth: 1,
  width: 100,
  height: 100,
  bottomPadding: 30,
};

/** Based on window size. In prod this should calc and re-render on resize event */
const maxPerRow = Math.floor(window.innerWidth / (greekCross.width + 20));

/**
 * Take data from CSV and parse it to return in expected format for D3
 *
 * @param {Array<Partial<{STATUS: string; STATE}>>} dataset - data from CSV
 *
 * @returns {Array<{state: string; total: number}>} - array of states with number of hospitals that are open.  Sorted by total (largest -> smallest)
 */
const parseData = dataset => {
  const stateMap = new Map();
  dataset.filter(data => data.STATUS === 'OPEN').forEach(data => {
    const currentData = stateMap.get(data.STATE) || [];
    currentData.push(data);
    stateMap.set(data.STATE, currentData);
  });

  return [...stateMap.entries()].map(data => {
    return {
      state: data[0],
      total: data[1] ? data[1].length || 0 : 0,
    };
  }).sort((first, second) => {
    return first.total - second.total;
  }).reverse();
}

/**
 * Render the DOM based on final data
 *
 * @param {Array<{state: string; total: number}>} dataset - the processed data for rendering the DOM elements
 */
const setupDom = dataset => {
  const crossColorRange = d3.scaleLinear().domain([dataset[dataset.length - 1].total, dataset[0].total]).range(['#FFFAFB', greekCross.primaryColor]);
  const svg = d3.select('.graph-area')
    .append('svg')
    .attr('width', `${maxPerRow * greekCross.width}px`)
    .attr('height', `${Math.ceil(dataset.length / maxPerRow) * (greekCross.height + greekCross.bottomPadding)}px`);

  /**
   * Wrapping margin 5, 90 usable area; divide each part of cross by 3 (30 basis of cross end width)
   * Starting at top left piece and going around for line calc
   */
  const pathString = d3.line()([
    [35,5],
    [65,5],
    [65,35],
    [95,35],
    [95,65],
    [65,65],
    [65,95],
    [35,95],
    [35,65],
    [5,65],
    [5,35],
    [35,35],
    [35,5],
  ]);

  const group = svg.selectAll('g')
    .data(dataset, d => d)
    .enter()
    .append('g')
    .attr('transform', (_d, i) => {
      const x = (i % (maxPerRow)) * greekCross.width;
      const y = (Math.floor(i / maxPerRow)) * (greekCross.height + greekCross.bottomPadding);
      return `translate(${x},${y})`;
    });

  group.append('path')
    .attr('d', pathString)
    .attr('fill', d => crossColorRange(d.total))
    .attr('stroke', greekCross.primaryColor)
    .attr('stroke-width', `${greekCross.borderWidth}px`);

  group.append('text')
    .attr('x', greekCross.width / 2)
    .attr("y", (greekCross.height / 2) - 5)
    .attr('text-anchor', 'middle')
    .attr('dy', '10px')
    .attr('fill', d => d.total > 500 ? '#FFFFFF' : '#000000')
    .text(d => `${d.state} (${d.total})`);
}


/**
 * Read CSV file and start D3
 */
d3.csv('data.csv').then(csvData => {
  setupDom(parseData(csvData));
}).catch(error => {
  console.error('Failed to read CSV file', error);
});
