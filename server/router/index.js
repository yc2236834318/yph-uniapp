// 首页路由接口文件

const express = require('express');
const router = express.Router();

// 导入首页路由函数文件
const index_handler = require("../router_handler/index");

// 轮播图
router.get("/getSwiper",index_handler.getSwiper)

// 顶部导航栏
router.get("/getTopbar", index_handler.getTopbar)

// 版图
router.get("/getBanner", index_handler.getBanner)

// 推荐
router.get("/getRecom", index_handler.getRecom)

// 宫格
router.get("/getIcons", index_handler.getIcons)

// 热销
router.get("/getHot", index_handler.getHot)

// 店铺
router.get("/getShop", index_handler.getShop)

// 猜你喜欢
router.get("/getGuess", index_handler.getGuess)

module.exports = router;