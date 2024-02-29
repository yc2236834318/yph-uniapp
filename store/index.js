// vuex仓库文件

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import home from './modules/home.js'
import search from './modules/search.js'
import list from './modules/list.js'
import detail from './modules/detail.js'
import cart from './modules/cart.js'
import user from './modules/user.js'
import receiver from './modules/receiver.js'
import order from './modules/order.js'

export default new Vuex.Store({
	modules: {
		home,
		search,
		list,
		detail,
		cart,
		user,
		receiver,
		order
	}
})