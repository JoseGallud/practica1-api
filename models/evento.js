const mongoose = require('mongoose');

// Esquema de las entradas (subdocumento de cada evento)
let entradaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    disponibles: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'El número de entradas disponibles debe ser un entero'
        }
    }
});

// Esquema de los eventos
let eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    fecha: {
        type: Date,
        required: true
    },
    recinto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recinto',
        required: true
    },
    entradas: [entradaSchema]
});

// Modelo 'evento' -> colección 'eventos' en MongoDB
let Evento = mongoose.model('evento', eventoSchema);

module.exports = Evento;
