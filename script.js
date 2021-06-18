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

  //Setting dimensions for svg, appending "g". 
  var svg = d3.select('svg')
    .attr('width', svg_width) //width
    .attr('height', height) 
    .append('g')
    .attr('transform', "translate(" + margin.left + "," + margin.top + ")")
    .attr('class', 'horizontal-bar-graph'); 


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
    console.log(width);
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
      .attr('width', d => x(d.deaths)); 

    // Adding appropriate state_name to each rect
    var rect = d3.selectAll('rect');
    rect.each(function(d){
      this.classList.add(d.state_name.split(" ").join(""));
    })
    
    // Implementing tooltip to show data if client hovers bars.
    $('.bar').hover(function(){
      console.log("Hovering over, " + $(this).attr('class'));
      var class_ = $(this).attr('class');
      class_ = class_.substr(class_.indexOf(" ") + 1);
      console.log(class_ + ", " + class_.length);
    });
  })   
  /*setTimeout(function(){
    $('.bar').hover(function(){
      console.log("Hovering over, " + $(this).attr('class'));
      var class_ = $(this).attr('class');
      class_ = class_.substr(class_.indexOf(" ") + 1);
      console.log(class_ + ", " + class_.length);
    });
  }, 300);*/
});