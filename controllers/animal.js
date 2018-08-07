'use strict'
//modulos que son propias de node

var fs = require('fs');
var path = require('path');
var constants = require('../models/animals').constants;


var Animal = require('../models/animals');


function getAnimals(req, res){
   Animal.find({}).exec((err, animals)=>{
       if(err){
           res.status(500).send({
               message: constants.EMPTY_ANIMALS
           });
       }else{
           if(!animals){
               res.status(404).send({
                   message: constants.ERROR_IN_REQUEST
               });
           }else{
               res.status(200).send({
                   animal: animalStored
               })
           }
       }
   })
}



function getAnimal(req, res){
    var animalId = req.params.id;

    Animal.findById(animalId).exec((err, animal) =>{
        if(err){
            res.status(500).send({
                message:'Error en la peticion'
            });
        }else{
            if(!animal){
                res.status(404).send({
                    message:'No existe'
                });
            }else{
                res.status(200).send({
                    animal
                });
            }
        }
    });
}

function saveAnimal(req, res) {
        var animal = new Animal();
        var params = req.body;
        if(params.name){
            animal.name = params.name;
            animal.description = params.description;
            animal.origen.country = params.country;
            animal.origen.state = params.state;
            animal.image = null;

            animal.save((err, animalStored) => {
                if(err){
                    res.status(500).send({
                        message: 'Error en el servidor'
                    });
                } else{
                    if (!animalStored){
                        res.status(404).send({
                            message: 'No se ha guardado el animal'
                        });
                    }else{
                        res.status(200).send({
                            animal: animalStored
                        });
                    }
                }
            });
        }else{
            res.status(200).send({
                message: 'El nombre del animal es obligatorio'
            });
        }
}

function updateAnimal(req, res){
    var animalId = req.params.id;
    var update =req.body;

    Animal.findByIdAndUpdate(animalId, update, {new: true}, (err, animalUpdated) =>{
        if (err) {
            res. status(500).send({
                message: 'error en la peticion'
            });
        }else{
            if(!animalUpdated){
            res.status(404).send({
                message: 'Nose ha actualizado el animal'
            });
        }else{
            res.status(200).send({
                animal: animalUpdated
            });

        }
    }
    });
}

function deleteAnimal(req, res){
    var animalId = req.params.id;


    Animal.findByIdAndRemove(animalId,(err, animaldelete) =>{
        if (err) {
            res. status(500).send({
                message: 'error en la peticion'
            });
        }else{
            if(!animaldelete){
            res.status(404).send({
                message: 'Nose ha eleminado el animal'
            });
        }else{
            res.status(200).send({
                animal: animaldelete
            });
        }
    }
    });
}

function uploadImage(red, res){
    var animalId = req.params.id;
    var file_name = 'No imagen';

    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split1[1];

        if(file_ext == 'png'|| file_ext == 'jpg'){
            Animal.findByIdAndUpdate(animalId, {image: file_name}, {new: true}, (err, animalUpdated) =>{
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar el animal'
                    });
                }else{
                    if (!animalUpdated){
                        res.status(404).send({
                            message: 'Nose ha actualizado el animal'
                        });                   
                }else{
                    res.status(200).send({
                        animal: animalUpdated,
                        image: file_name
                    });
                }
            }
            });
        }else{
            fs.unlink(file_path, (err) => {
                if(err){
                    res.status(200).send({
                         message: 'Extension del archivo no valida y no encontrada'
                    });
                }else{
                    res.status(200).send({
                        message: 'Extension invalida'
                    });
                }
            });
        }
    }else{
        res.status(200).send({
            message: 'No se ha subido ningun archivo'
        });
    }
}

module.exports = {
    getAnimals,
    saveAnimal,
    getAnimal,
    updateAnimal,
    deleteAnimal,
    uploadImage
}