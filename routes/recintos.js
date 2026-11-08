const express = require('express');
const Recinto = require(__dirname + '/../models/recinto.js');

let router = express.Router();

// GET /recintos -> listado de todos los recintos
router.get('/', async (req, res) => {
    try {
        const resultado = await Recinto.find();
        if (resultado.length > 0)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(500).send({ ok: false, error: "No se han encontrado recintos" });
    } catch (error) {
        res.status(500).send({ ok: false, error: "No se han encontrado recintos" });
    }
});

// GET /recintos/localidad/:nombre -> recintos de una localidad
router.get('/localidad/:nombre', async (req, res) => {
    try {
        const resultado = await Recinto.find({ localidad: req.params.nombre });
        if (resultado.length > 0)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "No se han encontrado recintos de la localidad indicada" });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "No se han encontrado recintos de la localidad indicada" });
    }
});

// GET /recintos/:id -> recinto por id
router.get('/:id', async (req, res) => {
    try {
        const resultado = await Recinto.findById(req.params.id);
        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "Recinto " + req.params.id + " no encontrado" });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Recinto " + req.params.id + " no encontrado" });
    }
});

// POST /recintos -> añadir recinto
router.post('/', async (req, res) => {
    try {
        let nuevoRecinto = new Recinto({
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            localidad: req.body.localidad,
            aforoMaximo: req.body.aforoMaximo
        });
        const resultado = await nuevoRecinto.save();
        res.status(201).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error añadiendo recinto" });
    }
});

// DELETE /recintos/:id -> eliminar recinto
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await Recinto.findByIdAndDelete(req.params.id);
        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "Error eliminando recinto " + req.params.id });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Error eliminando recinto " + req.params.id });
    }
});

module.exports = router;
