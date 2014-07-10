var receiving = module.exports = function(req, res) {
    var message    = require('../utils/message')
       ,signal     = req.body
       ,validation = checarDados(signal);

    console.log('Conexão recebida. IP: ' + req.ip);

    signal.ip   = req.ip;
    signal.code = getNewCode();

    if (validation)
        res.json(message.signal(false, "Solicitação Inválida: " + validation));
    else {
        req.app.locals.queue.push(sinal);
        res.json(message.signal(true, "Solicitação recebida!"));
    }

    if (!req.app.locals.running)
        setTimeout(processarSinal(req.app.locals.queue, req.app.locals.running), 100);
};

function getNewCode() {
    return Math.ceil(Math.random() * 9999999).toString();
}

// Validação dos dados recebidos
function checarDados(signal) {
  if (!signal.imei) return "Aparelho móvel não identificado";
  if (!signal.user) return "Usuário não identificado";
  if (!signal.data) return "data indisponível";
  if (!signal.coord) return "Coordenadas não localizadas";
  if (!signal.coord.lat) return "Latitude não localizada";
  if (!signal.coord.lng) return "Longitude não localizada";
  return null;
}

function processarSinal(queue, running) {
  if (queue.length > 0) {
    if (!running) running = true;
    // retorna o primeiro item do array e o remove do array
    var target = queue.shift();
    console.log(target.code + ' - Started');

    try {
      var sinal, v_id_usuario, v_id_equipamento, erro, conn, bf;

      // tenta converter o parametro de base64 para urls para base64, descriptografar e depois converter para JSON
      try {
        bf    = new Blowfish(key);
        sinal = JSON.parse(bf.decrypt(atual.dados.replace(/-/g,'+').replace(/_/g,'/')));
        bf    = null;
      } catch (err) {
        console.log("Falha ao fazer parse do JSON enviado ! ERR: " + err.message);
        throw "Falha ao fazer parse do JSON enviado ! ERR: " + err.message;
      }
      erro = checarDados(sinal); // valida se todas as informações foram preenchidas

      if(!!erro) {
        throw erro;
      } else {
        // controla os processos assicronos
        async.series([
          function(callback) { // conectar DB
            conn = getConexaoDB();
            conn.connect(function(err) {
              if (!!err) callback("Erro ao conectar com o banco de dados ! ERR: " + err);
              callback(null,'conectou');
            });
          }
         ,function(callback) { // Verifica se o usuário existe
            conn.query("select id_usuario from ge_usuario where id_usuario = ?", sinal.user, function(err, rows, fields) {
              
              if (!!err) callback("Erro ao verificar usuario ! ERR: " + err);
              if (rows.length == 0)
                callback("Usuario " + sinal.user + " nao encontrado!");
              else
                v_id_usuario = rows[0].id_usuario;
              callback(null,'checou usuario');
            });
          }
         ,function(callback) { // Verifica se o equipamento do imei recebido existe
            conn.query("select id_equipamento from ge_equipamento where imei = ?", sinal.imei, function(err, rows, fields) {
              if (!!err) callback("Erro ao verificar equipamento ! ERR: " + err);
              if (rows.length == 0)
                callback("Equipamento " + sinal.imei + " nao encontrado!");
              else
                v_id_equipamento = rows[0].id_equipamento;
              callback(null,'checou equipamento');
            });
          }
         ,function(callback) { // Verifica ultimo sinal
            conn.query("select s.latitude, s.longitude, s.id_sinal, date_format(s.data_sinal, '%d/%m/%Y %H:%i:%S') data_sinal "
                     + "from ge_sinal s, ge_usuario u "
                     + "where s.id_sinal = u.id_ultimo_sinal and u.id_usuario = ?", sinal.user, function(err, rows, fields) {
              if (!!err) callback("Erro ao verificar ultimo sinal ! ERR: " + err);
              if (rows.length == 0)
                callback(null,'nao possui ultimo sinal');
              else {
                sinal.ultimoSinal = {id_sinal: rows[0].id_sinal, lat: rows[0].latitude, lng: rows[0].longitude, data: rows[0].data_sinal};
                callback(null,'pegou ultimo sinal');
              }
            });
          }
         ,function(callback) { // Insere sinal
            var dist;
            if (!!sinal.ultimoSinal) {
              dist = distancia(sinal.coord.lat, sinal.coord.lng, sinal.ultimoSinal.lat, sinal.ultimoSinal.lng);
              sinal.velocidade = (dist / ((toDate(sinal.data) - toDate(sinal.ultimoSinal.data)) / 1000)) * 3.6;
              if (sinal.velocidade > 160) sinal.velocidade = 0;
              console.log("dist: " + dist);
              console.log("sinal.velocidade: " + sinal.velocidade);
              console.log("sinal.coord.lat: "+sinal.coord.lat);
              console.log("sinal.coord.lng: "+sinal.coord.lng);
              console.log("sinal.ultimoSinal.lat: "+sinal.ultimoSinal.lat);
              console.log("sinal.ultimoSinal.lng: "+sinal.ultimoSinal.lng);
              console.log("sinal.data: "+sinal.data);
              console.log("sinal.ultimoSinal.data: "+sinal.ultimoSinal.data);
            } else {
              sinal.velocidade = 0;
            }
            // Grava se distancia for maior que 40 metros do ultimo ponto ou nao existir ultimo ponto
            if (dist === undefined || dist > 40) {
              conn.query("insert into ge_sinal (id_usuario,id_equipamento,data_sinal,data_servidor,latitude,longitude,coordenada,velocidade) "
                       + "values (?,?,str_to_date(?,'%d/%m/%Y %H:%i:%S'),now() + INTERVAL " + fusoHorario + " HOUR ,?,?,point(?,?),?)"
                        ,[v_id_usuario,v_id_equipamento,sinal.data,sinal.coord.lat,sinal.coord.lng,sinal.coord.lng,sinal.coord.lat, sinal.velocidade]
                        ,function(err, rows, fields) {
                if (!!err) callback("Erro ao inserir sinal ! ERR: " + err);
                sinal.id_sinal = rows.insertId;
                callback(null,"inseriu sinal");
              });
            } else {
              callback(null,"nao precisou inserir sinal");
            }
          }
         ,function(callback) { // Atualiza ultimo sinal na tabela de usuario ou horario do ultimo sinal
            if (!!sinal.id_sinal) {
              conn.query("update ge_usuario "
                       + "set id_ultimo_sinal = ? "
                       + "where id_usuario = ?; "
                       + "update ge_equipamento "
                       + "set id_ultimo_sinal = ? "
                       + "where id_equipamento = ?"
                        ,[sinal.id_sinal, v_id_usuario, sinal.id_sinal, v_id_equipamento], function(err, rows, fields) {
                if (!!err) callback("Erro ao inserir sinal ! ERR: " + err);
                callback(null,"atualizou ultimo ponto");
              });
            } else if (!!sinal.ultimoSinal) {
              conn.query("update ge_sinal  "
                       + "set data_servidor = now() + INTERVAL " + fusoHorario + " HOUR "
                       + "   ,data_sinal = str_to_date(?,'%d/%m/%Y %H:%i:%S') "
                       + "   ,velocidade = ? "
                       + "where id_sinal = ? "
                        ,[sinal.data, sinal.velocidade, sinal.ultimoSinal.id_sinal], function(err, rows, fields) {
                if (!!err) callback("Erro ao inserir sinal ! ERR: " + err);
                callback(null,"atualizou horario do ponto");
              });
            } else {
              callback(null,"algo estranho aconteceu");
            }
         }
        ], function(err, results) { // Tratamento de erros
             conn.end();
             console.log(atual.codigo + ' - Fila de ações: ' + results);
             if (!!err) console.log(atual.codigo + ' - Erro: ' + err);
             console.log(atual.codigo + ' - Finalizou; tamanho da fila restante: ' + fila.length);
             setTimeout(function() { processarSinal(queue, running) }, 100);
        });

      }

    } catch (err) {
      console.log(atual.codigo + ' - Erro:' + err.message);
    }
  } else {
    running = false;
  }
}