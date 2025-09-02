import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchGetDataWithToken, fetchPutDataWithToken } from "../../../../client/client";

import { Button, Container, TextField } from "@mui/material";

import Header from "../../../../component/layout/Header";

const CollUpdById = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const collId = queryParams.get('id');

    const [collDetails,setCollDetails] = useState({collId:'',collName:'',collType:''});
    const [errors,setErrors] = useState({collId:'',collName:'',collType:''});

    const [getCollectionError,setGetCollectionError] = useState('');
    const [updCollSuccess,setUpdCollSuccess] = useState('');
    const [updCollError,setUpdCollError] = useState('');

    useEffect( () =>{
        setCollDetails((prevVal) => ({...prevVal,collId:collId}));
        setGetCollectionError('');
        setUpdCollSuccess('');
        setUpdCollError('');
    },[collId]) //--- collId

    useEffect( () => {

        if(getCollectionError || updCollSuccess || updCollError){

            setTimeout( () => {
                setUpdCollSuccess('');
                setUpdCollError('');
                setGetCollectionError(''); 
            },1000);
        }

    },[getCollectionError,updCollSuccess,updCollError])


    useEffect( () => {

    if(!collDetails.collId) return;

    fetchGetDataWithToken(`/collection/view-by-collId/${collDetails.collId}`)
    .then( (res) => {
        const data = res.data;
        setCollDetails({collId:String(data.collId), collName:data.collName, collType:data.collType});
        console.log(`Successfully Collection Taken By Collection Id:${collDetails.collId}`,res.data);
    }).catch( (err) => {
        setGetCollectionError("No Collection Id Exist! Please Give Valid Collection Id.")
        console.log("Error while Getting Collection By CollId in CollUpdById.js",err.message)
    })

},[collDetails.collId])

    const updCollection = (e) => {

        e.preventDefault();

        let isValid = true;

        setErrors({collId:'',collName:'',collType:''})

        if(!collDetails.collId.trim()){

            setErrors( (prevVal) => (
            {
                ...prevVal,
                collId:'This Field Cannot Be Empty'
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

        fetchPutDataWithToken(`/collection/update-by-id/${collDetails.collId}`,{collName:collDetails.collName,collType:collDetails.collType})
        .then( (res) => {
            console.log(`Successfully Collection Updated for Collection Id:${collDetails.collId}`)
            setUpdCollSuccess("Successfully Collection updated!")
        }).catch ( (err) => {
            console.log("Error while Puting(updating) Collection data in CollUpdById.js:",err.message);
            setUpdCollError(err.response.data);
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
            label="collection Id"
            name="collId"
            value={collDetails.collId} 
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

            <Button variant="contained" fullWidth color="primary" onClick={updCollection}>
                Update Collection
            </Button>
            {getCollectionError && <h5 style={{color:'red'}}>{getCollectionError}</h5>}
            {updCollSuccess && <h5 style={{ color: 'green' }}>{updCollSuccess}</h5>}
            {updCollError && <h5 style={{ color: 'red' }}>{updCollError}</h5>}

        </Container>
        </>
    )

}

export default CollUpdById;