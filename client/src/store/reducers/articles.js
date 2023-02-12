import { createSlice } from  '@reduxjs/toolkit';

import {
    addArticle,
    getPaginateArticles,
    changeStatusArticle,
    homeLoadMore,
    getArticleContent,
    getExportArticle,
    getCategories
} from '../actions/articles';

export const articlesSlice = createSlice({
    name: 'articles',
    initialState: {
        homeSort: {
            sortby: "_id",
            order: "desc",
            limit: 4,
            skip: 0
        },
        loading: false,
        articles: [],
        current: null,
        categories: []
    },
    reducers: {
        updateCategories: (state, action) => {
            state.categories = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        // ADD ARTICLE
        .addCase(addArticle.pending, (state)=> {state.loading=true})
        .addCase(addArticle.fulfilled, (state, action)=> {
            state.loading=false
            state.lastAdded = action.payload
        })
        .addCase(addArticle.rejected, (state)=> {state.loading=false})

        // PAGINATING
        .addCase(getPaginateArticles.pending, (state) => {state.loading=true})
        .addCase(getPaginateArticles.fulfilled, (state, action)=> {
            state.loading=false
            state.adminArticles = action.payload
        })
        .addCase(getPaginateArticles.rejected, (state)=> {state.loading=false})

        // GET ALL ARTICLE FOR EXPORTING
        .addCase(getExportArticle.pending, (state) => {state.loading=true})
        .addCase(getExportArticle.fulfilled, (state, action)=> {
            state.loading=false
            state.exportingArticles = action.payload.docs
        })
        .addCase(getExportArticle.rejected, (state)=> {state.loading=false})

        // CHANGE STATUS
        .addCase(changeStatusArticle.fulfilled, (state, action)=> {
            state.adminArticles.docs = action.payload
        })

        // HOME LOAD MORE ARTICLES
        .addCase(homeLoadMore.fulfilled, (state, action)=> {
            state.homeSort.skip = action.payload.sort.skip
            state.articles = action.payload.newState
        })

        // GET ARTICLE CONTENT
        .addCase( getArticleContent.pending, (state) => {state.loading=true})
        .addCase( getArticleContent.fulfilled, (state, action)=> {
            state.loading=false
            state.current = action.payload
        })
        .addCase( getArticleContent.rejected, (state)=> {state.loading=false})

        // GET CATEGORIES
        .addCase( getCategories.pending, (state) => {state.loading=true})
        .addCase( getCategories.fulfilled, (state, action)=> {
            state.categories= action.payload
        })
        .addCase( getCategories.rejected, (state)=> {state.loading=false})
    }
})

export const { updateCategories } = articlesSlice.actions
export default articlesSlice.reducer;

