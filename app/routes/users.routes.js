module.exports = app => {
    const users = require("../controllers/users.controller")
    let router = require("express").Router()
    router.post("/", users.register)
    router.post("/login", users.login)
    router.post("/logout", users.logout)

    app.use('/api/users', router)
}