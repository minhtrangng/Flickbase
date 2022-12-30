const { check, validationResult } = require('express-validator');
const { NOT_EXTENDED } = require('http-status');
const httpStatus = require('http-status');

const addArticleValidator = [
    check('title')
        .trim().not().isEmpty().withMessage('You need to add a title').bail()
        .isLength({min: 3}).withMessage('Minimum 3 required').bail(),

    check('director')
        .trim().not().isEmpty().withMessage('You need to add a director').bail()
        .not().isBoolean().withMessage('You cannot add a boolen here').bail()
        .isLength({min: 3, max: 100}).withMessage('Too long').bail(),
    // This callback function is important, because it will display the error
    // message is there is any error Or go to next()
    (request, response, next) => {
        const errors = validationResult(request)
        if(!errors.isEmpty()){
            return response.status(httpStatus.BAD_REQUEST).json({
                errors: errors.array()
            })
        }
        next();

    }
]

module.exports = {
    addArticleValidator
}