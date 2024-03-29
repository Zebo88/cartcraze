import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Button, FormLabel } from "react-bootstrap";
import { purchaseItems } from '../api/orders.jsx'


export default function Checkout({ user, token, cart, setCart }){
  const [name, setName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [billAddress, setBillAddress] = useState("");
  const [billCity, setBillCity] = useState("");
  const [billState, setBillState] = useState("");
  const [billZipcode, setBillZipcode] = useState("");
  const [billCountry, setBillCountry] = useState("");
  const [checked, setChecked] = useState(false);
  const [shipName, setShipName] = useState("");
  const [shipAddress, setShipAddress] = useState(""); 
  const [shipCity, setShipCity] = useState("");
  const [shipState, setShipState] = useState("");
  const [shipZipcode, setShipZipcode] = useState("");
  const [shipCountry, setShipCountry] = useState("");
  const [subtotalQuantity, setSubtotalQuantity] = useState(0);
  const [subtotalPrice, setSubtotalPrice] = useState(0);
  const [generalError, setGeneralError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [summary, setSummary] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    calculateSubtotal(cart);
  }, [cart]);

  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [alertMessage]);

  useEffect(() => {
    async function getCartItems() {
      try {
        // Retrieve the current cart array from local storage
        const cartFromLocalStorage = localStorage.getItem("cart");
        // Parse the cart array from JSON format to JavaScript array
        const cartArray = cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : [];
        // Set cart to the cartArray variable
        setCart(cartArray);

        // Set the subtotal and item counts for the cart
        calculateSubtotal(cart);

        // Once cart items are fetched, check if all the inputs are filled and navigate if valid
        if (orderPlaced) {
          navigate('/');
        }

      } catch (error) {
        console.error(error);
      }
    }

    getCartItems();   

  },[]);

  function calculateSubtotal(cartArray) {
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cartArray && cartArray.products) {
      cartArray.products.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
      });
    }

    setSubtotalQuantity(totalQuantity);
    setSubtotalPrice(totalPrice);
  }

  function handleCheckboxChange() {
    if (!checked) {
      setShipName(name);
      setShipAddress(billAddress);
      setShipCity(billCity);
      setShipZipcode(billZipcode);
      setShipState(billState);
      setShipCountry(billCountry);
    } else {
      // If the checkbox is unchecked, clear the shipping address fields
      setShipName('');
      setShipAddress('');
      setShipCity('');
      setShipZipcode('');
      setShipState('');
      setShipCountry('');
    }
  }

  function handleSubmit() {
    const errors = {};
    let formIsValid = true;   

    if (!name) {
      errors.name = 'Name is required';
      formIsValid = false;
    }

    if (!cardNum) {
      errors.cardNum = 'Card number required';
      formIsValid = false;
    }

    if (!expDate) {
      errors.expDate = 'Expiration date required';
      formIsValid = false;
    }

    if (!cvc) {
      errors.cvc = 'CVC required';
      formIsValid = false;
    }

    if (!billAddress) {
      errors.billAddress = 'Billing address required';
      formIsValid = false;
    }

    if (!billCity) {
      errors.billCity = 'City required';
      formIsValid = false;
    }

    if (!billZipcode) {
      errors.billZipcode = 'Zipcode required';
      formIsValid = false;
    }

    if (!billState) {
      errors.billState = 'State required';
      formIsValid = false;
    }

    if (!billCountry) {
      errors.billCountry = 'Country required';
      formIsValid = false;
    }

    if (!shipName) {
      errors.shipName = 'Name required';
      formIsValid = false;
    }

    if (!shipAddress) {
      errors.shipAddress = 'Shipping address required';
      formIsValid = false;
    }

    if (!shipCity) {
      errors.shipCity = 'City required';
      formIsValid = false;
    }

    if (!shipZipcode) {
      errors.shipZipcode = 'Zipcode required';
      formIsValid = false;
    }

    if (!shipState) {
      errors.shipState = 'State required';
      formIsValid = false;
    }

    if (!shipCountry) {
      errors.shipCountry = 'Country required';
      formIsValid = false;
    }

    if (!formIsValid) {
      setGeneralError("Please fill out all the inputs");
      setFormErrors(errors);
      return;
    }

    // Clear the general error message if form is valid
    setGeneralError(""); 

    // // Clear cart from localStorage
    if(formIsValid){
        setAlertMessage(true);
      }      

    //   // Set success to true so the summary will be displayed
    //   setSummary(true);
  };

  function checkout(){
    // Set the alert to false to close the confirmation alert for the purchase
    setAlertMessage(false);
    
    // Clear cart from localStorage
    setOrderPlaced(true);
    setSuccessMessage(true);
    localStorage.removeItem("cart");

    if(token){
      // Create order for user in database (registered user feature only)
      purchaseItems(user.user_id, token);
    }      

    // Set success to true so the summary will be displayed
    setSummary(true);
  }

  return(
    <Container className="checkout-container">
      <h3>Checkout</h3>
      <Link  to="/cart" className="back-link">{`< Back to Cart`}</Link>
      <br />
      <Card style={{padding:"20px"}}>
      <Card.Title>{`Order Details (${subtotalQuantity} Items)`}</Card.Title>
      {successMessage && 
        <Alert variant="success">
          Order Placed!
        </Alert>
      }
      { alertMessage &&
        <Alert variant="warning">
          <Alert.Heading>You are about to place your order.</Alert.Heading>
          <p>Do you wish to continue?</p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button onClick={ () => { setAlertMessage(false); checkout(); } } size="sm" variant="warning" style={{marginRight:"25px"}}>
              Yes
            </Button>
            <Button onClick={ () => navigate('/cart') } size="sm" variant="warning">
              No
            </Button>
          </div>
        </Alert>
      }
      <hr />
      { !summary && 
      <Row md={1} lg={1} xl={2}>
        <Col lg={6} xl={7}>
          <Container style={{marginTop:"0"}}>
            <h5>Payment Details</h5>
            {generalError && <Alert variant="danger">{generalError}</Alert>}
            <Form style={{backgroundColor:"#e4e4e4"}}>
              <Row style={{padding:"10px"}}>
                <Form.Group>
                  <FormLabel>Cardholder Name:</FormLabel>
                  <Form.Control
                    name="username"
                    type="username" 
                    placeholder="John Doe"
                    value={ name } 
                    onChange={ (e) => {setName(e.target.value);} }
                    isInvalid={formErrors.name}
                  />
                  {/* <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group>
                  <FormLabel>Card Number:</FormLabel>
                  <Form.Control
                    name="cardnum"
                    type="text" 
                    placeholder="####-####-####-####"
                    value={ cardNum } 
                    onChange={ (e) => {setCardNum(e.target.value);} }
                    isInvalid={formErrors.cardNum}
                  />
                  {/* <Form.Control.Feedback type="invalid">{formErrors.cardNum}</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col}>
                  <FormLabel>Expiration Date:</FormLabel>
                  <Form.Control
                    name="expdate"
                    type="text" 
                    placeholder="MM/YYYY"
                    value={ expDate } 
                    onChange={ (e) => {setExpDate(e.target.value);} }
                    isInvalid={formErrors.expDate}
                  />
                  {/* <Form.Control.Feedback type="invalid">{formErrors.expDate}</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col}>
                  <FormLabel>CVC:</FormLabel>
                  <Form.Control
                    name="cvc"
                    type="text" 
                    placeholder="###"
                    value={ cvc } 
                    onChange={ (e) => {setCvc(e.target.value);} }
                    isInvalid={formErrors.cvc}
                  />
                  {/* <Form.Control.Feedback type="invalid">{formErrors.cvc}</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group>
                <FormLabel>Billing Address:</FormLabel>
                  <Form.Control
                    name="billAddress"
                    type="text" 
                    placeholder="123 N 456 E"
                    value={ billAddress } 
                    onChange={ (e) => {setBillAddress(e.target.value);} }
                    isInvalid={formErrors.billAddress}
                  />
                  {/* <Form.Control.Feedback type="invalid">{formErrors.billAddress}</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col}>
                  <Row style={{marginLeft:"0"}}>
                      <FormLabel>City:</FormLabel>
                      <Form.Control
                        name="billCity"
                        type="text" 
                        placeholder="City"
                        value={ billCity } 
                        onChange={ (e) => {setBillCity(e.target.value);} }
                        isInvalid={formErrors.billCity}
                      />
                      {/* <Form.Control.Feedback type="invalid">{formErrors.billCity}</Form.Control.Feedback> */}
                    <FormLabel>Zipcode:</FormLabel>
                    <Form.Control
                      name='billZip'
                      type="text" 
                      placeholder="#####"
                      value={ billZipcode } 
                      onChange={ (e) => {setBillZipcode(e.target.value);} }
                      isInvalid={formErrors.billZipcode}
                      />
                      {/* <Form.Control.Feedback type="invalid">{formErrors.billZipcode}</Form.Control.Feedback> */}
                  </Row>
                </Form.Group>
                <Form.Group as={Col}>
                  <Row style={{margin:"0"}}>
                  <FormLabel>State:</FormLabel>
                    <Form.Select
                      name="billState"
                      type="text" 
                      placeholder="State"
                      value={ billState } 
                      onChange={ (e) => {setBillState(e.target.value);} }
                      isInvalid={formErrors.billState}
                      >                      
                      <option>Select</option>
                      <option>AZ</option>
                      <option>CA</option>
                      <option>CO</option>
                      <option>ID</option>
                      <option>NV</option>
                      <option>UT</option>
                      <option>WY</option>
                    </Form.Select>
                    {/* <Form.Control.Feedback type="invalid">{formErrors.billState}</Form.Control.Feedback> */}
                    <FormLabel>Country:</FormLabel>
                    <Form.Control
                      name="billCountry"
                      type="text" 
                      placeholder="USA"
                      value={ billCountry } 
                      onChange={ (e) => {setBillCountry(e.target.value);} }
                      isInvalid={formErrors.billCountry}
                    />
                    {/* <Form.Control.Feedback type="invalid">{formErrors.billCountry}</Form.Control.Feedback> */}
                  </Row>
                </Form.Group>
              </Row>
            </Form>

            <hr />

            <Card.Title>Shipping Address</Card.Title>
            <Form.Check
              type="checkbox"
              id={`default-checkbox`}
              label={`Same as billing address`}
              checked={checked}
              // onClick={()=>{ checked ? setChecked(!checked) : setChecked(true)}}
              onChange={() => {
                setChecked(!checked); // Toggle the checked state
                handleCheckboxChange(); // Update shipping details based on the checkbox state
              }}
            />

            <Form style={{backgroundColor:"#e4e4e4"}}>
              <Row style={{padding:"10px"}}>
                <Form.Group>
                  <FormLabel>Name:</FormLabel>
                  <Form.Control
                    name="shipname"
                    type="username" 
                    placeholder="John Doe"
                    value={ shipName } 
                    onChange={ (e) => {setShipName(e.target.value);} }
                    isInvalid={formErrors.shipName}
                  />
                  {/* <Form.Control.Feedback type="invalid">{formErrors.shipName}</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group>
                <FormLabel>Address:</FormLabel>
                  <Form.Control
                    name="shipAddress"
                    type="text" 
                    placeholder="123 N 456 E"
                    value={ shipAddress } 
                    onChange={ (e) => {setShipAddress(e.target.value);} }
                    isInvalid={formErrors.shipAddress}
                  />
                  {/* <Form.Control.Feedback type="invalid">{formErrors.shipAddress}</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col}>
                  <Row style={{margin:"0"}}>                      
                      <FormLabel>City:</FormLabel>
                      <Form.Control
                        name="shipCity"
                        type="text" 
                        placeholder="City"
                        value={ shipCity } 
                        onChange={ (e) => {setShipCity(e.target.value);} }
                        isInvalid={formErrors.shipCity}
                      />
                      {/* <Form.Control.Feedback type="invalid">{formErrors.shipCity}</Form.Control.Feedback> */}
                    <FormLabel>Zipcode:</FormLabel>
                    <Form.Control
                      name="shipZip"
                      type="text" 
                      placeholder="#####"
                      value={ shipZipcode } 
                      onChange={ (e) => {setShipZipcode(e.target.value);} }
                      isInvalid={formErrors.shipZipcode}
                    />
                    {/* <Form.Control.Feedback type="invalid">{formErrors.shipZipcode}</Form.Control.Feedback> */}
                  </Row>
                </Form.Group>
                <Form.Group as={Col}>
                  <Row style={{marginRight:"0", paddingRight:"0"}}>                    
                    <FormLabel>State:</FormLabel>
                      <Form.Select
                        name="shipState"
                        type="text" 
                        placeholder="State"
                        value={ shipState } 
                        onChange={ (e) => {setShipState(e.target.value);} }
                        isInvalid={formErrors.shipState}
                        >                          
                        <option>Select</option>
                        <option>AZ</option>
                        <option>CA</option>
                        <option>CO</option>
                        <option>ID</option>
                        <option>NV</option>
                        <option>UT</option>
                        <option>WY</option>
                      </Form.Select>
                      {/* <Form.Control.Feedback type="invalid">{formErrors.shipState}</Form.Control.Feedback> */}
                      <FormLabel>Country:</FormLabel>
                      <Form.Control
                        name="shipCountry"
                        type="text" 
                        placeholder="USA"
                        value={ shipCountry } 
                        onChange={ (e) => {setShipCountry(e.target.value);} }
                        isInvalid={formErrors.shipCountry}
                      />
                      {/* <Form.Control.Feedback type="invalid">{formErrors.shipCountry}</Form.Control.Feedback>                     */}
                  </Row>
                </Form.Group>
              </Row>
            </Form>
          </Container>
          
          </Col>
          <Col lg="6" xl="5">
          <Container style={{margin:"0"}}>
            <Card style={{padding:"20px"}}>
              <Card.Title style={{fontSize:"18pt"}}>Order Summary</Card.Title>
              <hr />
              <div className="summary-container">
                {cart && cart.products && cart.products.map((item, index) => (
                    <div className="order-summary" key={index}>
                      <p>{`${item.title} (${item.quantity}):`}</p>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))
                }
                <hr />
                <div className="order-summary">
                  <p>Subtotal:</p><p>${subtotalPrice.toFixed(2)}</p>
                </div>
                <div className="order-summary">
                  <p>Shipping and Handling:</p><p>${(subtotalPrice * .05).toFixed(2)}</p>
                </div>
                <div className="order-summary">
                  <p>Tax:</p><p>${(subtotalPrice * .1).toFixed(2)}</p>
                </div>
                <hr />
                <div className="order-summary">
                  <h5>Total:</h5><p>${(subtotalPrice + (subtotalPrice * .05) + (subtotalPrice * .1)).toFixed(2)}</p>
                </div>
              </div>
              <Button variant="info" onClick={ handleSubmit }>Checkout</Button>
              </Card>
            </Container>
          </Col>
        </Row>  
        }

        { summary &&
          <Row>
              <Container style={{margin:"0"}}>
                <Card style={{padding:"20px"}}>
                  <Card.Title style={{fontSize:"18pt"}}>Order Summary</Card.Title>
                  <hr />
                  <div className="summary-container">
                    {cart && cart.products && cart.products.map((item, index) => (
                        <div className="order-summary" key={index}>
                          <p>{`${item.title} (${item.quantity}):`}</p>
                          <p>${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))
                    }
                    <hr />
                    <div className="order-summary">
                      <p>Subtotal:</p><p>${subtotalPrice.toFixed(2)}</p>
                    </div>
                    <div className="order-summary">
                      <p>Shipping and Handling:</p><p>${(subtotalPrice * .05).toFixed(2)}</p>
                    </div>
                    <div className="order-summary">
                      <p>Tax:</p><p>${(subtotalPrice * .1).toFixed(2)}</p>
                    </div>
                    <hr />
                    <div className="order-summary">
                      <h5>Total:</h5><p>${(subtotalPrice + (subtotalPrice * .05) + (subtotalPrice * .1)).toFixed(2)}</p>
                    </div>
                  </div>
                  <Button variant="secondary" style={{ width:"100px"}} onClick={ ()=> { navigate('/') } }>Dismiss</Button>
                  </Card>
                </Container>
            </Row>  
        }
      </Card>
    </Container>
  )
}