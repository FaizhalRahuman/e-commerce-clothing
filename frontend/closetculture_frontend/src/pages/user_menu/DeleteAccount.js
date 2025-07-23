import { useState } from "react";
import { fetchDeleteDataWithToken } from "../../client/client";
import { useNavigate } from "react-router-dom";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const DeleteAccount = () => {

    const navigate = useNavigate();

    const[ openDialog,setOpenDialog] = useState(true);
    const[deleteError,SetDeleteError] = useState('');


        const deleteAcc = async() =>{

            try{

                const res= await fetchDeleteDataWithToken(`/account/delete`);
                console.log("Account seccessfully deleted;",res.data);
                navigate('/account/logout');
            }catch(err){

                console.log("Error while deleting the Account",err.message);
                SetDeleteError(err.response?.data || err.message);
            }
        }

    return(
        <Box>

            <Dialog open={openDialog} onClose={ () => { setOpenDialog(false);window.location.reload()} }>

                <DialogTitle>Delete Account</DialogTitle>
                
                <DialogContent>
                    Are you sure to delete your Closet Culture account permanently ?
                </DialogContent>

                <DialogActions>
                    <Button onClick={ () => {setOpenDialog(false);window.location.reload()}}>
                        Cancel
                    </Button>

                    <Button onClick={deleteAcc}>
                        Delete
                    </Button>
                </DialogActions>

            </Dialog>

            
            {deleteError && <h5 style={{ color: 'red',fontSize: '2rem'}}>{deleteError}</h5>}

        </Box>
    )
}

export default DeleteAccount;