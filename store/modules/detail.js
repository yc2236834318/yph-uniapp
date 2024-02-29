// 详情页仓库

import $http from '@/common/api/request.js'

const state = {
	goodsObj: {}
}

const mutations = {
	setGoodsObj(state, obj) {
		state.goodsObj = obj
	}
}

const actions = {
	async getGoodsByID(context, id) {
		$http.request({
			url: '/detail/getGoodsByID',
			data: {
				id: id
			}
		}).then((res) => {
			context.commit('setGoodsObj', res.data.data)
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