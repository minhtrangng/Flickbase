const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
        }}
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    firstname: {
        type: String,
        maxLength: 100, 
        trim: true
    },
    lastname: {
        type: String,
        maxLength: 100, 
        trim: true
    },
    age: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next){
    let user = this;
    if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    next();
})

userSchema.statics.emailCheck = async function(email){
    const user = await this.findOne({email});
    // if the user does exits => return true. Otherwise, return false.
    return !!user;
}

// GENERATE TOKEN
userSchema.methods.generateToken = function(){
    let user = this;
    const userObj = { sub: user._id.toHexString(), email: user.email};
    const token = jwt.sign(userObj, process.env.DB_SECRET, {expiresIn: '1d'});
    return token;
}

// COMPARE PASSWORD
userSchema.methods.comparePassword = async function(candidatePwd){
    // candidate password is unhashed password
    const user = this;
    const match = await bcrypt.compare(candidatePwd, user.password);
    return match;
}

// GENERATE REGISTER TOKEN
userSchema.methods.generateRegisterToken = function(){
    let user = this;
    const userObj = { sub: user._id.toHexString()};
    const token = jwt.sign(userObj, process.env.DB_SECRET, {expiresIn: '10d'});
    return token;
}

const User = mongoose.model('User', userSchema);
module.exports = { User }; 