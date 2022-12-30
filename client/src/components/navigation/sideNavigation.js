import { useState } from 'react';
import { Link as RouterLink} from 'react-router-dom';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import DehazeIcon from '@mui/icons-material/Dehaze';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Dashboard from '@mui/icons-material/Dashboard';

const SideDrawer = ({users, signOutUser}) => {
    const [state, setState] = useState(false);

    return(
        <>
            <DehazeIcon className='drawer_btn' onClick={()=>setState(true)}/>
            <Drawer anchor={"right"} open={state} onClose= {()=>setState(false)}>
                <Box sx={{width:200}}>
                    <List>
                        <ListItem
                            button
                            component={RouterLink}
                            to="/"
                            onClick={()=>setState(false)}>
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItem>
                        
                        { !users.auth ? 
                            // If the user is authenticated => the Sign in is visible 
                            // if not => Sign out is visible
                                <ListItem
                                    button
                                    component={RouterLink}
                                    to="/auth"
                                    onClick={()=>setState(false)}>
                                    <ListItemIcon>
                                        <VpnKeyIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Sign in"/>
                                </ListItem>  
                        : 
                            <ListItem
                                button
                                onClick={()=>{
                                    signOutUser();
                                    setState(false)
                                    }}>
                                <ListItemIcon>
                                    <VpnKeyIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Sign out"/>
                            </ListItem> 
                    }
                        <ListItem
                            button
                            component={RouterLink}
                            to="/contact"
                            onClick={()=>setState(false)}>
                            <ListItemIcon>
                                <MailIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Contact"/>
                        </ListItem>

                        
                        
                        

                        <>
                            <Divider/>
                            { users.auth ? 
                                <ListItem
                                    button
                                    component={RouterLink}
                                    to="/dashboard"
                                    onClick={()=>setState(false)}>
                                    <ListItemIcon>
                                        <DashboardIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Dashboard"/>
                                </ListItem>
                            
                            : null }
                        </>
                        
                    </List>
                    <Divider/>
                </Box>
            </Drawer>
        </>
    )
}

export default SideDrawer;