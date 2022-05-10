// const data = [
//   { date: "2021-01-01", value: 41 },
//   { date: "2021-01-02", value: 143 },
//   { date: "2021-01-03", value: 135 },
//   { date: "2021-01-04", value: 14 },
//   { date: "2021-01-05", value: 41 },
//   { date: "2021-01-06", value: 14 },
//   { date: "2021-01-07", value: 13 },
//   { date: "2021-01-08", value: 165 },
//   { date: "2021-01-09", value: 14 },
// ];

// data.forEach((item) => ((item.date = new Date(item.date)), (item.value = +item.value)));

// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");
var bisectDate = d3.bisector(function (d) {
  return d.date;
}).left;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3
  .line()
  .x(function (d) {
    return x(d.date);
  })
  .y(function (d) {
    return y(d.close);
  });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var lineSvg = svg.append("g");

var focus = svg.append("g").style("display", "none");

// Get the data
d3.csv("atad.csv").then(function (data) {
  // format the data
  data.forEach(function (d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
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
      return d.close;
    }),
  ]);

  // Add the valueline path.
  lineSvg.append("path").data([data]).attr("class", "line").attr("d", valueline);

  // Add the X Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickFormat(d3.timeFormat("%m/%d"))
        .tickSizeOuter(0)
    );

  // Add the Y Axis
  svg.append("g").call(d3.axisLeft(y));

  // append the circle at the intersection
  focus.append("circle").attr("class", "y").style("fill", "none").style("stroke", "blue").attr("r", 4);

  // append the rectangle to capture mouse
  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function () {
      focus.style("display", null);
    })
    .on("mouseout", function () {
      focus.style("display", "none");
    })
    .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.pointer(event, this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;

    focus.select("circle.y").attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
  }
});
