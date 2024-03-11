import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { getOrdersByUserId } from "../api/orders.jsx";

export default function Account({ token, setToken, user, setUser, orderHistory, setOrderHistory }){
  const [tab, setTab] = useState("Profile");

  const navigate = useNavigate();

  useEffect(() => {
    async function getOrderHistoryAndUser() {
      try {
        // Retrieve the user object from local storage
        const userFromLocalStorage = localStorage.getItem("user");
        const userObject = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;

        // Retrieve the user object from local storage
        const tokenFromLocalStorage = localStorage.getItem("token");
        const tokenObject = tokenFromLocalStorage ? JSON.parse(tokenFromLocalStorage) : null;
  
        // Set the user state
        setUser(userObject);

        //Set the token state
        setToken(tokenObject);
  
        // Fetch order history only if the user is available
        if (userObject && token) {
          const response = await getOrdersByUserId(userObject.user_id, token);
          // const result = await response.json();
          localStorage.setItem('order-history', JSON.stringify(response));
          setOrderHistory(response);
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    getOrderHistoryAndUser();
  }, []); 
  

function handleSelect(eventKey){
  setTab(eventKey);
}

function handleClick(){
  return;
}

  return(
    <Container style={{padding:"20px", backgroundColor:"#f7f7f7"}}>
      <h4>My Account</h4>
      <Container style={{marginBottom:"0"}}>
        <Nav fill variant="tabs" defaultActiveKey="Profile" onSelect={handleSelect}>
        <Nav.Item style={{boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.1)"}}>
          <Nav.Link eventKey="Profile" style={{color: "#6401f9"}}>Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item style={{boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.1)"}}>
          <Nav.Link eventKey="Order-History" style={{color: "#6401f9"}}>Order History</Nav.Link>
        </Nav.Item>
        <Nav.Item style={{boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.1)"}}>
          <Nav.Link eventKey="Settings" style={{color: "#6401f9"}}>Settings</Nav.Link>
        </Nav.Item>
       </Nav>
      </Container>

      {tab === "Profile" &&
        <Container style={{marginTop:"0"}}>
          <Card style={{borderTop:"none",borderRadius:"0"}}>
              <Card.Body>
                <Form style={{margin:"40px", marginLeft:"60px", width:"30rem"}} className="profile-form">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control id='firstname' type="text" placeholder={user.firstname} readOnly />
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control id='lastname' type="text" placeholder={user.lastname} readOnly />
                  <Form.Label>Email</Form.Label>
                  <Form.Control id='email' type="email" placeholder={user.email} readOnly />
                  <Form.Label>Username</Form.Label>
                  <Form.Control id='username' type="text" placeholder={user.username} readOnly />
                  <Form.Label>Password</Form.Label>
                  <Form.Control id='password' type="password" placeholder="**********" readOnly />
                  <Form.Label>Address</Form.Label>
                  <Form.Control id='address' as="textarea" placeholder={`${user.housenum} ${user.street}, ${user.city}, ${user.state}, ${user.zipcode}, ${user.country}`} readOnly />
                  <Button variant="info" style={{margin:"30px 0px"}} onClick={ handleClick }>Update Info</Button>
                </Form>
              </Card.Body>
          </Card>
        </Container>
      }
      {tab === "Order-History" && (
        <Container style={{ marginTop: "0" }}>
          <Card style={{ padding: "30px", borderTop: "none", borderRadius: "0" }}>
            {orderHistory && orderHistory.length > 0 ? (
              orderHistory.map((order, orderIndex) => (
                <div key={orderIndex} style={{border:"solid 1px lightgrey", borderRadius:"5px", boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.1)", margin:"10px", padding:"20px"}}>
                  <Card.Title style={{ fontSize: "12pt" }}>Date Placed: {order.order_date}</Card.Title>
                  <hr />
                  {order.products.map((item, itemIndex) => (
                    <Row key={itemIndex} className="g-4">
                      <Col>
                        <Card style={{ border: "none", height: "auto", margin: "0 20px" }}>
                          <Row xs={1} lg={2}>
                            <Col lg="4" className="d-flex justify-content-center align-items-center">
                              <br /><br />
                              <Card.Img
                                className="card-title image"
                                variant="top"
                                src={item.image}
                                style={{ height: "auto", objectFit: "contain", maxWidth: "100%", backgroundColor: "#f5f5f5" }}
                              />
                            </Col>
                            <Col lg="8" style={{ padding: "0 20px 20px 0"}}>
                              <br /><br />
                              <Card.Title className="card-title">{item.title}</Card.Title>
                              <Card.Text style={{ fontSize: "15pt" }} className="price-text">${item.price}</Card.Text>
                              <Card.Text style={{ fontSize: "15pt" }} className="price-text">Quantity: {item.quantity}</Card.Text>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </Row>
                  ))}
                </div>
              ))
            ) : (
              <Alert variant="outline-dark">You have no previous orders.</Alert>
            )}
          </Card>
        </Container>
      )}
      {tab === "Settings" &&
        <Container style={{marginTop:"0"}}>
          <Card style={{borderTop:"none",borderRadius:"0"}}>
              <Card.Body style={{margin:"40px", marginLeft:"60px"}}>
                <Card.Title>Email Notifications:</Card.Title>
                <Form>
                  <Form.Check
                    type="switch"
                    id="order-status"
                    label="Notify me of order status (placed, shipped, and delivered)."
                  />
                  <Form.Check
                    type="switch"
                    label="Notify me of sales and promotions."
                    id="sales-promos"
                  />
                </Form>
              </Card.Body>
          </Card>
        </Container>
      }
    </Container>
      
  )
}