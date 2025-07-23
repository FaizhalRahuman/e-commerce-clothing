import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchGetDataWithToken, fetchPutDataWithToken } from "../../../../client/client";

import { Button, Container, TextField } from "@mui/material";

import Header from "../../../../component/layout/Header";

const ProdUpdById = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const prdId = queryParams.get('id');

    const [prdDetails,setPrdDetails] = useState({prdId:'',prdName:'',priceRange:''});
    const [errors,setErrors] = useState({prdId:'',prdName:'',priceRange:''});

    const [getProductError,setGetProductError] = useState('');
    const [updPrdSuccess,setUpdPrdSuccess] = useState('');
    const [updPrdError,setUpdPrdError] = useState('');

    useEffect( () =>{
        setPrdDetails((prevVal) => ({...prevVal,prdId:prdId}));
        setGetProductError('');
        setUpdPrdSuccess('');
        setUpdPrdError('');
    },[])

    useEffect( () => {

        if(getProductError || updPrdSuccess || updPrdError){

            setTimeout( () => {
                setUpdPrdSuccess('');
                setUpdPrdError('');
                setGetProductError(''); 
            },1000);
        }

    },[getProductError,updPrdSuccess,updPrdError])


    useEffect( () => {

    if(!prdDetails.prdId) return;

    fetchGetDataWithToken(`/product/view-by-prdId/${prdDetails.prdId}`)
    .then( (res) => {
        const data = res.data;
        setPrdDetails({prdId:String(data.prdId), prdName:data.prdName, priceRange:data.priceRange});
        console.log(`Successfully Product Taken By Product Id:${prdDetails.prdId}`,res.data);
    }).catch( (err) => {
        setGetProductError("No Product Id Exist! Please Give Valid Product Id.")
        console.log("Error while Getting Product By PrdId in PrdUpdById.js",err.message)
    })

},[prdDetails.prdId])

    const updProduct = (e) => {

        e.preventDefault();

        let isValid = true;

        setErrors({prdId:'',prdName:'',priceRange:''})

        if(!prdDetails.prdId.trim()){

            setErrors( (prevVal) => (
            {
                ...prevVal,
                prdId:'This Field Cannot Be Empty'
            }
            ));
            isValid = false;
        }

        if(!prdDetails.prdName.trim()){

            setErrors( (prevVal) => (
            {
                ...prevVal,
                prdName:'This Field Cannot Be Empty'
            }
            ));
            isValid = false;
        }

        if(!prdDetails.priceRange.trim()){
            setErrors( (prevVal) => (
            {
                ...prevVal,
                priceRange:'This Field Cannot Be Empty'
            }
            ));
            isValid=false;
        }

        if(isValid){

        fetchPutDataWithToken(`/product/update-by-id/${prdDetails.prdId}`,{prdName:prdDetails.prdName,priceRange:prdDetails.priceRange})
        .then( (res) => {
            console.log(`Successfully Product Updated for Product Id:${prdDetails.prdId}`)
            setUpdPrdSuccess("Successfully Product updated!")
        }).catch ( (err) => {
            console.log("Error while Puting(updating) Product data in PrdUpdById.js:",err.message);
            setUpdPrdError(err.response.data);
        })
    }
    }

    const handleInput = (e) => {

        const {name,value} = e.target;
        
        setPrdDetails( (prevVal) => (
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
            label="Product Id"
            name="prdId"
            value={prdDetails.prdId} 
            onChange={handleInput} 
            error={!!errors.prdId} 
            helperText={errors.prdId} 
            />

            <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Product Name"
            name="prdName"
            value={prdDetails.prdName} 
            onChange={handleInput} 
            error={!!errors.prdName} 
            helperText={errors.prdName} 
            />

            <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Price Range"
            name="priceRange"
            value={prdDetails.priceRange} 
            onChange={handleInput} 
            error={!!errors.priceRange} 
            helperText={errors.priceRange} 
            />

            <Button variant="contained" fullWidth color="primary" onClick={updProduct}>
                Update Product
            </Button>
            {getProductError && <h5 style={{color:'red'}}>{getProductError}</h5>}
            {updPrdSuccess && <h5 style={{ color: 'green' }}>{updPrdSuccess}</h5>}
            {updPrdError && <h5 style={{ color: 'red' }}>{updPrdError}</h5>}

        </Container>
        </>
    )

}

export default ProdUpdById;