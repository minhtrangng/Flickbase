import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { errorGlobal, successGlobal } from '../reducers/notifications';

import { updateCategories } from '../reducers/articles';

import { getAuthHeader, removeTokenCookie } from '../../utils/tools';


axios.defaults.headers.post['Content-Type'] = 'application/json';

// ADD NEW ARTICLES
export const addArticle = createAsyncThunk(
    'articles/addarticle',
    async(article, {dispatch}) => {
        try{
            const request = await axios.post(`/api/articles/`, article, getAuthHeader());
            dispatch(successGlobal('New article has been added!!'))
            return request.data;
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// GET ADMIN ARTICLES
export const getAdminArticle = createAsyncThunk(
    'articles/getadminarticle',
    async(_id, {dispatch}) => {
        try{
            // console.log(_id);
            const request = await axios.get(`/api/articles/article/${_id}`, getAuthHeader());
            return request.data;
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// UPDATE ARTICLE
export const updateArticle = createAsyncThunk(
    'articles/updatearticle',
    async({values, articleID}, {dispatch}) => {
        try{
            const request = await axios.patch(`/api/articles/article/${articleID}`,values, getAuthHeader())
            dispatch(successGlobal('Article updated!!'))
            return true;
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// GET PAGINATE ARTICLES
export const getPaginateArticles = createAsyncThunk(
    'articles/getpaginatearticles',
    async({page=1, limit=5, keywords=''}, {dispatch}) => {
        try{
            const request = await axios.post(`/api/articles/admin/paginate`, {
                page,
                limit,
                keywords
            }, getAuthHeader());
            return request.data;
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// GET EXPORT ARTICLES
export const getExportArticle = createAsyncThunk(
    'articles/getexportarticles',
    async({page=1, limit=100, keywords=''}, {dispatch}) => {
        try{
            const request = await axios.post(`/api/articles/admin/paginate`, {
                page,
                limit,
                keywords
            }, getAuthHeader());

            // Data HIER exportieren
            // dispatch(exportData())

            return request.data;
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// CHANGE ARTICLE STATUS
export const changeStatusArticle = createAsyncThunk(
    'articles/changestatusarticle',
    async({newStatus, articleID}, {dispatch, getState}) => {
        try{
            const request = await axios.patch(`/api/articles/article/${articleID}`, {
                status: newStatus
            }, getAuthHeader());
            let article =  request.data;

            // previous state
            let state = getState().articles.adminArticles.docs;
            // find the position
            let position = state.findIndex( article => article._id === articleID);

            // we cannot mutate 'let state', we create copy
            const newState = [...state];
            newState[position] = article;
            dispatch(successGlobal('Status changed!!'));
            return newState

        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// REMOVE ARTICLE
export const removeArticle = createAsyncThunk(
    'articles/removearticle',
    async(articleID, {dispatch, getState}) => {
        try{
            await axios.delete(`/api/articles/article/${articleID}`, getAuthHeader());
            dispatch(successGlobal('The article has been removed!'));
            let page = getState().articles.adminArticles.page
            dispatch(getPaginateArticles({page}))
            return true;
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// LOAD MORE ARTICLES
export const homeLoadMore = createAsyncThunk(
    'articles/homeloadmorearticle',
    async(sort, {dispatch, getState}) => {
        try{
            // console.log(dispatch);
            const articles = await axios.post(`/api/articles/all`, sort);
            const state = getState().articles.articles;

            const prevState = [...state];
            const newState = [...prevState, ...articles.data];
            
            return { newState, sort }
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// GET ARTICLE CONTENT
export const getArticleContent = createAsyncThunk(
    'articles/getarticlecontent',
    async(articleID, {dispatch}) => {
        try{
            // console.log(articleID)
            const article = await axios.get(`/api/articles/users/article/${articleID}`)
            return article.data;
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// GET CATEGORY
export const getCategories = createAsyncThunk(
    'articles/getcategories',
    async(obj, {dispatch}) => {
        try{
            const request = await axios.get(`/api/articles/categories`, getAuthHeader())
            return request.data
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)

// ADD CATEGORY
export const addCategories = createAsyncThunk(
    'articles/addcategories',
    async(data, {dispatch, getState}) => {
        try{
            const category = await axios.post(`/api/articles/categories`, data, getAuthHeader());
            const state = getState().articles.categories;
            
            const prevState = [...state];
            const newState = [...prevState, category.data]

            dispatch(updateCategories(newState))
            dispatch(successGlobal('Category created!!'));
            return newState;
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message))
            throw err;
        }
    }
)