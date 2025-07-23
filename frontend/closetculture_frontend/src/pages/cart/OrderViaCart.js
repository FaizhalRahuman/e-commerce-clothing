import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPostDataWithToken } from "../../client/client";

import { Box, Button, Card, CardContent,FormControl,FormControlLabel, FormLabel,Radio, RadioGroup, TextField, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CircularProgress } from "@mui/material";

const OrderViaCart = () =>{

    const navigate = useNavigate();

    const[userDetails,setUserDetails] = useState({buyerPhNo:'',buyerAddress:'',paymentType:''});
    const[errors,setErrors] = useState({buyerPhNo:'',buyerAddress:'',paymentType:''})
    const[orderSuccess,setOrderSuccess] = useState(false);
    const[orderError,setOrderError] = useState(false);

    const[loader,setLoader] = useState('');

    const handleInput = (e) =>{

        const {name,value} = e.target;

        setUserDetails( (prevVal) =>(
            {
             ...prevVal ,
            [name] : value
            }
    ));
}


    const orderCart = async(e) => {

        setLoader(true);

        e.preventDefault();

        setErrors({buyerPhNo:'',buyerAddress:'',paymentType:''});

        let isValid = true;

        if(!userDetails.buyerAddress.trim()){
            setErrors((prevVal) =>(
                {
                    ...prevVal ,
                    buyerAddress:"Cannot Be Empty" 
                }
            ));
            isValid = false;
        }

        if(!userDetails.buyerPhNo.trim()){

            setErrors((prevVal) => (
                {
                    ...prevVal,
                    buyerPhNo:"Cannot Be Empty"
                }
            ));
            isValid = false;
        }

        if(!userDetails.paymentType){
          setErrors( (prevVal) => ({
            ...prevVal,
            paymentType:"Select Payment Type"
          }))
          isValid=false;
        }

        if(isValid){
            
        try{
                
            const res = await fetchPostDataWithToken('/order/place-via-cart',userDetails);
            console.log("Order Placed Successfully!",res.data);
            setOrderSuccess(true);
            setTimeout( () => {
              navigate('/');
            },1500)
        }catch(err){

            console.log("Error while placing order via cart",err.message);
            setOrderError(err.response?.data || err.message);
        }            
            
        }
        setLoader(false);

    }


    
 
 return (

  <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: 400, p: 3, boxShadow: 10, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            Enter You Details 🙋
          </Typography>

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Mobile"
            name="buyerPhNo"
            value={userDetails.buyerPhNo} 
            onChange={handleInput} 
            error={!!errors.buyerPhNo} 
            helperText={errors.buyerPhNo} 
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Address"
            name="buyerAddress"
            value={userDetails.buyerAddress} 
            onChange={handleInput} 
            error={!!errors.buyerAddress} 
            helperText={errors.buyerAddress}
          />

          <FormControl required>

          <FormLabel sx={{fontWeight:'bold'}}>Payment Method:</FormLabel>
          
          <RadioGroup //here we create a radio group which consists of two radios by which we get which one is selected by user.Here we can set value of this radioGroup(means which radio button is userSelected) 
          value={userDetails.paymentType}
          onChange={(e)=> setUserDetails((prevVal) => ( {...prevVal , paymentType:e.target.value}))}
          aria-required="true"
          >

            <FormControlLabel 
            label="Cash On Delivery"
            control= {<Radio/>}  //this control <Radio/> means that control the user input by radio button,it gives the radio button in UI and if user clicks that,we get the value="cashOnDelivery" which we give in below.
            value="cashOnDelivery"
            ></FormControlLabel>
            {/*another use <input type="radio" value="gpay"/><label for="gpay">Gpay</label>*/}
            
            <FormControlLabel
            label="Gpay"
            control={<Radio/>}
            value="gpay"
            ></FormControlLabel>
{/*It is nothing but very simple,that just we have the two radio button inside radio group,and track the user click on radio by giving a specific value for each radio->this value is setted on the mothama RadioGroup(like there we get the user click on which radio button)  */}
          
          </RadioGroup>

          </FormControl>

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              fontWeight: "bold",
              mt: 2,
              py: 1.3,
              borderRadius: "10px",
              '&:hover': {
                backgroundColor: "#115293",
              },
            }}
            onClick={orderCart}
          >
            {loader ? <CircularProgress size='25px' sx={{color:'white'}}/> : "Place Order"}
          </Button>

          {errors.paymentType && ( <h5 style={{color:'red'}}>{errors.paymentType}</h5>) }

          {orderSuccess && (
            <Box sx={{mt:'30px'}}>
            <CheckCircleIcon 
            sx={{
                ml:"130px",
                color: 'green',            
                backgroundColor: 'white',  
                borderRadius: '50%',       
                padding: '7px',            
                fontSize: '70px'           
            }}/>
            <Typography sx={{ml:"110px",fontWeight:'bold',fontFamily:'serif',fontSize:'20px'}}>Order Catched !</Typography>
            </Box>
        
        )}
           {orderError && <h5 style={{ color: 'red' }}>{orderError}</h5>}
        </CardContent>
      </Card>

    </Box>

  );
}

export default OrderViaCart;