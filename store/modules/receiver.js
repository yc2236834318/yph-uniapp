// 地址页仓库

import $http from '@/common/api/request.js'

const state = {
	receiverList: [], // 收货地址列表
	receiverObj: {} // 指定收获地址
}

const mutations = {
	// 设置收货地址列表
	setReceiver(state, list) {
		state.receiverList = list
	},
	// 设置指定收货地址
	setReceiverObj(state, obj) {
		state.receiverObj = obj
	}
}

const actions = {
	// 获取收货地址列表
	async getReceiver(context) {
		$http.request({
			url: '/receiver/getReceiver',
		}).then((res) => {
			context.commit('setReceiver', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 根据ID获取收货地址
	async getReceiverById(context, id) {
		$http.request({
			url: '/receiver/getReceiverById',
			data: {
				id: id
			}
		}).then((res) => {
			context.commit('setReceiverObj', res.data.data[0])
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 添加收货地址
	async addReceiver(context, obj) {
		$http.request({
			url: '/receiver/addReceiver',
			method: "POST",
			data: {
				area: obj.area,
				areaCode: obj.areaCode,
				address: obj.address,
				phone: obj.phone,
				consignee: obj.consignee,
				isdefault: obj.isdefault
			}
		}).then((res) => {
			uni.showToast({
				title: res.data.message,
				icon: "none",
				mask: true
			})
			setTimeout(() => {
				uni.navigateBack() // 返回到地址页
			}, 1000)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 修改收货地址
	async updateReceiver(context, obj) {
		$http.request({
			url: '/receiver/updateReceiver',
			method: "POST",
			data: {
				id: obj.id,
				area: obj.area,
				areaCode: obj.areaCode,
				address: obj.address,
				phone: obj.phone,
				consignee: obj.consignee,
				isdefault: obj.isdefault
			}
		}).then((res) => {
			uni.showToast({
				title: res.data.message,
				icon: "none",
				mask: true
			})
			setTimeout(() => {
				uni.navigateBack() // 返回到地址页
			}, 1000)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 删除收货地址
	async delReceiver(context, id) {
		$http.request({
			url: '/receiver/delReceiver',
			method: "POST",
			data: {
				id: id
			}
		}).then((res) => {
			uni.showToast({
				title: res.data.message,
				icon: "none",
				mask: true
			})
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	}
}

// 导出核心配置
export default {
	namespaced: true, // 开启命名空间
	state,
	mutations,
	actions
}