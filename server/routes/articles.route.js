const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles.controller');
// Importing the article validator
const { addArticleValidator } = require('../middleware/validation')

const auth = require('../middleware/auth');
const { articlesService } = require('../services');

router.post('/', auth('createAny', 'articles'), addArticleValidator, articlesController.createArticle);

router.route('/article/:id')
// Get article by ID
.get(auth('readAny', 'articles'), articlesController.getArticleById)
// Update article by ID
.patch(auth('updateAny', 'articles'), articlesController.updateArticleById)
// Delete article by ID
.delete(auth('deleteAny', 'articles'), articlesController.deleteById)

// Get article by ID (without token needed)
router.route('/users/article/:id')
.get(articlesController.getUserArticleById);


router.route('/all')
// Get all articles (depending on the limit)
.get(articlesController.getAllArticles)
// Load more article (depending on the limit)
.post(articlesController.getMoreArticles)

// Paginating, only when the user is an admin
router.post('/admin/paginate', auth('readAny', 'articles'), articlesController.adminPaginate)


module.exports = router;