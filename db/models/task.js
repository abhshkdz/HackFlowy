var Sequelize = require('sequelize');

module.exports = {
    instance: function(orm) {
        task = orm.define('Tasks', {
          id         : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
          content 	 : {type: Sequelize.TEXT, allowNull: false},
          parentId   : {type: Sequelize.INTEGER, defaultValue: 0},
          isCompleted: {type: Sequelize.BOOLEAN, defaultValue: false},
          priority   : {type: Sequelize.INTEGER, defaultValue: 0},
          createdAt  : Sequelize.DATE,
          updatedAt  : Sequelize.DATE,
        });

        orm.sync();
        return task;
    }
}
