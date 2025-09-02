import { useState, useEffect } from "react";

import { Box, Button, Card, 
        CardMedia, CircularProgress, DialogContent, 
        DialogActions, Grid, Paper, Typography,
        TextField,FormControl,RadioGroup,FormControlLabel,FormLabel,
        Radio,DialogTitle,Dialog } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StkForUserTemplate = ({defaultImg,stkImages,allStkDetails,collType,handleAddToCart,handleOrderNow}) => {

    console.log("StkForUserTemplate.....");
    console.log(allStkDetails);
    console.log(stkImages);

    const[userSelectedStk,setUserSelectedStk] = useState({size:'',color:''});
    const[stkId,setStkId] = useState(0);
    const[notAvl,setNotAvl] = useState('')
    const[priceForStk,setPriceForStk] = useState('');
    const[imgForStk,setImgForStk] = useState(defaultImg);

    const uniqueSizes = [...new Set(allStkDetails.map((stk)=> stk.size))];
    const uniqueColors = [...new Set(allStkDetails.map((stk)=> stk.color))];
/**
allStkDetails.map(stk => stk.size)
Takes your array of stock items
Creates a new array containing only the sizes
Example: ["S", "M", "S", "L"]
new Set()
Creates a JavaScript Set object
Sets automatically remove duplicate values
Example: new Set(["S", "M", "S", "L"]) becomes {"S", "M", "L"}
[...set]
Spread operator converts the Set back to an array
Example: [...new Set(["S", "M", "S", "L"])] becomes ["S", "M", "L"] 
 */
    const[sizeIsActive,setSizeIsActive] = useState(null);
    const[colorIsActive,setColorIsActive] = useState(null);
    // const[sizeForColor,setSizeForColor] = useState([]);
    const[uniqueColorsForSize,setUniqueColorsForSize] = useState([]);

    const [userDetails,setUserDetails] = useState({quantity:0,buyerPhNo:'',buyerAddress:'',paymentType:''});
    const [errors,setErrors] = useState({quantity:'',buyerPhNo:'',buyerAddress:'',paymentType:''});

    const [dialogOpen, setDialogOpen] = useState(false);
    const [loader,setLoader] = useState(false);

    useEffect( () => {

        console.log("Entered UseState.................")

        setNotAvl('');

        /*Taking sizes for a color 
        if(userSelectedStk.color){
        const matchedStkSizes = allStkDetails.filter( (stk) => 
        stk.color === userSelectedStk.color
        );
        if(matchedStkSizes){
        setSizeForColor(matchedStkSizes);
        }}*/

        /*Taking colors for a size */
        if(userSelectedStk.size ){

            const matchedStkColors = allStkDetails.filter( (stk) =>
                stk.size === userSelectedStk.size
            );

            if(matchedStkColors){
                setUniqueColorsForSize([...new Set(matchedStkColors.map((stk) => stk.color))]);
            }
        }

        if(userSelectedStk.size && userSelectedStk.color){

            /*getting the user selected stock which we displayed from stock db and also ensuring stock availability */
            const matchedStk = allStkDetails.find(
                (stk) => stk.size === userSelectedStk.size && stk.color === userSelectedStk.color
            )

            if(matchedStk){

                if(matchedStk.stock <=0 ){
                    setNotAvl('Not In Stock !')
                }

                setStkId(matchedStk.stkId);
                setPriceForStk(matchedStk.rate);
                
                setImgForStk(stkImages[matchedStk.stkId]);
                console.log("stkId:"+matchedStk.stkId +"img"+stkImages[matchedStk.stkId]);

            }
        }

    },[userSelectedStk,allStkDetails,stkImages]) //---allStkDetails,stkImages

    /*Pace Order In Dialog Box */
    const handlePlaceOrder = async(e) => {

        console.log("Entered handle place order function ............................");

        setErrors({quantity:'',buyerPhNo:'',buyerAddress:'',paymentType:''});

        let isValid=true;

        if(!String(userDetails.quantity).trim() || userDetails.quantity<=0){

            setErrors((prevVal) =>(
                {
                    ...prevVal,
                    quantity:"Please Enter Quantity"
                }
            ))
            isValid=false;
        }

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
            setLoader(true);
            console.log("LOAER.............",loader);
            await handleOrderNow(stkId,userDetails);

            setLoader(false);
            console.log("LOAER.............",loader);
        
        setDialogOpen(false);
        }
        
    }

    const handleInput = (e) =>{

        const {name,value} = e.target;

        setUserDetails( (prevVal) =>(
            {
             ...prevVal ,
            [name] : value
            }
    ));
}

    return(

        <Grid sx={{
            pt:'105px',
            display:'flex',
            flexWrap:'wrap',
            // border:'1px solid black',
            minWidth:{
                xs:"100%",
                sm:"100%",
                md:"100%",
                lg:"100%"}
            }}>

        {/*Photo Grid */}
            <Grid 

            sx={{
                // border:'1px solid black',
                p:'20px',
                ml:'40px',
                flexGrow:4,
                maxWidth:{
                xs:"90%",
                sm:"80%",
                md:"80%",
                lg:"50%"}
                }}>
                
                <Card 
                sx={{
                    border:'1px solid black',
                    borderRadius:'15px',
                    p:'10px',
                    '&:hover':{
                        border:'20px',
                        boxShadow:'0 0 25px rgba(0, 0, 0, 0.7)'
                    }
                    }}>
                    <CardMedia
                    component="img"
                    height="650px"
                    image={imgForStk}
                    alt={allStkDetails[0]?.collName}
                    sx={{objectFit:'contain'}}
                    />
                </Card>


            </Grid>

        {/*Stock Details Grid */}

            <Grid sx={{p:'20px',ml:'60px',mr:'20px',flexGrow:4,
                // border:'1px solid black'
                }}>
            
            {/*Collection Details */}
                <Paper
                elevation={15}
                sx={{
                    width:'100%',
                    p:'35px'
                }}
                >
                    <Typography sx={{fontWeight:'bold',fontSize:'3rem',mb:'5px'}}>{allStkDetails[0]?.collName}</Typography>
                    <Typography sx={{
                        mb:'40px'
                    }}><strong>Collection Type: </strong> {collType}</Typography>

                    <Box>
                        <Typography sx={{fontWeight:'bold',fontSize:'1rem',mb:'7px'}}> SIZES :</Typography>
                        
                        {uniqueSizes.map((size) => (
                            <Button 
                            key={size}
                            variant="outlined" 
                            sx={{
                            borderColor:'rgba(43, 195, 237, 1)',
                            color:'rgba(43, 195, 237, 1)',
                            borderRadius:'15px',
                            mb:'30px',
                            mr:'10px',
                            '&:hover':{
                                bgcolor:'rgba(43, 195, 237, 1)',
                                color:'white',
                                boxShadow:'0px 0px 20px  rgba(43, 195, 237, 1)'
                            },
                            // '&:active':{
                            //     border:'2px solid black'
                            // }
                            boxShadow: sizeIsActive===size ? '0px 0px 10px  rgba(43, 195, 237, 1)': "none"

                        }}
                        onClick={ () => {
                            setUserSelectedStk({size:size,color:'' });
                            setSizeIsActive(size);
                            setColorIsActive('');
                        }}
                        >{size}</Button>
                    ))}

                    </Box>

                    <Box >
                        <Typography sx={{fontWeight:'bold',fontSize:'1rem',mb:'7px'}}> COLOURS :</Typography>
                        
                        { uniqueColorsForSize.length === 0 ? (
                        
                        uniqueColors.map((color) => (
                        <Box 
                        key={color}
                        sx={{
                            display:'-webkit-inline-flex',
                            bgcolor:color,
                            border:'1px dotted black',
                            borderRadius:'50px',
                            width:'30px',
                            height:'30px',
                            mb:'30px',
                            mr:'10px',
                            color: color==='black'? 'white' : 'black',
                            transition:'box-shadow 0.2s ease',
                            '&:hover':{
                                cursor:'pointer',
                                boxShadow: '0px 0px 20px  rgba(43, 195, 237, 1)',
                                transform:'scale(1.1)'
                            },
                            boxShadow: colorIsActive===color ? '0px 0px 10px  rgba(43, 195, 237, 1)':"none"
                            // '&:active':{
                            //     border:'2px solid black'
                            // }
                            }}

                            onClick={ () => {
                                setUserSelectedStk((prevVal) => ({...prevVal,color: color }));
                                setColorIsActive(color)
                            }}
                            ></Box>
                        )) 
                        
                    ):(

                        uniqueColorsForSize.map((color) => (
                            <Box
                                key={color}
                                sx={{
                                display:'-webkit-inline-flex',
                                bgcolor:color,
                                border:'1px dotted black',
                                borderRadius:'50px',
                                width:'30px',
                                height:'30px',
                                mb:'30px',
                                mr:'10px',
                                color: color==='black'? 'white' : 'black',
                                transition:'box-shadow 0.5s ease',
                                '&:hover':{
                                    cursor:'pointer',
                                    boxShadow: '0px 0px 20px  rgba(43, 195, 237, 1)'
                                },
                                boxShadow: colorIsActive===color ? '0px 0px 10px  rgba(43, 195, 237, 1)': color==="white" ? '1px solid black' :"none"
                            // '&:active':{
                            //     border:'2px solid black'
                            // }
                            }}

                            onClick={ () => {
                                setUserSelectedStk((prevVal) => ({...prevVal,color: color }));
                                setColorIsActive(color) 
                            }}                            
                            ></Box>
                        ))
                    )}
                    </Box>

                    <Typography sx={{fontWeight:'bold',fontSize:'1rem'}}>Price: {priceForStk} RS.</Typography>

                    {notAvl && (
                        <Box sx={{display:'flex',gap:5}}>
                        <h5 style={{color:'red'}}>{notAvl}</h5>
                        <Button sx={{mt:'10px',bgcolor:'rgba(43, 195, 237, 1)',color:'white',height:'40px'}}> Notify Me !</Button>
                        </Box>
                        )}

                    
                    {/*Add Cart and Order Now */}
                    <Box sx={{mt:'30px',
                        display:'flex',
                        gap:6,
                        justifyContent:'center',
                        // border:'1px solid black'
                        }}>
                        <Button variant="outlined" color="rgba(43, 195, 237, 1)"
                        sx={{
                            color:'rgba(43, 195, 237, 1)',
                            fontWeight:'bold',
                            borderRadius:'10px',
                            '&:hover':{
                            boxShadow: '0px 0px 20px  rgba(43, 195, 237, 1)'                               
                            }   
                            }}
                        onClick={ () => handleAddToCart(stkId)}
                        disabled={!userSelectedStk.color || !userSelectedStk.size || notAvl}    
                        > Add To Cart <AddShoppingCartIcon/> </Button>

                        <Button variant="outlined" color="#12ac1cff"
                        sx={{
                            color:'#12ac1cff',
                            fontWeight:'bold',
                            borderRadius:'10px',
                            '&:hover':{
                            boxShadow: '0px 0px 20px #12ac1cff'                               
                            } 
                            }}
                        onClick={() => setDialogOpen(true)}
                        disabled={!userSelectedStk.color || !userSelectedStk.size || notAvl}    
                        > Order Now <CheckCircleIcon sx={{ml:'3px'}}/> </Button>
                    </Box>
                    { (!userSelectedStk.color || !userSelectedStk.size) ? (<h5 style={{color:'red'}}> ``Select Size and colour`` !</h5>) : ''}

      <Dialog open={dialogOpen} onClose={ () => setDialogOpen(false)}>
        <DialogTitle>Placing Order</DialogTitle>

        <DialogContent>

        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Quantity"
            name="quantity"
            value={userDetails.quantity}
            onChange={handleInput}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />

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
            multiline
            rows={4}
            label="Address"
            name="buyerAddress"
            value={userDetails.buyerAddress}
            onChange={handleInput}
            error={!!errors.buyerAddress}
            helperText={errors.buyerAddress}
          />

          {/*Radio button for Payment type */}
          <FormControl required>
            <FormLabel sx={{ fontWeight: "bold" }}>Payment Method:</FormLabel>

            <RadioGroup //here we create a radio group which consists of two radios by which we get which one is selected by user.Here we can set value of this radioGroup(means which radio button is userSelected)
              value={userDetails.paymentType}
              onChange={(e) =>
                setUserDetails((prevVal) => ({
                  ...prevVal,
                  paymentType: e.target.value,
                }))
              }
              sx={{display:'flex',flexDirection:'row'}}
              aria-required="true"
            >
              <FormControlLabel
                label="Cash On Delivery"
                control={<Radio />} //this control <Radio/> means that control the user input by radio button,it gives the radio button in UI and if user clicks that,we get the value="cashOnDelivery" which we give in below.
                value="cashOnDelivery"
              ></FormControlLabel>
              {/*another use <input type="radio" value="gpay"/><label for="gpay">Gpay</label>*/}

              <FormControlLabel
                label="Gpay"
                control={<Radio />}
                value="gpay"
              ></FormControlLabel>
              {/*It is nothing but very simple,that just we have the two radio button inside radio group,and track the user click on radio by giving a specific value for each radio->this value is setted on the mothama RadioGroup(like there we get the user click on which radio button)  */}
            </RadioGroup>
          </FormControl>
          {errors.paymentType && <h5 style={{color:'red'}}>{errors.paymentType}</h5>}
        </DialogContent>

        <DialogActions>
            <Button onClick={() => window.location.reload()}>Cancel</Button>
            
            <Button 
            onClick={handlePlaceOrder}
            disabled={loader}
            >{loader ? <CircularProgress size='25px' sx={{color:'black'}}/> : "Place Order"}</Button>
        </DialogActions>

      </Dialog>

                </Paper>

                {/*Other Details*/}

                <Paper
                elevation={15}
                sx={{
                    mt:'40px',
                    p:'35px',
                    width:'100%'
                }}
                >
                    <Typography sx={{fontWeight:'bold',fontSize:'3rem',mb:'5px'}}>Other Details</Typography>
                    <Typography sx={{fontWeight:'bold',mb:'15px'}}>Sizes Clarification : </Typography> 

                    <Box sx={{ml:'20px',mb:'20px'}}>
                    
                        <Typography sx={{fontFamily:'verdana',mb:'2px'}}> XS (Bust Size : 32 in, Length Size: 20 in) </Typography>

                        <Typography sx={{fontFamily:'verdana',mb:'2px'}}> S (Bust Size : 34 in, Length Size: 20 in) </Typography>

                        <Typography sx={{fontFamily:'verdana',mb:'2px'}}> M (Bust Size : 36 in, Length Size: 20 in) </Typography>

                        <Typography sx={{fontFamily:'verdana',mb:'2px'}}> L (Bust Size : 38 in, Length Size: 20 in) </Typography>

                        <Typography sx={{fontFamily:'verdana',mb:'2px'}}> XL (Bust Size : 40 in, Length Size: 20 in) </Typography>
                    </Box>

                    <Typography sx={{fontWeight:'bold',fontFamily:'serif',fontSize:'16px'}}> Order Will Be Dispatched In Two Days ✈️</Typography>
                    <Typography sx={{fontWeight:'bold',fontFamily:'serif',fontSize:'19px'}}> Country of Origin : India </Typography>

                </Paper>
            
            </Grid>

        </Grid>
    )

} 

export default StkForUserTemplate;