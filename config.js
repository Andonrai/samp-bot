

module.exports = {
  token: process.env.TOKEN,
  clientId: "1005191795593977868", 
  guildId: "952041904235753543",
  mysql: {
    host: process.env.MysqlHost,
    user: process.env.MysqlUser,
    password: process.env.MysqlPassword,
    database: process.env.MysqlDB
  }
}