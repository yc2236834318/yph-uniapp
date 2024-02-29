// 订单页仓库

import $http from '@/common/api/request.js'

const state = {
	shopList: [], // 商品列表
	orderObj: [], // 订单对象
	orderList: [], // 订单列表
	isCart: false, // 立即购买/购物车购买
	orderId: null // 订单号
}

const mutations = {
	// 设置是否购物车购买
	setIsCart(state, flag) {
		state.isCart = flag
	},
	// 设置商品列表
	setShopList(state, list) {
		state.shopList = list.reduce((acc, cur) => {
			const existingShop = acc.find(item => item.shop === cur.shop);
			if (existingShop) {
				existingShop.goodsList.push({
					id: cur.id,
					name: cur.name,
					price: cur.price,
					num: cur.num,
					imgUrl: cur.imgUrl,
					type: cur.type
				});
			} else {
				acc.push({
					shop: cur.shop,
					goodsList: [{
						id: cur.id,
						name: cur.name,
						price: cur.price,
						num: cur.num,
						imgUrl: cur.imgUrl,
						type: cur.type
					}]
				});
			}
			return acc;
		}, []);
	},
	// 设置订单列表
	setOrderList(state, list) {
		state.orderList = list
	},
	// 设置订单对象
	setOrderObj(state, obj) {
		state.orderObj = obj
	},
	// 设置订单ID
	setOrderId(state, id) {
		state.orderId = id
	}
}

const actions = {
	// 获取所有订单
	async getAllOrder(context) {
		$http.request({
			url: '/order/getAllOrder',
		}).then((res) => {
			context.commit('setOrderList', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 根据ID获取订单
	async getOrderById(context) {
		$http.request({
			url: '/order/getOrderById',
			data: {
				oid: state.orderId
			}
		}).then((res) => {
			context.commit('setOrderObj', res.data.data[0])
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 新建订单
	async addOrder(context, obj) {
		$http.request({
			url: '/order/addOrder',
			method: "POST",
			data: {
				totalNum: obj.totalNum,
				totalPrice: obj.totalPrice,
				area: obj.area,
				address: obj.address,
				consignee: obj.consignee,
				phone: obj.phone,
				payMethod: obj.payMethod,
				creatDate: obj.creatDate,
				shopList: obj.shopList,
				isCart: state.isCart
			}
		}).then((res) => {
			context.commit('setOrderId', res.data.data.id) // 设置订单ID
			uni.redirectTo({
				url: '/pages/pay/pay'
			})
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 删除订单
	async delOrder(context, oid) {
		$http.request({
			url: '/order/delOrder',
			method: "POST",
			data: {
				oid: oid
			}
		}).then((res) => {
			uni.redirectTo({
				url: '/pages/order-manage/order-manage'
			})
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 支付订单
	async payOrder(context) {
		$http.request({
			url: '/order/payOrder',
			method: "POST",
			data: {
				oid: state.orderId
			}
		}).then((res) => {
			if (res.data.code !== 0) {
				return uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
			}
			uni.showLoading({
				title: '正在支付',
				mask: true
			})
			setTimeout(() => {
				uni.hideLoading()
				uni.showToast({
					title: '支付成功',
					icon: 'success',
					mask: true
				})
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/user/user'
					})
				}, 1000)
			}, 1000)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
}

// 导出核心配置
export default {
	namespaced: true, // 开启命名空间
	state,
	mutations,
	actions
}