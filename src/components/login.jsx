import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import { login } from "../api/login";
import Registration from "./registration";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Login({ token, setToken, setAccountData }){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('password');
  const navigate = useNavigate();

  async function handleLoginSubmit(event){
    event.preventDefault();

    try {
      if(username === '' || password === ''){
        setMessage("Please enter a username AND password!");
        return;
      }
      const response = await login(username, password);    

      if(response.token){
        setToken(response.token);
        navigate('/');
      }else{
        throw new Error(response);
      }

    } catch (error) {
      setMessage(error.message);
      console.log(error);
    }

  };

  const handleToggle = () => {
    if (type==='password'){
       setType('text');
    } else {
       setType('password');
    }
 }

 function dismissAlert(){
  setMessage(null);
 }

  return(
    <div className="main-container">
      { message && 
          <Alert variant="danger" onClose={ dismissAlert } dismissible className="alert-container">
            <p>{ message }</p>
          </Alert>
      }
      <div className="login-container" style={{boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.1)"}}>
        <h4>Sign In</h4>
        
        <Form onSubmit={ handleLoginSubmit }>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control 
              type="username" 
              placeholder="Enter username" 
              value={ username } 
              onChange={ (e) => {setUsername(e.target.value); setMessage(null)} }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              placeholder="Password" type={type} 
              value={ password } 
              onChange={ (e) => {setPassword(e.target.value); setMessage(null)}}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Show Password" onClick={ handleToggle }/>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="info" type="submit" size="sm" >
              Login
            </Button>
          </div>     
          </Form>

          <hr />


            <Form.Label style={{fontSize:"12pt"}}>New to CartCraze?</Form.Label>
            <div className="d-grid gap-2">
              <Link to={'/registration'} className="create-account-link" onClick={() => { navigate('/registration') }}>Create Account</Link>
            </div>    

        </div>
      </div>
    )
}