const express = require('express')
const app = new express()
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const cors = require("cors")
let = corsOptions = {
    origin: "http://localhost:5173"
}
app.use(cors(corsOptions))
const db = require("./app/models")
db.sequelize.sync()
require('./app/routes/users.routes')(app)
require('./app/routes/taskLists.routes')(app)
require('./app/routes/subTasks.routes')(app)
const verifyToken = require('./app/public/verifyToken')
// 放行登录接口
app.use((req, res, next) => {
    if (req.url === '/api/users/login') {
        next()
    } else {
        verifyToken(req, res, next)
    }
})

app.get('/', (req, res) => {
    res.json({ 'message': "todoList" })
})

app.listen(3000, () => {
    console.log('项目成功运行')
})