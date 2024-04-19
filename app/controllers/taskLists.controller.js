const { Op, where } = require("sequelize")
const db = require("../models")
const { request } = require("express")
const TaskLists = db.taskLists
const Users = db.users

// 新增task
exports.add = (req, res) => {
    if (!req.body.userId) {
        res.status(400).send({
            code: 400,
            message: "用户id不能为空"
        })
        return
    }
    const today = new Date()
    const task = {
        userId: req.body.userId,
        finished: req.body.finished,
        title: req.body.title,
        desc: req.body.desc,
        date: req.body.date || today.toISOString().split('T')[0],
        time: req.body.time,
        alarm: req.body.alarm,
        repeat: req.body.repeat,
        finishedDate: req.body.date || "",
    }

    TaskLists.create(task).then(data => {
        res.send({
            code: 200,
            message: "任务创建成功",
            data: data
        })
    }).catch(err => {
        res.status(500).send({
            code: 500,
            message: err.message || "创建任务出错"
        })
    })
}

// 获取全部数据
exports.findAll = (req, res) => {
    const { userId } = req.query
    if (!userId) {
        res.status(400).send({
            code: 400,
            message: "用户id不能为空"
        })
        return
    }

    Users.findByPk(userId).then(data => {
        if (data === null) {
            res.status(400).send({
                code: 400,
                message: "该用户不存在"
            })
        } else {
            TaskLists.findAll({ where: { userId: userId } })
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
                        code: 500,
                        message: "服务器错误"
                    });
                });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send({
            code: 500,
            message: "服务器错误"
        });
    });

}

// 获取任务详情
exports.findOne = (req, res) => {
    const { id } = req.query
    if (!id) {
        res.status(400).send({
            code: 400,
            message: "任务id不能为空"
        })
        return
    }

    TaskLists.findByPk(id).then((data) => {
        if (data) {
            res.send({
                code: 200,
                message: "获取任务详情成功",
                data: data
            })
        } else {
            res.status(404).send({
                code: 400,
                message: "当前id查询不到数据"
            })
        }
    }).catch((err) => {
        res.status(500).send({
            code: 500,
            message: err.message || "查询当前数据出错"
        })
    })
}


// 删除任务
exports.delete = (req, res) => {
    const { id } = req.query
    if (!id) {
        res.status(400).send({
            code: 400,
            message: "任务id不能为空"
        })
        return
    }

    TaskLists.destroy({ where: { id: id } }).then((data) => {
        if (data === 1) {
            res.send({
                code: 200,
                message: "任务删除成功"
            })
        } else {
            res.status(404).send({
                code: 404,
                message: `找不到id为${id}的任务`
            })
        }
    }).catch((err) => {
        res.status(500).send({
            code: 500,
            message: err.message || "删除任务时出错"
        })
    })
}

// 修改任务
exports.update = (req, res) => {
    if (!req.body.id) {
        res.status(400).send({
            code: 400,
            message: "任务id不能为空"
        });
        return;
    }
    let id = req.body.id;
    TaskLists.update(req.body, { where: { id: id } })
        .then((result) => {
            if (result[0] === 1) {
                res.send({
                    code: 200,
                    message: "任务更新成功"
                });
            } else {
                res.status(404).send({
                    code: 400,
                    message: `找不到id为${id}的任务`
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                code: 500,
                message: err.message || "更新任务时出错"
            });
        });
};



// 获取某一个月所有已完成的任务
function groupTasksByDate(taskLists) {
    let grouped = {}
    taskLists.forEach(task => {
        const finishedDate = task.finishedDate

        if (!grouped[finishedDate]) {
            grouped[finishedDate] = []
        }
        grouped[finishedDate].push(task)
    });
    return grouped
}

exports.findFinishedTasksInMonth = (req, res) => {
    if (!req.body.userId) {
        res.status(400).send({
            code: 400,
            message: "用户id不能为空"
        })
        return
    }
    const { userId, year, month } = req.body

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    TaskLists.findAll({
        where: {
            userId: userId,
            finished: true,
            finishedDate: {
                [Op.between]: [startDate, endDate]
            }
        }
    }).then((data) => {
        res.send({
            code: 200,
            message: "获取数据成功",
            data: groupTasksByDate(data)
        })
    }).catch(error => {
        res.status(500).send({
            code: 500,
            message: error.message || "服务器出错"

        })
    })
}
