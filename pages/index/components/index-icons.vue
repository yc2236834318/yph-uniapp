<!-- 组件-宫格图标 -->

<template>
	<view class="icons">
		<view class="icons-item" @tap="goList(item.name)" v-for="(item,index) in dataList" :key="index">
			<image class="icons-img" :src="item.imgUrl" mode=""></image>
			<text class="icons-text">{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: Array
		},
		methods: {
			goList(name) {
				uni.navigateTo({
					url: `/pages/search-list/search-list?words=${name}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icons {
		display: flex;
		flex-wrap: wrap;

		.icons-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 25%;
			padding-top: 20rpx;

			.icons-img {
				width: 80rpx;
				height: 80rpx;
			}

			.icons-text {
				margin-top: 6rpx;
				color: #2c2c2c;
				font-size: 26rpx;
			}
		}
	}
</style>