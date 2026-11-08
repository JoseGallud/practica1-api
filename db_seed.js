require('dotenv').config();
const mongoose = require('mongoose');
const Recinto = require('./models/recinto');
const Evento = require('./models/evento');

const URL_BD = process.env.URL_BD || 'mongodb://127.0.0.1:27017/eventos';

const seedDatabase = async () => {
    try {
        console.log(`Conectando a la base de datos en ${URL_BD}...`);
        await mongoose.connect(URL_BD);
        console.log('Conexión establecida con éxito.');

        // Limpieza de datos previos
        console.log('Limpiando colecciones existentes...');
        await Evento.deleteMany({});
        await Recinto.deleteMany({});

        // Crear recintos distintos
        console.log('Insertando recintos de prueba...');
        const recintos = await Recinto.insertMany([
            {
                nombre: 'WiZink Center',
                direccion: 'Avenida de Felipe II, s/n',
                localidad: 'Madrid',
                aforoMaximo: 17453
            },
            {
                nombre: 'Palau Sant Jordi',
                direccion: 'Passeig Olímpic, 5-7',
                localidad: 'Barcelona',
                aforoMaximo: 17960
            },
            {
                nombre: 'Estadio de La Cartuja',
                direccion: 'Isla de la Cartuja, Sector Norte',
                localidad: 'Sevilla',
                aforoMaximo: 60000
            }
        ]);

        console.log(`Se han insertado ${recintos.length} recintos.`);

        // 2. Crear al menos 3 eventos con distintos tipos de entradas cada uno,
        // asociando a cada uno un recinto distinto
        console.log('Insertando eventos de prueba...');
        const eventos = await Evento.insertMany([
            {
                nombre: 'Summer Rock Fest 2027',
                fecha: new Date('2027-07-15T21:00:00Z'),
                recinto: recintos[0]._id,
                entradas: [
                    { tipo: 'General', precio: 45.0, disponibles: 500 },
                    { tipo: 'VIP', precio: 120.0, disponibles: 80 },
                    { tipo: 'Grada', precio: 60.0, disponibles: 250 }
                ]
            },
            {
                nombre: 'Electronic Night BCN 2027',
                fecha: new Date('2027-08-20T22:30:00Z'),
                recinto: recintos[1]._id,
                entradas: [
                    { tipo: 'Pista', precio: 50.0, disponibles: 400 },
                    { tipo: 'VIP', precio: 150.0, disponibles: 50 },
                    { tipo: 'Early Bird', precio: 35.0, disponibles: 100 }
                ]
            },
            {
                nombre: 'Gira Acústica Andalucía 2027',
                fecha: new Date('2027-09-10T20:00:00Z'),
                recinto: recintos[2]._id,
                entradas: [
                    { tipo: 'Platea', precio: 55.0, disponibles: 300 },
                    { tipo: 'Tribuna', precio: 40.0, disponibles: 600 },
                    { tipo: 'Palco VIP', precio: 180.0, disponibles: 30 }
                ]
            }
        ]);

        console.log(`Se han insertado ${eventos.length} eventos correctamente.`);
        console.log('Seed completado con éxito.');
    } catch (error) {
        console.error('Error durante la inserción de datos de prueba:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Conexión con MongoDB cerrada.');
    }
};

seedDatabase();

