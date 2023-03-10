function monthDiff(dateFrom, dateTo) {
  if (dateFrom && dateTo) {
    return (
      1 +
      Math.abs(
        dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
      )
    );
  } else {
    return 0;
  }
}
// // 闰年判断
// function isLeapYear(year) {
//   return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
// }
// // 计算日期当天占当年de百分比
// function percentOfYear(date) {
//   if (!date) return 0;
//   var fullYear = date.getFullYear();
//   var diff = date - new Date(fullYear, 0, 0);
//   var oneDay = 1000 * 60 * 60 * 24;
//   var numDays = Math.ceil(diff / oneDay);
//   var numDaysInYear = isLeapYear(fullYear) ? 366 : 365;
//   return numDays / numDaysInYear;
// }
// TODO: 多条线使用数组遍历减少重复代码
function draw(data) {
  var width = 500; // this.$refs.radialChartRef.clientWidth; //- margin.left - margin.right;
  var height = width; //this.$refs.radialChartRef.clientHeight; //˝- margin.top - margin.bottom;
  var lin1Color = "rgb(255, 190, 35)";
  var lin1ColorFill = "rgb(255, 190, 35, 0.3)";
  var lin2Color = "rgb(56, 129, 255)";
  var lin2ColorFill = "rgb(56, 129, 255, 0.4)";

  var svg = d3
    .select("#radial-line-chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var innerRadius = 80; // 内圆半径
  var outerRadius = Math.min(width, height) / 2 - 5; // 外圆半径
  var parseTime = d3.timeParse("%Y-%m-%d");
  var formatMonth = d3.timeFormat("%Y-%m");
  var formatDate = d3.timeFormat("%Y-%m");

  data.line1.forEach(function (data) {
    data.date = parseTime(data.date);
    data.value = +data.value;
  });
  data.line2.forEach(function (data) {
    data.date = parseTime(data.date);
    data.value = +data.value;
  });
  var xExtend = d3.extent([...data.line1.map((d) => d.date), ...data.line2.map((d) => d.date)]);
  var yExtend = d3.extent([...data.line1.map((d) => d.value), ...data.line2.map((d) => d.value)]);
  var fullCircle = 2 * Math.PI;
  var diffAngle = Math.PI / 2; // 坐标轴差90度。 (2 * Math.PI * percentOfYear(xExtend[0])) / 12; //((xExtend[0].getMonth()) / 12) * Math.PI;
  var x = d3.scaleTime().range([0 - diffAngle, fullCircle - diffAngle]); // 0 - 2π 导致 invert 出来的时间不对，需要计算差值
  var y = d3.scaleRadial().range([innerRadius, outerRadius]);

  var lineRadial = d3
    .lineRadial()
    .angle(function (d) {
      return x(d.date);
    })
    .radius(function (d) {
      return y(d.value);
    });

  // console.log(xExtend[0].toLocaleDateString(), xExtend[1].toLocaleDateString());
  x.domain(xExtend); // 设置坐标轴定义域
  // 计算y轴的范围
  yExtend[1] = +yExtend[1] + (+yExtend[1] - +yExtend[0]) * 0.2; // 增加20%的范围 以便显示完整刻度
  y.domain(yExtend); // 设置y轴定义域

  var svgDefs = svg.append("defs");
  // 线1渐变
  var filterBlur1 = svgDefs
    .append("filter")
    .attr("id", "blur1")
    .attr("x", "0")
    .attr("y", "0")
    .append("feGaussianBlur")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", 10);

  var mask1 = svgDefs
    .append("mask")
    .attr("id", "mask1")
    .datum(data.line1)
    .append("path")
    .attr("fill", "#fff")
    .attr("d", lineRadial);
  var linePlot1Blur1 = svg
    .append("path")
    .datum(data.line1)
    .attr("class", "area")
    .attr("stroke-width", 5)
    .attr("filter", "url(#blur1)")
    .attr("mask", "url(#mask1)")
    .attr("class", "line-blur")
    .attr("stroke", lin1ColorFill)
    .attr("fill", "none")
    .attr("d", lineRadial);
  // 线1
  var linePlot1 = svg
    .append("path")
    // .datum(data.line1)
    .data([data.line1]) //this is equivalent to datum(data.line1)
    .attr("class", "area")
    .attr("stroke", lin1Color)
    .attr("fill", "none") // 填充颜色 none表示不填充
    .attr("d", lineRadial);

  // 线2渐变
  var filterBlur2 = svgDefs
    .append("filter")
    .attr("id", "blur2")
    .attr("x", "0")
    .attr("y", "0")
    .append("feGaussianBlur")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", 10);

  var mask2 = svgDefs
    .append("mask")
    .attr("id", "mask2")
    .datum(data.line2)
    .append("path")
    .attr("fill", "#fff")
    .attr("d", lineRadial);
  var linePlot1Blur2 = svg
    .append("path")
    .datum(data.line2)
    .attr("class", "area")
    .attr("stroke-width", 5)
    .attr("filter", "url(#blur2)")
    .attr("mask", "url(#mask2)")
    .attr("class", "line-blur")
    .attr("stroke", lin2ColorFill)
    .attr("fill", "none")
    .attr("d", lineRadial);
  // 线2
  var linePlot2 = svg
    .append("path")
    .datum(data.line2)
    .attr("stroke", lin2Color)
    .attr("fill", "none") //lin2ColorFill
    .attr("d", lineRadial);

  // y轴
  var yAxis = svg.append("g").attr("text-anchor", "middle");
  var yTick = yAxis.selectAll("g").data(y.ticks(3)).enter().append("g"); // y轴刻度
  yTick.append("circle").attr("fill", "none").attr("stroke", "#333").attr("opacity", 0.2).attr("r", y);

  yAxis
    .append("circle")
    .attr("fill", "none") // 填充颜色
    // .attr('stroke', '#999')
    // .attr('opacity', 0.8)
    .attr("r", function () {
      return y(y.domain()[0]);
    }); // 中心圆

  var labels = yTick
    .append("text")
    .attr("y", function (d) {
      return -y(d);
    })
    .attr("dy", "0.35em")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 5)
    .attr("stroke-linejoin", "round")
    .text(function (d) {
      return d;
    }); // y轴文字背景

  yTick
    .append("text")
    .attr("y", function (d) {
      return -y(d);
    })
    .attr("dy", "0.35em")
    .style("font-size", 10)
    .text(function (d) {
      return d;
    }); // y轴文字

  // x轴
  var xTickNum = monthDiff(xExtend[0], xExtend[1]) || 12; // x轴刻度数量
  var xAxis = svg.append("g");
  var xTick = xAxis
    .selectAll("g")
    .data(x.ticks(xTickNum))
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", function (d) {
      return "rotate(" + ((x(d) * 180) / Math.PI - 90) + ")translate(" + (outerRadius - 15) + ",0)";
      // return "rotate(" + ((x(d) * 180) / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
    });

  xTick
    .append("line")
    .attr("x2", -(outerRadius - innerRadius - 14))
    .attr("stroke", "#000")
    .attr("opacity", 0.2); // x轴刻度
  xTick.append("line").attr("x2", 4).attr("stroke", "#000").attr("opacity", 0.2); // x轴刻度

  xTick
    .append("rect")
    .attr("x", 3)
    .attr("y", -24)
    .attr("width", 15)
    .attr("height", 48)
    .attr("fill", "none")
    .attr("stroke", "#AB92F9")
    .attr("rx", "3") // 圆角
    .attr("ry", "3")
    .style("font-size", 10)
    .style("display", function (d) {
      return formatMonth(d) === formatMonth(new Date()) ? "block" : "none";
    }); // x轴文字背景

  xTick
    .append("text")
    .attr("transform", function (d) {
      var angle = x(d);
      return angle < Math.PI / 2 || angle > (Math.PI * 3) / 2
        ? "rotate(90)translate(0, -6)"
        : "rotate(-90)translate(0, 15)";
    })
    .text(function (d) {
      return formatDate(d);
    })
    .style("font-size", function (d) {
      return formatMonth(d) === formatMonth(new Date()) ? 11 : 12;
    })
    .style("fill", function (d) {
      return formatMonth(d) === formatMonth(new Date()) ? "#AB92F9" : "#8F9BB3";
    });
  //.attr('opacity', 0.8); // x轴刻度文字

  // 标题
  var title = svg
    .append("g")
    .append("text")
    .attr("class", "title")
    .attr("dy", "0.4em")
    .attr("text-anchor", "middle")
    .attr("fill", "#333")
    .style("font-family", '"DIN Alternate Bold", Helvetica')
    .style("font-size", 40)
    .style("font-weight", "bold")
    .text("12345");

  // var subtitle = g
  //     .append('text')
  //     .attr('dy', '1.6em')
  //     .attr('text-anchor', 'middle')
  //     .attr('opacity', 0.6)
  //     .style('font-family', 'none')
  //     .text('安全事件');

  // 动画
  var lineLength1 = linePlot1.node().getTotalLength();
  linePlot1
    .attr("stroke-dasharray", lineLength1 + " " + lineLength1)
    .attr("stroke-dashoffset", -lineLength1)
    .transition()
    .style("background-color", "red")
    .duration(3000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  var lineLength2 = linePlot2.node().getTotalLength();
  linePlot2
    .attr("stroke-dasharray", lineLength2 + " " + lineLength2)
    .attr("stroke-dashoffset", lineLength2)
    .transition()
    .duration(3000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);
  // tooltip 鼠标事件捕获层
  svg
    .append("circle")
    .style("fill", "none")
    .style("pointer-events", "all")
    .style("cursor", "pointer")
    .attr("r", outerRadius)
    // .call(zoom)
    // .on("mouseover", () => tooltipG.style("display", null))
    // .on("mouseout", () => tooltipG.style("display", "none"))
    .on("mousemove", mousemove);
  const tooltipG = svg.append("g"); //.style("display", "none"); // 创建一个 tooltip 容器
  // 圆点 交点
  tooltipG
    .append("circle")
    .attr("class", "tooltip" + 1) // 添加 class 用于调整位置
    .style("fill", "#fff")
    .style("stroke", "red")
    .style("stroke-width", 2)
    .attr("r", 4);
  // x 提示线
  tooltipG
    .append("line")
    .attr("class", "tooltip-x" + 1)
    .attr("x1", 0)
    .attr("y2", 0)
    .attr("x2", 0)
    .attr("y2", outerRadius)
    .attr("stroke", "#333")
    .attr("stroke-width", "1px")
    .style("stroke-dasharray", "5,5"); //dashed array for line
  // y 提示线
  tooltipG
    .append("circle")
    .style("fill", "none")
    .attr("class", "tooltip-y" + 1)
    .attr("stroke", "#333") // 设置线条颜色
    .attr("stroke-width", "1px")
    .style("stroke-dasharray", "5,5")
    .attr("r", innerRadius); //dashed array for line
  // //矩形
  // // tooltipG
  // //   .append("rect")
  // //   .attr("class", "tooltip" + i)
  // //   .attr("rx", "3") // 圆角
  // //   .attr("ry", "3") // 圆角
  // //   .style("fill", "#fff")
  // //   .style("filter", "drop-shadow(0 0 5px rgba(3, 3, 3, 0.15))")
  // //   .attr("width", tooltipWidth)
  // //   .attr("height", tooltipHeight);
  // 文字背景 原理是画一个粗笔的文字作为背景放在文字后面
  tooltipG
    .append("text")
    .attr("class", "tooltip-text-back" + 1)
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
    .attr("class", "tooltip" + 1)
    .attr("dy", "0.4em")
    // .attr('text-anchor', 'middle')
    .attr("dx", "1em")
    .style("font-family", "Arial")
    // .style('text-shadow','1px 1px 1px #333')
    .style("font-size", "12px")
    .style("fill", "#333");

  const bisectDate = d3.bisector((d) => d.date).left;
  // 两个误差：1 比例尺要根据起始日期计算 range 值域，否则 invert 出来的日期不对 2 坐标轴差 90度
  function mousemove(event) {
    const point = d3.pointer(event, this); // Math.atan2(point[0], point[1])
    let radian = 0;
    radian = Math.atan2(point[1], point[0]);
    var x0 = x.invert(radian + Math.PI / 2); // 通过鼠标位置像素值获取鼠标点击位置的x坐标数据值 极坐标需要转换成角度
    const index = bisectDate(data.line1, x0, 1);
    const d0 = data.line1[index - 1]; // 获取鼠标位左侧的数据
    const d1 = data.line1[index]; // 获取鼠标点击位置的数据
    let d;
    d0 && d1 && (d = x0 - d0.date > d1.date - x0 ? d1 : d0); // 获取离鼠标位置近的的数据
    // const display = d && activeStatus[item.key] ? null : "none"; // 如果没有数据，则隐藏 tooltip
    // console.log(index, x0.toLocaleDateString());
    console.log(x0.toLocaleDateString());
    tooltipG
      .select("circle.tooltip" + 1)
      .transition()
      .duration(100)
      .attr(
        "transform",
        "rotate(" + ((x(d.date) * 180) / Math.PI - 90) + ")translate(" + y(d.value) + ",0)"
      );
    tooltipG
      .select("text.tooltip-text-back" + 1) // 文字背景
      .transition()
      .duration(100)
      .text(d.value) // 文字
      .attr("transform", () => {
        console.log(x(d.date));
        var deg = (x(d.date) * 180) / Math.PI - 90;
        var rx = y(d.value);
        var pointX = x(d.date);
        if (pointX < 0 || pointX > 3.14) {
          deg = deg + 180;
          rx = -rx;
        }
        return "rotate(" + deg + ")translate(" + rx + ",0)";
      }); // 文字方向调整
    tooltipG
      .select("text.tooltip" + 1)
      .transition()
      .duration(100)
      .text(d.value)
      .attr("transform", () => {
        console.log(x(d.date));
        var deg = (x(d.date) * 180) / Math.PI - 90;
        var rx = y(d.value);
        var pointX = x(d.date);
        if (pointX < 0 || pointX > 3.14) {
          deg = deg + 180;
          rx = -rx;
        }
        return "rotate(" + deg + ")translate(" + rx + ",0)";
      }); // 文字方向调整
    // "translate(" + x(d.date) + "," + y(d.value) + ")");
    tooltipG
      .select("line.tooltip-x" + 1)
      .transition()
      .duration(100)
      .attr("transform", "rotate(" + ((x(d.date) * 180) / Math.PI + 180) + ")");
    tooltipG
      .select("circle.tooltip-y" + 1)
      .transition()
      .duration(100)
      .attr("r", y(d.value)); //选择设置半径，视图自动更新
  }
}
// d3.select(".title").text("更新text");
// Prep the tooltip bits, initial display is hidden
d3.json("data2.json").then((data) => {
  data.line1 = data.line1.sort((a, b) => (a.date - b.date ? 1 : -1));
  data.line2 = data.line2.sort((a, b) => (a.date - b.date ? 1 : -1));
  draw(data);
});
