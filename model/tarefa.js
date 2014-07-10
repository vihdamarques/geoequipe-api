var mongoose = require('mongoose')
   ,Schema   = mongoose.Schema;

var TarefaSchema = new Schema({
    _cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true}
   ,_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true}
   ,_local: { type: Schema.Types.ObjectId, ref: 'Local', required: false }
   ,geo: {
        lng: {type: Number, max: 180, min: -180}
       ,lat: {type: Number, max: 90, min: -90}
    }
   ,contato: String
   ,telefone: String
   ,data_criacao: Date
   ,descricao: String
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
   ,movto: [{
        _usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
       ,data: Date
       ,apontamento: String
       ,status: {type: String, enum: ['Aberto', 'Cancelado', 'Agendado', 'Atendido', 'Não Atendido']}
       ,ordem: Number
    }]
}, { collection: 'tarefa' });

TarefaSchema.index({geo: '2d'});

module.exports = mongoose.model('Tarefa', TarefaSchema);