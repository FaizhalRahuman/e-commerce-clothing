import {useState,useEffect} from 'react';

import {fetchGetDataWithArrayBufferWithToken, fetchGetDataWithToken} from '../../../../client/client';

import CollectionCardTemplate from '../../../../component/cards/CollectionCard'; 
import {Box,Grid, Typography } from '@mui/material';

import { Buffer } from 'buffer';

import Header from "../../../../component/layout/Header";

const CollViewAll = () => {

    const [Collections,setCollections] = useState([]);
    const [imgLink,setImgLink] = useState({});

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
            console.log("Error while Getting Collection Image Data in CollViewAll.js:",err.message);
        }
        
    }

    useEffect( () => {

        //----- Getting All Collections ----------------------------------------------------------------------------------------------
        const Collections = async() => {

            try{
                const res = await fetchGetDataWithToken(`/collection/view-all`);
                const data = res.data;
                setCollections(data);

            }catch(err){
                console.log("Error While Getting Collections in CollViewAll.js",err.message);
            }
        }
        Collections();
    },[]);

    useEffect( () => {
        for(var collection of Collections){

            GetCollectionImg(collection.collId);
        }
    },[Collections]);

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
      <Header/>
      </Box>
    <Box sx={{px:4,py:6,pt:'96px',backgroundColor:'ButtonShadow'}}>
        

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
        > ALL COLLECTIONS </Typography>
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
            {Collections.map( (collection) => (
             <Grid item key={collection.collId}>
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
                image={imgLink[collection.collId] || '/blank.jpeg'}
                collName={collection.collName}
                collType={collection.collType}
                collId ={collection.collId}
                />
                <Typography>Product Id:{collection.prdId} | Collection Id:{collection.collId}</Typography>
                </Box>
            </Grid>
            ))
        }

        </Grid>

        </Grid>
        </Box>
        </>
    )
}

export default CollViewAll;