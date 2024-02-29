<!-- 组件-其他登录方式 -->

<template>
	<view class="other">
		<view class="other-hd">
			<text>其他登录方式</text>
		</view>
		<view class="other-bd">
			<view @tap=goLink(1) class="other-item">
				<view class="img-box">
					<image src="/static/img/wx.png" mode="aspectFit"></image>
				</view>
				<view class="other-text">微信</view>
			</view>
			<view @tap=goLink(2) class="other-item">
				<view class="img-box">
					<image src="/static/img/qq.png" mode="aspectFit"></image>
				</view>
				<view class="other-text">QQ</view>
			</view>
			<view @tap=goLink(3) class="other-item">
				<view class="img-box">
					<image src="/static/img/wb.png" mode="aspectFit"></image>
				</view>
				<view class="other-text">微博</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "login-other",
		methods: {
			goLink(type) {
				uni.showToast({
					title: '接口关闭',
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.other {
		padding-top: 100rpx;

		.other-hd {
			padding: 50rpx 0;
			text-align: center;

			text {
				display: inline-block;
				width: 100%;
				height: 40rpx;
				font-size: 28rpx;
				line-height: 40rpx;

				&::before,
				&::after {
					content: '';
					display: inline-block;
					width: 30%;
					height: 1rpx;
					vertical-align: middle;
					background-color: #666;
				}

				&::before {
					margin-right: 20rpx;
				}

				&::after {
					margin-left: 20rpx;
				}
			}
		}

		.other-bd {
			display: flex;
			justify-content: space-around;

			.other-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.img-box {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 8rpx;

					image {
						width: 80rpx;
						height: 80rpx;
					}
				}

				.other-text {
					font-size: 28rpx;
				}
			}
		}
	}
</style>