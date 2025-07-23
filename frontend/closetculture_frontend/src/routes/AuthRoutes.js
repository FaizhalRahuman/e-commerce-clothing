
import {Route,Routes} from 'react-router-dom';
import {lazy} from 'react';

const RegisterPage = lazy( () => import('../pages/authentication/Register'));
const LoginPage = lazy( () => import('../pages/authentication/Login'));
const LogoutPage = lazy( () => import('../pages/authentication/Logout'));
const ForgetPasswordPage = lazy(()=> import('../pages/authentication/ForgetPassword'));

const AuthRoutes = () => {

    return(
        <Routes>

            <Route path="/account/register" element={<RegisterPage/>} />
            <Route path="/account/login" element={<LoginPage/>} />
            <Route path="/account/logout" element={<LogoutPage/>} />
            <Route path="/account/forget-password" element={<ForgetPasswordPage/>} />

        </Routes>
    );
}

export default AuthRoutes;