$(function(){
  $('.js-auto-expand').textareaAutoExpand();

  // $('.main').nestable();

  $('.handle').toolbar({
    content: '#toolbar',
    position: 'left',
    hideOnClick: true
  }).on('toolbarItemClick', function(e){
    console.log('toolbar item clicked: ' + e.class);
  });

  // MathJax typesetter
  typeset = function(nodeID){
    MathJax.Hub.Queue(["Typeset", MathJax.Hub], nodeID);
  };

  // Bullet outline on hover
  $('.handle a').hover(function(){
    // mouse enter
    $(this).children('img').attr('src', 'img/bullet-combined.png');
  },
  function(){
    // mouse leave
    $(this).children('img').attr('src', 'img/bullet-8.png');
  });

  // Fix for tab border-radius
  // $('.ui-tabs .ui-tabs-nav li a').click(function(){
  //   var idx = $("ul li.ui-state-active").index();
  //   console.log(idx);
  //   if( idx !== 0){
  //     $('tabs-' + (idx+1)).css('border-radius', '5px 5px 5px 5px');
  //   }
  //   else{
  //     $('tabs-' + (idx+1)).css('border-radius', '0px 5px 5px 5px');
  //   }
  // });
});