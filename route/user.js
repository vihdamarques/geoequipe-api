var list = module.exports.list = function(req, res, next) {
    var Usuario = require('../model/usuario');

    Usuario.find(function(err, users){
        res.send(users);
    });
}

var save = module.exports.save = function(req, res, next) {
console.log(req.body);
    var Usuario = require('../model/usuario')
       ,user    = new Usuario(req.body);

    user.save(function(err){
        if (err) res.send("Erro ao salvar! "+err.stack);
        else res.send("OK");
    });
}