import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";


export const Header = () => {
  const auth = useSelector((state) => state.authReducer);
  const { user, isLogged } = auth;
  const handleLogout = async() => {
    try {
       await axios.get("/user/logout")
      localStorage.removeItem("firstLogin")
      window.location.href = "/"
    } catch (error) {
      window.location.href = "/"
    }
  }
  
  const userLink = () => {
    return <li className="drop-nav">
        <Link to="#" className="avatar">
        <img src={user.avatar} alt=""/> {user.name} <i className="fas fa-angle-down"></i>
        </Link>
        <ul className="dropdown">
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/" onClick={handleLogout} >Logout</Link></li>
        </ul>
    </li>
}
  return (
    <header>
      <div className="logo">
        <h1>
          <Link to="/">WEBSITE TITLE</Link>
        </h1>
      </div>
      <ul>
        <li>
          <Link to="/">
            <i className="fas fa-shopping-cart"></i>Cart
          </Link>
        </li>
        <li>
          {isLogged ? (
            userLink()
          ) : (
            <Link to="/login">
              <i className="fas fa-user"></i>Sign in
            </Link>
          )}
        </li>
      </ul>
    </header>
  );
};
