import { useEffect, useState } from "react";
import { fetchDeleteDataWithToken, fetchGetDataWithToken } from "../../client/client";
import { Button, Dialog, DialogActions, DialogTitle, Grid, Paper,Typography } from "@mui/material";
import { DangerousOutlined } from "@mui/icons-material";

const MyOrders = () => {

    const [ordersPlaced,setOrdersPlaced] = useState([]);
    const [ordersError,setOrdersError] = useState('');

    const [openDialog,setOpenDialog] = useState(false);
    const [orderCancelId,setOrderCancelId] = useState(null);

    useEffect( () => {

        const getOrderHistory = async() => {
            try{
                const res = await fetchGetDataWithToken('/order/view-orders');
                console.log("Order History is Taken Successfully",res.data);
                setOrdersPlaced(res.data);
        
            }catch(err){
                console.log("Error while getting Orders History",err.message)
                setOrdersError(err.response?.data || err.message);
            }
        }
        getOrderHistory();

    },[])

    const handleCancelOrder = async(orderId) => {
        console.log("ORDER ID WHICH COMES TO FUNC IS:",orderId);

            try{

                const res = await fetchDeleteDataWithToken(`/order/cancel/${orderId}`);
                const data = res.data;
                console.log("Order Cancel Successfully",data);

                setOrdersPlaced( (prevOrders) => (
                    prevOrders.filter( (order) => order.orderId !== orderId )
                ));

                setOpenDialog(false);
            }catch(err){

                console.log("Error while Canceling Order",err.message);
            }
        }

    return(
        <Grid >

            <Typography sx={{textAlign:'center',fontFamily:'serif',fontWeight:'bold',fontSize:'22px'}}>ORDERS HISTORY 🛍️</Typography>

            {ordersError && (
        <h5 style={{ color: "red", fontSize: "2rem" }}>{ordersError}</h5>
      )}

            {ordersPlaced.map( (order) => (
                <Grid item key={order.orderId} lg={12} sx={{padding:'20px'}}>

                    <Paper 
                    elevation={20}
                    sx={{
                        border:'1px solid black',
                        padding:'20px',
                        borderRadius:'20px',
                        transition:'transform 0.6s',
                        '&:hover':{
                            bgcolor:'#f0f0f0',
                            transform:'scale(1.03)',
                            boxShadow:'10px'
                        }
                        }}
                        >
                        <Typography sx={{mb:'5px'}}>Your Order Id: {order.orderId}</Typography>
                        <Typography sx={{mb:'5px'}}>Collection You Ordered: {order.collName}</Typography>
                        <Typography sx={{mb:'5px'}}>Quantity: {order.quantity}</Typography>
                        <Typography>Order Delivery At: {order.deliverTime}</Typography>
                        <Button
                        variant="outlined"
                        color="red"
                        sx={{
                            color:'red',
                            width:'100px',
                            borderRadius:'13px',
                            ml:'950px',
                            '&:hover':{
                                bgcolor:'#ff0000ff',
                                color:'white',
                            }
                        }}
                        onClick={() =>{
                            setOrderCancelId(order.orderId);
                            setOpenDialog(true);
                        }}
                        ><DangerousOutlined/>Cancel</Button>
                    </Paper>
                </Grid>
            ))}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    Are You Sure To Cancel Order ?
                </DialogTitle>
                <DialogActions>
                    <Button 
                    onClick={ () => setOpenDialog(false)}
                    > Exit </Button>
                    <Button
                    color='error'
                    onClick={() => handleCancelOrder(orderCancelId)}
                    > Cancel </Button>
                </DialogActions>
            </Dialog>

        </Grid>
    )

}

export default MyOrders;