// set the dimensions and margins of the graph
function lineChart() {
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/russia_losses_equipment.csv", 

// When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), 
            aircraft : d.aircraft,
            helicopter : d.helicopter,
            tank : d.tank,
            APC : d.APC,
            field_artillery: d['field artillery'],
            MRL : d.MRL,
            military_auto : d['military auto'],
            fuel_tank : d['fuel tank'],
            drone : d.drone,
            naval_ship : d['naval ship'],
            anti_aircraft_warfare: d['anti-aircraft warfare ']

             }
  },
// Now I can use this dataset:
function(data) {
  var category = ["aircraft", "helicopter", "tank", "APC", "field artillery","MRL","military auto", "fuel tank", "drone", "naval ship", "anti-aircraft warfare"]
  var color = d3.scaleOrdinal()
        .domain(category)
        .range(["#2D4057", "#7C8DA4", "#B7433D", "#2E7576", "#EE811D", "#572d40", "#2d572f", "#442d57", "#2d4057", "#57442d", "#896b47"])
  
  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.aircraft; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add the line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(d.aircraft) })
      )
})
}