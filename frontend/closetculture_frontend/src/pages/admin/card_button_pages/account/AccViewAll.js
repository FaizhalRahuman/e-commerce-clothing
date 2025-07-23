import { useEffect, useState } from "react";
import { fetchGetDataWithToken } from "../../../../client/client"; 

import {Box, Typography, Paper, Grid} from '@mui/material';

import Header from "../../../../component/layout/Header";


const AccViewAll = () => {

    const[allAccDetails,setAllAccountDetails] = useState([]);

    useEffect( () => {

        fetchGetDataWithToken(`/account/view-all`)
        .then( (res) => {

            console.log("All Account Details:",res.data);
            setAllAccountDetails(res.data);
        }).catch( (err) => {
            console.log("Error While Viewing All Accounts in AccViewAll.js",err.message);
        })

    },[])

    return(
      <>
      <Box position="fixed" sx={{zIndex:1,width:'100%'}}>
      <Header/>
      </Box>
      <Box sx={{ px: 2, py: 4,pt:'96px' }}>
      <Grid container spacing={3} justifyContent="center">
        {allAccDetails.map((accDetail) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={accDetail.accId}>
            <Paper
              elevation={4}
              sx={{
                padding: "20px",
                borderRadius: "15px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Account Detail
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>ID:</strong> {accDetail.accId}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {accDetail.name}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {accDetail.email}
              </Typography>

              <Typography variant="body1">
                <strong>Authority:</strong> {accDetail.authority}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
    )

}

export default AccViewAll;