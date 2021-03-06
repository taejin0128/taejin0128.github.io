var checkClick = 1;
var chartWidth = 550;
var chartHeight = 550;
var xscale = d3.scale.linear().range([0, chartWidth]);
var yscale = d3.scale.linear().range([0, chartHeight]);
var color = d3.scale.category20();
var headerHeight = 20;
var headerColor = "#555555";
var transitionDuration = 500;
var root;
var node;

var csvLink = "https://hivelab.org/static/coffee.csv";
var coffeeTree;  

var treemap = d3.layout.treemap()
    //.round(false)
    .size([chartWidth, chartHeight])
    .sticky(true)
    .value(function(d) { return d.size; });

var chart = d3.select("#body")
    .append("svg:svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .append("svg:g");
    

d3.csv(csvLink, function(data) {

    coffeeTree = d3.nest()
        .key(function(d) { if (d.date === "1/1/2010" ) { return "January"; } }) 
        .key(function(d) {return d.region; })                    
        .key(function(d) {return d.state; })
        //.key(function(d) {return d.type; })
        .entries(data);

    //var root = {};
    //root.key = "Hi";
    //root.values = coffeeTree;

    var temp = coffeeTree[0];

    var root = reSortRoot(temp, "sales", "type");
    
    console.log(root);

    node = root;// = data;

    var nodes = treemap.nodes(root);

    
    var children = nodes.filter(function(d) {
        //console.log(!d.children);
        return !d.children;
    });
    
    
    var parents = nodes.filter(function(d) {
        return d.children;
    });

    //console.log(tempchildren)
    // Create parent cells
    var parentCells = chart.selectAll("g.cell.parent")
        .data(parents, function(d) { return d.name; }); //"p-" + d.name; });
    
    var parentEnterTransition = parentCells.enter()
        .append("g")
        .attr("class", "cell parent")
        .on("click", function(d) { 
            checkClick = 0; 
            zoom(d); 
        });            
        parentEnterTransition.append("rect")
        .attr("width", function(d) { return Math.max(0.01, d.dx); })
        .attr("height", headerHeight)
        .style("fill", headerColor);           
        parentEnterTransition.append("foreignObject").attr("class", "foreignObject")
        .append("xhtml:body").attr("class", "labelbody")
        .append("div").attr("class", "label");
    
    /* Update transition
    var parentUpdateTransition = parentCells.transition().duration(transitionDuration);
    parentUpdateTransition.select(".cell")
        .attr("transform", function(d) { return "translate(" + d.dx + "," + d.y + ")"; });
    parentUpdateTransition.select("rect")
        .attr("width", function(d) { return Math.max(0.01, d.dx); })
        .attr("height", headerHeight)
        .style("fill", headerColor);
    parentUpdateTransition.select(".foreignObject")
        .attr("width", function(d) { return Math.max(0.01, d.dx); })
        .attr("height", headerHeight)
        .select(".labelbody .label")
        .text(function(d) { return d.name; });
    
    // Remove transition
    parentCells.exit().remove();*/

    // Create children cells
    var childrenCells = chart.selectAll("g.cell.child")
        .data(children, function(d) { return d.state + d.name; }); //"c-" + d.name; });
    
    // Enter transition
    var childEnterTransition = childrenCells.enter()
        .append("g")
        .attr("class", "cell child")
        .on("click", function(d) {          
            //console.log("location")
            checkClick = 0; 
            zoom(node === d.parent ? root : d.parent); 
        });
    childEnterTransition.append("rect")
        .classed("background", true)
        //각 Parent 구간의 색깔 할당 (같은 이름은 같은 색)
        .style("fill", function(d) { return color(d.parent.name); });
    childEnterTransition.append('foreignObject')
        .attr("class", "foreignObject")
        .attr("width", function(d) { return Math.max(0.01, d.dx); })
        .attr("height", function(d) { return Math.max(0.01, d.dy); })
        .append("xhtml:body")
        .attr("class", "labelbody")
        .append("div")
        .attr("class", "label")   //최종 Child의 이름 표
        .text(function(d) { return d.name; }); 

    /*if (supportsForeignObject) {
        childEnterTransition.selectAll(".foreignObject")
            .style("display", "none");
    } else {
        childEnterTransition.selectAll(".foreignObject .labelbody .label")
            .style("display", "none");
    }*/

    if (checkClick) {
        checkClick = 0;
        childEnterTransition.selectAll(".foreignObject").style("display", "none");
    } else {
        checkClick = 1;
        childEnterTransition.selectAll(".foreignObject .labelbody .label").style("display", "none");
    }

    // Update transition
    var childUpdateTransition = childrenCells.transition().duration(transitionDuration);
    childUpdateTransition.select(".cell")
        .attr("transform", function(d) { return "translate(" + d.x  + "," + d.y + ")"; });
    childUpdateTransition.select("rect")
        .attr("width", function(d) { return Math.max(0.01, d.dx); })
        .attr("height", function(d) { return d.dy; })
        .style("fill", function(d) { return color(d.parent.name); });
    childUpdateTransition.select(".foreignObject")
        .attr("width", function(d) { return Math.max(0.01, d.dx); })
        .attr("height", function(d) { return Math.max(0.01, d.dy); })
        .select(".labelbody .label")
        .text(function(d) { return d.name; });
    
    // exit transition
    childrenCells.exit().remove();

    d3.select("select").on("change", function() {
        //console.log("select zoom(node)");
        //treemap.value(this.value == "size" ? size : count)
        treemap.value(this.value == "size" ? function(d) { return d.size; } : function() { return 1; } )
            .nodes(root);
        
        zoom(node);

    });

    zoom(node);
});


/*function size(d) {
    return d.size;
}


function count(d) {
    return 1;
}*/


//and another one
/*function textHeight(d) {
    var ky = chartHeight / d.dy;
    yscale.domain([d.y, d.y + d.dy]);
    return (ky * d.dy) / headerHeight;
}*/


/*function getRGBComponents (color) {
    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);
    return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
}


function idealTextColor (bgColor) {
    var nThreshold = 105;
    var components = getRGBComponents(bgColor);
    var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
}*/
function reSortRoot(root, value_key, value_name) {
//console.log("Calling");
for (var key in root) {
  if (key == "key") {
    root.name = root.key;
    delete root.key;
  }
  if (key == "values") {
    root.children = [];
    for (item in root.values) {
      //console.log(item);
      root.children.push(reSortRoot(root.values[item], value_key, value_name ));
    }
    delete root.values;
  }
  if (key == value_key) {
    //root.type = parseFloat(root["type"]);
    root.size = parseFloat(root[value_key]);
    root.name = root[value_name];

    //d3.data(root).text(function(d) { return d.type }); //[value_key];
    //console.log(root.value);
    delete root[value_key];
    delete root[value_name];
  }
}
return root;
}


function zoom(d) {
    
    //Header의 사이즈 결정함.
    this.treemap
        .padding([headerHeight/(chartHeight/d.dy), 0, 0, 0])
        .nodes(d);

    // moving the next two lines above treemap layout messes up padding of zoom result
    var kx = chartWidth  / d.dx;
    var ky = chartHeight / d.dy;
    var level = d;

    xscale.domain([d.x, d.x + d.dx]);
    yscale.domain([d.y, d.y + d.dy]);

    //Title Click시
    if (node != level) {
        if (!checkClick) {
        //if (supportsForeignObject) {
            checkClick = 1;
            chart.selectAll(".cell.child .foreignObject")
                .style("display", "none");
        } else {
            checkClick = 0;
            chart.selectAll(".cell.child .foreignObject .labelbody .label")
                .style("display", "none");
        }
    }

    var zoomTransition = chart.selectAll("g.cell").transition().duration(transitionDuration)
        .attr("transform", function(d) { return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")"; })
        .each("end", function(d, i) {
            //i를 쓰는 이유는 한번만 수행하기 위해서 (자동으로 38번 수행되므로)
            //Purdue가 아닌 것을 눌렀을 때 시행함.
            if (!i && (level !== self.root)) {
                chart.selectAll(".cell.child")
                    // only get the children for selected group
                    .filter(function(d) { return d.parent === self.node; }) 
                    .select(".foreignObject .labelbody .label")
                    .style("color", "white"); //function(d) { return idealTextColor(color(d.parent.name)); });

                //if (supportsForeignObject) {
                if (checkClick) {
                    chart.selectAll(".cell.child")
                        // only get the children for selected group
                        .filter(function(d) { return d.parent === self.node; })
                        .select(".foreignObject")
                        .style("display", "");
                    checkClick = 0;
                   // console.log("Third");
                } else {
                    chart.selectAll(".cell.child")
                        // only get the children for selected group
                        .filter(function(d) { return d.parent === self.node; })
                        .select(".foreignObject .labelbody .label")
                        .style("display", "");
                    checkClick = 1; 
                    //console.log("Third-1");      
                }
            }
        });

    zoomTransition.select(".foreignObject")
        .attr("width", function(d) { return Math.max(0.01, kx * d.dx); })
        .attr("height", function(d) { return d.children ? headerHeight: Math.max(0.01, ky * d.dy); })
        .select(".labelbody .label")
        .text(function(d) { return d.name; });

    // update the width/height of the rects
    zoomTransition.select("rect")
        .attr("width", function(d) { return Math.max(0.01, kx * d.dx); })
        .attr("height", function(d) { return d.children ? headerHeight : Math.max(0.01, ky * d.dy); })
        .style("fill", function(d) { return d.children ? headerColor : color(d.parent.name); });

    node = d;

    //if (d3.event) { d3.event.stopPropagation(); }
}