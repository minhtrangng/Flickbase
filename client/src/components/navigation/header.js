
import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import SideDrawer from './sideNavigation';

import { useSelector, useDispatch } from 'react-redux';


import { clearNotifications } from '../../store/reducers/notifications';
import { showToast } from '../../utils/tools';
import { signOut } from '../../store/actions/users';

import { setLayout } from '../../store/reducers/site';



const Header = () => {
    const users = useSelector(state => state.users);
    const notifications = useSelector( state => state.notifications);
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const site = useSelector(state => state.site);
    let location = useLocation();

    useEffect(()=> {
        let pathName = location.pathname.split('/');
        if(pathName[1] === 'dashboard'){
            dispatch(setLayout('dash_layout'))
        }
        else{
            dispatch(setLayout(''))
        }
    }, [location.pathname, dispatch])

    useEffect(() => {
        // get global of notification => instead of using notifications.global
        // use the name 'global' directly
        let { global } = notifications;
        if(notifications && global.error){
            // console.log('success')
            const msg = global.msg ? global.msg : 'Error';
            showToast('ERROR', msg)
            dispatch(clearNotifications());
        }
        if(notifications && global.success){
            // console.log('success')
            const msg = global.msg ? global.msg : 'Success';
            showToast('SUCCESS', msg)
            dispatch(clearNotifications());
        }
    }, [notifications])

    const signOutUser = () => {
        // alert('Sign out')
        dispatch(signOut());
        // Sign out the user and redirect to Home
        navigate('/');
    }

    return(
        <>
            { !users.data.verified && users.auth ? 
            
                <div className='not_verified'>
                    Not verified!
                </div>
            
            : null
            }

            <nav className={`navbar fixed-top ${site.layout}`}>
                <Link to="/" className='navbar-brand d-flex align-items-center fredoka_ff'>
                    Flickbase
                </Link>
                {/* Dependent on the  state of the user (authenticated or not) 
                => the appearance of the side drawer (available options) will be different */}
                <SideDrawer users={users} signOutUser={signOutUser}/>
            </nav>
        </>
    )
}

export default Header;