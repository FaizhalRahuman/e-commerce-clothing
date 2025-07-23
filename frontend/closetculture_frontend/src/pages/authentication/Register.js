 
import { React,useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Card,CardContent,TextField,Button, Box, Typography } from '@mui/material'
import {fetchPostData} from '../../client/client';


 const Register = () =>{

    const navigate = useNavigate();
    const [formData,setFormData] = useState({name:'', email:'', password:''});
    const [errors,setErrors] = useState({name:'',email:'', password:''});
    const [registerError,setRegisterError] = useState('');

    const handleInput = (e) =>{

        const {name,value} = e.target;

        setFormData( (prevVal) =>(
            {
             ...prevVal ,
            [name] : value
            }
    ));
}

    const validEmail = () => {

        const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regExp.test(formData.email)
    }

    const validPassword = () =>{
        return formData.password.length > 3;
    }

    const handleRegister = (e) => {

        e.preventDefault();

        setErrors({name:'',email:'',password:''});

        let isValid = true;

        if(!formData.name.trim()){
          setErrors((prevVal) =>(
            {
              ...prevVal,
              name:'Field Cannot Be Empty'
            }
          ));
        }

        if(validEmail() === false){
            setErrors((prevVal) =>(
                {
                    ...prevVal ,
                    email:"Email is not Valid" 
                }
            ));
            isValid = false;
        }

        if(validPassword() === false){

            setErrors((prevVal) => (
                {
                    ...prevVal,
                    password:"Password length must be greater than 3"
                }
            ));
            isValid = false;
        }

        if(isValid){

        fetchPostData('/account/register',formData)
        .then( (res) => {
            console.log("The Response For Posting Register Data:"+res.data);
            navigate('/account/login');

        }).catch( (err) => {
                            setRegisterError( () => (err.response.data));
                            console.log("Error While Postin Data in Register",err.message);
                          });
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
            Ready To Style 🧥
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
            Please register to dive in!
          </Typography>

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Name:"
            name="name"
            value={formData.name} 
            onChange={handleInput} 
            error={!!errors.name} 
            helperText={errors.name} 
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            value={formData.email} 
            onChange={handleInput} 
            error={!!errors.email} 
            helperText={errors.email}
          />

          <TextField
            variant="outlined"
            margin="normal"     
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInput}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Link to='/account/login' style={{textDecoration:'none',fontSize:'14px',color: "#1976d2"}}>
          Already have account!
          </Link>

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
            onClick={handleRegister}
          >
            Register
          </Button>
           {registerError && <p style={{ color: 'red' }}>{registerError}</p>}
        </CardContent>
      </Card>
    </Box>

  );

}

export default Register;