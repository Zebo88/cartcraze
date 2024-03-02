import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from '../api/user';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export default function Registration({ setToken }){
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [houseNum, setHouseNum] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState('password');
  const navigate = useNavigate();
  let name = {
    firstname:"",
    lastname:""
  };
  let address = {
    city:"",
    street:"",
    number:"",
    zipcode:"",
    geolocation:{
      lat:'40.8296',
      long:'73.9262'
    }
  }

  async function handleSubmit(event){
    event.preventDefault();
  
    try {
      if(firstName === '' || lastName === '' || username === '' || password === ''){
        setMessage("Please fill out the entire form!");
        return;
      }

      name.firstname=firstName;
      name.lastname=lastName;

      address.city=city;
      address.street=streetAddress;
      address.number=houseNum;
      address.zipcode=zipcode;

      const response = await addUser(email, username, password, name, address, phone);    
      console.log(response);
      if(response.id){
        navigate('/login'); //No token is received, so I need to route the user to the login page so they can get a token.
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
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" size="sm" >
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