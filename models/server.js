const express = require('express');
const cors = require('cors');
require('colors');
const { dbConnection } = require('../database/config');



class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            afiliaciones :'/api/afiliaciones',
            afiliados :'/api/'
        };

        //Conectar a base de datos
        this.conectarDB();
        //middlewares funciones que siempre se levantaran cuando levantemos el servidor
        this.middlewares();

        //rutas para mi aplicacion

        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //midlewar para hacer/servir el contenido estatico
        //----CORS
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

    }

    routes() {
        //middleware condicional
        this.app.use(this.paths.afiliados, require('../routes/afiliados'));
        this.app.use(this.paths.afiliaciones, require('../routes/afiliaciones'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto:'.rainbow, this.port);
        });
    }

}

module.exports = Server;