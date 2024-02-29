<!-- 页面-注册手机号页 -->

<template>
	<view class="tel">
		<line-vue></line-vue>
		<view class="info-form">
			<view class="info-input">
				<view class="hd">手机号：</view>
				<input focus="true" type="number" v-model="tel" placeholder="请输入手机号" />
			</view>
			<view @tap="next" class="btn">下一步</view>
			<view class="tip">继续注册表示您阅读并同意<text>《优品汇用户服务协议》</text></view>
		</view>
	</view>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				tel: '',
				// 手机号验证规则
				rules: {
					tel: {
						rule: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/, // 手机号
						msg: '请输入正确的手机号'
					}
				}
			}
		},
		methods: {
			// 仓库函数映射
			...mapActions('user', ['checkTel']),
			// 下一步
			next() {
				if (!this.validate('tel')) return // 手机号规则验证
				this.checkTel(this.tel) // 验证手机号是否已被注册
			},
			// 手机号规则验证
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
		}
	}
</script>

<style lang="scss" scoped>
	.tel {
		.info-form {
			padding-top: 40rpx;

			.info-input {
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
				font-size: 28rpx;

				text {
					color: #49BDFB;
				}
			}
		}
	}
</style>