const { request, response } = require('express');
const { validationResult } = require('express-validator');
const Afiliado = require('../models/afiliado');
const Afiliacion = require('../models/afiliacion');


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
            .lean(); // Usar .lean() para obtener objetos planos

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

        //ver si una producto existe con ese nombre
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

        // Generar la data a guardar
        const data = {
            id: body.id,
            nombre: body.nombre,
            fechaNacimiento: body.fechaNacimiento,
            genero: body.genero,
            afiliacion: body.afiliacion
        };

        // Crear y guardar el nuevo afiliado
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
    res.json({
        msg: 'proximos a pensionarse',
        edad: edad
    });
}

module.exports = {
    obtenerAfiliados,
    crearAfiliado,
    distribucionGenero,
    proximosPorPensionarse
}