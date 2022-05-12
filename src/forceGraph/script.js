const dataSet = {
  nodes: [
    // 组件名称，标签简称、全称，运行时间等
    { id: 1, name: "AGGR", label: "Aggregation", group: "Team C", runtime: 20 },
    { id: 2, name: "ASMT", label: "Assessment Repository", group: "Team A", runtime: 20 },
    { id: 3, name: "CALC", label: "Final Calc", group: "Team C", runtime: 20 },
    { id: 4, name: "DEMO", label: "Demographic", group: "Team B", runtime: 20 },
    { id: 5, name: "ELIG", label: "Eligibility", group: "Team B", runtime: 20 },
    { id: 6, name: "GOAL", label: "Goal Setting", group: "Team C", runtime: 20 },
    { id: 7, name: "GROW", label: "Growth Model", group: "Team C", runtime: 20 },
    { id: 8, name: "LINK", label: "Linkage", group: "Team A", runtime: 20 },
    { id: 9, name: "MOSL", label: "MOSL", group: "Team A", runtime: 20 },
    { id: 10, name: "MOTP", label: "MOTP", group: "Team A", runtime: 20 },
    { id: 11, name: "REPT", label: "Reporting", group: "Team E", runtime: 20 },
    { id: 12, name: "SEDD", label: "State Data", group: "Team A", runtime: 20 },
    { id: 13, name: "SNAP", label: "Snapshot", group: "Team A", runtime: 20 },
    { id: 10000, name: "freedom", label: "Snapshot", group: "Team A", runtime: 20 },
  ],
  links: [
    { source: 1, target: 3, type: "Next -->" },
    { source: 1, target: 2, type: "Next -->" },
    { source: 6, target: 1, type: "Next -->" },
    { source: 7, target: 1, type: "Next -->" },
    { source: 9, target: 1, type: "Next -->" },
    { source: 2, target: 4, type: "Next -->" },
    { source: 2, target: 6, type: "Next -->" },
    { source: 2, target: 7, type: "Next -->" },
    { source: 2, target: 8, type: "Next -->" },
    { source: 2, target: 9, type: "Next -->" },
    { source: 10, target: 3, type: "Next -->" },
    { source: 3, target: 11, type: "Next -->" },
    { source: 8, target: 5, type: "Go to ->" },
    { source: 8, target: 11, type: "Go to ->" },
    { source: 6, target: 9, type: "Go to ->" },
    { source: 7, target: 9, type: "Go to ->" },
    { source: 8, target: 9, type: "Go to ->" },
    { source: 9, target: 11, type: "Go to ->" },
    { source: 12, target: 9, type: "Go to ->" },
    { source: 13, target: 11, type: "Go to ->" },
    { source: 13, target: 2, type: "Go to ->" },
    { source: 13, target: 4, type: "This way>>" },
    { source: 13, target: 5, type: "This way>>" },
    { source: 13, target: 8, type: "This way>>" },
    { source: 13, target: 9, type: "This way>>" },
    { source: 13, target: 10, type: "This way>>" },
    { source: 4, target: 7, type: "Next -->" },
    { source: 10, target: 5, type: "Next -->" },
    { source: 4, target: 2, type: "Next -->" },
    { source: 5, target: 3, type: "Next -->" },
  ],
};

