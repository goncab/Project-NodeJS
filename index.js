'use strict'

/*var mongoose = require('mongoose'); 
var port = 3000; // puerto por defecto de Node
var app = require('./app')//esto es un fichero

//Promesas de Mongoose los cuales son tipo callback

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo',{useMongoClient: true})//Url esquema como mongodb

//mongoose.connect('mongodb://zoo-WS:gio1994@ds018248.mlab.com:18248/zoo-ws')//Url esquema como mongodb
    .then(()=> {
        console.log('La conexion a mongo a sido exitosa');
        app.listen(port, () => {
            console.log('El servidor local de node y express esta corriendo');
        });
    })
    .catch(err => console.log(err));*/

    var mongoose = require('mongoose');
    var port = process.env.port || 3000;
    var app = require('./app');

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/zoo');mongoose.connect('mongodb://zoo-WS:gio1994@ds018248.mlab.com:18248/zoo-ws');
    app.listen(port);

    console.log('Backend is running')