const squareSize = 400;
const radius = squareSize / 2;

/**
 * Render the DOM based on data
 *
 * @param {{Asian: number; White: number; Black: number; LatinX: number; 'American Indian': number; Other: number}} dataset - the processed data for rendering the DOM elements
 */
const renderDom = dataset => {
  const colors = ['#3A9978','#E69040','#3564E6','#BDFEAB','#A03AFC','#FF799E'];
  /** @type {{name: string; value: number}[]} */
  const pieData = Object.keys(dataset).map((key, index) => {
    return {
      name: key,
      color: colors[index],
      value: dataset[key],
    };
  });

  const pie = d3.pie().value(d => d.value);

  const svgElement = d3
    .select('.graph-area')
    .append('svg')
    .attr('width', `${squareSize}px`)
    .attr('height', `${squareSize}px`);

  const keyItems = pieData.map(data => {
    return `<div class="key-item">
      <div class="key-item--color" style="background-color: ${data.color};"></div>
      <div class="key-item--text">${data.name}</div>
    </div>`
  });

  document.querySelector('.key-area').innerHTML = keyItems.join('');

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius((radius));

  svgElement.append('g')
    .attr('transform', `translate(${squareSize / 2}, ${squareSize / 2})`)
    .selectAll('arc')
    .data(pie(pieData))
    .enter()
    .append('g')
    .on('mouseover', (event, d) => {
      d3.select('#tooltip-wrapper')
        .transition()
        .duration(300)
        .style('opacity', 1)
        .style('left', `${event.pageX + 4}px`)
        .style('top', `${event.pageY + 4}px`)
        .text(`${d.data.name} (${d.data.value})`);
    })
    .on('mouseout', () =>{
      d3.select('#tooltip-wrapper')
        .transition()
        .style('opacity', 0);
    })
    .on('mousemove', event => {
      d3.select('#tooltip-wrapper')
        .style('left', `${event.pageX + 4}px`)
        .style('top', `${event.pageY + 4}px`)
    })
    .append('path')
    .attr('fill', d => d.data.color)
    .attr('d', arc);
};

/**
 * Read CSV file and start D3
 */
d3.csv('data.csv').then(csvData => {

  const totalDeaths = {
    Asian: 0,
    White: 0,
    Black: 0,
    LatinX: 0,
    'American Indian': 0,
    Other: 0,
  };

  csvData.forEach(data => {
    totalDeaths.Asian += (Number(data.Deaths_Asian) + Number(data.Deaths_NHPI));
    totalDeaths.White += Number(data.Deaths_White);
    totalDeaths.Black += Number(data.Deaths_Black);
    totalDeaths.LatinX += Number(data.Deaths_LatinX);
    totalDeaths['American Indian'] += Number(data.Deaths_AIAN);
    totalDeaths.Other += (Number(data.Deaths_Other) + Number(data.Deaths_Multiracial) + Number(data.Deaths_Unknown));
  })

  renderDom(totalDeaths);
}).catch(error => {
  console.error('Failed to read CSV file', error);
});
