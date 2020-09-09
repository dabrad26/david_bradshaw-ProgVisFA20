const wrapper = {
  width: 800,
  height: 500,
  margin: 150,
};

const textStyle = {
  color: '#000000',
  size: '18px',
};

const barStyle = {
  color: '#B0E2F2',
  textColor: '#000000',
  textSize: '14px',
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Convert data into data by Month (this only does 1 year for this dataset)
 * @param {Array<{Date: string, Amount: string}>} dataset - data from CSV file
 *
 * @returns {Array<{month: string, total: number}>} - returns array of objects
 */
const dataByMonth = (dataset) => {
  const monthMap = new Map();
  dataset.forEach(data => {
    const amountToUse = Number(data.Amount);
    if (amountToUse < 0 || Number.isNaN(amountToUse)) return;
    const date = new Date(data.Date);
    const currentMonth = months[date.getMonth()];
    const currentMonthValue = monthMap.get(currentMonth) || 0;
    const newValue = Number((currentMonthValue + amountToUse).toFixed(2));
    monthMap.set(currentMonth, newValue);
  });

  return months.map(month => {
    return {
      month: month,
      total: monthMap.get(month),
    };
  });
};

/**
 * Setup D3 and draw bar chart after getting data from CSV
 *
 * @param {Array<{month: string, total: number}} dataset - data needed for D3 to setup bar chart
 */
const setupDom = dataset => {
  const finalData = dataByMonth(dataset);

  const yScale = d3.scaleLinear()
    .range([wrapper.height - wrapper.margin, 0])
    .domain([0, d3.max(finalData, d => d.total)]);

  const xScale = d3.scaleBand()
    .range([0, wrapper.width - wrapper.margin])
    .domain(finalData.map(d => d.month))
    .padding(0.2);

  const svgElement = d3
    .select('.graph-area')
    .append('svg')
    .attr('width', `${wrapper.width}px`)
    .attr('height', `${wrapper.height}px`);

  const svgGroup = svgElement.append('g')
    .attr('transform', `translate(${wrapper.margin / 2}, ${wrapper.margin / 2})`);

  svgGroup.append('g')
    .attr('transform', `translate(0, ${wrapper.height - wrapper.margin})`)
    .call(d3.axisBottom(xScale))
    .append('text')
    .attr('y', 50)
    .attr('x', (wrapper.width - wrapper.margin) / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', textStyle.size)
    .attr('fill', textStyle.color)
    .text('Month');

  svgGroup.append('g')
    .call(d3.axisLeft(yScale).tickFormat(d => `$${d}`).ticks(6))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -60)
    .attr('x', -(wrapper.height / 3))
    .attr('text-anchor', 'middle')
    .attr('font-size', textStyle.size)
    .attr('fill', textStyle.color)
    .text('Total spent');


  const bars = svgGroup.selectAll('rect')
    .data(finalData)
    .enter()
    .append('g')
    .attr('class', 'bar-wrapper');

  bars
    .append('rect')
    .attr('fill', barStyle.color)
    .attr('x', d => xScale(d.month))
    .attr('y', d => yScale(d.total))
    .attr('width', xScale.bandwidth())
    .attr('height', d => (wrapper.height - wrapper.margin) - yScale(d.total));

  bars
    .append('text')
    .attr('class', 'helper-text')
    .attr('y', d => yScale(d.total) + 40)
    .attr('x', d => xScale(d.month) + (xScale.bandwidth() / 2))
    .attr('text-anchor', 'middle')
    .attr('font-size', barStyle.textSize)
    .attr('fill', barStyle.textColor)
    .text(d => `$${d.total}`);
};

/**
 * Read CSV file and start D3
 */
d3.csv('data.csv').then(csvData => {
  setupDom(csvData);
}).catch(error => {
  console.error('Failed to read CSV file', error);
});
