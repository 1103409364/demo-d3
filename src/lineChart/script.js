var lineData = {
  line1: [
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
  ],
  line2: [
    { date: "2022-5-10", value: "301" },
    { date: "2022-5-11", value: "402" },
    { date: "2022-5-12", value: "1150" },
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
  ],
};

function draw(data) {
  var parseTime = d3.timeParse("%Y-%m-%d");
  data.line1.forEach(function (d) {
    d.date = parseTime(d.date);
    d.value = +d.value;
  });
  data.line2.forEach(function (d) {
    d.date = parseTime(d.date);
    d.value = +d.value;
  });

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 66, bottom: 30, left: 40 },
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
  const line1Color = "#FFB300";
  const line2Color = "#3881FF";
  // const tooltipWidth = 124;
  const tooltipHeight = 32;
  // parse the date / time
  var bisectDate = d3.bisector(function (d) {
    return d.date;
  }).left;
  // set the ranges
  var svg = d3
    .select("#line-chart")
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // 准备坐标轴 set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  //x y 轴的刻度范围
  var xExtend = d3.extent([...data.line1.map((d) => d.date), ...data.line2.map((d) => d.date)]);
  var yExtend = d3.extent([...data.line1.map((d) => d.value), ...data.line2.map((d) => d.value)]);
  yExtend[1] = +yExtend[1] + (+yExtend[1] - +yExtend[0]) * 0.1; // 增加20%的高度 显示下一级刻度

  x.domain(xExtend);
  y.domain(yExtend);
  // Add the X Axis
  var xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x-axis")
    .call(
      d3
        .axisBottom(x)
        .ticks(10) // 设置x轴刻度数量
        .tickFormat(d3.timeFormat("%m/%d")) // 设置x轴label的格式
        .tickSizeOuter(0)
    );
  xAxis.attr("class", "line-axis"); // 设置 class 修改颜色等样式
  // Add the Y Axis
  var yAxis = svg
    .append("g")
    .call(d3.axisLeft(y).ticks(5)) // 设置y轴刻度数量
    .call((g) => g.select(".domain").remove()); // 移除 y 轴
  yAxis.attr("class", "line-axis"); // 设置 class 修改颜色等样式

  // define the line
  var line = d3
    .line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.value);
    });

  var line1G = svg.append("g");
  var line2G = svg.append("g");

  // 渐变
  var areaGradient1 = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "areaGradient1")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");
  areaGradient1
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", line1Color)
    .attr("stop-opacity", 0.3);
  areaGradient1.append("stop").attr("offset", "80%").attr("stop-color", "#fff").attr("stop-opacity", 0);
  svg
    .append("path")
    .datum(data.line1)
    .style("fill", "url(#areaGradient1)")
    .attr(
      "d",
      d3
        .area()
        .x(function (d) {
          return x(d.date);
        })
        .y0(y(0))
        .y1(function (d) {
          return y(d.value);
        })
    );

  var areaGradient2 = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "areaGradient2")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");
  areaGradient2
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", line2Color)
    .attr("stop-opacity", 0.3);
  areaGradient2.append("stop").attr("offset", "80%").attr("stop-color", "#fff").attr("stop-opacity", 0);
  svg
    .append("path")
    .datum(data.line2)
    .style("fill", "url(#areaGradient2)")
    .attr(
      "d",
      d3
        .area()
        .x(function (d) {
          return x(d.date);
        })
        .y0(y(0))
        .y1(function (d) {
          return y(d.value);
        })
    );
  // Add the valueline path.
  line1G
    .append("path")
    .data([data.line1])
    .attr("fill", "none")
    .attr("stroke", line1Color)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("class", "line")
    .attr("d", line);

  line2G
    .append("path")
    .data([data.line2])
    .attr("fill", "none")
    .attr("stroke", line2Color)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("class", "line")
    .attr("d", line);

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
    .append("circle")
    .attr("class", "tooltip2")
    .style("fill", "#fff")
    .style("stroke", line2Color)
    .style("stroke-width", 2)
    .attr("r", 4);

  // tooltipG
  //   .append("rect")
  //   .attr("class", "tooltip1")
  //   .attr("rx", "3") // 圆角
  //   .attr("ry", "3") // 圆角
  //   .style("fill", "#fff")
  //   .style("filter", "drop-shadow(0 0 5px rgba(3, 3, 3, 0.15))")
  //   .attr("width", tooltipWidth)
  //   .attr("height", tooltipHeight);
  tooltipG
    .append("text")
    .attr("class", "tooltip1")
    .attr("dy", "0.4em")
    // .attr('text-anchor', 'middle')
    .attr("dx", "1em")
    .style("font-family", "Arial")
    // .style('text-shadow','1px 1px 1px #333')
    .style("font-size", "12px")
    .style("fill", "#333");
  // .text("安全事件");
  tooltipG
    .append("text")
    .attr("class", "tooltip2")
    .attr("dy", "0.4em")
    .attr("dx", "1em")
    .style("font-family", "Arial")
    .style("font-size", "12px")
    .style("fill", "#333");
  // .text("安全风险");
  // append the rectangle to capture mouse
  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function () {
      tooltipG.style("display", null);
    })
    .on("mouseout", function () {
      tooltipG.style("display", "none");
    })
    .on("mousemove", mousemove);

  function mousemove(event) {
    var x0 = x.invert(d3.pointer(event, this)[0]),
      line1i = bisectDate(data.line1, x0, 1),
      line2i = bisectDate(data.line2, x0, 1),
      line1d0 = data.line1[line1i - 1],
      line1d1 = data.line1[line1i],
      line2d0 = data.line2[line2i - 1],
      line2d1 = data.line2[line2i];
    var d1 = {};
    var d2 = {};
    if (line1d0 && line1d1) {
      d1 = x0 - line1d0.date > line1d1.date - x0 ? line1d1 : line1d0;
    }
    if (line2d0 && line2d1) {
      d2 = x0 - line2d0.date > line2d1.date - x0 ? line2d1 : line2d0;
    }
    // console.log(d);
    tooltipG
      .select("circle.tooltip1")
      .attr("transform", "translate(" + x(d1.date) + "," + y(d1.value) + ")");
    tooltipG
      .select("circle.tooltip2")
      .attr("transform", "translate(" + x(d2.date) + "," + y(d2.value) + ")");
    tooltipG
      .select("text.tooltip1")
      .text(d1.value) // "安全事件：" +
      .attr("transform", "translate(" + x(d1.date) + "," + y(d1.value) + ")");
    tooltipG
      .select("text.tooltip2")
      .text(d2.value) // "安全风险：" +
      .attr("transform", "translate(" + x(d1.date) + "," + y(d2.value) + ")");
    tooltipG
      .select("rect.tooltip1")
      .attr("transform", "translate(" + x(d1.date) + "," + y(d1.value) + ")")
      .attr("x", 8)
      .attr("y", -tooltipHeight / 2);
  }

  //绘制 legend
  const colorScale = d3
    .scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
    .domain(["安全风险", "安全事件"])
    .range([line1Color, line2Color]);

  const legend = svg
    .append("g")
    .selectAll(".legend")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${width},${i * 20 + 20})`);

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
}
draw(lineData);
