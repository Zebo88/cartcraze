import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Button, FormLabel } from "react-bootstrap";


export default function Checkout({ token, cart, setCart }){
  const [name, setName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [billAddress, setBillAddress] = useState("");
  const [billCity, setBillCity] = useState("");
  const [billState, setBillState] = useState("");
  const [billCountry, setBillCountry] = useState("");
  const [checked, setChecked] = useState(true);
  const [shipName, setShipName] = useState("");
  const [shipAddress, setShipAddress] = useState(""); 
  const [shipCity, setShipCity] = useState("");
  const [shipState, setShipState] = useState("");
  const [shipCountry, setShipCountry] = useState("");
  const navigate = useNavigate();

  function handleSubmit(){
    if(checked){
      setShipName(name);
      setShipAddress(billAddress);
      setShipCity(billCity);
      setShipState(billState);
      setShipCountry(billCountry);
    }


    navigate('/');
  }

  return(
    <Container className="checkout-container">
      <h3>Checkout</h3>
      <Card style={{padding:"20px"}}>
      <Card.Title>{"Order Details (3 Items)"}</Card.Title>
      <hr />
      <Row md={1} lg={1} xl={2}>
        <Col lg={7} xl={8}>
          <Container style={{marginTop:"0"}}>
            <h5>Payment Details</h5>
            <Form style={{backgroundColor:"#e4e4e4"}}>
              <Row style={{padding:"10px"}}>
                <Form.Group>
                  <FormLabel>Cardholder Name:</FormLabel>
                  <Form.Control
                    type="username" 
                    placeholder="John Doe"
                    value={ name } 
                    onChange={ (e) => {setName(e.target.value); setMessage(null)} }
                  />
                </Form.Group>
                <Form.Group>
                  <FormLabel>Card Number:</FormLabel>
                  <Form.Control
                    type="text" 
                    placeholder="####-####-####-####"
                    value={ cardNum } 
                    onChange={ (e) => {setCardNum(e.target.value); setMessage(null)} }
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <FormLabel>Expiration Date:</FormLabel>
                  <Form.Control
                    type="text" 
                    placeholder="MM/YYYY"
                    value={ expDate } 
                    onChange={ (e) => {setExpDate(e.target.value); setMessage(null)} }
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <FormLabel>CVC:</FormLabel>
                  <Form.Control
                    type="text" 
                    placeholder="###"
                    value={ cvc } 
                    onChange={ (e) => {setCvc(e.target.value); setMessage(null)} }
                  />
                </Form.Group>
                <Form.Group>
                <FormLabel>Billing Address:</FormLabel>
                  <Form.Control
                    type="text" 
                    placeholder="123 N 456 E"
                    value={ billAddress } 
                    onChange={ (e) => {setBillAddress(e.target.value); setMessage(null)} }
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <FormLabel>City:</FormLabel>
                  <Form.Control
                    type="text" 
                    placeholder="City"
                    value={ billCity } 
                    onChange={ (e) => {setBillCity(e.target.value); setMessage(null)} }
                  />
                </Form.Group>
                <Form.Group as={Col}>
                <FormLabel>State:</FormLabel>
                  <Form.Select
                    type="text" 
                    placeholder="State"
                    value={ billState } 
                    onChange={ (e) => {setBillState(e.target.value); setMessage(null)} }>
                    <option>Select</option>
                    <option>AZ</option>
                    <option>CA</option>
                    <option>CO</option>
                    <option>ID</option>
                    <option>NV</option>
                    <option>UT</option>
                    <option>WY</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <FormLabel>Country:</FormLabel>
                  <Form.Control
                    type="text" 
                    placeholder="USA"
                    value={ billCountry } 
                    onChange={ (e) => {setBillCountry(e.target.value); setMessage(null)} }
                  />
                </Form.Group>
              </Row>
            </Form>

            <hr />

            <Card.Title>Shipping Address</Card.Title>
            <Form.Check
              type="checkbox"
              id={`default-checkbox`}
              label={`Same as billing address`}
              defaultChecked={true}
              onClick={()=>{ checked ? setChecked(false) : setChecked(true)}}
            />
            { !checked &&
              <Form style={{backgroundColor:"#e4e4e4"}}>
                <Row style={{padding:"10px"}}>
                  <Form.Group>
                    <FormLabel>Name:</FormLabel>
                    <Form.Control
                      type="username" 
                      placeholder="John Doe"
                      value={ shipName } 
                      onChange={ (e) => {setShipName(e.target.value); setMessage(null)} }
                    />
                  </Form.Group>
                  <Form.Group>
                  <FormLabel>Address:</FormLabel>
                    <Form.Control
                      type="text" 
                      placeholder="123 N 456 E"
                      value={ shipAddress } 
                      onChange={ (e) => {setShipAddress(e.target.value); setMessage(null)} }
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <FormLabel>City:</FormLabel>
                    <Form.Control
                      type="text" 
                      placeholder="City"
                      value={ shipCity } 
                      onChange={ (e) => {setShipCity(e.target.value); setMessage(null)} }
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                  <FormLabel>State:</FormLabel>
                    <Form.Select
                      type="text" 
                      placeholder="State"
                      value={ shipState } 
                      onChange={ (e) => {setShipState(e.target.value); setMessage(null)} }>
                      <option>Select</option>
                      <option>AZ</option>
                      <option>CA</option>
                      <option>CO</option>
                      <option>ID</option>
                      <option>NV</option>
                      <option>UT</option>
                      <option>WY</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group>
                    <FormLabel>Country:</FormLabel>
                    <Form.Control
                      type="text" 
                      placeholder="USA"
                      value={ shipCountry } 
                      onChange={ (e) => {setShipCountry(e.target.value); setMessage(null)} }
                    />
                  </Form.Group>
                </Row>
              </Form>
            }
          </Container>
          
          </Col>
          <Col lg="5" xl="4">
          <Container style={{margin:"0"}}>
            <Card style={{padding:"20px"}}>
              <Card.Title style={{fontSize:"18pt"}}>Order Summary</Card.Title>
              <hr />
              <div className="summary-container">
                <div className="order-summary">
                  <p>{"Product (2):"}</p><p>$100.00</p>
                </div>
                <div className="order-summary">
                  <p>{"Product (1):"}</p><p>$23.00</p>
                </div>
                <hr />
                <div className="order-summary">
                  <p>Subtotal:</p><p>$123.00</p>
                </div>
                <div className="order-summary">
                  <p>Shipping and Handling:</p><p>$3.00</p>
                </div>
                <div className="order-summary">
                  <p>Tax:</p><p>$3.00</p>
                </div>
                <hr />
                <div className="order-summary">
                  <h5>Total:</h5><p>$129.00</p>
                </div>
              </div>
              <Button onClick={()=>{ handleSubmit() }}>Checkout</Button>
              </Card>
            </Container>
          </Col>
        </Row>  
      </Card>
    </Container>
  )
}