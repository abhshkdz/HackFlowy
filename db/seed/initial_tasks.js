var config = require('config'),
  	orm = require('../../orm').configure(config.get('database')),
  	Tasks = require('../../db/models/task').instance(orm);

Tasks.bulkCreate([
    {content: 'Welcome to HackFlowy!', isCompleted: false},
    {content: 'An open-source WorkFlowy clone', isCompleted: false},
    {content: 'Built using Backbone + Socket.IO', isCompleted: false},
    {content: 'I pulled this together in a few hours to learn Backbone', isCompleted: false},
    {content: 'Feel free to try it out and hack on it', isCompleted: false},
    {content: 'Good Luck!', isCompleted: false}
]);

orm.sync();