function render(dataSet) {
  const width = 890;
  const height = 500;
  const nodeRadius = 17;
  const lineOpacity = 0.5;

  const colorScale = buildColorScale(dataSet);

  //create a simulation for an array of nodes, and compose the desired forces.
  const simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3
        .forceLink() // This force provides links between nodes
        .id((d) => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
        .distance(120)
    )
    .force("charge", d3.forceManyBody().strength(-500)) // This adds repulsion (if it's negative) between nodes.
    .force("center", d3.forceCenter(width / 2, height / 2 + 10)); // 调整在画布中的位置 This force attracts nodes to the center of the svg area

  const svg = d3.select("#force-graph").append("svg").attr("viewBox", [0, 0, width, height]);
  // 分组 g1 画主要的图形，g2 画辅助的图形，分组后便与做放大平移等
  const g1 = svg.append("g").attr("cursor", "grab");
  const g2 = svg.append("g");

  const zoom = d3.zoom().scaleExtent([-20, 20]).on("zoom", zoomed); // 取消双击放大;
  function zoomed({ transform }) {
    g1.attr("transform", transform);
  }

  svg.call(zoom).on("dblclick.zoom", null);

  // const subgraphWidth = (width * 2) / 8;
  // const subgraphHeight = (height * 1) / 5;

  const subgraph = svg.append("g").attr("id", "subgraph");
  // .attr("transform", `translate(${width - subgraphWidth - 20}, 0)`);

  subgraph.append("text").attr("y", 15).style("font-size", "16px"); //  选中的组件名称

  // 标题：机器人组件 灰色边框表示运行时长
  g2.append("text")
    .text("Robot Components") // title
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", 30)
    .style("font-size", "18px");

  //appending little triangles, path object, as arrowhead
  //The <defs> element is used to store graphical objects that will be used at a later time
  //The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers on a given <path>, <line>, <polyline> or <polygon> element.
  // 箭头
  g1.append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10") //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
    .attr("refX", 26) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#999")
    .style("stroke", "none");

  // console.log("dataSet is ...", dataSet);

  // Initialize the links 连接线
  const link = g1
    .selectAll(".links")
    .data(dataSet.links)
    .enter()
    .append("line")
    .attr("class", "links")
    .attr("stroke", "#999")
    .attr("stroke-width", "2px")
    .style("opacity", lineOpacity)
    .attr("id", (d) => "line" + d.source + d.target)
    .attr("class", "links")
    .attr("marker-end", "url(#arrowhead)"); //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.

  //The <title> element provides an accessible, short-text description of any SVG container element or graphics element.
  //Text in a <title> element is not rendered as part of the graphic, but browsers usually display it as a tooltip.
  link.append("title").text((d) => d.type);

  // 连线的文字
  const edgepaths = g1
    .selectAll(".edgepath") //make path go along with the link provide position for link labels
    .data(dataSet.links)
    .enter()
    .append("path")
    .attr("class", "edgepath")
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .attr("id", function (d, i) {
      return "edgepath" + i;
    })
    .style("pointer-events", "none");

  const edgelabels = g1
    .selectAll(".edgelabel")
    .data(dataSet.links)
    .enter()
    .append("text")
    .style("pointer-events", "none")
    .attr("class", "edgelabel")
    .attr("id", function (d, i) {
      return "edgelabel" + i;
    })
    .attr("font-size", 10)
    .attr("fill", "#aaa")
    .attr("dy", "-0.3em");

  edgelabels
    .append("textPath") //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
    .attr("xlink:href", function (d, i) {
      return "#edgepath" + i;
    })
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text((d) => d.type);

  // Initialize the nodes
  const node = g1.selectAll(".nodes").data(dataSet.nodes).enter().append("g").attr("class", "nodes");

  node.call(
    d3
      .drag() //sets the event listener for the specified typenames and returns the drag behavior.
      .on("start", dragStarted) //start - after a new pointer becomes active (on mousedown or touchstart).
      .on("drag", dragged) //drag - after an active pointer moves (on mousemove or touchmove).
      // 不加 end 的话，拖动后 cpu 占用率高
      .on("end", dragEnded) //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
  );
  // 节点绘制
  node
    .append("circle")
    .attr("r", (d) => nodeRadius) //+ d.runtime/20 ) //radius of the circle
    .attr("id", (d) => "circle" + d.id)
    .style("stroke", "grey")
    .style("stroke-opacity", 0.3)
    .style("stroke-width", (d) => d.runtime / 10)
    .style("fill", (d) => colorScale(d.group));

  node
    .append("title")
    .text((d) => d.id + ": " + d.label + " - " + d.group + ", runtime:" + d.runtime + "min");
  // 节点 name
  node
    .append("text")
    .attr("dy", 4)
    .text((d) => d.name)
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("pointer-events", "none");
  // 节点 runtime
  node
    .append("text")
    .attr("dy", 12)
    .style("text-anchor", "middle")
    .style("font-size", "8px")
    .text((d) => d.runtime)
    .style("pointer-events", "none");

  // 建立邻居字典
  var neighborTarget = {};
  for (var i = 0; i < dataSet.nodes.length; i++) {
    var id = dataSet.nodes[i].id;
    neighborTarget[id] = dataSet.links
      .filter(function (d) {
        return d.source == id; // source
      })
      .map(function (d) {
        return d.target;
      });
  }
  console.log("neighborTarget is ", neighborTarget);

  var neighborSource = {};
  for (var i = 0; i < dataSet.nodes.length; i++) {
    var id = dataSet.nodes[i].id;
    neighborSource[id] = dataSet.links
      .filter(function (d) {
        return d.target == id; // target
      })
      .map(function (d) {
        return d.source;
      });
  }

  console.log("neighborSource is ", neighborSource);

  // 非邻居字典
  // var nonNeighbor = {};
  // for (var i = 0; i < dataSet.nodes.length; i++) {
  //   var id = dataSet.nodes[i].id;
  //   nonNeighbor[id] = dataSet.nodes
  //     .filter(
  //       (d) => !neighborSource[id].includes(d.id) && !neighborTarget[id].includes(d.id) && d.id != id
  //     )
  //     .map((d) => d.id);
  // }
  // console.log("nonNeighbor is ", nonNeighbor);

  // 节点事件：点击高亮，鼠标悬浮隐藏非邻居节点，鼠标离开显示所有节点
  node
    .selectAll("circle")
    .on("click", function (e, d) {
      var active = d.active ? false : true, // toggle whether node is active
        newStroke = active ? "yellow" : "grey",
        newStrokeIn = active ? "green" : "grey",
        newStrokeOut = active ? "red" : "grey",
        newOpacity = active ? 0.6 : 0.3,
        subgraphOpacity = active ? 0.9 : 0;
      // 选中节点详情
      subgraph
        .selectAll("text")
        .text("Selected: " + d.label)
        .attr("dy", 14)
        .attr("dx", 14);

      //extract node's id and ids of its neighbors
      var id = d.id,
        neighborS = neighborSource[id],
        neighborT = neighborTarget[id];
      console.log("neighbors is from ", neighborS, " to ", neighborT);
      g1.selectAll("#circle" + id).style("stroke-opacity", newOpacity);
      g1.selectAll("#circle" + id).style("stroke", newStroke);
      g1.selectAll("#subgraph").style("opacity", subgraphOpacity);
      //highlight the current node and its neighbors
      for (var i = 0; i < neighborS.length; i++) {
        g1.selectAll("#line" + neighborS[i] + id).style("stroke", newStrokeIn);
        g1.selectAll("#circle" + neighborS[i])
          .style("stroke-opacity", newOpacity)
          .style("stroke", newStrokeIn);
      }
      for (var i = 0; i < neighborT.length; i++) {
        g1.selectAll("#line" + id + neighborT[i]).style("stroke", newStrokeOut);
        g1.selectAll("#circle" + neighborT[i])
          .style("stroke-opacity", newOpacity)
          .style("stroke", newStrokeOut);
      }
      //update whether or not the node is active
      d.active = active;
    })
    .on("mouseover", function (e, d) {
      g1.selectAll("circle").style("opacity", 0.2);
      g1.selectAll("line").style("opacity", 0.2);
      var id = d.id,
        neighborS = neighborSource[id],
        neighborT = neighborTarget[id];

      //highlight the current node and its neighbors
      g1.selectAll("#circle" + id).style("opacity", 1);

      for (var i = 0; i < neighborS.length; i++) {
        g1.selectAll("#line" + neighborS[i] + id).style("opacity", 1);
        g1.selectAll("#circle" + neighborS[i]).style("opacity", 1);
      }
      for (var i = 0; i < neighborT.length; i++) {
        g1.selectAll("#circle" + neighborT[i]).style("opacity", 1);
        g1.selectAll("#line" + id + neighborT[i]).style("opacity", 1);
      }
    })
    .on("mouseout", function (e, d) {
      g1.selectAll("circle").style("opacity", 1);
      g1.selectAll("line").style("opacity", lineOpacity);
    });

  //Listen for tick events to render the nodes as they update in your Canvas or SVG.
  simulation.nodes(dataSet.nodes).on("tick", ticked);

  simulation.force("link").links(dataSet.links);

  // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node
      .attr("cx", function (d) {
        return (d.x = Math.max(nodeRadius, Math.min(width - nodeRadius, d.x))); // 限制节点的绘制范围
      })
      .attr("cy", function (d) {
        return (d.y = Math.max(nodeRadius, Math.min(height - nodeRadius, d.y)));
      })
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    edgepaths.attr(
      "d",
      (d) => "M " + d.source.x + " " + d.source.y + " L " + d.target.x + " " + d.target.y
    );
  }

  //When the drag gesture starts, the targeted node is fixed to the pointer
  //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
  function dragStarted(event, d) {
    // debugger
    if (!event.active) simulation.alphaTarget(0.3).restart(); // 设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0, 1] sets the current target alpha to the specified number in the range [0,1].
    d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
    d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
  }

  //When the drag gesture starts, the targeted node is fixed to the pointer
  function dragged(event, d) {
    d.fx = Math.max(nodeRadius, Math.min(width - nodeRadius, event.x)); // 限制节点的拖拽范围
    d.fy = Math.max(nodeRadius, Math.min(height - nodeRadius, event.y));
  }
  //When the drag gesture ends, the targeted node is released and the simulation is re-heated.
  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // 构建颜色比例尺
  function buildColorScale(data) {
    var temp = {};
    var colors = ["#ff9e6d", "#86cbff", "#c2e5a0", "#fff686", "#9e79db"];
    data.nodes.forEach(function (item) {
      temp[item.group] = colors[item.group];
    });
    var domain = Object.keys(temp);
    var range = domain.map(function (item, i) {
      return colors[i] || "#" + ((Math.random() * 0xffffff) << 0).toString(16); // 随机颜色
    });
    return d3
      .scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
      .domain(domain) // 分类域 || ['A', 'B', 'C', 'D', 'E']
      .range(range); // 颜色
  }

  //绘制 legend
  const legend_g = g2
    .selectAll(".legend")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${width - 80},${i * 20 + 20})`);

  legend_g.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 5).attr("fill", colorScale);

  legend_g
    .append("text")
    .attr("x", 10)
    .attr("y", 5)
    .style("font-size", "10px")
    .text((d) => d);

  //drawing the second legend
  const legend_g2 = g2.append("g").attr("transform", `translate(${width - 80}, 140)`);

  legend_g2
    .append("circle")
    .attr("r", 5)
    .attr("cx", 0)
    .attr("cy", 0)
    .style("stroke", "grey")
    .style("stroke-opacity", 0.3)
    .style("stroke-width", 15)
    .style("fill", "black");
  legend_g2.append("text").attr("x", 15).attr("y", 0).text("long runtime").style("font-size", "10px");

  legend_g2
    .append("circle")
    .attr("r", 5)
    .attr("cx", 0)
    .attr("cy", 20)
    .style("stroke", "grey")
    .style("stroke-opacity", 0.3)
    .style("stroke-width", 2)
    .style("fill", "black");
  legend_g2.append("text").attr("x", 15).attr("y", 20).text("short runtime").style("font-size", "10px");
}

render(dataSet);
// TODO:搜索节点高亮，聚焦
// 重绘
// setTimeout(() => {
//   d3.select("#force-graph").selectAll("*").remove(); //清空SVG中的内容
//   render(dataset2);
// }, 3000);

document.querySelector("#download-btn").addEventListener("click", download);
// 下载 svg
function download() {
  var svgData = document.querySelector("svg");
  var serializer = new XMLSerializer();
  svgData = serializer.serializeToString(svgData);
  //add xml declaration
  svgData = '<?xml version="1.0" standalone="no"?>\r\n' + svgData;
  //convert svg source to URI data scheme.
  // var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = new Date().toLocaleDateString() + ".svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

//add name spaces. serializeToString 会添加 namespace
// if (!svgData.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
//   svgData = svgData.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
// }
// if (!svgData.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
//   svgData = svgData.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
// }
