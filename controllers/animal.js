'use strict'

var Animal = require('../models/animals');

function getAnimals(req, res){
    res.status(200).send({
        message: 'Provando el  controlador de animales'
    })
}

module.exports = {
    getAnimals
}