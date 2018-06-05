// Define the Margins.
var margin = {top: 20, right: 80, bottom: 70, left: 80},             // defines the respective values of the margin attibute/object
    width = 760 - margin.left - margin.right,                         // defines the width dimension for the chart itself
    height = 500 - margin.top - margin.bottom;                        // defines the height dimension for the chart itself

// Width and height of both svgs
//var width = 600;
//var height = 400;
//var margin = {left: 30, right: 30};
var range = [0, 24];
var step = 2;

var zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on("zoom", zoomed);

var svgLegend = d3.select("body")
                  .append("svg").attr("class", "svg-legends")
                  .attr("width", width/6)
                  .attr("height", 450);

var currentSliderValue = 1976;

var active = d3.select(null);

var formatComma = d3.format(",");

// D3 Projection
var projection = d3.geoAlbersUsa()
  .translate([width / 1.96, height / 2.45]) // translate to center of screen
  .scale([735]); // scale things down so see entire US

//Define path generator
var path = d3.geoPath()
        .projection(projection);







 var beeScale = d3.scaleThreshold()
    .domain([1, 30, 70, 120])  
//.domain([1, 2.50, 7.50, 12.50, 35.00])
.range(["#ccece6", "#66c2a4", "#41ae76", "#238b45", "#005824"]);


var beeLegend = d3.scaleThreshold()
    //.domain([1000000, 2500000, 7500000, 12500000, 35000000])  
  .domain([1, 30, 70, 120])
//.range(d3.interpolateReds(1/23),d3.interpolateReds(3/23),d3.interpolateReds(7/23),d3.interpolateReds(12/23))      
 .range(["#ccece6", "#66c2a4", "#41ae76", "#238b45", "#005824"]);

svgLegend.append("g")
  .attr("class", "legendQuant beeLegend")
  .style("background-color","blue")
  .attr("transform", "translate(10,20)");
var legendPop = d3.legendColor()
    .labelFormat(d3.format(".0f")).shapePadding(-2).shapeHeight(30)
    .labels(d3.legendHelpers.thresholdLabels).title('Bee Colony Loss in Thousands').titleWidth(90)
    //.useClass(true)
    .scale(beeLegend)
svgLegend.select(".beeLegend")
  .call(legendPop);





 var tempScale = d3.scaleThreshold()
    //.domain([1000000, 3000000, 7000000, 12000000])  
  .domain([1, 2.2, 3.4, 4.5])
 .range(["#fcbba1","#fc9272","#fb6a4a","#de2d26","#66070a"]);
var tempLegend = d3.scaleThreshold()
    //.domain([1000000, 2500000, 7500000, 12500000, 35000000])  
  .domain([1, 2.2, 3.4, 4.5])
.range(["#fcbba1","#fc9272","#fb6a4a","#de2d26","#66070a"]);

svgLegend.append("g")
  .attr("class", "legendQuant tempLegend")
.style("background-color","blue")
  .attr("transform", "translate(10,20)");
var legendProd = d3.legendColor()
    .labelFormat(d3.format(".1f")).shapePadding(-2).shapeHeight(30)
    .labels(d3.legendHelpers.thresholdLabels).title('Temperature Change in Fahrenheit').titleWidth(90)
    //.useClass(true)
    .scale(tempLegend)

svgLegend.select(".tempLegend")
  .call(legendProd);

//d3.select(".beeLegend").select(".legendTitle").attr("transform", "translate(100,10)");
//d3.select(".tempLegend").select(".legendTitle").attr("transform", "translate(113,10)");

//d3.select(".state-title").style("opacity", "0");
//d3.select(".bee").style("opacity", "0");
//d3.select(".temp").style("opacity", "0");

//d3.select(".all-title").style("opacity", "1");
//d3.select(".allbee").style("opacity", "1");
//d3.select(".alltemp").style("opacity", "1");

d3.select(".state-title").text("United States").style("opacity", 1);
d3.select(".bees").text("Bee Colony Loss | 1,421,000 colonies").style("opacity", 1);
d3.select(".temps").text("Temperature Increase | 3.5 degrees").style("opacity", 1);

d3.select(".beeLegend").attr("opacity", "1");
d3.select(".tempLegend").attr("opacity", "0");

var colorAg = d3.scaleQuantize()
				.range(["#ccece6", "#66c2a4", "#41ae76", "#238b45", "#005824"]);
            //Colors derived from ColorBrewer, by Cynthia Brewer, and included in
            //https://github.com/d3/d3-scale-chromatic
