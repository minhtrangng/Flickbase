
import { createSlice } from  '@reduxjs/toolkit';

import { isAuth, 
        registerUser, 
        signinUser, 
        signOut,
        updateUserProfile,
        changeEmail 
} from '../actions/users';

let DEFAULT_USER_STATE = {
    loading: false,
    data: {
        _id: null,
        email: null,
        firstname: null,
        lastname: null,
        age: null,
        role: null,
        verified: null
    },
    auth: null
}

export const userSlice = createSlice({
    name: 'users',
    initialState: DEFAULT_USER_STATE,
    reducers: {
        setVerify:(state) => {
            state.data.verified = true;
        }
    },
    extraReducers:(builder) => {
        builder
        // REGSTER
        .addCase(registerUser.pending, (state) => {state.loading = true})
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload.data
            state.auth = action.payload.auth
        } )
        .addCase(registerUser.rejected, (state) => {state.loading = false})

        // SIGN IN
        .addCase(signinUser.pending, (state) => {state.loading=true})
        .addCase(signinUser.fulfilled, (state, action) => {
            state.loading=false;
            state.data = action.payload.data
            state.auth = action.payload.auth 
        })
        .addCase(signinUser.rejected, (state) => {state.loading = false})

        // IS AUTH
        .addCase(isAuth.pending, (state) => {state.loading=true})
        .addCase(isAuth.fulfilled, (state, action) => {
            state.loading=false;
            // if the auth is successful and the user is returned 
            // => the user's data will be shown, otherwise, the user's data is null
            state.data = {...state.data, ...action.payload.data}
            state.auth = action.payload.auth
        })
        .addCase(isAuth.rejected, (state) => {state.loading = false})

        // SIGN OUT
        .addCase(signOut.fulfilled, (state, action) => {
            state.data = DEFAULT_USER_STATE.data;
            state.auth = false;
        })

        // UPDATE PROFILE
        .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.data = {...state.data, ...action.payload}
        })

        // CHANGE EMAIL
        .addCase(changeEmail.pending, (state) => {state.loading=true})
        .addCase(changeEmail.fulfilled, (state, action) => {
            state.loading=false;
            state.data = {...state.data, ...action.payload.data}
        })
        .addCase(changeEmail.rejected, (state) => {state.loading = false})
        
    }
})

export const { setVerify } = userSlice.actions;
export default userSlice.reducer;