$(document).ready(function(){
    let message; 
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
  });