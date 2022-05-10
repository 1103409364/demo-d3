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
const data = [
  { date: "3-Apr-12", value: "601" },
  { date: "4-Apr-12", value: "502" },
  { date: "5-Apr-12", value: "100" },
  { date: "9-Apr-12", value: "666" },
  { date: "10-Apr-12", value: "622" },
  { date: "11-Apr-12", value: "626" },
  { date: "12-Apr-12", value: "622" },
  { date: "13-Apr-12", value: "605" },
  { date: "16-Apr-12", value: "580" },
  { date: "17-Apr-12", value: "543" },
  { date: "18-Apr-12", value: "443" },
  { date: "19-Apr-12", value: "345" },
  { date: "20-Apr-12", value: "234" },
  { date: "23-Apr-12", value: "166" },
  { date: "24-Apr-12", value: "130" },
  { date: "25-Apr-12", value: "99" },
  { date: "26-Apr-12", value: "89" },
  { date: "27-Apr-12", value: "67" },
  { date: "30-Apr-12", value: "53" },
  { date: "1-May-12", value: "10" },
];

// data.forEach((item) => ((item.date = new Date(item.date)), (item.value = +item.value)));

// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 800 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
const line1Color = "#FFB300";
const tooltipWidth = 124;
const tooltipHeight = 32;
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

var lineSvg = svg.append("g");

// Get the data
// d3.csv("atad.csv").then(function (data) {
// format the data
// console.log(JSON.stringify(data));

data.forEach(function (d) {
  d.date = parseTime(d.date);
  d.value = +d.value;
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
    return d.value;
  }),
]);

// Add the valueline path.
lineSvg
  .append("path")
  .data([data])
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

// filters go in defs element
var defs = svg.append("defs");
var filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "130%");
// add tooltip
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
  .style("fill", "#fff")
  // .style("stroke", "red")
  .style("filter", "drop-shadow(0 0 5px rgba(6,6,6,0.3))")
  // .style("box-shadow", "0 3px 6px 0 rgb(226 229 240 / 30%)")
  .attr("width", tooltipWidth)
  .attr("height", tooltipHeight);
tooltipG
  .append("text")
  .attr("class", "tooltip1")
  .style("font-weight", 400)
  .style("font-family", "Arial")
  .style("font-size", "12px")
  .style("fill", "red")
  .text("安全事件");
// append the rectangle to capture mouse
svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("mouseover", function () {
    tooltipG.style("display", null);
    // tooltipG.style("display", null);
    // tooltipG.style("display", null);
  })
  .on("mouseout", function () {
    tooltipG.style("display", "none");
    // tooltipText.style("display", "none");
    // tooltip.style("display", "none");
  })
  .on("mousemove", mousemove);

function mousemove(event) {
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
  // html定位有问题
  // div.html(d.value);
  // div.transition().duration(200).style("opacity", 0.9);
  // console.log(x(d.date), y(d.value));
  // div
  //   .html(d.value)
  //   .style("left",
  //   .style("top", y(d.value) + "px");x(d.date) + "px")

  tooltipG
    .select("rect.tooltip1")
    .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")")
    .attr("x", 8)
    .attr("y", -tooltipHeight / 2);
}
// });
