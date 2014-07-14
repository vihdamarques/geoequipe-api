var Cliente = require('../model/cliente')
   ,model   = require('../utils/model');

var find = module.exports.find = function(req, res) {
    if (req.params.id)
        Cliente.findById(req.params.id, function(err, result) {
            if (err) res.send(err);
            else res.json(result);
        });
    else
        Cliente.find(function(err, result) {
            if (err) res.send(err);
            else res.json(result);
        });
}

var save = module.exports.save = function(req, res) {
    if (req.params.id)
        Cliente.findById(req.params.id, function(err, cliente) {
            if (err) res.send(err);
            else {
                model.assignAttrs(req.body, cliente);
                cliente.save(function(err) {
                    if (err) res.send(err);
                    else res.json(model.returnMsg("OK", "Atualizado com sucesso!"));
                });
            }
        });
    else {
        var cliente = new Cliente();
        model.assignAttrs(req.body, cliente);
        cliente.save(function(err) {
            if (err) res.send(err);
            else res.json(model.returnMsg("OK", "Criado com sucesso!"));
        });
    }
}

var remove = module.exports.remove = function(req, res) {
    Cliente.remove({_id: req.params.id}, function(err) {
        if (err) res.send(err);
        else res.json(model.returnMsg("OK", "Removido com sucesso!"));
    });
}