
import {BrowserRouter} from 'react-router-dom';

import MainRoutes from './routes/MainRoutes';
import AuthRoutes from './routes/AuthRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    // <div className="App">
      <BrowserRouter>
      
        <AdminRoutes/>
        <MainRoutes/>
        <AuthRoutes/>
      
      </BrowserRouter>
    /* </div> */
  );
}

export default App;