var popLegend = d3.scaleLinear()
      .range(["#fcbba1","#a50f15"]);

var agLegend = d3.scaleLinear()
      .range(["#ccece6","#005824"]);



//Define quantize scale to sort data values into buckets of color for both sets of .csv data
var colorBeeData = d3.scaleQuantize()
                    .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
                    //Colors derived from ColorBrewer, by Cynthia Brewer, and included in
                    //https://github.com/d3/d3-scale-chromatic

var colorTempData = d3.scaleQuantize()
                    .range(["rgb(242,240,247)","rgb(203,201,226)","rgb(158,154,200)","rgb(117,107,177)","rgb(84,39,143)"]);
                    //Colors derived from ColorBrewer, by Cynthia Brewer, and included in
                    //https://github.com/d3/d3-scale-chromatic

//Create SVG element for Bee Population Graph
var svgBee = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height - (3 * margin.top)+10)
        .attr("id", "beeSvg")
        .attr("transform", "translate(0,-140)")
        .style("background-color", "black");
//.on("click", stopped, true);

 svgBee.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .on("click", reset);

var g = svgBee.append("g");

svgBee.call(zoom);

// Define SVG.
var svgLineGraph = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)                       // defines the width of the "div" of where the chart can be displayed
    .attr("height", height + margin.top + margin.bottom)                     // defines the height of the "div" of where the chart can be displayed
.style("background-color", "#F8F8F8")
    .append("g")                                                             // groups elements together(clean code) and allows application of transformations                                                                                                                (affects how visual elements are rendered)
    .attr("id", "svgLine")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // scales the dimensional appearance of graph based on the margin values
            
            var beeCsv = "data/beepop" + currentSliderValue + ".csv";
//            var tempCsv = "data/temp" + currentSliderValue + ".csv";
            

var parseTime = d3.timeParse("%Y"); // Tells d3 to parse the data as a date (years) when reading .csv strings. It can return a date object fromn there (which is used later on)

// Define X and Y SCALE.
var x =                                 // Sets the scale (mapping of values to placements on line) for x-axis  
    d3.scaleTime().range([0, width]);   // Places date/time values on the ticks of the x axis 

var y =                                 // Sets the scale (mapping of values to placements on line) for y-axis
    d3.scaleLinear()                         // Sets the scale to be a specal ordinal scale (mapping to labels rather than values) 
    .range([height, 0]);                     // Reverses ordering of how y-axis bars are displayed (big to small versus small to big)

var y2 =                                 // Sets the scale (mapping of values to placements on line) for y-axis
    d3.scaleLinear()                         // Sets the scale to be a specal ordinal scale (mapping to labels rather than values) 
    .range([height, 0]);                     // Reverses ordering of how y-axis bars are displayed (big to small versus small to big)

var zColor = d3.scaleOrdinal(d3.schemeCategory10); // Preset ordinal (names) scale that output values with 10 unique ctegorial colors

var line = d3.line()                                   // Defines lines on screen
        .curve(d3.curveBasis)                          // Sets how the line transistions from point to point. It rounds of of points to make smooth curves. 
        .x(function(d) { //console.log(d);
            return x(d.date); })          // Data field for x coordinates
        .y(function(d) { //console.log(d.b);
            return y(d.b);        // Data field for y coordinates    
        
                        });

var line2 = d3.line()                                   // Defines lines on screen
        .curve(d3.curveBasis)                          // Sets how the line transistions from point to point. It rounds of of points to make smooth curves. 
        .x(function(d) { return x(d.date); })          // Data field for x coordinates
        .y(function(d) { return y2(d.t); });       // Data field for y coordinates

// Define X and Y AXIS
function xAxis() {
  return d3.axisBottom(x)                              // Sets axis to be at bottom (orientation wise) 
    .ticks(5);  
} 

function yAxis() {
    return d3.axisLeft(y)                            // Sets axis to be on left (orientation wise)   
    .ticks(5)                                        // 2 4 8 16 32 labels etc
    .tickFormat( function(d) { return (d) });
    
}

function y2Axis() {
    return d3.axisRight(y2)                            // Sets axis to be on left (orientation wise)   
    .ticks(5)                                        // 2 4 8 16 32 labels etc
    .tickFormat( function(d) { return (d) });
    
}

// Define X and Y GRID
function make_x_grid() {        
    return d3.axisBottom(x);
//         .ticks(5)
}

