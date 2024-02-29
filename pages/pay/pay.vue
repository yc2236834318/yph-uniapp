<!-- 页面-支付页 -->

<template>
	<view class="pay">
		<line-vue></line-vue>
		<view v-if="orderObj.totalPrice" class="pay-box">
			<view class="pay-list">
				<view @tap="changePayIndex(index)" v-for="(item,index) in payList" :key="item.id" class="pay-item">
					<view class="pay-img">
						<image :src="item.imgUrl" mode=""></image>
					</view>
					<view class="pay-info">
						<view class="pay-title">
							{{item.payTitle}}<text v-if="index===2">&yen; {{userInfo.balance}}</text>
						</view>
						<view class="pay-tip">{{item.payTip}}</view>
					</view>
					<view class="pay-radio">
						<view class="radio-max" :class="{radioActiveMax:payIndex===index}">
							<view class="radio-min" :class="{radioActiveMin:payIndex===index}"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="count">
				<view class="price">合计：<text>&yen; {{orderObj.totalPrice.toFixed(2)}}</text></view>
				<view @tap="goPay" class="payBtn">支 付</view>
			</view>
		</view>
		<view v-else class="pay-empty">
			<view class="tip">订单获取失败</view>
			<view class="tip">请在订单管理中支付</view>
			<view @tap="goOrder" class="orderBtn">订单管理</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				payIndex: 0,
				payList: [{
						id: 1,
						payTitle: '支付宝支付',
						payTip: '推荐支付宝用户使用',
						imgUrl: '../../static/img/zfb.png'
					},
					{
						id: 2,
						payTitle: '微信支付',
						payTip: '推荐微信用户使用',
						imgUrl: '../../static/img/wxf.png'
					},
					{
						id: 3,
						payTitle: '余额支付',
						payTip: '推荐优品汇会员使用',
						imgUrl: '../../static/img/balancef.png'
					}
				]
			}
		},
		onLoad() {
			this.getOrderById() // 获取订单信息
		},
		// 页面返回事件
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false
			} else {
				uni.showModal({
					title: '放弃支付',
					content: '确认放弃支付？\n可在 我的 -> 订单管理 进行支付',
					success: (res) => {
						if (res.confirm) {
							uni.navigateBack({
								delta: 1
							})
						}
					}
				})
				return true
			}
		},
		computed: {
			// 仓库数据映射
			...mapState('order', ['orderObj']),
			...mapState('user', ['userInfo'])
		},
		methods: {
			// 仓库函数映射
			...mapActions('order', ['getOrderById', 'payOrder']),
			// 更改支付方式
			changePayIndex(index) {
				this.payIndex = index
			},
			// 支付
			goPay() {
				if (this.payIndex !== 2) {
					return uni.showToast({
						title: '接口关闭，请用余额支付',
						icon: 'none'
					})
				}
				this.payOrder() // 订单支付
			},
			// 跳转订单管理
			goOrder() {
				uni.redirectTo({
					url: '/pages/order-manage/order-manage'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pay {
		position: relative;

		.pay-list {
			padding: 0 20rpx;

			.pay-item {
				position: relative;
				display: flex;
				align-items: center;
				width: 100%;
				height: 120rpx;
				padding: 0 20rpx;
				border-bottom: 2rpx solid #eee;

				.pay-img {
					width: 90rpx;
					height: 90rpx;
					margin-right: 40rpx;

					image {
						width: 90rpx;
						height: 90rpx;
					}
				}

				.pay-info {
					font-size: 28rpx;

					.pay-title {
						text {
							margin-left: 10rpx;
							color: #EE0A24;
						}
					}

					.pay-tip {
						color: #999;
						font-size: 24rpx;
					}
				}

				.pay-radio {
					position: absolute;
					top: 30rpx;
					right: 40rpx;
					width: 70rpx;
					height: 70rpx;

					.radio-max {
						box-sizing: border-box;
						position: absolute;
						top: 10rpx;
						left: 10rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						border: 4rpx solid #ccc;

						.radio-min {
							width: 20rpx;
							height: 20rpx;
							border-radius: 50%;
						}
					}

					.radioActiveMax {
						border: 4rpx solid #49BDFB !important;
					}

					.radioActiveMin {
						background-color: #49BDFB !important;
					}
				}
			}
		}

		.count {
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			width: 100%;
			height: 100rpx;
			font-size: 30rpx;
			line-height: 100rpx;

			.price {
				flex: 5;
				height: 100rpx;
				padding-left: 40rpx;
				color: #ccc;
				background-color: #000;

				text {
					color: #fff;
				}
			}

			.payBtn {
				flex: 2;
				height: 100rpx;
				color: #fff;
				text-align: center;
				background-color: #49BDFB;
			}
		}

		.pay-empty {
			padding-top: 100rpx;

			.tip {
				width: 100%;
				height: 100rpx;
				font-weight: bold;
				line-height: 100rpx;
				text-align: center;
			}

			.orderBtn {
				width: 80%;
				height: 70rpx;
				margin: 40rpx auto 0;
				color: #fff;
				font-size: 28rpx;
				line-height: 70rpx;
				text-align: center;
				background-color: #49BDFB;
				border-radius: 35rpx;
			}
		}
	}
</style>