import { useEffect,useState } from "react";

import { fetchPostDataWithToken } from "../../../../client/client";

import { Container,TextField,Button } from "@mui/material";

import Header from "../../../../component/layout/Header";


const ProdAdd = () => {

    const [prdDetails,setPrdDetails] = useState({prdName:'',priceRange:''});
    const [errors,setErrors] = useState({prdName:'',priceRange:''});
    const [addPrdSuccess,setAddPrdSuccess] = useState('');
    const [addPrdError,setAddPrdError] = useState('');

    useEffect( () => {

        if(addPrdSuccess || addPrdError){

            setTimeout( () => {
                setAddPrdError('');
                setAddPrdSuccess(''); 
            },1000);
        }

    },[addPrdSuccess,addPrdError])

    const addProduct = (e) => {

        e.preventDefault();

        let isValid = true;

        setErrors({prdName:'',priceRange:''})

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
            isValid = false;
        }

        if(isValid){

        fetchPostDataWithToken(`/product/add`,{prdName:prdDetails.prdName,priceRange:prdDetails.priceRange})
        .then( (res) => {
            console.log(`Successfully Product Added !`)
            setAddPrdSuccess("Successfully Product Added!")
        }).catch ( (err) => {
            console.log("Error while Posting(add) Product data in ProdAdd.js:",err.message);
            setAddPrdError(err.response.data);
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

            <Button variant="contained" fullWidth color="primary" onClick={addProduct}>
                Add Product
            </Button>
            {addPrdSuccess && <h5 style={{ color: 'green' }}>{addPrdSuccess}</h5>}
            {addPrdError && <h5 style={{ color: 'red' }}>{addPrdError}</h5>}

        </Container>
        </>
    )
}

export default ProdAdd;