function make_y_grid() {        
    return d3.axisLeft(y)
        .ticks(5)
}

// From https://bl.ocks.org/pjsier/28d1d410b64dcd74d9dab348514ed256
function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }

d3.csv("data/mergedBees.csv", function(error, data){   // Parses the data from the .csv file using a d3.csv request
    
 if (error) throw error;

//  // format the data
//  data.forEach(function(d) {
//      d.date = +d.date;
//      d.b = +d.beePop;
//      d.stateName = d.state;
//  });
    
    var newData = [];
                    
  // format the data
  data.forEach(function(d) {
      //console.log(d)
      if(d.state === "all"){
//          console.log(d.beePop)
          d.date = parseTime(d.date);
          d.b = +d.beePop;
          d.stateName = d.state;
          newData.push(d);
      }
//      console.log(d.state)
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
  y.domain([d3.min(data, function(d) {return Math.min(d.b);}), d3.max(data, function(d) {return Math.max(d.b);})]);

  // Add the valueline path.
  svgLineGraph.append("path")
      .data([newData])
      .attr("class", "line")
      .attr("d", line)
    .attr('pointer-events', 'none')
    .attr("id", "path")
      .transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash);

  // Add the X Axis
  svgLineGraph.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
//      .call(xAxis(x));
    
  // This section defines any text/labels related to the axis
  svgLineGraph.append("text")
      .attr("y", 6.5 * margin.bottom)
      .attr("x",width/2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text("Years");

  // Add the Y Axis
  svgLineGraph.append("g")
      .attr("class", "axisSteelBlue")
    .attr("id", "leftaxis")
      .call(d3.axisLeft(y));
  
  // This section defines any text/labels related to the axis
  svgLineGraph.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text("Number of Honey Bee Colonies (Thousands)");
    
    var mouseG = svgLineGraph.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');
                
    console.log(lines)
    console.log(lines[1])

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data([newData])
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");
    
     mousePerLine.append("circle")
      .attr("r", 7)
//      .style("stroke", function(d) {
//        return color(d.name);
//      })
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height + margin.top + margin.bottom)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
//            console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            //console.log(d.values)

            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }

//            d3.select(this).select('text')
//              .text(y.invert(pos.y).toFixed(2));
            
//            if(i == 0) {
            if(lines[i].id == "path") {
                console.log("A")
                console.log(lines[i])
                d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));
                //d3.select(".mouse-per-line circle").style("stroke", "steelBlue");
            }
            else {
                console.log("B")
                console.log(lines[i])
                d3.select(this).select('text')
              .text(y2.invert(pos.y).toFixed(2));
                //d3.select(".mouse-per-line circle").style("stroke", "red");
            }

            return "translate(" + mouse[0] + "," + pos.y +")";
          });
    });
});

d3.csv("data/mergedTemp.csv", function(error, data){   // Parses the data from the .csv file using a d3.csv request
    
 if (error) throw error;

//  // format the data
//  data.forEach(function(d) {
//      d.date = +d.date;
//      d.t = +d.Temp;
//  });
    
    var newData = [];
                    
  // format the data
  data.forEach(function(d) {
//      console.log(d)
      if(d.state === "all"){
//          console.log(d.beePop)
          d.date = parseTime(d.date);
          d.t = +d.Temp;
          d.stateName = d.state;
          newData.push(d);
      }
//      console.log(d.state)
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
  y2.domain([d3.min(data, function(d) {return Math.min(d.t);}), d3.max(data, function(d) {return Math.max(d.t); })]);

  // Add the valueline2 path.
  svgLineGraph.append("path")
      .data([newData])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", line2)
    .attr('pointer-events', 'none')
      .attr("id", "path2")
      .transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash);

  // Add the Y2 Axis
  svgLineGraph.append("g")
      .attr("class", "axisRed")
      .attr("transform", "translate( " + width + ", 0 )")
    .attr("id", "rightaxis")
      .call(d3.axisRight(y2));
    
  // This section defines any text/labels related to the axis
  svgLineGraph.append("text")
      .attr("transform", "rotate(90)")
      .attr("y", 0 - margin.left - 600)
      .attr("x",0 + (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text("Average Temperature (Fahrenheit)");
    
    var mouseG = svgLineGraph.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');
                
    console.log(lines)
    console.log(lines[1])

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data([newData])
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");
    
     mousePerLine.append("circle")
      .attr("r", 7)
//      .style("stroke", function(d) {
//        return color(d.name);
//      })
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(-60,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height + margin.top + margin.bottom)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
//            console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            //console.log(d.values)

            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
//            console.log(d3.select(this).select('text'))

//            if(i == 0) {
            if(lines[i].id == "path") {
                console.log("C")
                console.log(lines[i])
                d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2)).style("font-size", "22").style("font-weight", "bold").style("color", "red");
                //d3.select(".mouse-per-line circle").style("stroke", "steelBlue");
            }
            else {
                console.log("D")
                console.log(lines[i])
                d3.select(this).select('text')
              .text(y2.invert(pos.y).toFixed(2)).style("font-size", "22").style("font-weight", "bold");
                //d3.select(".mouse-per-line circle").style("stroke", "red");
            }

            return "translate(" + mouse[0] + "," + pos.y +")";
          });
//                    d3.select("path#path").select('text')
//              .text(y.invert(pos.y).toFixed(2));
    });
});



