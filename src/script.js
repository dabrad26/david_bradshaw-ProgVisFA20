const wrapper = {
  width: '600px',
  height: '400px',
};

const circleStyle = {
  color: '#ff8280',
  radius: 20,
};

const labelStyle = {
  color: '#000000',
  fontSize: 16,
};

const dataset = [
  [200, 40],
  [170, 100],
  [400, 60],
  [100, 150],
  [410, 300],
  [120, 220],
  [310, 260],
  [400, 110],
];

/**
 * Get the proper X coordinate for rendering text
 * @param {number} originalX - the X coordinate being used
 * @returns {number} the adjusted X coordinate for positioning
 */
const getLabelX = originalX => {
  const circleHalf = (circleStyle.radius * 6) / 4;
  return originalX + circleHalf
}

/**
 * Get the proper Y coordinate for rendering text.
 * Essentially move it down half of the font-size
 * @param {number} originalY - the Y coordinate being used
 * @returns {number} the adjusted Y coordinate for positioning
 */
const getLabelY = originalY => {
  return originalY + (labelStyle.fontSize / 2.7);
}

const svgElement = d3
  .select('.graph-area')
  .append('svg')
  .attr('width', wrapper.width)
  .attr('height', wrapper.height);

svgElement
  .selectAll('circle')
  .data(dataset)
  .enter()
  .append('circle')
  .attr('cx', d => d[0])
  .attr('cy', d => d[1])
  .attr('r', circleStyle.radius)
  .attr('fill', circleStyle.color);


svgElement
  .selectAll('text')
  .data(dataset)
  .enter()
  .append('text')
  .text(d => `${d[0]}, ${d[1]}`)
  .attr('x', d => getLabelX(d[0]))
  .attr('y', d => getLabelY(d[1]))
  .attr('font-size', `${labelStyle.fontSize}px`)
  .attr('fill', labelStyle.color);
