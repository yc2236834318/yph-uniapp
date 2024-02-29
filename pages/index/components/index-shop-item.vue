<!-- 组件-店铺推荐商品 -->

<template>
	<view class="goods-box">
		<view @tap="goDetail(item.id)" v-for="item in dataList" :key="item.id" class="item">
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
			dataList: Array,
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
		justify-content: space-between;
	}

	.item {
		width: 246rpx;
		height: 480rpx;
		margin-top: 4rpx;
		background-color: #fff;

		.img-box {
			overflow: hidden;
			width: 246rpx;
			height: 246rpx;
			margin: 0 auto;
			text-align: center;

			image {
				width: 246rpx;
				height: 246rpx;
			}
		}

		.content {
			padding: 20rpx;

			.title {
				color: #333;
				font-size: 28rpx;
				margin-bottom: 10rpx;
				// 文本省略
				overflow: hidden;
				white-space: wrap;
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
					font-size: 38rpx;

					.money {
						margin-right: 4rpx;
						font-size: 28rpx;
					}
				}

				.o-price {
					color: #666;
					font-size: 20rpx;
					text-decoration: line-through;
				}
			}

			.discount {
				text-align: center;

				text {
					padding: 0 10rpx;
					color: #FF3333;
					font-size: 22rpx;
					font-weight: bold;
					border: 4rpx solid #FF3333;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>