const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();
// Importing the library for paginating
const aggregatPaginate = require('mongoose-aggregate-paginate-v2');

const articleSchema =  mongoose.Schema({
    title: {
        type: String,
        maxLength: 100,
        required: [true, 'You need a title']
    },
    content: {
        type: String,
        required: [true, 'You need some content']
    },
    excerpt: {
        type: String,
        required: [true, 'Please add an excerpt'],
        maxLength: 500,
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    actors: {
        type: [String],
        required: true,
        validate: {
            validator: function(array){
                return array.length >= 2
            },
            message: "You muss add at least three"
        }
    },
    // If the status is public => all user can see it
    status: {
        type: String,
        required: true,
        enum: ['draft', 'public'],
        default: 'draft',
        index: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

articleSchema.plugin(aggregatPaginate)



const Article = mongoose.model('Article', articleSchema);
module.exports = { Article }; 