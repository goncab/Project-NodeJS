//Este es como un main controler
//npm install --save express instalar el framework
//npm install --save body-parser

'use strict'// indica que se trabajara con la ultima actulizacion

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

var animalRoutes = require('./routes/animal');
var userRoutes = require('./routes/user');

app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json({limit: '50mb'}));
app.use(bodyParse.json());

app.use('/api', animalRoutes);
app.use('/api', userRoutes);


app.get('/test',(req, res)=>{
    res.status(200).send({
        message: 'mi primer 2'
    })
})

module.exports = app;
