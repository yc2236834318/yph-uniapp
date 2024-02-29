// 购物车路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 根据用户ID获取购物车函数
exports.getCart = (req, res) => {
	// 查询购物车信息
	const cartSql = `select id from cart where uid=${req.auth.id}`;
	db.query(cartSql, (cartErr, cartResults) => {
		if (cartErr) {
			console.error("获取购物车失败:", cartErr);
			return res.send({
				code: 1,
				message: "获取购物车失败"
			});
		}
		// 若用户没有购物车
		if (cartResults.length === 0) {
			return res.send({
				code: 0,
				message: "购物车为空",
				data: [],
			});
		}
		const cartId = cartResults[0].id;
		// 查询购物车子项信息
		const sql = `
		  SELECT ci.id, ci.gid, ci.goodsNum, ci.goodsType, g.name, g.price, g.imgUrl, g.discount, g.shop
		  FROM cartitem AS ci
		  LEFT JOIN goods AS g ON ci.gid = g.id
		  WHERE ci.cid = ${cartId}
		`;
		db.query(sql, (err, results) => {
			if (err) {
				console.error("获取购物车项失败:", err);
				return res.send({
					code: 1,
					message: "获取购物车项失败"
				});
			}
			// 按商店组织结果
			const groupedByShop = results.reduce((grouped, item) => {
				const existingShop = grouped.find(shop => shop.shop === item.shop);
				if (existingShop) {
					// 将商品添加到现有商店
					existingShop.goodsList.push({
						id: item.id,
						gid: item.gid,
						name: item.name,
						imgUrl: item.imgUrl,
						num: item.goodsNum,
						price: item.price,
						type: item.goodsType,
						shop: item.shop
					});
				} else {
					// 创建新的商店条目
					grouped.push({
						id: item.id,
						shop: item.shop,
						goodsList: [{
							id: item.id,
							gid: item.gid,
							name: item.name,
							imgUrl: item.imgUrl,
							num: item.goodsNum,
							price: item.price,
							type: item.goodsType,
							shop: item.shop
						}],
					});
				}
				return grouped;
			}, []);
			res.send({
				code: 0,
				message: "获取购物车成功",
				data: groupedByShop,
			});
		});
	});
};

