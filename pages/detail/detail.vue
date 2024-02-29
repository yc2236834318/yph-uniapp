<!-- 页面-商品详情页 -->

<template>
	<view class="detail">
		<view v-if="scrollTop>500" @tap="goTop" class="goTop iconfont">&#xe66c;</view>
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000"
			circular="true">
			<swiper-item v-for="item in 3" :key="item">
				<view class="swiper-item">
					<image :src="goodsObj.imgUrl" mode="" class="swiper-img"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="goods">
			<view class="name">{{goodsObj.name}}</view>
			<view class="price" v-if="goodsObj.price">&yen;<text>{{goodsObj.price.toFixed(2)}}</text></view>
			<view class="oprice low" v-if="goodsObj.oprice">原价 &yen; {{goodsObj.oprice.toFixed(2)}}</view>
			<view class="tip">
				<text class="iconfont low">&#xe6f8;7天无理由</text>
				<text class="iconfont low">&#xe6f8;48小时内发货</text>
			</view>
			<view class="delivery low">
				<text>快递</text>
				<text>&yen;10</text>
			</view>
			<view class="ticket low">
				<text>领券<text class="discount">满699减60</text><text class="discount">满399减30</text></text>
				<text class="iconfont arrow">&#xeb8b;</text>
			</view>
		</view>
		<view class="line"></view>
		<view class="brand">
			<view class="title">品牌</view>
			<view class="hd">
				<view class="left">
					<view class="img-box">
						<image src="../../static/img/brand.jpg" mode=""></image>
					</view>
					<text>鸿星尔克</text>
				</view>
				<view class="right">
					<view class="small-img">
						<image src="../../static/img/goods10.jpg" mode=""></image>
					</view>
					<view class="small-img">
						<image src="../../static/img/goods11.jpg" mode=""></image>
					</view>
					<view class="small-img">
						<image src="../../static/img/goods12.jpg" mode=""></image>
					</view>
					<text>145</text>
					<text class="iconfont arrow">&#xeb8b;</text>
				</view>
			</view>
			<view class="line"></view>
			<view class="store">
				<view class="left">
					<view class="img-box">
						<image src="../../static/img/store.png" mode=""></image>
					</view>
					<view class="name">
						<view class="title">奥特莱斯自营店</view>
						<view class="num">在售商品145件</view>
					</view>
				</view>
				<view class="right">
					<text>查看店铺</text>
				</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="introduce">
			<view class="detail-img">
				<image src="../../static/img/detail1.png" mode="widthFix"></image>
			</view>
			<view class="detail-img">
				<image src="../../static/img/detail2.jpg" mode="widthFix"></image>
			</view>
			<view class="detail-img">
				<image src="../../static/img/detail3.jpg" mode="widthFix"></image>
			</view>
		</view>
		<card-title cardTitle='猜你喜欢'></card-title>
		<goods-list :dataList="guessList"></goods-list>
		<view class="load">{{loadText}}</view>
		<!-- 底部操作栏 -->
		<view class="foot">
			<view class="iconfont icons">&#xe622;</view>
			<view class="iconfont icons cartIcon" @tap="goCart">
				<text>&#xe602;</text>
				<text v-if="isLogin&&totalNum>0" class="cartNum">{{totalNum}}</text>
			</view>
			<view class="addCart btn" @tap="showPop(0)">加入购物车</view>
			<view class="buy btn" @tap="showPop(1)">立即购买</view>
		</view>
		<!-- 底部弹出层 -->
		<view class="pop" v-show="isShow" @touchmove.stop.prevent="">
			<view class="mask" @tap="hidePop"></view>
			<view class="pop-box" :animation="animationData">
				<view class="goodsInfo">
					<view class="img-box">
						<image :src="goodsObj.imgUrl" mode=""></image>
					</view>
					<view class="info">
						<view v-if="goodsObj.price" class="price">&yen; {{goodsObj.price.toFixed(2)}}</view>
						<view class="num">可购{{goodsObj.id}}{{goodsObj.id+2}}件</view>
						<view class="type">已选 {{goodsType}}</view>
					</view>
					<view class="close iconfont" @tap="hidePop">&#xe603;</view>
				</view>
				<view class="line"></view>
				<view class="goodsType">
					<view class="title">商品类型</view>
					<view class="type-list">
						<view class="type-item" :class="{current:typeIndex===index}" v-for="(item,index) in typeList"
							:key="index" @tap="changeType(index)">{{item}}</view>
					</view>
				</view>
				<view class="line"></view>
				<view class="goodsNum">
					<view class="title">购买数量</view>
					<view class="number-box">
						<view class="numBtn" @tap="changeNum(-1)">-</view>
						<view class="nums">{{goodsNum}}</view>
						<view class="numBtn" @tap="changeNum(1)">+</view>
					</view>
				</view>
				<view class="line"></view>
				<view @tap="goBuy(btnText==='立即购买'?1:0)" class="btn">{{btnText}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				userInfo: {}, // 用户信息
				userToken: '', // 用户令牌
				isLogin: false, // 是否登录
				goodsId: '', // 商品ID
				loadText: '上拉加载更多',
				scrollTop: 0, // 页面滚动
				isShow: false, // 是否显示商品弹出层
				animationData: {}, // 动画队列
				move: 330, // 动画移动距离
				btnText: '确 定',
				typeIndex: 0,
				goodsType: '深空灰',
				goodsNum: 1,
				typeList: ['深空灰', '云杉绿', '皓月银'],
				guessObj: {
					start: 0,
					num: 8
				},
			}
		},
		onLoad(e) {
			this.checkLogin() // 登录验证
			if (this.isLogin) this.getCartList() // 获取购物车数据
			this.goodsId = e.id // 获取地址栏参数:商品ID
			this.getGoodsByID(this.goodsId) // 获取商品信息
			this.getGuess(this.guessObj) // 获取猜你喜欢列表
		},
		onShow() {
			this.checkLogin() // 登录验证
			if (this.isLogin) this.getCartList() // 获取购物车数据
		},
		onReady() {
			// #ifndef H5
			// 除开H5端
			this.move = 345
			// #endif
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
		onBackPress() {
			// 页面返回事件
			if (this.isShow) {
				this.hidePop() // 隐藏购买栏
				return true
			}
		},
		onNavigationBarButtonTap(e) {
			// 标题栏点击事件
			if (e.type === 'share') {
				// 商品分享事件
				uni.share({
					"provider": "weixin", // 分享的服务商
					"scene": "WXSceneSession", // 分享的目标(微信好友)
					"type": 0, // 分享的方式(0 图文分享; 1 文本分享)
					"title": this.goodsObj.name, // 分享标题
					// "summary":"商品摘要", // 商品摘要(type为1时必填)
					"href": `http://192.168.1.6:8080/#/pages/detail/detail?id=${this.goodsObj.id}`, // 分享路径(type为0时必填)
					"imageUrl": this.goodsObj.imgUrl, // 分享的封面
					success: (res) => {
						uni.showTabBar({
							title: "分享成功"
						})
					}
				})
			}
		},
		computed: {
			// 仓库数据映射
			...mapState('home', ['guessList']),
			...mapState('detail', ['goodsObj']),
			...mapGetters('cart', ['totalNum'])
		},
		methods: {
			// 仓库函数映射
			...mapActions('home', ['getGuess']),
			...mapActions('detail', ['getGoodsByID']),
			...mapActions('cart', ['addCart', 'getCartList']),
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
			},
			// 回到顶部
			goTop() {
				uni.pageScrollTo({
					scrollTop: 0, // 将页面滚动到顶部
					duration: 0 // 过渡时间
				})
			},
			// 购买栏显示
			showPop(flag) {
				this.isShow = true
				this.showAnimation() // 触发显示动画
				if (!flag) {
					this.btnText = "加入购物车"
				} else {
					this.btnText = "立即购买"
				}
			},
			// 购买栏隐藏
			hidePop() {
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
			// 去购物车
			goCart() {
				uni.switchTab({
					url: "/pages/cart/cart"
				})
			},
			// 商品类型
			changeType(index) {
				this.typeIndex = index
				this.goodsType = this.typeList[index]
			},
			// 商品数量
			changeNum(num) {
				if (this.goodsNum + num > 9) return
				if (this.goodsNum + num < 1) return
				this.goodsNum += num
			},
			// 商品购买
			goBuy(flag) {
				if (!this.isLogin) {
					uni.showModal({
						title: '温馨提示',
						content: '请先登录',
						cancelText: '再看看',
						confirmText: '去登录',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pages/login/login"
								})
							}
						}
					})
					return
				}
				this.hidePop() // 隐藏购买栏
				const obj = {
					gid: this.goodsObj.id,
					goodsNum: this.goodsNum,
					goodsType: this.goodsType
				}
				if (!flag) {
					// 加入购物车
					this.addCart(obj) // 加入购物车
				} else {
					// 立即购买
					obj.imgUrl = this.goodsObj.imgUrl
					obj.name = this.goodsObj.name
					obj.price = this.goodsObj.price
					obj.shop = this.goodsObj.shop
					obj.num = this.goodsNum
					this.setShopList(Array.from([obj])) // 设置商品列表
					this.setIsCart(false) // 设置购买入口(立即购买/购物车购买)
					uni.navigateTo({
						url: '/pages/order/order' // 跳转到订单页
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		position: relative;
		padding-bottom: 106rpx;

		.goTop {
			position: fixed;
			right: 5%;
			bottom: 10%;
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

		.swiper {
			height: 750rpx;
			width: 750rpx;

			.swiper-item {
				.swiper-img {
					height: 750rpx;
					width: 750rpx;
				}
			}
		}

		.goods {
			margin-top: 40rpx;
			padding: 0 50rpx;

			.low {
				color: #666;
				font-size: 26rpx;
			}

			.name {
				width: 100%;
				font-size: 36rpx;
				font-weight: bold;
				// 文本省略
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				word-break: break-all;
				-webkit-box-orient: vertical;
			}

			.price {
				margin-top: 20rpx;
				color: #EE0A24;
				text-align: center;
				font-weight: bold;

				text {
					margin-left: 10rpx;
					font-size: 40rpx;
				}
			}

			.oprice {
				margin-top: 20rpx;
				text-align: center;
				text-decoration: line-through
			}

			.tip {
				margin-top: 20rpx;
				text-align: center;

				text:first-of-type {
					margin-right: 20rpx;
				}
			}

			.delivery,
			.ticket {
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;
			}

			.ticket {
				line-height: 40rpx;

				.discount {
					margin-left: 20rpx;
					padding: 0 10rpx;
					color: #49BDFB;
					border: 2rpx solid #49BDFB;
					border-radius: 10rpx;
				}

				.arrow {
					font-size: 40rpx;
					font-weight: bold;
				}
			}
		}

		.line {
			width: 650rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			border-bottom: 2rpx solid #d2d2d2;
		}

		.brand {
			margin-top: 40rpx;
			padding: 0 50rpx;

			.title {
				margin-bottom: 20rpx;
				font-size: 30rpx;
				font-weight: bold;
			}

			.hd {
				display: flex;
				justify-content: space-between;

				.img-box {
					width: 100rpx;
					height: 100rpx;
					background-color: #fff;
					border-radius: 50%;

					image {
						width: 100rpx;
						height: 100rpx;
					}
				}

				.left,
				.right {
					display: flex;

					text {
						margin-left: 10rpx;
						color: #666;
						font-size: 30rpx;
						line-height: 100rpx;
					}

					.small-img {
						overflow: hidden;
						width: 70rpx;
						height: 70rpx;
						margin-top: 10rpx;
						background-color: #fff;
						border-radius: 50%;

						image {
							width: 70rpx;
							height: 70rpx;
						}
					}

					.arrow {
						font-size: 40rpx;
						font-weight: bold;
					}
				}
			}
		}

		.store {
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;

			.left {
				display: flex;

				.img-box {
					overflow: hidden;
					width: 100rpx;
					height: 100rpx;
					margin-right: 20rpx;
					background-color: #fff;
					border-radius: 50%;

					image {
						width: 100rpx;
						height: 100rpx;
					}
				}

				.name {
					padding-top: 10rpx;

					.title {
						margin-bottom: 6rpx;
					}

					.num {
						color: #666;
						font-size: 26rpx;
					}
				}
			}

			.right {
				text {
					padding: 10rpx 20rpx;
					color: #fff;
					font-size: 26rpx;
					line-height: 100rpx;
					border-radius: 30rpx;
					background-color: #000;
				}
			}
		}

		.introduce {
			margin-top: 40rpx;

			.detail-img {
				width: 750rpx;

				image {
					width: 750rpx;
				}
			}
		}

		.foot {
			position: fixed;
			bottom: -6rpx;
			left: 0;
			display: flex;
			align-items: center;
			width: 100%;
			height: 106rpx;
			padding: 0 40rpx;
			background-color: #fff;
			box-shadow: 0 0 16rpx rgba(0, 0, 0, .12);

			.icons {
				width: 60rpx;
				height: 60rpx;
				color: #fff;
				font-size: 38rpx;
				line-height: 60rpx;
				border-radius: 50%;
				text-align: center;
				background-color: #000;

				&:first-of-type {
					margin-right: 20rpx;
					font-weight: bold;
				}
			}

			.cartIcon {
				position: relative;

				.cartNum {
					overflow: hidden;
					position: absolute;
					top: -10rpx;
					right: -20rpx;
					z-index: 999;
					width: 40rpx;
					height: 40rpx;
					color: #fff;
					font-size: 24rpx;
					line-height: 40rpx;
					background-color: #EE0A24;
					border-radius: 20rpx;
				}
			}

			.btn {
				width: 240rpx;
				margin-left: 30rpx;
				padding: 12rpx 0;
				color: #fff;
				font-size: 28rpx;
				line-height: 50rpx;
				text-align: center;
				border-radius: 40rpx;
				box-shadow: 0 0 16rpx rgba(0, 0, 0, .12);
			}

			.addCart {
				background-color: #49BDFB;
			}

			.buy {
				background-color: #EE0A24;
			}
		}

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
				position: absolute;
				left: 0;
				bottom: -660rpx;
				// #ifdef MP-WEIXIN
				bottom: -700rpx;
				// #endif
				z-index: 1000;
				width: 100%;
				height: 660rpx;
				background-color: #fff;
				box-shadow: 0 0 16rpx rgba(0, 0, 0, .12);

				.line {
					width: 90%;
					height: 2rpx;
					margin: 0 auto;
					margin-bottom: 20rpx;
					border-bottom: 2rpx solid #e7e7e7;
				}

				.title {
					margin-bottom: 20rpx;
					font-size: 30rpx;
					font-weight: bold;
				}

				.goodsInfo {
					position: relative;
					display: flex;
					padding: 20rpx 0 40rpx 280rpx;

					.img-box {
						position: absolute;
						left: 40rpx;
						top: -60rpx;
						width: 200rpx;
						height: 200rpx;

						image {
							width: 200rpx;
							height: 200rpx;
						}
					}

					.info {
						.price {
							color: #49BDFB;
							font-size: 38rpx;
							font-weight: bold;
						}

						.num {
							font-size: 28rpx;
						}

						.type {
							font-size: 28rpx;
						}
					}

					.close {
						position: absolute;
						top: 20rpx;
						right: 20rpx;
						color: #999;
						font-size: 50rpx;
					}
				}

				.goodsType {
					padding-left: 40rpx;

					.type-list {
						display: flex;
						margin-bottom: 20rpx;

						.type-item {
							height: 50rpx;
							padding: 0 20rpx;
							margin-right: 20rpx;
							line-height: 50rpx;
							color: #49BDFB;
							font-size: 26rpx;
							text-align: center;
							border: 4rpx solid #49BDFB;
							border-radius: 25rpx;
						}

						.current {
							color: #fff;
							background-color: #49BDFB;
						}
					}
				}

				.goodsNum {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 80rpx;
					padding: 0 40rpx;
					line-height: 60rpx;

					.number-box {
						display: flex;
						margin-top: -20rpx;

						.nums,
						.numBtn {
							width: 60rpx;
							height: 60rpx;
							line-height: 60rpx;
							font-weight: bold;
							text-align: center;
						}

						.nums {
							font-size: 24rpx;
							background-color: #f7f7f7;
						}

						.numBtn {
							font-size: 36rpx;
							background-color: #eee;
						}
					}
				}

				.btn {
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					height: 100rpx;
					color: #fff;
					line-height: 100rpx;
					text-align: center;
					background-color: #49BDFB;
				}
			}
		}
	}
</style>