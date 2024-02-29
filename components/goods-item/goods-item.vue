<!-- 公用组件-商品信息 -->

<template>
	<view class="goods-box">
		<view v-for="(item,index) in dataList" :key="index" @tap="goDetail(item.id)" class="item">
			<view class="img-box">
				<image :src="item.imgUrl" mode=""></image>
			</view>
			<view class="content">
				<view class="title">{{item.name}}</view>
				<view class="price">
					<text class="n-price"><text class="money">&yen;</text>{{item.price}}</text>
					<text class="o-price"><text>&yen;</text>{{item.oprice}}</text>
				</view>
				<view class="discount">
					<text>{{item.discount}}折</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: null
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
	.goods-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 20rpx;
	}

	.item {
		overflow: hidden;
		width: 350rpx;
		height: 590rpx;
		margin-top: 20rpx;
		border-radius: 30rpx;
		background-color: #fff;
		box-shadow: 0 0 16rpx rgba(0, 0, 0, .12);

		.img-box {
			width: 350rpx;
			height: 350rpx;
			margin: 0 auto;
			text-align: center;

			image {
				width: 350rpx;
				height: 350rpx;
			}
		}

		.content {
			padding: 20rpx;

			.title {
				color: #333;
				font-size: 30rpx;
				margin-bottom: 10rpx;
				// 文本省略
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				word-break: break-all;
				-webkit-box-orient: vertical;
			}

			.price {
				text-align: center;
				margin-bottom: 10rpx;

				.n-price {
					margin-right: 10rpx;
					color: #FF3333;
					font-size: 40rpx;

					.money {
						margin-right: 4rpx;
						font-size: 30rpx;
					}
				}

				.o-price {
					color: #666;
					font-size: 22rpx;
					text-decoration: line-through;
				}
			}

			.discount {
				text-align: center;

				text {
					padding: 0 10rpx;
					color: #FF3333;
					font-size: 24rpx;
					font-weight: bold;
					border: 4rpx solid #FF3333;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>