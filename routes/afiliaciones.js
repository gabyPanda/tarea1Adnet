const { Router } = require('express');
const { check } = require('express-validator');

const { obtenerAfiliaciones, crearAfiliacion } = require('../controller/afiliacion');
//const {esRolValido, esCorreoValido, existeUsuarioPorId} = require('../helpers/db-validators');
//const {validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares/index');

const router = Router();//llamo a la funcion Router y la guardo en la constante route

router.get('/', obtenerAfiliaciones);


//(endpoint, [middlewares], funcionpost)
router.post('/', crearAfiliacion);




module.exports = router;