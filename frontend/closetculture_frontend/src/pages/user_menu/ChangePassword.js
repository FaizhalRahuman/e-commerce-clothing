import { useState } from "react";

import { fetchPostDataWithToken } from "../../client/client";

import { Container,TextField,Button, Typography } from "@mui/material";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [errors,setErrors] = useState({oldPassword:'',newPassword:''})

  const [changeError,setChangeError] = useState('')



  const changePassword = async () => {

    let isValid = true;

    if (!passwords.oldPassword.trim()) {
      setErrors((prevVal) => ({
        ...prevVal,
        oldPassword: "This Field Cannot Be Empty",
      }));
      isValid = false;
    }

    if (!passwords.newPassword.trim()) {
      setErrors((prevVal) => ({
        ...prevVal,
        newPassword: "This Field Cannot Be Empty",
      }));
      isValid = false;
    }

    if (isValid) {
      try {
        const res = await fetchPostDataWithToken(`/account/change-password`,passwords);
        console.log("Sucessfully password changed", res.data);
        window.location.reload();
      } catch (err) {
        console.log("Error While Changing password", err.message);
        setChangeError(err.response?.data || err.message);
      }
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setPasswords((prevVal) => ({
      ...prevVal,
      [name]: value,
    }));
  };

  return (
    <Container component="main">

        <Typography sx={{textAlign:'center',fontFamily:'serif',fontWeight:'bold',fontSize:'22px'}}>CHANGE PASSWORD</Typography>

      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Old Password"
        name="oldPassword"
        value={passwords.oldPassword}
        onChange={handleInput}
        error={!!errors.oldPassword}
        helperText={errors.oldPassword}
      />

      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="New Password"
        name="newPassword"
        value={passwords.newPassword}
        onChange={handleInput}
        error={!!errors.newPassword}
        helperText={errors.newPassword}
      />

      <Button variant="contained" fullWidth color="primary" onClick={changePassword}>
        Change Password
      </Button>
      {changeError && (
        <h5 style={{ color: "red", fontSize: "2rem" }}>{changeError}</h5>
      )}
    </Container>
  );
};

export default ChangePassword;
