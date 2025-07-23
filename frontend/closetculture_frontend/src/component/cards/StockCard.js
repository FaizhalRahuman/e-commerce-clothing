
import {Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography} from "@mui/material";

const StockCardTemplate = ({image,collName,size,color,rate,stockAvl}) => {

    return(

    <Card sx={{width:'300px'}} xs={2} sm={8} md={6} lg={2}>

        <CardActionArea>

        <CardMedia 
        component="img"
        height="350px"
        image={image}
        alt={"ERROR"}
        />

        <CardContent>

            <Typography gutterBottom variant="h3" component="div" sx={{fontSize:'1rem',fontFamily:'verdana',fontWeight:'bold'}}
            > {collName} </Typography>
            <Typography gutterBottom variant="body2"> Size:{size} | Colour:{color}</Typography>
            <Typography gutterBottom variant="body2"> Rate:{rate} | AvailableStock:{stockAvl?.toString()}</Typography>

        </CardContent>

        </CardActionArea>

    </Card>
    );


}

export default StockCardTemplate;