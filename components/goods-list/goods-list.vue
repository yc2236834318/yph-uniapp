<!-- 公用组件-商品列表 -->

<template>
	<view class="goods-list">
		<goods-item :dataList="dataList"></goods-item>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: null
		}
	}
</script>

<style lang="scss" scoped>
	.goods-list{
		background-color: #fff;
	}
</style>