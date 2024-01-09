$(function(){
    console.log("Test");
    var text = $('.split');
    var split = new SplitText(text);
  
    function random(min, max){
      return (Math.random() * (max-min)) + min;
    }
  
    $(split.chars).each(function(i){
      TweenMax.from($(this), 3.5, {
        opacity:0,
        x:random(-1500,1500),
        y:random(-1500,1500),
        z:random(-1500,1500),
        scale:.2,
        delay:i*.01,
        yoyo:true,
        repeat:-1,
        repeatDelay:5
      });
    });
  
  });