// 根据商品ID添加到购物车函数
exports.addCart = (req, res) => {
	const userId = req.auth.id;
	const {
		gid,
		goodsNum,
		goodsType
	} = req.body;
	// 先查询用户的购物车是否存在
	const checkCartQuery = `SELECT * FROM cart WHERE uid = ?`;
	db.query(checkCartQuery, [userId], (checkCartErr, checkCartResults) => {
		if (checkCartErr) {
			return res
				.status(500)
				.json({
					code: 1,
					message: "数据库查询失败",
					err: checkCartErr
				});
		}
		// 若用户购物车不存在,则先创建购物车
		if (checkCartResults.length === 0) {
			const createCartQuery = `INSERT INTO cart (uid) VALUES (?)`;
			db.query(
				createCartQuery,
				[userId],
				(createCartErr, createCartResults) => {
					if (createCartErr) {
						return res
							.status(500)
							.json({
								code: 1,
								message: "创建购物车失败",
								err: createCartErr
							});
					}
					// 获取新创建的购物车的ID
					const cartId = createCartResults.insertId;
					// 插入购物车项
					const insertCartItemQuery =
						`INSERT INTO cartitem (cid, gid, goodsNum, goodsType) VALUES (?, ?, ?, ?)`;
					db.query(
						insertCartItemQuery,
						[cartId, gid, goodsNum, goodsType],
						(insertErr, insertResults) => {
							if (insertErr) {
								return res
									.status(500)
									.json({
										code: 1,
										message: "数据库插入失败",
										err: insertErr
									});
							}
							res.json({
								code: 0,
								message: "商品添加成功"
							});
						}
					);
				}
			);
		} else {
			// 用户购物车已存在,查询是否有相同商品
			const cartId = checkCartResults[0].id;
			const checkCartItemQuery =
				`SELECT * FROM cartitem WHERE cid = ? AND gid = ? AND goodsType = ?`;
			db.query(
				checkCartItemQuery,
				[cartId, gid, goodsType],
				(checkCartItemErr, checkCartItemResults) => {
					if (checkCartItemErr) {
						return res.status(500).json({
							code: 1,
							message: "数据库查询失败",
							err: checkCartItemErr,
						});
					}
					// 若购物车中已存在相同商品,则更新数量
					if (checkCartItemResults.length > 0) {
						const existingCartItem = checkCartItemResults[0];
						const updatedQuantity = existingCartItem.goodsNum + goodsNum;
						const updateCartItemQuery = `UPDATE cartitem SET goodsNum = ? WHERE id = ?`;
						db.query(
							updateCartItemQuery,
							[updatedQuantity, existingCartItem.id],
							(updateCartItemErr, updateCartItemResults) => {
								if (updateCartItemErr) {
									return res.status(500).json({
										code: 1,
										message: "商品添加失败",
										err: updateCartItemErr,
									});
								}
								res.json({
									code: 0,
									message: "商品添加成功"
								});
							}
						);
					} else {
						// 购物车中不存在相同商品,插入新记录
						const insertCartItemQuery =
							`INSERT INTO cartitem (cid, gid, goodsNum, goodsType) VALUES (?, ?, ?, ?)`;
						db.query(
							insertCartItemQuery,
							[cartId, gid, goodsNum, goodsType],
							(insertCartItemErr, insertCartItemResults) => {
								if (insertCartItemErr) {
									return res.status(500).json({
										code: 1,
										message: "数据库插入失败",
										err: insertCartItemErr,
									});
								}
								res.json({
									code: 0,
									message: "商品添加成功"
								});
							}
						);
					}
				}
			);
		}
	});
};

// 商品数量修改函数
exports.updateNum = (req, res) => {
	const uid = req.auth.id;
	const {
		cartitemId,
		goodsNum
	} = req.body;
	// 首先查找对应用户的购物车
	const cartSql = `SELECT id FROM cart WHERE uid=${uid}`;
	db.query(cartSql, (cartErr, cartResults) => {
		if (cartErr) {
			console.error("获取购物车失败:", cartErr);
			return res.send({
				code: 1,
				message: "获取购物车失败"
			});
		}
		if (cartResults.length === 0) {
			return res.send({
				code: 0,
				message: "用户购物车为空"
			});
		}
		const cartID = cartResults[0].id;
		// 商品数量修改
		const sql = `UPDATE cartitem SET goodsNum=${goodsNum} WHERE cid=${cartID} AND id=${cartitemId}`;
		db.query(sql, (err, results) => {
			if (err) {
				console.error("商品数量修改失败:", err);
				return res.send({
					code: 1,
					message: "商品数量修改失败",
					err
				});
			}
			res.send({
				code: 0,
				message: "商品数量修改成功",
			});
		});
	});
};

// 商品删除函数
exports.deleteCart = (req, res) => {
	const uid = req.auth.id;
	const {
		goodsIdList
	} = req.body;
	// 首先查找对应用户的购物车
	const cartSql = `SELECT id FROM cart WHERE uid=${uid}`;
	db.query(cartSql, (cartErr, cartResults) => {
		if (cartErr) {
			console.error("获取购物车失败:", cartErr);
			return res.send({
				code: 1,
				message: "获取购物车失败"
			});
		}
		if (cartResults.length === 0) {
			return res.send({
				code: 0,
				message: "用户购物车为空"
			});
		}
		const cartID = cartResults[0].id;
		// 商品删除
		const sql = `DELETE FROM cartitem WHERE cid=${cartID} AND id in (?)`;
		db.query(sql, [goodsIdList], (err, results) => {
			if (err) {
				console.error("商品删除失败:", err);
				return res.send({
					code: 1,
					message: "商品删除失败",
					err
				});
			}
			res.send({
				code: 0,
				message: "商品删除成功",
			});
		});
	});
};