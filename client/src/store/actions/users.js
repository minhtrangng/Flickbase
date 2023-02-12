import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { errorGlobal, successGlobal } from '../reducers/notifications';

import { getAuthHeader, removeTokenCookie } from '../../utils/tools';

import { setVerify } from '../reducers/users';


export const registerUser = createAsyncThunk(
    'users/registeruser',
    async({email, password}, {dispatch}) => {
        try{
            const request = await axios.post(`/api/auth/register`, {
                email: email,
                password: password
            });
            dispatch(successGlobal('Welcome! Check your email to validate account.'))
            return ({data: request.data.user, auth: true})
        }
        catch(error){
            dispatch(errorGlobal(error.response.data.message))
            throw error;
        }
    }
)

export const signinUser = createAsyncThunk(
    'users/signinUser',
    async({email, password}, {dispatch}) => {
        try{
            const request = await axios.post(`/api/auth/signin`, {
                email: email,
                password: password
            });
            dispatch(successGlobal('Welcome!'))
            return ({data: request.data.user, auth: true})
        }
        catch(error){
            dispatch(errorGlobal(error.response.data.message))
            throw error;
        }
    }
)

// export const chooseGoogleUser = createAsyncThunk(
//     'users/chooseGoogleUser',
//     async({dispatch}) => {
//         try{
//             const request =  await axios.get(`/api/auth/google`);
//             dispatch(successGlobal('Welcome!'))
//             console.log(request.statusText())
//             return request.statusText();
//         }
//         catch(error) {
//             dispatch(errorGlobal(error.response.data.message))
//         }
//     }
// )

export const isAuth = createAsyncThunk(
    'users/isauth',
    async() => {
        try{
            const request = await axios.get('/api/auth/isauth', getAuthHeader());
            return { data: request.data, auth: true};
            
        }
        catch(error){
            return { data: {}, auth: false}
        }
    }
)

export const signOut = createAsyncThunk(
    'users/signout',
    async() => {
        // if there is no try and catch => it will be reach the fulfill
        removeTokenCookie();
    }
)

export const updateUserProfile = createAsyncThunk(
    'users/updateuserprofile',
    async(data, {dispatch}) => {
        try{
            const profile = await axios.patch(`/api/users/profile`, data, getAuthHeader());
            dispatch(successGlobal('Profile updated'))
            return{
                firstname: profile.data.firstname,
                lastname: profile.data.lastname,
                age: profile.data.age
            }
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message));
            throw err;
        }
    }
)

export const changeEmail = createAsyncThunk(
    'users/changeemail',
    async(data, {dispatch}) => {
        try{
            const request = await axios.patch(`/api/users/email`, {
                email: data.email,
                newemail: data.newemail
            }, getAuthHeader())
            dispatch(successGlobal('E-mail has been successfully updated'))
            return {
                email:request.data.user.email,
                verified: false
            }
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message));
            throw err;
        }
    }
)

// VERIFY
export const accountVerify = createAsyncThunk(
    'users/verifyaccount',
    async(token, {dispatch, getState}) => {
        try{
            const user = getState().users.auth
            await axios.get(`/api/users/verify?validation=${token}`)
            if(user){
                dispatch(setVerify())
            }
            dispatch(successGlobal('E-mail has been successfully verified'))
        }
        catch(err){
            dispatch(errorGlobal(err.response.data.message));
            throw err;
        }
    }
)