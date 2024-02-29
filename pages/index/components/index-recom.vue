<!-- 组件-商品推荐 -->

<template>
	<view class="recommend">
		<view class="recommend-item" v-for="(item,index) in dataList" :key="index"
			:style="{ 'background-color': index === 0 ? 'mediumpurple' : 'lightskyblue' }">
			<image @tap="goList" class="img-hd" :src="item.bigUrl" mode=""></image>
			<view class="img-list">
				<block v-for="(k,i) in item.imgList" :key="i">
					<image @tap="goDetail(i)" class="img-bd" :src="k" mode=""></image>
				</block>
			</view>
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
					url: "/pages/search-list/search-list?words=折扣"
				})
			},
			goDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id+1}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.recommend {
		padding: 0 20rpx;

		.recommend-item {
			overflow: hidden;
			display: flex;
			flex-direction: column;
			margin: 20rpx 0;
			padding: 16rpx;
			border-radius: 20rpx;

			.img-hd {
				width: 100%;
				height: 300rpx;
			}

			.img-list {
				width: 100%;
				height: 220rpx;
				margin-top: 20rpx;

				.img-bd {
					width: 32%;
					height: 220rpx;
					border-radius: 20rpx;

					&:not(:last-of-type) {
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>