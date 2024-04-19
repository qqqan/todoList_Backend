const dbConfig = require("../config/db.config.js")
const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect
    }
)

const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize
db.DataTypes = DataTypes
db.users = require('./users.model.js')(sequelize, Sequelize, DataTypes)
db.taskLists = require('./taskLists.model.js')(sequelize, Sequelize, DataTypes)
db.subTasks = require('./subTasks.model.js')(sequelize, Sequelize, DataTypes)
// 设置外键
db.users.hasMany(db.taskLists, {
    foreignKey: 'userId'
})
db.taskLists.hasMany(db.subTasks, {
    foreignKey: 'taskId'
})
db.taskLists.belongsTo(db.users, {
    foreignKey: 'userId'
})
db.subTasks.belongsTo(db.taskLists, {
    foreignKey: 'taskId'
})


module.exports = db