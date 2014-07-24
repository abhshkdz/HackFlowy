$(function(){
  // to hide
  hideSidebar = function(){
    $('#sidebar').attr('hidden', 'true');
    $('#panel-col').toggleClass('col-md-offset-2');
  }

  // to show
  showSidebar = function(){
    $('#sidebar').attr('hidden', 'false');
    $('#panel-col').toggleClass('col-md-offset-2');
  }
})