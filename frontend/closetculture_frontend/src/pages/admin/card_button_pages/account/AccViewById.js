import { useLocation} from "react-router-dom";
import {useState,useEffect} from 'react';

import { fetchGetDataWithToken } from "../../../../client/client";
import { Typography, Box, Paper } from "@mui/material";

import Header from "../../../../component/layout/Header";


const AccViewById = () => {

    // const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const accId = queryParams.get('id');

    const [accDetails ,setAccountDetails] = useState('');
    const[accError,setAccError] = useState('');

    useEffect( () => {

        fetchGetDataWithToken(`/account/view-by-id/${accId}`)
        .then((res) => {
            console.log(`Account Details For Id:${accId}`,res.data);
            setAccountDetails(res.data);
        }).catch( (err) => {
            setAccError(err.response.data);
            console.log("Error while viewing account by accId in AccViewById.js",err.message);
        })

    },[accId]) //--> i give accId here because of just warning which we have to put the variable in dependency array,which we use inside useeffect()


    return(
        <>
        <Header/>
        <Box
            component={Paper}
            elevation={4}
            sx={{
                maxWidth: 400,
                margin: "30px auto",
                padding: "20px",
                borderRadius: "15px",
                backgroundColor: "#f9f9f9",
            }}
            >
        <Box>
        {accError && <h5 style={{ color: 'red' }}>{accError}</h5>}
        </Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Account Details
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>ID:</strong> {accDetails.accId}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {accDetails.name}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {accDetails.email}
            </Typography>

            <Typography variant="body1">
                <strong>Authority:</strong> {accDetails.authority}
            </Typography>
        </Box> 
        </>
    )

}

export default AccViewById;