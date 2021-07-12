import React,{Component} from 'react';
import Login from './UI-Pages/Login';
import Dashboard from './UI-Pages/Dashboard';
import {BrowserRouter , Switch , Route ,Redirect} from 'react-router-dom';
import Auth from './Components/Auth';
import { HashRouter } from 'react-router-dom';

function App(){ 
  return (
    <HashRouter>
    <Switch>

    <Route exact path="/">
    <Auth>
    <Dashboard/>
    </Auth>
    </Route>

    <Route exact path="/Login">
    <Auth nonAuth={true}>
    <Login />
    </Auth>
    </Route>

    <Route path="*" render={()=>"404 not found!"}/>
    </Switch>
    </HashRouter>
  );
}
export default App;
