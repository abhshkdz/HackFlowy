var config = require('config'),
    sequelize = require("sequelize"),
    orm = require('../../orm').configure(config.get('database')),
    Tasks = require('../../db/models/task').instance(orm),
    demoData = require('../../public/javascripts/data/demo.json');

// Create tables if they dont exist
Tasks.sync().then(function(){
    // fill demo data if it doesn't exist
    for (var i = 0; i < demoData.length; i++) {
        Tasks.findOrCreate({where: demoData[i]});
    }
});
