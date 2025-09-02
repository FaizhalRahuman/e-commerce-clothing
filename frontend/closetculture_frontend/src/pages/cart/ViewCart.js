import {useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Buffer } from 'buffer';

import { fetchDeleteDataWithToken, fetchGetDataWithArrayBufferWithToken, fetchGetDataWithToken, fetchPutDataWithToken } from '../../client/client';
import Header from '../../component/layout/Header';


import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import CartCardTemplate from "../../component/cards/CartCard";
import { DeleteForeverTwoTone } from '@mui/icons-material';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined'
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined'
import DangerousIcon from '@mui/icons-material/Dangerous';
import Footer from "../../component/layout/Footer";


const ViewCart = () => {

    const navigate = useNavigate();

    const[isChanged,setIsChanged] = useState(false)
    const[cartDetails,setCartDetails] = useState([]);
    const[totalPrice,setTotalPrice] = useState(0);
    const[imgLink,setImgLink] = useState({});
    const[stockAvl,setStockAvl] = useState({});

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
            console.log("Error while Getting Stock Image Data in ViewCart.js:",err.message);
        }
    }

    useEffect( () => {

        if(!localStorage.getItem("token")){
            navigate('/account/login');   
        }

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
        setIsChanged(false);

    },[isChanged,navigate]) //--- navigate

    useEffect( () => {

        const getStockAvl = async(stkId) => { //--- moved from outside to inside this useEffect

        try{
            const res = await fetchGetDataWithToken(`/stock/view-by-stkId/${stkId}`);
            const data = res.data;
            console.log("Stock Item for stock id :"+stkId,data);
            console.log("Stock comes from:",data.stock);
            setStockAvl( (prevVal) => ({
                ...prevVal,
                [stkId]:data.stock
            }));
            console.log( "inside get func id: ",stkId);
            console.log( "inside get func object : ",stockAvl);


        }catch(err){
            console.log("Error while getting stock by stkId in ViewCart.js",err.message);
        }
    }

        let tot = 0;

        for(var cartDetail of cartDetails){
            console.log("OUTER SIDE:",cartDetail.itmId)
            if(!imgLink[cartDetail.itmId]){
                getCartImg(cartDetail.itmId);
                getStockAvl(cartDetail.itmId);
                console.log("INNER SIDE:",cartDetail.itmId);
            }
            tot += Number(cartDetail.rate) * cartDetail.qty;
        }
        setTotalPrice(tot);

    },[cartDetails,imgLink,stockAvl]) //--- imgLink,stockAvl

    console.log("KEY AND VALUE:",stockAvl);

    const handleCartRemove = async(stkId) =>{

        try{

            const res = await fetchDeleteDataWithToken(`/cart-item/delete/${stkId}`);
            console.log('Cart Item is Removed',res.data);
            window.location.reload();

        }catch(err){
            console.log("Error while removing Cart Item in ViewCart.js",err.message);
        }

    }

    const handleCartClear = async() => {
        try{

            const res = await fetchDeleteDataWithToken(`/cart-item/clear`);
            console.log("All Cart Items successfully cleared",res.data);
            window.location.reload();
        }catch(err){
            console.log("Error while clearing cart items in ViewCart.js",err.message);
        }
    }

    const handleUpdateQty = async(quantity,stkId) => {

        try{
            console.log("quantity",quantity)
            const res = await fetchPutDataWithToken(`/cart-item/update-cart-item-quantity/${stkId}`,{quantity:quantity});
            console.log("Successfully quantity update",res.data);
            setIsChanged(true);

        }catch(err){
            console.log("Error while Updating cart item qty in ViewCart.js",err.message)

        }

    }

