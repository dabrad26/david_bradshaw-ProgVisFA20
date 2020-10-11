const wrapper = {
  width: 800,
  height: 500,
  margin: 150,
};

/** @type {Array<{DATE: Date; NAME: string; STATION: string; TMAX: number; TMIN: number}>} Full data to store globally for filtering */
let fullData = [];

/**
 * Render the DOM based on data
 *
 * @param {Array<{DATE: Date; NAME: string; STATION: string; TMAX: number; TMIN: number}>} dataset - the processed data for rendering the DOM elements
 */
const renderDom = dataset => {

  // Empty the view for quick render as we will append/remove items
  const domWrapper = document.querySelector('.graph-area');
  if (domWrapper) {
    while (domWrapper.firstChild) {
      domWrapper.removeChild(domWrapper.firstChild);
    }
  }

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

    svgGroup.selectAll('circle')
    .on('mouseover', (event, d) => {
      d3.select('#tooltip-wrapper')
        .transition()
        .duration(300)
        .style('opacity', 1)
        .style('left', `${event.pageX + 4}px`)
        .style('top', `${event.pageY + 4}px`)
        .text(`${d.DATE.toLocaleDateString()}\nHigh: ${d.TMAX}° F\nLow: ${d.TMIN}° F`);
     })
    .on('mouseout', () =>{
      d3.select('#tooltip-wrapper')
        .transition()
        .style('opacity', 0);
    })
    .on('mousemove', (event, d) =>{
      d3.select('#tooltip-wrapper')
        .style('left', `${event.pageX + 4}px`)
        .style('top', `${event.pageY + 4}px`)
    });
};

$('.year-range').slider({
  range: true,
  min: 2000,
  max: 2020,
  values: [ 2000, 2020 ],
  slide: (_event, ui) => {
    console.log($('.year-range-info .min-value'));
    $('.year-range-info .min-value').text(ui.values[0]);
    $('.year-range-info .max-value').text(ui.values[1]);
    renderDom(fullData.filter(data => {
      const currentYear = data.DATE.getFullYear();
      return !!(currentYear >= ui.values[0] && currentYear <= ui.values[1]);
    }))
  },
});


/**
 * Read CSV file and start D3
 */
d3.csv('data.csv').then(csvData => {
  fullData = csvData.map(data => {
    data.TMAX = Number(data.TMAX);
    data.TMIN = Number(data.TMIN);
    data.DATE = d3.timeParse('%Y-%m-%d')(data.DATE);
    fullData = data;
    return data;
  });
  $('.load-hide').removeClass('load-hide');
  renderDom(fullData);
}).catch(error => {
  console.error('Failed to read CSV file', error);
});
