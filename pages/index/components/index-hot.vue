<!-- 组件-热销列表 -->

<template>
	<view class="hot">
		<index-hot-item :dataList="dataList"></index-hot-item>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: Array
		}
	}
</script>

<style lang="scss" scoped>
	.hot {
		background-color: #f6f6f6;
		padding-bottom: 4rpx;
	}
</style>