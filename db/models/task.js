var Sequelize = require('sequelize');

module.exports = {
    instance: function(orm) {
        task = orm.define('Tasks', {
          id         : {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4,},
          content 	 : {type: Sequelize.TEXT, allowNull: false},
          parentId   : {type: Sequelize.UUID, defaultValue: '00000000-0000-0000-0000-000000000000'},
          isCompleted: {type: Sequelize.BOOLEAN, defaultValue: false},
          priority   : {type: Sequelize.INTEGER, defaultValue: 0},
          isFolded     : {type: Sequelize.BOOLEAN, defaultValue: false},
          createdAt  : {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
          updatedAt  : {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        });

        orm.sync();
        return task;
    }
}
