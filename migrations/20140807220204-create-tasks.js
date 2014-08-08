module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable(
        'Tasks',
        {
          id         : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
          content    : {type: DataTypes.TEXT, allowNull: false},
          parent     : DataTypes.INTEGER,
          isCompleted: DataTypes.BOOLEAN,
          createdAt  : DataTypes.DATE,
          updatedAt  : DataTypes.DATE
        });
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('Tasks');
    done()
  }
}
