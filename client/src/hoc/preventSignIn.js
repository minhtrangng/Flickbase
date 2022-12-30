// Aufgaben: If the user is logged in => he can not see the login page

import { Navigate, useLocation } from 'react-router-dom';

const PreventSignIn = (props) => {

    let location = useLocation();

    return (
        <>
        { props.users.auth ? 
            <Navigate to="/dashboard" state={{from:location}} replace/>
        :
            props.children }
        </>
    );
}

export default PreventSignIn;