const express = require('express');
const Evento = require(__dirname + '/../models/evento.js');
const Recinto = require(__dirname + '/../models/recinto.js');

let router = express.Router();

// GET /eventos -> listado de todos los eventos (con su recinto)
router.get('/', async (req, res) => {
    try {
        const resultado = await Evento.find().populate('recinto');
        if (resultado.length > 0)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
    } catch (error) {
        res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
    }
});

// GET /eventos/localidad/:nombre -> eventos futuros de una localidad
router.get('/localidad/:nombre', async (req, res) => {
    try {
        // 1. Recintos de esa localidad
        const recintos = await Recinto.find({ localidad: req.params.nombre });
        // 2. Eventos en esos recintos cuya fecha no haya pasado
        const resultado = await Evento.find({
            recinto: { $in: recintos.map(r => r._id) },
            fecha: { $gte: new Date() }
        }).populate('recinto');

        if (resultado.length > 0)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
    } catch (error) {
        res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
    }
});

// GET /eventos/entradas/:idEvento/:tipoEntrada -> precio y disponibles
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.idEvento);
        const entrada = evento ?
            evento.entradas.find(e => e.tipo === req.params.tipoEntrada) : null;

        if (entrada)
            res.status(200).send({ ok: true, resultado: {
                precio: entrada.precio,
                disponibles: entrada.disponibles
            }});
        else
            res.status(404).send({ ok: false,
                error: "Error obteniendo datos de entrada para evento " + req.params.idEvento });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Error obteniendo datos de entrada para evento " + req.params.idEvento });
    }
});

// PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad -> restar entradas
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        const cantidad = Number(req.params.cantidad);
        if (!Number.isInteger(cantidad) || cantidad <= 0)
            throw new Error('Cantidad no válida');

        // Solo actualiza si existe ese tipo de entrada con suficientes disponibles.
        // El operador $ apunta a la entrada que ha encajado en el $elemMatch.
        const resultado = await Evento.findOneAndUpdate(
            {
                _id: req.params.idEvento,
                entradas: { $elemMatch: {
                    tipo: req.params.tipoEntrada,
                    disponibles: { $gte: cantidad }
                }}
            },
            { $inc: { 'entradas.$.disponibles': -cantidad } },
            { returnDocument: 'after' }
        ).populate('recinto');

        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "Error actualizando entradas del evento " + req.params.idEvento });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Error actualizando entradas del evento " + req.params.idEvento });
    }
});

// GET /eventos/:id -> evento por id
router.get('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findById(req.params.id).populate('recinto');
        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "Evento " + req.params.id + " no encontrado" });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Evento " + req.params.id + " no encontrado" });
    }
});

// POST /eventos -> añadir evento
router.post('/', async (req, res) => {
    try {
        let nuevoEvento = new Evento({
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            recinto: req.body.recinto,
            entradas: req.body.entradas
        });
        const resultado = await nuevoEvento.save();
        res.status(201).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error añadiendo evento" });
    }
});

// PUT /eventos/:id -> actualizar evento
router.put('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { returnDocument: 'after', runValidators: true }
        ).populate('recinto');

        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "Error actualizando evento " + req.params.id });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Error actualizando evento " + req.params.id });
    }
});

// DELETE /eventos/:id -> eliminar evento
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findByIdAndDelete(req.params.id);
        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(404).send({ ok: false,
                error: "Error eliminando evento " + req.params.id });
    } catch (error) {
        res.status(404).send({ ok: false,
            error: "Error eliminando evento " + req.params.id });
    }
});

module.exports = router;
