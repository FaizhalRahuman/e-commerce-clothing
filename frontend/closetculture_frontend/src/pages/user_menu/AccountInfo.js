import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';

import { jwtDecode } from 'jwt-decode';

import { fetchGetDataWithArrayBufferWithToken, fetchGetDataWithToken  } from '../../client/client';
import CartCardTemplate from '../../component/cards/CartCard';

import { Box,Grid,Paper,Typography} from '@mui/material';

const AccountInfo = () => {

    const navigate = useNavigate();

    const[userDetails,setUserDetails] = useState('');
    const[cartDetails,setCartDetails] = useState([]);
    const[imgLink,setImgLink] = useState({});

    const getCartImg = async(stkId) => {

        try{
        const res = await fetchGetDataWithArrayBufferWithToken(`/stock/get-stock-img/${stkId}`);
        const imgLink = Buffer.from(res.data,'binary').toString('base64');
        const finalImgLink = "data:image/jpeg;base64,"+imgLink;
        setImgLink( (prevVal) => (
            {
                ...prevVal,
                [stkId]:finalImgLink
            }
        ))
        }catch(err){
            console.log("Error while Getting Stock Image Data in StkViewAll.js:",err.message);
        }
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
                setUserDetails(res.data);
            }catch(err){
                console.log("Error while getting account by accId in AccountInfo.js",err.message);
            }
        }
        getUserDetails();

        const getCartDetails = async() => {

            try{

                const res  = await fetchGetDataWithToken(`/cart-item/view-all`);
                console.log("Cart Items Taken:",res.data);
                setCartDetails(res.data);
            }catch(err){
                console.log("Error while getting Cart items in AccountInfo.js",err.message);
            }

        } 
        getCartDetails()

    },[navigate]) //--- navigate

    useEffect( () => {

        for(var cartDetail of cartDetails){
            if(!imgLink[cartDetail.itmId]){
                getCartImg(cartDetail.itmId);
            }
        }

    },[cartDetails,imgLink]) //--- imgLink

    console.log("AccountIfo");

    return(

      <>
      <Box sx={{ px: 2, py: 4,pt:'96px' }}>
      <Grid container spacing={3} justifyContent="center">

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={4}
              sx={{

                width:{xs:"70%",sm:"60%",md:"450px"},

                mt:'-60px',
                padding: "25px",
                borderRadius: "15px",
                backgroundColor: "#1caee3ff ",
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Account Detail
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {userDetails.name}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {userDetails.email}
              </Typography>

            </Paper>
          </Grid>

     </Grid>

     <Typography variant='h6' sx={{mt:'30px',fontWeight:'bold',fontFamily:'serif'}}>CART ITEMS IN YOUR ACCOUNT 🛒:</Typography>

     <Grid container sx={{mt:'20px',display:'flex',flexWrap:'wrap',gap:2}}>

        {cartDetails.length===0 ? (
            <Typography>No Items You Added;;</Typography>
        )
        :
        cartDetails.map( (cart) => (
            <Grid item key={cart.itmId} sx={{
                // height:'250px',
                borderRadius:'15px',
                // mt:'100px',
                // border:'1px solid black'
            }}>
                <CartCardTemplate
                image={imgLink[cart.itmId]}
                collName={cart.collName}
                size={cart.size}
                color={cart.color}
                rate={cart.rate}
                quantity={cart.qty}
                />
            </Grid>
        )
        
        )}
     </Grid>
    </Box>
    </>

    )

}

export default AccountInfo;