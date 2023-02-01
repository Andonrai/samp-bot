module.exports = {
  token: process.env.TOKEN,
  clientId: "bot-id", 
  guildId: "server-id",
  mysql: {
    host: process.env.MysqlHost,
    user: process.env.MysqlUser,
    password: process.env.MysqlPassword,
    database: process.env.MysqlDB
  }
}
