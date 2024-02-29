<!-- 页面-分类页 -->

<template>
	<view class="list">
		<line-vue></line-vue>
		<view class="list-body">
			<scroll-view scroll-y="true" class="left" :style="'height:'+clentHeight+'px;'">
				<view v-for="(item,index) in classifyList" :key="item.id" @tap="changeClass(index)" class="left-item">
					<view class="left-name" :class="{current:classifyIndex===index}">{{item.name}}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="right" :style="'height:'+clentHeight+'px;'">
				<view class="right-list" v-for="(item,index) in classifyItem" :key="index">
					<view class="right-hd">{{item.name}}</view>
					<view class="right-bd">
						<view class="right-item" v-for="(k,i) in JSON.parse(item.data)" :key="i"
							@tap="goSearch(k.name)">
							<view class="img-box">
								<image :src="k.imgUrl" mode=""></image>
							</view>
							<view class="right-name">{{k.name}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
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
				classifyIndex: 0, // 分类选中项
				clentHeight: 573 // 页面高度
			}
		},
		onNavigationBarSearchInputClicked() {
			// 标题栏搜索框点击事件
			uni.navigateTo({
				url: "/pages/search/search"
			})
		},
		onReady() {
			// #ifndef H5
			// 除开H5端
			const topHeight = this.getClentHeight() // 获取不同设备的手机刘海高度
			uni.getSystemInfo({
				success: (res) => {
					// console.log(res.windowHeight); // 可视窗口高度
					this.clentHeight = res.windowHeight - topHeight
				}
			})
			// #endif
		},
		onLoad() {
			this.getClassify()
			this.getClassifyItem(this.classifyIndex + 1)
		},
		computed: {
			// 仓库数据映射
			...mapState('list', ['classifyList', 'classifyItem'])
		},
		methods: {
			// 仓库函数映射
			...mapActions('list', ['getClassify', 'getClassifyItem']),
			// 商品分类切换
			changeClass(index) {
				if (this.classifyIndex === index) return
				this.classifyIndex = index
				if (this.classifyIndex % 3 === 0) return this.getClassifyItem(1)
				if (this.classifyIndex % 3 === 1) return this.getClassifyItem(2)
				if (this.classifyIndex % 3 === 2) return this.getClassifyItem(3)
			},
			// 点击跳转
			goSearch(words) {
				uni.navigateTo({
					url: `/pages/search-list/search-list?words=${words}`
				})
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

<style lang="scss">
	.list {
		.list-body {
			display: flex;
			justify-content: space-between;

			.left {
				width: 200rpx;

				.left-item {
					font-size: 28rpx;
					background-color: #f7f7f7;

					.left-name {
						padding: 30rpx 6rpx;
						text-align: center;
						border-bottom: 2rpx solid #fff;
					}

					.current {
						color: #49bdfb;
						background-color: #fff;
						border-left: 8rpx solid #49bdfb;
					}
				}
			}

			.right {
				flex: 1;
				padding-left: 30rpx;

				.right-list {
					.right-hd {
						padding: 30rpx 0;
						font-size: 28rpx;
						font-weight: bold;
					}

					.right-bd {
						display: flex;
						flex-wrap: wrap;
						justify-content: space-around;

						.right-item {
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							width: 140rpx;

							.img-box {
								width: 140rpx;
								height: 140rpx;
								margin: 0 auto;
								text-align: center;

								image {
									width: 140rpx;
									height: 140rpx;
								}
							}

							.right-name {
								padding-bottom: 20rpx;
								font-size: 24rpx;
								text-align: center;
							}
						}
					}
				}
			}
		}
	}
</style>