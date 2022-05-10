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
const data1 = [
  { date: "2022-5-10", value: "601" },
  { date: "2022-5-11", value: "502" },
  { date: "2022-5-12", value: "100" },
  { date: "2022-5-13", value: "666" },
  { date: "2022-5-14", value: "622" },
  { date: "2022-5-15", value: "626" },
  { date: "2022-5-16", value: "622" },
  { date: "2022-5-17", value: "605" },
  { date: "2022-5-18", value: "580" },
  { date: "2022-5-19", value: "543" },
  { date: "2022-5-20", value: "443" },
  { date: "2022-5-21", value: "345" },
  { date: "2022-5-22", value: "234" },
  { date: "2022-5-23", value: "166" },
  { date: "2022-5-24", value: "130" },
  { date: "2022-5-25", value: "99" },
  { date: "2022-5-26", value: "89" },
  { date: "2022-5-27", value: "67" },
  { date: "2022-5-28", value: "53" },
  { date: "2022-5-29", value: "10" },
];

const data2 = [
  { date: "2022-5-10", value: "301" },
  { date: "2022-5-11", value: "402" },
  { date: "2022-5-12", value: "150" },
  { date: "2022-5-13", value: "166" },
  { date: "2022-5-14", value: "522" },
  { date: "2022-5-15", value: "126" },
  { date: "2022-5-16", value: "122" },
  { date: "2022-5-17", value: "105" },
  { date: "2022-5-18", value: "180" },
  { date: "2022-5-19", value: "143" },
  { date: "2022-5-20", value: "143" },
  { date: "2022-5-21", value: "145" },
  { date: "2022-5-22", value: "134" },
  { date: "2022-5-23", value: "166" },
  { date: "2022-5-24", value: "250" },
  { date: "2022-5-25", value: "229" },
  { date: "2022-5-26", value: "189" },
  { date: "2022-5-27", value: "167" },
  { date: "2022-5-28", value: "153" },
  { date: "2022-5-29", value: "110" },
];

// data02.forEach((item) => ((item.date = new Date(item.date)), (item.value = +item.value)));

// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 800 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
const line1Color = "#FFB300";
const tooltipWidth = 124;
const tooltipHeight = 32;
// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");
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
    return y(d.value);
  });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3
  .select("#line-chart")
  .append("svg")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var line1 = svg.append("g");
var line2 = svg.append("g");
// Get the data
// d3.csv("atad.csv").then(function (data) {
// format the data
// console.log(JSON.stringify(data));

data1.forEach(function (d) {
  d.date = parseTime(d.date);
  d.value = +d.value;
});
data2.forEach(function (d) {
  d.date = parseTime(d.date);
  d.value = +d.value;
});
// Scale the range of the data
x.domain(
  d3.extent(data1, function (d) {
    return d.date;
  })
);
y.domain([
  0,
  d3.max(data1, function (d) {
    return d.value;
  }),
]);

// Add the valueline path.
line1
  .append("path")
  .data([data1])
  .attr("fill", "none")
  .attr("stroke", line1Color)
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("class", "line")
  .attr("d", valueline);

line2
  .append("path")
  .data([data2])
  .attr("fill", "none")
  .attr("stroke", line1Color)
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("class", "line")
  .attr("d", valueline);

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
svg
  .append("g")
  .call(d3.axisLeft(y))
  .call((g) => g.select(".domain").remove()); // 移除 y 轴

// add tooltip
function addToolTip() {
  var tooltipG = svg.append("g").style("display", "none");

  tooltipG
    .append("circle")
    .attr("class", "tooltip1")
    .style("fill", "#fff")
    .style("stroke", line1Color)
    .style("stroke-width", 2)
    .attr("r", 4);

  tooltipG
    .append("rect")
    .attr("class", "tooltip1")
    .attr("rx", "3") // 圆角
    .attr("ry", "3") // 圆角
    .style("fill", "#fff")
    .style("filter", "drop-shadow(0 0 5px rgba(3, 3, 3, 0.15))")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight);
  tooltipG
    .append("text")
    .attr("class", "tooltip1")
    .attr("dy", "0.4em")
    .attr("dx", "2em")
    .style("font-family", "Arial")
    .style("font-size", "12px")
    .style("fill", "#333333")
    .text("安全事件");
  return tooltipG;
}
var tooltipG1 =  addToolTip();
var tooltipG2 =  addToolTip();
// append the rectangle to capture mouse
svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("mouseover", function () {
    tooltipG1.style("display", null);
    tooltipG2.style("display", null);
  })
  .on("mouseout", function () {
    tooltipG1.style("display", "none");
    tooltipG2.style("display", "none");
  })
  .on("mousemove", mousemove);

function mousemove(event) {
  showTooltip(event, tooltipG1, data1);
  showTooltip(event, tooltipG2, data2);
}

function showTooltip(event, tooltipG, data) {
  var x0 = x.invert(d3.pointer(event, this)[0]),
    i = bisectDate(data, x0, 1),
    d0 = data[i - 1],
    d1 = data[i];
  if (!d0 || !d1) return;
  var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  // console.log(d);
  tooltipG
    .select("circle.tooltip1")
    .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
  // tooltipG.text("安全事件：" + d.value);
  tooltipG
    .select("text.tooltip1")
    .text("安全事件：" + d.value)
    .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
  tooltipG
    .select("rect.tooltip1")
    .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")")
    .attr("x", 8)
    .attr("y", -tooltipHeight / 2);
}
// });
