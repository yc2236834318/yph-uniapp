// 数据库文件

// 注意
// 数据库 账号 root 密码 admin123
// 启动数据库 net start mysql80
// 本项目使用的数据库为 yph
// 管理员账号 000000 000000

// 导入mysql模块
const mysql = require("mysql");

// 链接数据库
const db = mysql.createPool({
  host: "127.0.0.1", // 数据库IP地址
  user: "root", // 数据库账号
  password: "admin123", // 数据库密码
  database: "yph", // 指定链接的数据库
});

// 检测数据库是否链接成功
db.query("select 1", (err, results) => {
  if (err) return console.log("数据库链接失败 " + err.message);
  console.log("数据库链接成功" + results); // [ RowDataPacket { '1': 1 } ] 表示链接成功
});

// 导出mysql对象
module.exports = db;
