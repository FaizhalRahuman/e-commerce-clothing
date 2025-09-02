import {useLocation, useNavigate} from 'react-router-dom'

import {fetchDeleteDataWithToken} from '../../../../client/client'
import { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import Header from "../../../../component/layout/Header";

const StkDeleteById = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stkId = queryParams.get('id');


    const[stkError,setStkError] = useState('');
    const deleted = useRef(false);

    useEffect(()=>{

    if(!deleted.current && stkId){

            setStkError('');
            deleted.current=true;

            fetchDeleteDataWithToken(`/stock/delete-by-id/${stkId}`)
            .then( (res) => {
                console.log("Successfully Stock Deleted:",res.response);
                navigate('/admin/home');
            }).catch( (err) => {
                setStkError(err.response.data);
                console.log("Error While Deleting Stock in StkDeleteById.js",err.message);
            })

        }

    },[navigate,stkId]) //--- navigate,stkId

    return(
        <>
        <Header/>
        <Box>
        {stkError && <h5 style={{ color: 'red' }}>{stkError}</h5>}
        </Box>
        </>
    )

}

export default StkDeleteById;