const { Article } = require('../models/article');
const { Category } = require('../models/category');
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
        const article = await Article.findById(_id).populate('category');
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
        // We add "populate" here to force the app to go to the DB, find the category with this ID and return the whole object with this ID,
        // not only the ID itself.
        // Why the objectID is returned? Because the declared type is 'objectID'
        const article = await Article.findById(_id).populate('category');
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
        .populate('category')
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
        .populate('category')
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
    // We want to also return the category but do not find "find()" as in other API call
    // Use 'lookup' in this case
    try{
        let aggQueryArray = [];
        // let aggregateQuery = Article.aggregate();
        if(request.body.keywords && request.body.keywords != ''){
            const regEx = new RegExp(`${request.body.keywords}`, 'gi') // 'gi' is the flag
            // aggregateQuery = Article.aggregate([
            //     { $match: {title: { $regex: regEx}}}
            // ])
            aggQueryArray.push(
                { $match: { title:{ $regex:re}}}
            )
        }
        
        // else{
        //     aggregateQuery = Article.aggregate();
        // }

        aggQueryArray.push(
            { $lookup:
                {
                    from:"categories",
                    localField:"category",
                    foreignField:"_id",
                    as:"category"
                }
            },
            { $unwind:"$category"}
        )
     

        let aggQuery = Article.aggregate(aggQueryArray);

        const limit = request.body.limit ? request.body.limit : 5;
        const options = {
            page: request.body.page,
            limit,
            sort: {_id: 'desc'}
        }
        const articles = await Article.aggregatePaginate(aggQuery, options);
        return articles;
    }
    catch(err){
        throw err;
    }
}

// ADD NEW CATEGORY
const addCategory = async(request) => {
    try{
        // validation

        const category = new Category({
            ...request
        })
        await category.save();
        return category;
    }
    catch(err){
        throw err;
    }
}

// GET ALL CATEGORIES
const findAllCategories = async(request) => {
    try{
        // validation

        const categories = await Category.find();
        return categories;
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
    paginateAdminArticles,
    addCategory,
    findAllCategories
}