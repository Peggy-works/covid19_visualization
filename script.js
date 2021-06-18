$(document).ready(function(){  
  let message;  
  var dates = [];
  var margin; 
  var svg = d3.select('svg')
    .attr('width', parseInt($(document).height()))
    .attr('height', 800)
  var g = d3.select('g')
    .attr('transform', "translate(20,30)");
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
  console.log("?");
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
    // x
    var x = d3.scaleLinear()
      .domain([0, dataset[0].deaths])
      .range([0, parseInt($(document).width())]);

    // y
    var y = d3.scaleBand()
      .domain(dates)
      .range([0, 600]) 
      .round(true)
      .paddingInner(2);
    //console.log(x)
    console.log(y.bandwidth());
    d3.select('.horizontal-bar-chart')
      .selectAll('rect') 
      .data(dataset)
      .join('rect')
      .classed('bar', true)
      .attr("y", d => y(d.state_name)) //.attr("y", d => y(d.state_name))
      .attr("x", x(0))
      .attr('height', 10)
      .attr('width', d => x(d.deaths))
    /*for (var i = 0; i < dataset.length; i++){
      console.log(dataset[i].state_name, ', ' + dataset[i].deaths);
    }*/
  })  
});