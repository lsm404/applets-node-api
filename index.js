const express = require('express');
var https = require('https');
const fs = require('fs');
const cors = require('cors');
const app = express();
var { expressjwt } = require("express-jwt");
//配置跨域
app.use(cors())

/*
let privateKey = fs.readFileSync('./ssl/api.ntvuts.cn.key');
let certificate = fs.readFileSync('./ssl/api.ntvuts.cn_bundle.pem')
//配置https
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
*/

//开启token鉴权 - 已禁用，接口无需登录验证
// JWT认证中间件 - 保护后台管理接口
app.use(expressjwt({ 
    secret: "moyc^-^", 
    algorithms: ["HS256"],
    requestProperty: 'user', // 这是默认值，但明确指定
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless(function(req) {
    // 不需要认证的路径和方法组合
    const publicPaths = [
        // 查询接口（GET方法）- 无需认证
        {path: /\/api\/tools/, method: 'GET'},
        {path: /\/api\/tools\/search/, method: 'GET'},
        {path: /\/api\/tools\/\d+/, method: 'GET'}, // GET单个工具详情
        {path: /\/api\/categories/, method: 'GET'},
        {path: /\/api\/categories\/options/, method: 'GET'},
        
        // 其他公开接口
        {path: /\/api\/upload\/image$/, method: 'POST'},
        {path: /\/api\/upload\/images$/, method: 'POST'},
        {path: /\/api\/userLogin/, method: 'POST'},
        {path: /\/api\/userReg/, method: 'POST'},
        {path: /\/api\/admin\/login$/, method: 'POST'},
        {path: /\/images\//, method: 'GET'},
        {path: /\/uploads\//, method: 'GET'},
    ];
        
    // 检查当前请求是否匹配公开路径
    return publicPaths.some(item => {
        return item.path.test(req.url) && req.method === item.method;
    });
}))

//托管静态资源
app.use('/images', express.static('./images'))
app.use('/uploads', express.static('./uploads')) // 静态文件服务for上传的图片

//解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




//引入路由
app.use(require('./router.js'));


//全局错误中间件
app.use((err, req, res, next) => {
    //token验证为通过
    if (err.name === 'UnauthorizedError') {
        res.send({ code: 912, msg: '登录身份已失效，请重新登录' })
        //数据库错误
    } else if (err.name == 'DatabaseError') {
        res.send({ code: err.status, msg: err.message })
        //其他错误
    } else {
        console.log('----ERROR: ' + err.message);
        res.send({ code: 500, msg: '服务器错误' })
    }
})

/*
//https开启服务器
httpsServer.listen(8088, function() {
    console.log('HTTPS Server is running ok', 8088);
});
*/
app.listen(8088, () => {
    // console.log("The server started successfully and is running on port 8088");
    console.log("Success by http://127.0.0.1:8088");
})