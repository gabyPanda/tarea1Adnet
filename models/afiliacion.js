const {Schema, model } = require('mongoose');


const AfiliacionSchema = Schema ({
    fechaInicio: {
        type: String
    },
    tipo: {
        type: String
    }
});



AfiliacionSchema.methods.toJSON = function() {
    const { __v, _id, ...afiliacion  } = this.toObject();
    return afiliacion;
}

//dentro de model va el nombre de la coleccion, y el schema
module.exports = model('Afiliacion', AfiliacionSchema);