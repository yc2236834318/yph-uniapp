// 请求封装文件

// 注意:若是在手机上测试,则需要保证手机和电脑处于同一网络下,否则链接不到服务器

import store from '@/store/index.js' // 引入仓库文件

export default {
	common: {
		baseUrl: "http://192.168.1.9:3000",
		method: "GET",
		data: {},
		header: {
			"Content-Type": "application/json",
			"Content-Type": "application/x-www-form-urlencoded"
		},
		dataType: "json",
	},
	request(options = {}) {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		// 请求拦截器
		const token = uni.getStorageSync('userToken') || null;
		if (token) {
			options.header = {
				...options.header,
				'Authorization': token
			};
		}
		options.url = this.common.baseUrl + options.url
		options.method = options.method || this.common.method
		options.data = options.data || this.common.data
		options.header = options.header || this.common.header
		options.dataType = options.dataType || this.common.dataType
		return new Promise((res, rej) => {
			uni.request({
				...options,
				success: (result) => {
					// 响应拦截器
					if (result.statusCode !== 200) {
						return rej();
					}
					if (result.data && result.data.status === 401) {
						// 用户权限不足,提示登录
						uni.showToast({
							title: '请先登录',
							mask: true,
							icon: 'none'
						})
						// 清空用户信息和本地缓存
						store.commit('user/clearUserInfo')
						// 跳转到登录页
						// uni.navigateTo({
						// 	url: '/pages/login/login'
						// })
						return rej();
					}
					res(result);
				},
				complete: () => {
					uni.hideLoading()
				}
			})
		})
	}
}