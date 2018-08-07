'use strict'

exports.isAmin = function(req, res, next){
    var role = req.user.role;
    if(role != 'ROLE_ADMIN'){
        return res.status(403).send({
            message: 'No cuenta con el permiso para acceder a esta area'
        });
    }

    next();
};