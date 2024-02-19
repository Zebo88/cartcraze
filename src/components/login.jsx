import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import { login } from "../api/login";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

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
      console.log(response);
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

  return(
    <div className="main-container">
      { message && 
          <Alert variant="danger" onClose={() => setShow(false)} dismissible className="alert-container">
            {/* <Alert.Heading>{ message }</Alert.Heading> */}
            <p>{ message }</p>
          </Alert>
      }
      <div className="login-container">
        <h4>Sign In</h4>
        
        <Form onSubmit={ handleSubmit }>
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
            <Button variant="primary" type="submit" size="sm" >
              Login
            </Button>
          </div>

          <hr />
          
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label style={{fontSize:"12pt"}}>New to CartCraze?</Form.Label>
              <br />
              <div className="d-grid gap-2">
                <Button variant="outline-secondary" type="submit" size="sm">
                  Create Account
                </Button> 
              </div>    
            </Form.Group>      
          </Form>
        </div>
      </div>
    )
}