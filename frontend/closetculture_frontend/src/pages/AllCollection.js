import {useState,useEffect} from 'react';

import fetchGetData, { fetchGetDataWithArrayBuffer } from '../client/client';

import CollectionCardTemplate from '../component/cards/CollectionCard';
import {Box,Card,CardMedia,Grid, TablePagination, Typography } from '@mui/material';

import { Buffer } from 'buffer';
import Header from '../component/layout/Header';
import FilterButtonTemplate from '../component/filter/FilterButton';
import { useSearchParams } from 'react-router-dom';

import Footer from "../component/layout/Footer";


const AllCollections = () => {

    const[searchParams,setSearchParams] = useSearchParams();

    /*If we set the the key,value pairs by using setSearchParams in context of useSearchParams() hook,it setes the key,value pairs in the current url
    in the form of query param,EG:setSearchParams({size: size }) -> it sets like localhost:8080/home?size=size,
    Deep Exp:-
      namma url la set panra query ah thaan usestate la vaikirom,apdi innum query url la set aagala na default value kuduthurom useState(searchParams.get("pageNo") || 0),
      because at start(when app runs)  useState hooks run first and then useEffect runs,so starting laiye namaku query set agathu,so we give a default values like this.
    
    */

    const [allCollections,setAllCollections] = useState([]);
    const [imgLink,setImgLink] = useState({});
    const [collError,setCollError] = useState('');

    const[pageNo,setPageNo] = useState(searchParams.get("pageNo") || 0);
    const[collPerPage,setCollPerPage] = useState(searchParams.get("collPerPage") || 8);
    const[totColl,setTotColl] = useState(null);

    const [size,setSize] = useState(searchParams.get("size") || '');
    const [color,setColor] = useState(searchParams.get("color") || '');
    const [priceRange,setPriceRange] = useState([searchParams.get("minprice") || 0, searchParams.get("maxprice") || 9999]);

    const handlePageChange = (event,newPage) =>{
      setPageNo(newPage);
    }

    const handleCollPerPageChange = (e) =>{
      setCollPerPage(parseInt(e.target.value));
      setPageNo(0);
    }

    //---- Taking Collections Based On Pagination ------------------------------------------------------------------------------

    // useEffect( () => {

    //   if(!localStorage.getItem("token")){

    //   const getCollections = async() => {

    //     try{
    //       const res = await fetchGetData(`/collection/pagination?pageNo=${pageNo}&collPerPage=${collPerPage}`);
    //       const data  = res.data;
    //       // console.log("Successfully Collections taken by the pageNo and collPerPage",data);
    //       setAllCollections(data.collections);
    //       setTotColl(data.totColl);
    //     }catch(err){
    //       console.log("error while getting collection in AllCollection.js",err.message);
    //     }
    //   }
    //   getCollections();
    // }

    // },[pageNo,collPerPage])

    //Taking Values of Size and Color and Price Range and Show Collections based on that starts
    useEffect( () => {

      setSearchParams({
        size: size,
        color: color,
        minprice: priceRange[0],
        maxprice: priceRange[1],
        pageNo: pageNo,
        collPerPage:collPerPage
      })
        
      const getCollections = async() => {

        try{

          const res = await fetchGetData(`/collection/filter-pagination?size=${size}&color=${color}&minprice=${priceRange[0]}&maxprice=${priceRange[1]}&pageNo=${pageNo}&collPerPage=${collPerPage}`)
          const data = res.data
          // console.log(data);
          setAllCollections(data.collections);
          setTotColl(data.totColl);
      }catch(err){
        console.log("Error while getting filterd and paginated collections in AllCollection.js",err.message);
        setCollError(err.response?.data || err.message);
      }
      }
      getCollections();

    },[pageNo,collPerPage,size,color,priceRange])

    //----- Getting Image -----------------------------------------------------------------------------------------------------
    const GetCollectionImg = async(collId) => {

        // console.log(collId);
        try{

            const res = await fetchGetDataWithArrayBuffer(`/collection/get-coll-img/${collId}`)
            const imgLink = Buffer.from(res.data,'binary').toString('base64');
            const finalImgLink = "data:image/jpeg;base64,"+imgLink
            setImgLink( (prevVal) => (
                {
                    ...prevVal,
                    [collId]:finalImgLink
                }
            ));
        }catch(err){
            console.log("Error while Getting Image Data in AllCollection.js:",err.message);
        }
        
    }

    // useEffect( () => {

    //     //----- Getting All Collections ----------------------------------------------------------------------------------------------
    //     const collections = async() => {

    //         try{
    //             const res = await fetchGetData('/collection/view-all');
    //             const data = res.data;
    //             setAllCollections(data);

    //         }catch(err){
    //             console.log("Error While Getting Collection in AllCollection.js",err.message);
    //         }
    //     }
    //     collections();
    // },[]);

    useEffect( () => {
        for(var collection of allCollections){

            GetCollectionImg(collection.collId);
        }
    },[allCollections]);

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
      FilterButtonCompo = {
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

    <Box 
    sx={{
      px:0,
      py:6,
      pt:'96px',
      backgroundColor:'#c9c7d4',
      display: 'flex',
      flexDirection: 'column'      
      }}>
        
        <Grid container direction="column" 
        sx={{
          mt:'-31px',
          alignItems:'center',
          spacing:'4',
          // border:'1px solid black',
          width:'100%'         
          }}>

          <Card
          sx={{
            // border:'1px solid black',
            mt:'5px',
            minWidth:{
              xs:'100%',
              sm:'100%',
              md:'100%',
              lg:'100%'
            },
            
          }}
          >
            <CardMedia
            component="img"
            image="Fashion And Style.png"
            sx={{
              height:'600px',
              objectFit:'fill',
              objectPosition:'top'
            }}
            />
          </Card>

        {/* Title */}
        {/* <Grid item>
        <Typography 
        variant="h4" 
        component='div' 
        sx={{fontWeight:'bold',
            fontFamily:'Goudy Old Style',
            textAlign:'center',
            letterSpacing:'.1px',
            color:'primary.main'
        }}
        > Fashion And Style </Typography>
        </Grid> */}
        {collError && <h5 style={{color:'red'}}>{collError}</h5>}
        {/*Collection Cards*/}
        <Grid 
        item 
        container
        spacing={3}
        mt={4}
        justifyContent="center"
        sx={{width:'100%',flexGrow:1}}
        >
          <Box 
          sx={{
            // border:'1px solid black',
            width:'100%',
            display:'flex',
            flexWrap:'wrap',
            gap:3,
            justifyContent:'center',
            pb:4
            }}>

            {allCollections.map( (collection) => (
             <Grid item key={collection.collId} sx={{border:'1px Solid black',borderRadius:'20px'}}>
                <Box
                sx={{
                  borderRadius:'20px',
                  transition: 'transform 0.3s, box-shadow 0.5s',
                '&:hover': {
                  transform: 'scale(1.06)',
                  boxShadow: 10,
                  
                }
                }}
                >
                <CollectionCardTemplate
                image={imgLink[collection.collId] || '/blank.jpeg'}
                collName={collection.collName}
                collType={collection.collType}
                collId={collection.collId}
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
          onPageChange={handlePageChange}
          rowsPerPage={collPerPage}
          onRowsPerPageChange={handleCollPerPageChange}
          rowsPerPageOptions = {[4,8,12,16,20]}
          labelRowsPerPage="Collection Per Page"
          />

        </Box>

        </Grid>

        </Grid>
        </Box>
        <Footer/>
        </>
    )

}

export default AllCollections;


