// 分类页路由接口文件

const express = require('express');
const router = express.Router();

// 导入分类页路由函数文件
const list_handler = require("../router_handler/list");

// 商品分类
router.get("/getClassify", list_handler.getClassify)

// 商品分类子项
router.get("/getClassifyItem", list_handler.getClassifyItem)

module.exports = router;