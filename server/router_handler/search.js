// 搜索页路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 搜索列表
exports.getSearch = (req, res, next) => {
	const sql = `SELECT * FROM goods ORDER BY ${req.query.order} ${req.query.sort} LIMIT ${(req.query.page-1)*8},8`;
	db.query(sql, (err, results) => {
		if (err) return res.send({
			"code": 1,
			"message": "数据库操作失败",
			"err": err
		});
		res.send({
			"code": 0,
			"message": "获取search成功",
			"data": results
		});
	});
}