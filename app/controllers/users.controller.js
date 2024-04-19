const db = require("../models")
const Users = db.users
const jwt = require('jsonwebtoken')

// 注册
exports.register = (req, res) => {
    if (!req.body.phoneNum) {
        res.status(400).send({
            message: "手机号不能为空"
        })
        return
    }
    if (!req.body.password) {
        res.status(400).send({
            message: "密码不能为空"
        })
        return
    }
    const user = {
        phoneNum: req.body.phoneNum,
        password: req.body.password
    }

    Users.findAll({ where: { phoneNum: user.phoneNum } }).then(data => {
        if (data.length > 0) {
            res.status(400).send({
                message: "该手机号已注册"
            })
            return; // 退出函数，防止继续执行下面的代码
        }

        // 如果没有找到用户，继续执行创建用户的逻辑
        Users.create(user).then(data => {
            res.send({
                code: 200,
                message: "用户创建成功",
                data: data
            })
        }).catch(err => {
            res.status(500).send({
                message: err.message || "创建用户出错"
            })
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "查找用户出错"
        })
    })
}

// 登录
exports.login = (req, res) => {
    const { phoneNum, password } = req.body;
    if (!phoneNum || !password) {
        res.status(403).send({
            message: "手机号或密码不能为空"
        });
        return; // 加上return来确保不再执行后续代码
    }

    Users.findOne({ where: { phoneNum: phoneNum, password: password } })
        .then(data => {
            if (data !== null) {
                const payload = { id: data.id, phoneNum: data.phoneNum };
                const secretKey = '123456';
                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); //1h后token过期
                res.send({
                    token: token,
                    code: 200,
                    message: "登陆成功",
                    data: data  // 返回用户数据
                });
            } else {
                res.status(400).send({
                    message: "手机号或密码错误"
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({
                message: "服务器错误"
            });
        });
};

// 退出登录
exports.logout = (req, res) => {
    res.clearCookie('token')
    res.send({
        code: 0,
        message: "退出成功"
    })

}