//d3.selectAll(".mouse-per-line")
//          .attr("transform", function(d) {
//            console.log(width/mouse[0])
//            var xDate = x.invert(mouse[0]),
//                bisect = d3.bisector(function(d) { return d.date; }).right;
//                idx = bisect(d.values, xDate);
//            
//            //console.log(d.values)
//
//            var beginning = 0,
//                end = lines[0].getTotalLength(),
//                target = null;
//
//            while (true){
//              target = Math.floor((beginning + end) / 2);
//              pos = lines[0].getPointAtLength(target);
//              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
//                  break;
//              }
//              if (pos.x > mouse[0])      end = target;
//              else if (pos.x < mouse[0]) beginning = target;
//              else break; //position found
//            }
//
//            d3.select(this).select('text')
//              .text(y.invert(pos.y).toFixed(2));
//
//            return "translate(" + mouse[0] + "," + pos.y +")";
//          });
//        
//        d3.selectAll(".mouse-per-line")
//          .attr("transform", function(d) {
//            console.log(width/mouse[0])
//            var xDate = x.invert(mouse[0]),
//                bisect = d3.bisector(function(d) { return d.date; }).right;
//                idx = bisect(d.values, xDate);
//            
//            //console.log(d.values)
//
//            var beginning = 0,
//                end = lines[1].getTotalLength(),
//                target = null;
//
//            while (true){
//              target = Math.floor((beginning + end) / 2);
//              pos = lines[1].getPointAtLength(target);
//              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
//                  break;
//              }
//              if (pos.x > mouse[0])      end = target;
//              else if (pos.x < mouse[0]) beginning = target;
//              else break; //position found
//            }
//
//            d3.select(this).select('text')
//              .text(y2.invert(pos.y).toFixed(2));
//
//            return "translate(" + mouse[0] + "," + pos.y +")";


    

// var mouseG = svgLineGraph.append("g")
//      .attr("class", "mouse-over-effects");
//
//    mouseG.append("path") // this is the black vertical line to follow mouse
//      .attr("class", "mouse-line")
//      .style("stroke", "black")
//      .style("stroke-width", "1px")
//      .style("opacity", "0");
//      
//    var lines = document.getElementsByClassName('line');
//                
//    console.log(lines)
//
//    var mousePerLine = mouseG.selectAll('.mouse-per-line')
//      .data(cities)
//      .enter()
//      .append("g")
//      .attr("class", "mouse-per-line");
//
//    mousePerLine.append("circle")
//      .attr("r", 7)
//      .style("stroke", function(d) {
//        return color(d.name);
//      })
//      .style("fill", "none")
//      .style("stroke-width", "1px")
//      .style("opacity", "0");
//
//    mousePerLine.append("text")
//      .attr("transform", "translate(10,3)");
//
//    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
//      .attr('width', width) // can't catch mouse events on a g element
//      .attr('height', height)
//      .attr('fill', 'none')
//      .attr('pointer-events', 'all')
//      .on('mouseout', function() { // on mouse out hide line, circles and text
//        d3.select(".mouse-line")
//          .style("opacity", "0");
//        d3.selectAll(".mouse-per-line circle")
//          .style("opacity", "0");
//        d3.selectAll(".mouse-per-line text")
//          .style("opacity", "0");
//      })
//      .on('mouseover', function() { // on mouse in show line, circles and text
//        d3.select(".mouse-line")
//          .style("opacity", "1");
//        d3.selectAll(".mouse-per-line circle")
//          .style("opacity", "1");
//        d3.selectAll(".mouse-per-line text")
//          .style("opacity", "1");
//      })
//      .on('mousemove', function() { // mouse moving over canvas
//        var mouse = d3.mouse(this);
//        d3.select(".mouse-line")
//          .attr("d", function() {
//            var d = "M" + mouse[0] + "," + height;
//            d += " " + mouse[0] + "," + 0;
//            return d;
//          });
//
//        d3.selectAll(".mouse-per-line")
//          .attr("transform", function(d, i) {
//            console.log(width/mouse[0])
//            var xDate = x.invert(mouse[0]),
//                bisect = d3.bisector(function(d) { return d.date; }).right;
//                idx = bisect(d.values, xDate);
//
//            var beginning = 0,
//                end = lines[i].getTotalLength(),
//                target = null;
//
//            while (true){
//              target = Math.floor((beginning + end) / 2);
//              pos = lines[i].getPointAtLength(target);
//              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
//                  break;
//              }
//              if (pos.x > mouse[0])      end = target;
//              else if (pos.x < mouse[0]) beginning = target;
//              else break; //position found
//            }
//
//            d3.select(this).select('text')
//              .text(y.invert(pos.y).toFixed(2));
//
//            return "translate(" + mouse[0] + "," + pos.y +")";
//          });
//    });















            
            
            // Load Population .csv data by state
