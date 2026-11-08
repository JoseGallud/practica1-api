// 1. Carga de librerías
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const recintos = require(__dirname + '/routes/recintos');
const eventos = require(__dirname + '/routes/eventos');

const URL_BD = process.env.URL_BD || 'mongodb://127.0.0.1:27017/eventos';
const PUERTO = process.env.PORT || 8080;

// 2. Conexión con la base de datos
mongoose.connect(URL_BD)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(error => console.log('Error conectando a MongoDB:', error.message));

// 3. Servidor Express y middleware para JSON
let app = express();
app.use(express.json());

// 4. Enrutadores
app.use('/recintos', recintos);
app.use('/eventos', eventos);

// 5. Puesta en marcha del servidor
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
