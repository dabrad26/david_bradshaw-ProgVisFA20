const wrapper = {
  width: 800,
  height: 500,
  margin: 150,
};

/**
 * Render the DOM based on data
 *
 * @param {Array<{DATE: Date; NAME: string; STATION: string; TMAX: number; TMIN: number}>} dataset - the processed data for rendering the DOM elements
 */
const setupDom = dataset => {

  /** Colors based on this image http://lucykatecrochet.com/wp-content/uploads/2017/02/temp-head.jpg */
  const tempColorRange = d3.scaleLinear().domain([-10, 110]).range(['#5c1fb5', '#ea3423']);

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, d => d.DATE))
    .range([0, wrapper.width - wrapper.margin]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => d.TMIN), d3.max(dataset, d => d.TMAX)])
    .range([wrapper.height - wrapper.margin, 0]);

  const svgElement = d3
    .select('.graph-area')
    .append('svg')
    .attr('width', `${wrapper.width}px`)
    .attr('height', `${wrapper.height}px`);

  const svgGroup = svgElement.append('g')
    .attr('transform', `translate(${wrapper.margin / 2}, ${wrapper.margin / 2})`);

  svgGroup.append('g').call(d3.axisLeft(yScale).tickFormat(d => `${d}° F`));
  svgGroup.append('g').attr('transform', `translate(0, ${wrapper.height - wrapper.margin})`).call(d3.axisBottom(xScale));

  svgGroup.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('r', 2)
    .attr('cx', d => xScale(d.DATE))
    .attr('cy', d => yScale(d.TMAX))
    .attr('fill', d => tempColorRange(d.TMAX));

  svgGroup.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('r', 2)
    .attr('cx', d => xScale(d.DATE))
    .attr('cy', d => yScale(d.TMIN))
    .attr('fill', d => tempColorRange(d.TMIN));
};


/**
 * Read CSV file and start D3
 */
d3.csv('data.csv').then(csvData => {
  setupDom(csvData.map(data => {
    data.TMAX = Number(data.TMAX);
    data.TMIN = Number(data.TMIN);
    data.DATE = d3.timeParse('%Y-%m-%d')(data.DATE);
    return data;
  }));
}).catch(error => {
  console.error('Failed to read CSV file', error);
});
