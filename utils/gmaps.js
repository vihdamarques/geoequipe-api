var http = require('http');

var reverseGeocode = exports.reverseGeocode = function(p_lat, p_lng, p_retorno, p_sinal) {
  var options = {
        host: 'maps.google.com',
        port: 80,
        path: '/maps/api/geocode/json?latlng=' + p_lat + ',' + p_lng + '&sensor=false'
      }
     ,resposta = "";

  http.get(options, function(res) {
    res.on('data', function(chunk){
      resposta += chunk.toString('UTF8');
    });

    res.on('end', function() {
      processar(resposta, p_retorno);
    });

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

  function processar(json, p_retorno) {
    json = JSON.parse(json);
    var endereco = {endereco: ""
                   ,pais: ""
                   ,estado: ""
                   ,cidade: ""
                   ,bairro: ""
                   ,logradouro: ""
                   ,numero: ""
                   ,cep: ""
                   }, results;
    if (json.status === 'OK') {
      endereco.endereco = json.results[0].formatted_address;
      results = json.results[0].address_components;
      for (var i  = 0; i < results.length; i++){
        var types = "," + results[i].types.join() + ",";
        if (!!~types.indexOf(",country,")) {
          endereco.pais = results[i].long_name;
        } else if (!!~types.indexOf(",administrative_area_level_1,")) {
          endereco.estado = results[i].long_name;
        } else if (!!~types.indexOf(",locality,")) {
          endereco.cidade = results[i].long_name;
        } else if (!!~types.indexOf(",sublocality,")) {
          endereco.bairro = results[i].long_name;
        } else if (!!~types.indexOf(",route,")) {
          endereco.logradouro = results[i].long_name;
        } else if (!!~types.indexOf(",street_number,")) {
          endereco.numero = results[i].long_name;
        } else if (!!~types.indexOf(",postal_code,")) {
          endereco.cep = results[i].long_name;
        }
      }
    } else if (json.status === 'ZERO_RESULTS') {
    } else console.log('erro ao geocodificar: ' + json.status);
    if (typeof p_retorno === "function")
      p_retorno(endereco, p_sinal);
  }
}

/*

function verificaEndereco() {
  var conn, sinal = [];
  async.series([
    function(callback) { // conectar BD
      conn = getConexaoDB();
      conn.connect(function(err) {
        if (!!err) callback("Erro ao conectar com o banco de dados ! ERR: " + err);
        callback(null,'conectou');
      });
    }
   ,function(callback) { // pegar lista de sinais sem endereco
      conn.query("select id_sinal, latitude, longitude "
               + "from ge_sinal "
               + "where pais = '' or pais is null "
               + "limit 0, 500"
                ,function(err, rows, fields) {
        if (!!err) callback("Erro ao listar sinais sem endereco ! ERR: " + err);
          if (!rows || rows.length == 0)
            callback(null,'nenhum sinal sem endereço');
          else {
            for (var i = 0; i < rows.length; i++)
              sinal.push({id_sinal: rows[i].id_sinal
                         ,lat: rows[i].latitude
                         ,lng: rows[i].longitude});
            callback(null,"listou sinais sem endereço");
          }
      });
    }
   ,function(callback) {
      var count = 0, enderecos = [], stm = "";
        if (sinal.length > 0) {
          for (var i = 0; i < sinal.length; i++) {
            setTimeout(function(sinalAtual) {
              reverseGeocode(sinalAtual.lat, sinalAtual.lng, function(end, id_sinal) {
                enderecos.push({end: end, id_sinal: id_sinal});
                if (++count == sinal.length) {
                  for (var n = 0; n < enderecos.length; n++) {
                    stm += "update ge_sinal "
                         + "set logradouro = " + conn.escape(enderecos[n].end.logradouro)
                               + ", numero = " + conn.escape(enderecos[n].end.numero)
                               + ", bairro = " + conn.escape(enderecos[n].end.bairro)
                               + ", cidade = " + conn.escape(enderecos[n].end.cidade)
                               + ", estado = " + conn.escape(enderecos[n].end.estado)
                                 + ", pais = " + conn.escape(enderecos[n].end.pais)
                                  + ", cep = " + conn.escape(enderecos[n].end.cep)
                        + " where id_sinal = " + conn.escape(enderecos[n].id_sinal)
                        + "; ";
                  }
                  conn.query(stm, function(err, rows, fields) {
                    if (!!err) callback("Erro ao listar sinais sem endereco ! ERR: " + err);
                    console.log(count + " sinais atualizados");
                    callback(null,"atualizou sinais");
                  });
                }
              }, sinalAtual.id_sinal);
            }, 400 * i, sinal[i]);
          }
        } else {
          callback(null,"nao precisou atualizar nenhum registro");
        }
    }
  ], function(err, results) { // Tratamento de erros
       conn.end();
       setTimeout(verificaEndereco, 120000);
  });
}

/*