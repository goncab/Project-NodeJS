'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'desencripatacion-de-token';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix() // poniendo el token expirado....
    };

    return jwt.encode(payload, secret);
};