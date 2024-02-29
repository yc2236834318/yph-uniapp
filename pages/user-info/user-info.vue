<!-- 页面-信息管理页 -->

<template>
	<view class="info">
		<line-vue></line-vue>
		<view class="card">
			<view class="card-hd">
				<view class="icon-box">
					<image src="/static/img/icon-nickname.png" mode=""></image>
				</view>
				<text>昵称修改</text>
			</view>
			<view class="card-bd">
				<view class="nickname">昵称：{{userInfo.nickname||'游客'}}</view>
				<view class="input-box">
					<input type="text" v-model="nickname" placeholder="请输入2-12位字符" />
					<view @tap="modifyNickName" class="updateBtn">修 改</view>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="card-hd">
				<view class="icon-box">
					<image src="/static/img/icon-face.png" mode=""></image>
				</view>
				<text>头像修改</text>
			</view>
			<view class="card-bd">
				<view @tap="onSelectImg" class="selectImg">
					<view v-if="avatarUrl" class="img-box dashed">
						<image :src="avatarUrl" mode=""></image>
					</view>
					<view v-else class="img-box">
						<image src="/static/img/icon-add.png" mode=""></image>
					</view>
				</view>
				<view @tap="modifyAvatar" class="updateBtn">修 改 头 像</view>
			</view>
		</view>
		<view class="card">
			<view class="card-hd">
				<view class="icon-box">
					<image src="/static/img/icon-password.png" mode=""></image>
				</view>
				<text>密码修改</text>
			</view>
			<view class="card-bd">
				<view class="input-box">
					<view class="input-title">旧密码：</view>
					<input type="password" v-model="oldPwd" placeholder="请输入6-12位字符" />
				</view>
				<view class="input-box">
					<view class="input-title">新密码：</view>
					<input type="password" v-model="newPwd" placeholder="请输入6-12位字符" />
				</view>
				<view @tap="modifyPassword" class="updateBtn">确 认 修 改</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				isH5: false, // 是否H5端
				nickname: '', // 用户昵称
				oldPwd: '', // 旧密码
				newPwd: '', // 新密码
				avatarUrl: '', // 用户头像
				// 用户信息验证规则
				rules: {
					nickname: {
						rule: /^[0-9a-zA-Z\u4e00-\u9fa5]{2,12}$/, // 2-12位中英字符
						msg: '昵称应该为2-12位字符'
					},
					oldPwd: {
						rule: /^[0-9a-zA-Z]{6,12}$/, // 6-12位字符
						msg: '密码应该为6-12位字符'
					},
					newPwd: {
						rule: /^[0-9a-zA-Z]{6,12}$/, // 6-12位字符
						msg: '密码应该为6-12位字符'
					}
				}
			}
		},
		onReady() {
			// #ifdef H5
			// H5端
			this.isH5 = true
			// #endif
		},
		onLoad() {
			this.getUserInfo() // 获取数据
		},
		computed: {
			// 仓库数据映射
			...mapState('user', ['userInfo'])
		},
		methods: {
			// 仓库函数映射
			...mapActions('user', ['getUserInfo', 'updateNickName', 'updateAvatar', 'updatePassword']),
			// 规则验证
			validate(key) {
				let flag = true
				if (!this.rules[key].rule.test(this[key])) {
					uni.showToast({
						title: this.rules[key].msg,
						icon: 'none'
					})
					flag = false
				}
				return flag
			},
			// 修改昵称
			modifyNickName() {
				if (!this.validate('nickname')) return // 昵称规则验证
				if (this.nickname === this.userInfo.nickname) {
					return uni.showToast({
						title: '新旧名称不能一致',
						icon: 'none'
					})
				}
				this.updateNickName(this.nickname) // 修改昵称
				this.getUserInfo() // 重新获取数据
				uni.redirectTo({
					url: "/pages/user-info/user-info" // 刷新页面
				})
			},
			// 选择头像
			onSelectImg() {
				if (this.isH5) {
					return uni.showToast({
						title: '请在小程序或APP端进行修改',
						icon: 'none'
					})
				}
				uni.chooseImage({
					count: 1, // 最多可以选择的图片数(默认9)
					sizeType: ['original', 'compressed'], // 上传原图/上传压缩图
					sourceType: ['album'], // 图片来源(album 从相册选择;camera 使用相机拍摄)
					extension: ['.png', '.jpeg', '.jpg'], // 图片类型筛选(扩展名)
					success: (res) => {
						// 获取头像
						uni.getFileInfo({
							filePath: res.tempFilePaths[0],
							success: () => {
								// 保存头像
								uni.saveFile({
									tempFilePath: res.tempFilePaths[0],
									success: (saveRes) => {
										this.avatarUrl = saveRes.savedFilePath // 图片赋值
									}
								})
							}
						})
					}
				})
			},
			// 修改头像
			modifyAvatar() {
				if (!this.avatarUrl) {
					return uni.showToast({
						title: '请先选择图片',
						icon: 'none'
					})
				}
				// 上传头像
				this.updateAvatar(this.avatarUrl)
			},
			// 修改密码
			modifyPassword() {
				if (!this.validate('oldPwd')) return // 密码规则验证
				if (!this.validate('newPwd')) return // 密码规则验证
				if (this.oldPwd === this.newPwd) {
					return uni.showToast({
						title: '新旧密码不能一致',
						icon: 'none'
					})
				}
				const obj = {
					oldPwd: this.oldPwd,
					newPwd: this.newPwd
				}
				this.updatePassword(obj) // 修改密码
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info {
		overflow-y: hidden;
		position: relative;
		height: 100vh;
		// #ifdef H5
		height: calc(100vh - 88rpx);
		// #endif
		background-color: rgb(247, 248, 250);

		.card {
			margin-top: 30rpx;
			padding: 40rpx;
			background-color: #fff;
			box-shadow: 0 0 2rpx rgba(0, 0, 0, .12);

			.card-hd {
				display: flex;
				align-items: center;
				width: 100%;
				height: 40rpx;
				margin-bottom: 20rpx;

				.icon-box {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 40rpx;
					height: 40rpx;
					margin-right: 20rpx;

					image {
						width: 40rpx;
						height: 40rpx;
					}
				}

				text {
					color: #2c2c2c;
					font-size: 30rpx;
					font-weight: bold;
					line-height: 30rpx;
				}
			}

			.card-bd {
				.nickname {
					margin-bottom: 40rpx;
					font-size: 30rpx;
					text-align: center;
				}

				.input-box {
					display: flex;
					align-items: center;

					&:not(:last-of-type) {
						margin-bottom: 40rpx;
					}
				}

				input {
					width: 65%;
					height: 60rpx;
					margin-left: 20rpx;
					margin-right: 20rpx;
					padding-left: 20rpx;
					font-size: 28rpx;
					line-height: 60rpx;
					border: 4rpx solid #49BDFB;
					border-radius: 30rpx;
					box-shadow: 0 0 8rpx rgba(73, 189, 251, .12);
				}

				.updateBtn {
					height: 60rpx;
					margin: 0 auto;
					padding: 0 30rpx;
					color: #fff;
					font-size: 28rpx;
					line-height: 60rpx;
					text-align: center;
					border: 4rpx solid #49BDFB;
					border-radius: 30rpx;
					background-color: #49BDFB;
					box-shadow: 0 0 8rpx rgba(73, 189, 251, .12);
				}

				.input-title {
					width: 120rpx;
					height: 60rpx;
					font-size: 28rpx;
					line-height: 60rpx;
				}

				.selectImg {
					width: 180rpx;
					margin: 0 auto 40rpx;

					.img-box {
						width: 180rpx;
						height: 180rpx;
						border: 6rpx dashed #49BDFB;

						image {
							width: 180rpx;
							height: 180rpx;
						}
					}

					.dashed {
						border: 6rpx dashed transparent;
					}
				}
			}
		}
	}
</style>