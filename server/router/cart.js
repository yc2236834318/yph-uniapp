// 购物车路由接口文件

const express = require('express');
const router = express.Router();

// 导入购物车页路由函数文件
const cart_handler = require("../router_handler/cart");

// 根据用户ID获取购物车接口
router.get("/getCart", cart_handler.getCart);

// 根据商品ID添加到购物车接口
router.post("/addCart", cart_handler.addCart);

// 商品数量修改接口
router.post("/updateNum", cart_handler.updateNum);

// 商品删除接口
router.post("/deleteCart", cart_handler.deleteCart);

module.exports = router;