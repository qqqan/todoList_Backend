module.exports = (sequelize, Sequelize, DataTypes) => {
    const users = sequelize.define("users", {
        phoneNum: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        avatar: {
            type: DataTypes.STRING,
            default: "https: //wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
        }
    }, {
        timestamps: false
    })
    return users
}