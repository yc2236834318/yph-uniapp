<!-- 页面-地址添加页 -->

<template>
	<view class="add">
		<line-vue></line-vue>
		<view class="info">
			<view class="info-item">
				<view class="hd">收 件 人</view>
				<input type="text" v-model="consignee" placeholder="请输入2-12位字符" />
			</view>
			<view class="info-item">
				<view class="hd">手 机 号</view>
				<input type="number" v-model="phone" placeholder="请输入11位手机号" />
			</view>
			<view class="info-item">
				<view class="hd">所在地区</view>
				<view class="select">
					<view @tap="showCityPicker" class="tip">{{area?area:'请选择'}}</view>
					<view class="img-box">
						<image src="../../static/img/right.png" mode=""></image>
					</view>
					<!-- 城市三级联选插件 -->
					<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault"
						@onConfirm="cityConfirm"></mpvue-city-picker>
				</view>
			</view>
			<view class="info-item">
				<view class="hd">详细地址</view>
				<textarea v-model="address" class="detail" placeholder="请输入2-60个字符"></textarea>
			</view>
			<view class="info-item">
				<view class="hd default">设为默认地址</view>
				<label class="radio" @tap="changeDefault(!isdefault)">
					<radio :checked="isdefault" color="#49BDFB" />
				</label>
			</view>
			<view @tap="addAdress" class="addBtn">{{isEdit?'修改地址':'添加地址'}}</view>
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
				isEdit: false, // 是否编辑
				id: null, // 编辑地址ID
				consignee: '', // 收货人
				phone: '', // 手机号
				area: '', // 地区
				address: '', // 详细地址
				isdefault: false, // 是否默认地址
				pickerValueDefault: [0, 0, 0], // 省市区编号
				// 验证规则
				rules: {
					consignee: {
						rule: /^[0-9a-zA-Z\u4e00-\u9fa5]{2,12}$/, // 收件人
						msg: '收件人应该为2-12位字符'
					},
					phone: {
						rule: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/, // 手机号
						msg: '请输入正确的手机号'
					},
					address: {
						rule: /^[0-9a-zA-Z\u4e00-\u9fa5]{2,60}$/, // 详细地址
						msg: '地址应该为2-60位字符'
					}
				}
			}
		},
		onLoad(e) {
			// 判断是否有地址ID传过来
			if (e.id) {
				uni.setNavigationBarTitle({
					title: '修改地址' // 修改标题栏
				})
				this.isEdit = true // 设置编辑状态
				this.id = e.id // 设置编辑地址ID
				this.getReceiverById(this.id) // 根据ID获取收货信息
			}
		},
		computed: {
			// 仓库数据映射
			...mapState('receiver', ['receiverObj'])
		},
		watch: {
			// 监听仓库中收货信息的变化(解决异步问题)
			'receiverObj': {
				handler: function(newVal) {
					this.setReceInfo(newVal)
				},
				deep: true // 深度监听
			}
		},
		methods: {
			// 仓库函数映射
			...mapActions('receiver', ['getReceiverById', 'addReceiver', 'updateReceiver']),
			// 收货信息赋值
			setReceInfo(newVal) {
				this.consignee = newVal.consignee
				this.phone = newVal.phone
				this.area = newVal.area
				this.pickerValueDefault = newVal.areaCode.split(',').map(Number) // 字符串转数组
				this.address = newVal.address
				this.isdefault = newVal.isdefault ? true : false
			},
			// 省市区下拉菜单
			showCityPicker() {
				this.$refs.mpvueCityPicker.show() // 展示省市区插件
			},
			// 确认地区
			cityConfirm(e) {
				this.area = e.label // 地区赋值
				this.pickerValueDefault = e.value // 地区编号赋值
			},
			// 更改默认地址
			changeDefault(flag) {
				this.isdefault = flag
			},
			// 保存地址
			addAdress() {
				if (!this.validate('consignee')) return // 收件人规则验证
				if (!this.validate('phone')) return // 手机号规则验证
				if (!this.validate('address')) return // 详细地址规则验证
				if (!this.area) {
					return uni.showToast({
						title: '请选择所在地区',
						icon: 'none'
					})
				}
				const obj = {
					area: this.area,
					areaCode: this.pickerValueDefault.join(','),
					address: this.address,
					phone: this.phone,
					consignee: this.consignee,
					isdefault: this.isdefault
				}
				if (this.isEdit) {
					// 判断修改地址还是添加地址
					obj.id = this.id
					this.updateReceiver(obj) // 修改地址
				} else {
					this.addReceiver(obj) // 添加地址
				}
			},
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
		}
	}
</script>

<style lang="scss" scoped>
	.add {
		.info {
			padding: 40rpx;

			.info-item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				padding-bottom: 20rpx;
				padding-right: 20rpx;
				border-bottom: 2rpx solid #ccc;

				.hd {
					width: 160rpx;
					font-size: 30rpx;
				}

				.default {
					width: 200rpx;
				}

				input {
					width: 500rpx;
					font-size: 28rpx;
				}

				textarea {
					width: 500rpx;
					font-size: 28rpx;
				}

				.select {
					display: flex;

					.tip {
						color: #999;
						font-size: 28rpx;
						line-height: 36rpx;
					}

					.img-box {
						width: 40rpx;
						height: 40rpx;

						image {
							width: 40rpx;
							height: 40rpx;
						}
					}
				}

				.detail {
					height: 100rpx;
				}
			}

			.addBtn {
				height: 70rpx;
				margin: 50rpx auto 0;
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