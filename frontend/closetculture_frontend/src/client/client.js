
import axios from 'axios';

const base = process.env.REACT_APP_BASE_URL;

//----- Get Data --------------------------------------------------------------------------------------------------------------------------


const fetchGetData = (uri) => {

    const url = base+uri;

    return(
        axios.get(url)
        .catch( (err) => {
            console.log("Error While Getting Data"+err);
            throw err;
        })
    );
}

const fetchGetDataWithToken = (uri) => {
    
    const token = localStorage.getItem("token");
    const url = base+uri;

    return(
        axios.get(url,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        .catch( (err) => {
            console.log("Error While Getting Data(with token)",err);
            throw err;
        })
    );
}

const fetchGetDataWithArrayBuffer = (uri) =>{

    const url = base+uri;

    return axios.get(url,{
        responseType:'arraybuffer'
    }).catch((err) =>{
        console.log("Error While Getting Data With arraybuffer:",err);
        throw err;
    }
    )
}

const fetchGetDataWithArrayBufferWithToken = (uri) =>{

    const token = localStorage.getItem("token");
    const url = base+uri;

    return axios.get(url,{
        responseType:'arraybuffer',
        headers:{
                'Authorization':`Bearer ${token}`
            }
    }).catch((err) =>{
        console.log("Error While Getting Data With arraybuffer:",err);
        throw err;
    }
    )
}

//----- Post Data --------------------------------------------------------------------------------------------------------------------------

const fetchPostData = (uri,payload) => {

    const url = base+uri;

    return(
        axios.post(url,payload)
        .catch( (err) => {
            console.log("Error while Posting Data",err);
            throw err;
        })
    );
}

const fetchPostDataWithToken = (uri,payload) => {
    
    const token = localStorage.getItem("token");
    const url = base+uri;

    return(
        axios.post(url,payload,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        .catch( (err) => {
            console.log("Error While Posting Data(with token)",err);
            throw err;
        })
    );
}

const fetchPostImgWithToken = (uri,payload) => {
    
    const token = localStorage.getItem("token");
    const url = base+uri;

    return(
        axios.post(url,payload,{
            headers:{
                'Content-Type':'multipart/form-data',
                'Authorization':`Bearer ${token}`
            }
        })
        .catch( (err) => {
            console.log("Error While Posting Data(with token)",err);
            throw err;
        })
    );
}

//----- Put Data --------------------------------------------------------------------------------------------------------------------------

const fetchPutDataWithToken = (uri,payload) => {
    
    const token = localStorage.getItem("token");
    const url = base+uri;

    return(
        axios.put(url,payload,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        .catch( (err) => {
            console.log("Error While Puting Data(with token)",err);
            throw err;
        })
    );
}

//----- Delete Data --------------------------------------------------------------------------------------------------------------------------

const fetchDeleteDataWithToken = (uri) => {

    console.log(uri);

    const url = base+uri;
    const token = localStorage.getItem("token");

    return(
        axios.delete(url,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }).catch( (err) => {
            console.log("Error While Deleting Data(with token):",err);
            throw err;
        })
    )
}

export default fetchGetData;

export{ fetchGetDataWithToken, fetchGetDataWithArrayBuffer, fetchGetDataWithArrayBufferWithToken, 
        fetchPostData, fetchPostDataWithToken, fetchPostImgWithToken,
        fetchPutDataWithToken,
        fetchDeleteDataWithToken };