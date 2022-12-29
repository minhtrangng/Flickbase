const httpStatus =  require('http-status');

// Importing error middleware
const { ApiError } = require('../middleware/apiError');


// import user model
const { User } = require('../models/user');

// import services
const userService = require('./user.service');

const createUser = async(email, password) => {
    try{
        // Check if the email already exists
        if(await User.emailCheck(email)){
            // if the user already exists => throw error
            // throw new Error('Sorry, email has been registered!')

            throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry, email has been registered!');
        }
        // otherwise, continue
        
        const user = new User({
            email,
            password
        });
        // Add user to DB (hash the password)
        await user.save();
        return user;
    }
    catch(err){
        throw err;
    }
}

const genAuthToken = (user) =>{
    // token will be generated inside the user model
    const token = user.generateToken();
    return token;
}

const signInWithEmailAndPassword = async(email, password) => {
    try{
        const user = await userService.findUserByEmail(email);
        if(!user){
            throw new ApiError(httpStatus.BAD_REQUEST, 'The user does not exists!');
        }
        if(!(await user.comparePassword(password))){
            throw new ApiError(httpStatus.BAD_REQUEST, 'The password is incorrect!');
        }
        return user;
    }
    catch(err){
        throw err;
    }
}


module.exports = {
    createUser,
    genAuthToken,
    signInWithEmailAndPassword
}