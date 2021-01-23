import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/actions/authActions";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";

import { showErrMsg, showSuccessMsg } from "../../utils/Notification";

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};
export const Login = () => {
  const [user, setUser] = useState(initialState);
  const { email, password, err, success } = user;
  const history = useHistory();
  const dispatch = useDispatch();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", { email, password });
      setUser({ ...user, err: "", success: res.data.msg });
      localStorage.setItem("firstLogin", true);
      dispatch(login());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };
  const responseGoogle = async (response) => {
    //console.log(response)
    try {
      const res = await axios.post("/user/google_login", {
        tokenId: response.tokenId,
      });
      setUser({ ...user, err: "", success: res.data.msg });
      localStorage.setItem("firstLogin", true);
      dispatch(login());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };
  const responseFacebook = async (response) => {
     //console.log(response)
     try {
       const {accessToken,userID} = response
      const res = await axios.post("/user/facebook_login",{accessToken,userID});
      setUser({ ...user, err: "", success: res.data.msg });
      localStorage.setItem("firstLogin", true);
      dispatch(login());
      history.push("/");
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  }
  

  return (
    <div className="login_page">
      <h2>Login</h2>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            placeholder="Enter email address"
            id="email"
            value={email}
            name="email"
            onChange={handleChangeInput}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            id="password"
            value={password}
            name="password"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/forgot_password">Forgot your password?</Link>
        </div>
      </form>
      <p>
        New Customer? <Link to="/register">Register</Link>
      </p>
      <div className="hr">Login with</div>
      <div className="social">
        <GoogleLogin
          clientId="774135884721-ht2a6e8v3el58hu3a90s2e3qk2orled8.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          //onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
        <FacebookLogin
          appId="113399123921444"
          autoLoad={false}
          fields="name,email,picture"
          //onClick={componentClicked}
          callback={responseFacebook}
        />
        ,
      </div>
    </div>
  );
};
