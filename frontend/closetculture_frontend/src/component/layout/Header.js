
import React,{useEffect,useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import fetchGetData from '../../client/client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { jwtDecode } from 'jwt-decode';


const settings = [
  {
    label:'Profile',
    path:'/account/profile'
  },
  {
    label:'Login',
    path:'/account/login'
  },
  {
    label:'Register',
    path:'/account/register'
  },
  {
    label:'Logout',
    path:'/account/logout'
  }
];

function Header({FilterButtonCompo}) {

  const location = useLocation();
  // console.log("location in header :",location);
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  //----- Using the above getting Prodects function when the component mount

  const [allProducts,setAllProducts] = useState([]);

  useEffect( () => {
    
    const products = async() => {
        
    try{
      const res = await fetchGetData('/product/view-all');
      const data = res.data;
      // console.log("All products returned in Header.js",data);

      setAllProducts(data);


    }catch(err){
      console.log("Error While Getting Products List in Header:",err.message);
    }
  }

  products();

  },[]);

  //---------------------------------------------------------------------------

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleButtonClickInSettings = (buttonName) => {
    
    if(buttonName === 'Profile'){

      navigate('/account/profile');

    }else if(buttonName === 'Register'){

      navigate('/account/register');

    }else if(buttonName === 'Login'){

      navigate('/account/login')

    }else if(buttonName === 'Logout'){

      navigate('/account/logout')

    }

  }

  const handleDisabled = (buttonName) => {

    if(!localStorage.getItem("token") && (buttonName === 'Logout' || buttonName === 'Profile')){
      
      return true;

    }else if(localStorage.getItem("token") && ( buttonName==='Login' || buttonName==='Register')){

      return true;

    }

    return false;


  }

  const handleButtonShow = (role) => {

    // const roleBackend = "SCOPE_"+role;
    const token = localStorage.getItem("token");
    if(token){
      const decodedToken = jwtDecode(token);
    
      if(decodedToken["scope"] !== role){
        return false;
      }
    }else if(!token){
      return false;
    }

    return true;

  }

  return (
    <AppBar position="static" >
      <Container maxWidth="xl" sx={{boxShadow:'20'}}>
        <Toolbar disableGutters>
            {/*Logo For Desktop UI*/}
          <CheckroomIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CLOSET CULTURE
          </Typography>

         {/*Menu Icon For Mobile UI */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            {/*Dropdown Options For Mobile */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {allProducts.map((product) => (
                <MenuItem 
                key={product.prdId}
                onClick={() => {navigate('/coll-by-prod?prdId='+product.prdId+"&prdName="+product.prdName)}}>
                  <Typography sx={{ textAlign: 'center' }}>{product.prdName}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* For Mobile, Logo(Center Logo)*/}
          <CheckroomIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CLOSET CULTURE
          </Typography>

          {/*Desktop Navigation Button Products */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {allProducts.map((product) => (
              <Button
                key={product.prdId}
                onClick={() => {navigate('/coll-by-prod?prdId='+product.prdId+"&prdName="+product.prdName)}}
                sx={{ my: 2, color: 'white', display: 'block', '&:hover':{backgroundColor:'black',color:'White'} }}
              >
                {product.prdName}
              </Button>
            ))}
          </Box>

            {handleButtonShow('ADMIN') && (
              <Button sx={{backgroundColor:'black',color:'white',mr:'3rem'}} onClick={() => {navigate('/admin/home')}}>
                ADMIN
              </Button>
            )}

            {handleButtonShow('USER') && (

              <Box sx={{display:'flex',gap:2}}>

              {(location.pathname !== '/account/profile' && location.pathname !== '/cart/view-cart' && location.pathname !== '/stk-by-coll') && 
                FilterButtonCompo}

              <ShoppingCartOutlinedIcon sx={{color:'white',mr:'1rem',mt:'7px',fontSize:'30px'}} onClick={() => {navigate('/cart/view-cart')}}/>
              
              </Box>
            )}
              

          {/*Profile Logo */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} >
                <Avatar alt="Remy Sharp" src="https://eu.ui-avatars.com/api/?name=C+C&size=250" />
              </IconButton>
            </Tooltip>

            {/*Profile Dropdown */}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                
                ( !handleDisabled(setting.label) && (

                <MenuItem key={setting.label} onClick={ () => {
                  handleButtonClickInSettings(setting.label);
                  handleCloseUserMenu()
                }}
                name={setting.label}
                sx={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: 'black',
                  textTransform: 'capitalize',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}>

                  <Typography >
                    {setting.label}
                  </Typography>
                  
                </MenuItem>
                ))
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
