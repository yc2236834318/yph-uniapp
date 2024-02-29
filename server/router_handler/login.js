// 登录页路由函数文件

// 导入数据库文件
const db = require("../db/index");
// 导入令牌模块(安装命令 npm i jsonwebtoken express-jwt)
const jwt = require("jsonwebtoken");
// 导入全局配置
const config = require("../config");
// 导入密码加密模块(安装命令 npm i bcryptjs@2.4.3)
const bcrypt = require("bcryptjs");

// 查询账号函数
exports.checkTel = (req, res) => {
	// 验证账号是否已存在
	const sqlStr = "select * from users where username=?";
	db.query(sqlStr, req.body.tel, (err, results) => {
		if (err) {
			return res.send({
				code: 1,
				message: "数据库链接失败 ",
				err
			});
		}
		if (results.length > 0) {
			// 手机号已注册
			return res.send({
				code: 0,
				message: "手机号已注册",
				data: true
			});
		} else {
			// 手机号未注册
			return res.send({
				code: 0,
				message: "手机号未注册",
				data: false
			});
		}
	});
};

// 注册函数
exports.regUser = (req, res) => {
	const userinfo = req.body; // 获取客户端提交的信息
	// (1)验证账号是否已存在
	const sqlStr = "select * from users where username=?";
	db.query(sqlStr, userinfo.username, (err, results) => {
		// 查询数据库中该账号是否存在
		if (err) {
			return res.send({
				code: 1,
				message: "数据库链接失败 ",
				err
			});
		}
		if (results.length > 0) {
			// 查询结果长度不为0则表示账号已存在
			return res.send({
				code: 1,
				message: "注册失败,账号已存在"
			});
		}
		// (2)将用户密码加密
		userinfo.password = bcrypt.hashSync(userinfo.password, 10);
		// (3)新建用户
		const sql = "insert into users set ?"
		const nickname = "用户" + String(Date.now()).slice(-8)
		db.query(
			sql, {
				username: userinfo.username,
				password: userinfo.password,
				nickname: nickname,
			},
			(err, results) => {
				if (err) return res.send({
					code: 1,
					message: "数据库操作失败",
					err
				});
				if (results.affectedRows !== 1) {
					// 新建用户失败
					return res.send({
						code: 1,
						message: "用户注册失败"
					});
				}
				// 新建用户成功
				const uid = results.insertId; // 获取新注册用户的ID
				// (4)创建对应的购物车
				const cartSql = "insert into cart set ?";
				db.query(
					cartSql, {
						uid: uid, // 使用新注册用户ID关联购物车
					},
					(cartErr, cartResults) => {
						if (cartErr) {
							console.error("创建购物车失败:", cartErr);
						}
						// 注册成功
						res.send({
							code: 0,
							message: "注册成功"
						});
					}
				);
			}
		);
	});
};

// 登录函数
exports.login = (req, res) => {
	const userinfo = req.body; // 获取用户提交信息
	const sql = "select * from users where username=?";
	// (1)验证用户信息
	db.query(sql, userinfo.username, (err, results) => {
		if (err) return res.send({
			code: 1,
			message: "数据库操作失败"
		});
		if (results.length !== 1) {
			// 查询账号结果不为1
			return res.send({
				code: 1,
				message: "账号不存在"
			});
		}
		// 判断密码是否正确
		// 格式 bcrypt.compareSync(用户提交的密码, 数据库加密过的密码)
		// 匹配为true,不匹配为false
		const compare = bcrypt.compareSync(userinfo.password, results[0].password);
		if (!compare) return res.send({
			code: 1,
			message: "账号或密码错误"
		});
		// (2)登录成功后生成token令牌
		// 获取用户信息并将密码置空
		const user = {
			...results[0],
			password: ""
		};
		// 生成加密令牌
		const tokenStr = jwt.sign(user, config.jwtSecretKey, {
			expiresIn: config.expiresIn, // 令牌有效期
		});
		// 响应数据
		res.send({
			code: 0,
			message: "登录成功",
			data: {
				id: results[0].id,
				username: results[0].username,
				nickname: results[0].nickname,
				faceImgUrl: results[0].faceImgUrl,
				balance: results[0].balance,
			},
			token: "Bearer " + tokenStr,
		});
	});
};