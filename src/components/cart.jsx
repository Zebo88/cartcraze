import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { getAllCartsForUser, updateProductQuantityInCart, deleteSingleItemFromCart } from "../api/cart.jsx";


export default function Cart({ cart, setCart, token, setToken, setUser, preservedCart, setPreservedCart }){
  const navigate = useNavigate();
  const [subtotalQuantity, setSubtotalQuantity] = useState(0);
  const [subtotalPrice, setSubtotalPrice] = useState(0);
  const [message, setMessage] = useState("There are no items in your cart!");
  const [notRegistered, setNotRegistered] = useState(false);
  const [deletedProduct, setDeletedProduct] = useState(false);

  useEffect(() => {
    // Calculate subtotal when cart data changes
    calculateSubtotal(cart);
  }, [cart]);

  useEffect(() => {
    // UseEffect for a guest user
    if (!token) {
      // Retrieve the cart from local storage
      const cartFromLocalStorage = localStorage.getItem('cart');
  
      if (cartFromLocalStorage) {
        // If the cart exists in local storage, set it to the state
        setCart(JSON.parse(cartFromLocalStorage));
      } else {
        // If the cart doesn't exist in local storage, create an initial empty cart structure
        const initialCart = { products: [] };
  
        // Store the initial cart in local storage
        localStorage.setItem('cart', JSON.stringify(initialCart));
  
        // Set the initial cart to the state
        setCart(initialCart);
      }
    }
  }, []);

  useEffect(() => {
    async function getCartItems() {
      if(token){
        try {

          // Retrieve the user object from local storage
          const userFromLocalStorage = localStorage.getItem("user");
          const userObject = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
  
          // Retrieve the user object from local storage
          const tokenFromLocalStorage = localStorage.getItem("token");
          const tokenObject = userFromLocalStorage ? JSON.parse(tokenFromLocalStorage) : null;
    
          // Set the user state
          setUser(userObject);
  
          //Set the token state
          setToken(tokenObject);
    
          // Fetch order history only if the user is available
          if (userObject && token) {
            const response = await getAllCartsForUser(userObject.user_id, token);
            localStorage.setItem('cart', JSON.stringify(response));
            setCart(response);
          }
          
        } catch (error) {
          console.error(error);
        }
      }
  
    }
    
    getCartItems(); 

  },[cart]);

  async function handleDelete(itemId){

    try {
      let updatedCart = [];

      if(token){
        const productId = itemId;
        // Retrieve the current cart array from localStorage
        const cartFromLocalStorage = localStorage.getItem("cart");
        // Parse the cart array from JSON format to JavaScript array
        const cartArray = cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : {};
    
        // Filter out the item with the specified ID
         updatedCart = cartArray.products.filter(item => item.product_id !== itemId);
        
        // Update localStorage with the new cart array
        localStorage.setItem("cart", JSON.stringify({ products: updatedCart }));
  
        const response = await deleteSingleItemFromCart(updatedCart.cart_id, productId, token)
  
      }else{
        // Retrieve the current cart array from local storage
        const cartFromLocalStorage = localStorage.getItem("cart");
  
        // Parse the cart array from JSON format to JavaScript array
        const cartArray = cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : { products: [] }; 

        // Filter out the item with the specified ID
        updatedCart = cartArray.products.filter(item => item.product_id !== itemId);

        // Update localStorage with the new cart array
        localStorage.setItem("cart", JSON.stringify({ products: updatedCart }));

      }

      // Update state
      setCart({ products: updatedCart });
      
      // Set message state
      setDeletedProduct(true);
  
      console.log("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  async function updateQuantity(itemId, quantityChange, quantity) {
    try {
      let updatedCart = cart.products.map(item => {
        if (item.product_id === itemId) {
          // Calculate the new quantity
          let newQuantity = quantity + quantityChange;
          // Ensure that the new quantity is at least 1
          newQuantity = Math.max(newQuantity, 1);
          
          if(token){
            // Update the quantity in the database
            updateProductQuantityInCart(cart.cart_id, itemId, newQuantity, token)
            .then(() => console.log('Quantity updated successfully'))
            .catch(error => console.error('Error updating quantity:', error));
          }
  
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
  
      // Update localStorage with the updated cart
      localStorage.setItem("cart", JSON.stringify({ products: updatedCart }));
  
      // Update state with the updated cart
      setCart({ products: updatedCart });
  
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }

  function calculateSubtotal(cartObject) {
    let totalQuantity = 0;
    let totalPrice = 0;
  
    if (cartObject.products && Array.isArray(cartObject.products)) {
      // If cartObject has a products array
      cartObject.products.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
      });
    }
  
    setSubtotalQuantity(totalQuantity);
    setSubtotalPrice(totalPrice);
  }

  function handleSubmit(){
    if(cart.products[0]){
      if(token){
        navigate('/checkout')
      }else{
        setNotRegistered(true);
      }
      
    }else{
      setMessage("You cannot proceed until you have added items to your cart!");
    }
  }

  function handlePreservationOfCart(){
    // Retrieve the cart from local storage
    const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart")); 
    // Set the preserved cart state
    setPreservedCart(cartFromLocalStorage);
    // Navigate to login so the user can create an account or login
    navigate('/login');
  }

  return (
    <>
      <Container>
        <Card style={{ padding: "20px" }}>
          <Card.Title style={{ fontSize: "18pt" }}>Shopping Cart</Card.Title>
          <Link to={'/'} className="back-link">{`< Continue Shopping`}</Link>
          <hr style={{ border: "1px solid black" }} />
          <Row className="g-3">
            <Card.Title>{`Subtotal (${subtotalQuantity} Items): $${subtotalPrice.toFixed(2)}`}</Card.Title>
            <Button className="proceed-btn" variant="info" size="sm" onClick={ handleSubmit }>Proceed to Checkout</Button>
          </Row>

          <hr />

          {notRegistered && 
            <Alert variant="warning">
              <Alert.Heading>You are not logged in!</Alert.Heading>
              <p>Do you wish to login, or continue as guest?</p>
              <hr />
              <div className="d-flex justify-content-center">
                <Button onClick={() => navigate('/checkout')} size="sm" variant="warning" style={{marginRight:"25px"}}>
                  Continue as Guest
                </Button>
                <Button onClick={ handlePreservationOfCart } size="sm" variant="warning">
                  Login
                </Button>
              </div>
            </Alert>
          }

          {deletedProduct &&
            <Alert variant="light" onClose={() => setDeletedProduct(false)} dismissible>Product deleted from cart!</Alert>
          }
          
          {cart.products?.length > 0 ? cart.products.map((item, idx) => (
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
                                onClick={() => updateQuantity(item.product_id, -1, item.quantity)}
                              >-</Button>
                            </div>
                            <div className="counter-items">{item.quantity}</div>
                            <div className="counter-items">
                              <Button
                                className="counter-btn"
                                size="sm"
                                variant="outline-secondary"
                                onClick={() => updateQuantity(item.product_id, 1, item.quantity)}
                              >+</Button>
                            </div>
                          </div>
                        </div>
                          <Button
                            variant="outline-secondary"
                            className="deleteFromCart-btn"
                            size="sm"
                            style={{ width: "80px", marginTop:"10px" }}
                            onClick={() => { handleDelete(item.product_id) }}
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
          <Alert variant="dark">
            {message}
          </Alert>
        }
          <Card.Title style={{fontSize:"12pt"}}>{`Subtotal (${subtotalQuantity} Items): $${subtotalPrice.toFixed(2)}`}</Card.Title>
        </Card>
      </Container>
    </>  
  );
}