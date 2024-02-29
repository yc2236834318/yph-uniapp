<!-- 页面-购物车页 -->

<template>
	<view class="cart" :style="'padding-bottom:'+(cartList.length>0?'100rpx':'0')">
		<!-- 自定义标题栏 -->
		<cart-nav-bar title="购物车" :right-text="rightText" fixed="true" status-bar="true"
			@clickRight="tapEdit"></cart-nav-bar>
		<!-- 购物车列表 -->
		<view v-if="scrollTop>500" @tap="goTop" class="goTop iconfont">&#xe66c;</view>
		<view v-if="isLogin&&cartList.length>0" class="cart-box">
			<view class="cart-list" v-for="item in cartList" :key="item.id">
				<view class="hd">
					<label class="radio" @tap="shopSelect(item.id)">
						<radio :checked="item.allChecked" color="#49BDFB" />
					</label>
					<view class="title">{{item.shop}}</view>
				</view>
				<view class="cart-item" v-for="k in item.goodsList" :key="k.id">
					<label class="radio" @tap="goodsBox(item.id,k.id)">
						<radio :checked="k.isChecked" color="#49BDFB" />
					</label>
					<view class="img-box" @tap="goDetail(k.gid)">
						<image :src="k.imgUrl" mode=""></image>
					</view>
					<view class="info">
						<view class="name" @tap="goDetail(k.gid)">{{k.name}}</view>
						<view class="type">分类：{{k.type}}</view>
						<view class="pn">
							<view class="price">&yen; <text>{{k.price.toFixed(2)}}</text></view>
							<view class="number-box">
								<view v-if="isEdit" class="numBtn" @tap="onChangeNum(k.id,-1,k.num)">-</view>
								<view v-if="!isEdit" class="nums">x {{k.num}}</view>
								<view v-if="isEdit" class="nums">{{k.num}}</view>
								<view v-if="isEdit" class="numBtn" @tap="onChangeNum(k.id,1,k.num)">+</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 合计栏 -->
		<view v-if="isLogin&&cartList.length>0" class="amount" :style="'bottom:'+(isH5?'98rpx':'0')">
			<label class="radio" @tap="allGoodsSelect(!allBox)">
				<radio :checked="allBox" color="#49BDFB" /><text>全选</text>
			</label>
			<view class="count">
				<view v-if="!isEdit" class="count-price">合计：<text>&yen; {{totalCheckPrice.toFixed(2)}}</text></view>
				<view v-if="!isEdit" @tap="goOrder" class="count-btn">结算({{totalCheckNum}})</view>
				<view v-if="isEdit" @tap="goDel" class="del-btn">删除</view>
			</view>
		</view>
		<!-- 空车提示 -->
		<view v-else-if="isLogin&&cartList.length<1" class="empty">
			<view class="img-box">
				<image src="/static/img/empty.png" mode=""></image>
			</view>
			<view class="tip">购物车暂时没有商品</view>
			<view class="goBuy" @tap="goSearch">前往选购</view>
		</view>
		<!-- 登录提示 -->
		<view v-else-if="!isLogin" class="empty">
			<view class="img-box">
				<image src="/static/img/empty.png" mode=""></image>
			</view>
			<view class="tip">用户未登录</view>
			<view class="goBuy" @tap="goLogin">前往登录</view>
		</view>
		<!-- 猜你喜欢 -->
		<view class="recomList">
			<card-title cardTitle='猜你喜欢'></card-title>
			<goods-list :dataList="guessList"></goods-list>
			<view class="load">{{loadText}}</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions,
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				userInfo: {}, // 用户信息
				userToken: '', // 用户令牌
				isLogin: false, // 是否登录
				isH5: false, // 是否H5端
				isEdit: false, // 编辑按钮
				rightText: '编辑', // 编辑文字
				scrollTop: 0, // 页面滚动
				loadText: '上拉加载更多',
				guessObj: {
					start: 0,
					num: 8
				}
			}
		},
		onReady() {
			// #ifdef H5
			// H5端
			this.isH5 = true
			// #endif
		},
		onLoad() {
			this.checkLogin() // 登录验证
			this.getGuess(this.guessObj) // 获取猜你喜欢列表
			if (this.isLogin) this.getCartList() // 获取用户购物车列表
			this.isEdit = false // 默认不开启编辑模式
		},
		onShow() {
			this.checkLogin() // 登录验证
			if (this.isLogin) this.getCartList() // 获取用户购物车列表
			this.isEdit = false // 默认不开启编辑模式
		},
		onPageScroll(e) {
			// 页面滚动事件
			this.scrollTop = e.scrollTop
		},
		onReachBottom() {
			// 页面触底事件
			if (this.guessList.length > 47) return this.loadText = '没有更多数据了' // 判断是否到底
			this.guessObj.start += 8 // 一次追加8条
			this.getGuess(this.guessObj) // 追加数据
		},
		computed: {
			// 仓库数据映射
			...mapState('home', ['guessList']),
			...mapState('cart', ['cartList', 'selectList']),
			...mapGetters('cart', ['allBox', 'totalCheckNum', 'totalCheckPrice'])
		},
		methods: {
			// 仓库函数映射
			...mapActions('home', ['getGuess']),
			...mapActions('cart', ['getCartList', 'changeNum', 'delGoods']),
			...mapMutations('cart', ['editGoods', 'shopSelect', 'goodsSelect', 'setSelectList', 'allGoodsSelect']),
			...mapMutations('order', ['setShopList', 'setIsCart']),
			// 登录验证
			checkLogin() {
				try {
					this.userInfo = uni.getStorageSync('userInfo') // 获取本地的用户信息
					this.userToken = uni.getStorageSync('userToken') // 获取本地的用户令牌
				} catch (e) {
					console.log(e);
				}
				// 设置登录状态
				if (this.userToken) {
					this.isLogin = true
				} else {
					this.isLogin = false
				}
				// 更改右上角按钮文本
				if (!this.isLogin) {
					this.rightText = ''
				} else {
					this.rightText = '编辑'
				}
			},
			// 回到顶部
			goTop() {
				uni.pageScrollTo({
					scrollTop: 0, // 将页面滚动到顶部
					duration: 0 // 过渡时间
				})
			},
			// 是否编辑
			tapEdit() {
				if (this.cartList.length < 1) return
				if (this.isEdit) {
					this.isEdit = false
					this.rightText = '编辑'
					this.editGoods()
				} else {
					this.isEdit = true
					this.rightText = '完成'
					this.editGoods()
				}
			},
			// 商品选择框
			goodsBox(id, kid) {
				const obj = {
					id: id,
					kid: kid
				}
				this.goodsSelect(obj)
			},
			// 商品详情
			goDetail(gid) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${gid}`
				})
			},
			// 商品数量修改
			onChangeNum(id, value, num) {
				if (value + num < 1) return
				if (value + num > 9) return
				const obj = {
					id: id,
					num: value + num
				}
				this.changeNum(obj)
			},
			// 商品结算
			goOrder() {
				this.setSelectList()
				if (this.selectList.length < 1) {
					uni.showToast({
						title: '请选中需要购买的商品',
						icon: 'none'
					})
					return
				}
				this.setShopList(this.selectList) // 设置商品列表
				this.setIsCart(true) // 设置购买入口(立即购买/购物车购买)
				uni.navigateTo({
					url: '/pages/order/order' // 跳转到订单页
				})
			},
			// 商品删除
			goDel() {
				this.setSelectList()
				if (this.selectList.length < 1) {
					uni.showToast({
						title: '请选中需要删除的商品',
						icon: 'none'
					})
					return
				}
				uni.showModal({
					title: '商品删除',
					content: '确认删除商品',
					mask: true,
					success: (res) => {
						if (res.cancel) return
						const goodsIdList = this.selectList.map(item => item.id)
						this.delGoods(goodsIdList) // 删除商品
						this.rightText = '编辑'
					}
				})
			},
			// 前往选购
			goSearch() {
				uni.navigateTo({
					url: "/pages/search-list/search-list?words=全部"
				})
			},
			// 前往登录
			goLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cart {
		position: relative;
		background-color: rgb(247, 248, 250);

		.goTop {
			position: fixed;
			right: 5%;
			bottom: 20%;
			z-index: 999;
			width: 100rpx;
			height: 100rpx;
			color: #49BDFB;
			font-size: 48rpx;
			font-weight: bold;
			line-height: 110rpx;
			border-radius: 50%;
			text-align: center;
			background-color: #fff;
			box-shadow: 0 0 16rpx rgba(0, 0, 0, .12);
		}

		.load {
			color: #636263;
			line-height: 80rpx;
			text-align: center;
		}

		.cart-box {
			padding-bottom: 40rpx;

			.cart-list {
				.hd {
					display: flex;
					height: 80rpx;
					margin-top: 20rpx;
					padding: 0 40rpx;
					line-height: 80rpx;
					background-color: #fff;
					box-shadow: 0 -8rpx 8rpx rgba(0, 0, 0, .015);

					label {
						margin-right: 10rpx;
						line-height: 80rpx;
					}

					.title {
						font-size: 30rpx;
						// 文本省略
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.cart-item {
					display: flex;
					justify-content: space-between;
					padding: 20rpx 40rpx;

					&:not(:last-of-type) {
						border-bottom: 20rpx solid #fff;
					}

					label {
						margin-right: 20rpx;
						line-height: 200rpx;
					}

					.img-box {
						width: 200rpx;
						height: 200rpx;
						margin-right: 20rpx;

						image {
							width: 200rpx;
							height: 200rpx;
						}
					}

					.info {
						.name {
							font-size: 28rpx;
							// 文本省略
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							word-break: break-all;
							-webkit-box-orient: vertical;
						}

						.type {
							margin-top: 10rpx;
							color: #888;
							font-size: 26rpx;
						}

						.pn {
							display: flex;
							justify-content: space-between;
							margin-top: 10rpx;

							.price {
								color: #EE0A24;
								font-size: 26rpx;

								text {
									margin-left: 6rpx;
									font-size: 32rpx;
								}
							}

							.number-box {
								display: flex;
								margin-top: -5rpx;

								.nums,
								.numBtn {
									width: 60rpx;
									height: 60rpx;
									line-height: 60rpx;
									text-align: center;
								}

								.nums {
									font-size: 24rpx;
								}

								.numBtn {
									font-size: 36rpx;
									background-color: #eee;
								}
							}
						}
					}
				}
			}
		}

		.amount {
			position: fixed;
			left: 0;
			z-index: 999;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			background-color: #fff;
			box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, .12);

			label {
				margin-left: 40rpx;

				text {
					font-size: 30rpx;
				}
			}

			.count {
				display: flex;
				justify-content: center;

				.count-price {
					margin-right: 20rpx;
					font-size: 30rpx;
					line-height: 100rpx;

					text {
						color: #EE0A24;
						font-size: 32rpx;
					}
				}

				.count-btn,
				.del-btn {
					width: 240rpx;
					height: 100rpx;
					color: #fff;
					line-height: 100rpx;
					text-align: center;
				}

				.count-btn {
					background-color: #49BDFB;
				}

				.del-btn {
					background-color: #EE0A24;
				}
			}
		}

		.empty {
			padding-bottom: 80rpx;

			.img-box {
				width: 300rpx;
				height: 300rpx;
				margin: 0 auto;

				image {
					width: 300rpx;
					height: 300rpx;
				}
			}

			.tip {
				margin-bottom: 40rpx;
				color: #323233;
				font-size: 28rpx;
				text-align: center;
			}

			.goBuy {
				width: 250rpx;
				height: 64rpx;
				margin: 0 auto;
				color: #EE0A24;
				font-size: 28rpx;
				line-height: 64rpx;
				text-align: center;
				border: 2rpx solid #EE0A24;
				border-radius: 32rpx;
			}
		}
	}
</style>