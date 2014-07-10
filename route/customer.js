var Tarefa = require('../model/cliente');

var find = module.exports.find = function(req, res) {
    if (req.params.id)
        Tarefa.findById(req.params.id, function(err, result) {
            if (err) res.send(err);
            res.json(result);
        });
    else    
        Tarefa.find(function(err, result) {
            if (err) res.send(err);
            res.json(result);
        });
}

var save = module.exports.save = function(req, res) {

    if (req.params.id) {
        Tarefa.findById(req.params.id, function(err, tarefa) {
            if (err) res.send(err);
            tarefa.contato = req.body.contato;
            tarefa.save(function(err) {
                if (err) res.send(err);
                res.json({code: "OK", message: "Atualizado com sucesso!"});
            })
        });
    } else {
        var tarefa = new Tarefa();
        tarefa.contato = req.body.contato;
        tarefa.save(function(err) {
            if (err) res.send(err);
            res.json({code: "OK", message: "Criado com sucesso!"});
        });
    }
}

var remove = module.exports.remove = function(req, res) {
    Tarefa.remove({_id: req.params.id}, function(err) {
        if (err) res.send(err);
        res.json({code: "OK", message: "Removido com sucesso!"});
    });
}

var checkIn = module.exports.checkIn = function(req, res) {
    res.json({code: "OK", message: "Check-in realizado com sucesso!"});
}

var checkOut = module.exports.checkOut = function(req, res) {
    res.json({code: "OK", message: "Check-out realizado com sucesso!"});
}