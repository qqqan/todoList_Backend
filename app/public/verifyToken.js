const jwt = require('jsonwebtoken');
const secretKey = "123456"  // 引入密钥，需要根据实际情况修改

const verifyToken = (req, res, next) => {
    // 从请求头中获取 token
    const token = req.headers.token;

    // 如果没有 token，返回未授权错误
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token is required' });
    }

    try {
        // 验证 token 是否有效
        const decoded = jwt.verify(token, secretKey); // 使用相同的密钥进行解码，需要根据实际情况修改
        req.user = decoded; // 将解码后的用户信息存储到请求对象中
        next(); // 鉴权通过，继续执行下一个中间件或路由处理函数
    } catch (err) {
        // token 验证失败，返回错误信息
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
};

module.exports = verifyToken;