// 地址页路由接口文件

const express = require('express');
const router = express.Router(); // 路由对象

// 导入用户信息路由函数文件
const recevier_handler = require("../router_handler/receiver");

// 获取用户收货信息
router.get("/getReceiver", recevier_handler.getReceiver);

// 根据ID获取用户收货信息
router.get("/getReceiverById", recevier_handler.getReceiverById);

// 添加用户收货信息
router.post("/addReceiver", recevier_handler.addReceiver);

// 修改用户收货信息
router.post("/updateReceiver", recevier_handler.updateReceiver);

// 删除用户收货信息
router.post("/delReceiver", recevier_handler.deleteReceiver);

// 导入路由对象
module.exports = router;