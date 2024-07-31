const { request, response } = require('express');
const { validationResult } = require('express-validator');
const Afiliacion = require('../models/afiliacion');//agrego directamente el modelo Usuario, permite crear instancias del modelo




const obtenerAfiliaciones = async (req = request, res = response) => {
    const body = req.body;

    const [afiliaciones] = await Promise.all([
        Afiliacion.find(req.query)
     ]);

res.json({
            afiliaciones
        });
}

const crearAfiliacion = async (req = request, res = response) => {
    //req lo que se esta solicitando
    const { fechaInicio, tipo } = req.body;

    const afiliacion = new Afiliacion({ fechaInicio, tipo });//campos que quiero grabar en la creacion del usuario

    //guardar en mongoDB
    await afiliacion.save(); //await para que espere la grabacion
    //usualmente se manda un objeto en formato json
    res.status(201).json({
        afiliacion
        //msg:'post aliacion'
    });
}



module.exports = {
    obtenerAfiliaciones,
    crearAfiliacion
}