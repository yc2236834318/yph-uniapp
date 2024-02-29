// 用户数据验证文件

// 规则定义模块
// 下载命令 npm i joi
// 导入规则定义模块
const joi = require("joi");

// 定义账号和密码验证规则
const username = joi.string().pattern(
	/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();

// 定义昵称验证规则
const nickname = joi.string().min(2).max(12).required();

// 常用规则
// string 必须为字符串
// number 必须为数字
// array 必须为数组
// boolean 必须为布尔值
// object 必须为对象
// date 必须为时间型
// integer 必须为整数
// alphanum 必须为a-zA-Z0-9
// min 最小值(长度)
// max 最大值(长度)
// required 必填项
// pattern 正则表达式
// email 邮箱格式
// dataUri base64格式(图片)

// 导出账号密码规则对象
exports.reg_login_schema = {
	body: {
		// body规则对象
		username: username,
		password: password,
	},
	query: {}, // query规则对象
	params: {}, // params规则对象
};

// 导出昵称规则对象
exports.update_nickname_schema = {
	body: {
		nickname: nickname,
	},
};

// 导出修改密码规则对象
exports.update_password_schema = {
	body: {
		oldPwd: password,
		newPwd: joi.not(joi.ref("oldPwd")).concat(password),
		// joi.ref() 值相同
		// joi.not() 取反
		// concat() 规则合并
		// 即新旧密码不能相同,且新密码必须遵循密码规则对象
	},
};