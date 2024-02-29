// 分类页路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 根据商品ID获取商品详情
exports.getGoodsByID = (req, res, next) => {
	const sql = "SELECT * FROM goods WHERE goods.id = ?"
	db.query(sql, [req.query.id], (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取goods成功",
			"data": results[0]
		});
	});
}