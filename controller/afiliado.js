const { request, response } = require('express');
const { validationResult } = require('express-validator');
const Afiliado = require('../models/afiliado');
const Afiliacion = require('../models/afiliacion');
const { format, subYears } = require('date-fns');
const { calculaEdad, calculaPensionados } = require('../helpers/calculos');

const eliminarCamposNoDeseados = (documentos) => {
    return documentos.map(documento => {
        // Eliminar _id y __v del documento de Afiliado
        const { _id, __v, ...resto } = documento;

        // Eliminar _id y __v de la afiliación si existe
        if (resto.afiliacion) {
            const { _id, __v, ...afiliacion } = resto.afiliacion;
            resto.afiliacion = afiliacion;
        }

        return resto;
    });
};

const obtenerAfiliados = async (req = request, res = response) => {
    try {
        const afiliados = await Afiliado.find(req.query)
            .populate({
                path: 'afiliacion',
                select: 'fechaInicio tipo'
            })
            .lean();

        // Limpiar el campo _id de la afiliación
        const afiliadosSinId = eliminarCamposNoDeseados(afiliados);

        res.status(200).json({
            afiliados: afiliadosSinId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener afiliados',
            error
        });
    }
}


const crearAfiliado = async (req, res = response) => {
    const body = req.body;

    try {

        const afiliadoDB = await Afiliado.findOne({ nombre: body.nombre });

        if (afiliadoDB) {
            return res.status(400).json({
                msg: `${afiliadoDB.nombre}, ya existe`
            });
        }

        // Verificar si la afiliación existe
        const afiliacion = await Afiliacion.findById(body.afiliacion);
        if (!afiliacion) {
            return res.status(400).json({
                msg: 'Afiliación no encontrada'
            });
        }

        const data = {
            id: body.id,
            nombre: body.nombre,
            fechaNacimiento: body.fechaNacimiento,
            genero: body.genero,
            afiliacion: body.afiliacion
        };

        const nuevoAfiliado = new Afiliado(data);
        await nuevoAfiliado.save();

        res.status(201).json({
            msg: 'Afiliado creado con éxito',
            afiliado: nuevoAfiliado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al crear el afiliado',
            error
        });
    }
}

const distribucionGenero = async (req, res = response) => {
    const [total, totalHombres, totalMujeres] = await Promise.all([
        Afiliado.countDocuments(req.query),
        Afiliado.countDocuments({ genero: "hombre" }),
        Afiliado.countDocuments({ genero: "mujer" })
    ]);

    res.json({
        totalAfiliados: total,
        distribucionGenero: {
            hombres: totalHombres,
            mujeres: totalMujeres,
        }
    });
}



const proximosPorPensionarse = async (req, res = response) => {
    const { edad } = req.params;

    try {
        const afiliados = await Afiliado.find(req.query)
            .select('id nombre fechaNacimiento')
            .lean();

        const afiliadosSinId = eliminarCamposNoDeseados(afiliados);
        const pensionados = afiliadosSinId.filter(afiliado => calculaPensionados(afiliado.fechaNacimiento, edad));
       
        // un for para darle formato a la fecha de nacimiento
        for (let i = 0; i < pensionados.length; i++) {
            pensionados[i].fechaNacimiento = format(pensionados[i].fechaNacimiento, 'yyyy-MM-dd');
        }

        res.status(200).json({
            proximosPorPensionarse: pensionados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los pensionados',
            error
        });
    }

}

const afiliadosRangoEdad = async (req, res = response) => {
    const { rango } = req.params;
    const rangoAux = rango.split('-');
    const rango1 = rangoAux[0];
    const rango2 = rangoAux[1];

    try {
        const fechaActual = new Date();
        const fechaFin = subYears(fechaActual, rango1);
        const fechaInicio = subYears(fechaActual, rango2);

        const query = { fechaNacimiento: { $gte: fechaInicio, $lte: fechaFin } };

        const [afiliados] = await Promise.all([
            Afiliado.find(query)
                .select('id nombre fechaNacimiento')
                .lean()
        ]);

        //para eliminar _id de la respuesta json
        const afiliadosSinId = eliminarCamposNoDeseados(afiliados);


        // un for para darle formato a la fecha de nacimiento
        for (let i = 0; i < afiliadosSinId.length; i++) {
            afiliadosSinId[i].fechaNacimiento = format(afiliadosSinId[i].fechaNacimiento, 'yyyy-MM-dd');
        }

        res.status(200).json({
            afiliadosSinId
        });


    } catch (error) {
        res.json(error);
    }
}

module.exports = {
    obtenerAfiliados,
    crearAfiliado,
    distribucionGenero,
    proximosPorPensionarse,
    afiliadosRangoEdad
}