<!-- 页面-搜索页 -->

<template>
	<view class="search">
		<line-vue></line-vue>
		<view class="search-item">
			<view class="hd">
				<view class="title">最近搜索</view>
				<view v-if="wordsList.length>0" @tap="clearHistory" class="iconfont">&#xe600;</view>
			</view>
			<view v-if="wordsList.length>0" class="bd">
				<view @tap="toSearch(item)" v-for="(item,index) in wordsList" :key="index" class="name">{{item}}</view>
			</view>
			<view v-else class="empty">暂无搜索记录</view>
		</view>
		<view class="search-item">
			<view class="hd">
				<view class="title">热门搜索</view>
			</view>
			<view class="bd">
				<view v-for="item in hotList" :key="item" @tap="toSearch(item)" class="name">{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				words: '',
				wordsList: [],
				hotList: ['华为', '四件套', '羽绒服', '手套', '围巾', '电热毯', '空调', '电磁炉']
			}
		},
		onLoad() {
			// 获取本地搜索记录
			uni.getStorage({
				key: 'wordsList',
				success: (res) => {
					this.wordsList = JSON.parse(res.data)
				}
			})
		},
		onNavigationBarButtonTap(e) {
			// 标题栏按钮点击事件
			if (e.float === 'right') {
				this.search()
			}
		},
		onNavigationBarSearchInputChanged(e) {
			// 标题栏搜索框文字改变事件
			this.words = e.text
		},
		onNavigationBarSearchInputConfirmed(e) {
			// 软键盘搜索按钮点击事件
			this.search()
		},
		methods: {
			// 搜索
			search() {
				if (!this.words) return // 判断搜索关键字是否为空
				uni.hideKeyboard() // 隐藏软键盘
				uni.navigateTo({
					url: `/pages/search-list/search-list?words=${this.words}`
				})
				this.addSearch() // 记录搜索关键字
			},
			// 点击搜索记录
			toSearch(words) {
				this.words = words
				this.search()
			},
			// 添加搜索记录
			addSearch() {
				const index = this.wordsList.indexOf(this.words) // 判断关键字是否重复
				if (index !== -1) this.wordsList.splice(index, 1) // 若有重复则删除重复的关键字
				if (this.wordsList.length > 4) this.wordsList = this.wordsList.slice(0, 4) // 最多保存5个关键字
				this.wordsList.unshift(this.words) // 添加关键字
				// 存入本地
				uni.setStorage({
					key: "wordsList",
					data: JSON.stringify(this.wordsList)
				})
			},
			// 清除搜索记录
			clearHistory() {
				if (this.wordsList.length < 1) return // 判断记录是否为空
				uni.showModal({
					title: "温馨提示",
					content: "是否清除历史记录",
					success: (res) => {
						// 清除缓存
						if (res.confirm) {
							uni.removeStorage({
								key: "wordsList"
							})
							this.wordsList = [] // 清除页面
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		padding: 0 20rpx;

		.search-item {
			padding: 20rpx;
			padding-bottom: 0;

			.hd {
				display: flex;
				justify-content: space-between;

				.title {
					font-size: 28rpx;
				}
			}

			.bd {
				.name {
					display: inline-block;
					max-width: 140rpx;
					height: 46rpx;
					margin: 20rpx 20rpx 0 0;
					padding: 4rpx 24rpx;
					color: #636263;
					font-size: 26rpx;
					line-height: 46rpx;
					border-radius: 26rpx;
					background-color: #eeeeee;
					// 文本省略
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.empty {
				margin-top: 10rpx;
				font-size: 28rpx;
				text-align: center;
			}
		}
	}
</style>