import React , {useEffect} from 'react'
import { BrowserRouter as Router} from "react-router-dom";
import {useSelector,useDispatch} from 'react-redux'

import "./App.css";
import { Header } from "./components/header/Header";
import { Body } from "./components/body/Body";
import axios from 'axios';
import { GET_TOKEN } from './redux/actions/Types';
import {fetchUser, getUser, login} from './redux/actions/authActions'


function App() {
  const token = useSelector(state => state.tokenReducer)
  const auth = useSelector(state => state.authReducer)
  const dispatch = useDispatch()

  const firstLogin = localStorage.getItem("firstLogin")
  useEffect(() => {
    if (firstLogin) {
      const get_token = async() => {
        const res = await axios.post("/user/refresh_token",null)
        //console.log(res)
        dispatch({type:GET_TOKEN,payload:res.data.accessToken})
      }
      get_token()
      
    }
    
  }, [auth.isLogged,dispatch,firstLogin])

  useEffect(() => {
    //console.log(token)
    if (token){
      const get_user = () => {
        dispatch(login())
        return fetchUser(token).then(res => dispatch(getUser(res)))
      }
      get_user()
      
    }
    
  }, [token,dispatch])
  return (
    <Router>
      <div className="App">
        <Header/>
        <Body/>
       
      </div>
    </Router>
  );
}

export default App;
