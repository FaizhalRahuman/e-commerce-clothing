import { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";

import { fetchPostImgWithToken } from "../../../../client/client";
import { Box } from "@mui/material";

import Header from "../../../../component/layout/Header";

const StkUploadImgById = () => {

    const navigate = useNavigate();
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stkId = queryParams.get('id');

    // const {state} = useLocation(); 
    const stkImg = location.state?.imgFile;

    const [uploadError,setUploadError] = useState('');
    const [uploadSuccess,setUploadSuccess] = useState('');

    const formData = new FormData();
    formData.append("file",stkImg);

    fetchPostImgWithToken(`/stock/upload-stk-img/${stkId}`,formData)
    .then( (res) => {
        console.log(`Successfully Image Uploaded For a Stock! for id:${stkId}`,res.data);
        navigate('/admin/home')
        setUploadSuccess("Upload Success !") //--- comment to uncomment
    }).catch((err)=>{
        console.log("Error while uploading image for a Stock in StkUploadImgById.js",err.response.data);
        setUploadError(err.response.data);
    });

    return(
        <>
        <Header/>
        <Box>
            {uploadSuccess && <h4 style={{color:'Darkgreen'}}>{uploadSuccess}</h4> }
            {uploadError && <h4 style={{color:'red'}}>{uploadError}</h4> }
        </Box>
        </>
    )

}

export default StkUploadImgById;