var Usuario = require('../model/usuario')
   ,model   = require('../utils/model');

var find = module.exports.find = function(req, res) {
    if (req.params.id)
        Usuario.findById(req.params.id).populate('_cliente').exec(function(err, result) {
            if (err) res.send(err);
            else res.json(result);
        });
    else
        Usuario.find().populate('_cliente').exec(function(err, result) {
            if (err) res.send(err);
            else res.json(result);
        });
}

var save = module.exports.save = function(req, res) {
    if (req.params.id)
        Usuario.findById(req.params.id, function(err, usuario) {
            if (err) res.send(err);
            else {
                model.assignAttrs(req.body, usuario);
                usuario.save(function(err) {
                    if (err) res.send(err);
                    else res.json(model.returnMsg("OK", "Atualizado com sucesso!"));
                });
            }
        });
    else {
        var usuario = new Usuario();
        model.assignAttrs(req.body, usuario);
        usuario.save(function(err) {
            if (err) res.send(err);
            else res.json(model.returnMsg("OK", "Criado com sucesso!"));
        });
    }
}

var remove = module.exports.remove = function(req, res) {
    Usuario.remove({_id: req.params.id}, function(err) {
        if (err) res.send(err);
        else res.json(model.returnMsg("OK", "Removido com sucesso!"));
    });
}