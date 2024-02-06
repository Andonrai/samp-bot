

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,//Id del bot
  guildId: process.env.GUILD_ID,//id del servidor
  mysql: {
    host: process.env.MysqlHost,
    user: process.env.MysqlUser,
    password: process.env.MysqlPassword,
    database: process.env.MysqlDB
  }
}