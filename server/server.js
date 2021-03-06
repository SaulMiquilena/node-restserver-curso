require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Configuración Global de Rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true
}, (error, respuesta) => {
    if (error) throw error;

    console.log('Base de Datos ONLINE!!!');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${ process.env.PORT }`);
});