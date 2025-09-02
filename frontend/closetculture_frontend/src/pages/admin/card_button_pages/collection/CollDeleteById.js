import {useLocation, useNavigate} from 'react-router-dom'

import {fetchDeleteDataWithToken} from '../../../../client/client'
import { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import Header from "../../../../component/layout/Header";

const CollDeleteById = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const collId = queryParams.get('id');


    const[collError,setCollError] = useState('');
    const deleted = useRef(false);

    useEffect( () => {

        if(!deleted.current && collId){

            setCollError('');
            deleted.current=true;

            fetchDeleteDataWithToken(`/collection/delete-by-id/${collId}`)
            .then( (res) => {
                console.log("Successfully Collection Deleted:",res.response);
                
                navigate('/admin/home');
            }).catch( (err) => {
                
                setCollError(err.message);
                console.log("Error While Deleting Collection in CollDeleteById.js",err.message);
            })

        }
    },[collId,navigate]) //--- collId,navigate

    return(
        <>
        <Header/>
        <Box>
        {collError && <h5 style={{ color: 'red' }}>{collError}</h5>}
        </Box>
        </>
    )
}

export default CollDeleteById;