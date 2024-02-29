// 用户页仓库

import $http from '@/common/api/request.js'

const state = {
	userInfo: {
		id: '',
		username: '',
		nickname: '',
		faceImgUrl: '',
		balance: ''
	},
	userToken: ''
}

const mutations = {
	// 手机号查询
	checkTelReg(state, flag) {
		if (flag) {
			uni.showToast({
				title: '该手机号已经被注册',
				icon: 'none'
			})
			return
		}
		uni.navigateTo({
			url: `/pages/login-code/login-code?tel=${state.userInfo.username}`
		})
	},
	// 存储用户信息
	setUserInfo(state, obj) {
		// 将用户信息存入仓库
		state.userInfo = {
			...obj
		}
		// 将用户信息存入本地缓存
		try {
			uni.setStorageSync('userInfo', state.userInfo)
		} catch (err) {
			console.log(err)
		}
	},
	// 存储令牌
	setUserToken(state, str) {
		// 将用户令牌存入仓库
		state.userToken = str
		// 将用户令牌存入本地缓存
		try {
			uni.setStorageSync('userToken', state.userToken)
		} catch (err) {
			console.log(err)
		}
		setTimeout(() => {
			uni.switchTab({
				url: "/pages/index/index" // 跳转到首页
			})
		}, 1000)
	},
	// 清空用户信息和令牌
	clearUserInfo(state) {
		// 清空仓库信息
		const {
			userInfo
		} = state
		Object.keys(userInfo).forEach(key => userInfo[key] = '')
		// 清空本地缓存
		try {
			uni.clearStorageSync()
		} catch (err) {
			console.log(err)
		}
	}
}

const actions = {
	// 手机号查询
	async checkTel(context, tel) {
		state.userInfo.username = tel
		$http.request({
			url: '/login/tel',
			method: 'POST',
			data: {
				tel: tel
			}
		}).then((res) => {
			context.commit('checkTelReg', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 获取用户信息
	async getUserInfo(context) {
		$http.request({
			url: '/users/getUserInfo',
		}).then((res) => {
			context.commit('setUserInfo', res.data.data)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 注册
	async regUser(context, obj) {
		$http.request({
			url: '/login/reg',
			method: 'POST',
			data: {
				username: obj.username,
				password: obj.password
			}
		}).then((res) => {
			if (res.data.code !== 0) return
			// 自动登录
			$http.request({
				url: '/login/log',
				method: 'POST',
				data: {
					username: obj.username,
					password: obj.password
				}
			}).then((result) => {
				if (result.data.code !== 0) return
				uni.showToast({
					title: '注册成功',
					mask: true,
					icon: 'none'
				})
				context.commit('setUserInfo', result.data.data)
				context.commit('setUserToken', result.data.token)
			}).catch(() => {
				uni.showToast({
					title: "请求失败",
					icon: "none"
				})
			})
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 登录
	async logUser(context, obj) {
		$http.request({
			url: '/login/log',
			method: 'POST',
			data: {
				username: obj.username,
				password: obj.password
			}
		}).then((res) => {
			uni.showToast({
				title: res.data.message,
				mask: true,
				icon: 'none'
			})
			if (res.data.code !== 0) return
			context.commit('setUserInfo', res.data.data)
			context.commit('setUserToken', res.data.token)
		}).catch(() => {
			uni.showToast({
				title: "请求失败",
				icon: "none"
			})
		})
	},
	// 修改昵称
	async updateNickName(context, nickname) {
		$http.request({
			url: '/users/update/nickname',
			method: 'POST',
			data: {
				nickname: nickname
			}
		}).then((res) => {
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
	// 修改头像
	async updateAvatar(context, filePath) {
		const token = uni.getStorageSync('userToken') // 获取本地的用户令牌
		uni.uploadFile({
			url: 'http://192.168.1.2:3000/users/update/avatar',
			filePath: filePath, // 文件路径
			name: 'userAvatar', // 文件字段名,要和后端路由中的一致
			header: {
				'Authorization': token // 将用户令牌添加到请求头中
			},
			success: (res) => {
				uni.showToast({
					title: '头像修改成功',
					mask: true,
					icon: "none",
				})
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/user/user'
					})
				}, 1000)
			},
			fail: () => {
				uni.showToast({
					title: '头像修改失败',
					mask: true,
					icon: "none"
				})
			}
		})
	},
	// 修改密码
	async updatePassword(context, obj) {
		$http.request({
			url: '/users/update/password',
			method: 'POST',
			data: {
				oldPwd: obj.oldPwd,
				newPwd: obj.newPwd
			}
		}).then((res) => {
			uni.showToast({
				title: res.data.message,
				icon: "none"
			})
			if (res.data.code !== 0) return
			context.commit('clearUserInfo') // 清空仓库数据和本地缓存
			uni.showToast({
				title: '修改成功',
				mask: true,
				icon: 'none'
			})
			setTimeout(() => {
				uni.switchTab({
					url: "/pages/user/user"
				})
			}, 1000)
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