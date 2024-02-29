// 搜索页路由接口文件

const express = require('express');
const router = express.Router();

// 导入首页路由函数文件
const search_handler = require("../router_handler/search");

// 商品搜索
router.get("/getSearch", search_handler.getSearch)

module.exports = router;