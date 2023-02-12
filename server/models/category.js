const moongose = require('mongoose');
require('dotenv').config();

const categoriesSchema = moongose.Schema({
     // This schema contains the name of the category and the create date
     name: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        maxLength: 100,
        required: [true, 'You need a category name']
     },
     date: {
        type: Date,
        default: Date.now
     }
});

const Category = moongose.model('Category', categoriesSchema);
module.exports = { Category }