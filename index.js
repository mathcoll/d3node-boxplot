const D3Node = require("d3-node");

function boxplot({
  data,
  selector: _selector = "#chart",
  container: _container = `
    <div id="container">
      <h2>Boxplot</h2>
      <div id="chart"></div>
    </div>
  `,
  style: _style = "",
  width: _width = 960,
  height: _height = 500,
  margin: _margin = { top: 10, right: 30, bottom: 30, left: 40 },
  color: _color = "#795548",
  hoverColor: _hoverColor = "brown",
  labels: _labels = { xAxis: '', yAxis: '' },
} = {}) {
  const _svgStyles = `
    .bar { fill: ${_color}; }
    .bar:hover { fill: ${_hoverColor}; }
  `;
  const d3n = new D3Node({
    selector: _selector,
    styles: _svgStyles + _style,
    container: _container,
  });

  const d3 = d3n.d3;
  const width = _width - _margin.left - _margin.right;
  const height = _height - _margin.top - _margin.bottom;
  const svg = d3n.createSVG(_width, _height)
        .append('g')
        .attr('transform', `translate(${_margin.left}, ${_margin.top})`);
  const g = svg.append('g');

  const { allKeys } = data;
  if (!data.q1 && !data.q3 && !data.median) {
		// Compute summary statistics used for the box:
		const data_sorted = data.sort(d3.ascending);
  }
  const q1 = typeof data.q1!=="undefined"?data.q1:d3.quantile(data_sorted, .25);
  const median = typeof data.median!=="undefined"?data.median:d3.quantile(data_sorted, .5);
  const q3 = typeof data.q3!=="undefined"?data.q3:d3.quantile(data_sorted, .75);
  const interQuantileRange = q3 - q1;
  const min = q1 - 1.5 * interQuantileRange;
  const max = q1 + 1.5 * interQuantileRange;

  // a few features for the box
  const bxcenter = width/2;
  const bxwidth = width/4;

  // Show the Y scale
  if (!data.q1 && !data.q3 && !data.median && !data.min && !data.max) {
		var y = d3.scaleLinear()
		  .domain(allKeys ? d3.extent(allKeys) : d3.extent(data, d => d))
		  .range([height, 0]);
  } else {
		var y = d3.scaleLinear()
		  .domain([data.min, data.max])
		  .range([height, 0]);
  }
	g.call(d3.axisLeft(y));

  // Show the main vertical line
  g.append("line")
    .attr("x1", bxcenter)
    .attr("x2", bxcenter)
    .attr("y1", y(data.min) )
    .attr("y2", y(data.max) )
    .attr("stroke", "black");

  // text label for the x Axis
  svg.append('text')
      .attr('transform', `translate(${width / 2}, ${height + _margin.bottom - 5})`)
      .style('text-anchor', 'middle')
      .text(_labels.xAxis);

  // Show the box
  g.append("rect")
    .attr("x", bxcenter - bxwidth/2)
    .attr("y", y(q3) )
    .attr("height", (y(q1)-y(q3)) )
    .attr("width", bxwidth )
    .attr("stroke", "black")
    .attr('class', 'bar');

  // show median, min and max horizontal lines
  g.selectAll("toto")
  .data([data.min, data.median, data.max])
  .enter()
  .append("line")
    .attr("x1", bxcenter-bxwidth/2)
    .attr("x2", bxcenter+bxwidth/2)
    .attr("y1", function(d){ return(y(d))} )
    .attr("y2", function(d){ return(y(d))} )
    .attr("stroke", "black");

  return d3n;
}

module.exports = boxplot;
