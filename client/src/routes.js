import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { isAuth } from './store/actions/users';
import { Loader } from './utils/tools';

import MainLayout from './hoc/mainLayout';
import Header from './components/navigation/header';
import Home from './components/home';
import Auth from './components/auth';
import Dashboard from './components/dashboard';
import Article from './components/articles/articles';
import AccountVerification from './components/auth/verification';

import AdminArticles from './components/dashboard/articles';
import AdminProfiles from './components/dashboard/profiles';

import AuthGuard from './hoc/authGuard';
import DashboardMain from './components/dashboard/main';
import AddArticles from './components/dashboard/articles/edit.add/add';
import EditArticles from './components/dashboard/articles/edit.add/edit';



const Router = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const users = useSelector(state => state.users);

  useEffect(()=>{
    dispatch(isAuth())
  },[])

  useEffect(() => {
    if(users.auth !== null){
      setLoading(false);
    }
  }, [users]) 

  return(
    <BrowserRouter>
     { loading ? 
      <Loader/>
      :
      <>
        <Header/>
        <MainLayout>
          <Routes>
              <Route path='/dashboard' element={
                <AuthGuard><Dashboard/></AuthGuard>
              }>
                <Route index element={<DashboardMain/>}/>
                {/* Nested route */}
                {/* 'URL: 'http://.../dashboard/profiles'' */}
                <Route path='profiles' element={<AdminProfiles/>}/>
                <Route path='articles' element={<AdminArticles/>}/>
                <Route path='articles/add' element={<AddArticles/>}/>
                {/* The name of params in the URL and the name when we use later to get the params value muss be identical, otherwise, it won't work */}
                <Route path='articles/edit/:articleID' element={<EditArticles/>}/>
              </Route>

              <Route path='/verification' element={<AccountVerification/>}/>
              <Route path='/articles/article/:articleID' element={<Article/>}/>
              <Route path='/auth' element={<Auth/>}/>
              <Route path='/' element={<Home/>}/>
          </Routes>
        </MainLayout>
      </>  
    }
      
      
      
    </BrowserRouter>
  )
}

export default Router;
