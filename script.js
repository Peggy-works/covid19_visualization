$(document).ready(function(){  
  // Variables
  let message;  
  var dates = [];

  // Margins for 'g' element.
  var margin = {top: 40, right: 130, bottom: 40, left: 130},
      width = parseInt($(document).width()) - margin.left - margin.right, // margin-right
      height = 900 - margin.top - margin.bottom;

  // Width of 'svg'. 
  var svg_width = parseInt($(document).width());

  //Height of 'svg'
  var svg_height = 860;

  // Creating tooltip for horizontal-graph
  var tooltip = d3.select('.inner-container')
    .append('div')//
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden'); // style('opacity', 0)
   
  // Creating tooltip for map-graph
  var tooltip_map = d3.select('#second-graph')
    .append('div')//
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden'); // style('opacity', 0)
    
  //Setting dimensions for svg, appending "g". 
  var svg = d3.select('#horizontal-graph')
    .attr('width', svg_width) //width
    .attr('height', svg_height) 
    .append('g')
    .attr('transform', "translate(" + margin.left + "," + margin.top + ")");
    //.attr('class', 'horizontal-bar-graph'); 
  
  //Creating map projection
  var projection = d3.geoAlbersUsa()
    .translate([svg_width/2.2, svg_height/2.2])
    .scale([1500]);

  //Creating path
  var path = d3.geoPath()
    .projection(projection);  

  //Getting svg for map-graph
  var svg_map = d3.select("#map-graph")
    .attr("width", svg_width)
    .attr("height", svg_height)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
 
  // Changing color scheme based on where we at in the webpage.
  $(window).scroll(function(event){  
    var $window = $(window);
    var $body = $('body');
    var $head = $('.head-container');
    var height = Math.round($window.height()/2); 
    if ($window.scrollTop() > height){
      $body.addClass('color-brown');
    } else if ($window.scrollTop() < height) {
      $body.removeClass('color-brown');
    } 
  }); 

  // Opening csv file to read in data.
  var csv_file = 'NYT_covid19_deaths.csv'; 

  //Opening csv file
  d3.csv(csv_file).then(function(data){ 
    dataset = data.sort(function(a, b){  
      return d3.descending(parseInt(a.deaths), parseInt(b.deaths))
    })  
    console.log(dataset[0].deaths + ", " + dataset[dataset.length-1].deaths);  
    for (var i = 0; i < dataset.length; i++){
      dates.push(dataset[i].state_name);
    } 
    //console.log('printing first, ' + dates[0]); 

    // X-Axis 
    console.log(dataset[0].deaths + ", " + dataset[0].state_name);
    var x = d3.scaleLinear()
      .domain([0, dataset[0].deaths]) //dataset[0].deaths 
      .range([0, width]);

    // Adding X-Axis to svg
    svg.append('g')
      .attr("transform", "translate(0, 750)")
      .attr("class", 'x-axis')
      .call(d3.axisBottom(x).tickValues([0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, dataset[0].deaths]));

    // Y-Axis
    var y = d3.scaleBand()
      .domain(dates)
      .range([0, height - margin.bottom - margin.top])  
      .padding(.5); 

    // Adding Y-axis to svg
    svg.append('g')
      .attr('transform', 'translate(-5,1)')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    // Adding 'rect' w/ data to svg after axis.
    svg.selectAll('.bar')
      .data(dataset)
      .enter().append('rect') 
      .attr('class', 'bar')
      .attr("y", d => y(d.state_name))
      .attr("x", x(0))
      .attr('height', 10)
      .attr('width', d => x(d.deaths))
      .attr('data-deaths', d => d.deaths)
      .attr('data-state', d => d.state_name); 

    // Adding appropriate state_name to each rect
    /*var rect = d3.selectAll('rect');
    rect.each(function(d){
      this.classList.add(d.state_name.split(" ").join("")); 
    })*/ 

    $('rect').mouseover(function(d){ 
      // Deriving values from data-state, data-deaths html rect attributes
      var $state_name = $(this).data("state");
      var $deaths = $(this).data("deaths");
            
      //Adding top, left to tooltip, adding state name and text to tooltip
      tooltip.style('left', event.pageX + 'px')
        .style('top', event.pageY + 'px')
        .style('visibility', 'visible')
        .html("<p class='tooltip-text'>State: "+ $state_name + '<br>Total deaths: ' + $deaths + '</p>'); 
    });
    
    //Hide if mouseout of rect
    $('rect').mouseout(function(){
      tooltip.style('visibility', 'hidden');
    });
  });

  //specify file to read
  d3.csv(csv_file).then(function(data){ 

    //json file path
    var json_file = "states.json";  

    //reading json topo file
    d3.json(json_file).then(function(json){
      console.log("are we here"); 

      //getting states object info
      var states = topojson.feature(json, json.objects.states).features; 

      //Adding new properties deaths_total to json.states
      for (var i = 0; i < data.length; i++){
        data_name = data[i].state_name;
        data_deaths = data[i].deaths
        for(var j = 0; j < states.length; j++){
          if(data_name == states[j].properties.name){ 
            states[j].properties.deaths = data_deaths;
          }
        }
      }

      // Sorting data
      var d_sorted = data.sort(function(a, b){  
        return d3.descending(parseInt(a.deaths), parseInt(b.deaths))
      })   
      
      //color 
      var color = d3.scaleLinear()
        .domain([0, d_sorted[0].deaths])
        .range(["white", "#00ffb3"]); //was using white first

      //Creating legend
      var legend = d3.legendColor()
        .labelFormat(d3.format(".0f"))
        .labels(['0', '15000', '30000', '35000', '50000', ""+ d_sorted[0].deaths + ""])
        .orient('horizontal')
        .shapePadding(0)
        .cells(6)
        .shapeWidth(65)
        .scale(color);

      //adding legend to svg as 'g'
      /**
      * Added a legend but its not up to snuff figure this out tomorrrow.
      */
      svg_map.append('g')
        .attr('transform', 'translate(200,-15)')
        .call(legend);

      svg_map.selectAll(".states")
        .data(states)
        .enter()
        .append('path')
        .attr('class', 'states')
        .style('fill', d => color(d.properties.deaths))
        .attr('d', path)
        .attr('data-deaths', d => d.properties.deaths)
        .attr('data-state', d => d.properties.name); 

      /** As of 7/8/2021
       *  Map-graph is finished..........
      */

      //Add tooltip to states when hovered
      $('path').mouseover(function(d){
        // Dreiving values from data-state, data-deaths 
        var state_n = $(this).data('state');
        var deaths_t = $(this).data('deaths');

        // Adding tooltip to <path> states
        tooltip_map.style("left", event.pageX + "px")
          .style('top', event.pageY + "px")
          .style("visibility", 'visible')
          .style('background', '#2eb08b')
          .html("<p class='tooltip-text'>State: " + state_n + '<br>Total deaths: ' + deaths_t + '</p>');
      });

      // If state not hovered hide tooltip
      $('path').mouseout(function(){
        tooltip_map.style('visibility', 'hidden');
      }); 

      //error checking / checking object properties to make sure its correct.
      /*for (var j = 0; j < states.length; j++){
        console.log(states[j]);   
      }*/
    }); 
  });
});