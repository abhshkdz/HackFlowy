var application_root = __dirname,
  express = require('express'),
  app = express(),
  path = require('path'),
  config = require('./config'),
  mysql = require('mysql'),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);

var client = mysql.createConnection({
  host: 'localhost',
  user: config.db_user,
  password: config.db_password
});

client.query('USE '+config.db_name);

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static( path.join( application_root, 'public')));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

var port = 3000;
server.listen(port, function() {
  console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});

app.get('/tasks', function(req,res){
  client.query("SELECT * FROM tasks", function select(err,tasks){
    res.send(tasks);
  });
});

app.post('/tasks', function(req,res){
  var timestamp = Math.round((new Date()).getTime()/1000);
  client.query("INSERT INTO tasks (content, timestamp, parent_id) VALUES (?,?,?)", [req.body.content,timestamp,req.body.parent_id]);
  client.query("SELECT * FROM tasks WHERE content = ?", [req.body.content], function select(err,task){
    req.body.id = task[0].id;
    res.send(req.body);
  });
});

app.put('/tasks/:id', function(req,res){
  var timestamp = Math.round((new Date()).getTime()/1000);
  client.query("UPDATE tasks SET content = ?, timestamp = ?, parent_id = ? WHERE id = ?", [req.body.content,timestamp,req.body.parent_id,req.body.id], function(err, task){
    req.body.timestamp = timestamp;
    res.send(req.body);
  });
});

app.delete('/tasks/:id', function(req,res){
  client.query("DELETE FROM tasks WHERE id = ?", [req.params.id], function(err, task){
    res.send('');
  })
});

io.sockets.on('connection', function (socket) {
  socket.on('task', function (data) {
    socket.broadcast.emit('task', data);
  });
});