import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {useRoutes} from './routes.js';
import {useAuth} from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Loader } from './components/Loader.js';
import 'materialize-css';

function App() {
  const {token, login, logout, userId, ready} = useAuth();
  const ifAuthenticated = !!token;
  const routes = useRoutes(ifAuthenticated);

  if (!ready) {
    return <Loader/>
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, ifAuthenticated
    }}>
      <Router>
        { ifAuthenticated && <Navbar/> }
        <div className="container">
          {routes}
        </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
