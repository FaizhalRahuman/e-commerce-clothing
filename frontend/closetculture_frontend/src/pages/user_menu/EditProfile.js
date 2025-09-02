import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGetDataWithToken,fetchPutDataWithToken } from "../../client/client";
import { Container } from "@mui/system";
import { Button, TextField, Typography } from "@mui/material";

const EditProfile = () => {

    const navigate = useNavigate();
    const [formData,setFormData] = useState({name:'',email:''})
    const [errors,setErrors] = useState({name:'',email:''})

    const [updError,setUpdError] = useState('');



useEffect( () => {

      if(!localStorage.getItem("token")){
        navigate('/account/login');
      }

      const token = localStorage.getItem("token");
      const detailsFromToken = jwtDecode(token);

      const accId = detailsFromToken.accId;

      const getUserDetails = async() => {

      try{
        const res = await fetchGetDataWithToken(`/account/view-by-id/${accId}`);
        console.log(`Account Taken for Email: ${accId}`,res.data);
        setFormData({name:res.data.name,email:res.data.email});
      }catch(err){
        console.log("Error while getting account by Id in AccountInfo.js",err.message);
      }
    } 
    getUserDetails();

  },[navigate]) //--- navigate

  const updAcc = async() => {

    let isValid = true

    if(!formData.name.trim()){

        setErrors( (prevVal) => (
          {
            ...prevVal,
            name:'This Field Cannot Be Empty'
          }
        ));
        isValid = false;
      }

      if(!formData.email.trim()){
        setErrors( (prevVal) => (
          {
            ...prevVal,
            email:'This Field Cannot Be Empty'
          }
        ));
        isValid=false;
      }

      if(isValid){
        
        try{
            const res = await fetchPutDataWithToken('/account/update',formData)
            console.log("Successfully Updated",res.data);
            navigate('/account/logout?accUpdate=true');
        }catch(err){
            console.log("Error while updating the Account details",err.message)
            setUpdError(err.response?.data || err.message);
        }    
      }

  }

  const handleInput = (e) => {

        const {name,value} = e.target;
        setFormData((prevVal) => (
            {
                ...prevVal,
                [name]:value
            }
        ))
  }

return(
    
    <Container component="main" >

      <Typography sx={{textAlign:'center',fontFamily:'serif',fontWeight:'bold',fontSize:'22px'}}>EDIT YOUR PROFILE</Typography>

        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Name"
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

        <Button variant="contained" fullWidth color="primary" onClick={updAcc}>
            SAVE 
        </Button>
        {updError && <h5 style={{ color: 'red',fontSize: '2rem'}}>{updError}</h5>}

        </Container>
        
)

}

export default EditProfile;