// 详情页路由接口文件

const express = require('express');
const router = express.Router();

// 导入详情页路由函数文件
const detail_handler = require("../router_handler/detail");

// 根据商品ID获取商品详情
router.get("/getGoodsByID", detail_handler.getGoodsByID)

module.exports = router;