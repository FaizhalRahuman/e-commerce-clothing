
import {Routes,Route} from 'react-router-dom';

import { lazy } from 'react';

const HomePage = lazy( () => import('../pages/Home'));
const ProfilePage = lazy( () => import('../pages/user_menu/Profile'));
const ViewCartPage = lazy( () => import('../pages/cart/ViewCart'));
const OrderViaCartPage = lazy( () => import('../pages/cart/OrderViaCart'));
const CollByProdPage = lazy( () => import('../pages/products_collections/CollByProd'));
const StkByCollPage = lazy( () => import('../pages/products_collections/StkByColl'));


const MainRoutes = () =>{

    return(
        <Routes>

            <Route path="/" element={<HomePage/>} /> {/*Givin the path and the page to render */}
            <Route path="/account/profile" element={<ProfilePage/>} />
            <Route path="/cart/view-cart" element={<ViewCartPage/>} />
            <Route path="/cart/order-via-cart" element={<OrderViaCartPage/>} />
            <Route path="/coll-by-prod" element={<CollByProdPage/>} />
            <Route path="/stk-by-coll" element={<StkByCollPage/>} />

        </Routes>

    );

};

export default MainRoutes;