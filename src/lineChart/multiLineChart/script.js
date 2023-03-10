// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 20, bottom: 70, left: 50 },
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.timeParse("%b %Y");

// Set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the line
var priceline = d3
  .line()
  .x(function (d) {
    return x(d.date);
  })
  .y(function (d) {
    return y(d.price);
  });

// Adds the svg canvas
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("stocks.csv").then(function (data) {
  data.forEach(function (d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
  });
  // Scale the range of the data
  x.domain(
    d3.extent(data, function (d) {
      return d.date;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.price;
    }),
  ]);

  // Group the entries by symbol
  const dataNest = Array.from(
    d3.group(data, (d) => d.symbol),
    ([key, value]) => ({ key, value })
  );

  // set the colour scale
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  const legendSpace = width / dataNest.length; // spacing for the legend

  // Loop through each symbol / key
  dataNest.forEach(function (d, i) {
    svg
      .append("path")
      .attr("class", "line")
      .style("stroke", function () {
        // Add the colours dynamically
        return (d.color = color(d.key));
      })
      .attr("id", "tag" + d.key.replace(/\s+/g, "")) // assign an ID
      .attr("d", priceline(d.value));

    // Add the Legend
    svg
      .append("text")
      .attr("x", legendSpace / 2 + i * legendSpace) // space legend
      .attr("y", height + margin.bottom / 2 + 5)
      .attr("class", "legend") // style the legend
      .style("fill", function () {
        // Add the colours dynamically
        return (d.color = color(d.key));
      })
      .on("click", function () {
        // Determine if current line is visible
        var active = d.active ? false : true,
          newOpacity = active ? 0 : 1;
        // Hide or show the elements based on the ID
        d3.select("#tag" + d.key.replace(/\s+/g, ""))
          .transition()
          .duration(500)
          .style("opacity", newOpacity);
        // Update whether or not the elements are active
        d.active = active;
      })
      .text(d.key);
  });

  // Add the X Axis
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g").attr("class", "axis").call(d3.axisLeft(y));
});
