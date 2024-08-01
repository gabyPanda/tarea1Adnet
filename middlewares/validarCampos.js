const { validationResult } = require('express-validator');
const { request, response } = require('express');

const validarCampos = (req = request, res = response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();//next quiere decir que si llega a este punto sigue con el siguiente middleware y si no hay otro entonces la funcionpost o etc
}

module.exports = {
    validarCampos
};