<!-- 页面-用户页 -->

<template>
	<view class="user">
		<view class="bg">
			<image src="/static/img/mybg.jpg" mode=""></image>
		</view>
		<view v-if="isLogin" class="isLogin">
			<view class="header">
				<view class="icon icon-left">
					<image src="/static/img/icon-set.png" mode=""></image>
				</view>
				<view class="icon icon-right">
					<image src="/static/img/icon-message.png" mode=""></image>
				</view>
				<view class="face-box">
					<image v-if="userInfo.faceImgUrl" :src="userInfo.faceImgUrl" mode=""></image>
					<image v-else src="/static/img/face.png" mode=""></image>
				</view>
				<view class="nickname">{{userInfo&&userInfo.nickname?userInfo.nickname:'游客'}}</view>
			</view>
			<view class="card">
				<view class="card-hd">
					<text>账户管理</text>
					<text class="balance">余额：&yen; {{userInfo&&userInfo.balance?userInfo.balance:0.00}}</text>
				</view>
				<view class="card-bd">
					<view @tap="goPage(1)" class="card-item">
						<view class="card-box">
							<image src="/static/img/icon-info.png" mode=""></image>
						</view>
						<view class="card-title">信息管理</view>
					</view>
					<view @tap="goPage(2)" class="card-item">
						<view class="card-box">
							<image src="/static/img/icon-address.png" mode=""></image>
						</view>
						<view class="card-title">地址管理</view>
					</view>
					<view @tap="goPage(3)" class="card-item">
						<view class="card-box">
							<image src="/static/img/icon-order.png" mode=""></image>
						</view>
						<view class="card-title">订单管理</view>
					</view>
					<view @tap="goPage(4)" class="card-item">
						<view class="card-box">
							<image src="/static/img/icon-history.png" mode=""></image>
						</view>
						<view class="card-title">历史记录</view>
					</view>
					<view @tap="goPage(5)" class="card-item">
						<view class="card-box">
							<image src="/static/img/icon-balance.png" mode=""></image>
						</view>
						<view class="card-title">余额充值</view>
					</view>
				</view>
			</view>
			<view class="demand">
				<view class="demand-item">
					<view class="icon-box icon-left">
						<image src="/static/img/icon-collect.png" mode=""></image>
					</view>
					<text>我的收藏</text>
					<view class="icon-box icon-right">
						<image src="/static/img/right.png" mode=""></image>
					</view>
				</view>
				<view class="demand-item">
					<view class="icon-box icon-left">
						<image src="/static/img/icon-ticket.png" mode=""></image>
					</view>
					<text>我的优惠券</text>
					<view class="icon-box icon-right">
						<image src="/static/img/right.png" mode=""></image>
					</view>
				</view>
				<view class="demand-item">
					<view class="icon-box icon-left">
						<image src="/static/img/icon-integral.png" mode=""></image>
					</view>
					<text>我的积分</text>
					<view class="icon-box icon-right">
						<image src="/static/img/right.png" mode=""></image>
					</view>
				</view>
				<view class="demand-item demand-vip">
					<view class="icon-box icon-left">
						<image src="/static/img/icon-vip.png" mode=""></image>
					</view>
					<text>加入超级VIP</text>
					<view class="icon-box icon-right">
						<image src="/static/img/right.png" mode=""></image>
					</view>
				</view>
				<view class="demand-item">
					<view class="icon-box icon-left">
						<image src="/static/img/icon-help.png" mode=""></image>
					</view>
					<text>帮助中心</text>
					<view class="icon-box icon-right">
						<image src="/static/img/right.png" mode=""></image>
					</view>
				</view>
				<view class="demand-item">
					<view class="icon-box icon-left">
						<image src="/static/img/icon-service.png" mode=""></image>
					</view>
					<text>联系客服</text>
					<view class="icon-box icon-right">
						<image src="/static/img/right.png" mode=""></image>
					</view>
				</view>
				<view class="demand-item">
					<view class="icon-box icon-left">
						<image src="/static/img/icon-shop.png" mode=""></image>
					</view>
					<text>商家入驻</text>
					<view class="icon-box icon-right">
						<image src="/static/img/right.png" mode=""></image>
					</view>
				</view>
			</view>
			<view @tap="exit" class="exit">退出登录</view>
		</view>
		<view v-else class="noLogin">
			<view class="header">
				<view class="face-box">
					<image src="/static/img/face.png" mode=""></image>
				</view>
				<view class="goLogin" @tap="goLogin">点击登录</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				userToken: '', // 用户令牌
				isLogin: false // 是否登录
			}
		},
		onLoad() {
			this.checkLogin() // 登录验证
		},
		onShow() {
			this.checkLogin() // 登录验证
		},
		computed: {
			// 仓库数据映射
			...mapState('user', ['userInfo'])
		},
		methods: {
			// 仓库函数映射
			...mapMutations('user', ['clearUserInfo']),
			...mapActions('user', ['getUserInfo']),
			// 登录验证
			checkLogin() {
				try {
					this.userToken = uni.getStorageSync('userToken') // 获取本地的用户令牌
				} catch (e) {
					console.log(e);
				}
				// 设置登录状态
				if (this.userToken) {
					this.isLogin = true
					this.getUserInfo() // 更新用户信息
				} else {
					this.isLogin = false
				}
			},
			// 页面跳转
			goPage(value) {
				if (value === 1) {
					uni.navigateTo({
						url: '/pages/user-info/user-info'
					})
				} else if (value === 2) {
					uni.navigateTo({
						url: '/pages/receiver/receiver'
					})
				} else if (value === 3) {
					uni.navigateTo({
						url: '/pages/order-manage/order-manage'
					})
				} else {
					uni.showToast({
						title: '接口关闭',
						icon: 'none'
					})
				}
			},
			// 退出登录
			exit() {
				uni.showModal({
					title: '温馨提示',
					content: '是否退出登录',
					success: (res) => {
						if (res.confirm) {
							this.clearUserInfo() // 清除仓库数据和本地缓存
							this.isLogin = false // 更改登录状态
							uni.showToast({
								title: '退出成功',
								icon: 'none'
							})
						}
					}
				})
			},
			// 跳转登录
			goLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			}
		}
	}
