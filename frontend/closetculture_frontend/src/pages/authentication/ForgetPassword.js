import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import { fetchPostData } from "../../client/client";

import {Box,Card,CardContent,Typography,TextField,Button} from '@mui/material'

const ForgetPassword = () => {

    const navigate = useNavigate();

    const [email,setEmail] = useState('');
    const [info,setInfo] = useState('');
    const [emailError,setEmailError] = useState('');
    const [tokenError,setTokenError] = useState('');

    const handleTokenMail = () => {

        let isValid=true;
        setEmailError('');

        if(!email.trim()){
            setEmailError('Cannot Be Empty');
            isValid=false;
        }

        if(isValid){

            const tokenSending = async() => {

                try{
                    setInfo("Secret Code Will be Sent to 'Your Email' Please Use It to Login and Change It with your own password afterwards")
                    const res = await fetchPostData("/account/forget-password",{registeredEmail:email});
                    const data = res.data;
                    console.log("Response Data For Token Sending via Email:",data);
                    navigate("/account/login?token=true");
                }catch(err){
                    console.log("Error while sending token to mail in ForgetPassword.js",err.message);
                    setTokenError(err.response?.data || err.message);
                }
                 
            }
            tokenSending();
        }
    }

    return(

        <Box
        sx={{
            minHeight: "100vh",
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}        
        >
        <Card sx={{ width: 400, p: 3, boxShadow: 10, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            Welcome Back 👋
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
            Forget Password:No Worries 😎
          </Typography>

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Registered Email"
            name="email"
            value={email} 
            onChange={ (e) => setEmail(e.target.value)} 
            error={!!emailError} 
            helperText={emailError} 
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              fontWeight: "bold",
              mt: 2,
              py: 1.3,
              borderRadius: "10px",
              '&:hover': {
                backgroundColor: "#115293",
              },
            }}
            onClick={handleTokenMail}
          >
            Get Mail
          </Button>
           {info && <h6 style={{ color: 'orange',fontSize: '1rem'}}>{info}</h6>}
           {tokenError && <h7 style={{ color: 'red',fontSize: '1rem'}}>{tokenError}</h7>}
        </CardContent>
      </Card>
    </Box>
    )


}

export default ForgetPassword;