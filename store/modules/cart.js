// 购物车页仓库

import $http from '@/common/api/request.js'

const state = {
	cartList: [],
	selectList: []
}

const mutations = {
	// 设置购物车列表
	setCartList(state, list) {
		const modifiedList = list.map(shop => ({
			...shop,
			allChecked: false, // 为每个商店添加 allChecked 属性,默认值为 false
			goodsList: shop.goodsList.map(good => ({
				...good,
				isChecked: false, // 为每个商品添加 isChecked 属性,默认值为 false
			})),
		}));
		state.cartList = modifiedList;
	},
	// 设置商品选中列表(购物车)
	setSelectList(state) {
		state.selectList = state.cartList.flatMap(shop => shop.goodsList.filter(item => item.isChecked))
	},
	// 商品编辑
	editGoods(state) {
		state.cartList.forEach((item) => {
			item.allChecked = false
			item.goodsList.forEach((k) => {
				k.isChecked = false
			})
		})
	},
	// 店铺全选
	shopSelect(state, id) {
		const shop = state.cartList.find(shop => shop.id === id)
		shop.allChecked = !shop.allChecked // 设置店铺全选框
		shop.goodsList.forEach((item) => item.isChecked = shop.allChecked) // 设置商品选择框
	},
	// 商品选中
	goodsSelect(state, obj) {
		const shop = state.cartList.find(shop => shop.id === obj.id)
		if (shop) {
			shop.goodsList = shop.goodsList.map(goods => {
				if (goods.id === obj.kid) {
					goods.isChecked = !goods.isChecked
				}
				return goods
			})
		}
		// 设置店铺全选框
		if (shop.goodsList.every(item => item.isChecked === true)) {
			shop.allChecked = true
		} else {
			shop.allChecked = false
		}
	},
	// 商品全选
	allGoodsSelect(state, flag) {
		state.cartList.forEach((item) => {
			item.allChecked = flag
			item.goodsList.forEach((k) => {
				k.isChecked = flag
			})
		})
	}
}

const actions = {
	// 添加商品至购物车
	async addCart(context, obj) {
		$http.request({
			url: '/cart/addCart',
			method: "POST",
			data: {
				gid: obj.gid,
				goodsNum: obj.goodsNum,
				goodsType: obj.goodsType
			}
		}).then((res) => {
			context.dispatch('getCartList') // 重新获取商品列表
			uni.showToast({
				title: res.data.message,
				icon: "none"
			})
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 获取购物车列表
	async getCartList(context) {
		$http.request({
			url: '/cart/getCart',
		}).then((res) => {
			if (res.data.code === 0) {
				context.commit('setCartList', res.data.data)
			} else {
				uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
			}
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 商品数量修改
	async changeNum(context, obj) {
		if (obj.num < 1 || obj.num > 9) return
		$http.request({
			url: '/cart/updateNum',
			method: "POST",
			data: {
				cartitemId: obj.id,
				goodsNum: obj.num
			}
		}).then((res) => {
			if (res.data.code !== 0) return
			context.dispatch('getCartList') // 重新获取商品列表
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 商品删除
	async delGoods(context, list) {
		$http.request({
			url: '/cart/deleteCart',
			method: "POST",
			data: {
				goodsIdList: list
			}
		}).then((res) => {
			if (res.data.code !== 0) return
			state.selectList = [] // 清空已选列表
			context.dispatch('getCartList') // 重新获取商品列表
			uni.showToast({
				title: '删除成功',
				icon: "none"
			})
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
}

const getters = {
	// 商品全选框
	allBox(state) {
		return state.cartList.every(shop => {
			return shop.goodsList.every(item => item.isChecked)
		})
	},
	// 计算商品总数量
	totalNum(state) {
		let num = 0
		state.cartList.forEach(shop => {
			shop.goodsList.forEach(item => {
				num += item.num
			})
		})
		return num
	},
	// 计算选中商品总数量
	totalCheckNum(state) {
		let checkNum = 0
		state.cartList.forEach(shop => {
			shop.goodsList.forEach(item => {
				if (item.isChecked) {
					checkNum += item.num
				}
			})
		})
		return checkNum
	},
	// 计算选中商品总价格
	totalCheckPrice(state) {
		let checkPrice = 0
		state.cartList.forEach(shop => {
			shop.goodsList.forEach(item => {
				if (item.isChecked) {
					checkPrice += item.price * item.num
				}
			})
		})
		return checkPrice
	}
}

// 导出核心配置
export default {
	namespaced: true, // 开启命名空间
	state,
	mutations,
	actions,
	getters
}