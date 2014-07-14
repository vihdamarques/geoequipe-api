var mongoose = require('mongoose')
   ,Schema   = mongoose.Schema;

var schema = new Schema({
    _cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true }
   ,usuario: { type: String, required: true, unique: true}
   ,senha: { type: String, required: true }
   ,nome: { type: String, required: true }
   ,ativo: { type: Boolean, default: true, required: true }
   ,perfil: { type: String, default: 'I', enum: ['G', 'I', 'E'], required: true }
   ,email: { type: String, required: false, default: "" }
   ,celular: { type: String, required: false, default: "" }
   ,telefone: { type: String, required: false, default: "" }
   ,token: { type: String, required: false, default: "" }
   //,access_token: { type: String, required: false }
   //,refresh_token: { type: String, required: false }
}, { collection: 'usuario' });

module.exports = mongoose.model('Usuario', schema);