//d3.csv("data/beepop1976.csv", function(data) {
            d3.csv("data/data.csv", function(data) {
//                d3.selectAll("#beeGraph").remove();
    
    //Set input domain for pop. density color scale
    colorBeeData.domain([
        d3.min(data, function(d) {
//             console.log(d.numColonies)
            return (d.numColonies); }), // Population divided by area gives you population density for the region
        
        d3.max(data, function(d) {    //console.log(d.numColonies)
            return (d.numColonies); })  
    ]);
                
    
    //Load in GeoJSON data for U.S. (lv1 GeoJSON attributes -> 48 states of U.S.)
    d3.json("data/usanew.json", function(json) {

        //Merge the bee population data with respective svg and U.S. GeoJSON data
        //Loop through once for each state to get bee population data
        for (var i = 0; i < data.length; i++) {

            //Grab state name
            var dataState = data[i].state;
            
            var temps = parseFloat(data[i].temps);
            var bees = parseFloat(data[i].bees);
            var code = data[i].abbreviation;

//            //Grab bee population
//            var dataBeePopulation = +data[i].numColonies;
            
            //Grab state temperature
//            var dataTemperature = parseFloat(+data[i].temperature;);

            //Find the corresponding region inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {

                var jsonRegion = json.features[j].properties.name; // References name property in GeoJSON data

                // If the name on the GeoJSON matches the name for the region, assign current bee population data to GeoJSON feature
                if (dataState == jsonRegion) {

                    //Copy the data value into the JSON for Population 
                    json.features[j].properties.temps = temps;
                    json.features[j].properties.bees = bees;
                    json.features[j].properties.code = code;
                    //Stop looking through the JSON
                    break;

                }
            }		
        }
        
        // Displays by default upon loading the page the population density data
                       g.selectAll("path")
                       .data(json.features)
                       .enter()
                       .append("path")
                       .attr("d", path).attr("class", "feature")
                           .on("click", clicked)
                        .attr("stroke","#fff").attr("stroke-width","0.4").style("opacity", "0.8").style("stroke-opacity", "1")
                       .style("fill", function(d) {
                            //Get data value
                            var value = d.properties.bees;
                            if (value) {
                                //If value exists…
                                return beeScale(value);
                            } else {
                                //If value is undefined…
                                return "#ccc";
                            }
                       })
        
        .on("mouseover",function(d){
                            var state = d.properties.name;
                            var temps = d.properties.temps;
                            var bees = d.properties.bees;
                            //console.log(d3.select(this))
                           d3.select(".state-title").text("United States").style("opacity", "0");
                           d3.select(".bees").text("Bee Colony Loss | 1,421,000 colonies").style("opacity", "0");
                           d3.select(".temps").text("Temperature Increase | 3.5 degrees").style("opacity", "0");
                           
                            d3.select(this)
                                .style("opacity", "1");
                           
//                           d3.select(".tooltip").style("left", 180 + "px");
//                           d3.select(".tooltip").style("top", 570 + "px");
                        
                            d3.select(".state-title").text(state).style("opacity", 0).style("opacity", 1);
                            if (bees){
                                d3.select(".bees").text("Bee Colony Loss | " + formatComma(bees) + ",000 colonies").style("opacity", 1);
                            }
                            if (temps){
                                d3.select(".temps").text("Temperature Increase | " + temps + " degrees").style("opacity", 1);
                            }
                        
                        })
                       .on("mouseout", function(d){
                        
                            d3.select(this)
                                .style("opacity", "0.8");
                    var state = d.properties.name;
                            var temps = d.properties.temps;
                            var bees = d.properties.bees;
                            
//                            d3.select(".state-title").text(state).transition().duration(500).style("opacity", 0);
//                            if (bees){
//                                d3.select(".bees").text("Bee Colony Loss | " + formatComma(bees) + ",000 colonies").transition().duration(500).style("opacity", 0);
//                            }
//                            if (temps){
//                                d3.select(".temps").text("Temperature Increase | " + temps + " degrees").transition().duration(500).style("opacity", 0);
//                            }
                           
                           d3.select(".state-title").text("United States").style("opacity", 1);
                            d3.select(".bees").text("Bee Colony Loss | 1,421,000 colonies").style("opacity", 1);
                            d3.select(".temps").text("Temperature Increase | 3.5 degrees").style("opacity", 1);
                           
//                           d3.select(this)
//                                .style("opacity", "1");
                       })
            
                   // Adding Labels for each State
                    g.selectAll("text")
                       .data(json.features)
                       .enter()
                       .append("svg:text").attr("class", "state-labels")
                       .text(function(d){
                            if (d.properties.code == "RI" || d.properties.code == "DE"){
                                return "";
                            }
                            return d.properties.code;
                        })
                       .attr("x", function(d){
                            
//                        if (d.properties.code == "MD"){
//                            return path.centroid(d)[0] - 3;
//                        } else if (d.properties.code == "NJ"){
//                            return path.centroid(d)[0] - 1;
//                        }
//                        
                            return path.centroid(d)[0];
                        })
                       .attr("y", function(d){
//                            if (d.properties.code == "MD"){
//                                return path.centroid(d)[1] - 2;
//                            } else if (d.properties.code == "NJ"){
//                                return path.centroid(d)[1] - 6;
//                            }
                            
                            return  path.centroid(d)[1];
                        })
                        .attr("dy", function(d){
                            // edge cases due to centroid calculation issue
                            // see: https://github.com/mbostock/d3/pull/1011
                            // deviations adjusted to test case at map height = 166px
                            function dy(n) {
                                return (n * projection.translate()[1]) / height
                            }
                            switch (d.properties.code)
                            {   case "FL":
                                    return dy(30)
                                case "LA":
                                    return dy(-10)
                                case "NH":
                                    return dy(20)
                                case "MA":
                                    return dy(1)
                                case "DE":
                                    return dy(5)
                                case "MD":
                                    return dy(-4)
                                case "RI":
                                    return dy(4)
                                case "CT":
                                    return dy(2)
                                case "NJ":
                                    return dy(20)
                                case "DC":
                                    return dy(-3)
                                default:
                                    return 0
                            }
                        })
                        .attr("dx", function(d){
                            // edge cases due to centroid calculation issue
                            // see: https://github.com/mbostock/d3/pull/1011
                            // deviations adjusted to test case at map height = 166px
                            function dx(n) {
                                return (n * projection.translate()[0]) / width
                            }
                            switch (d.properties.code)
                            {   
                                case "FL":
                                    return dx(30)
                                case "LA":
                                    return dx(-10)
                                case "NH":
                                    return dx(3)
                                case "MA":
                                    return dx(1)
                                case "DE":
                                    return dx(5)
                                case "MD":
                                    return dx(-8)
                                case "RI":
                                    return dx(4)
                                case "CT":
                                    return dx(2)
                                case "NJ":
                                    return dx(2)
                                case "DC":
                                    return dx(-3)
                                default:
                                    return 0
                            }
                        })
                       .attr("text-anchor","middle")
                       .attr('font-size','6pt')
                       .style("color","white");

        // Defining Button Interactivity
            var togData = false;
            var togCities = false; 
            d3.select(".toggleData")
                .on("click", function(){
                    // Determine if current line is visible
                    togData=!togData;
                    //console.log(togData);
                    
                    if (togData == true){
                        g.selectAll("path")
                            .transition().duration(1000)
                            .style("fill", function(d) {
                                var value = d.properties.temps;
                                if (value) {
                                    //If value exists…
                                    /*console.log(colorPop(value))
                                    console.log((value))*/
                                    return tempScale(value);
                                } else {
                                    //If value is undefined…
                                    return "#ccc";
                                } 
                         });
                    
                        d3.select(".tempLegend").transition().duration(1000).attr("opacity", "1");
                        d3.select(".beeLegend").transition().duration(1000).attr("opacity", "0");
                        
//                        d3.select("body")
//                            .transition().duration(1000)
//                            .style("background-color","#381616");
                        
//                        d3.select(".toggleData")
//                            .transition().duration(1000)
//                            .style("background-color","#823232");
//                        
//                        d3.select(".toggleCity")
//                            .transition().duration(1000)
//                            .style("background-color","#823232");  
                        
                        d3.select("h2")
                            .transition().duration(1000)
                            .text("U.S. Temperature Change, 1978-2018");
                        
                        //console.log(d3.select("h1"));
                        
                    }
                
                    if (togData == false){
                        g.selectAll("path")
                            .transition().duration(1000)
                            .style("fill", function(d) {
                                var value = d.properties.bees;
                                if (value) {
                                    //If value exists…
                                    
                                    
                                    return beeScale(value);
                                } else {
                                    //If value is undefined…
                                    return "#ccc";
                                } 
                         });
                    
                        d3.select(".tempLegend").transition().duration(1000).attr("opacity", "0");
                        d3.select(".beeLegend").transition().duration(1000).attr("opacity", "1");
                        
//                        d3.select("body")
//                            .transition().duration(1000)
//                            .style("background-color","#0c210e");
                        
//                        d3.select(".toggleData")
//                            .transition().duration(1000)
//                            .style("background-color","#28682d");
//                        
//                        d3.select(".toggleCity")
//                            .transition().duration(1000)
//                            .style("background-color","#28682d");
                        
                        d3.select("h2")
                            .transition().duration(1000)
                            .text("U.S. Honey Bee Population Change, 1978-2018");
                        
                    }
                 });
            
    });
});

