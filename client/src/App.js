import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {useRoutes} from './routes.js';
import {useAuth} from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Loader } from './components/Loader.js';
import 'materialize-css';

function App() {
  // получаем методы и данные из хука авторизации
  const {token, login, logout, userId, ready} = useAuth();
  // флаг для состояния авторизации, опирающийся на наличие токена
  const ifAuthenticated = !!token;
  const routes = useRoutes(ifAuthenticated);
  // если данные загружаются - показываем прелоадер
  if (!ready) {
    return <Loader/>
  }
  return (
    // отдаём контектом методы и данные авторизации
    <AuthContext.Provider value={{
      token, login, logout, userId, ifAuthenticated
    }}>
      {/* Если пользоваетль авторизован, отдаём навбар и клиентские роуты*/}
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
