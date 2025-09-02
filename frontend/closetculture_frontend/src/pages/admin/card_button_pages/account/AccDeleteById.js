
import { useLocation,useNavigate} from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import {Box} from '@mui/material';

import { fetchDeleteDataWithToken } from "../../../../client/client";

import Header from "../../../../component/layout/Header";


const AccDeleteById = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const accId = queryParams.get('id');

    const[accError,setAccError] = useState('');
    const deleted = useRef(false);

    useEffect( () =>{

        console.log('entering if block')

        if((deleted.current === false)){

            if(!accId) return;

            console.log('enterd if block')
            deleted.current = true;

            setAccError('');

            console.log(accId);

            fetchDeleteDataWithToken(`/account/delete-by-id/${accId}`)
                .then( (res) => {
                    console.log("Successfully Account Deleted:",res.data);
                    
                    navigate('/admin/home');
                }).catch( (err) => {
                    setAccError("No Account Exists!");
                    console.log("Error While Deleting Account in AccDeleteById.js",err.message);
                })
        }
    },[accId,navigate]) //--- accId,navigate
    

    return(
        <>
        <Header/>
        <Box>
        {accError && <h5 style={{ color: 'red' }}>{accError}</h5>}
        </Box>
        </>
    )

}

export default AccDeleteById;