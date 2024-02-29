// 订单页路由接口文件

const express = require('express');
const router = express.Router();

// 导入订单页路由函数文件
const order_handler = require("../router_handler/order");

// 获取所有订单
router.get("/getAllOrder", order_handler.getAllOrder);

// 根据ID获取订单
router.get("/getOrderById", order_handler.getOrderById);

// 新建订单
router.post("/addOrder", order_handler.addOrder);

// 删除订单
router.post("/delOrder", order_handler.delOrder);

// 支付订单
router.post("/payOrder", order_handler.payOrder);

module.exports = router;