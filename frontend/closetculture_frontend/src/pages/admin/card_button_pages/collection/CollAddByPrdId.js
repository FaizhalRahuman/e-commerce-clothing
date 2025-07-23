import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchPostDataWithToken } from "../../../../client/client";

import { Container, Button, TextField} from '@mui/material'

import Header from "../../../../component/layout/Header";

const CollAddByPrdId = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const prdId = queryParams.get('id');

    const [collDetails,setCollDetails] = useState({prdId:'',collName:'',collType:''});
    const [errors,setErrors] = useState({prdId:'',collName:'',collType:''});
    const [addCollSuccess,setAddCollSuccess] = useState('');
    const [addCollError,setAddCollError] = useState('');

    useEffect( () => {
        setCollDetails((prevVal) => ({...prevVal,prdId:prdId}));
    },[prdId])

    useEffect( () => {

        if(addCollSuccess || addCollError){

            setTimeout( () => {
                setAddCollError('');
                setAddCollSuccess(''); 
            },1000);
        }

    },[addCollSuccess,addCollError])

    const addCollection = (e) => {

        e.preventDefault();

        let isValid = true;

        setErrors({prdId:'',collName:'',collType:''})

        if(!collDetails.prdId.trim()){

            setErrors( (prevVal) => (
            {
                ...prevVal,
                prdId:'This Field Cannot Be Empty'
            }
            ));
            isValid = false;
        }

        if(!collDetails.collName.trim()){

            setErrors( (prevVal) => (
            {
                ...prevVal,
                collName:'This Field Cannot Be Empty'
            }
            ));
            isValid = false;
        }

        if(!collDetails.collType.trim()){
            setErrors( (prevVal) => (
            {
                ...prevVal,
                collType:'This Field Cannot Be Empty'
            }
            ));
            isValid=false;
        }

        if(isValid){

        fetchPostDataWithToken(`/collection/add/${collDetails.prdId}`,{collName:collDetails.collName,collType:collDetails.collType})
        .then( (res) => {
            console.log(`Successfully Collection Added in Prd:${collDetails.prdId}`)
            setAddCollSuccess("Successfully Collection Added!")
        }).catch ( (err) => {
            console.log("Error while Posting(add) Collection data in CollAddByPrdId.js:",err.message);
            setAddCollError(err.response.data);
        })
    }
    }

    const handleInput = (e) => {

        const {name,value} = e.target;
        
        setCollDetails( (prevVal) => (
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
            value={collDetails.prdId} 
            onChange={handleInput} 
            error={!!errors.prdId} 
            helperText={errors.prdId} 
            />

            <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Collection Name"
            name="collName"
            value={collDetails.collName} 
            onChange={handleInput} 
            error={!!errors.collName} 
            helperText={errors.collName} 
            />

            <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Collection Type"
            name="collType"
            value={collDetails.collType} 
            onChange={handleInput} 
            error={!!errors.collType} 
            helperText={errors.collType} 
            />

            <Button variant="contained" fullWidth color="primary" onClick={addCollection}>
                Add Collection
            </Button>
            {addCollSuccess && <h5 style={{ color: 'green' }}>{addCollSuccess}</h5>}
            {addCollError && <h5 style={{ color: 'red' }}>{addCollError}</h5>}

        </Container>
        </>
    )

}

export default CollAddByPrdId;