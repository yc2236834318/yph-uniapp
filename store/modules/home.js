// 首页仓库

import $http from '@/common/api/request.js'

const state = {
	topbarList: [],
	swiperList: [],
	recomList: [],
	bannerList: [],
	iconsList: [],
	hotList: [],
	shopList: [],
	guessList: [],
}

const mutations = {
	setTopbar(state, data) {
		state.topbarList = data
	},
	setSwiper(state, data) {
		state.swiperList = data
	},
	setBanner(state, data) {
		state.bannerList = data
	},
	setRecom(state, data) {
		data.forEach((item) => {
			item.imgList = item.imgList.split(',')
		})
		state.recomList = data
	},
	setIcons(state, data) {
		state.iconsList = data
	},
	setHot(state, data) {
		state.hotList = data
	},
	setShop(state, data) {
		state.shopList =  data
	},
	setGuess(state, data) {
		state.guessList = [...state.guessList, ...data]
	}
}

const actions = {
	async getTopbar(context) {
		$http.request({
			url: '/index/getTopbar'
		}).then((res) => {
			context.commit('setTopbar', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	async getSwiper(context) {
		$http.request({
			url: '/index/getSwiper'
		}).then((res) => {
			context.commit('setSwiper', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	async getBanner(context) {
		$http.request({
			url: '/index/getBanner'
		}).then((res) => {
			context.commit('setBanner', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	async getRecom(context) {
		$http.request({
			url: '/index/getRecom'
		}).then((res) => {
			context.commit('setRecom', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	async getIcons(context) {
		$http.request({
			url: '/index/getIcons'
		}).then((res) => {
			context.commit('setIcons', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	async getHot(context, id) {
		$http.request({
			url: '/index/getHot'
		}).then((res) => {
			context.commit('setHot', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	async getShop(context) {
		$http.request({
			url: '/index/getShop',
		}).then((res) => {
			context.commit('setShop', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	async getGuess(context, obj) {
		$http.request({
			url: '/index/getGuess',
			data: {
				start: obj.start,
				num: obj.num
			}
		}).then((res) => {
			context.commit('setGuess', res.data.data)
		}).catch((err) => {
			console.log(err);
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