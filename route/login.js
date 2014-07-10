var async  = require('async')
   ,crypto = require('crypto')
   ,db     = require('../utils/db');

var login = module.exports = function(req, res) {
  var user = req.body.user
     ,pass = req.body.pass
     ,obj  = {err: "", user_id: "", token: ""}
     ,sha1, conn;

  // criptografa senha para SHA1
  sha1 = crypto.createHash('sha1');
  sha1.update("wnhg9" + pass + "fwj98"); // salt para fortalecer hash
  pass = sha1.digest('hex');
  sha1 = null;

  async.series([
  function(callback) { // conectar DB
    conn = new db(function(err){
      if (!!err) callback("Erro ao conectar com o banco de dados ! ERR: " + err);
      else callback(null, 'connected');
    });
  }
 ,function(callback) { // Verifica usuário e senha no banco
    conn.execute("select id_usuario from ge_usuario where usuario = ? and senha = ?"
                ,[user, pass], function(err, rows, fields) {
      if (!!err)
        callback("Erro ao verificar usuario ! ERR: " + err);
      else
        if (!rows || rows.length == 0)
          callback("Usuário e senha não conferem!");
        else {
          obj.user_id = rows[0].id_usuario.toString();
          // TODO token de segurança (diversas origens)
          callback(null, 'user ok');
        }
    });
  }
  ], function(err, results) { // Tratamento de erros
       conn.end();
       if (!!err) obj.err = err;
       res.json(obj);
  });
};