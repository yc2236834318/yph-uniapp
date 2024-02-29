<!-- 组件-版图 -->

<template>
	<view class="banner" v-if="bannerObj">
		<image @tap="goDetail(bannerObj.id)" :src="bannerObj.imgUrl" mode=""></image>
	</view>
</template>

<script>
	export default {
		props: {
			bannerObj: null
		},
		methods: {
			goDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id+1}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.banner {
		width: 100%;
		height: 300rpx;

		image {
			width: 100%;
			height: 300rpx;
		}
	}
</style>