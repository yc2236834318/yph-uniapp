<!-- 页面-订单管理页 -->

<template>
	<view class="order">
		<line-vue></line-vue>
		<view class="header-list">
			<view v-for="(item,index) in headerList" :key="item" @tap="changeHeader(index)" class="header-item"
				:class="{headerActive:headerIndex===index}">{{item}}</view>
		</view>
		<view v-if="orderList.length" class="order-list">
			<view v-for="order in orderList" :key="order.id" class="order-item">
				<view class="shop-list">
					<view v-for="shop in JSON.parse(order.shopList)" :key="shop.id" class="shop-item">
						<view class="shop-title">
							<view class="shop-img">
								<image src="../../static/img/store.png" mode=""></image>
							</view>
							<view class="shop-name">{{shop.shop}}</view>
						</view>
						<view v-for="goods in shop.goodsList" :key="goods.id" class="goods-list">
							<view class="goods-img">
								<image :src="goods.imgUrl" mode=""></image>
							</view>
							<view class="goods-info">
								<view class="goods-name">{{goods.name}}</view>
								<view class="goods-type">{{goods.type}}</view>
							</view>
							<view class="goods-pn">
								<view class="goods-price">&yen; {{goods.price}}</view>
								<view class="goods-num">x {{goods.num}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="order-info">
					<view class="order-pn">
						<view class="order-num">商品总数：<text>{{order.totalNum}}</text>个</view>
						<view class="order-price">商品总价：<text>&yen; {{order.totalPrice.toFixed(2)}}</text></view>
					</view>
					<view class="order-method">
						<view class="order-pay">支付方式：
							<text :class="{noPay:order.payMethod==='未支付'}">{{order.payMethod}}</text>
						</view>
					</view>
					<view class="order-address">{{order.area+' '+order.address}}</view>
					<view class="order-consignee">{{order.consignee+' '+order.phone}}</view>
					<view class="order-data">订单日期：{{order.creatDate}}</view>
				</view>
				<view class="manage">
					<view @tap="deleteOrder(order.id)" class="delBtn">删除订单</view>
					<view v-if="order.payMethod === '未支付'" @tap="payOrder(order.id)" class="payBtn">支付订单</view>
				</view>
			</view>
		</view>
		<!-- 订单为空 -->
		<view v-else class="empty">
			<view class="empty-img">
				<image src="../../static/img/misempty.png" mode=""></image>
			</view>
			<view class="tip">还没有相关订单</view>
			<view class="goIndex" @tap="goIndex">去首页逛逛</view>
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
				headerIndex: 0, // 头部选中项
				headerList: ['全部', '待付款', '待发货', '待收货', '待评论'], // 头部列表
			}
		},
		onLoad() {
			this.getAllOrder() // 获取所有订单
		},
		computed: {
			// 仓库数据映射
			...mapState('order', ['orderList'])
		},
		methods: {
			// 仓库函数映射
			...mapMutations('order', ['setOrderId']),
			...mapActions('order', ['getAllOrder', 'delOrder']),
			// 头部切换
			changeHeader(index) {
				this.headerIndex = index
			},
			// 首页跳转
			goIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			// 删除订单
			deleteOrder(id) {
				uni.showModal({
					title: '删除订单',
					content: '确认删除订单',
					mask: true,
					success: (res) => {
						if (res.cancel) return
						this.delOrder(id) // 删除订单
					}
				})
			},
			// 支付订单
			payOrder(id) {
				this.setOrderId(id) // 设置订单ID
				uni.navigateTo({
					url: '/pages/pay/pay' // 跳转到支付页
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order {
		position: relative;
		height: 100vh;
		// #ifdef H5
		height: calc(100vh - 88rpx);
		// #endif
		background-color: rgb(247, 248, 250);

		.header-list {
			box-sizing: border-box;
			position: fixed;
			top: 0;
			// #ifdef H5
			top: 86rpx;
			// #endif
			left: 0;
			z-index: 999;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 80rpx;
			padding: 0 40rpx;
			font-size: 28rpx;
			line-height: 80rpx;
			border-bottom: 1rpx solid #eee;
			background-color: #fff;

			.headerActive {
				color: #49BDFB;
				border-bottom: 1rpx solid #49BDFB;
			}

			.header-item {
				width: 100rpx;
				text-align: center;
			}
		}

		.order-list {
			margin-top: 80rpx;
			background-color: rgb(247, 248, 250);

			.order-item {
				margin-bottom: 50rpx;
				padding-bottom: 40rpx;
				background-color: #fff;

				.shop-list {
					.shop-item {
						.shop-title {
							padding: 20rpx;
							display: flex;

							.shop-img {
								overflow: hidden;
								width: 50rpx;
								height: 50rpx;
								margin-right: 10rpx;
								border-radius: 50%;

								image {
									width: 50rpx;
									height: 50rpx;
								}
							}

							.shop-name {
								height: 50rpx;
								font-size: 28rpx;
								line-height: 50rpx;
							}
						}

						.goods-list {
							position: relative;
							display: flex;
							padding: 0 20rpx;
							background-color: rgb(247, 248, 250);

							&:not(:last-of-type) {
								margin-bottom: 20rpx;
							}

							.goods-img {
								width: 180rpx;
								height: 180rpx;
								margin-right: 20rpx;

								image {
									width: 180rpx;
									height: 180rpx;
								}
							}

							.goods-info {
								padding-top: 10rpx;

								.goods-name {
									width: 350rpx;
									margin-bottom: 10rpx;
									font-size: 28rpx;
									// 文本省略
									overflow: hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 2;
									word-break: break-all;
									-webkit-box-orient: vertical;
								}

								.goods-type {
									color: #999;
									font-size: 24rpx;
								}
							}

							.goods-pn {
								position: absolute;
								top: 0;
								right: 40rpx;
								padding-top: 10rpx;
								text-align: right;

								.goods-price {
									margin-bottom: 10rpx;
									font-size: 28rpx;
									font-weight: bold;
								}

								.goods-num {
									font-size: 24rpx;
								}
							}
						}
					}
				}

				.order-info {
					padding: 20rpx;
					font-size: 28rpx;
					text-align: right;

					>view {
						margin-bottom: 10rpx;
					}

					.order-pn {
						display: flex;
						justify-content: flex-end;
						align-items: center;

						.order-num {
							text {
								margin-right: 5rpx;
								color: #EE0A24;
								font-weight: bold;
							}
						}

						.order-price {
							margin-left: 20rpx;

							text {
								color: #EE0A24;
								font-weight: bold;
							}
						}
					}

					.order-address {
						// 文本省略
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.order-method {
					.noPay {
						color: #EE0A24;
						font-weight: bold;
					}
				}

				.manage {
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 0 60rpx;

					view {
						flex: 1;
						height: 60rpx;
						color: #fff;
						font-size: 28rpx;
						line-height: 60rpx;
						text-align: center;
						border-radius: 30rpx;
					}

					.delBtn {
						background-color: #EE0A24;
					}

					.payBtn {
						margin-left: 40rpx;
						background-color: #49BDFB;
					}
				}
			}
		}

		.empty {
			margin-top: 200rpx;

			.empty-img {
				width: 300rpx;
				height: 300rpx;
				margin: 0 auto;

				image {
					width: 300rpx;
					height: 300rpx;
				}
			}

			.tip {
				margin-top: 50rpx;
				color: #999;
				font-size: 40rpx;
				text-align: center;
			}

			.goIndex {
				width: 300rpx;
				height: 60rpx;
				margin: 30rpx auto 0;
				color: #49BDFB;
				line-height: 60rpx;
				text-align: center;
				background-color: #fff;
				border: 2rpx solid #49BDFB;
				border-radius: 30rpx;
			}
		}
	}
</style>