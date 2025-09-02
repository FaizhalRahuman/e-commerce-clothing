import {useLocation, useNavigate} from 'react-router-dom'

import {fetchDeleteDataWithToken} from '../../../../client/client'
import { useEffect, useState } from 'react';
import { useRef } from 'react';

import { Box } from '@mui/material';

import Header from "../../../../component/layout/Header";

const ProdDeleteById = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const prdId = queryParams.get('id');


    const[prdError,setPrdError] = useState('');
    const deleted = useRef(false);

useEffect(() => {

            if(!deleted.current && prdId){

            setPrdError('');

            deleted.current=true;

            console.log(prdId);

            fetchDeleteDataWithToken(`/product/delete-by-id/${prdId}`)
                .then( (res) => {
                    console.log("Successfully Product Deleted:",res.data);
                    navigate('/admin/home');
                }).catch( (err) => {
                    setPrdError("No Product Exists!");
                    console.log("Error While Deleting Product in ProdDeleteById.js",err.message);
                })

            }
            // const deleteProduct = async () => {
            //     try {
            //     const res = await fetchDeleteData(`/product/delete-by-id/${prdId}`);
            //     console.log("Successfully Product Deleted:", res.data);
            //     console.log("Navigating to /admin/home");
            //     navigate('/admin/home'); 
            //     } catch (err) {
            //         setPrdError(err.message || "Unexpected Error");
            //     }
            //     console.log("Error while Deleting Product by prdId in ProdDeleteById.js");
            //     }
            //     deleteProduct();
                // setDeleted(true);
            // };

        },[navigate,prdId]) //--- navigate,
  /*if (!prdId || deleted) return;

  const deleteProduct = async () => {
    try {
      const res = await fetchDeleteData(`/product/delete-by-id/${prdId}`);
      console.log("Successfully Product Deleted:", res.data);
      if (!ignore) {
        console.log("Navigating to /admin/home");
        navigate('/admin/home'); 
      }
    } catch (err) {
      if (!ignore) {
        setPrdError(err.response.error || "Unexpected Error");
      }
      console.log("Error while Deleting Product by prdId in ProdDeleteById.js");
    }
    setDeleted(true);
  };

  deleteProduct();

  return () => {
    ignore = true;
  };*/

    return(
        <>
        <Header/>
        <Box>
        {prdError && <h5 style={{ color: 'red' }}>{prdError}</h5>}
        </Box>
        </>
    )

}

export default ProdDeleteById;