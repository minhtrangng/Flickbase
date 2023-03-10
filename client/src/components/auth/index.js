import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux';
import { errorHelper, Loader } from '../../utils/tools';


import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import jwt_decode from 'jwt-decode'; 

import { registerUser } from '../../store/actions/users';
import { signinUser } from '../../store/actions/users';

import PreventSignIn from '../../hoc/preventSignIn';



const Auth = () => {
    // components logic
    const [register, setRegister] = useState(false);
    let navigate = useNavigate();
    // Redux logic
    const users = useSelector(state => state.users);
    const notifications = useSelector(state => state.notifications);
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: { email: 'max-mustermann@gmail.com', password: 'Max12345!'},
        validationSchema: Yup.object({
            email: Yup.string()
            .required('Sorry, the email is required')
            .email('This email is not valid'),

            password: Yup.string()
            .required('Sorry, the password is required')
        }),
        onSubmit: (values) => {
            handleSubmit(values)
        }
    })

    // HANDLE SUBMIT
    const handleSubmit = (values) => {
        if(register){
            // console.log(values, 'Registed');
            dispatch(registerUser(values));
        }
        else{
            // console.log(values, 'Signed in');
            dispatch(signinUser(values));
        }
    }

    // GOOGLE CALLBACK
    const googleSignIn = () => {
        window.open("http://localhost:3001/api/auth/google", "_self")
    }

    // LOG IN WITH GOOGLE
    // const googleLogIn = (credentialResponse) => {
    //     const decoded_response = jwt_decode(credentialResponse);
    //     console.log(decoded_response);
    //     //return decoded_response;
    // }
    
    // GOOGLE LOGOUT
    // const ggLogout = () => {
    //     document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/";
    // }

    // GOOGLE LOGIN
    // const google = () => {
    //     window.open("http://localhost:3000/auth/google", "_self")
    // }

    // NOTIFICATION
    useEffect(() => {
        if(notifications && notifications.global.success){
            // redirect to dashboard
            navigate('/dashboard')
        }
    }, [notifications])

    return (
        // If the user is logged in/authenticated => he can not be redirected to the login page
        // But at this time, the other things before return-block has been loaded
        // The 'Prevent sign in' is different to 'Auth guard' at this point
        // In 'Auth guard', if the user is not authenticated => nothing gonna be loaded
        <PreventSignIn users={users}>
            <div className='auth_container'>
                <h1>Authenticate</h1>
                { users.loading ? 
                    <Loader/>
                : <Box
                    sx={{
                        '& .MuiTextField-root': {width:'100%', marginTop:'20px'}
                    }}
                    component="form"
                    onSubmit={formik.handleSubmit}
                >
                    <TextField 
                        name= 'email'
                        label= 'Enter your email'
                        variant='outlined'
                        {...formik.getFieldProps('email')}
                        {...errorHelper(formik, 'email')}
                    />

                    <TextField
                        name= 'password'
                        label='Enter your password'
                        type="password"
                        variant='outlined'
                        {...formik.getFieldProps('password')}
                        {...errorHelper(formik, 'password')}
                    />

                    <div className='mt-2'>
                        <Button
                            variant='contained'
                            color='secondary'
                            type='submit'
                            size='large'
                        >
                        {register ? 'Register': 'Login'}
                        </Button>

                        <Button
                            className='mt-3'
                            variant='outlined'
                            color='secondary'
                            type='submit'
                            size='small'
                            onClick={() => setRegister(!register)}
                        >
                        Want to {!register ? 'Register': 'Login'}
                        </Button>

                        {/* <GoogleOAuthProvider clientId='298685441331-arqa1q8ccll3hd4idatv3tininfrdfq4.apps.googleusercontent.com'>
                            <div className='mt-3'>
                            <GoogleLogin
                                onSuccess={credentialResponse => googleLogIn(credentialResponse)}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                useOneTap
                            />
                            </div>
                            
                        </GoogleOAuthProvider>
                        
                        <div>
                            <Button
                                className='mt-3 g_id_signout'
                                variant='outlined'
                                color='secondary'
                                onClick={() => ggLogout()}
                            >
                                Google log out
                            </Button>
                        </div> */}

                        
                        
                        
                    </div>
                </Box>
                }
            </div>

            <div className='auth_container'>
                <Button 
                    className='mt-3 loginButton'
                    variant='contained'
                    color='primary'
                    type='submit'
                    size='big'
                    onClick={googleSignIn}
                >
                    Sign In with Google
                </Button>
            </div>

            

        </PreventSignIn>

        
    )
}

export default Auth; 