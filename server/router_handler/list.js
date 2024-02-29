// 分类页路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 商品分类
exports.getClassify = (req, res, next) => {
	const sql = "SELECT * FROM classify"
	db.query(sql, (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取classify成功",
			"data": results
		});
	});
}

// 商品分类子项
exports.getClassifyItem = (req, res, next) => {
	const sql =
		"SELECT ci.name AS name, JSON_ARRAYAGG(JSON_OBJECT('name', cl.name, 'imgUrl', cl.imgUrl)) AS data FROM classifyitem ci LEFT JOIN classifylist cl ON ci.id = cl.ciid WHERE ci.cid = ? GROUP BY ci.id;"
	db.query(sql, [req.query.id], (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取classifyItem成功",
			"data": results
		});
	});
}