var verifyToken = exports.verifyToken = function(req, res, token) {
    //var conn = new db(function(err){
    //  if (!!err)
    //    console.log("Erro ao conectar com o banco de dados ! ERR: " + err);
    //  else
        if (token != 123)
          res.send(401, err());
    //});
};

function err() {
  return {err: "Usuario não autorizado"};
}