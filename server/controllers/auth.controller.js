

const { authService, emailService } = require("../services");
const httpStatus = require('http-status');
const { sign } = require("jsonwebtoken");




const authController = {
    // REGISTER
    async register(request, response, next){
        try{
            const {email, password} = request.body;
            const user = await authService.createUser(email, password);

            // Create Token
            const token = await authService.genAuthToken(user);


            // Send verification email
            await emailService.registerEmail(request.body.email, user);

            // Cookie
            response.cookie('x-accesss-token', token)
            .status(httpStatus.CREATED).send({
                user, 
                token
            });
        }
        catch(err){
            //console.log(err.message)
            // response.status(httpStatus.BAD_REQUEST).send(err.message);
            next(err);
        }
    },

    // SIGN IN
    async signin(request, response, next){
        try{
            const {email, password} = request.body;
            const user = await authService.signInWithEmailAndPassword(email, password);
            const token = await authService.genAuthToken(user);

            response.cookie('x-access-token', token)
            .status(httpStatus.CREATED).send({
                user, 
                token
            });
        }
        catch(err){
            // response.status(httpStatus.BAD_REQUEST).send(err.message);
            next(err);
        }
    },
    // CHECK IF THE USER IS AUTHENTICATED
    async isauth(request, response, next){
        response.json(request.user);
    },
    // TEST THE ROLE
    async testrole(request, responson, next){
        responson.json({ok: 'yes'});
    }
}

module.exports = authController;