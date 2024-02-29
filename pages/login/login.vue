<!-- 页面-登录页 -->

<template>
	<view class="login">
		<view class="bg">
			<image src="../../static/img/bg.jpg" mode=""></image>
		</view>
		<swiper vertical="true" :current="current" @change="swiperChange">
			<!-- 注册模块 -->
			<swiper-item>
				<view class="reg-box">
					<view @tap="goBack" class="close" :style="'padding-top:'+topHeight+'px;'">
						<image src="../../static/img/close.png" mode=""></image>
					</view>
					<view class="logo">
						<image src="../../static/img/logo.png" mode="aspectFit"></image>
					</view>
					<view @tap="goTel" class="btn">本机号码一键注册</view>
					<!-- 组件-其他登录方式 -->
					<login-other></login-other>
					<view class="switchMode" @tap="switchMode(1)">
						<view class="tip">已有账号？去登录</view>
						<view class="img-box" :animation="downData">
							<image src="../../static/img/down.png" mode=""></image>
						</view>
					</view>
				</view>
			</swiper-item>
			<!-- 登录模块 -->
			<swiper-item>
				<view class="login-box">
					<view @tap="goBack" class="close" :style="'top:'+topHeight+'px;'">
						<image src="../../static/img/close.png" mode=""></image>
					</view>
					<view class="switchMode" @tap="switchMode(0)" :style="'top:'+topHeight+'px;'">
						<view class="img-box" :animation="upData">
							<image src="../../static/img/up.png" mode=""></image>
						</view>
						<view class="tip">没有账号？去注册</view>
					</view>
					<view class="info-form">
						<view class="info-input">
							<view class="hd">账号：</view>
							<input type="text" v-model="username" placeholder="请输入手机号" />
						</view>
						<view class="info-input">
							<view class="hd">密码：</view>
							<input type="password" v-model="password" placeholder="请输入6~12位字符" />
						</view>
						<view class="tip">
							<view>忘记密码</view>
							<view>免密登录</view>
						</view>
						<view @tap="submit" class="btn">登 录</view>
					</view>
					<!-- 组件-其他登录方式 -->
					<login-other></login-other>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				current: 0, // 页面模式
				topHeight: 20, // 刘海高度
				downData: {}, // 下箭头动画队列
				upData: {}, // 上箭头动画队列
				username: '',
				password: '',
				// 用户信息验证规则
				rules: {
					username: {
						rule: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/, // 手机号
						msg: '请输入正确的手机号'
					},
					password: {
						rule: /^[0-9a-zA-Z]{6,12}$/, // 6-12位字符
						msg: '密码应该为6-12位字符'
					}
				}
			}
		},
		onReady() {
			// #ifdef APP
			// APP端
			this.topHeight = 60 // 设置刘海高度
			// #endif
		},
		onLoad() {
			this.downAnimation() // 触发下箭头动画
			this.upAnimation() // 触发上箭头动画
		},
		methods: {
			// 仓库函数映射
			...mapActions('user', ['logUser']),
			// 页面返回
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 手机号注册跳转
			goTel() {
				uni.navigateTo({
					url: "/pages/login-tel/login-tel"
				})
			},
			// 页面滑动切换
			swiperChange(e) {
				this.current = e.detail.current
			},
			// 页面点击切换
			switchMode(index) {
				this.current = index
			},
			// 登录
			submit() {
				if (!this.validate('username')) return // 账号规则验证
				if (!this.validate('password')) return // 密码规则验证
				const userInfo = {
					username: this.username,
					password: this.password
				}
				this.logUser(userInfo)
			},
			// 规则验证
			validate(key) {
				let flag = true
				if (!this.rules[key].rule.test(this[key])) {
					uni.showToast({
						title: this.rules[key].msg,
						icon: 'none'
					})
					flag = false
				}
				return flag
			},
			// 下箭头动画
			downAnimation() {
				// 创建动画实例
				const animation = uni.createAnimation({
					duration: 1000 // 动画持续时间
				})
				// 定义动画
				setInterval(() => {
					animation.translateY(10).step()
					animation.translateY(0).step()
					this.downData = animation.export() // 加入样式动画队列
				}, 2000)
			},
			// 上箭头动画
			upAnimation() {
				const animation = uni.createAnimation({
					duration: 1000
				})
				setInterval(() => {
					animation.translateY(-10).step()
					animation.translateY(0).step()
					this.upData = animation.export() // 加入样式动画队列
				}, 2000)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		overflow: hidden;
		position: relative;
		width: 100vw;
		height: 100vh;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 100vh;
			z-index: -999;
			filter: blur(1px) opacity(45%);

			image {
				width: 100vw;
				height: 100vh;
			}
		}

		swiper {
			height: 100vh;
		}

		.close {
			width: 60rpx;
			height: 60rpx;

			image {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.switchMode {
			position: absolute;
			left: 50%;
			z-index: 999;
			transform: translateX(-50%);
			text-align: center;

			.tip {
				font-size: 28rpx;
			}

			.img-box {
				width: 100rpx;
				height: 80rpx;
				margin: 0 auto;

				image {
					width: 100rpx;
					height: 80rpx;
				}
			}
		}

		.btn {
			width: 90%;
			height: 80rpx;
			margin: 0 auto;
			color: #fff;
			line-height: 80rpx;
			text-align: center;
			border-radius: 40rpx;
			background-color: #49BDFB;
		}

		.reg-box {
			position: relative;
			height: 100vh;
			padding: 0 20rpx;

			.close {
				padding-bottom: 120rpx;
			}

			.switchMode {
				bottom: 50rpx;
			}

			.logo {
				width: 400rpx;
				height: 100rpx;
				margin: 50rpx auto 0;
				padding-bottom: 220rpx;

				image {
					width: 400rpx;
					height: 100rpx;
				}
			}
		}

		.login-box {
			position: relative;
			height: 100vh;
			padding: 180rpx 20rpx 0;

			.close {
				position: absolute;
				left: 20rpx;
			}

			.info-form {
				padding-top: 100rpx;

				.info-input {
					display: flex;
					align-items: center;
					width: 80%;
					margin: 0 auto 20rpx;
					padding: 20rpx 0;
					font-size: 30rpx;
					border-bottom: 2rpx solid #ccc;

					.hd {
						margin-right: 30rpx;
					}

					input {
						font-size: 28rpx;
					}
				}

				.tip {
					display: flex;
					justify-content: space-between;
					width: 80%;
					margin: 20rpx auto 50rpx;
					font-size: 28rpx;
				}
			}
		}
	}
</style>