function clicked(d) {
                //console.log(d)        
    
                if (active.node() === this) return reset();
                  active.classed("active", false);
                  active = d3.select(this).classed("active", true);
                  var bounds = path.bounds(d),
                      dx = bounds[1][0] - bounds[0][0],
                      dy = bounds[1][1] - bounds[0][1],
                      x = (bounds[0][0] + bounds[1][0]) / 2,
                      y = (bounds[0][1] + bounds[1][1]) / 2,
                      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
                      translate = [width / 2 - scale * x, height / 2 - scale * y];
                  svgBee.transition()
                      .duration(750)
                      // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
                      .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
                  // create a callback for the neighborhood hover
//                    var mover = function(d) {
                      var neigh = d.properties.name;
//                      d3.select('#svgLine path.' + neigh).style('fill', 'black');
//                        console.log()
                        //console.log(neigh)
                       

                      drawChart(neigh);
                    d3.select("#bloc1")
                            .transition().duration(1000)
                            .text(neigh);
//                    };
                }
            function reset() {
                  active.classed("active", false);
                  active = d3.select(null);
                  svgBee.transition()
                      .duration(750)
                      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
                      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
                      var neigh = "all";
//                      d3.select('#svgLine path.' + neigh).style('fill', 'black');
//                        console.log()
                        //console.log(neigh)
                       

                      drawChart(neigh);
                d3.select("#bloc1")
                            .transition().duration(1000)
                            .text("United States");
                }
            function zoomed() {
                  g.style("stroke-width", 1 / d3.event.transform.k + "px");
                  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
                  g.attr("transform", d3.event.transform); // updated for d3 v4
                }
                // If the drag behavior prevents the default click,
                // also stop propagation so we don’t click-to-zoom.
            function stopped() {
                  if (d3.event.defaultPrevented) d3.event.stopPropagation();
                }

            // create a function to draw the timeseries for each neighborhood
            var drawChart = function(field) {
              // remove the previous chart
                
                //console.log(field)
              
                d3.select('#svgLine').select('#path').remove();
                d3.select('#svgLine').select('#path2').remove();
                d3.select('#svgLine').select('#leftaxis').remove();
                d3.select('#svgLine').select('#rightaxis').remove();
                
                
                d3.csv("data/mergedBees.csv", function(error, data){   // Parses the data from the .csv file using a d3.csv request
    
 if (error) throw error;

  var newData = [];
                    
  // format the data
  data.forEach(function(d) {
      //console.log(d)
      if(field === d.state){
//          console.log(d.beePop)
          d.date = parseTime(d.date);
          d.b = +d.beePop;
          d.stateName = d.state;
          newData.push(d);
      }
//      console.log(d.state)
  });
                    
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
  y.domain([d3.min(data, function(d) {return Math.min(d.b);}), d3.max(data, function(d) {return Math.max(d.b);})]);

  // Add the valueline path.
  svgLineGraph.append("path")
      .data([newData])
      .attr("class", "line")
      .attr("d", line)
    .attr('pointer-events', 'none')
    .attr("id", "path")
      .transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash);

  // Add the X Axis
  svgLineGraph.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
//                    .call(xAxis(x));
    
  // This section defines any text/labels related to the axis
  svgLineGraph.append("text")
      .attr("y", 6.5 * margin.bottom)
      .attr("x",width/2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text("Years");

  // Add the Y Axis
  svgLineGraph.append("g")
      .attr("class", "axisSteelBlue")
    .attr("id", "leftaxis")
      .call(d3.axisLeft(y));
  
  // This section defines any text/labels related to the axis
  svgLineGraph.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text("Number of Honey Bee Colonies (Thousands)");
});

d3.csv("data/mergedTemp.csv", function(error, data){   // Parses the data from the .csv file using a d3.csv request
    
 if (error) throw error;

//  // format the data
//  data.forEach(function(d) {
//      d.date = +d.date;
//      d.t = +d.Temp;
//  });
    
    var newData = [];
                    
  // format the data
  data.forEach(function(d) {
      //console.log(d)
      if(field === d.state){
//          console.log(d.beePop)
          d.date = parseTime(d.date);
          d.t = +d.Temp;
          d.stateName = d.state;
          newData.push(d);
      }
//      console.log(d.state)
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
  y2.domain([d3.min(data, function(d) {return Math.min(d.t);}), d3.max(data, function(d) {return Math.max(d.t); })]);

  // Add the valueline2 path.
  svgLineGraph.append("path")
      .data([newData])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", line2)
    .attr('pointer-events', 'none')
      .attr("id", "path2")
      .transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash);

  // Add the Y2 Axis
  svgLineGraph.append("g")
      .attr("class", "axisRed")
      .attr("transform", "translate( " + width + ", 0 )")
    .attr("id", "rightaxis")
      .call(d3.axisRight(y2));
    
  // This section defines any text/labels related to the axis
  svgLineGraph.append("text")
      .attr("transform", "rotate(90)")
      .attr("y", 0 - margin.left - 600)
      .attr("x",0 + (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text("Average Temperature (Fahrenheit)");
});
    
                
                
                
                
                
                
                
//              // update the title
//              d3.select('#heading')
//                .text(field.replace(/_/g, ' '));
//
//              // remove missing values
//              var neigh_data = data[2].filter(function(d) {
//                return d[field];
//              });
//
//              // get min/max dates
//              var time_extent = d3.extent(neigh_data, function(d){
//                return format.parse(d['timestamp']);
//              });
//
//              // Create x-axis scale mapping dates -> pixels
//              var time_scale = d3.time.scale()
//                  .range([0, width - margin])
//                  .domain(time_extent);
//
//              // Create D3 axis object from time_scale for the x-axis
//              var time_axis = d3.svg.axis()
//                  .scale(time_scale)
//                  .tickFormat(d3.time.format("%b '%y"));
//
//              // Append SVG to page corresponding to the D3 x-axis
//              d3.select('#chart').append('g')
//                  .attr('class', 'x axis')
//                  .attr('transform', "translate(" + margin + ',' + (height - 15) + ")")
//                  .call(time_axis)
//              .selectAll("text")
//                .attr("y", 0)
//                .attr("x", 9)
//                .attr("dy", ".35em")
//                .attr("transform", "rotate(90)")
//                .style("text-anchor", "start");
//
//              // define the values to map for x and y position of the line
//              var line = d3.svg.line()
//                           .x(function(d) { return time_scale(format.parse(d['timestamp'])); })
//                           .y(function(d) { return measure_scale(+d[field]); });
//
//              // append a SVG path that corresponds to the line chart
//              d3.select('#chart').append("path")
//                .datum(neigh_data)
//                .attr("class", "line")
//                .attr("d", line)
//                .attr('transform', 'translate(' + margin + ', -15)');
            };






























       
        
    


 

