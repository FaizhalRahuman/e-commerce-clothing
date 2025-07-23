
import React,{useEffect, useState} from 'react';
import {useNavigate,Link,useLocation} from 'react-router-dom';

import { Card,CardContent,TextField,Button, Box, Typography } from '@mui/material'

import {fetchPostData} from '../../client/client';

const Login = () =>{

    const location = useLocation();
    const queryParams =  new URLSearchParams(location.search);
    const tokenSent = queryParams.get("token");

    const navigate = useNavigate();
    const [formData,setFormData] = useState({nameOrEmail:'',password:''});
    const [errors,setErrors] = useState({nameOrEmail:'',password:''});
    const [loginError,setLoginError] = useState('');

    const handleInput = (e) => {

      const {name,value} = e.target;

      setFormData ( (prevVal) => (
        {
          ...prevVal,
          [name]:value
        }
      ));

    }

    const handleLogin = (e) => {

      e.preventDefault();

      let isValid = true;

      if(!formData.nameOrEmail.trim()){

        setErrors( (prevVal) => (
          {
            ...prevVal,
            namOrEmail:'This Field Cannot Be Empty'
          }
        ));
        isValid = false;
      }

      if(!formData.password.trim()){
        setErrors( (prevVal) => (
          {
            ...prevVal,
            password:'This Field Cannot Be Empty'
          }
        ));
        isValid=false;
      }

      if(isValid){

      fetchPostData('/auth/login/token',formData)
      .then( (res) => {
        localStorage.setItem("token",res.data);
        console.log("The Response For Posting Login Data:",res.data);
        navigate('/')
      }
      ).catch( (err) => {
        setLoginError(err.response.data)
        console.log("Error While Postin Data in Login:",err.response);
      })
    }

    }


     return (
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
            Please login to your account
          </Typography>

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Name or Email"
            name="nameOrEmail"
            value={formData.name} 
            onChange={handleInput} 
            error={!!errors.name} 
            helperText={errors.name} 
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label= { tokenSent ? "Enter Token" : "Password" }
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInput}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Box sx={{ display:'flex', justifyContent:'space-between', textAlign: "right", my: 1 }} fullWidth>
            <Link to="/account/register" style={{ textDecoration: "none", color: "#1976d2", fontSize: "14px" }}>
              Don't have account !
            </Link>
            <Link to="/account/forget-password" style={{ textDecoration: "none", color: "#1976d2", fontSize: "14px" }}>
              Forgot Password?
            </Link>
          </Box>

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
            onClick={handleLogin}
          >
            LOGIN
          </Button>
           {loginError && <h5 style={{ color: 'red',fontSize: '2rem'}}>{loginError}</h5>}
        </CardContent>
      </Card>
    </Box>

  );
}

export default Login;