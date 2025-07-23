
import {Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography} from "@mui/material";

const CartCardTemplate = ({image,collName,size,color,rate,quantity}) => {

    return(

    <Card sx={{
        height:'345px',
        width: {
        xs: '100%',   // full width on small screens
        sm: '90%',
        md: '250px',
        },
        bgcolor:'ButtonShadow',
        borderRadius:'40px',
        transition:'transform 0.5s',
        '&:hover':{
            transform:'scale(1.01)',
            boxShadow:8
        }
        }} xs={2} sm={8} md={6} lg={2}>

        <CardActionArea>

        <CardMedia 
        component="img"
        height="250px"
        sx={{
            borderRadius:'50px'
        }}
        image={image}
        alt={"ERROR"}
        />

        <CardContent>

            <Typography gutterBottom variant="h3" component="div" sx={{fontSize:'1rem',fontFamily:'verdana',fontWeight:'bold'}}
            > {collName} </Typography>
            <Typography gutterBottom variant="body2"> Size:{size} | Colour:{color}</Typography>
            <Typography gutterBottom variant="body2"> Rate:{rate} | Qty:{quantity}</Typography>

        </CardContent>

        </CardActionArea>

    </Card>
    );


}

export default CartCardTemplate;