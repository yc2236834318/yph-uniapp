<!-- 组件-轮播图 -->

<template>
	<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular=true>
		<swiper-item @tap="goDetail(item.id)" v-for="(item,index) in dataList" :key="index">
			<view class="swiper-item">
				<image class="swiper-img" :src="item.imgUrl" mode=""></image>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		props: {
			dataList: Array
		},
		methods: {
			goDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	swiper {
		width: 100%;
		height: 360rpx;

		.swiper-img {
			width: 100%;
			height: 360rpx;
		}
	}
</style>