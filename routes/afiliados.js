const { Router } = require('express');
const { check } = require('express-validator');

const { obtenerAfiliados, crearAfiliado, distribucionGenero,
    proximosPorPensionarse, afiliadosRangoEdad
} = require('../controller/afiliado');
const { validarCampos } = require('../middlewares/validarCampos');
const { esEdadPension, esIntervarlo10 } = require('../helpers/db-validaciones');


const router = Router();

router.get('/afiliados', obtenerAfiliados);

router.post('/afiliados', crearAfiliado);

router.get('/distribucion-genero', distribucionGenero);

router.get('/afiliados-proximos-pensionarse/:edad', [
    check('edad').custom(esEdadPension),
    validarCampos
],proximosPorPensionarse);

router.get('/afiliados-rango-edad/:rango',[
    check('rango').custom(esIntervarlo10),
    validarCampos
], afiliadosRangoEdad);






module.exports = router;