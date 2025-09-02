import AdminCardTemplate from "../../component/cards/AdminCardTemplate";

import {Box,Grid, TextField, Typography,Button} from '@mui/material';

import {useState,useEffect} from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../component/layout/Header";

const admincards = [
  {
    key: 1,
    name: "ACCOUNT",
    imgLink: "/account.jpeg",
    operations: {
      View:'/account/view-by-accId',
      View_All:'/account/view-all',
      Delete:'/account/delete-by-accId'
    },
  },
  {
    key: 2,
    name: "PRODUCT",
    imgLink: "/product.jpeg",
    operations: {
      Add_Product:'/product/add',
      View:'/product/view-by-prdId',
      View_All:'/product/view-all',
      Update:'/product/update-by-prdId',
      Delete:'/product/delete-by-prdId'
    },
  },
  {
    key: 3,
    name: "COLLECTION",
    imgLink: "/collections.jpeg",
    operations: {
      Add_By_PrdId: '/collection/add-by-prdId',
      View:'/collection/view-by-collId',
      View_All:'/collection/view-all',
      View_By_PrdId: '/collection/view-by-prdId',
      Update: '/collection/update-by-collId',
      Delete: '/collection/delete-by-collId',
      Upload_Img: '/collection/uploadImg-by-collId',
      Get_Img: '/collection/getImg-by-collId'
    },
  },
  {
    key: 4,
    name: "STOCK",
    imgLink: "/stocks.jpeg",
    operations: {
      Add_By_Collection: '/stock/add-by-collId',
      View_All: '/stock/view-all',
      View_By_Collection: '/stock/view-by-collId',
      Update:'/stock/update-by-stkId',
      Upload_Img:'/stock/uploadImg-by-stkId',
      Get_Img:'/stock/getImg-by-stkId',
      Delete:'/stock/delete-by-stkId'
    },
  },
];

const AdminHome = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const uploadHappen = queryParam.get("uploadStk");
  console.log(uploadHappen)
  
  const [enteredId,setEnteredId] = useState('');
  const [uploadImg,setUploadImg] = useState({id:'',imgFile:''});

  const [activeOperation,setActiveOperation] = useState(null);
 /*BUT — in some session or render, it probably restores a previous activeOperation automatically (maybe from previous interaction or a buggy state that didn’t reset).
 So I Reset activeOperations every time when this AdminHome renders/mount */
  useEffect( () => {

    const token = localStorage.getItem("token");
    if(!token){
      navigate('/account/login');
    }
    setActiveOperation(null);
  },[navigate]); //--- navigate

  //----- Handling Button Click After Entering Id / Uploading images ------------------------------------------------------------------------------

  const handleButtonClick = (type) => {

    if(type === 'onlyId'){

      navigate(`/admin${activeOperation.Url}?id=${enteredId}`)


    }else if(type === 'idWithImg'){

      navigate(`/admin${activeOperation.Url}?id=${uploadImg.id}`,{
        state:{imgFile:uploadImg.imgFile}
      })
    }
  }

  return (
    <>
    <Header/>
    <Box sx={{ px: 4, py: 6, backgroundColor:'#f0f8ff/* Alice Blue */', minHeight:"100vh" }}>{/*100vh -> takes 100% of the view port(browser screen),if give it in height:"100vh"->Fixed height->It won’t grow even if content is taller than the screen->❌ Extra content overflows (goes out of the box or gets cut).| if we giv it in minHeight ->, grows if needed-> It says: “Be at least 100vh tall (full screen), but grow if content needs more space.” */}
      <Grid
        container
        direction="column"
        sx={{ alignItems: "center", spacing: "4" }}
      >

        {/*Collection Cards*/}
        <Grid
          item
          container
          spacing={3}
          mt={4}
          justifyContent="center"
          sx={{ width: "100%" }}
        >
          {admincards.map((admincard) => (
            <Grid item key={admincard.key}>
              <Box
                sx={{
                  transition: "transform 0.3s, box-shadow 0.5s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 7,
                  },
                }}
              >
                <AdminCardTemplate
                  image={admincard.imgLink || "/blank.jpeg"}
                  collName={admincard.name}
                  operations={admincard.operations}
                  activeOperation={ (operation,url) => {
                    setActiveOperation({Card:admincard.name, Operation:operation, Url:url})
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* <Box sx={{px:'10px', py:'10px', mt:'35px',border:'3px solid black',borderRadius:'10px'}}> */}

      {(activeOperation) && (
        
      <Box sx={{px:'10px', py:'10px', mt:'30px', borderRadius:'10px', backgroundColor:"lightgray"}}>
      {/*Showing Card Name */}
      <Typography variant="h5" sx={{fontWeight:'bold', letterSpacing:'0.1px',mt:'20px',mb:'10px'}}>
        {activeOperation.Card}
      </Typography>

      {/*Showing Respective Field */}
      <Typography variant="subtitle1" sx={{ml:'10px'}}>
        {activeOperation.Operation} --- {activeOperation.Url}
      </Typography>

      <Box>

        {/*activeOperation?.Url?.includes('Id')
          ✔ This checks:
          Is activeOperation defined?
          Is activeOperation.Url defined?
          Only then runs .includes('Id').*/}

        { ( (activeOperation.Url)?.includes('Id') && !(activeOperation.Url)?.includes('Img') ) && (
          
          <Box 
            display="flex" 
            gap={2}
            sx={{px:'15px',py:"15px",mt:"10px",
            backgroundColor: "#f5f5f5",
            borderRadius: 3,}}>
          
          <TextField
                  variant="outlined"
                  margin="normal"
                  label="Enter Id"
                  name="id"
                  value={enteredId}  /*we give value like this or we can also not even give it */
                  onChange={(e) => setEnteredId(e.target.value)}
                />

          <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            backgroundColor: "#1976d2",
            fontWeight: "bold",
          }}
          onClick={() => handleButtonClick("onlyId")}
          > 
          {activeOperation.Operation} </Button>

          
          </Box>
        )}
        {console.log("not enterd upload box!!")}
{/* Simplified conditional rendering without IIFE */}
        {((activeOperation?.Url?.includes('uploadImg')) && (
          (console.log("Entered Upload Box")),
          <Box 
            display="flex" 
            gap={2}
            sx={{
              px: '15px',
              py: "15px",
              mt: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: 3,
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              label="Enter Id"
              name="id"
              size="small"
              width="200px"
              onChange={(e) => setUploadImg((prevVal) => ({
                ...prevVal,
                id: e.target.value
              }))}
            />
          
            <Button
              component="label"
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Choose File
              <input 
                type="file" 
                hidden 
                onChange={(e) => setUploadImg((prevVal) => ({
                  ...prevVal,
                  imgFile: e.target.files[0]
                }))}
              />
            </Button>

            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                backgroundColor: "#1976d2",
                fontWeight: "bold",
              }}
              onClick={() => handleButtonClick('idWithImg')}
            > 
              Upload 
            </Button>
          </Box>
        ))}
      
        
        {((activeOperation.Url)?.includes('getImg')) && (

          <Box
            display="flex" 
            gap={2}
            sx={{px:'15px',py:"15px",mt:"10px",
            backgroundColor: "#f5f5f5",
            borderRadius: 3,}}>
          
          <TextField
                  variant="outlined"
                  margin="normal"
                  label="Enter Id"
                  name="id"
                />

          <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            backgroundColor: "#1976d2",
            fontWeight: "bold",
          }}> 
          Get Image </Button>

          </Box>

        )}

      </Box>

      </Box>
      
    )
      }
      {/* </Box> */}

     </Box>
     </>
  );
};

export default AdminHome;
