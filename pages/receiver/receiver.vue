<!-- 页面-地址管理页 -->

<template>
	<view class="address">
		<line-vue></line-vue>
		<view class="container">
			<view v-if="receiverList.length>0" class="address-list">
				<view v-for="item in receiverList" :key="item.id" class="list-item">
					<view class="list-info">
						<view class="consignee">{{item.consignee}}</view>
						<view class="phone">{{item.phone}}</view>
						<view v-if="item.isdefault" class="default">默认</view>
						<view class="manage">
							<view @tap="goEdit(item.id)" class="edit">
								<image src="../../static/img/icon-edit.png" mode=""></image>
							</view>
							<view @tap="goDel(item.id)" class="del">
								<image src="../../static/img/icon-del.png" mode=""></image>
							</view>
						</view>
					</view>
					<view class="list-detail">
						<view class="detail">{{item.area+' '+item.address}}</view>
					</view>
				</view>
			</view>
			<view v-else class="empty">
				<view class="img-box">
					<image src="../../static/img/icon-unaddress.png" mode=""></image>
				</view>
				<view class="tip">暂无收获地址</view>
			</view>
			<view @tap="addAdress" class="addBtn">添加地址</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		onLoad() {
			this.getReceiver() // 获取收货地址列表
		},
		onShow() {
			this.getReceiver() // 获取收货地址列表
		},
		computed: {
			// 仓库数据映射
			...mapState('receiver', ['receiverList'])
		},
		methods: {
			// 仓库函数映射
			...mapActions('receiver', ['getReceiver', 'delReceiver']),
			// 地址添加
			addAdress() {
				uni.navigateTo({
					url: '/pages/receiver-add/receiver-add'
				})
			},
			// 地址编辑
			goEdit(id) {
				uni.navigateTo({
					url: `/pages/receiver-add/receiver-add?id=${id}`
				})
			},
			// 地址删除
			goDel(id) {
				uni.showModal({
					title: '地址删除',
					content: '确认删除地址',
					mask: true,
					success: (res) => {
						if (res.cancel) return
						this.delReceiver(id) // 删除地址
						uni.redirectTo({
							url: "/pages/receiver/receiver" // 刷新页面
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address {
		.container {
			padding: 40rpx;

			.address-list {
				.list-item {
					margin-bottom: 40rpx;
					padding-bottom: 20rpx;
					font-size: 28rpx;
					border-bottom: 2rpx solid #ccc;

					.list-info {
						position: relative;
						display: flex;
						margin-bottom: 20rpx;

						.consignee {
							margin-right: 20rpx;
						}

						.default {
							width: 80rpx;
							height: 40rpx;
							margin-left: 20rpx;
							color: #49BDFB;
							font-size: 24rpx;
							line-height: 40rpx;
							text-align: center;
							border: 2rpx solid #49BDFB;
							border-radius: 20rpx;
							background-color: #fff;
						}

						.manage {
							position: absolute;
							top: -6rpx;
							right: 20rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							width: 130rpx;

							view {
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								width: 50rpx;
								height: 50rpx;
								border-radius: 50%;

								image {
									width: 30rpx;
									height: 30rpx;
								}
							}

							.edit {
								border: 4rpx solid #49BDFB;
							}

							.del {
								border: 4rpx solid #EE0A24;
							}
						}
					}

					.list-detail {
						.detail {
							width: 660rpx;
							// 文本省略
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
			}

			.empty {
				width: 100%;
				height: 450rpx;

				.img-box {
					width: 400rpx;
					height: 250rpx;
					margin: 0 auto;
					padding-top: 80rpx;

					image {
						width: 400rpx;
						height: 250rpx;
					}
				}

				.tip {
					margin-top: 40rpx;
					color: #666;
					font-size: 30rpx;
					text-align: center;
				}
			}

			.addBtn {
				height: 70rpx;
				margin: 0 auto;
				color: #fff;
				font-size: 30rpx;
				line-height: 70rpx;
				text-align: center;
				border-radius: 35rpx;
				background-color: #49BDFB;
			}
		}
	}
</style>