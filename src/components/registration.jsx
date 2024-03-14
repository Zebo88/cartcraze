import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from '../api/user.jsx';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export default function Registration({ setUser }){
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [houseNum, setHouseNum] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState('password');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  let variant = "danger";


  async function handleSubmit(event){
    event.preventDefault();

    const errors = {};
    let formIsValid = true; 
  
    try {

      if (!firstName) {
        errors.name = 'First name required';
        formIsValid = false;
      }
  
      if (!lastName) {
        errors.cardNum = 'Last name required';
        formIsValid = false;
      }
  
      if (!email) {
        errors.email = 'Email required';
        formIsValid = false;
      }
  
      if (!username) {
        errors.username = 'Username required';
        formIsValid = false;
      }

      if (!password) {
        errors.password = 'Password required';
        formIsValid = false;
      }
  
      if (!streetAddress) {
        errors.streetaddress = 'Street required';
        formIsValid = false;
      }
  
      if (!city) {
        errors.city = 'City required';
        formIsValid = false;
      }
  
      if (!zipcode) {
        errors.zipcode = 'Zipcode required';
        formIsValid = false;
      }
  
      if (!state) {
        errors.state = 'State required';
        formIsValid = false;
      }
  
      if (!country) {
        errors.country = 'Country required';
        formIsValid = false;
      }

      if (!phone) {
        errors.phone = 'Phone number required';
        formIsValid = false;
      }
  
      if (!formIsValid) {
        variant = "danger";
        setMessage("Please fill out all the inputs");
        setFormErrors(errors);
        return;
      }

      // Clear the general error message if form is valid
      setMessage(""); 

      if(formIsValid){
        const response = await addUser(email, username, password, firstName, lastName, houseNum, streetAddress, city, state, country, zipcode, phone);    
        setUser(response.user);
        
        // Convert user object to string
        const userString = JSON.stringify(response.user);
        // Store user string in localStorage under the key 'user'
        localStorage.setItem('user', userString);
  
        if(response.user){
          variant = "success";
          setMessage("Successfully registered! Please login to you new account!");
          setTimeout(() => {
            navigate('/login'); //No token is received, so I need to route the user to the login page so they can get a token.
          }, 3000); // Navigate after 3 seconds 
        }else{
          throw new Error(response);
        }
      }
  
    } catch (error) {
      variant = "danger";
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
      { message && message !== "Successfully registered! Please login to you new account!" &&
          <Alert variant="danger" onClose={ dismissAlert } dismissible className="alert-container">
            <p>{ message }</p>
          </Alert>
      }
      { message && message === "Successfully registered! Please login to you new account!" &&
          <Alert variant="success" onClose={ dismissAlert } dismissible className="alert-container">
            <p>{ message }</p>
          </Alert>
      }
      <div className="login-container" style={{boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.1)"}}>
        <h4>Create Account</h4>

        <Form onSubmit={ handleSubmit }>
        <br />
        <Row xs={1} md={2} className="mb-3 g-3">
          <Col>
            <Form.Group controlId="formBasicFirstName">
              <Form.Control 
                type="firstName" 
                placeholder='First Name'
                value={ firstName } 
                onChange={ (e) => {setFirstName(e.target.value); setMessage(null)} }
                isInvalid={formErrors.firstName}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group  controlId="formBasicLastName">
              <Form.Control 
                type="lastName" 
                placeholder='Last Name'
                value={ lastName } 
                onChange={ (e) => {setLastName(e.target.value); setMessage(null)} }
                isInvalid={formErrors.lastName}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control 
              type="email" 
              placeholder='Email'
              value={ email } 
              onChange={ (e) => {setEmail(e.target.value); setMessage(null)} }
              isInvalid={formErrors.email}
            />
          </Form.Group>

        <Row xs={1} md={2} className="mb-3 g-3">
          <Col>
            <Form.Group controlId="formBasicUsername">
              <Form.Control 
                type="username"
                placeholder='Username'
                value={ username } 
                onChange={ (e) => {setUsername(e.target.value); setMessage(null)} }
                isInvalid={formErrors.username}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group  controlId="formBasicPassword">
              <Form.Control
                type={type} 
                placeholder='Password'
                value={ password } 
                onChange={ (e) => {setPassword(e.target.value); setMessage(null)}}
                isInvalid={formErrors.password}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Show Password" onClick={ handleToggle }/>
        </Form.Group>
          
        <Row xs={1} md={2} className="mb-3 g-3">
          <Col>
            <Form.Group controlId="formBasicHouseNum">
              <Form.Control
                type="houseNum"
                placeholder='House or Apt #'
                value={ houseNum } 
                onChange={ (e) => {setHouseNum(e.target.value); setMessage(null)}}
                isInvalid={formErrors.housenum}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBasicStreetAddress">
              <Form.Control
                type="streetAddress"
                placeholder='Street Address'
                value={ streetAddress } 
                onChange={ (e) => {setStreetAddress(e.target.value); setMessage(null)}}
                isInvalid={formErrors.streetaddress}
              />
            </Form.Group>
          </Col>
        </Row>
          
        <Row xs={1} md={2} className="mb-3 g-3">
          <Col>
            <Form.Group controlId="formBasicCity">
              <Form.Control
                type="city"
                placeholder='City'
                value={ city } 
                onChange={ (e) => {setCity(e.target.value); setMessage(null)}}
                isInvalid={formErrors.city}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBasicZipcode">
              <Form.Control
                type="zipcode"
                placeholder='Zipcode'
                value={ zipcode } 
                onChange={ (e) => {setZipcode(e.target.value); setMessage(null)}}
                isInvalid={formErrors.zipcode}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row xs={1} md={2} className="mb-3 g-3">
        <Col>
            <Form.Group controlId="formBasicState">
              <Form.Control
                type="state"
                placeholder='State'
                value={ state } 
                onChange={ (e) => {setState(e.target.value); setMessage(null)}}
                isInvalid={formErrors.state}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBasicCountry">
              <Form.Control
                type="country"
                placeholder='Country'
                value={ country } 
                onChange={ (e) => {setCountry(e.target.value); setMessage(null)}}
                isInvalid={formErrors.country}
              />
            </Form.Group>
          </Col>
        </Row>
          <Form.Group className="mb-3" controlId="formBasicPhone">
            <Form.Control
              type="phone"
              placeholder='Phone Number'
              value={ phone } 
              onChange={ (e) => {setPhone(e.target.value); setMessage(null)}}
              isInvalid={formErrors.phone}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="info" type="submit" size="sm" >
              Submit
            </Button>
          </div>     
          </Form>

          <hr />

            <Form.Label style={{fontSize:"12pt"}}>Already have an account?</Form.Label>
            <div className="d-grid gap-2">
              <Link to={'/login'} className="create-account-link" onClick={() => { navigate('/login') }}>Go to Login</Link>
            </div>
        </div>
      </div>
  )
}