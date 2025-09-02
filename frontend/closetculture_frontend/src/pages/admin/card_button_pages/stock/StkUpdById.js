import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchGetDataWithToken, fetchPutDataWithToken } from "../../../../client/client";

import { Button, Container, TextField } from "@mui/material";

import Header from "../../../../component/layout/Header";

const StkUpdById = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stkId = queryParams.get('id');

    const [stkDetails,setStkDetails] = useState({stkId:'',size:'',color:'',rate:'',stockAvl:0});
    const [errors,setErrors] = useState({stkId:'',size:'',color:'',rate:'',stockAvl:''});

    const [getStockError,setGetStockError] = useState('');
    const [updStkSuccess,setUpdStkSuccess] = useState('');
    const [updStkError,setUpdStkError] = useState('');

    useEffect( () =>{
        setStkDetails((prevVal) => ({...prevVal,stkId:stkId}));
        setGetStockError('');
        setUpdStkSuccess('');
        setUpdStkError('');
    },[stkId])

    useEffect( () => {

        if(getStockError || updStkSuccess || updStkError){

            setTimeout( () => {
                setGetStockError('');
                setUpdStkSuccess('');
                setUpdStkError(''); 
            },1000);
        }

    },[getStockError,updStkSuccess,updStkError])


    useEffect( () => {

    if(stkDetails.stkId === '') return;

    fetchGetDataWithToken(`/stock/view-by-stkId/${stkDetails.stkId}`)
    .then( (res) => {
        const data = res.data;
        setStkDetails({stkId:String(data.stkId), size:data.size, color:data.color, rate:data.rate, stockAvl:data.stock});
        console.log(`Successfully Stock Taken By Stock Id:${stkDetails.stkId}`,res.data);
    }).catch( (err) => {
        setGetStockError("No Stock Id Exist! Please Give Valid Stock Id.")
        console.log("Error while Getting Stock By stkId in StkUpdById.js",err.message)
    })

},[stkDetails.stkId])

    const updStock = (e) => {

        e.preventDefault();

        let isValid = true;

        setErrors({stkId:'',size:'',color:'',rate:'',stockAvl:''})

        if(!stkDetails.stkId.trim()){

            setErrors( (prevVal) => (
            {
                ...prevVal,
                stkId:'This Field Cannot Be Empty'
            }
            ));
            isValid = false;
        }

        if(!stkDetails.size.trim()){

            setErrors( (prevVal) => (
            {
                ...prevVal,
                size:'This Field Cannot Be Empty'
            }
            ));
            isValid = false;
        }

        if(!stkDetails.color.trim()){
            setErrors( (prevVal) => (
            {
                ...prevVal,
                color:'This Field Cannot Be Empty'
            }
            ));
            isValid=false;
        }

        if(!stkDetails.rate.trim()){
            setErrors( (prevVal) => (
            {
                ...prevVal,
                rate:'This Field Cannot Be Empty'
            }
            ));
            isValid=false;
        }

        if(!String(stkDetails.stockAvl).trim()){
            setErrors( (prevVal) => (
            {
                ...prevVal,
                stockAvl:'This Field Cannot Be Empty'
            }
            ));
            isValid=false;
        }

        if(isValid){

        fetchPutDataWithToken(`/stock/update-by-id/${stkDetails.stkId}`,{size:stkDetails.size,color:stkDetails.color,rate:stkDetails.rate,stockAvl:stkDetails.stockAvl})
        .then( (res) => {
            console.log(`Successfully Stock Updated for Stock Id:${stkDetails.stkId}`)
            setUpdStkSuccess("Successfully Stock updated!")
        }).catch ( (err) => {
            console.log("Error while Puting(updating) Stock data in StkUpdById.js:",err.message);
            setUpdStkError(err.response.data);
        })
    }
    }

    const handleInput = (e) => {

        const {name,value} = e.target;
        
        setStkDetails( (prevVal) => (
            {
                ...prevVal,
                [name]:value
            }
        ))
    }

    return(
        <>
        <Header/>
        <Container component="main" maxWidth="xs">

           <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Stock Id"
            name="stkId"
            value={stkDetails.stkId} 
            onChange={handleInput} 
            error={!!errors.stkId} 
            helperText={errors.stkId} 
            />

            <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Size"
            name="size"
            value={stkDetails.size} 
            onChange={handleInput} 
            error={!!errors.size} 
            helperText={errors.size} 
            />

            <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Colour"
            name="color"
            value={stkDetails.color} 
            onChange={handleInput} 
            error={!!errors.color} 
            helperText={errors.color} 
            />

            <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Rate"
            name="rate"
            value={stkDetails.rate} 
            onChange={handleInput} 
            error={!!errors.rate} 
            helperText={errors.rate} 
            />

            <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Stock Available"
            name="stockAvl"
            value={stkDetails.stockAvl} 
            onChange={handleInput} 
            error={!!errors.stockAvl} 
            helperText={errors.stockAvl} 
            />

            <Button variant="contained" fullWidth color="primary" onClick={updStock}>
                Update Stock
            </Button>
            {getStockError && <h5 style={{color:'red'}}>{getStockError}</h5>}
            {updStkSuccess && <h5 style={{ color: 'green' }}>{updStkSuccess}</h5>}
            {updStkError && <h5 style={{ color: 'red' }}>{updStkError}</h5>}

        </Container>
        </>
    )


}

export default StkUpdById;