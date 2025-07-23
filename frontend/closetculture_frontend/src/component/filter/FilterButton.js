import { useEffect, useState } from "react";

import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Button, InputLabel, Menu, MenuItem, Select, Slider, Typography } from "@mui/material";
import { fetchGetDataWithToken } from "../../client/client";

const FilterButtonTemplate = ({pageNo,setPageNo, size,setSize, color,setColor, priceRange,setPriceRange}) => {


    const [anchorEl,setAnchorEl] = useState(null);
    const [priceRangeFilter,setPriceRangeFilter] = useState([priceRange[0],priceRange[1]])
    
    const handleCilck = (e) => {
        setAnchorEl(e.currentTarget);
    }
/*<button>
  <span class="MuiButton-startIcon">🎛️</span>
  <span class="MuiButton-label">Filter</span>
</button>
 * So if the user clicks on:
the icon 👉 event.target = <span class="MuiButton-startIcon">
the text 👉 event.target = <span class="MuiButton-label">
event.currentTarget is always the <Button> itself.(the parent)  --> another understanding is this currentTarget gives the element which have listener/handler func.

But Here for the button there is no child element then there is no event.target problem can happen,here it may be ok,
but event.currentTarget is safe and better -> always gives the parent element even user clicks the child. 

*/

    const handleClose = () => {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);

    const [stocks,setStocks] = useState([]);
    const uniqueColors = [...new Set(stocks.map( (stk) => stk.color))];
    
    useEffect( () => {

    //----- Getting All Stocks ----------------------------------------------------------------------------------------------
        const Stocks = async() => {

            try{
                const res = await fetchGetDataWithToken(`/stock/view-all`);
                const data = res.data;
                setStocks(data);

            }catch(err){
                console.log("Error While Getting Stocks in CollViewAll.js",err.message);
            }
        }
        Stocks();
    },[]);

    return(

        <>
        <Box>

            <Button
            startIcon = {<FilterListIcon/>}
            variant="outlined"
            sx={{
            // backgroundColor: '#1976d2',
            color: 'white',
            textTransform: 'none',
            borderRadius: '10px',
            px: 3,
            py: 1,
            // boxShadow: 3,
            '&:hover': { backgroundColor: '#115293',boxShadow:10 }
            }}
            onClick={handleCilck}
            >
                Filter
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>

                {/* Size  and Color */}
                <Box sx={{
                    display:'flex',
                    gap:4,
                    justifyContent:'center',
                    p:1,
                    backgroundColor: '#f0f8ff',
                    width:'200px',
                    border:'1px solid black',
                    borderRadius:'15px',
                    '&:hover':{
                        boxShadow:'18px'
                    }
                    }}>

                <Box>
                <InputLabel sx={{fontWeight:'bold',color:'black'}}>Size</InputLabel>
                
                <Select label="Size" 
                sx={{
                    height:'40px',
                    width:'75px',
                    bgcolor:'white',
                    '&:hover':{
                        border:'1px dashed #1976d2'
                    }
                }}
                value={size} onChange={ (e) => {setSize(e.target.value); setPageNo(0)}}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="S">S</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="XL">XL</MenuItem>
                </Select>
                </Box>

                <Box>
                <InputLabel sx={{fontWeight:'bold',color:'black'}}>Colour</InputLabel>
                <Select label="color" 
                sx={{
                    height:'40px',
                    width:'75px',
                    bgcolor:'white',
                    '&:hover':{
                        border:'1px dashed #1976d2'
                    }
                }}                
                value={color} onChange={ (e) => {setColor(e.target.value); setPageNo(0)}}>
                    <MenuItem value="">All</MenuItem>
                {uniqueColors.map((color) => (
                    <MenuItem key={color} value={color}>{color}</MenuItem>
                ))}

                </Select>
                </Box>
                
                </Box>

                {/* Price Range */}
                <Box sx={{mt:'10px',p:2,
                    backgroundColor: '#f0f8ff',
                    border:'1px solid black',
                    borderRadius:'15px',
                    }}>
                    <InputLabel sx={{fontWeight:'bold',color:'#1976d2'}}>Price Range</InputLabel>
                    <Slider
                    value={priceRangeFilter}
                    onChange={(e,newValue) => {setPriceRangeFilter(newValue)}}
                    onChangeCommitted={(e,newValue) => {setPriceRange(priceRangeFilter); setPageNo(0)}}
                    valueLabelDisplay='auto'
                    min={0}
                    max={9999}
                    sx={{
                        color:'black',
                    }}
                    />
                    <Typography sx={{color:'black'}}>
                        ₹{priceRange[0]} - ₹{priceRange[1]}
                    </Typography>

                </Box>



            </Menu>

        </Box>
        
        
        </>

    )



}

export default FilterButtonTemplate;