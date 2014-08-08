var Sequelize = require('sequelize');

module.exports = {
    instance: function(orm) {
        task = orm.define('Tasks', {
          id 		     : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
          content 	 : {type: Sequelize.TEXT, allowNull: false},
          parent 	   : Sequelize.INTEGER,
          isCompleted: Sequelize.BOOLEAN,
          createdAt  : Sequelize.DATE,
          updatedAt  : Sequelize.DATE 
        });

        orm.sync();
        return task;
    }
}
