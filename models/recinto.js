const mongoose = require('mongoose');

// Esquema de los recintos donde se celebran los eventos
let recintoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        minlength: 10,
        trim: true
    },
    localidad: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    aforoMaximo: {
        type: Number
    }
});

// Modelo 'recinto' -> colección 'recintos' en MongoDB
let Recinto = mongoose.model('recinto', recintoSchema);

module.exports = Recinto;
