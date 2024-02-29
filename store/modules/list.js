// 分类页仓库

import $http from '@/common/api/request.js'

const state = {
	classifyList: [], // 商品分类
	classifyItem: [] // 商品分类子项
}

const mutations = {
	// 商品分类
	setClassify(state, data) {
		state.classifyList = data
	},
	// 商品分类子项
	setClassifyItem(state, data) {
		state.classifyItem = data
	}
}

const actions = {
	// 商品分类
	async getClassify(context) {
		$http.request({
			url: '/list/getClassify'
		}).then((res) => {
			context.commit('setClassify', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 商品分类子项
	async getClassifyItem(context, id) {
		$http.request({
			url: '/list/getClassifyItem',
			data: {
				id: id
			}
		}).then((res) => {
			context.commit('setClassifyItem', res.data.data)
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