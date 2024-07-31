const {calculaPensionados} = require('./controller/afiliado');
// require('dotenv').config();

// const Server = require('./models/server');

// console.clear();
// const server = new Server();//lista la instancia

// server.listen();
console.log(calculaPensionados('1949-11-20', 90));