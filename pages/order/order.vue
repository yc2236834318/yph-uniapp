<!-- 页面-订单页 -->

<template>
	<view class="order">
		<line-vue></line-vue>
		<!-- 地址栏 -->
		<view class="receiver" @tap="showPop">
			<view class="rece-img">
				<image src="../../static/img/icon-address.png" mode=""></image>
			</view>
			<view v-if="receiver" class="rece-info">
				<view class="rece-cp">
					<view class="consignee">收货人：{{receiver.consignee||'未选择'}}</view>
					<view class="phone">{{receiver.phone||'请选择'}}</view>
				</view>
				<view v-if="receiver.area||receiver.address" class="address">收货地址：{{receiver.area+' '+receiver.address}}
				</view>
			</view>
			<view v-else class="empty-tip">
				<view class="tip">请选择收货地址</view>
			</view>
			<view class="rece-right">
				<image src="../../static/img/right.png" mode=""></image>
			</view>
			<view class="lines">
				<image src="../../static/img/line.png" mode=""></image>
			</view>
		</view>
		<!-- 地址弹出层 -->
		<view class="pop" v-show="isShow" @touchmove.stop.prevent="">
			<view class="mask" @tap="hidePop"></view>
			<!-- 地址列表(Y轴滑块) -->
			<scroll-view scroll-y="true" class="pop-box" :animation="animationData">
				<view v-if="receiverList.length>0" class="address-list">
					<view v-for="(item,index) in receiverList" :key="item.id" @tap="changeReceIndex(index)"
						class="list-item">
						<view class="list-info">
							<view class="consignee">{{item.consignee}}</view>
							<view class="phone">{{item.phone}}</view>
							<view v-if="item.isdefault" class="default">默认</view>
						</view>
						<view class="list-detail">
							<view class="detail">{{item.area+' '+item.address}}</view>
						</view>
						<view class="radio-max" :class="{radioActiveMax:receIndex===index}">
							<view class="radio-min" :class="{radioActiveMin:receIndex===index}"></view>
						</view>
					</view>
				</view>
				<view v-else class="receList-empty">暂 无 地 址</view>
			</scroll-view>
			<view class="pop-btn">
				<view class="modify" @tap="goReceivr">地址管理</view>
				<view class="select" @tap="changeRece">确认选择</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<view v-if="shopList.length>0" class="shop-list">
			<view v-for="shop in shopList" :key="shop.id" class="shop-item">
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
		<view v-else class="shopList-empty">暂 无 商 品</view>
		<!-- 合计栏 -->
		<view v-if="shopList.length>0" class="count">
			<view class="total-num">商品总数：<text>{{totalNum}}</text>个</view>
			<view class="total-price">商品总价：<text>&yen; {{totalPrice.toFixed(2)}}</text></view>
		</view>
		<!-- 提交栏 -->
		<view v-if="shopList.length>0" class="amount">
			<view class="submit">
				<view @tap="goPay" class="submit-btn">提交订单</view>
			</view>
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
				totalNum: 0, // 商品总数量
				totalPrice: 0, // 商品总金额
				isShow: false, // 是否显示地址弹出层
				animationData: {}, // 动画队列
				move: 330, // 动画移动距离
				receiver: {}, // 默认收货地址
				receIndex: null // 选中的收货地址
			}
		},
		onLoad() {
			this.getReceiver() // 获取收货地址列表
			this.subCount() // 合计计算
		},
		onShow() {
			this.getReceiver() // 获取收货地址列表
		},
		watch: {
			// 监听仓库中收货信息的变化(解决异步问题)
			'receiverList': {
				handler: function(newVal) {
					this.receiver = this.receiverList.find(receiver => receiver.isdefault) // 获取默认地址
				},
				deep: true // 深度监听
			}
		},
		computed: {
			// 仓库数据映射
			...mapState('order', ['shopList']),
			...mapState('receiver', ['receiverList'])
		},
		methods: {
			// 仓库函数映射
			...mapActions('receiver', ['getReceiver']),
			...mapActions('order', ['addOrder']),
			// 合计计算
			subCount() {
				this.shopList.map(i => this.totalNum += i.goodsList.reduce((a, b) => a + b.num, 0)) // 总数量
				this.shopList.map(i => this.totalPrice += i.goodsList.reduce((a, b) => a + b.price * b.num, 0)) // 总价格
			},
			// 地址栏显示
			showPop() {
				this.isShow = true
				this.showAnimation() // 触发显示动画
			},
			// 地址栏隐藏
			hidePop() {
				this.receIndex = null
				setTimeout(() => {
					this.isShow = false
				}, 200)
				this.hideAnimation() // 触发隐藏动画
			},
			// 显示动画
			showAnimation() {
				// 创建动画实例
				const animation = uni.createAnimation({
					duration: 200, // 动画持续时间
					timingFunction: "linear" // 动画执行效果
				})
				// 定义动画
				animation.translateY(-this.move).step()
				this.animationData = animation.export() // 加入样式动画队列
			},
			// 隐藏动画
			hideAnimation() {
				const animation = uni.createAnimation({
					duration: 200,
					timingFunction: "linear"
				})
				animation.translateY(this.move).step()
				this.animationData = animation.export()
			},
			// 选中地址切换
			changeReceIndex(index) {
				this.receIndex = index
			},
			// 地址切换
			changeRece() {
				if (this.receIndex === null) {
					return uni.showToast({
						title: '请选择收货地址',
						icon: 'none'
					})
				}
				this.receiver = this.receiverList[this.receIndex]
				this.hidePop() // 隐藏地址栏
			},
			// 地址管理
			goReceivr() {
				this.hidePop()
				uni.navigateTo({
					url: '/pages/receiver/receiver'
				})
			},
			// 跳转支付
			goPay() {
				if (!this.receiver) {
					return uni.showToast({
						title: '请选择收货地址',
						icon: 'none'
					})
				}
				if (this.shopList.length < 1) {
					return uni.showToast({
						title: '订单没有商品',
						icon: 'none'
					})
				}
				// 获取当前日期
				const currentDate = new Date()
				// 订单数据
				const obj = {
					totalNum: this.totalNum,
					totalPrice: this.totalPrice,
					area: this.receiver.area,
					address: this.receiver.address,
					consignee: this.receiver.consignee,
					phone: this.receiver.phone,
					payMethod: '未支付',
					creatDate: this.formatDate(currentDate),
					shopList: JSON.stringify(this.shopList),
				}
				this.addOrder(obj) // 创建订单
			},
			// 日期格式
			formatDate(date) {
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				const hour = String(date.getHours()).padStart(2, '0')
				const minute = String(date.getMinutes()).padStart(2, '0')
				const second = String(date.getSeconds()).padStart(2, '0')
				return `${year}/${month}/${day} ${hour}:${minute}:${second}`
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

		.receiver {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			padding: 20rpx;
			background-color: #fff;

			.rece-img {
				width: 50rpx;
				height: 50rpx;

				image {
					width: 50rpx;
					height: 50rpx;
				}
			}

			.rece-info {
				width: 550rpx;

				.rece-cp {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;
					font-size: 28rpx;
				}

				.address {
					font-size: 24rpx;
					// 文本省略
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.empty-tip {
				.tip {
					font-size: 28rpx;
				}
			}

			.rece-right {
				width: 50rpx;
				height: 50rpx;

				image {
					width: 50rpx;
					height: 50rpx;
				}
			}

			.lines {
				position: absolute;
				bottom: 20rpx;
				left: 0;
				width: 100%;
				height: 6rpx;

				image {
					width: 100%;
					height: 6rpx;
				}
			}
		}

		.shop-list {
			margin-top: 20rpx;
			padding-bottom: 170rpx;

			.shop-item {
				margin-bottom: 20rpx;
				padding-bottom: 40rpx;
				background-color: #fff;

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

		.shopList-empty {
			margin-top: 200rpx;
			font-size: 38rpx;
			font-weight: bold;
			text-align: center;
		}

		.count {
			box-sizing: border-box;
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 998;
			width: 100%;
			margin-bottom: 100rpx;
			padding: 10rpx 40rpx;
			font-size: 30rpx;
			line-height: 60rpx;
			text-align: right;
			background-color: #fff;

			.total-num {
				text {
					margin-right: 20rpx;
					color: #49BDFB;
					font-weight: bold;
				}
			}

			.total-price {
				margin-right: 20rpx;

				text {
					color: #EE0A24;
					font-weight: bold;
				}
			}
		}

		.amount {
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 998;
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			background-color: #fff;

			.submit {
				display: flex;
				justify-content: flex-end;

				.submit-btn {
					width: 100%;
					height: 100rpx;
					color: #fff;
					line-height: 100rpx;
					text-align: center;
					background-color: #49BDFB;
				}
			}
		}

		// 地址弹出层
		.pop {
			position: fixed;
			left: 0;
			top: 0;
			z-index: 999;
			width: 100%;
			height: 100%;

			.mask {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, .3);
			}

			.pop-box {
				box-sizing: border-box;
				position: absolute;
				left: 0;
				bottom: -660rpx;
				z-index: 1000;
				width: 100%;
				height: 660rpx;
				padding: 40rpx 0 100rpx 40rpx;
				background-color: #fff;
				box-shadow: 0 0 16rpx rgba(0, 0, 0, .12);

				// 地址列表
				.address-list {
					.list-item {
						position: relative;
						margin-bottom: 40rpx;
						padding-bottom: 20rpx;
						font-size: 28rpx;
						border-bottom: 2rpx solid #ccc;

						.list-info {
							position: relative;
							display: flex;
							margin-bottom: 20rpx;

							.consignee {
								margin-right: 20rpx;
							}

							.default {
								width: 80rpx;
								height: 40rpx;
								margin-left: 20rpx;
								color: #49BDFB;
								font-size: 24rpx;
								line-height: 40rpx;
								text-align: center;
								border: 2rpx solid #49BDFB;
								border-radius: 20rpx;
								background-color: #fff;
							}
						}

						.list-detail {
							.detail {
								width: 660rpx;
								// 文本省略
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
						}

						.radio-max {
							box-sizing: border-box;
							position: absolute;
							top: 15rpx;
							right: 70rpx;
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

				.receList-empty {
					margin-top: 200rpx;
					font-size: 36rpx;
					font-weight: bold;
					text-align: center;
				}
			}

			.pop-btn {
				position: absolute;
				left: 0;
				bottom: 0;
				z-index: 1000;
				display: flex;
				width: 100%;
				height: 100rpx;
				color: #fff;
				line-height: 100rpx;
				text-align: center;

				.select {
					flex: 1;
					background-color: #EE0A24;
				}

				.modify {
					flex: 1;
					background-color: #49BDFB;
				}

			}
		}
	}
</style>