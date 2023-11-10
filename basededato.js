const config = require("./config.js");
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  multipleStatements: true
});

connection.connect();

const DB = {
  getUser: async function (options = { nombre }) {
    const obtenerUsuario = new Promise((resolve, reject) => {
      connection.query('SELECT * FROM `usuarios` WHERE `nombre` = ?', [options.nombre], function (error, results, fields) {
        if (error) {
          return reject(error);
        }
        if (results) {
          resolve(results)
        } else {
          resolve(false)
        }
      })
    });


    let datosUsuario = await obtenerUsuario.then(dato => {
      if (dato) {
        return dato;

      } else {
        return false;

      }
    });
    return datosUsuario;
  },

  verificar: async function (options = { nombre, discordId }) {

    const obtenerPass = new Promise((resolve, reject) => {
      connection.query('UPDATE usuarios SET discordId = ? WHERE nombre = ?', [options.discordId, options.nombre], function (error, results, fields) {
        if (error) {
          return reject(error);
        }
        if (results) {
          console.log(results)
          resolve(results)
        } else {
          resolve(false)
        }
      });
    });

    let password = await obtenerPass.then(dato => {
      if (dato) {
        return dato;

      } else {
        return false;

      }
    });
    return password;


  },
}

module.exports = DB;
