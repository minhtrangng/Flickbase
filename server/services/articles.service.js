const { Article } = require('../models/article');
const httpStatus = require('http-status');
const { ApiError } = require('../middleware/apiError');

// Create new article
const addArticle = async(body) => {
    try{
        const article = new Article({
            // Sometime, it can be the case that the data has the type of number
            // but it is stored as a string => use parseInt() to make sure
            // it is stored as a number
            ...body,
            score: parseInt(body.score)
        })
        await article.save();
        return article;
    }
    catch(err){
        throw err;
    }
}

// Get article by ID (with token)
const getArticle = async(_id, user) => {
    try{
        const article = await Article.findById(_id);
        if(!article){
            throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
        }
        if(user.role === 'user' && article.status === 'draft'){
            throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, you are not allowed');
        }
        return article;
    }
    catch(err){
        throw err;
    }
}

// Get article by ID (without token)
const getUsersArticle = async(_id) => {
    try{
        const article = await Article.findById(_id);
        if(!article){
            throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
        }

        if(article.status === 'draft'){
            throw new ApiError(httpStatus.NOT_FOUND, 'Sorry, you are not allowed');
        }
        return article;
    }
    catch(err){
        throw err;
    }
}

// Update article by ID
const updateArticle = async(_id, body) => {
    try{
        const article = await Article.findOneAndUpdate(
            {_id},
            { "$set": body},
            { new: true }
        );
        if(!article){
            throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
        }
        return article;
    }
    catch(err){
        throw err;
    }
}

// Delete article by ID
const deleteArticle = async(_id) => {
    try{
        const article = await Article.findByIdAndRemove(_id);
        if(!article){
            throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
        }
        return article;
        
    }
    catch(err){
        throw err;
    }
}

// Get all articles (depending on the limit)
const allArticles = async(request) => {
    const sortBy = request.query.sortby || "_id";
    const order = request.query.order || "desc";
    const limit = request.query.limit || 2;
    try{
        const articles = await Article
        .find({status:'public'})
        .sort([
            [sortBy,order]
        ])
        .limit(parseInt(limit));
        return articles;
    }
    catch(err){
        throw err;
    }
}

// Get more articles
const moreArticles = async(request) => {
    const sortBy = request.body.sortby || "_id";
    const order = request.body.order || "desc";
    const limit = request.body.limit || 2;
    // Skip a number of articles and return the rest (depending on the limit)
    const skip = request.body.skip || 0;

    try{
        const articles = await Article
        .find({status:'public'})
        .sort([
            [sortBy,order]
        ])
        .skip(skip)
        .limit(parseInt(limit));
        return articles;
    }
    catch(err){
        throw err;
    }
}


const paginateAdminArticles = async(request) => {
    try{
        let aggregateQuery = Article.aggregate();
        if(request.body.keywords && request.body.keywords != ''){
            const regEx = new RegExp(`${request.body.keywords}`, 'gi') // 'gi' is the flag
            aggregateQuery = Article.aggregate([
                { $match: {title: { $regex: regEx}}}
            ])
        }
        else{
            aggregateQuery = Article.aggregate();
        }
        const limit = request.body.limit ? request.body.limit : 5;
        const options = {
            page: request.body.page,
            limit,
            sort: {_id: 'desc'}
        }
        const articles = await Article.aggregatePaginate(aggregateQuery, options);
        return articles;
    }
    catch(err){
        throw err;
    }
}


module.exports = {
    addArticle,
    getArticle,
    getUsersArticle,
    updateArticle,
    deleteArticle,
    allArticles,
    moreArticles,
    paginateAdminArticles
}