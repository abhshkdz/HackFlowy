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
    errorHandler = require('errorhandler');


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
    return Tasks.all().then(function (tasks) {
        return res.send(tasks);
    });
});

app.post('/tasks', function (req, res) {
    console.log({view: "post('/tasks/:id)", id:req.params.id, body:req.body});
    return Tasks.create({
        content: req.body.content,
        parentId: req.body.parentId || '00000000-0000-0000-0000-000000000000',
        isCompleted: false
    }).then(function (task) {
        return res.send(task);
    });
});

app.put('/tasks', function (req, res) {
    console.log({view: "put('/tasks/:id)", id:req.params.id, body:req.body});
    return Tasks.create({
        content: req.body.content,
        parentId: req.body.parentId || '00000000-0000-0000-0000-000000000000',
        isCompleted: false
    }).then(function (task) {
        return res.send(task);
    });
});

app.get('/tasks/:id', function (req, res) {
    console.log({view: "get('/tasks/:id)", id:req.params.id, body:req.body});
    return Tasks.findById(req.params.id).then(function (task) {
            return res.send(task);
    });
});

app.put('/tasks/:id', function (req, res) {
    console.log({view: "put('/tasks/:id)", id:req.params.id, body:req.body});
    Tasks.findById(req.params.id).then(function (task) {
        task.content = req.body.content;
        task.priority = req.body.priority;
        task.parentId = req.body.parentId ||  '00000000-0000-0000-0000-000000000000';
        task.isFolded = req.body.isFolded == true;
        task.isCompleted = req.body.isCompleted == true;
        return task.save().then(function (task) {
            return res.send(task);
        });
    });
});

app.delete('/tasks/:id', function (req, res) {
    console.log({view: "delete('/tasks/:id)", id:req.params.id, body:req.body});
    console.log({isCompleted: req.body.isCompleted});
    Tasks.findById(req.params.id).then(function (task) {
        return task.destroy().then(function () {
            return res.send('');
        });
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('task', function (data) {
        socket.broadcast.emit('task', data);
    });
});
