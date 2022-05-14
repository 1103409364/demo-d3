// 一维数组，通过 symbol 分组
const lines = [
  { date: "2022-5-10", value: "601", symbol: "A" },
  { date: "2022-5-11", value: "502", symbol: "A" },
  { date: "2022-5-12", value: "100", symbol: "A" },
  { date: "2022-5-13", value: "666", symbol: "A" },
  { date: "2022-5-14", value: "622", symbol: "A" },
  { date: "2022-5-15", value: "626", symbol: "A" },
  { date: "2022-5-16", value: "622", symbol: "A" },
  { date: "2022-5-17", value: "605", symbol: "A" },
  { date: "2022-5-18", value: "580", symbol: "A" },
  { date: "2022-5-19", value: "543", symbol: "A" },
  { date: "2022-5-20", value: "443", symbol: "A" },
  { date: "2022-5-21", value: "345", symbol: "A" },
  { date: "2022-5-22", value: "234", symbol: "A" },
  { date: "2022-5-23", value: "166", symbol: "A" },
  { date: "2022-5-24", value: "130", symbol: "A" },
  { date: "2022-5-25", value: "99", symbol: "A" },
  { date: "2022-5-26", value: "89", symbol: "A" },
  { date: "2022-5-27", value: "67", symbol: "A" },
  { date: "2022-5-28", value: "53", symbol: "A" },
  { date: "2022-5-29", value: "10", symbol: "A" },
  { date: "2022-5-10", value: "301", symbol: "B" },
  { date: "2022-5-11", value: "402", symbol: "B" },
  { date: "2022-5-12", value: "1150", symbol: "B" },
  { date: "2022-5-13", value: "166", symbol: "B" },
  { date: "2022-5-14", value: "522", symbol: "B" },
  { date: "2022-5-15", value: "126", symbol: "B" },
  { date: "2022-5-16", value: "122", symbol: "B" },
  { date: "2022-5-17", value: "105", symbol: "B" },
  { date: "2022-5-18", value: "180", symbol: "B" },
  { date: "2022-5-19", value: "143", symbol: "B" },
  { date: "2022-5-20", value: "143", symbol: "B" },
  { date: "2022-5-21", value: "145", symbol: "B" },
  { date: "2022-5-22", value: "134", symbol: "B" },
  { date: "2022-5-23", value: "166", symbol: "B" },
  { date: "2022-5-24", value: "250", symbol: "B" },
  { date: "2022-5-25", value: "229", symbol: "B" },
  { date: "2022-5-26", value: "189", symbol: "B" },
  { date: "2022-5-27", value: "167", symbol: "B" },
  { date: "2022-5-28", value: "153", symbol: "B" },
  { date: "2022-5-29", value: "110", symbol: "B" },
];

