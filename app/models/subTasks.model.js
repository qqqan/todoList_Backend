module.exports = (sequelize, Sequelize, DataTypes) => {
    const subTasks = sequelize.define("subTasks", {
        finished: {
            type: DataTypes.BOOLEAN
        },
        title: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        time: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    })
    return subTasks
}