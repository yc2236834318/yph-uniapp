// 地址页路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 获取用户收货信息函数
exports.getReceiver = (req, res) => {
	// 定义查询语句
	const sql = "select * from receiver where uid=?";
	db.query(sql, req.auth.id, (err, results) => {
		if (err) return res.send({
			code: 1,
			message: "数据库操作失败",
			err
		});
		res.send({
			code: 0,
			message: "获取用户收货信息成功",
			data: results,
		});
	});
};

// 根据ID获取用户收货信息函数
exports.getReceiverById = (req, res) => {
	// 定义查询语句
	const sql = "select * from receiver where id=?";
	db.query(sql, req.query.id, (err, results) => {
		if (err) return res.send({
			code: 1,
			message: "数据库操作失败",
			err
		});
		res.send({
			code: 0,
			message: "获取用户收货信息成功",
			data: results,
		});
	});
};

// 添加用户收货信息
exports.addReceiver = (req, res) => {
	const {
		area,
		areaCode,
		address,
		phone,
		consignee,
		isdefault
	} = req.body;
	const uid = req.auth.id;
	const insertSql =
		`INSERT INTO receiver (uid, area, areaCode, address, phone, consignee, isdefault) VALUES (?, ?, ?, ?, ?, ?, ?)`;
	const insertParams = [uid, area, areaCode, address, phone, consignee, isdefault];
	db.query(insertSql, insertParams, (err, results) => {
		if (err) {
			console.error("数据库操作失败", err);
			return res.send({
				code: 1,
				message: "数据库操作失败"
			});
		}
		if (results.affectedRows !== 1) {
			return res.send({
				code: 1,
				message: "地址添加失败"
			});
		}
		// 获取最后插入的记录的 ID
		const lastInsertId = results.insertId;
		if (isdefault) {
			// 先将原本是默认地址的记录更新为非默认
			const updateSql = `UPDATE receiver SET isdefault = 0 WHERE uid = ? AND id <> ?`;
			db.query(updateSql, [uid, lastInsertId], (err, results) => {
				if (err) {
					console.error("数据库操作失败", err);
					return res.send({
						code: 1,
						message: "数据库操作失败"
					});
				}
				res.send({
					code: 0,
					message: "地址添加成功"
				});
			});
		} else {
			res.send({
				code: 0,
				message: "地址添加成功"
			});
		}
	});
};

// 修改用户收货信息
exports.updateReceiver = (req, res) => {
	const {
		area,
		areaCode,
		address,
		phone,
		consignee,
		isdefault,
		id
	} = req.body;
	const updateSql =
		`UPDATE receiver SET area=?, areaCode=?, address=?, phone=?, consignee=?, isdefault=? WHERE id=?`;
	const updateParams = [area, areaCode, address, phone, consignee, isdefault, id];
	db.query(updateSql, updateParams, (err, results) => {
		if (err) {
			console.error("数据库操作失败", err);
			return res.send({
				code: 1,
				message: "数据库操作失败"
			});
		}
		if (results.affectedRows !== 1) {
			return res.send({
				code: 1,
				message: "修改信息失败"
			});
		}
		// 如果设置为默认地址,则需要更新其他地址为非默认
		if (isdefault) {
			const uid = req.auth.id;
			const updateDefaultSql =
				`UPDATE receiver SET isdefault = CASE WHEN id = ? THEN 1 ELSE 0 END WHERE uid = ?`;
			db.query(updateDefaultSql, [id, uid], (err, results) => {
				if (err) {
					console.error("数据库操作失败", err);
					return res.send({
						code: 1,
						message: "数据库操作失败"
					});
				}
				res.send({
					code: 0,
					message: "修改信息成功"
				});
			});
		} else {
			res.send({
				code: 0,
				message: "修改信息成功"
			});
		}
	});
};

// 删除用户收货信息
exports.deleteReceiver = (req, res) => {
	const sql = `DELETE FROM receiver WHERE id=${req.body.id}`;
	db.query(sql, (err, results) => {
		if (err) return res.send({
			code: 1,
			message: "数据库操作失败",
			err
		});
		if (results.affectedRows !== 1) {
			return res.send({
				code: 1,
				message: "删除信息失败"
			});
		}
		res.send({
			code: 0,
			message: "删除信息成功"
		});
	});
};