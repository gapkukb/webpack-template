const delay = require('mocker-api/lib/delay');
const user = require('./user.json');
const noProxy = process.env.NO_PROXY === 'true';

const proxy = {
    'GET /mocker/user': user.base,
    //支持路由参数:id
    'POST /mocker/user/:id': (req, res) => {
        //使用函数更灵活，可以添加逻辑判断，get参数req.params,post参数req.body
        //可以直接返回对象，也可以通过res.json返回json对象，还可以同时改变res.status也就是http code
        if (req.body.name === "") return {
            code: 400,
            message: "名字不能为空",
            data: {}
        }
        if (!req.body.sex) return res.status(400).json({
            code: 400,
            message: "名字不能为空",
            data: {}
        })
        return res.json({
            code: 200,
            message: null,
            data: {}
        })
    },
}
module.exports = (noProxy ? {} : delay(proxy, 1000));
