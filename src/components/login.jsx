import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/login";
import CartCrazeLogo2 from "../images/CartCrazeLogo2.jpeg"

export default function Login({ token, setToken, setAccountData }){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('password');
  const navigate = useNavigate();

  async function handleSubmit(event){
    event.preventDefault();

    try {
      const response = await login(username, password);    
      console.log("HandleSubmit: ",response);  

      if(response.token){
        setToken(response.token);
      }else{
        throw new Error("Could not login. Please try again.");
      }

    } catch (error) {
      setMessage(error);
    }

  };

  const handleToggle = () => {
    if (type==='password'){
       setType('text');
    } else {
       setType('password');
    }
 }

  return(
    <div className="main-container">
      <div className="login-container">
        <img
          src={CartCrazeLogo2}
          className="loginLogo"
        />
      <h1>Sign In</h1>
      { message && <p className="error-msg">{ message }</p>}
      <form onSubmit={ handleSubmit }>
        <label>
          <input 
            id="UN" 
            className="loginInput"
            type="text" 
            value={ username } 
            onChange={ (e) => {setUsername(e.target.value); setMessage(null)} }
            placeholder="Username"
          />
        </label>
        <br/>
        <label>
          <input 
            id="PW" 
            className="loginInput"
            type={type} 
            value={ password } 
            onChange={ (e) => {setPassword(e.target.value); setMessage(null)}}
            placeholder="Password"
           />
        </label>
        <br />
        <label className="showPW">
          Show Password
          <input id="showPW" className="checkbox" type="checkbox" onClick={handleToggle} />
          </label>
        <br/>
        <button type="submit" className="submit-btn">Login</button>
      </form>
      <hr />
      <p>New to CartCraze?</p>
      <button className="submit-btn">Create Account</button>
    </div>
    </div>
    
  )
}