import { Box, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";

import {useNavigate} from 'react-router-dom';

const AdminCardTemplate = ({ image, collName, operations,activeOperation }) => {

  const navigate = useNavigate();

  const handleCardButtonClick = (key,value) => {

    if( (key === 'View_All' || key === 'Add_Product') ){

      navigate('/admin'+value);

    }else{

      activeOperation(key,value);

    }

  }


  return (
    <Card
      sx={{
        width: 320,
        height: 500,
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        "&:hover .overlay": {
          transform: "translatex(0%)",
        },
      }}
    >
      {/* Card Image */}
      <CardMedia
        component="img"
        image={image}
        alt={collName}
        sx={{
          height: "100%",
          width: "100%",
          objectFit: "cover",
          position: "absolute",
          // top: 0,
          // left: 0,
          zIndex: 1,
        }}
      />

      {/* Overlay Slide-In from Left */}
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          // top: 0,
          // left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0)",
          backdropFilter: "blur(3px)",
          transform: "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            mt:"30px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "80%",
            // alignItems: "right",
          }}
        >
          {operations &&
            Object.entries(operations).map(([key, value]) => (
              <Button
                key={key}
                variant="text"
                size="small"
                onClick={() => handleCardButtonClick(key,value)}
                sx={{
                  color: "black",
                  fontWeight:"bold",
                  fontFamily:"sans-serif",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  textTransform: "none",
                  width: "100%",
                  border: "1px solid rgba(0, 0, 0, 0.32)",
                  borderRadius: "7px",
                  zIndex: 3,
                }}
              >
                {key}
              </Button>
            ))}
        </Box>
      </Box>

      {/* Label at the Bottom */}
      <CardContent
        sx={{
          // mt: "auto",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.17)",
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {collName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AdminCardTemplate;