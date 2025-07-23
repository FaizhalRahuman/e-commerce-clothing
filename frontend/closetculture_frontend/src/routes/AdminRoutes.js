
import {Routes,Route} from 'react-router-dom';
import { lazy } from 'react';

const AdminHomePage = lazy(() => import('../pages/admin/AdminHome'));

//Account Imports

const AccDeleteByIdPage = lazy(() => import('../pages/admin/card_button_pages/account/AccDeleteById'));
const AccViewAllPage = lazy(() => import('../pages/admin/card_button_pages/account/AccViewAll'));
const AccViewByIdPage = lazy(() => import('../pages/admin/card_button_pages/account/AccViewById'));

//Collection Imports

const CollAddByPrdIdPage = lazy(() => import('../pages/admin/card_button_pages/collection/CollAddByPrdId'));
const CollDeleteByIdPage = lazy(() => import('../pages/admin/card_button_pages/collection/CollDeleteById'));
const CollGetImgByIdPage = lazy(() => import('../pages/admin/card_button_pages/collection/CollGetImgById'));
const CollUpdByIdPage = lazy(() => import('../pages/admin/card_button_pages/collection/CollUpdById'));
const CollUploadImgByIdPage = lazy(() => import('../pages/admin/card_button_pages/collection/CollUploadImgById'));
const CollViewByPrdIdPage = lazy(() => import('../pages/admin/card_button_pages/collection/CollViewByPrdId'));
const CollViewAllPage = lazy(() => import('../pages/admin/card_button_pages/collection/CollViewAll'));
const CollViewByCollIdPage = lazy(() => import('../pages/admin/card_button_pages/collection/CollViewByCollId'));

//Product Imports

const ProdAddPage = lazy(() => import('../pages/admin/card_button_pages/product/ProdAdd'));
const ProdDeleteById = lazy(() => import('../pages/admin/card_button_pages/product/ProdDeleteById'));
const ProdUpdByIdPage = lazy(() => import('../pages/admin/card_button_pages/product/ProdUpdById'));
const ProdViewAllPage = lazy( () => import('../pages/admin/card_button_pages/product/ProdViewAll'));
const ProdViewByPrdIDPage = lazy( () => import('../pages/admin/card_button_pages/product/ProdViewByPrdId'));

//Stock Imports

const StkAddByCollIdPage = lazy(() => import('../pages/admin/card_button_pages/stock/StkAddByCollId'));
const StkDeleteByIdPage = lazy(() => import('../pages/admin/card_button_pages/stock/StkDeleteById'));
const StkGetImgByIdPage = lazy(() => import('../pages/admin/card_button_pages/stock/StkGetImgById'));
const StkUpdByIdPage = lazy(() => import('../pages/admin/card_button_pages/stock/StkUpdById'));
const StkUploadImgByIdPage = lazy(() => import('../pages/admin/card_button_pages/stock/StkUploadImgById'));
const StkViewAllPage = lazy(() => import('../pages/admin/card_button_pages/stock/StkViewAll'));
const StkViewByCollIdPage = lazy(() => import('../pages/admin/card_button_pages/stock/StkViewByCollId'));


const AdminRoutes = () =>{

    return(
    <Routes>

        <Route path='/admin/home' element={<AdminHomePage/>} />

        {/*Admin Account Routes*/}

        <Route path='/admin/account/delete-by-accId' element={<AccDeleteByIdPage/>} />
        <Route path='/admin/account/view-all' element={<AccViewAllPage/>} />
        <Route path='/admin/account/view-by-accId' element={<AccViewByIdPage/>} />

        {/*Admin Collection Routes*/}

        <Route path='/admin/collection/add-by-prdId' element={<CollAddByPrdIdPage/>} />
        <Route path='/admin/collection/delete-by-collId' element={<CollDeleteByIdPage/>} />
        <Route path='/admin/collection/getImg-by-collId' element={<CollGetImgByIdPage/>} />
        <Route path='/admin/collection/update-by-collId' element={<CollUpdByIdPage/>} />
        <Route path='/admin/collection/uploadImg-by-collId' element={<CollUploadImgByIdPage/>} />
        <Route path='/admin/collection/view-by-prdId' element={<CollViewByPrdIdPage/>} />
        <Route path='/admin/collection/view-by-collId' element={<CollViewByCollIdPage/>} />
        <Route path='/admin/collection/view-all' element={<CollViewAllPage/>} />
        

        {/*Admin Product Routes*/}

        <Route path='/admin/product/add' element={<ProdAddPage/>} />
        <Route path='/admin/product/delete-by-prdId' element={<ProdDeleteById/>} />
        <Route path='/admin/product/update-by-prdId' element={<ProdUpdByIdPage/>} />
        <Route path='/admin/product/view-all' element={<ProdViewAllPage/>} />
        <Route path='/admin/product/view-by-prdId' element={<ProdViewByPrdIDPage/>} />

        {/*Admin Stock Routes*/}

        <Route path='/admin/stock/add-by-collId' element={<StkAddByCollIdPage/>} />
        <Route path='/admin/stock/delete-by-stkId' element={<StkDeleteByIdPage/>} />
        <Route path='/admin/stock/getImg-by-stkId' element={<StkGetImgByIdPage/>} />
        <Route path='/admin/stock/update-by-stkId' element={<StkUpdByIdPage/>} />
        <Route path='/admin/stock/uploadImg-by-stkId' element={<StkUploadImgByIdPage/>} />
        <Route path='/admin/stock/view-all' element={<StkViewAllPage/>} />
        <Route path='/admin/stock/view-by-collId' element={<StkViewByCollIdPage/>} />


    </Routes>
    );

}

export default AdminRoutes;