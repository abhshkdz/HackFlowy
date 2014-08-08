var config = require('config'),
  	orm = require('../../orm').configure(config.get('database')),
  	Tasks = require('../../db/models/task').instance(orm);

Tasks.create({content: 'Welcome to HackFlowy!', isCompleted: false});
Tasks.create({content: 'An open-source WorkFlowy clone', isCompleted: false});
Tasks.create({content: 'Built using Backbone + Socket.IO', isCompleted: false});
Tasks.create({content: 'I pulled this together in a few hours to learn Backbone', isCompleted: false});
Tasks.create({content: 'Feel free to try it out and hack on it', isCompleted: false});
Tasks.create({content: 'Good Luck!', isCompleted: false});

orm.sync();
