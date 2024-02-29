<!-- 页面-搜索结果页 -->

<template>
	<view class="search">
		<view v-if="scrollTop>500" @tap="goTop" class="goTop iconfont">&#xe66c;</view>
		<view class="search-title" :style="{'top':device === 0 ?'88rpx':'-6rpx'}">
			<view v-for="(item,index) in titleList.data" :key="index" @tap="changeTap(index)" class="search-item">
				<view :class="{current:index === titleList.currentIndex}" class="text">{{item.name}}</view>
				<view class="icons">
					<view :class="{current:item.status === 1}" class="iconfont">&#xeb8a;</view>
					<view :class="{current:item.status === 2}" class="iconfont">&#xeb8c;</view>
				</view>
			</view>
		</view>
		<goods-list :dataList="searchList"></goods-list>
		<view class="load">{{loadText}}</view>
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
				words: '', // 搜索关键字
				loadText: '上拉加载更多',
				scrollTop: 0, // 页面滚动
				device: 0, // 设备类型(0 H5,1 APP/小程序)
				titleList: {
					currentIndex: 0,
					data: [{
							name: '销量',
							status: 1
						},
						{
							name: '价格',
							status: 0
						},
						{
							name: '折扣',
							status: 0
						}
					]
				},
				searchObj: {
					order: 'sales',
					sort: 'DESC',
					page: 1,
					add: false
				}
			}
		},
		onLoad(e) {
			this.words = e.words // 获取地址栏参数:搜索关键字
			// 将搜索栏的提示文字修改为接收的参数(APP)
			// #ifdef APP-PLUS
			const webView = this.$mp.page.$getAppWebview()
			webView.setTitleNViewSearchInputText(e.words)
			// #endif
			// 设备判断
			this.deviceFun()
			// 仓库函数
			this.getSearch(this.searchObj)
		},
		onPageScroll(e) {
			// 页面滚动事件
			this.scrollTop = e.scrollTop
		},
		onReachBottom() {
			// 页面触底事件
			if (this.searchList.length > 47) return this.loadText = '没有更多数据了'
			this.searchObj.add = true
			this.searchObj.page++
			this.getSearch(this.searchObj)
		},
		onNavigationBarSearchInputClicked() {
			// 标题栏搜索框点击事件
			uni.navigateTo({
				url: "/pages/search/search"
			})
		},
		computed: {
			// 仓库数据映射
			...mapState('search', ['searchList'])
		},
		methods: {
			// 仓库函数映射
			...mapActions('search', ['getSearch']),
			// 设备判断
			deviceFun() {
				if (process.env.UNI_PLATFORM === 'h5') {
					this.device = 0
				} else {
					this.device = 1
				}
			},
			// 回到顶部
			goTop() {
				uni.pageScrollTo({
					scrollTop: 0, // 将页面滚动到顶部
					duration: 0 // 过渡时间
				})
			},
			// 排序项切换
			changeTap(index) {
				this.goTop() // 回到顶部
				this.loadText = '上拉加载更多'
				this.titleList.currentIndex = index // 文字样式切换
				// 箭头样式切换
				const status = this.titleList.data[index].status // 获取被点击的排序项的status
				this.titleList.data.forEach((item) => item.status = 0) // 将所有排序项的status设为0
				// 设置被点击的排序项的status
				if (status === 0) {
					this.titleList.data[index].status = 1
					this.searchObj.sort = 'DESC'
				} else if (status === 1) {
					this.titleList.data[index].status = 2
					this.searchObj.sort = 'ASC'
				} else if (status === 2) {
					this.titleList.data[index].status = 1
					this.searchObj.sort = 'DESC'
				}
				// 重新获取数据
				this.searchObj.add = false
				this.searchObj.page = 1
				if (index === 0) {
					this.searchObj.order = 'sales'
				} else if (index === 1) {
					this.searchObj.order = 'price'
				} else if (index === 2) {
					this.searchObj.order = 'discount'
				}
				this.getSearch(this.searchObj)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		position: relative;
		padding-top: 80rpx;

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

		.search-title {
			position: fixed;
			left: 0;
			z-index: 999;
			display: flex;
			width: 100%;
			color: #636263;
			text-align: center;
			background-color: #fff;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

			.search-item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 80rpx;

				.text {
					font-size: 30rpx;
				}

				.icons {
					margin-top: -10rpx;
					font-weight: bold;

					view {
						width: 30rpx;
						height: 18rpx;
					}
				}

				.current {
					color: #49BDFB;
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