</script>

<style lang="scss">
	.user {
		overflow-y: hidden;
		position: relative;
		height: 100vh;
		background-color: rgb(247, 248, 250);
		// #ifdef H5
		padding-bottom: 10vh;
		height: calc(100vh - 88rpx);
		// #endif
		/*#ifdef MP-WEIXIN*/
		padding-bottom: 4vh;
		/*#endif*/


		.bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 354rpx;

			image {
				width: 100%;
				height: 354rpx;
			}
		}

		.header {
			box-sizing: border-box;
			position: relative;
			width: 100%;
			height: 354rpx;
			padding-top: 80rpx;

			.icon {
				position: absolute;
				top: 20%;
				width: 60rpx;
				height: 60rpx;

				image {
					width: 60rpx;
					height: 60rpx;
				}
			}

			.icon-left {
				left: 5%;
			}

			.icon-right {
				right: 5%;
			}

			.face-box {
				overflow: hidden;
				width: 130rpx;
				height: 130rpx;
				margin: 0 auto;
				border-radius: 50%;

				image {
					width: 130rpx;
					height: 130rpx;
				}
			}

			.nickname {
				margin-top: 40rpx;
				color: #fff;
				font-size: 34rpx;
				font-weight: bold;
				text-align: center;
			}
		}

		.card {
			width: 100%;
			height: 200rpx;
			padding-top: 10rpx;
			background-color: #fff;

			.card-hd {
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 50rpx;
				padding: 0 20rpx;
				font-size: 30rpx;
				font-weight: bold;
				line-height: 50rpx;

				.balance {
					color: #EE0A24;
					font-size: 24rpx;
				}
			}

			.card-bd {
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx 40rpx;

				.card-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.card-box {
						width: 60rpx;
						height: 60rpx;

						image {
							width: 60rpx;
							height: 60rpx;
						}
					}

					.card-title {
						margin-top: 20rpx;
						color: #666;
						font-size: 24rpx;
						text-align: center;
					}
				}
			}
		}

		.demand {
			margin-top: 20rpx;

			.demand-item {
				position: relative;
				width: 100%;
				height: 6vh;
				margin-bottom: 1vh;
				line-height: 6vh;
				background-color: #fff;

				text {
					margin-left: 90rpx;
					font-size: 26rpx;
				}

				.icon-box {
					position: absolute;
					top: 10rpx;
					width: 40rpx;
					height: 40rpx;

					image {
						width: 40rpx;
						height: 40rpx;
					}
				}

				.icon-left {
					left: 20rpx;
				}

				.icon-right {
					right: 20rpx;
				}
			}

			.demand-vip {
				margin: 2vh 0;
			}
		}

		.exit {
			width: 200rpx;
			height: 50rpx;
			margin: 3vh auto 0;
			color: #EE0A24;
			font-size: 30rpx;
			line-height: 50rpx;
			text-align: center;
			border: 2rpx solid #EE0A24;
			border-radius: 30rpx;
		}

		.goLogin {
			width: 200rpx;
			height: 60rpx;
			margin: 40rpx auto 0;
			color: #fff;
			font-size: 28rpx;
			line-height: 60rpx;
			text-align: center;
			border-radius: 30rpx;
			background-color: #49BDFB;
		}
	}
</style>