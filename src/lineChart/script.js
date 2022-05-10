const data = [
  { date: "2021-01-01", value: 41 },
  { date: "2021-01-02", value: 143 },
  { date: "2021-01-03", value: 135 },
  { date: "2021-01-04", value: 14 },
  { date: "2021-01-05", value: 41 },
  { date: "2021-01-06", value: 14 },
  { date: "2021-01-07", value: 13 },
  { date: "2021-01-08", value: 165 },
  { date: "2021-01-09", value: 14 },
];

data.forEach((item) => (item.date = new Date(item.date)));

const height = 300;
const width = 800;
const margin = { top: 20, right: 66, bottom: 30, left: 40 };
const line1Color = "#FFB300";

const svg = d3.select("#line-chart").append("svg").attr("viewBox", [0, 0, width, height]);
// 渐变
const linearGradient = svg
  .append("defs")
  .append("linearGradient") // linear gradient
  .attr("id", "myGrad")
  .attr("x1", "0%")
  .attr("x2", "0%")
  .attr("y1", "0%")
  .attr("y2", "100%");
linearGradient
  .append("stop")
  .attr("offset", "0%")
  .style("stop-color", line1Color)
  .style("stop-opacity", 0.15);
linearGradient
  .append("stop")
  .attr("offset", "100%")
  .style("stop-color", "#fff")
  .style("stop-opacity", 0.01);

const x = d3
  .scaleUtc()
  .domain(d3.extent(data, (d) => d.date))
  .range([margin.left, width - margin.right]);

const y = d3
  .scaleLinear()
  .domain(d3.extent(data, (d) => d.value))
  .nice()
  .range([height - margin.bottom, margin.top]);

const xAxis = (g) =>
  g.attr("transform", `translate(0,${height - margin.bottom})`).call(
    d3
      .axisBottom(x)
      .ticks(width / 80)
      .tickFormat(d3.timeFormat("%m/%d"))
      .tickSizeOuter(0)
  );

const yAxis = (g) =>
  g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .select(".tick:last-of-type text")
        .clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y)
    );

const line1 = d3
  .line()
  .defined((d) => !isNaN(d.value))
  .x((d) => x(d.date))
  .y((d) => y(d.value));

svg.append("g").call(xAxis);
svg.append("g").call(yAxis);

svg
  .append("path")
  .datum(data)
  .style("fill", "url(#myGrad)") // 渐变
  .attr("stroke", line1Color)
  .attr("stroke-width", 1)
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("d", line1);

const colorScale = d3
  .scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
  .domain(["安全风险", "安全事件"])
  .range(["#FFB300", "#3881FF"]);
//绘制 legend
const legend = svg
  .append("g")
  .selectAll(".legend")
  .data(colorScale.domain())
  .enter()
  .append("g")
  .attr("transform", (d, i) => `translate(${width - margin.right},${i * 20 + 20})`);

legend
  .append("rect")
  .attr("x", 0)
  .attr("y", -3)
  .attr("width", 6)
  .attr("height", 6)
  .attr("fill", colorScale);
legend
  .append("text")
  .attr("x", 10)
  .attr("y", 4)
  .attr("fill", "#8F9BB3")
  .style("font-size", "0.65em")
  .text((d) => d);

// TODO:hover tooltip
// var focus = svg.append("g").attr("class", "focus"); //.style("display", "none");

// focus.append("circle").attr("r", 5);

// focus
//   .append("rect")
//   .attr("class", "tooltip")
//   .attr("width", 100)
//   .attr("height", 50)
//   .attr("x", 10)
//   .attr("y", -22)
//   .attr("rx", 4)
//   .attr("ry", 4);

// focus.append("text").attr("class", "tooltip-date").attr("x", 18).attr("y", -2);

// focus.append("text").attr("x", 18).attr("y", 18).text("aaa:");

// focus.append("text").attr("class", "tooltip-likes").attr("x", 60).attr("y", 18);

// svg
//   .append("rect")
//   .attr("class", "overlay")
//   .attr("width", width)
//   .attr("height", height)
//   .attr("fill", "none")
//   .on("mouseover", function () {
//     focus.style("display", null);
//   })
//   .on("mouseout", function () {
//     focus.style("display", "none");
//   })
//   .on("mousemove", mousemove);

// var  bisectDate = d3.bisector(function (d) { return d.date; }).left
// var formatValue = d3.format(",");
// var dateFormatter = d3.timeParse("%m/%d/%y");
// function mousemove(e, d) {
//   console.log(e, d);
//   var x0 = x.invert(d3.pointer(this)[0])
//   ,
//     i = bisectDate(data, x0, 1),
//     d0 = data[i - 1],
//     d1 = data[i],
//     d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//   focus.attr("transform", "translate(" + x(d.date) + "," + y(d.likes) + ")");
//   focus.select(".tooltip-date").text(dateFormatter(d.date));
//   focus.select(".tooltip-likes").text(formatValue(d.likes));
// }
