var Mongoose = require('mongoose')
   ,Schema   = Mongoose.Schema;

var sinalSchema = new Schema({
    _usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
   ,_cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' }
   ,data_sinal: Date
   ,data_servidor: Date
   ,geo: {
       lng: {type: Number, max: 180, min: -180}
      ,lat: {type: Number, max: 90, min: -90}
    }
   ,precisao: Number
   ,velocidade: Number
   ,endereco: {
       logradouro: String
      ,numero: String
      ,bairro: String
      ,cidade: String
      ,estado: String
      ,pais: String
      ,cep: String
      ,completo: String
    }
});

sinalSchema.index({geo: '2d'});

var Sinal = Mongoose.model('Sinal', sinalSchema);