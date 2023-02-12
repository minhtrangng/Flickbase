

const { authService, emailService } = require("../services");
const httpStatus = require('http-status');
const { sign } = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');



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

    // SIGNIN WITH GOOGLE
    // async googleSignIn(request, response, next){
    //     try{
    //         if(request.user){
    //             console.log(request.user)
    //             response.status(200).json({
    //                 success: true,
    //                 message: "successful",
    //                 user: request.user,
    //                 cookies: request.cookies
    //             })
                
    //         }
    //     }
    //     catch(err) {
    //         next(err)
    //     }
    // },

    // CHECK IF THE USER IS AUTHENTICATED
    async isauth(request, response, next){
        response.json(request.user);
    },
    // TEST THE ROLE
    async testrole(request, response, next){
        response.json({ok: 'yes'});
    },

    // LOGIN WITH GOOLE
    async loginWithGoogle(request, response, next){
        try{
            const { token } = request.body;
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            // Read the name and the email address from the ticket
            const { name, email } = ticket.getPayload();
            // Save the user information in the DB
            const user = await authService.logInWithGoggle(name, email);
            
            // Cookie
            response.cookie('x-accesss-token', token)
            .status(httpStatus.CREATED).send({
                user, 
                token
            }); 
        }
        catch(err) {
            next(err)
        }
    }
}

module.exports = authController;