const { NOT_EXTENDED } = require('http-status');
const httpStatus = require('http-status');
const { articlesService } = require('../services');

const articlesController = {
    // Create new article
    async createArticle(request, response, next) {
        try{
            const article = await articlesService.addArticle(request.body);
            response.json(article);
        }
        catch(err){
            next(err);
        }
    },
    // Get article by ID (with token)
    async getArticleById(request, response, next) {
        try{
            const _id = request.params.id;
            const article = await articlesService.getArticle(_id, request.user);
            response.json(article);
        }
        catch(err){
            next(err);
        }
    },
    // Get article by ID (without token)
    async getUserArticleById(request, response, next) {
        try{
            const _id = request.params.id;
            const article = await articlesService.getUsersArticle(_id);
            response.json(article);
        }
        catch(err){
            next(err);
        }
    },
    // Update article by ID
    async updateArticleById(request, response, next) {
        try{
            const _id = request.params.id;
            const article = await articlesService.updateArticle(_id, request.body);
            response.json(article);
        }
        catch(err){
            next(err);
        }
    },
    // Delete article by ID
    async deleteById(request, response, next) {
        try{
            const _id = request.params.id;
            await articlesService.deleteArticle(_id);
            response.status(httpStatus.OK).json({action:'deleted'});
        }
        catch(err){
            next(err);
        }
    },
    // Get all articles
    async getAllArticles(request, response, next) {
        try{
            const article = await articlesService.allArticles(request);
            response.json(article);
        }
        catch(err){
            next(err);
        }
    },
    // Get more articles
    async getMoreArticles(request, response, next) {
        try{
            const article = await articlesService.moreArticles(request);
            response.json(article);
        }
        catch(err){
            next(err);
        }
    },
    async adminPaginate(request, response, next) {
        try{
            const articles = await articlesService.paginateAdminArticles(request);
            response.json(articles);
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = articlesController;