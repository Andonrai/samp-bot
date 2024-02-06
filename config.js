

module.exports = {
  token: process.env.TOKEN,
  clientId: "client-id",//Id del bot
  guildId: "guild-id",//id del servidor
  mysql: {
    host: process.env.MysqlHost,
    user: process.env.MysqlUser,
    password: process.env.MysqlPassword,
    database: process.env.MysqlDB
  }
}