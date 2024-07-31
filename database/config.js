const mongoose = require('mongoose');
require('colors');
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }); //await espera que la conexion se haga

        console.log('Base de datos online'.magenta);

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos'.red);

    }
}

module.exports = {
    dbConnection
}