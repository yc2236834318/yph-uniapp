// 首页路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 轮播图
exports.getSwiper = (req, res, next) => {
	const sql = "SELECT * FROM swiper";
	db.query(sql, (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取swiper成功",
			"data": results
		});
	});
}

// 顶部导航栏
exports.getTopbar = (req, res, next) => {
	const sql = "SELECT * FROM topbar";
	db.query(sql, (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取topbar成功",
			"data": results
		});
	});
}

// 版图
exports.getBanner = (req, res, next) => {
	const sql = "SELECT * FROM banner";
	db.query(sql, (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取banner成功",
			"data": results
		});
	});
}

// 推荐
exports.getRecom = (req, res, next) => {
	const sql = "SELECT * FROM recommend";
	db.query(sql, (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取recom成功",
			"data": results
		});
	});
}

// 宫格
exports.getIcons = (req, res, next) => {
	const sql = "SELECT * FROM icons";
	db.query(sql, (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取icons成功",
			"data": results
		});
	});
}

// 热销
exports.getHot = (req, res, next) => {
	const sql =
		"SELECT g.id, g.imgUrl, g.name, g.price, g.oprice, g.discount, g.sales FROM hot h JOIN goods g ON h.goodsId = g.id;"
	db.query(sql, (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取hot成功",
			"data": results
		});
	});
}

// 店铺
exports.getShop = (req, res, next) => {
	const sql =
		"SELECT shop.bigUrl, JSON_ARRAYAGG(JSON_OBJECT('id', g.id,'imgUrl', g.imgUrl,'name', g.name,'price', g.price,'oprice', g.oprice,'discount', g.discount,'sales', g.sales)) AS data FROM shopItem si JOIN shop ON si.sId = shop.id JOIN goods g ON si.gId = g.id GROUP BY shop.id;"
	db.query(sql, (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取shop成功",
			"data": results
		});
	});
}

// 猜你喜欢
exports.getGuess = (req, res, next) => {
	const sql =
		"SELECT g.id, g.imgUrl, g.name, g.price, g.oprice, g.discount, g.sales FROM guess gu JOIN goods g ON gu.goodsId = g.id LIMIT ?,?;"
	db.query(sql, [req.query.start * 1, req.query.num * 1], (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取guess成功",
			"data": results
		});
	});
}