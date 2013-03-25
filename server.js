var application_root = __dirname,
  express = require('express'),
  path = require('path'),
  mysql = require('mysql'),
  config = require('./config');

var client = mysql.createConnection({
  host: 'localhost',
  user: config.db_user,
  password: config.db_password
});

client.query('USE '+config.db_name);

var app = express();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static( path.join( application_root, 'public')));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.get('/tasks', function(req,res){
  client.query("SELECT * FROM tasks", function select(err,tasks){
    if (err)
      res.send(err);
    console.log('Initialized');
    res.send(tasks);
  });
});

app.get('/tasks/:id', function(req,res){
  client.query("SELECT * FROM tasks WHERE id = ?", [req.params.id], function select(err, task) {
    if (err)
      res.send(err);
    console.log('Fetched');
    res.send(task);
  });
});

app.post('/tasks', function(req,res){
  var content = req.body.content;
  var parent = req.body.parent;
  var timestamp = Math.round((new Date()).getTime()/1000);
  client.query("INSERT INTO tasks (content, timestamp) VALUES (?,?)", [content,timestamp], function insert(err, task){
    if (err)
      res.send(err);
    console.log('Inserted');
    res.send(req.body);
  });
});

app.put('/tasks/:id', function(req,res){
  var content = req.body.content;
  var parent = req.body.parent;
  var timestamp = Math.round((new Date()).getTime()/1000);
  client.query("UPDATE tasks SET content = ? AND timestamp = ? WHERE id = ?", [content,timestamp,req.params.id], function(err, task){
    if (err)
      res.send(err);
    console.log('Updated');
    res.send(req.body);
  });
});

app.delete('/tasks/:id', function(req,res){
  client.query("DELETE FROM tasks WHERE id = ?", [req.params.id], function(err, task){
    if (err)
      res.send(err);
    console.log('Removed');
    res.send('');
  })
});

var port = 4711;
app.listen(port, function() {
  console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});