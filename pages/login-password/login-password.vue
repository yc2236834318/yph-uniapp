<!-- 页面-注册密码页 -->

<template>
	<view class="tel">
		<line-vue></line-vue>
		<view class="info-form">
			<view class="info-input">
				<view class="hd">设置密码：</view>
				<input focus="true" type="password" v-model="password" placeholder="请输入6-12位字符" />
			</view>
			<view class="info-input">
				<view class="hd">确认密码：</view>
				<input type="password" v-model="repeatpwd" placeholder="请再次输入密码" />
			</view>
			<view @tap="complete" class="btn">完成注册</view>
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
				password: '',
				repeatpwd: '',
				// 密码验证规则
				rules: {
					password: {
						rule: /^[0-9a-zA-Z]{6,12}$/, // 6-12位字符
						msg: '密码应该为6-12位字符'
					}
				}
			}
		},
		onLoad(e) {
			this.tel = e.tel // 获取地址栏参数:手机号
		},
		methods: {
			// 仓库函数映射
			...mapActions('user', ['regUser', 'logUser']),
			// 完成注册
			complete() {
				if (!this.validate('password')) return // 密码规则验证
				if (this.password !== this.repeatpwd) {
					uni.showToast({
						title: '两次密码输入不一致',
						icon: 'none'
					})
					return
				}
				const userInfo = {
					username: this.tel,
					password: this.password
				}
				this.regUser(userInfo) // 调用仓库注册方法
			},
			// 密码规则验证
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
			padding-top: 20rpx;

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
		}
	}
</style>