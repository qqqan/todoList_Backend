module.exports = (sequelize, Sequelize, DataTypes) => {
    const taskLists = sequelize.define("taskLists", {
        finished: {
            type: DataTypes.BOOLEAN
        },
        title: {
            type: DataTypes.STRING
        },
        desc: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        time: {
            type: DataTypes.STRING
        },
        alarm: {
            type: DataTypes.STRING
        },
        repeat: {
            type: DataTypes.STRING
        },
        finishedDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    }, {
        timestamps: false
    })
    return taskLists
}