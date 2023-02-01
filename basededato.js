const config = require("./config.js");
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database,
  multipleStatements: true
});
 
connection.connect();

const DB = {
    getUser: async function (options = { nombre }){
const obtenerUsuario = new Promise((resolve, reject) => {
          connection.query('SELECT * FROM `personajes` WHERE `Nombre_Apellido` = ?', [options.nombre], function (error, results, fields) {
          if(error) {
            return reject(error);
          }
          if(results){
            resolve(results)
          } else {
            resolve(false)
          }   
    })
});


  let datosUsuario = await obtenerUsuario.then(dato => {
      if(dato){
        return dato;
        
      } else {
        return false;
        
      }
    });
  return datosUsuario;
    },

    getUserPass: async function (options = { pass }){

const obtenerPass = new Promise((resolve, reject) => {
          connection.query('SELECT MD5(?)', [options.pass], function (error, results, fields) {
          if(error) {
            return reject(error);
          }
          if(results){
          var resultArray = Object.values(JSON.parse(JSON.stringify(results))) 
          resultArray.map(row => {
          let a = {...row};
          let stringi = JSON.stringify(a).replace("(", "").replace(")", "").replace("'", "").replace("'", "").replace(options.pass, "");
          let pass = JSON.parse(stringi);
          resolve(pass.MD5)
          });
          } else {
            resolve(false)
          }   
    })
});

   let password = await obtenerPass.then(dato => {
      if(dato){
        return dato;
        
      } else {
        return false;
        
      }
    });
  return password;    
      

    },
    verificar: async function (options = { nombre, verificado }){

const obtenerPass = new Promise((resolve, reject) => {
  connection.query('UPDATE cuentas SET discordId = ? WHERE Nombre = ?', [options.verificado, options.nombre], function (error, results, fields) {
            if(error) {
            return reject(error);
          }
          if(results){
          console.log(results)
          resolve(results)
          } else {
            resolve(false)
          }
});
});

   let password = await obtenerPass.then(dato => {
      if(dato){
        return dato;
        
      } else {
        return false;
        
      }
    });
  return password;    
      

    },
}

module.exports = DB;