function draw(rowData) {
  // Set the dimensions of the canvas / graph
  const margin = { top: 20, right: 66, bottom: 30, left: 40 },
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
  // Parse the date / time
  const parseDate = d3.timeParse("%Y-%m-%d");
  // bisector
  // Set the ranges 定义比例尺 值域
  const xScale = d3.scaleTime().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);
  // define the line
  // const colors = ["#FFB300", "#3881FF"];
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));
  // set the ranges
  const svg = d3
    .select("#line-chart")
    .append("svg")
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // format rowData
  rowData.forEach((d) => ((d.date = parseDate(d.date)), (d.value = +d.value)));

  // Scale the range of the data 设置比例尺 定义域
  const xExtend = d3.extent(rowData.map((d) => d.date));
  const yExtend = d3.extent(rowData.map((d) => d.value));
  yExtend[1] = +yExtend[1] + (+yExtend[1] - +yExtend[0]) * 0.1; // 增加20%的高度 显示下一级刻度
  xScale.domain(xExtend);
  yScale.domain(yExtend);

  // Group the entries by symbol
  const dataNest = Array.from(
    d3.group(rowData, (d) => d.symbol), // {A=>[], B=>[]} InternMap https://www.geeksforgeeks.org/d3-js-group-method/ https://github.com/d3/d3-array
    ([key, values]) => ({ key, values }) // [{A:[]}, {B:[]}]
  );
  console.log(d3.group(rowData, (d) => d.symbol));
  // 创建自己的颜色比例尺
  // var color = d3.scale
  //   .ordinal()
  //   .domain(["New York", "San Francisco", "Austin"])
  //   .range("#FF0000", "#009933", "#0000FF");
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // 使用自带比例尺
  // g 分组区分优先级，后创建的元素会覆盖前面创建 g
  const lineG = svg.append("g"); // 创建一个线条容器
  const tooltipG = svg.append("g").style("display", "none"); // 创建一个 tooltip 容器
  const tooltipWidth = 124;
  const tooltipHeight = 32;
  dataNest.forEach((item, i) => {
    // 画线
    lineG
      .append("path")
      .attr("class", "line")
      .attr("id", "tag" + item.key.replace(/\s+/g, "")) // assign an ID 用于隐藏等操作
      .attr("stroke", () => (item.color = colorScale(item.key))) // 设置颜色同时把颜色加到数据中
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line(item.values));
    // .datum(item.value)
    // .attr("d", line) //写法2

    // 渐变
    const areaGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "areaGradient" + i)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    areaGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", item.color)
      .attr("stop-opacity", 0.3);
    areaGradient.append("stop").attr("offset", "80%").attr("stop-color", "#fff").attr("stop-opacity", 0);
    svg
      .append("path")
      .datum(item.values)
      .style("fill", `url(#areaGradient${i})`)
      .attr(
        "d",
        d3
          .area()
          .x((d) => xScale(d.date))
          .y0(yScale(0))
          .y1((d) => yScale(d.value))
      );
    // 添加 tooltip 遮挡问题，要等一组画完再画另一组
    // 圆点 焦点
    tooltipG
      .append("circle")
      .attr("class", "tooltip" + i) // 添加 class 用于调整位置
      .style("fill", "#fff")
      .style("stroke", item.color)
      .style("stroke-width", 2)
      .attr("r", 4);
    // x 提示线
    tooltipG
      .append("line")
      .attr("class", "tooltip-x" + i)
      .attr("x1", 0)
      .attr("y2", 0)
      .attr("x2", 0)
      .attr("y2", height)
      .attr("stroke", item.color)
      .attr("stroke-width", "1px")
      .style("stroke-dasharray", "5,5"); //dashed array for line
    // y 提示线
    tooltipG
      .append("line")
      .attr("class", "tooltip-y" + i)
      .attr("x1", 0)
      .attr("y2", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("stroke", item.color)
      .attr("stroke-width", "1px")
      .style("stroke-dasharray", "5,5"); //dashed array for line
    //矩形
    // tooltipG
    //   .append("rect")
    //   .attr("class", "tooltip" + i)
    //   .attr("rx", "3") // 圆角
    //   .attr("ry", "3") // 圆角
    //   .style("fill", "#fff")
    //   .style("filter", "drop-shadow(0 0 5px rgba(3, 3, 3, 0.15))")
    //   .attr("width", tooltipWidth)
    //   .attr("height", tooltipHeight);
    // 文字背景 原理是画一个粗笔的文字作为背景放在文字后面
    tooltipG
      .append("text")
      .attr("class", "tooltip-text-back" + i)
      .attr("dy", "0.4em")
      .attr("dx", "1em")
      .attr("stroke", "#fff") // 笔画颜色
      .attr("stroke-width", 5)
      .attr("stroke-linejoin", "round")
      .style("font-size", "12px")
      .attr("fill", "none");
    // 文字
    tooltipG
      .append("text")
      .attr("class", "tooltip" + i)
      .attr("dy", "0.4em")
      // .attr('text-anchor', 'middle')
      .attr("dx", "1em")
      .style("font-family", "Arial")
      // .style('text-shadow','1px 1px 1px #333')
      .style("font-size", "12px")
      .style("fill", "#333");
  });
  // 添加 tooltip
  // append the rectangle to capture mouse 附加矩形以捕获鼠标
  svg
    .append("rect")
    .attr("width", width) // 矩形正好覆盖折线图区域，超出会报错
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", () => tooltipG.style("display", null))
    .on("mouseout", () => tooltipG.style("display", "none"))
    .on("mousemove", mousemove);

  const bisectDate = d3.bisector((d) => d.date).left;
  // 鼠标移动 tooltip 跟随
  function mousemove(event) {
    var x0 = xScale.invert(d3.pointer(event, this)[0]); // 通过鼠标位置像素值获取鼠标点击位置的x坐标数据值
    dataNest.forEach((item, i) => {
      const index = bisectDate(item.values, x0, 1); // 获取鼠标位置附近的数据索引
      const d0 = item.values[index - 1]; // 获取鼠标位左侧的数据
      const d1 = item.values[index]; // 获取鼠标点击位置的数据
      const d = x0 - d0.date > d1.date - x0 ? d1 : d0; // 获取离鼠标位置近的的数据
      // tooltipG
      //   .select("rect.tooltip" + i)
      //   .attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.value) + ")")
      //   .attr("x", 8)
      //   .attr("y", -tooltipHeight / 2);
      tooltipG
        .select("circle.tooltip" + i)
        .attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.value) + ")");
      // 要两条线？一条线当天可能没数据
      tooltipG
        .select("text.tooltip-text-back" + i)
        .text(d.value)
        .attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.value) + ")");
      tooltipG
        .select("text.tooltip" + i)
        .text(d.value) // "安全事件：" +
        .attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.value) + ")");
      tooltipG
        .select("line.tooltip-x" + i)
        .attr("transform", "translate(" + xScale(d.date) + "," + 0 + ")");
      tooltipG
        .select("line.tooltip-y" + i)
        .attr("transform", "translate(" + 0 + "," + yScale(d.value) + ")");
    });
  }

  // 坐标轴绘制
  const xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x-axis")
    .call(
      d3
        .axisBottom(xScale)
        .ticks(10) // 设置x轴刻度数量
        .tickFormat(d3.timeFormat("%m/%d")) // 设置x轴label的格式
        .tickSizeOuter(0)
    );
  xAxis.attr("class", "line-axis"); // 设置 class 修改颜色等样式
  // Add the Y Axis
  const yAxis = svg
    .append("g")
    .call(d3.axisLeft(yScale).ticks(5)) // 设置y轴刻度数量
    .call((g) => g.select(".domain").remove()); // 移除 y 轴
  yAxis.attr("class", "line-axis"); // 设置 class 修改颜色等样式

  //绘制 legend
  const legend = svg
    .append("g")
    .selectAll(".legend")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${width},${i * 20 + 20})`);

  legend
    .append("rect")
    .attr("x", 5)
    .attr("y", -3)
    .attr("width", 6)
    .attr("height", 6)
    .attr("fill", colorScale);
  legend
    .append("text")
    .attr("x", 15)
    .attr("y", 4)
    .attr("fill", "#8F9BB3")
    .style("font-size", "0.65em")
    .text((d) => d);
}
draw(lines);
