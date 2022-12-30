
const httpStatus = require('http-status');
const { ApiError } = require('../middleware/apiError');

const { userService, authService, emailService } = require('../services');
const { genAuthToken } = require('../services/auth.service');

const userController = {
    // GET USER PROFILE
    async profile(request, response, next){
        try{
            const user = await userService.findUserById(request.user._id);
            if(!user){
                throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
            }
            
            response.json(response.locals.permission.filter(user._doc));
        }
        catch(err){
            next(err);
        }
    },
    // UPDATE PROFILE
    async updateProfile(request, response, next){
        try{
            const user = await userService.updateUserProfile(request);
            response.json(response.locals.permission.filter(user._doc));
        }
        catch(err){
            next(err);
        }
    },
    //  UPDATE USER EMAIL
    async updateUserEmail(request, response, next){
        try{
            const user = await userService.updateEmail(request);
            const token = await authService.genAuthToken(user);

            // The new email should be verified, that means an
            // new verification email muss be sent out
            emailService.registerEmail(user.email, user);

            response.cookie('x-access-token', token)
            .send({
                user: response.locals.permission.filter(user._doc),
                token
            })
        }
        catch(err) {
            next(err);
        }
    },
    async verifyAccount(request, response, next){
        try{
            const token = userService.validateToken(request.query.validation);
            const user = await userService.findUserById(token.sub);

            if(!user){
                throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
            }
            if(user.verified){
                throw new ApiError(httpStatus.NOT_FOUND, 'User has already verified');
            }

            user.verified = true;
            user.save();
            response.status(httpStatus.CREATED).send({
                email: user.email,
                verified: true
            })
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = userController;