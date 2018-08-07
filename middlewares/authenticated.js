'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'desencripatacion-de-token';

exports.ensureAuth = function(req, res, next){
    var authorizationHeader = req.headers.authorization;

    if(!authorizationHeader){
        return res.status(403).send({
            message: 'La peticion debe de contener un header de autenticacion.'
        });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        var expiredDate = payload.exp;
        var actualDate = moment().unix();
        if(expiredDate <= moment().unix()){//se jala la fecha del servidor
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        }
        console.log(payload)
    } catch (exception) {
        //console.log(exception);
        return res.status(401).send({
            message: 'Token invalido'
        });

        // se esta guardando la session del usuario.
    }
    req.user = payload;
    next();
};