const {Schema, model } = require('mongoose');


const AfiliadoSchema = Schema ({
    id: {
        type: Number,
        unique: true //no permite insertar id duplicados
    },
    nombre: {
        type: String
    },
    fechaNacimiento: {
        type: Date
    },
    genero: {
        type: String
    },
    afiliacion:{
        type: Schema.Types.ObjectId,
        ref: 'Afiliacion',
        required: true
    }

});



AfiliadoSchema.methods.toJSON = function() {
    const { __v, _id, ...afiliado  } = this.toObject();
    return afiliado;
}


module.exports = model('Afiliado', AfiliadoSchema);