import { Link as RouterLink} from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    List,
    ListItem,
    ListItemText
} from '@mui/material';

const AdminLayout = ( props ) => {
    
    const users = useSelector(state=>state.users);
    
    return(
        <>
            <div className='row adminLayout'>
                <nav className='sidebar col-md-2 d-md-block'>
                    <div>
                    <List>
                        <ListItem button component={RouterLink} to="/dashboard/profiles">
                            <ListItemText primary="Profiles"/>
                        </ListItem>
                        { users.data.role === 'admin' ?
                            <>
                                <ListItem button component={RouterLink} to="/dashboard/articles">
                                    <ListItemText primary="Articles"/>
                                </ListItem>

                                <ListItem button component={RouterLink} to="/dashboard/categories">
                                    <ListItemText primary="Categories"/>
                                </ListItem>
                            </>
                        
                        :null
                        }
                      

                    </List>
                    </div>
                </nav>
                <main role="main" className='col-md-9 ml-sm-auto col-lg-10 pt-3 px-4'>
                    {props.children}
                </main>
            </div>
        </>
    )
}
export default AdminLayout;