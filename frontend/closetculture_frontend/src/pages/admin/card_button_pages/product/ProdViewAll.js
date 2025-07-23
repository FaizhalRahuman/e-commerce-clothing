import { useEffect, useState } from "react";
import { fetchGetDataWithToken } from "../../../../client/client"; 

import {Box, Typography, Paper, Grid} from '@mui/material';

import Header from "../../../../component/layout/Header";

const ProdViewAll = () => {

    const[allPrdDetails,setAllPrdDetails] = useState([]);

    useEffect( () => {

        fetchGetDataWithToken(`/product/view-all`)
        .then( (res) => {

            console.log("All Product Details:",res.data);
            setAllPrdDetails(res.data);
        }).catch( (err) => {
            console.log("Error While Viewing All Products in ProdViewAll.js",err.message);
        })

    },[])

    return(
      <>
      <Box position="fixed" sx={{zIndex:1,width:'100%'}}>
      <Header/>
      </Box>
      <Box sx={{ px: 2, py: 4, pt:12 }}>
      <Grid container spacing={3} justifyContent="center">
        {allPrdDetails.map((prdDetail) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={prdDetail.prdId}>
            <Paper
              elevation={4}
              sx={{
                padding: "20px",
                borderRadius: "15px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Product Detail
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>ID:</strong> {prdDetail.prdId}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {prdDetail.prdName}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Price Range:</strong> {prdDetail.priceRange}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
    )

}

export default ProdViewAll;