module.exports = app => {
    const subTasks = require("../controllers/subTasks.controller")
    let router = require("express").Router()
    router.post("/", subTasks.add)
    router.get("/", subTasks.findAll)
    router.delete("/delete", subTasks.delete)
    router.patch("/update", subTasks.update)

    app.use('/api/subtasks', router)
}