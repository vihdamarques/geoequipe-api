var Mongoose = require('mongoose')
   ,Schema   = Mongoose.Schema;

var usuarioSchema = new Schema({
    _cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: false }
   ,usuario: String
   ,senha: { type: String, required: true }
   ,nome: String
   ,ativo: { type: Boolean, default: true }
   ,perfil: { type: String, default: 'I', enum: ['G', 'I', 'E'] }
   ,email: String
   ,celular: String
   ,telefone: String
   ,access_token: String
   ,refresh_token: String
});

var Usuario = module.exports = Mongoose.model('Usuario', usuarioSchema);