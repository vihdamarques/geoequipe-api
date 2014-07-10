var mysql       = require('mysql')
   ,DBConfigs   = {
      host: 'geoequipe.com.br'
     ,port: 3306
     ,user: 'blurb372_ge'
     ,password: 'geoequipe'
     ,database: 'blurb372_geoequipe'
     ,multipleStatements: true
     ,insecureAuth: true
    };

var execute = exports.execute = function(command, args, callback) {
    var conn = mysql.createConnection(DBConfigs);
    conn.connect(function(err) {
        if (!!err) console.log("Erro ao conectar com o banco de dados ! ERR: " + err);
        conn.query(command, args, function(err, rows, fields) {
            conn.end();
            callback(err, rows, fields);
        });
    });
};

var Connection = module.exports = function(callback) {
    this.conn = mysql.createConnection(DBConfigs);
    this.conn.connect(function(err) {
        if (!!err) console.log("Erro ao conectar com o banco de dados ! ERR: " + err);
        callback(err);
    });
};

Connection.prototype.execute = function(command, args, callback) {
    this.conn.query(command, args, callback);
};

Connection.prototype.end = function() {
    this.conn.end();
}