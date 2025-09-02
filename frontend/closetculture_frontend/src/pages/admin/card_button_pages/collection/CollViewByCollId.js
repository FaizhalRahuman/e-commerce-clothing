import { useLocation} from "react-router-dom";
import {useState,useEffect} from 'react';
import { Buffer } from "buffer";

import CollectionCardTemplate from "../../../../component/cards/CollectionCard";
import { fetchGetDataWithToken, fetchGetDataWithArrayBufferWithToken } from "../../../../client/client";
import { Typography, Box,Grid } from "@mui/material";

import Header from "../../../../component/layout/Header";
// import { Collections } from "@mui/icons-material";

const CollViewByCollId = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const collId = queryParams.get('id');

    const [collDetails,setCollDetails] = useState('');
    const [imgLink,setImgLink] = useState({});
    const [collError,setCollError] = useState('');

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
            console.log("Error while Getting Collection Image Data in CollViewByCollId.js:",err.message);
        }
        
    }

    useEffect( () => {

        //----- Getting All Collections ----------------------------------------------------------------------------------------------
        const Collection = async() => {

            try{
                console.log(collId);
                const res = await fetchGetDataWithToken(`/collection/view-by-collId/${collId}`);
                const data = res.data;
                setCollDetails(data);

            }catch(err){
                setCollError(err.response.data)
                console.log("Error While Getting Collection in CollViewByCollId.js",err.message);
            }
        }
        Collection();
    },[collId]);

    useEffect( () => {
        if(!collDetails.collId) return;
        GetCollectionImg(collDetails.collId);
    },[collDetails]);

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
      <Header/>
    <Box sx={{px:4,py:6,backgroundColor:'ButtonShadow'}}>
        

        <Grid container direction="column" sx={{alignItems:'center',spacing:'4'}}>

        {/* Title */}
        <Grid item>
        <Typography 
        variant="h4" 
        component='div' 
        sx={{fontWeight:'bold',
            textAlign:'center',
            letterSpacing:'.1px',
            color:'primary.main'
        }}
        > COLLECTION DETAIL </Typography>
        {collError && <h4 style={{ color: 'red' }}>{collError}</h4>}
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
            <Grid>
                <Box
                sx={{
                     transition: 'transform 0.3s, box-shadow 0.5s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 7,
                }
                }}
                >
                <CollectionCardTemplate
                image={imgLink[collDetails.collId] || '/blank.jpeg'}
                collName={collDetails.collName}
                collType={collDetails.collType}
                collId={collDetails.collId}
                />
                <Typography>Product Id:{collDetails.prdId} | Collection Id:{collDetails.collId}</Typography>
                </Box>
            </Grid>

        </Grid>

        </Grid>
        </Box>
        </>
    )

}

export default CollViewByCollId;