console.log("stock availables: ",stockAvl);
    return(

    <Box sx={{backgroundColor:'#f0f8ff',minHeight:'820px'}}>

        <Box position="fixed"
            sx={{zIndex:1,width:'100%'}}>
            <Header/>
       </Box>

    <Box sx={{p:'30px',pt:10,display:'flex',flexWrap:'nowrap'}}>

        {/*Left Side Cart Items */}
    <Box sx={{
        borderRight:'1px solid black',
        display:'flex',
        // flexDirection:'column',
        flexWrap:'wrap',
        flex:3, /** if we give flex:val it checks for its parent width for taking a space part,here 3 means 75% and below the total price have flex:25%.,ipdi thaan idhuku namma space ah pirichu kudukurom */
        gap:2,
        maxHeight:'710px',
        overflowY:'auto',
        pl:'30px'}}>

     <Typography variant='h6' sx={{mt:'30px',fontWeight:'bold',fontFamily:'serif'}}>CART ITEMS IN YOUR ACCOUNT 🛒:</Typography>
    {cartDetails.length > 0 && ( 
     <Button
     sx={{
        // ml:'600px',
        postion:'relative',
        bgcolor:'black',
        color:'white',
        fontWeight:'bold',
        fontFamily:'verdana',
        height:'32px',
        top:'4%',
        '&:hover':{
            bgcolor:'red',
            color:'black'
        }
     }}
     onClick={handleCartClear}
     >Clear</Button>
    )}

     <Grid container sx={{px:'10px',mt:'20px',display:'flex',flexWrap:'wrap',gap:2}}>

        {cartDetails.length===0 ? (
            <Typography sx={{mt:'13px'}}>No Items You Added;;</Typography>
        )
        :
        cartDetails.map( (cart) => (
            <Grid item key={cart.itmId} sx={{
                // height:'250px',
                position:'relative',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                borderRadius:'15px',
                // mt:'100px',
                // border:'1px solid black',
                // '&:hover .removeBtn':{
                //     opacity:1
                // }
            }}>
                <CartCardTemplate
                image={imgLink[cart.itmId]}
                collName={cart.collName}
                size={cart.size}
                color={cart.color}
                rate={cart.rate}
                quantity={cart.qty}
                />
                <Box sx={{
                    position:'absolute',
                    display:'flex',
                    flexDirection:'column',
                    // border:'1px solid black',
                    top:"72.5%",
                    right:"5%"

                    }}>
                    
                <IconButton size="small" onClick={ () => {handleUpdateQty(cart.qty+1,cart.itmId)}} >
                    <ArrowCircleUpOutlinedIcon/>
                </IconButton>
                <IconButton size="small" onClick={ () => {handleUpdateQty(cart.qty-1,cart.itmId)}} disabled={cart.qty === 1}>
                    <ArrowCircleDownOutlinedIcon/>
                </IconButton>

                </Box>

                <DeleteForeverTwoTone 
                className='removeBtn'
                sx={{
                position:'relative',
                cursor:'pointer',
                p:1,
                bgcolor:'black',
                bottom:'90%',
                left:'35%',
                color:'red',
                fontWeight:'bold',
                borderRadius:'50px',
                opacity:1,
                transition:'opacity 0.5s ease',
                }}
                onClick={() => handleCartRemove(cart.itmId)}
                />
                {stockAvl[cart.itmId] <= 0 && (
                
                <Box
                sx={{
                    border:'2px solid black',
                    position:'absolute',
                    top:'10%',
                    height:'17B0px',
                    width:'170px',
                    alignContent:'center',
                    borderRadius:'50px',
                    borderColor:'red',
                    // backgroundColor:'#f9f9f9',
                    backdropFilter:'blur(9px)'
                }}
                >

                    <Typography sx={{ml:'39px',fontWeigh:'bold',color:'black',fontFamily:'serif',fontSize:'16px',fontStyle:'oblique'}}>
                        <strong><strong>NO STOCK !!</strong></strong><DangerousIcon sx={{ml:'28px',mt:'8px',color:'red'}}/>
                    </Typography>

                </Box>
                
                )}

            </Grid>
        )
        
        )}
     </Grid>
     </Box>

    {/*Right Side Price box Items */}
     <Box sx={{
        // border:'1px solid black',
        flex:1,
        pt:'20px'
        }}>
        <Typography sx={{
            fontFamily:'-moz-initial',
            fontWeight:'bold',
            fontSize:'2rem',
            ml:'10px',
            mb:'30px'
        }}>Price Summary</Typography>
        <Typography sx={{
            fontFamily:'serif',
            fontWeight:'bold',
            ml:'20px'
            }}> Total Items : {cartDetails.length}</Typography>
        <Typography sx={{
            mt:'20px',
            fontFamily:'serif',
            fontWeight:'bold',
            ml:'20px'
            }}> Total Price : {totalPrice} </Typography>

            <Button variant='contained'
            color='primary'
            sx={{
                mt:'40px',
                ml:'75px'
            }}
            onClick={() => navigate('/cart/order-via-cart')}
            disabled={cartDetails.length <= 0}
            >Place Order Via Cart</Button>
     </Box>

    </Box>
    <Footer/>
    </Box>

    )

}

export default ViewCart;