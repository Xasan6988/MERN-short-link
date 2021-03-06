import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {LinksPage} from './pages/LinksPage.js';
import {CreatePage} from './pages/CreatePage.js';
import {DetailPage} from './pages/DetailPage.js';
import {AuthPage} from './pages/AuthPage.js';

// отобращение клиентских роутов в зависимости от авторизованности пользователя
export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/links" exact>
          <LinksPage/>
        </Route>
        <Route path="/create" exact>
          <CreatePage/>
        </Route>
        <Route path="/detail/:id">
          <DetailPage/>
        </Route>
        <Redirect to="/create"/>
      </Switch>
    );
  }
  return (
    <Switch>
        <Route path="/" exact>
          <AuthPage/>
        </Route>
        <Redirect to="/" />
    </Switch>
  )
};
