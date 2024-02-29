<!-- 公用组件-卡片标题 -->

<template>
	<view class="card">
		<view>-</view>
		<view class="title">{{cardTitle}}</view>
		<view>-</view>
	</view>
</template>

<script>
	export default {
		props: {
			cardTitle: String
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		display: flex;
		justify-content: center;
		padding: 35rpx 0;
		font-weight: bold;
		background-color: #fff;

		.title {
			padding: 0 20rpx;
			font-size: 32rpx;
		}
	}
</style>