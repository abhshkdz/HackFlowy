var application_root = __dirname,
  express = require('express'),
  app = express(),
  path = require('path'),
  config = require('config'),
  orm = require('./orm').configure(config.get('database')),
  Tasks = require('./db/models/task').instance(orm),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static( path.join( application_root, 'public')));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

server.listen(config.get('port'), function() {
  console.log( 'Express server listening on port %d in %s mode', config.get('port'), app.settings.env );
});

app.get('/tasks', function(req,res){
  Tasks.all().success(function(tasks){
    res.send(tasks);
  });
});

app.post('/tasks', function(req,res){
  Tasks.create({
    content: req.body.content,
    parent: req.body.parent_id,
    is_completed: false,
  }).success(function(task){
    res.send(task);
  });
});

app.put('/tasks/:id', function(req,res){
  console.log(req.body.is_completed);
  Tasks.find(req.params.id).success(function(task){
    task.content = req.body.content;
    task.is_completed = req.body.is_completed;
    task.save().success(function(task){
      res.send(task);
    })
  });
});

app.delete('/tasks/:id', function(req,res){
  Tasks.find(req.params.id).success(function(task){
    task.destroy().success(function(){
        res.send('');
    });
  })
});

io.sockets.on('connection', function (socket) {
  socket.on('task', function (data) {
    socket.broadcast.emit('task', data);
  });
});
