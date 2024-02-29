// 用户页路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 导入密码加密模块
const bcrypt = require("bcryptjs");

// 获取用户信息函数
exports.getUserInfo = (req, res) => {
	// 定义查询语句(排除密码)
	const sql =
		"select id,username,nickname,faceImgUrl,balance from users where id=?";
	db.query(sql, req.auth.id, (err, results) => {
		if (err) return res.send({
			code: 1,
			message: "数据库操作失败"
		});
		if (results.length < 1) {
			return res.send({
				code: 1,
				message: "未查询到用户信息"
			});
		}
		res.send({
			code: 0,
			message: "获取用户信息成功",
			data: results[0],
		});
	});
};

// 修改用户昵称函数
exports.updateNickName = (req, res) => {
	const sql = `update users set nickname='${req.body.nickname}' where id=${req.auth.id}`;
	db.query(sql, (err, results) => {
		if (err) return res.send({
			code: 1,
			message: "数据库操作失败"
		});
		if (results.affectedRows !== 1) {
			return res.send({
				code: 1,
				message: "修改昵称失败"
			});
		}
		res.send({
			code: 0,
			message: "修改昵称成功"
		});
	});
};

// 修改用户密码函数
exports.updatePassword = (req, res) => {
	const sql = "select * from users where id=?";
	db.query(sql, req.auth.id, (err, results) => {
		// 查询数据库用户信息
		if (err) return res.send({
			code: 1,
			message: "数据库操作失败"
		});
		// 判断用户是否存在
		if (results.length !== 1) {
			return res.send({
				code: 1,
				message: "用户不存在"
			});
		}
		// 判断用户输入的旧密码是否正确
		const compare = bcrypt.compareSync(req.body.oldPwd, results[0].password);
		if (!compare) return res.send({
			code: 1,
			message: "原密码错误"
		});
		// 修改用户密码
		const sql = "update users set password=? where id=?";
		const newPwd = bcrypt.hashSync(req.body.newPwd, 10); // 加密新密码
		db.query(sql, [newPwd, req.auth.id], (err, results) => {
			if (err) return res.send({
				code: 1,
				message: "数据库操作失败"
			});
			if (results.affectedRows !== 1) {
				return res.send({
					code: 1,
					message: "修改密码失败"
				});
			}
			res.send({
				code: 0,
				message: "修改密码成功"
			});
		});
	});
};

// 修改用户头像函数
exports.updateAvatar = (req, res) => {
	// 判断是否成功保存图片
	if (!req.file) {
		return res.send({
			code: 1,
			message: "图片保存失败"
		});
	}
	// 取出头像路径 注意 \/为一个斜线
	const avatar = "\/static\/avatar\/" + req.file.filename;
	const sql = `UPDATE users SET faceImgUrl=? WHERE id=?`;
	db.query(sql, [avatar, req.auth.id], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({
				code: 1,
				message: "数据库操作失败"
			});
		}
		if (results.affectedRows !== 1) {
			return res.status(400).json({
				code: 1,
				message: "修改头像失败"
			});
		}
		res.json({
			code: 0,
			message: "修改头像成功",
			data: {
				avatar: avatar
			},
		});
	});
};