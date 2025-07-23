
import {useNavigate,useLocation} from 'react-router-dom';
import {useEffect} from 'react';

const Logout = () =>{

    const navigate = useNavigate();
    const location = useLocation();
    const queryParam = new URLSearchParams(location.search);
    const accUpdate = queryParam.get("accUpdate");

    useEffect( () => {

        if(accUpdate){
            localStorage.removeItem("token");
            navigate('/account/login');
            
        }else{
         
            localStorage.removeItem("token");
            navigate('/');  //---> navigates after the component mounts/get loaded fully because of inide a use Effect,if we didn't put it
                        //inside a useEffect,logout page render agurapove indha navigate line execute agirum,so may be namaku,home page \
                        // navigate aagama polam/poirum because currently logout page rendering is happening
        }
    }

    )



}

export default Logout;