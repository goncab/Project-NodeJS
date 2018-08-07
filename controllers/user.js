'use strict'
//modulos que son propias de node

var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var jwt = require('../services/jwt');


function prueba(req, res){
    res.status(200).send({
        message: 'Probando el controlador de usuario'
    })
}

function register(req, res){
        var user = new User();
        var params = req.body;

        if(params.name && params.lastname && params.email && params.password){
            user.name = params.name;
            user.lastname = params.lastname;
            user.email = params.email;
            user.role = 'ROLE_USER';
            user.image = null;

            User.findOne({email: user.email.toLowerCase()}, (err, issetUser) =>{
                if(err){
                    res.status(500).send({
                        message: 'Error en el servidor'
                    });
                }else{
                    if(!issetUser){
                        bcrypt.hash(params.password, null, null, (err, hash) =>{
                            user.password = hash;

                            user.save((err, userStored) => {
                                if (err){
                                    res.status(500).send({
                                        message: 'Erro al guardar el usuario'
                                    });            
                                }else {
                                    if(!userStored){
                                        res.status(404).send({
                                            message:'No se ha registrado el usuario'
                                        });
                                    }else{
                                        res.status(200).send({
                                            user: userStored
                                        });
                                    }
                                }
                            })
                        });
                    }else{
                        res.status(200).send({
                            message: 'El usuario no se pudo registrar'
                        });
                    }
                }
            });
        }
}


function login(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, issetUser) => {
        if (err) {
            res.status(500).send({
                message: 'Error al buscar su usuario'
            });
        } else {
            if (issetUser) {
                bcrypt.compare(password, issetUser.password, (err, check) => {
                    if (check) {
                        if (params.gettoken) {
                            res.status(200).send({
                                token: jwt.createToken(issetUser)
                            });
                        } else {
                            res.status(200).send({
                                issetUser
                            });
                        }
                    } else {
                        res.status(200).send({
                            message: 'El usuario no se ha logueado correctamente'
                        });
                    }
                })
            } else {
                res.status(404).send({
                    message: 'El usuario no ha podido loguearse'
                });
            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var updateData = req.body;
    delete updateData.password;

    if(userId != req.user.sub){
        return res.status(401).send({
            message: 'No tiene permiso para modificar este usuario.'
        });
    }

    User.findByIdAndUpdate(userId, updateData, {new: true},(err, userUpdated)=>{
        if(err){
            res.status(500).send({
                message: 'Error al actualizar el usuario.'
            });
        }
        else{
            if(!userUpdated){
                res.status(404).send({
                    message: 'No se ha podido actulizar el usuario'
                });
            }
            else{
                res.status(200).send({
                    user: userUpdated
                })
            }
        }
    })
}

function deleteUser(req, res){
    var userId = req.params.id;

    user.findByIdAndRemove(userId, (err, userRemove)=>{
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }
        else{
            if(!userRemove){
                res.status(404).send({
                    message: 'No se ha borrado el usuario'
                });
            }
            else{
                res.status(200).send({
                    message:  'El usuario ${userRemoved.email} se ha eliminado exitosamente' // cambiar a tilde al reves
                });
            }
        }
    });
}

function setAdminRole(req, res){
    var userId = req.params.id;
    User.findByIdAndUpdate(userId, {role: 'ROLE_ADMIN'}, {new: true}, (err, userUpdated)=>{
        if(err){
            res.status(500).send({
                message: 'Usuario no encontrado'
            });
        }
        else{
            if(!userUpdated){
                res.status(200).send({
                    message: 'No se ha podido actualizar el usuario'
                });
            }
            else{
                res.status(200).send({

                });
            }
        }
    });
}

function changePassword(req, res) {
    var params = req.body;
    if (params.email && params.password) {
        var userEmail = params.email.toLowerCase();
        var password = params.password;
        User.findOne({email: userEmail}, (err, issetUser) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en el servidor'
                });
            } else {
                if (issetUser) {
                    bcrypt.hash(password, null, null, (err, hash) => {
                        var newPassword = hash;
                        User.findByIdAndUpdate(issetUser.id, {password: newPassword}, {new: true}, (err, userUpdated) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Error en el servidor'
                                });
                            } else {
                                if (!userUpdated) {
                                    res.status(404).send({
                                        message: 'No se ha modificado el password'
                                    });
                                } else {
                                    res.status(200).send({
                                        message: 'password modificado exitosamente'
                                    });
                                }
                            }
                        })
                    })
                } else {
                    res.status(200).send({
                        message: 'El no existe registrese primero'
                    });
                }
            }
        })
    } else {
        res.status(200).send({
            message: 'Parametros erroneos'
        });
    }
}

module.exports ={
    prueba,
    register,
    login,
    updateUser,
    deleteUser,
    setAdminRole,
    changePassword
}