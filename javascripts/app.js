var app = app || {};
var ENTER_KEY = 13;

$(function(){

  var tasks = [
    {content: 'helloworld'},
    {content: 'wtf'},
    {content: 'rotterdam'},
    {content: 'hahahah'}
  ];

  new app.ListView(tasks);
});