var application_root = __dirname,
    express = require('express'),
    app = express(),
    path = require('path'),
    config = require('config'),
    orm = require('./orm').configure(config.get('database')),
    Tasks = require('./db/models/task').instance(orm),
    server = require('http').createServer(app),
    socket = require('socket.io'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorhandler = require('errorhandler');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(path.join(application_root, 'public')));

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler({
      dumpExceptions: true,
      showStack: true
  }));
}


var port = process.env.PORT || config.get('port');
server.listen(port, function () {
    console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});
var io = socket.listen(server);

app.get('/tasks', function (req, res) {
    Tasks.all().then(function (tasks) {
        res.send(tasks);
    });
});

app.post('/tasks', function (req, res) {
    Tasks.create({
        content: req.body.content,
        parentId: parseInt(req.body.parentId) || 0,
        isCompleted: false
    }).then(function (task) {
        res.send(task);
    });
});

app.get('/tasks/:id', function (req, res) {
    Tasks.findById(req.params.id).then(function (task) {
            res.send(task);
    });
});

app.put('/tasks/:id', function (req, res) {
    console.log({isCompleted: req.body.isCompleted});
    Tasks.findById(req.params.id).then(function (task) {
        task.content = req.body.content;
        console.log({view: "put('/tasks/:id)", body:req.body});
        task.parentId = parseInt(req.body.parentId) || 0,
            task.isCompleted = req.body.isCompleted == 1;
        task.save().then(function (task) {
            res.send(task);
        })
    });
});

app.delete('/tasks/:id', function (req, res) {
    Tasks.findById(req.params.id).then(function (task) {
        task.destroy().then(function () {
            res.send('');
        });
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('task', function (data) {
        console.log(data);
        socket.broadcast.emit('task', data);
    });
});
