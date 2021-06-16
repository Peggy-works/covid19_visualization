$(document).ready(function(){ 
    let message; 
    var margin = {top: 20, right: 30, bottom: 40, left: 90};
    var width = 760 - margin.left - margin.right; //460, 400
    var height = 600 - margin.top - margin.bottom;
  
    var svg = d3.select("#total_deaths")
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");
    $(window).scroll(function(event){ 
      //message = 'oh my lord we are fucking getting scrolled on!'; 
      var $window = $(window);
      var $body = $('body');
      var $head = $('.head-container');
      var height = Math.round($window.height()/2);
      //console.log(height);
      //console.log($window.scrollTop() + ', ' + $window.height(), + ", " + ($window.height()/3));
      if ($window.scrollTop() > height){
        $body.addClass('color-brown');
      } else if ($window.scrollTop() < height) {
        $body.removeClass('color-brown');
      }
      //console.log(message);
    });
    console.log("?");
    var csv_file = 'NYT_covid19_deaths.csv'; 
    d3.csv(csv_file).then(function(data){
      
      /*for (var i = 0; i < data.length; i++){
        console.log(data[i].state_name + ", " + data[i].deaths);
      }*/
      dataset = data.sort(function(a, b){ 
        //console.log(typeof(a.deaths));
        return d3.descending(parseInt(a.deaths), parseInt(b.deaths))
      })
  
      // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 13000])
      .range([ 0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
  
    // Y axis
    var y = d3.scaleBand()
      .range([ 0, height ])
      .domain(data.map(function(d) { return d.state_name; }))
      .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))
  
    //Bars
    svg.selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0) )
      .attr("y", function(d) { return y(d.state_name); })
      .attr("width", function(d) { return x(d.deaths); })
      .attr("height", y.bandwidth() )
      .attr("fill", "#69b3a2")
      for (var i = 0; i < dataset.length; i++){
        console.log(dataset[i].state_name, ', ' + dataset[i].deaths);
      }
    })  
  });