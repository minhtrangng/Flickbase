const passport = require('passport');
const { ApiError } = require('./apiError');
const httpStatus = require('http-status');

const { roles } = require('../config/roles');

const verify = (request, response, resolve, reject, rights) => async(err, user) => {
    if(err || !user){
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Sorry, unauthorized!'));
    }
    request.user = user
    // {
    //     _id: user._id,
    //     email: user.email,
    //     role: user.role,
    //     verified: user.verified
    // };

    ///// Handle the access rights
    if(rights.length){
        const action = rights[0]; // createAny/readAny/...
        const resource = rights[1];
        const permission = roles.can(request.user.role)[action](resource);

        if(!permission.granted){
            return reject(new ApiError(httpStatus.FORBIDDEN, "Sorry, you don't have enough rights"));
        }
        // request.permission = permission;
        response.locals.permission = permission;
    }

    resolve();
}


const auth = (...rights) => async(request, response, next)=>{
    return new Promise((resolve, reject)=>{
        passport.authenticate('jwt', { session: false}, verify(request, response, resolve, reject, rights))(request, response, next)
    })
    .then(()=>next())
    .catch((err)=> next(err))
}

module.exports = auth;