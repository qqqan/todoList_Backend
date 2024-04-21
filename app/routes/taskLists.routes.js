module.exports = app => {
    const taskLists = require("../controllers/taskLists.controller")
    let router = require("express").Router()
    router.post("/", taskLists.add)
    router.get("/", taskLists.findAll)
    router.get("/detail", taskLists.findOne)
    router.delete("/delete", taskLists.delete)
    router.patch("/update", taskLists.update)
    router.post("/calender", taskLists.findFinishedTasksInMonth)
    router.patch("/updateFinished", taskLists.updateFinished)

    app.use('/api/tasklists', router)
}