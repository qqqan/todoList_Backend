const db = require("../models")
const SubTasks = db.subTasks
const TaskLists = db.taskLists

// 新增subtask
exports.add = (req, res) => {
    if (!req.body.taskId) {
        res.status(400).send({
            message: "任务id不能为空"
        })
        return
    }
    const today = new Date()
    const subTask = {
        taskId: req.body.taskId,
        finished: req.body.finished,
        title: req.body.title,
        date: req.body.date || today.toISOString().split('T')[0],
        time: req.body.time,
    }
    TaskLists.findByPk(subTask.taskId)
        .then(task => {
            if (!task) {
                res.status(400).send({
                    message: "当前任务id不存在"
                });
                return
            }

            SubTasks.create(subTask)
                .then(data => {
                    res.send({
                        code: 200,
                        message: "子任务创建成功",
                    })
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "创建任务出错"
                    })
                })
        })
        .catch(err => {
            // 处理查询过程中的错误
            console.error("查询任务时出错:", err);
            return res.status(500).send({
                message: "服务器错误"
            });
        });


}

// 获取全部数据
exports.findAll = (req, res) => {
    const { taskId } = req.query;
    if (!taskId) {
        res.status(400).send({
            message: "任务id不能为空"
        })
        return
    }

    SubTasks.findAll({ where: { taskId: taskId } })
        .then(data => {
            res.send({
                code: 200,
                message: "获取数据成功",
                data: data
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                message: "服务器错误"
            });
        });
}


// 删除任务
exports.delete = (req, res) => {
    const { id } = req.query
    if (!id) {
        res.status(400).send({
            message: "任务id不能为空"
        })
        return
    }

    SubTasks.destroy({ where: { id: id } }).then((data) => {
        if (data === 1) {
            res.send({
                code: 200,
                message: "任务删除成功"
            })
        } else {
            res.status(404).send({
                message: `找不到id为${id}的任务`
            })
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "删除任务时出错"
        })
    })
}

// 修改任务
exports.update = (req, res) => {
    if (!req.body.id) {
        res.status(400).send({
            message: "任务id不能为空"
        });
        return;
    }
    let id = req.body.id;

    SubTasks.update(req.body, { where: { id: id } })
        .then((result) => {
            if (result[0] === 1) {
                res.send({
                    code: 200,
                    message: "任务更新成功"
                });
            } else {
                res.status(404).send({
                    message: `找不到id为${id}的任务`
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "更新任务时出错"
            });
        });
};