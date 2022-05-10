const inputs = {
  id: "",
  width: 940,
  height: 450,
  dimension: "date",
  metric: "index",
  title: "Test Title",
  color: "red",
  xAxisHidden: true,
  yAxisHidden: false,
  nonzeroMinY: true,
  mark: "2020-03-18",
  markText: "COVID-19",
  mouseover: true,
  indicator: true,
};
const autoWidth = 1152;
const width = inputs.width == "auto" ? autoWidth : inputs.width;
const height = inputs.height;
const dimension = inputs.dimension;
const metric = inputs.metric;
const title = inputs.title;
const color = inputs.color;
const xAxisHidden = inputs.xAxisHidden;
const yAxisHidden = inputs.yAxisHidden;
const mark = inputs.mark;
const markText = inputs.markText;
const mouseover = inputs.mouseover;
const indicator = inputs.indicator;

const minY = inputs.nonzeroMinY ? d3.min(data, d => d[inputs.metric]) : 0
//   data
const minValue = d3.min(data, (d) => d[metric]);
const maxValue = d3.max(data, (d) => d[metric]);
const maxValueX = data.filter((obj) => obj[metric] === maxValue)[0][dimension];
const minX = d3.min(data, (d) => d[dimension]);
const maxX = d3.max(data, (d) => d[dimension]);
// const maxX = maxDateInput ? new Date(maxDateInput) : d3.max(data, function(d) { return d.date; });
//   ____

const margin = { top: 6, right: 20, bottom: 15, left: 50 };
if (xAxisHidden) {
  margin.bottom = 10;
}
if (yAxisHidden) {
  margin.left = 10;
}
// if (sparkline) {
//   margin.top = 10;
//   margin.right = 20;
//   margin.bottom = 0;
//   margin.left = 0;
// }

const x = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => d[dimension]))
  .range([margin.left, inputs.width - margin.right]);

const y = d3
  .scaleLinear()
  .domain([minY, d3.max(data, (d) => d[metric])])
  .nice()
  .range([height - margin.bottom, margin.top]);

const svg = d3
  .create("svg")
  .attr("class", "line")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const lg = svg
  .append("defs")
  .append("linearGradient") // linear gradient
  .attr("id", "mygrad")
  .attr("x1", "0%")
  .attr("x2", "0%")
  .attr("y1", "0%")
  .attr("y2", "100%");
lg.append("stop").attr("offset", "0%").style("stop-color", color).style("stop-opacity", 0.15);
lg.append("stop").attr("offset", "100%").style("stop-color", color).style("stop-opacity", 0.01);

const area = d3
  .area()
  .curve(d3.curveCardinal.tension(0.95))
  .defined(function (d) {
    return d[metric] >= 0;
  })
  .x(function (d) {
    return x(d[dimension]);
  })
  .y0(height - margin.bottom)
  .y1(function (d) {
    return y(d[metric]);
  });

const line = d3
  .line()
  .defined((d) => !isNaN(d[metric]))
  .x((d) => x(d[dimension]))
  .y((d) => y(d[metric]));

if (!xAxisHidden) {
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%_m-%d")))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.6em")
    .attr("dy", ".5em")
    .attr("transform", "rotate(-45)");
}

if (!yAxisHidden) {
  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ", 0)")
    .call(
      d3.axisLeft(y).tickFormat((d) => {
        if (d < 10) {
          return d3.format(".2f")(d);
        } else if (d > 999999) {
          return d3.format(".3s")(d).replace("G", "B");
        } else {
          return d3.format(",")(d);
        }
      })
    )
    .selectAll("text")
    .attr("dx", "-5");
}

svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", color)
  .attr("stroke-width", 1.5)
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("d", line);

svg.append("path").datum(data).style("fill", "url(#mygrad)").style("stroke", "none").attr("d", area);

if (indicator) {
  svg
    .append("line")
    .attr("x1", x(maxValueX))
    .attr("x2", width - margin.right)
    .attr("y1", y(maxValue))
    .attr("y2", y(maxValue))
    .style("stroke", "#333")
    .style("stroke-width", "1px")
    .style("stroke-dasharray", "3 3");

  svg
    .append("text")
    .attr("id", "max-indicator")
    .attr("x", width - margin.right + 5)
    .attr("y", function () {
      return 4 + y(maxValue);
    })
    .style("fill", "#333")
    .style("font-size", "11px")
    .text(() => {
      return maxValue < 10 ? d3.format(".2")(maxValue) : d3.format(".3s")(maxValue).replace("G", "B");
    });
}

if (mark) {
  svg
    .append("rect")
    .classed("y", true)
    .attr("x", x(moment(mark)) - 1)
    .attr("y", y(0) - 2 * margin.bottom - 20)
    .attr("width", 2)
    .attr("height", 30)
    .style("fill", "black");
  if (markText) {
    svg
      .append("text")
      .attr("x", x(moment(mark)) + 5)
      .attr("y", y(0) - 2 * margin.bottom - 10)
      .text(markText);
  }
}

if (title) {
  svg
    .append("text")
    .attr("x", margin.left + 4)
    .attr("y", margin.top + 4)
    .attr("text-anchor", "start")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text(title);
}

const focus = svg.append("g").attr("class", "focus").style("display", "none");

focus.append("circle").attr("r", 2);
focus
  .append("rect")
  .attr("x", -24)
  .attr("y", -22)
  .attr("width", 48)
  .attr("height", 18)
  .style("fill", "#F2F3F4");
focus.append("text").attr("y", -12).attr("dy", ".35em").style("text-anchor", "middle");

if (mouseover) {
  svg
    .append("rect")
    .attr("class", "overlay")
    .attr("x", margin.left)
    .attr("width", width - margin.right - 1)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", () => focus.style("display", null))
    .on("mouseout", () => focus.style("display", "none"))
    .on("mousemove", mousemove);
}

const bisectDate = d3.bisector((d) => d.date).left;

function mousemove() {
  const x0 = x.invert(d3.mouse(this)[0]);
  const i = bisectDate(data, x0, 1);
  const d0 = data[i - 1];
  const d1 = data[i];
  if (d0 && d1) {
    const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", `translate(${x(d.date)}, ${y(d[metric])})`);

    if (maxValue > 999) {
      focus.select("text").text(d3.format(".3s")(d[metric]).replace("G", "B"));
    } else if (maxValue < 10) {
      focus.select("text").text(d3.format(".2")(d[metric]));
    } else {
      focus.select("text").text(d3.format(",.1f")(d[metric]));
    }
  }
}
