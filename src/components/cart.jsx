import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Button, FormLabel } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { getSingleCart, updateCart } from "../api/cart";
import { getSingleProduct } from "../api/products";
import Rating from "./rating";
import CartLogo from '../images/CartLogo.jpeg'
import { faHourglass1 } from "@fortawesome/free-solid-svg-icons";


export default function Cart({ quantity, setQuantity, cart, setCart, cartArr }){
  const navigate = useNavigate();
  const [subtotalQuantity, setSubtotalQuantity] = useState(0);
  const [subtotalPrice, setSubtotalPrice] = useState(0);

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

      } catch (error) {
        console.error(error);
      }
    }

    getCartItems();   

  },[]);

  async function handleDelete(itemId){

    try {
      // Retrieve the current cart array from localStorage
      const cartFromLocalStorage = localStorage.getItem("cart");
      // Parse the cart array from JSON format to JavaScript array
      const cartArray = cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : [];
  
      // Filter out the item with the specified ID
      const updatedCart = cartArray.filter(item => item.id !== itemId);
  
      // Update localStorage with the new cart array
      localStorage.setItem("cart", JSON.stringify(updatedCart));
  
      // Optionally, update state if your component relies on it
      setCart(updatedCart);

      // Recalculate subtotal and item quantities
      calculateSubtotal(updatedCart); 
  
      console.log("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  function updateQuantity(itemId, quantityChange) {
    try {
      const updatedCart = cart.map(item => {
        if (item.id === itemId) {
          // Calculate the new quantity
          const newQuantity = item.quantity + quantityChange;
          // Ensure that the new quantity is at least 1
          const updatedQuantity = Math.max(newQuantity, 1);
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      });

      // Update localStorage with the updated cart
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Update state with the updated cart
      setCart(updatedCart);

      calculateSubtotal(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }

  function calculateSubtotal(cartArray) {
    let totalQuantity = 0;
    let totalPrice = 0;

    cartArray.forEach(item => {
      totalQuantity += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    setSubtotalQuantity(totalQuantity);
    setSubtotalPrice(totalPrice);
  }

  return (
    <Container>
      <Card style={{ padding: "20px" }}>
        <Card.Title style={{ fontSize: "18pt" }}>Shopping Cart</Card.Title>
        <hr style={{ border: "1px solid black" }} />
        <Row className="g-3">
          <Card.Title>{`Subtotal (${subtotalQuantity} Items): $${subtotalPrice.toFixed(2)}`}</Card.Title>
          <Button className="proceed-btn" onClick={() => { navigate('/checkout') }}>Proceed to Checkout</Button>
        </Row>

        <hr />
        
        {cart[0] ? cart.map((item, idx) => (
          <Row key={idx} className="g-4">
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
                      <div className="quantity-container">
                        <div className="counter">
                          <p className="counter-items">Quantity:</p>
                          <div className="counter-items">
                            <Button
                              className="counter-btn"
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => updateQuantity(item.id, -1)}
                            >-</Button>
                          </div>
                          <div className="counter-items">{item.quantity}</div>
                          <div className="counter-items">
                            <Button
                              className="counter-btn"
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => updateQuantity(item.id, 1)}
                            >+</Button>
                          </div>
                        </div>
                      </div>
                        <Button
                          variant="outline-secondary"
                          className="deleteFromCart-btn"
                          size="sm"
                          style={{ width: "80px", marginTop:"10px" }}
                          onClick={() => { handleDelete(item.id) }}
                        >
                          Delete
                        </Button>
                  </Col>
                </Row>
              </Card>
              <hr />
            </Col>
          </Row>
        ))
        :
        <Alert variant="warning">
          There are no items in your cart!
        </Alert>
      }
        <Card.Title style={{fontSize:"12pt"}}>{`Subtotal (${subtotalQuantity} Items): $${subtotalPrice.toFixed(2)}`}</Card.Title>
      </Card>
    </Container>
  );
}