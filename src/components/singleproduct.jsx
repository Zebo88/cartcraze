import {useEffect, useState } from "react";
import Rating from './rating';
import { Carousel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { getSingleProduct, getProductsOfCategory } from "../api/products.jsx";
import { addProductToCart, getAllCartsForUser } from "../api/cart.jsx"


export default function SingleProduct({ setToken, singleProduct, setSingleProduct, singleProductId, setSingleProductId, quantity, setQuantity, recentlyViewed, setRecentlyViewed, setCart, setUser }){
  const navigate = useNavigate();
  const [cat, setCat] = useState(null);
  const [similarItems, setSimilarItems] = useState(() => {
    const storedSimilarItems = localStorage.getItem('similarItems');
    return storedSimilarItems ? JSON.parse(storedSimilarItems) : null;
  });
  const [cardsPerRow, setCardsPerRow] = useState(1);

  // useEffect to retrieve singleProductId from localStorage
  useEffect(() => {
    const storedProductId = localStorage.getItem('singleProductId');
    if (storedProductId) {
      setSingleProductId(storedProductId);
    }
  }, []);

  useEffect(() => {
    // Retrieve the recently viewed items from local storage
    const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
    // Parse the stored value from JSON format to JavaScript array
    const parsedRecentlyViewed = storedRecentlyViewed ? JSON.parse(storedRecentlyViewed) : [];
    // Set the recently viewed items state
    setRecentlyViewed(parsedRecentlyViewed);
  }, []);

  // useEffect to update localStorage whenever singleProductId changes
  useEffect(() => {
    if (singleProductId) {
      localStorage.setItem('singleProductId', singleProductId);
    }
  }, [singleProductId]);

  // useEffect to update localStorage whenever similarItems changes
  useEffect(() => {
    if (similarItems) {
      localStorage.setItem('similarItems', JSON.stringify(similarItems));
    }
  }, [similarItems]);

  useEffect(() => {
    async function getProductAndSimilarItems() {
      try {
        if (singleProductId) {
          const product = await getSingleProduct(singleProductId);
          // Set the category derived from the fetched product
          setCat(product.category);
          setSingleProduct(product);
          
          if (product.category) {
            // Fetch similar items based on the category
            const categoryProducts = await getProductsOfCategory(product.category);
            // Filter out the current product from the similar items list
            const filteredSimilarItems = categoryProducts.filter(item => item.product_id !== singleProductId);
            setSimilarItems(filteredSimilarItems);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    if (singleProductId) {
      getProductAndSimilarItems();
    }
  }, [singleProductId]);

  useEffect(() => {
    function handleResize() {
      // Adjust the number of cards per row based on the container width and card width
      const containerWidth = document.querySelector('.similar-items-container').offsetWidth;
      const cardWidth = 250; // Assuming the width of each card is 250px
      const newCardsPerRow = Math.floor(containerWidth / cardWidth);
      setCardsPerRow(newCardsPerRow);
    }

    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    // Initial adjustment
    handleResize();

    return () => {
      // Clean up the event listener
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function updateQuantity(value){
    if(value === -1){
      if(quantity > 1){
        setQuantity(quantity - 1);
      }
    }else{
      setQuantity(quantity + 1);
    }
  };

  function addToRecentlyViewed(item) {
    // Add the item to recently viewed if it's not already present
    if (!recentlyViewed.find(viewedItem => viewedItem.product_id === item.product_id)) {
      setRecentlyViewed([...recentlyViewed, item]);
      // Update local storage with the updated recently viewed items
      localStorage.setItem('recentlyViewed', JSON.stringify([...recentlyViewed, item]));
    }
  }

  async function addToCartHandler() {
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

      // Add the item to the cart
      const response = await addProductToCart(userObject.user_id, singleProduct.product_id, quantity, tokenObject);
      console.log(response);

      // Get the cart items
      const resp = await getAllCartsForUser(userObject.user_id, tokenObject);
      console.log(resp);

      // Retrieve the current cart array from local storage
      const cartFromLocalStorage = localStorage.getItem("cart");
  
      // Parse the cart array from JSON format to JavaScript array
      const cartArray = cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : [];
      
      if(cartArray && cartArray.products && cartArray.products.length > 0){
        // Check if the product already exists in the cart
        const existingProductIndex = cartArray.products.findIndex(item => item.product_id === singleProduct.product_id);

        if (existingProductIndex !== -1) {
          // If the product exists, update its quantity
          cartArray.products[existingProductIndex].quantity += 1;
        } else {
          // If the product does not exist, add it to the cart with a quantity of 1
          const productWithQuantity = { ...singleProduct, quantity };
          cartArray.products.push(productWithQuantity);
        }
      }

      // Store the updated cart array back to local storage
      localStorage.setItem("cart", JSON.stringify(cartArray));

  
      // Set cart to the cartArray variable and navigate to the cart
      setCart(cartArray);
      navigate('/cart');

      // Add the product to recently viewed items
      addToRecentlyViewed(singleProduct);

    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  }

  function chunkArray(array, size) {
    const chunkedArray = [];
    let index = 0;
    while (index < array.length) {
      chunkedArray.push(array.slice(index, index + size));
      index += size;
    }
    return chunkedArray;
  }

  return(
    <>
      <Container>
        {singleProduct && 
            <Card style={{  border:"none"}}>
              <Row className="g-4" xs={1} lg={2}>
                <Col lg="8">
                <Link to="/" className="back-link">{"< Back to Homepage"}</Link>
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
                      Rating: {<Rating rate={singleProduct.rate} />} {singleProduct.rate}
                    </div>
                    <hr />
                    <Card.Text style={{ fontSize:"15pt" }} className="price-text">{<strong>${singleProduct.price}</strong>}</Card.Text>
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
                        variant="info"
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
        }
      </Container>

      <Container className="similar-items-container" style={{ maxWidth: '1200px' }}>
        {similarItems && (
          <>
            <hr />
            <br />
            <h5>Similar Items</h5>
            <div style={{ position: 'relative' }}>
              <Carousel
                interval={null} 
                nextIcon={<span style={{ color: 'black', fontSize: '3rem', position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)'  }}>&rsaquo;</span>}
                prevIcon={<span style={{ color: 'black', fontSize: '3rem', position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)'  }}>&lsaquo;</span>}
              >
                {chunkArray(similarItems, cardsPerRow).map((chunk, idx) => (
                  <Carousel.Item key={idx}>
                    <Row sm={2} md={3} lg={4} xl={5} className="g-3 justify-content-center">
                      {chunk.map((item, index) => (
                        <Col key={index} style={{ width: '20%', minWidth: '200px', maxWidth: '200px', marginRight: '1px' }}>
                          <Card className="cardSuggestions" style={{ height: "30rem", marginBottom: '1px', boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.1)" }}>
                            <Card.Img
                              className="card-img"
                              variant="top"
                              src={item.image}
                              style={{ height: "15rem", objectFit: "contain", padding: "10px" }}
                              onClick={() => { 
                                setSingleProductId(item.product_id); 
                                localStorage.setItem('singleProductId', item.product_id);
                                // Check if the item is already in the recently viewed list
                                if (!recentlyViewed.find(viewedItem => viewedItem.product_id === item.product_id)) {
                                  // Add the item to the recently viewed list if it's not already present
                                  setRecentlyViewed(recentlyViewed => [...recentlyViewed, item]);
                                  // Update local storage with the updated recently viewed items
                                  localStorage.setItem('recentlyViewed', JSON.stringify([...recentlyViewed, item]));
                                } 
                                navigate(`/products/:${item.product_id}`) 
                                }
                              }
                            />
                            <Card.Body>
                              <Card.Title 
                                className="card-title" 
                                onClick={() => { 
                                  setSingleProductId(item.product_id); 
                                  localStorage.setItem('singleProductId', item.product_id);
                                  // Check if the item is already in the recently viewed list
                                  if (!recentlyViewed.find(viewedItem => viewedItem.product_id === item.product_id)) {
                                    // Add the item to the recently viewed list if it's not already present
                                    setRecentlyViewed(recentlyViewed => [...recentlyViewed, item]);
                                    // Update local storage with the updated recently viewed items
                                    localStorage.setItem('recentlyViewed', JSON.stringify([...recentlyViewed, item]));
                                  }  
                                  navigate(`/products/:${item.product_id}`) 
                                  }
                                }>
                                {item.title.length > 50 ? `${item.title.slice(0, 50)}...` : item.title}
                              </Card.Title>
                              <div className="rating-container">
                                Rating: {<Rating rate={item.rate} />} {item.rate}
                              </div>
                              <Card.Text style={{ fontSize: "15pt" }}>${item.price}</Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </>
        )}
      </Container>

      <Container className="recently-viewed-container" style={{ maxWidth: '1200px' }}>
        {recentlyViewed[0] && (
          <>
            <hr />
            <br />
            <h5>Recently Viewed</h5>
            <div style={{ position: 'relative' }}>
              <Carousel
                interval={null}
                nextIcon={<span style={{ color: 'black', fontSize: '3rem', position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)'  }}>&rsaquo;</span>}
                prevIcon={<span style={{ color: 'black', fontSize: '3rem', position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)'  }}>&lsaquo;</span>}
              >
                {chunkArray(recentlyViewed, cardsPerRow).map((chunk, idx) => (
                  <Carousel.Item key={idx}>
                    <Row xs={2} md={3} lg={4} xl={5} className="g-3 justify-content-center">
                      {chunk.map((item, index) => (
                        <Col key={index} style={{ width: '20%', minWidth: '200px', maxWidth: '200px', marginRight: '1px' }}>
                          <Card style={{ height: "30rem", marginBottom: '1px', boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.1)" }}>
                            <Card.Img
                              className="card-img"
                              variant="top"
                              src={item.image}
                              style={{ height: "15rem", objectFit: "contain", padding: "10px" }}
                              onClick={() => {
                                setSingleProductId(item.product_id);
                                localStorage.setItem('singleProductId', item.product_id);
                                // Check if the item is already in the recently viewed list
                                if (!recentlyViewed.find(viewedItem => viewedItem.product_id === item.product_id)) {
                                  // Add the item to the recently viewed list if it's not already present
                                  setRecentlyViewed(recentlyViewed => [...recentlyViewed, item]);
                                  // Update local storage with the updated recently viewed items
                                  localStorage.setItem('recentlyViewed', JSON.stringify([...recentlyViewed, item]));
                                } 
                                navigate(`/products/:${item.product_id}`);
                              }}
                            />
                            <Card.Body>
                              <Card.Title 
                                className="card-title" 
                                onClick={() => {
                                  setSingleProductId(item.product_id);
                                  localStorage.setItem('singleProductId', item.product_id);
                                  // Check if the item is already in the recently viewed list
                                  if (!recentlyViewed.find(viewedItem => viewedItem.product_id === item.product_id)) {
                                    // Add the item to the recently viewed list if it's not already present
                                    setRecentlyViewed(recentlyViewed => [...recentlyViewed, item]);
                                    // Update local storage with the updated recently viewed items
                                    localStorage.setItem('recentlyViewed', JSON.stringify([...recentlyViewed, item]));
                                  } 
                                  navigate(`/products/:${item.product_id}`);
                                }}
                              >
                                {item.title.length > 50 ? `${item.title.slice(0, 50)}...` : item.title}
                              </Card.Title>
                              <div className="rating-container">
                                Rating: {<Rating rate={item.rate} />} {item.rate}
                              </div>
                              <Card.Text style={{ fontSize: "15pt" }}>${item.price}</Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>  
          </>
        )}
      </Container>
    </>
  )
}