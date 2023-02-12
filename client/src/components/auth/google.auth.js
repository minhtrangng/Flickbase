import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { chooseGoogleUser } from "../../store/actions/users";


const GoogleAuth = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        //dispatch(chooseGoogleUser())
    }, [])

    return (
        <>
            GOOGLE AUTH
        </>
    )
}

export default GoogleAuth;