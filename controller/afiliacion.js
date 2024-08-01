const { request, response } = require('express');
const { validationResult } = require('express-validator');
const Afiliacion = require('../models/afiliacion');




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
    const { fechaInicio, tipo } = req.body;

    const afiliacion = new Afiliacion({ fechaInicio, tipo });

    await afiliacion.save(); 
    res.status(201).json({
        afiliacion
    });
}



module.exports = {
    obtenerAfiliaciones,
    crearAfiliacion
}