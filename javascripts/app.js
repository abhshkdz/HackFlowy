var app = app || {};

$(function(){

  var tasks = [
    {content: 'helloworld'},
    {content: 'wtf'},
    {content: 'rotterdam'},
    {content: 'hahahah'}
  ];

  new app.ListView(tasks);
});