var mongoose = require('mongoose')
   ,Schema   = mongoose.Schema;

var schema = new Schema({
    nome: {type: String, required: true}
   ,ativo: {type: Boolean, default: true, required: true}
   ,email: {type: String, required: true, unique: true}
   ,contato: {type: String, required: true}
   ,telefone: {type: String, required: true}
}, { collection: 'cliente' });

module.exports = mongoose.model('Cliente', schema);