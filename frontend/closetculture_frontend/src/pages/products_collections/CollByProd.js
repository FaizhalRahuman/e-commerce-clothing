import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState,useEffect } from "react";
import {Buffer} from 'buffer';

import { Grid, Box, Typography, TablePagination } from '@mui/material';

import CollectionCardTemplate from "../../component/cards/CollectionCard";
import { fetchGetDataWithToken,fetchGetDataWithArrayBufferWithToken } from "../../client/client";

import Header from "../../component/layout/Header";
import FilterButtonTemplate from "../../component/filter/FilterButton";
import Footer from "../../component/layout/Footer";


const CollByprod = () =>{

    const navigate = useNavigate();

    const [searchParams,setSearchParams] = useSearchParams();

    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    // const prdId = queryParams.get('prdId');
    // const prdName = queryParams.get('prdName');

    const prdId = searchParams.get("prdId");
    const prdName = searchParams.get("prdName");

    const [prdCollections,setPrdCollections] = useState([]);
    const [imgLink,setImgLink] = useState({});
    const [prodError,setProdError] = useState('');

    {/*Variable/useStates For Pagination*/}
    const [pageNo,setPageNo] = useState(searchParams.get("pageNo") ||  0);
    const [collPerPage,setCollPerPage] = useState(searchParams.get("collPerPage") || 8);
    const [totColl,setTotColl] = useState(null);

    {/*Variables/useStates for filtering*/}
    const [size,setSize] = useState(searchParams.get("size") || '');
    const [color,setColor] = useState(searchParams.get("color") || '');
    const [priceRange,setPriceRange] = useState([searchParams.get("minprice") || 0,searchParams.get("maxprice") || 9999]);

    const handlePageChange = (e,newPage) => {
      setPageNo(newPage);
    }

    const handleRowPerPageChange = (e) => {
      setCollPerPage(parseInt(e.target.value));
      setPageNo(0);
    }

  useEffect( () => {

     setSearchParams(
      {
        prdId:prdId,
        prdName:prdName,
        size:size,
        color:color,
        minprice:priceRange[0],
        maxprice:priceRange[1],
        pageNo:pageNo,
        collPerPage:collPerPage
      }
     )

    // setSearchParams(
    //   {
    //     prdId:prdId,
    //     prdName:prdName,
        // size:size,
        // color:color,
        // minprice:priceRange[0],
        // maxprice:priceRange[1],
        // pageNo:pageNo,
        // collPerPage:collPerPage
    //   }
    // )

    if(localStorage.getItem("token")){

      const getCollections = async() => {

        try{

          const res = await fetchGetDataWithToken(`/collection/filter-pagination-prod/${prdId}?size=${size}&color=${color}&minprice=${priceRange[0]}&maxprice=${priceRange[1]}
            &pageNo=${pageNo}&collPerPage=${collPerPage}`);
          const data = res.data;
          console.log(data);
          setPrdCollections(data.collections);
          setTotColl(data.totColl);
          setProdError('');

        }catch(err){
          console.log("Error while getting filterd and paginated collections in CollByProd.js",err.message);
          setProdError(err.response?.data || err.message);
          setPrdCollections([]);
        }
      }
      getCollections();
    }

  },[prdId,pageNo,collPerPage,size,color,priceRange])


    
  //----- Getting Image -----------------------------------------------------------------------------------------------------
    const GetCollectionImg = async(collId) => {
    
      console.log(collId);
      try{
    
        const res = await fetchGetDataWithArrayBufferWithToken(`/collection/get-coll-img/${collId}`)
        const imgLink = Buffer.from(res.data,'binary').toString('base64');
        const finalImgLink = "data:image/jpeg;base64,"+imgLink
        setImgLink( (prevVal) => (
            {
              ...prevVal,
              [collId]:finalImgLink
            }
          ));
      }catch(err){
          console.log("Error while Getting Product Collection Image Data in CollByProd.js:",err.message);
      }
            
    }
    
// useEffect( () => {

//   if(!localStorage.getItem("token")){
//       navigate('/account/login');
//   }

    
//   //----- Getting All Collections ----------------------------------------------------------------------------------------------
//  const prdCollections = async() => {
    
//     try{
//       const res = await fetchGetDataWithToken(`/collection/view-by-prdId/${prdId}`);
//       const data = res.data;
//       setPrdCollections(data);
    
//     }catch(err){
//       setProdError(err.message)
//       console.log("Error While Getting Product Collections by prdId in CollViewByPrdId.js",err.message);
//     }
//   }
//   prdCollections();
// },[prdId]);
    
useEffect( () => {
  for(var collection of prdCollections){
      if(!imgLink[collection.collId]){
          GetCollectionImg(collection.collId);
      }
    }
},[prdCollections]);
    
    /* OR WE CAN DO LIKE THIS WITH THE USE OF Promise.all()
    
    const arrayBufferToBase64 = (buffer) => {
      let binary = '';
      const bytes = new Uint8Array(buffer);   //Converts the ArrayBuffer into an array of bytes.
      bytes.forEach((b) => binary += String.fromCharCode(b));   //Converts each byte into a character and appends it to a string — building up a binary string.
      return window.btoa(binary);   //Encodes that binary string into a base64-encoded string using btoa() (browser-provided function).
    };
    
    const AllCollections = () => {
      const [collections, setCollections] = useState([]);
    
      useEffect(() => {
        const fetchCollectionsWithImages = async () => {
          try {
            const res = await fetchGetData('/collection/view-all');
    
            const collectionsData = await Promise.all(
              res.data.map(async (coll) => {
                if (coll.img) {
                  try {
                    const imgRes = await fetchGetDataWithArrayBuffer(`/collection/download/${coll.collId}`);
                    const base64 = arrayBufferToBase64(imgRes.data);
                    return {
                      ...coll,
                      img: `data:image/jpeg;base64,${base64}`,
                    };
                  } catch (err) {
                    console.error(`Error loading image for collection ${coll.collId}`, err);
                  }
                }
                return {
                  ...coll,
                  img: null,
                }
              })
            );
            setCollections(collectionsData);
          } catch (err) {
            console.error("Error while fetching collections", err);
          }
        };
    
        fetchCollectionsWithImages();
      }, []); */
    
    
return(
        
    <>
      <Box position="fixed" sx={{zIndex:1,width:'100%'}}>
          
          <Header
          FilterButtonCompo={
            <FilterButtonTemplate
            pageNo={pageNo}
            setPageNo={setPageNo}
            size={size}
            setSize={setSize}
            color={color}
            setColor={setColor}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            />
          }
          />

      </Box>
    
      <Box sx={{px:4,py:6,pt:12,backgroundColor:'ButtonShadow'}}>
            
        <Grid container direction="column" sx={{alignItems:'center',spacing:'4'}}>
    
            {/* Title */}
            <Grid item>
            <Typography 
            variant="h4" 
            component='div' 
            sx={{fontWeight:'bold',
                textAlign:'center',
                letterSpacing:'.1px',
                color:'primary.main',
                textTransform:'uppercase'
            }}
            > {prdName} COLLECTIONS </Typography>
            {prodError && <h5 style={{ color: 'red' }}>{prodError}</h5>}
            </Grid>
    
            {/*Collection Cards*/}
            <Grid 
            item 
            container
            spacing={3}
            mt={4}
            justifyContent="center"
            sx={{width:'100%'}}
            >
              <Box
              sx={{
                width:'100%',
                display:'flex',
                flexWrap:'wrap',
                gap:3,
                justifyContent:'center',
                pb:4
              }}
              >
                {prdCollections.map( (collection) => (
                 <Grid item key={collection.collId}>
                    <Box
                    
                    sx={{
                        borderRadius:'20px',
                         transition: 'transform 0.3s, box-shadow 0.5s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 7,
                    }
                    }}
                    >
                    <CollectionCardTemplate
                    image={imgLink[collection.collId] || '/blank.jpeg'}
                    collName={collection.collName}
                    collType={collection.collType}
                    collId = {collection.collId}
                    />
                    </Box>
                </Grid>
                ))
            }
            </Box>

            <Box>
              <TablePagination
              count={totColl}
              page={pageNo}
              onChangePage={handlePageChange}
              labelRowsPerPage="Collection Per Page"
              rowsPerPageOptions={[4,8,12,16,20]}
              rowsPerPage={collPerPage}
              onRowsPerPageChange={handleRowPerPageChange}
              />

            </Box>
    
            </Grid>
    
        </Grid>
      </Box>
      <Footer/>
    </>
        )
}

export default CollByprod;