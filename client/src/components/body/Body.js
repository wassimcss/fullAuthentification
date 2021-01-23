
import React from 'react'
import { Route, Switch} from 'react-router-dom'
import { ActivationEmail } from './auth/ActivationEmail';
import { Home } from './auth/Home';
import { Login } from "./auth/Login";
import  Register  from "./auth/Register";
import {useSelector} from 'react-redux'
import { NotFound } from '../utils/NotFound';
import { ForgotPass } from './auth/ForgotPass';
import { ResetPassword } from './auth/ResetPassword';
import Profile from './profile/Profile';
import EditUser from './profile/EditUser';


export const Body = () => {
  const auth = useSelector(state => state.authReducer)
  const {isLogged,isAdmin} = auth

  return (
    <div>
      
       <Switch>
       <Route path="/" exact component={Home} />
        <Route path="/register" exact component={isLogged ? NotFound : Register}  />
        <Route path="/login" exact  component={isLogged ? NotFound : Login}  />
        <Route path="/forgot_password" exact  component={isLogged ? NotFound : ForgotPass}  />
        <Route path="/user/activate/:activation_token" exact component={ActivationEmail}/>
        <Route path="/user/reset/:token" exact component={ResetPassword}/>
        <Route path="/profile" component={isLogged ? Profile : NotFound} exact />
        <Route path="/edit_user/:id" component={isAdmin ? EditUser : NotFound} exact />
       </Switch>
      
    </div>
  );
};
