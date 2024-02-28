

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
                      <Button className="addToCartBtn" style={{width:"100%"}} >Add to Cart</Button>
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

      <Container>
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
                          onClick={()=>{setSingleProductId(product.id); setRecentlyViewed(recentlyViewed => [...recentlyViewed,product]); navigate(`/products/:${product.id}`)}}/>
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

      {/* <Container>
        { recentlyViewed[0] && 
          <>
            <hr />
            <h5>Recently Viewed</h5>
            <CardGroup>
              <Row xs={2} md={3} lg={4} xl={5} className="g-4">
                { recentlyViewed && recentlyViewed.map((product, idx) => 
                  <>
                    { product.title !== singleProduct.title &&
                      <Col key={idx}>
                      <Card style={{ height:"30rem" }}>
                        <Card.Img 
                          className="card-img" 
                          variant="top" 
                          src={product.image} 
                          style={{ height:"15rem", objectFit:"contain", padding:"10px" }} 
                          onClick={()=>{setSingleProductId(product.id); navigate(`/products/:${product.id}`)}}/>
                        <Card.Body>
                          <Card.Title className="card-title" onClick={()=>{setSingleProductId(product.id); navigate(`/products/:${product.id}`)}}>{ product.title.length > 50 ?
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
      </Container> */}










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
                      <Button className="addToCartBtn" style={{width:"100%"}} >Add to Cart</Button>
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

      <Container>
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
                          onClick={()=>{setSingleProductId(product.id); setRecentlyViewed(recentlyViewed => [...recentlyViewed,product]); navigate(`/products/:${product.id}`)}}/>
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

      {/* <Container>
        { recentlyViewed[0] && 
          <>
            <hr />
            <h5>Recently Viewed</h5>
            <CardGroup>
              <Row xs={2} md={3} lg={4} xl={5} className="g-4">
                { recentlyViewed && recentlyViewed.map((product, idx) => 
                  <>
                    { product.title !== singleProduct.title &&
                      <Col key={idx}>
                      <Card style={{ height:"30rem" }}>
                        <Card.Img 
                          className="card-img" 
                          variant="top" 
                          src={product.image} 
                          style={{ height:"15rem", objectFit:"contain", padding:"10px" }} 
                          onClick={()=>{setSingleProductId(product.id); navigate(`/products/:${product.id}`)}}/>
                        <Card.Body>
                          <Card.Title className="card-title" onClick={()=>{setSingleProductId(product.id); navigate(`/products/:${product.id}`)}}>{ product.title.length > 50 ?
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
      </Container> */}
    </>








return(
  <Container>
  <Card style={{ padding: "20px" }}>
    <Card.Title style={{ fontSize: "18pt" }}>Shopping Cart</Card.Title>
    <hr style={{ border: "1px solid black" }} />
    <Row className="g-3">
      <Card.Title>{"Subtotal (3 Items): $123.00"}</Card.Title>
      <Button className="proceed-btn">Proceed to Checkout</Button>
    </Row>

    {/* Render each cart item on its own row */}
    {cartItems.map((item, idx) => (
      <Row key={idx} className="g-4">
        <Col>
          <Card style={{ border: "none", maxHeight: "10rem", overflow: "hidden" }}>
            <Row xs={1} lg={2}>
              <Col lg="4">
                <br /><br />
                <Card.Img
                  className="card-title image"
                  variant="top"
                  src={item.image}
                  style={{ height: "20rem !important", objectFit: "contain", maxWidth: "100%", backgroundColor: "#f5f5f5" }}
                />
              </Col>
              <Col lg="8">
                <Card.Body>
                  <br /><br />
                  <Card.Title className="card-title">{item.title}</Card.Title>
                  <div className="rating-container">
                    Rating: {<Rating rate={item.rating.rate} />} {item.rating.rate}
                  </div>
                  <hr />
                  <Card.Text style={{ fontSize: "15pt" }} className="price-text">{<strong>${item.price}</strong>}</Card.Text>
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
                  <Container style={{ marginLeft: "0", padding: "0" }} >
                    <Button className="addToCartBtn" style={{ width: "100%" }} onClick={() => { navigate('/cart'); }}>Add to Cart</Button>
                  </Container>
                </Card.Body>
              </Col>
            </Row>
          </Card>
          <hr />
        </Col>
      </Row>
    ))}
  </Card>
</Container>

)