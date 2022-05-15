// 一维数组，通过 symbol 分组
const lines = [
  { date: "2022-5-10", value: "601", symbol: "A" },
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
  { date: "2022-5-11", value: "0", symbol: "C" },
  { date: "2022-5-21", value: "545", symbol: "C" },
  { date: "2022-5-22", value: "534", symbol: "C" },
  { date: "2022-5-23", value: "566", symbol: "C" },
  { date: "2022-5-24", value: "550", symbol: "C" },
  { date: "2022-5-25", value: "529", symbol: "C" },
  { date: "2022-5-26", value: "589", symbol: "C" },
  { date: "2022-5-27", value: "567", symbol: "C" },
  { date: "2022-5-28", value: "553", symbol: "C" },
];

function draw(rowData) {
  // Set the dimensions of the canvas / graph
  const margin = { top: 20, right: 66, bottom: 110, left: 40 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  const margin2 = { top: 320, right: 66, bottom: 20, left: 40 },
    height2 = 400 - margin2.top - margin2.bottom;
  // Parse the date / time
  const parseDate = d3.timeParse("%Y-%m-%d");
  // bisector
  // Set the ranges 定义比例尺 值域
  const xScale = d3.scaleTime().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);
  const xScale2 = d3.scaleTime().range([0, width]);
  const yScale2 = d3.scaleLinear().range([height2, 0]);
  // const colors = ["#FFB300", "#3881FF"];

  // define the line 定义主折线
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));
  // define the line 定义面积 给折线添加渐变
  const area = d3
    .area()
    .x((d) => xScale(d.date))
    .y0(yScale(0))
    .y1((d) => yScale(d.value));
  // define the line 定义缩放区折线
  const line2 = d3
    .line()
    .x((d) => xScale2(d.date))
    .y((d) => yScale2(d.value));
  // 获取 svg
  const svg = d3.select("#line-chart").append("svg");
  // 上方的折线图分组
  const lineChart = svg
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .attr("class", "focus")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // 绘制坐标轴等，用于缩放
  const focus = svg
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // 下方缩放区域分组
  const context = svg
    .attr("viewBox", [
      0,
      0,
      width + margin2.left + margin2.right,
      height2 + margin2.top + margin2.bottom,
    ])
    .attr("class", "context")
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
  // format rowData
  rowData.forEach((d) => ((d.date = parseDate(d.date)), (d.value = +d.value)));

  // Scale the range of the data 设置比例尺 定义域
  const xExtend = d3.extent(rowData.map((d) => d.date));
  const yExtend = d3.extent(rowData.map((d) => d.value));
  yExtend[1] = +yExtend[1] + (+yExtend[1] - +yExtend[0]) * 0.1; // 增加20%的高度 显示下一级刻度
  xScale.domain(xExtend);
  yScale.domain(yExtend);

  xScale2.domain(xExtend);
  yScale2.domain(yExtend);

  // 坐标轴绘制 1 保存变量 brushed 缩放用
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(10) // 设置x轴刻度数量
    .tickFormat(d3.timeFormat("%m/%d")) // 设置x轴label的格式
    .tickSizeOuter(0);
  // Add the Y Axis
  const yAxis = d3.axisLeft(yScale).ticks(5); // 设置y轴刻度数量

  focus
    .append("g")
    .attr("class", "axis axis--x line-axis") // 设置 class 修改颜色等样式
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  // remove 移除 y 轴竖线
  focus.append("g").attr("class", "axis axis--y line-axis").call(yAxis).select(".domain").remove();

  // 坐标轴绘制 2
  context
    .append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .attr("class", "x-axis")
    .call(
      d3
        .axisBottom(xScale2)
        .ticks(10) // 设置x轴刻度数量
        .tickFormat(d3.timeFormat("%m/%d")) // 设置x轴label的格式
        .tickSizeOuter(0)
    );
  // Add the Y Axis
  context
    .append("g")
    .call(d3.axisLeft(yScale2).ticks(1))
    .call((g) => g.select(".domain").remove()); // 移除 y 轴; // 设置y轴刻度数量
  // =============================================================================
  // Group the entries by symbol 数据转换分组
  const dataNest = Array.from(
    d3.group(rowData, (d) => d.symbol), // {A=>[], B=>[]} InternMap https://www.geeksforgeeks.org/d3-js-group-method/ https://github.com/d3/d3-array
    ([key, values]) => ({ key, values }) // [{A:[]}, {B:[]}]
  );
  // 创建自己的颜色比例尺
  // var color = d3.scale
  //   .ordinal()
  //   .domain(["New York", "San Francisco", "Austin"])
  //   .range("#FF0000", "#009933", "#0000FF");
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // 使用自带比例尺
  // g 分组区分优先级，后创建的元素会覆盖前面创建 g
  const lineG = lineChart.append("g"); // 创建一个线条容器 提前创建防止遮挡
  // const line2G = context.append("g").attr("class", "axis axis--x"); // 创建一个线条容器
  const tooltipG = lineChart.append("g").style("display", "none"); // 创建一个 tooltip 容器
  const activeStatus = {}; // 点击展示 or 隐藏线条
  // const tooltipWidth = 124;
  // const tooltipHeight = 32;
  dataNest.forEach((item, i) => {
    activeStatus[item.key] = true;
    // 画线
    lineG
      .append("path")
      .attr("class", "line")
      .attr("id", "tag" + item.key.replace(/\s+/g, "")) // assign an ID 用于隐藏等操作
      .attr("stroke", () => (item.color = colorScale(item.key))) // 设置颜色同时把颜色加到数据中
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      // .attr("d", line(item.values)); // 这种写法导致缩放 brushed 方法报错
      .datum(item.values)
      .attr("d", line);

    context
      .append("path")
      .attr("stroke", () => colorScale(item.key)) // 设置颜色同时把颜色加到数据中
      .attr("fill", "none")
      // .attr("d", line2(item.values))
      .datum(item.values)
      .attr("d", line2);

    // 渐变
    const areaGradient = lineChart
      .append("defs")
      .append("linearGradient")
      .attr("id", "lg" + item.key.replace(/\s+/g, ""))
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
    lineG
      .append("path")
      .attr("class", "line-lg")
      .datum(item.values)
      .attr("id", "area" + item.key.replace(/\s+/g, "")) // assign an ID 用于隐藏等操作
      .style("fill", `url(#lg${item.key.replace(/\s+/g, "")})`)
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

  // 缩放 x 轴
  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height2],
    ])
    .on("brush end", brushed);

  const zoom = d3
    .zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", zoomed);

  // 下方 缩放区灰色层，用于拖拽
  context.append("g").attr("class", "brush").call(brush).call(brush.move, xScale.range());
  function brushed(event) {
    if (event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = event.selection || xScale2.range();
    xScale.domain(s.map(xScale2.invert, xScale2));
    lineChart.selectAll(".line").attr("d", line); // 线条缩放
    lineChart.selectAll(".line-lg").attr("d", area); // 渐变区缩放
    focus.select(".axis--x").call(xAxis);
    svg
      .select(".zoom")
      .call(zoom.transform, d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0));
  }
  function zoomed(event) {
    if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = event.transform;
    xScale.domain(t.rescaleX(xScale2).domain());
    lineChart.selectAll(".line").attr("d", line);
    lineChart.selectAll(".line-lg").attr("d", area); // 渐变区缩放
    focus.select(".axis--x").call(xAxis);
    // 鼠标滚轮缩放图表，更新滑块
    context.select(".brush").call(brush.move, xScale.range().map(t.invertX, t));
  }
  // 添加 tooltip
  // append the rectangle to capture mouse 附加矩形以捕获鼠标，缩放、鼠标跟随等
  lineChart
    .append("rect")
    .attr("width", width) // 矩形正好覆盖折线图区域，超出会报错
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .style("cursor", "pointer")
    .call(zoom)
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
      let d;
      d0 && d1 && (d = x0 - d0.date > d1.date - x0 ? d1 : d0); // 获取离鼠标位置近的的数据
      const display = d && activeStatus[item.key] ? null : "none"; // 如果没有数据，则隐藏 tooltip
      tooltipG.select("circle.tooltip" + i).style("display", display);
      tooltipG.select("text.tooltip-text-back" + i).style("display", display);
      tooltipG.select("text.tooltip" + i).style("display", display);
      tooltipG.select("line.tooltip-x" + i).style("display", display);
      tooltipG.select("line.tooltip-y" + i).style("display", display);
      if (!d) return;
      // tooltipG
      //   .select("rect.tooltip" + i)
      //   .attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.value) + ")")
      //   .attr("x", 8)
      //   .attr("y", -tooltipHeight / 2);
      tooltipG
        .select("circle.tooltip" + i)
        .transition()
        .duration(1)
        .attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.value) + ")");
      // 要两条线？一条线当天可能没数据
      tooltipG
        .select("text.tooltip-text-back" + i)
        .transition()
        .duration(1)
        .text(d.value)
        .attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.value) + ")");
      tooltipG
        .select("text.tooltip" + i)
        .transition()
        .duration(1)
        .text(d.value) // "安全事件：" +
        .attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.value) + ")");
      tooltipG
        .select("line.tooltip-x" + i)
        .transition()
        .duration(1)
        .attr("transform", "translate(" + xScale(d.date) + "," + 0 + ")");
      tooltipG
        .select("line.tooltip-y" + i)
        .transition()
        .duration(1)
        .attr("transform", "translate(" + 0 + "," + yScale(d.value) + ")");
    });
  }

  //绘制 legend
  const legend = lineChart
    .append("g")
    .selectAll(".legend")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${width},${i * 20 + 20})`)
    .style("cursor", "pointer")
    .on("click", (event, d) => {
      // 画线时传递过 colorScale key
      // Determine if current line is visible
      activeStatus[d] = !activeStatus[d];
      // Hide or show the elements based on the ID
      d3.select("#tag" + d.replace(/\s+/g, ""))
        .transition()
        .duration(500)
        .style("opacity", +activeStatus[d]);

      d3.select("#area" + d.replace(/\s+/g, ""))
        .transition()
        .duration(500)
        .style("opacity", +activeStatus[d]);
    });

  legend
    .append("rect")
    .attr("x", 5)
    .attr("y", -5)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", colorScale);
  legend
    .append("text")
    .attr("x", 20)
    .attr("y", 4)
    .attr("fill", "#8F9BB3")
    .style("font-size", "0.65em")
    .text((d) => d);
}
draw(lines);
