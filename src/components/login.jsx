import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import { login } from "../api/user.jsx";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { logoutUser } from '../api/user.jsx'
import { addProductToCart } from '../api/cart.jsx'

export default function Login({ setToken, setUser, preservedCart, setPreservedCart }){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('password');
  // let variant;
  const [variant, setVariant] = useState("");
  const navigate = useNavigate();

  async function handleLoginSubmit(event){
    event.preventDefault();

    try {
      if(username === '' || password === ''){
        setVariant("danger");
        setMessage("Please enter a username AND password!");
        return;
      }
      const response = await login(username, password);   
      
      if(response.token){
        setVariant("success");
        setToken(response.token);
        setUser(response);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", JSON.stringify(response.token));
        setMessage("Sign In Successful!");

        // If the user added items to the cart before signed in, add those items to their cart in the database
        if(preservedCart){
          await addPreservedCartToDatabase(response.user.user_id, response.token, preservedCart);
          // Navigate back to the cart so they can see their preserved cart items
          navigate('/cart');
        }else{
          // Otherwise, navigate to the homepage after login
          navigate('/');
        }

      }else{
        throw new Error(response.message);
      }

    } catch (error) {
      setVariant("danger");
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

 async function addPreservedCartToDatabase(userId, tokenString, cart) {
  try {
    // Create an array to store promises returned by addProductToCart
    const promises = cart.products.map((product) => {
      // Call addProductToCart for each product and store the promise
      return addProductToCart(userId, product.product_id, product.quantity, tokenString);
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    if(promises){
      return promises;
    }
    
  } catch (error) {
    console.error(error);
    return error;
  }
}

 async function signout(){
  try {
    // Retrieve the user object from local storage
    const tokenFromLocalStorage = localStorage.getItem("token");
    const tokenObject = tokenFromLocalStorage ? JSON.parse(tokenFromLocalStorage) : null;

    if(tokenObject){
      //Set the token state
      setToken(tokenObject);

      // Clear local storage
      localStorage.clear();

      const response = await logoutUser(tokenObject);
      setVariant("success");
      setMessage(response);
      setToken(null);

    }else{
      setVariant("danger");
      setMessage("You are not signed in!")
    }
    

  } catch (error) {
    console.error(error);
  }
 }

  return(
    <div className="main-container">
      { message && 
        <Alert variant={variant} onClose={ dismissAlert } dismissible className="alert-container">
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
          <br />
          <br />
          <div className="d-grid gap-2">
            <Link className="signout-link" onClick={() => { signout() }}>Sign Out</Link>
          </div> 

        </div>
      </div>
    )
}