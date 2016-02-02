var config = require('config'),
    orm = require('../../orm').configure(config.get('database')),
    Tasks = require('../../db/models/task').instance(orm),
    demoData = require('../../public/javascripts/data/demo.json');

Tasks.destroy({where: {}}).then(function() {
    Tasks.bulkCreate(demoData);
});

orm.sync();
