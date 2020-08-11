const delay = require('mocker-api/lib/delay');
const data = require('./data.json');

const noProxy = false;
const proxy = {
  'GET /user': data.base,
  'POST /user/:id': (req, res) => {
    if (req.body.name === '') {
      return {
        code: 400,
        message: '名字不能为空',
        data: {},
      };
    }
    if (!req.body.sex) {
      return res.status(400).json({
        code: 400,
        message: '性别不能为空',
        data: {},
      });
    }
    return res.json({
      code: 200,
      message: null,
      data: {},
    });
  },
};
module.exports = noProxy ? proxy : delay(proxy, 2000);
