// import user model
const { User } = require('../models/user');
const { ApiError } = require('../middleware/apiError');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const findUserByEmail = async(email) => {
    return await User.findOne({email});
} 

const findUserById = async(_id) => {
    return await User.findById({_id});
}

const updateUserProfile = async(request) => {
    try{
        const user = await User.findOneAndUpdate(
            {_id : request.user._id},
            {
                $set: {
                    firstname: request.body.firstname,
                    lastname: request.body.lastname,
                    age: request.body.age
                }
            },
            { new: true }
        )
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        }
        return user;
    }
    catch(err){
        throw err
    }
}

const updateEmail = async(request) => {
    try{
        if(await User.emailCheck(request.body.newemail)){
            throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, email has been taken');
        }
        const user = await User.findOneAndUpdate(
            {_id : request.user._id, 
            email: request.user.email
            },
            {
                $set: {
                    email: request.body.newemail,
                    verified: false
                }
            },
            { new: true }
        )
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        }
        return user;
    }
    catch(err) {
        throw err;
    }
}

const validateToken = (token) => {
    return jwt.verify(token, process.env.DB_SECRET);
}

module.exports = {
    findUserByEmail,
    findUserById,
    updateUserProfile,
    updateEmail,
    validateToken
}