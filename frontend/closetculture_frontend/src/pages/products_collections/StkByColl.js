import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import {
  fetchGetDataWithArrayBufferWithToken,
  fetchGetDataWithToken,
  fetchPostDataWithToken,
} from "../../client/client";

import StkForUserTemplate from "../../component/cards/StkForUserTemplate";
import Header from "../../component/layout/Header";
import {
  Alert,
  Box,
  Grid,
  Snackbar,
} from "@mui/material";
import Footer from "../../component/layout/Footer";

const StkByColl = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const collId = queryParam.get("collId");
  const collType = queryParam.get("collType");
  const collImage = location.state?.collImg;

  const [collStocks, setCollStocks] = useState([]);
  const [collError, setCollError] = useState("");
  const [imgLink, setImgLink] = useState({});

  const [snackBar,setSnackBar] = useState({open:false,message:'',severity:'success'});

  console.log("CollId", collId);

  //----- Getting Image -----------------------------------------------------------------------------------------------------
  const GetStockImg = async (stkId) => {
    console.log(stkId);
    try {
      const res = await fetchGetDataWithArrayBufferWithToken(
        `/stock/get-stock-img/${stkId}`
      );
      const imgLink = Buffer.from(res.data, "binary").toString("base64");
      const finalImgLink = "data:image/jpeg;base64," + imgLink;
      setImgLink((prevVal) => ({
        ...prevVal,
        [stkId]: finalImgLink
      }));
    } catch (err) {
      console.log(
        "Error while Getting Collection Stocks Image Data in StkByColl.js:",
        err.message
      );
    setImgLink((prevVal) => ({
        ...prevVal,
        [stkId]: '/blank.jpeg'
      }));
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/account/login");
      return;
    }

    //----- Getting All Collections ----------------------------------------------------------------------------------------------
    const CollStocks = async () => {
      try {
        const res = await fetchGetDataWithToken(
          `/stock/view-by-collId/${collId}`
        );
        const data = res.data;
        console.log("stocks:", data);
        setCollStocks(data);
      } catch (err) {
        setCollError(err.response.data);
        console.log(
          "Error While Getting Collection Stocks by collId in StkByColl.js",
          err.message
        );
      }
    };
    CollStocks();
  }, [collId,navigate]); //--- navigate

  useEffect(() => {
    for (var stk of collStocks) {
      if (!imgLink[stk.stkId]) {
        GetStockImg(stk.stkId);
      }
    }
  }, [collStocks,imgLink]); //--- imgLink

  const handleAddToCart = async(stkId) => {
    console.log("Enter CART Adding func ............................")
    try {
      const res = await fetchPostDataWithToken(`/cart-item/add/${stkId}`);
      const data = res.data;
      console.log("Stock Item Added To Cart Successfully.", data);
      setSnackBar({open:true,message:"Item Added To successfully",severity:"success"});
    } catch (err) {
      console.log(
        "Error while adding item to cart in StkByColl.js",err.message);
      setSnackBar({open:true,message:err.response?.data?.message || err.message,severity:"error"});
    }
  };

  const handleOrderNow = async (stkId,userDetails) => {

    try {
      const res = await fetchPostDataWithToken(`/order/place/${stkId}`,userDetails);
      const data = res.data;
      console.log("Order Placed Successfully.", data);
      setSnackBar({open:true,message:'Order Placed Successfully!',severity:'success'})
    } catch (err) {
      console.log("Error while plpacing order in StkByColl.js", err.message);
      setSnackBar({open:true,message:err.response?.data?.message || err.message,severity:"error"})
    }
  };

  return (
    <Grid container sx={{}}>
      <Box position="fixed" sx={{ zIndex: 1, width: "100%" }}>
        <Header />
      </Box>

      <Box
      sx={{
        // border:'2px solid black'
      }}
      >
      <StkForUserTemplate
        defaultImg={collImage}
        stkImages={imgLink}
        allStkDetails={collStocks}
        collType={collType}
        handleAddToCart={handleAddToCart}
        handleOrderNow={handleOrderNow}
      />
      </Box>

      <Snackbar
      open={snackBar.open}
      autoHideDuration={3000}
      onClose={() => setSnackBar({open:false})}
      anchorOrigin={ {vertical:"bottom",horizontal:"center"} }
      >
        <Alert
        onClose={() => setSnackBar({open:false})}
        severity={snackBar.severity}
        sx={{
          bgcolor:'#11be0eff',
          fontWeight:'bold'
        }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>

      {collError && (<h5 style={{color:"red"}}>{collError}</h5>)}
      
      <Box
      sx={{
        // border:'2px solid black',
        width:'100%'
      }}
      >
        <Footer/>
      </Box>
    </Grid>
  );
};

export default StkByColl;
