import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

import Header from '../../component/layout/Header';
import { fetchGetDataWithToken } from '../../client/client';

import AccountInfo from './AccountInfo';
import EditProfile from './EditProfile';
import MyOrders from './MyOrders';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LogoutIcon from '@mui/icons-material/Logout';
import { Delete } from '@mui/icons-material';

import { Avatar, Typography } from '@mui/material';

const Profile = () => {

  const navigate = useNavigate();

    const [menuItem,setMenuItem] = useState('');
    const [username,setUsername] = useState('');

    const handleMenuItemClick = (menuItem) => {

        setMenuItem(menuItem);
    }
    
    useEffect( () => {

      if(!localStorage.getItem("token")){
        navigate('/account/login');
      }

      const token = localStorage.getItem("token");
      const detailsFromToken = jwtDecode(token);

      const accId = detailsFromToken.accId;

      const getUserDetails = async() => {

      try{
        const res = await fetchGetDataWithToken(`/account/view-by-id/${accId}`);
        console.log(`Account Taken for accId: ${accId}`,res.data);
        setUsername(res.data.name);
      }catch(err){
        console.log("Error while getting account by accId in AccountInfo.js",err.message);
      }
    } 
    getUserDetails();

  },[navigate]) //--- navigate



    return(

    <Box>
        <Box position="fixed"
        sx={{zIndex:1,width:'100%'}}>
        <Header/>
        </Box>
    
   <Box sx={{ display: 'flex',pt:12}}>

      <Drawer  /**The <Drawer> in Material UI (MUI) is used to create a sidebar (or slide-in menu) — usually from the left, right, top, or bottom of the screen. */
        sx={{
          
        //   width: '240px',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '240px',
            boxSizing: 'border-box',
            // marginTop:"45px",
            zIndex:0,
            pt:9
          },
        }}
        variant="permanent" /*make the drawer shown always,not closed drawer when cicked*/
        anchor="left"  /*we use drawer on left */
      >     
      <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',py:'20px'}}>
        <Avatar
        sx={{
          height:'70px',
          width:'70px',
          backgroundColor:'black',
          fontSize:'30px',
          fontWeight:'bold'
        }}
        >{username.charAt(0).toUpperCase()}</Avatar>

        <Typography variant="subtitle" sx={{mt:'15px',fontWeight:'bold'}}>{username}</Typography>
      </Box>

        <Divider />  {/*creates a line between below and above section */}
        
        <List>
          {['Account Info', 'Edit Profile', 'My Orders'].map((text, index) => (
            
            <ListItem key={text} disablePadding>

              <ListItemButton onClick={ () => {handleMenuItemClick(text)}}>
                <ListItemIcon>
                  {index === 0   ? <AccountCircleIcon /> 
                  : index === 1  ? <EditIcon/>
                  : <ReceiptLongIcon/>}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>

            </ListItem>

          ))}
        </List>

        <Divider />

        <List>
          {['Change Password', 'Logout','Delete CC Account'].map((text, index) => (

            <ListItem key={text} disablePadding>

              <ListItemButton onClick={ () => {handleMenuItemClick(text)}}>

                <ListItemIcon>
                  {index === 0 ? <VpnKeyIcon /> : index === 1 ? <LogoutIcon /> : <Delete/>}
                </ListItemIcon>
                <ListItemText primary={text} />

              </ListItemButton>

            </ListItem>

          ))}
        </List>

      </Drawer>
    </Box>

    <Box
    sx={{
      flexGrow:1,
      p:3,
      mt:'10px',
      ml:'280px',
      mr:'30px',
      paddingBottom: '40px' ,
      border:'1px solid black',
      borderRadius:'20px',
    }}
    
    >

      { menuItem === 'Account Info' ? <AccountInfo/> 
      : menuItem === 'Edit Profile' ? <EditProfile/> 
      : menuItem === 'My Orders' ? <MyOrders/> 
      : menuItem === 'Change Password' ? <ChangePassword/> 
      : menuItem === 'Logout' ? navigate('/account/logout')
      : menuItem === 'Delete CC Account' ? <DeleteAccount/> 
      : <AccountInfo/>}

    </Box>

</Box>

    )
};

export default Profile;