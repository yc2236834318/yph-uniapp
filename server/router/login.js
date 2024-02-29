// 登录页路由接口文件

const express = require('express');
const router = express.Router();

// 导入详情页路由函数文件
const login_handler = require("../router_handler/login");
// 导入数据验证模块(安装命令 npm i @escook/express-joi)
const expressJoi = require("@escook/express-joi");
// 导入验证规则对象(schema/user)
const {
	reg_login_schema
} = require("../schema/user");

// 查询用户
router.post("/tel", login_handler.checkTel);

// 用户注册(有数据验证)
router.post("/reg", expressJoi(reg_login_schema), login_handler.regUser);

// 用户登录
router.post("/log", login_handler.login);

module.exports = router;