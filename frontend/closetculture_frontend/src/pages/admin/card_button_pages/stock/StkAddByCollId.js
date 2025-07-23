import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchGetDataWithToken, fetchPostDataWithToken } from "../../../../client/client";

import { Container, Button, TextField} from '@mui/material';

import Header from "../../../../component/layout/Header";

const StkAddByCollId = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const collId = queryParams.get('id');

    const [collName,setCollName] = useState('');
    const [collIdError,setCollIdError] = useState('');
    
    const [stkDetails,setStkDetails] = useState({collId:'',size:'',color:'',rate:'',stockAvl:0});
    const [errors,setErrors] = useState({collId:'',size:'',color:'',rate:'',stockAvl:''});
    const [addStkSuccess,setAddStkSuccess] = useState('');
    const [addStkError,setAddStkError] = useState('');

    useEffect( () => {
        setStkDetails((prevVal) => ({...prevVal,collId:collId}));
    },[collId])

    useEffect( () => {

        if(!stkDetails.collId) return;

        fetchGetDataWithToken(`/collection/view-by-collId/${stkDetails.collId}`)
        .then( (res) => {
            console.log("Successfully Taken collection for CollId:"+stkDetails.collId,res.data)
            setCollName(res.data.collName);
            
        }).catch( (err) => {
            console.log("Error while Getting collection for CollId:"+stkDetails.collId,err.message);
            setCollIdError('Enter a Valid Id!');
        })

    },[stkDetails.collId])

    useEffect( () => {

        if(collIdError || addStkSuccess || addStkError){

            setTimeout( () => {
                setAddStkSuccess('');
                setAddStkError('');
                setCollIdError('');
            },1000);
        }

    },[collIdError,addStkSuccess,addStkError])

    const addStock = (e) => {

        e.preventDefault();

        let isValid = true;

        setErrors({collId:'',size:'',color:'',rate:'',stockAvl:''})

        if(!stkDetails.collId.trim()){

            setErrors( (prevVal) => (
            {
                ...prevVal,
                collId:'This Field Cannot Be Empty'
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

        fetchPostDataWithToken(`/stock/add/${stkDetails.collId}`,{size:stkDetails.size,color:stkDetails.color,rate:stkDetails.rate,stockAvl:stkDetails.stockAvl})
        .then( (res) => {
            console.log(`Successfully Stock Added in collection:${stkDetails.collId}`)
            setAddStkSuccess("Successfully Stock Added!")
        }).catch ( (err) => {
            console.log("Error while Posting(add) Stock data in StkAddByCollId.js:",err.message);
            setAddStkError(err.response.data);
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
            label="Collection Id"
            name="collId"
            value={stkDetails.collId} 
            onChange={handleInput} 
            error={!!errors.collId} 
            helperText={errors.collId} 
            />

           <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Collection Name"
            name="collName"
            value={collName} 
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

            <Button variant="contained" fullWidth color="primary" onClick={addStock}>
                Add Stock
            </Button>
            {collIdError && <h5 style={{ color: 'red' }}>{collIdError}</h5> }
            {addStkSuccess && <h5 style={{ color: 'green' }}>{addStkSuccess}</h5>}
            {addStkError && <h5 style={{ color: 'red' }}>{addStkError}</h5>}

        </Container>
        </>
    )

}

export default StkAddByCollId;