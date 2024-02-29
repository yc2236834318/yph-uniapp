<!-- 组件-店铺推荐 -->

<template>
	<view class="shop">
		<view class="shop-item" v-for="(item,index) in dataList" :key="index">
			<view @tap="goList" class="banner">
				<image :src="item.bigUrl" mode=""></image>
			</view>
			<!-- x轴滑块 -->
			<scroll-view scroll-x="true" class="goods-list">
				<view class="goods-item">
					<index-shop-item :dataList="JSON.parse(item.data)" wrap="no-wrap"></index-shop-item>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: Array
		},
		methods: {
			goList() {
				uni.navigateTo({
					url: "/pages/search-list/search-list?words=推荐"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shop {
		.shop-item {
			border-bottom: 6rpx solid #f6f6f6;

			.banner {
				width: 100%;
				height: 350rpx;

				image {
					width: 100%;
					height: 350rpx;
				}
			}

			.goods-list {
				width: 100%;
				white-space: nowrap; // 禁止换行(实现滑块效果)
				background-color: #f6f6f6;
			}

			.goods-item {
				display: inline-block;
			}
		}
	}
</style>