import {useEffect, useState } from "react";
import { getSingleProduct } from "../api/products";
import Rating from './rating';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { getProductsOfCategory } from "../api/products";


export default function SingleProduct({ token, singleProduct, setSingleProduct, singleProductId, setSingleProductId, quantity, setQuantity, recentlyViewed, setRecentlyViewed, cart, setCart, cartArr }){
  const navigate = useNavigate();
  const [cat, setCat] = useState(null);
  const [similarItems, setSimilarItems] = useState(null);

  useEffect(() => {
    async function getProduct() {
      try {
        const product = await getSingleProduct(singleProductId);

        setSingleProduct(product);
        setCat(product.category);

        const categoryProducts = await getProductsOfCategory(cat);
        setSimilarItems(categoryProducts);
        

      } catch (error) {
        console.error(error);
      }
    }

    getProduct();   

  },[similarItems, recentlyViewed]);

  function updateQuantity(value){
    if(value === -1){
      if(quantity > 1){
        setQuantity(quantity - 1);
      }
    }else{
      setQuantity(quantity + 1);
    }
  };

  function addToCartHandler() {
    try {
      // Retrieve the current cart array from local storage
      const cartFromLocalStorage = localStorage.getItem("cart");
  
      // Parse the cart array from JSON format to JavaScript array
      const cartArray = cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : [];
  
      // Check if the product already exists in the cart
      const existingProductIndex = cartArray.findIndex(item => item.id === singleProduct.id);
  
      if (existingProductIndex !== -1) {
        // If the product exists, update its quantity
        cartArray[existingProductIndex].quantity += 1;
      } else {
        // If the product does not exist, add it to the cart with a quantity of 1
        const productWithQuantity = { ...singleProduct, quantity: 1 };
        cartArray.push(productWithQuantity);
      }
  
      // Store the updated cart array back to local storage
      localStorage.setItem("cart", JSON.stringify(cartArray));
  
      // Set cart to the cartArray variable and navigate to the cart
      setCart(cartArray);
      navigate('/cart');
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  }

  return(
    <>
      <Container style={{ height:"45rem"}}>
        {singleProduct && 
          <CardGroup>
            <Card style={{ height:"35rem", border:"none"}}>
              <Row className="g-4" xs={1} lg={2}>
                <Col lg="8">
                <Link onClick={() => {navigate(-1)}} className="back-link">{"< Back to results"}</Link>
                <br /><br />
                  <Card.Img 
                    className="card-title" 
                    variant="top" 
                    src={singleProduct.image} 
                    style={{ height:"35rem", objectFit:"contain", padding:"10px", backgroundColor:"#f5f5f5" }} 
                  />
                </Col>
                <Col lg="4">
                  <Card.Body>
                    <br /><br />
                    <Card.Title className="card-title">{ singleProduct.title }</Card.Title>
                    <div className="rating-container">
                      Rating: {<Rating rate={singleProduct.rating.rate} />} {singleProduct.rating.rate}
                    </div>
                    <hr />
                    <Card.Text style={{ fontSize:"15pt" }} className="price-text">{<strong>${singleProduct.price.toFixed(2)}</strong>}</Card.Text>
                    <div className="quantity-container">
                      <div className="counter">
                        <p className="counter-items">Quantity:</p>
                        <div className="counter-items">
                          <Button 
                            className="counter-btn" 
                            size="sm" 
                            variant="outline-secondary"
                            onClick={() => updateQuantity(-1)}
                          >-</Button>
                        </div>
                        <div className="counter-items">{quantity}</div>
                        <div className="counter-items">
                          <Button 
                            className="counter-btn" 
                            size="sm" 
                            variant="outline-secondary"
                            onClick={() => updateQuantity(1)}
                          >+</Button>
                        </div>
                      </div>
                    </div>
                    <Container style={{marginLeft:"0", padding:"0"}} >
                      <Button 
                        className="addToCartBtn" 
                        style={{width:"100%"}} 
                        onClick={ () => addToCartHandler() }
                      >
                        Add to Cart
                      </Button>
                    </Container>
                    <hr />
                    <Card.Text>{<strong>Product Description:</strong>} {<br/>}{singleProduct.description}</Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </CardGroup>
        }
      </Container>

      <Container className="similar-items-container">
        {similarItems && 
          <>
            <hr />
            <br />
            <h5>Similar Items</h5>
            <CardGroup>
              <Row xs={2} md={3} lg={4} xl={5} className="g-3">
                { similarItems && similarItems.map((product, idx) => 
                  <>
                    { product.title !== singleProduct.title &&
                      <Col key={idx}>
                      <Card style={{ height:"30rem" }}>
                        <Card.Img 
                          className="card-img" 
                          variant="top" 
                          src={product.image} 
                          style={{ height:"15rem", objectFit:"contain", padding:"10px" }} 
                          onClick={() => { setSingleProductId(product.id); setRecentlyViewed(recentlyViewed => [...recentlyViewed,product]); navigate(`/products/:${product.id}`) }}/>
                        <Card.Body>
                          <Card.Title className="card-title" onClick={()=>{setSingleProductId(product.id); setRecentlyViewed(recentlyViewed => [...recentlyViewed,product]); navigate(`/products/:${product.id}`)}}>{ product.title.length > 50 ?
                            `${product.title.slice(0,50)}...`
                            :
                            product.title
                            }
                          </Card.Title>
                          <div className="rating-container">
                            Rating: {<Rating rate={product.rating.rate} />} {product.rating.rate}
                          </div>
                          <Card.Text style={{ fontSize:"15pt" }}>${product.price}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    }
                  </>
                )}
              </Row>
            </CardGroup>
          </>
        }
      </Container>
    </>
  )
}