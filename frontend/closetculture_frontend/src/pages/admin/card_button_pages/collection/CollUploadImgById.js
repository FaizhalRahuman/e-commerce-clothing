
import { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";

import { fetchPostImgWithToken } from "../../../../client/client";
import { Box } from "@mui/material";

import Header from "../../../../component/layout/Header";

const CollUploadImgById = () => {

    const navigate = useNavigate();
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const collId = queryParams.get('id');

    // const {state} = useLocation(); 
    const collImg = location.state?.imgFile;

    const [uploadError,setUploadError] = useState('');

    const formData = new FormData();
    formData.append("file",collImg);

    fetchPostImgWithToken(`/collection/upload-coll-img/${collId}`,formData)
    .then( (res) => {
        console.log(`Successfully Image Uploaded For a Collection! for id:${collId}`,res.data);
        navigate('/admin/home')
    }).catch((err)=>{
        console.log("Error while uploading image for a collection in CollUploadImgById.js",err.response.data);
        setUploadError(err.response.data.error);
    });

    return(
        <>
        <Header/>
        <Box>
            {uploadError && <h4 style={{color:'red'}}>{uploadError}</h4> }
        </Box>
        </>
    )

}

export default CollUploadImgById;