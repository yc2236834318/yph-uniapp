// 服务器文件

// 启动服务器
// 在app.js下打开终端 npm start

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS跨域
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"]
	})
)

// 令牌解析配置
const {
	expressjwt
} = require("express-jwt");
const config = require("./config");
app.use(
	expressjwt({
		secret: config.jwtSecretKey,
		algorithms: ["HS256"]
	}).unless({
		path: [/^\/index/, /^\/search/, /^\/list/, /^\/detail/, /^\/login/],
		// path 无需解析令牌的接口(游客可访问,但不解析就没有req.auth)
	})
);

// 首页路由
const indexRouter = require('./router/index');
app.use("/index", indexRouter);

// 搜索页路由
const searchRouter = require('./router/search');
app.use("/search", searchRouter);

// 分类页路由
const listRouter = require('./router/list');
app.use("/list", listRouter);

// 详情页路由
const detailRouter = require('./router/detail');
app.use("/detail", detailRouter);

// 登录页路由
const loginRouter = require('./router/login');
app.use("/login", loginRouter);

// 购物车页路由
const cartRouter = require('./router/cart');
app.use("/cart", cartRouter);

// 用户页路由
const usersRouter = require('./router/users');
app.use('/users', usersRouter);

// 地址页路由
const receiverRouter = require('./router/receiver');
app.use('/receiver', receiverRouter);

// 订单页路由
const orderRouter = require('./router/order');
app.use('/order', orderRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;