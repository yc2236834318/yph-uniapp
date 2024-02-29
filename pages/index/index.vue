<!-- 页面-首页 -->

<template>
	<view class="index">
		<!-- 头部分类滑块 -->
		<scroll-view class="topbar-list" scroll-x="true" :style="'top:'+topHeight+'px'"
			:scroll-into-view="`top${topbarIndex-1}`">
			<view :id="'top'+index" class="topbar-item" @tap="changeTap(index)" v-for="(item,index) in topbarList"
				:key="index">
				<text :class="{topbarIndex:topbarIndex === index}">{{item.name}}</text>
			</view>
		</scroll-view>

		<!-- 页面主体 -->
		<view v-if="oldScrollTop>800" @tap="goTop" class="goTop iconfont">&#xe66c;</view>
		<swiper @change="onChangeTap" :current="topbarIndex" :style="'height:'+clentHeight+'px;'">
			<!-- 首页-推荐模板 -->
			<swiper-item>
				<scroll-view scroll-y="true" class="scroll-view" :scroll-top="scrollTop" @scroll="scroll"
					@scrolltolower="loadMore" :style="'height:'+clentHeight+'px;'">
					<block>
						<index-swiper :dataList="swiperList"></index-swiper>
						<index-recom :dataList="recomList"></index-recom>
						<view class="img-box" @tap="goList">
							<image src="../../static/img/discount.png" mode=""></image>
						</view>
						<card-title cardTitle='猜你喜欢'></card-title>
						<goods-list :dataList="guessList"></goods-list>
						<view class="load">{{loadText}}</view>
					</block>
				</scroll-view>
			</swiper-item>
			<!-- 首页-其他模板 -->
			<swiper-item v-for="(item,index) in 6" :key="index">
				<scroll-view scroll-y="true" class="scroll-view" :scroll-top="scrollTop" @scroll="scroll"
					@scrolltolower="loadMore" :style="'height:'+clentHeight+'px;'">
					<block>
						<index-banner :bannerObj="bannerList[index]"></index-banner>
						<index-icons :dataList="index%2===0?iconsList.slice(0,8):iconsList.slice(8)"></index-icons>
						<card-title cardTitle='热销爆品'></card-title>
						<index-hot :dataList="index%2===0?hotList.slice(0,6):hotList.slice(6)"></index-hot>
						<card-title cardTitle='推荐店铺'></card-title>
						<index-shop :dataList="index%2===0?shopList.slice(0,2):shopList.slice(2)"></index-shop>
						<card-title cardTitle='为您推荐'></card-title>
						<goods-list :dataList="guessList"></goods-list>
						<view class="load">{{loadText}}</view>
					</block>
				</scroll-view>
			</swiper-item>
		</swiper>
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
				topbarIndex: 0, // 选中的topBar
				clentHeight: 573, // 选中的页面主体的高度
				topHeight: 40, // 刘海高度
				scrollTop: 0, // 页面滚动距离
				oldScrollTop: 0, // 页面之前的距离
				loadText: '上拉加载更多',
				guessObj: {
					start: 0,
					num: 8
				}
			}
		},
		onLoad() {
			// 仓库函数
			this.getTopbar()
			this.getSwiper()
			this.getRecom()
			this.getBanner()
			this.getIcons()
			this.getHot()
			this.getShop()
			this.getGuess(this.guessObj)
		},
		onReady() {
			// #ifndef H5
			// 除开H5端
			this.topHeight = 0
			const topHeight = this.getClentHeight() // 获取不同设备的手机刘海高度
			uni.getSystemInfo({
				success: (res) => {
					// console.log(res.windowHeight); // 可视窗口高度
					this.clentHeight = res.windowHeight - uni.upx2px(80) - topHeight
				}
			})
			// #endif
		},
		onNavigationBarButtonTap(e) {
			// 标题栏按钮点击事件
			if (e.float === 'left') {
				uni.navigateTo({
					url: "../search/search"
				})
			}
		},
		computed: {
			// 仓库数据映射
			...mapState('home', ['topbarList', 'swiperList', 'recomList', 'bannerList', 'iconsList', 'hotList',
				'shopList', 'guessList'
			])
		},
		methods: {
			// 仓库函数映射
			...mapActions('home', ['getTopbar', 'getSwiper', 'getRecom', 'getBanner', 'getIcons', 'getHot', 'getShop',
				'getGuess'
			]),
			// 顶部滑块切换
			changeTap(id) {
				this.topbarIndex = id // 更改选中选项卡
			},
			// 页面跳转
			goList() {
				uni.navigateTo({
					url: "/pages/search-list/search-list?words=折扣"
				})
			},
			// 页面主体切换
			onChangeTap(e) {
				this.changeTap(e.detail.current) // 页面swiper子项序号
			},
			// 页面滚动
			scroll(e) {
				this.oldScrollTop = e.detail.scrollTop // 监听页面滚动距离
			},
			// 回到顶部
			goTop() {
				// 视图会发生重新渲染
				this.scrollTop = this.oldScrollTop
				// 当视图渲染结束 重新设置为0
				this.$nextTick(() => {
					this.scrollTop = 0
				})
			},
			// 触底加载更多
			loadMore() {
				if (this.guessList.length > 47) return this.loadText = '没有更多数据了'; // 判断是否到底
				this.guessObj.start += 8 // 一次追加8条
				this.getGuess(this.guessObj) // 追加数据
			},
			// 手机刘海高度(设备兼容)
			getClentHeight() {
				const res = uni.getSystemInfo() // 获取设备信息
				const system = res.platform // 设备型号
				if (system === 'ios') {
					// 在苹果手机中,页面高度包括手机刘海:44
					return 44 + res.statusBarHeight
				} else if (system === 'android') {
					// 在安卓手机中,页面高度包括手机刘海:48
					return 48 + res.statusBarHeight
				} else {
					// 在H5和小程序中,页面高度不包括手机刘海
					return 0
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		position: relative;
		padding-top: 74rpx;

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

		.img-box {
			width: 100%;
			height: 640rpx;

			image {
				width: 100%;
				height: 640rpx;
			}
		}

		.topbar-list {
			position: fixed;
			left: 0;
			z-index: 9999;
			width: 100%;
			height: 80rpx;
			white-space: nowrap;
			background-color: #fff;
			box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, .08);

			.topbar-item {
				display: inline-block;
				padding: 10rpx 30rpx;
				font-size: 28rpx;

				.topbarIndex {
					padding-bottom: 10rpx;
					color: #EE0A24;
					border-bottom: 6rpx solid #EE0A24;
				}
			}
		}

		.load {
			color: #636263;
			line-height: 80rpx;
			text-align: center;
		}
	}
</style>