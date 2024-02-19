import { React, useEffect } from "react";
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import jewelryAd from '../images/jewelryAdNarrow.jpg'
import hatAd from '../images/hatAdNarrow.jpg'
import earbudsAd from '../images/earbudsAdNarrow.jpg'
import { getAllProducts } from "../api/products";


export default function Home({ products, setProducts }){

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getAllProducts();

        setProducts(products);

      } catch (error) {
        console.error(error);
      }
    }
    
    fetchProducts();

  },[products]);
  
  return(
    <div className="home-container">
      <Carousel data-bs-theme="dark" indicators={false}>
        <Carousel.Item interval={5000}>
          <img src={jewelryAd} alt="jewelry ad" className="advertisement w-100"/>
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={5000}>
          <img src={hatAd} alt="men's headwear ad" className="advertisement w-100"/>
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={5000}>
        <img src={earbudsAd} alt="earbuds ad" className="advertisement w-100"/>
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div className="container">
        <CardGroup>
        <Row xs={2} md={3} lg={4} xl={5} className="g-4">
        {products.map((product, idx) => (
          <Col key={idx}>
            <Card style={{ height:"450px" }}>
              <Card.Img variant="top" src={product.image} style={{ height:"15rem", objectFit:"contain", padding:"10px" }}/>
              <Card.Body>
                <Card.Title>{`${product.title.slice(0,40)}...`}</Card.Title>
                <Card.Text>Rating: {product.rating.rate}</Card.Text>
                <Card.Text style={{ fontSize:"15pt" }}>${product.price}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
    </Row>
        </CardGroup>
      
      </div>
    </div>
    
  )
}