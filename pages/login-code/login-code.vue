<!-- 页面-注册验证码页 -->

<template>
	<view class="tel">
		<line-vue></line-vue>
		<view class="info-form">
			<view class="info-input">
				<view class="hd">验证码：</view>
				<input focus="true" type="number" v-model="code" placeholder="请输入6位数字" />
				<view @tap="send" class="send" :class="{sends:!sendFlag}">{{sendMsg}}</view>
			</view>
			<view class="tip">我们已经给你的手机号码{{tel}}发送了验证短信</view>
			<view @tap="next" class="btn">下一步</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tel: '',
				code: '',
				sendMsg: '发送短信',
				sendFlag: true,
				sendTime: 10,
				// 验证码验证规则
				rules: {
					code: {
						rule: /^[0-9]{6}$/, // 验证码
						msg: '请输入6位数字'
					}
				}
			}
		},
		onLoad(e) {
			this.tel = e.tel // 获取地址栏参数:手机号
		},
		onReady() {
			if (this.tel) this.send() // 发送验证码
		},
		methods: {
			// 发送验证码
			send() {
				if (!this.sendFlag) {
					uni.showToast({
						title: '请勿重复发送',
						icon: 'none'
					})
					return
				}
				uni.showToast({
					title: '短信已发出',
					icon: 'none'
				})
				this.sendFlag = false
				this.sendMsg = `重新发送(${this.sendTime})`
				const timer = setInterval(() => {
					this.sendTime--
					this.sendMsg = `重新发送(${this.sendTime})`
					if (this.sendTime === 0) {
						clearInterval(timer) // 清除定时器
						this.sendMsg = '发送短信'
						this.sendFlag = true
						this.sendTime = 10
					}
				}, 1000)
			},
			// 下一步
			next() {
				if (!this.validate('code')) return // 验证码规则验证
				uni.navigateTo({
					url: `/pages/login-password/login-password?tel=${this.tel}`
				})
			},
			// 验证码规则验证
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tel {
		.info-form {
			padding-top: 20rpx;

			.info-input {
				position: relative;
				display: flex;
				align-items: center;
				width: 90%;
				margin: 0 auto 20rpx;
				padding: 20rpx 0;
				font-size: 30rpx;
				border-bottom: 2rpx solid #ccc;

				.hd {
					margin-right: 30rpx;
				}

				input {
					font-size: 28rpx;
				}

				.send {
					position: absolute;
					top: 12rpx;
					right: 0;
					z-index: 999;
					height: 50rpx;
					padding: 0 20rpx;
					color: #fff;
					border: 2rpx solid #49BDFB;
					background-color: #49BDFB;
					font-size: 26rpx;
					line-height: 50rpx;
					border-radius: 25rpx;
				}

				.sends {
					color: #999;
					border: 2rpx solid #999;
					background-color: #fff;
				}
			}

			.btn {
				width: 90%;
				height: 80rpx;
				margin: 0 auto;
				color: #fff;
				line-height: 80rpx;
				text-align: center;
				border-radius: 40rpx;
				background-color: #49BDFB;
			}

			.tip {
				width: 90%;
				margin: 20rpx auto;
				font-size: 24rpx;
			}
		}
	}
</style>