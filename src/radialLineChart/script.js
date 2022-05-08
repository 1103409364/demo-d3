var width = 500; //- margin.left - margin.right;
var height = 500; //˝- margin.top - margin.bottom;

var svg = d3
  .select("#radial-line-chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height])
  .append("g");

var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var innerRadius = 80; // 内圆半径
var outerRadius = Math.min(width, height) / 2 - 5; // 外圆半径
var parseTime = d3.timeParse("%d-%m-%y");
var formatMonth = d3.timeFormat("%m");
var fullCircle = 2 * Math.PI;

var x = d3.scaleTime().range([0, fullCircle]);
var y = d3.scaleRadial().range([innerRadius, outerRadius]);

var lineRadial = d3
  .lineRadial()
  .angle((d) => x(d.date))
  .radius((d) => y(d.value));

d3.json("data2.json").then((data) => {
  data.line1.forEach((data) => (data.date = parseTime(data.date)), (data.value = +data.value));
  data.line2.forEach((data) => (data.date = parseTime(data.date)), (data.value = +data.value));
  x.domain(d3.extent(data.line1, (d) => d.date)); // 设置x轴的范围
  const extend = [...d3.extent(data.line1, (d) => d.value), ...d3.extent(data.line2, (d) => d.value)];
  extend[1] = +extend[1] + (+extend[1] - +extend[0]) * 0.2;
  y.domain(d3.extent(extend)); // y轴的范围

  // 线1
  var linePlot1 = g
    .append("path")
    // .datum(data.line1)
    .data([data.line1]) //this is equivalent to datum(data.line1)
    .attr("class", "area")
    .attr("fill", "rgb(255 0 0 / 18%)") // 填充颜色 none表示不填充
    .attr("stroke", "red")
    .attr("d", lineRadial);
  // 线2
  var linePlot2 = g
    .append("path")
    .datum(data.line2)
    .attr("fill", "rgb(0 0 255 / 18%)")
    .attr("stroke", "blue")
    .attr("d", lineRadial);

  // x轴
  var xAxis = g.append("g");
  var xTick = xAxis
    .selectAll("g")
    .data(x.ticks(12))
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", function (d) {
      return "rotate(" + ((x(d) * 180) / Math.PI - 90) + ")translate(" + (outerRadius - 15) + ",0)";
      // return "rotate(" + ((x(d) * 180) / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
    });

  // xTick.append("line").attr("x2", -(outerRadius - innerRadius - 14)).attr("stroke", "#000").attr("opacity", 0.2); // x轴刻度
  xTick.append("line").attr("x2", -4).attr("stroke", "#000").attr("opacity", 0.2); // x轴刻度

  xTick
    .append("rect")
    .attr("x", 2)
    .attr("y", -15)
    .attr("width", 15)
    .attr("height", 30)
    .attr("fill", "#0f9960")
    .attr("rx", "3")
    .attr("ry", "3")
    .style("font-size", 10)
    .style("display", function (d) {
      return +formatMonth(d) === 10 ? "block" : "none";
    }); // x轴文字背景

  xTick
    .append("text")
    .attr("transform", function (d) {
      var angle = x(d);
      return angle < Math.PI / 2 || angle > (Math.PI * 3) / 2
        ? "rotate(90)translate(0, -5)"
        : "rotate(-90)translate(0, 13)";
    })
    .text(function (d) {
      return formatMonth(d) + "月";
    })
    .style("font-size", function (d) {
      if (+formatMonth(d) === 10) {
        return 11;
      } else {
        return 12;
      }
    })
    .style("fill", function (d) {
      return +formatMonth(d) === 10 ? "#fff" : "#000";
    })
    .attr("opacity", 0.6); // x轴刻度文字

  // y轴
  var yAxis = g.append("g").attr("text-anchor", "middle");
  var yTick = yAxis.selectAll("g").data(y.ticks(5)).enter().append("g"); // y轴刻度
  yTick.append("circle").attr("fill", "none").attr("stroke", "black").attr("opacity", 0.2).attr("r", y);

  yAxis
    .append("circle")
    .attr("fill", "#fff") // 填充颜色
    .attr("stroke", "black")
    .attr("opacity", 0.8)
    .attr("r", function () {
      return y(y.domain()[0]);
    });

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

  // 标题
  var title = g
    .append("g")
    .append("text")
    .attr("class", "title")
    .attr("dy", "0em")
    .attr("text-anchor", "middle")
    .style("font-family", "none")
    .style("font-size", 30)
    .text("12345");
  
  var subtitle = g
    .append("text")
    .attr("dy", "1.6em")
    .attr("text-anchor", "middle")
    .attr("opacity", 0.6)
    .style("font-family", "none")
    .text("安全事件");

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
});
// d3.select(".title").text("更新text");
// Prep the tooltip bits, initial display is hidden
