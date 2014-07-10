var db     = require('../utils/db')
   ,async  = require('async')
   ,shield = require('../utils/shield');

var query = exports.query = function(req, res) {
  var user_id = req.query.user_id
     ,token   = req.query.token
     ,obj     = {err: "", tasks: []}
     ,conn;

//  shield.verifyToken(req, res, token);

/*  async.series([
    function(callback) { // conectar DB
      conn = new db(function(err){
        if (!!err) callback("Erro ao conectar com o banco de dados ! ERR: " + err);
        else callback(null, 'connected');
      });
    }
   ,function(callback) { // Pega dados das tarefas
      conn.execute("select t.id_tarefa, t.descricao, l.latitude "
                 + ",l.longitude, l.nome as local "
                 + ",(select mm.apontamento "
                 + "    from ge_tarefa_movto mm "
                 + "   where mm.id_tarefa = t.id_tarefa "
                 + "     and mm.status = 'T') as apontamento "
                 + "from ge_tarefa t, ge_local l, ge_tarefa_movto m "
                 + "where t.id_local  = l.id_local "
                 + "and t.id_tarefa = m.id_tarefa "
                 + "and m.status = 'G' "
                 + "and m.data = curdate() "
                 + "and m.id_usuario = ? "
                 + "order by m.ordem ", [user_id], function(err, rows, fields) {
        if (!!err)
          callback("Erro ao listar tarefas ! ERR: " + err);
        else {
          var task;
          if (!!rows)
            rows.forEach(function(row) {
              task             = {};
              task.id_tarefa   = row.id_tarefa.toString();
              task.descricao   = row.descricao.toString();
              task.local       = row.local.toString();
              task.apontamento = (row.apontamento || "").toString();
              task.coord       = {};
              task.coord.lat   = row.latitude.toString(); 
              task.coord.lng   = row.longitude.toString();

              obj.tasks.push(task);
            });
          callback(null, "got tasks");
        }
      });
    }
    ], function(err, results) { // Tratamento de erros
         conn.end();
         if (!!err) obj.err = err;
         res.json(obj);
    });*/
};