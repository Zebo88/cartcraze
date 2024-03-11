import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Rating from './rating';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import jewelryAd from '../images/jewelryAdNarrow.jpg'
import hatAd from '../images/hatAdNarrow.jpg'
import earbudsAd from '../images/earbudsAdNarrow.jpg'
import { getAllProducts, getProductsOfCategory } from "../api/products.jsx";
import Category from "./category";
import Filter from "./filter.jsx"
import Alert from 'react-bootstrap/Alert';

export default function Home({ products, setProducts, singleProduct, setSingleProduct, singleProductId, setSingleProductId, recentlyViewed, setRecentlyViewed, searchInput }){
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        if(category === "" && products.length === 0){
          const allProducts = await getAllProducts();
          setProducts(allProducts);
        }else if(category === "All Categories"){
          const allProducts = await getAllProducts();
          setProducts(allProducts);
        }else if(category !== ""){
          const categoryProducts = await getProductsOfCategory(category);
          setProducts(categoryProducts);
        }
        

      } catch (error) {
        console.error(error);
      }
    }
    
    fetchProducts();

  },[category]);

  function capitalizeWords(string){
      if(string.includes(" ")){
        const index = string.indexOf(" ");
        return string.slice(0,1).toUpperCase() + string.slice(1,index+1) + string.slice(index+1,index+2).toUpperCase() + string.slice(index+2);
      }else{
        return string.slice(0,1).toUpperCase() + string.slice(1);
      }
  }

  return(
    <div className="home-container">
      <Carousel data-bs-theme="dark" indicators={false}>
        <Carousel.Item interval={5000}>
          <img src={jewelryAd} alt="jewelry ad" className="advertisement w-100"/>
        </Carousel.Item>
        <Carousel.Item interval={5000}>
          <img src={hatAd} alt="men's headwear ad" className="advertisement w-100"/>
        </Carousel.Item>
        <Carousel.Item interval={5000}>
        <img src={earbudsAd} alt="earbuds ad" className="advertisement w-100"/>
        </Carousel.Item>
      </Carousel>

      <div className="container category-container">
        <Category setCategory={setCategory}/>
        { category && <div className="category-pill">{capitalizeWords(category)}<h6 className="x" onClick={()=>{setCategory(""); setProducts([])}} >x</h6></div>}
        <Filter setProducts={setProducts}/>
      </div>

      <div className="container">
  {category ? <h3>{capitalizeWords(category)}</h3> : <h3>All Products</h3>}
  <CardGroup>
    <Row xs={2} sm={2} md={3} lg={4} xl={5} className="g-4">
      {products[0] ?
            products.map((product, idx) => (
              <Col key={idx} style={{ minWidth: '200px', maxWidth: 'none' }}>
                <Card style={{ height: '30rem', boxShadow: '2px 2px 10px 0 rgba(0, 0, 0, 0.1)' }}>
                <Card.Img 
                    className="card-img" 
                    variant="top" 
                    src={product.image} 
                    style={{ height:"15rem", objectFit:"contain", padding:"10px" }} 
                    onClick={()=>{
                      setSingleProductId(product.product_id); 
                      localStorage.setItem('singleProductId', product.product_id);
                      setRecentlyViewed(recentlyViewed => [...recentlyViewed, product]);
                      navigate(`/products/:${product.product_id}`)
                      }
                  }/>
                  <Card.Body>
                    <Card.Title 
                      className="card-title" 
                      onClick={()=>{
                        setSingleProductId(product.product_id); 
                        localStorage.setItem('singleProductId', product.product_id);
                        setRecentlyViewed(recentlyViewed => [...recentlyViewed, product]);
                        navigate(`/products/:${product.product_id}`)
                        }
                      }>{ product.title.length > 50 ?
                        `${product.title.slice(0,50)}...`
                        :
                        product.title
                      }
                    </Card.Title>
                    <div className="rating-container">
                      Rating: {<Rating rate={product.rate} />} {product.rate}
                    </div>
                    <Card.Text style={{ fontSize:"15pt" }}>${product.price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
      :
      <Alert variant="danger" style={{width:"300px", margin:"60px 0"}}>No results! Try again.</Alert>
      }
    </Row>
  </CardGroup>
</div>
    </div>
    
  )
}