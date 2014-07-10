var Mongoose = require('mongoose')
   ,Schema   = Mongoose.Schema;

var clienteSchema = new Schema({
   ,nome: String
   ,ativo: {type: Boolean, default: true}
   ,email: String
   ,contato: String
   ,telefone: String
}, { collection: 'cliente' });

var Cliente = Mongoose.model('Cliente', clienteSchema);