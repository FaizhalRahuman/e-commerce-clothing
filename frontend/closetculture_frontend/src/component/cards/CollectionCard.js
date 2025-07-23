
import {Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CollectionCardTemplate = ({image,collName,collType,collId}) => {

    const navigate = useNavigate();

    return(

    <Card 
    onClick={ () => navigate('/stk-by-coll?collId='+collId+'&collType='+collType,{
        state:{
            collImg:image
        }
    })}
    
    sx={{width:'300px',borderRadius:'20px'}} xs={2} sm={8} md={6} lg={2}>

        <CardActionArea>

        <CardMedia 
        component="img"
        height="350px"
        image={image}
        alt={collName}
        />

        <CardContent>

            <Typography gutterBottom variant="h3" component="div" sx={{fontSize:'1rem',fontFamily:'verdana',fontWeight:'bold'}}> {collName} </Typography>
            <Typography gutterBottom variant="body2"> {collType} </Typography>

        </CardContent>

        </CardActionArea>

    </Card>
    );

}

export default CollectionCardTemplate;