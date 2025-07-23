import { useLocation} from "react-router-dom";
import {useState,useEffect} from 'react';

import { fetchGetDataWithToken } from "../../../../client/client";
import { Typography, Box, Paper } from "@mui/material";

import Header from "../../../../component/layout/Header";

const ProdViewByPrdId = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const prdId = queryParams.get('id');

    const [prdDetails ,setPrdDetails] = useState('');
    const[prdError,setPrdError] = useState('');

    useEffect( () => {

        fetchGetDataWithToken(`/product/view-by-prdId/${prdId}`)
        .then((res) => {
            console.log(`Product Details For Id:${prdId}`,res.data);
            setPrdDetails(res.data);
        }).catch( (err) => {
            setPrdError(err.response.data);
            console.log("Error while viewing Product by prdId in ProdViewByPrdId.js",err.message);
        })

    },[prdId]) //--> i give prdId here because of just warning which we have to put the variable in dependency array,which we use inside useeffect()


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
        {prdError && <h5 style={{ color: 'red' }}>{prdError}</h5>}
        </Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Product Details
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>ID:</strong> {prdDetails.prdId}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {prdDetails.prdName}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Price Range:</strong> {prdDetails.priceRange    }
            </Typography>
        </Box> 
        </>
    )
}

export default ProdViewByPrdId;