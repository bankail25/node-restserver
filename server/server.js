require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

//Habilitar la carpeta Public
const path = require ('path');

const app = express();

const bodyParser = require('body-parser');

//Habilitar la carpeta Public
app.use(express.static(path.resolve (__dirname, '../public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Configuración global de rutas
app.use(require('./routes/index.js'));

mongoose.connect(process.env.URLDB,
    {useNewUrlParser: true, useCreateIndex: true}, 
    (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});