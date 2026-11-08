# Práctica 1 – API REST de eventos (Express + Mongoose)

## Estructura

```
practica1/
├── index.js          # Servidor principal
├── db_seed.js        # Datos de prueba
├── models/
│   ├── evento.js     # Esquema de eventos + subesquema de entradas
│   └── recinto.js    # Esquema de recintos
├── routes/
│   ├── eventos.js    # Endpoints /eventos y /eventos/entradas
│   └── recintos.js   # Endpoints /recintos
├── .env.example
└── package.json
```

Estilo: CommonJS (`require`) y `async/await` en todos los endpoints.

## Ejecución en local

```bash
npm install
cp .env.example .env      # ajustar URL_BD si hace falta
node db_seed.js           # cargar datos de prueba
npm start                 # http://localhost:8080
```

## Despliegue

### URLs del proyecto

- Repositorio: https://github.com/JoseGallud/practica1-api
- API desplegada: https://practica1-api.onrender.com
- Recintos: https://practica1-api.onrender.com/recintos
- Eventos: https://practica1-api.onrender.com/eventos

### MongoDB Atlas
1. Crear un cluster gratuito (M0).
2. *Database Access*: crear un usuario con contraseña.
3. *Network Access*: añadir `0.0.0.0/0` (Render no tiene IP fija).
4. *Connect → Drivers*: copiar la cadena y añadir el nombre de la BD:
   `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/eventos?retryWrites=true&w=majority`
5. Cargar los datos en Atlas desde el ordenador poniendo esa cadena como `URL_BD`
   en el `.env` y ejecutando `node db_seed.js`.

### Render
1. Subir el proyecto a GitHub (el `.gitignore` excluye `node_modules` y `.env`).
2. Render → *New → Web Service* → conectar el repositorio.
3. Build command: `npm install` · Start command: `npm start`.
4. *Environment*: añadir la variable `URL_BD` con la cadena de Atlas.
   (`PORT` la pone Render automáticamente.)
5. Probar: `https://xxxxx.onrender.com/recintos`

## Endpoints

| Método | Ruta | OK | Error |
|---|---|---|---|
| GET | /recintos | 200 | 500 |
| GET | /recintos/:id | 200 | 404 |
| GET | /recintos/localidad/:nombre | 200 | 404 |
| POST | /recintos | 201 | 500 |
| DELETE | /recintos/:id | 200 | 404 |
| GET | /eventos | 200 | 500 |
| GET | /eventos/:id | 200 | 404 |
| GET | /eventos/localidad/:nombre | 200 | 404 |
| POST | /eventos | 201 | 500 |
| PUT | /eventos/:id | 200 | 404 |
| DELETE | /eventos/:id | 200 | 404 |
| GET | /eventos/entradas/:idEvento/:tipoEntrada | 200 | 404 |
| PUT | /eventos/entradas/:idEvento/:tipoEntrada/:cantidad | 200 | 404 |

Todas las respuestas incluyen `ok` y, según el caso, `resultado` o `error`.
