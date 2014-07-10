var Mongoose = require('mongoose')
   ,Schema   = Mongoose.Schema;

var localSchema = new Schema({
    _cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' }
   ,descricao: String
   ,geo: {
       lng: { type: Number, max: 180, min: -180 }
      ,lat: { type: Number, max: 90, min: -90 }
    }
   ,endereco: String
   ,ativo: { type: Boolean, default: true }
   ,contato: String
   ,telefone: String
   ,email: String
});

localSchema.index({geo: '2d'});

var Local = Mongoose.model('Local', localSchema);