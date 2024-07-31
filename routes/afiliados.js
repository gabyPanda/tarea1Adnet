const { Router } = require('express');
const { check } = require('express-validator');

const { obtenerAfiliados, crearAfiliado, distribucionGenero,
    proximosPorPensionarse
} = require('../controller/afiliado');
//const {esRolValido, esCorreoValido, existeUsuarioPorId} = require('../helpers/db-validators');
//const {validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares/index');

const router = Router();//llamo a la funcion Router y la guardo en la constante route

router.get('/afiliados', obtenerAfiliados);


//(endpoint, [middlewares], funcionpost)
router.post('/afiliados', crearAfiliado);

router.get('/distribucion-genero', distribucionGenero);

router.get('/afiliados-proximos-pensionarse/:edad', proximosPorPensionarse);




module.exports = router;