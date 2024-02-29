// 搜索页仓库

import $http from '@/common/api/request.js'

const state = {
	searchList: []
}

const mutations = {
	setSearch(state, obj) {
		if (!obj.add) state.searchList = []
		state.searchList = [...state.searchList, ...obj.data]
	}
}

const actions = {
	async getSearch(context, obj) {
		$http.request({
			url: '/search/getSearch',
			data: {
				order: obj.order,
				sort: obj.sort,
				page: obj.page
			}
		}).then((res) => {
			const resObj = {
				data: res.data.data,
				add: obj.add
			}
			context.commit('setSearch', resObj)
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