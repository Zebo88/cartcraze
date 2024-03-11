import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { sortProducts, getAllProducts } from '../api/products.jsx'

export default function Filter({ setProducts }){
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(2000);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [lowToHigh, setLowToHigh] = useState();
  const [highToLow, setHighToLow] = useState();

  function handleCheckLowToHigh(){
    setHighToLow(false); // Uncheck the other checkbox

    // Toggle the lowToHigh state
    setLowToHigh(prevState => !prevState);
  }

  function handleCheckHighToLow(){
    setLowToHigh(false); // Uncheck the other checkbox

    // Toggle the highToLow state
    setHighToLow(prevState => !prevState);
  }

  function getCorrectedPriceRange() {
    // If min price is greater than max price, set the min price to the max and visa versa
    console.log("Values before... Min: ", min, "Max: ", max);
    if (min > max) {
      const y = min;
      const x = max;
      setMax(y);
      setMin(x);
    }
}

  async function applyFilter(){
    try {
      // Handle issues with inputs and correct them before sending the request
      // getCorrectedPriceRange();
      console.log("Min: ", min, "Max: ", max);

      if(lowToHigh !== "checked" && highToLow !== "checked" && min === 0 && max === 2000){
        // Send request to get all products in ASC order (default)
        const allProducts = await getAllProducts();
        // Store products in state for rerendering to homepage
        setProducts(allProducts);
      }else if(min > max){
        // Send request to get filtered products
        const filteredProducts = await sortProducts(sortOrder, max, min);
        // Store products in state for rerendering to homepage
        setProducts(filteredProducts);
      }else if(!min && !max){
        // Send request to get filtered products
        const filteredProducts = await sortProducts(sortOrder, 0, 2000);
        // Store products in state for rerendering to homepage
        setProducts(filteredProducts);
      }else if(!min){
        // Send request to get filtered products
        const filteredProducts = await sortProducts(sortOrder, 0, max);
        // Store products in state for rerendering to homepage
        setProducts(filteredProducts);
      }else if(!max){
        // Send request to get filtered products
        const filteredProducts = await sortProducts(sortOrder, min, 2000);
        // Store products in state for rerendering to homepage
        setProducts(filteredProducts);
      }else{
        // Send request to get filtered products
        const filteredProducts = await sortProducts(sortOrder, min, max);
        // Store products in state for rerendering to homepage
        setProducts(filteredProducts);
      }

    } catch (error) {
      console.error(error);
    }
  }

  return(
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" size="sm">
        Filter
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className="container" style={{margin:"0", paddingLeft:"15px"}}>
        <Form.Label>Price</Form.Label>
        <Form.Check
          checked={lowToHigh}
          type="checkbox"
          id="low-high"
          label="Low to High"
          onClick={ () => { handleCheckLowToHigh(); setSortOrder("ASC") } }
        />
        <Form.Check
          checked={highToLow}
          type="checkbox"
          id="high-low"
          label="High to Low"
          onClick={ () => { handleCheckHighToLow(); setSortOrder("DESC") } }
        />
        <br />
        <Form.Label>Price Range</Form.Label>
          <br/>
          <Form.Control type="number" placeholder="Min" onChange={ (e) => {setMin(parseInt(e.target.value))} } style={{margin:"0 0 5px 0"}} />
          <Form.Control type="number" placeholder="Max" onChange={ (e) => {setMax(parseInt(e.target.value))} } style={{margin:"5px 0 0 0"}} />
        </div>
        <br/>
        <Button 
          size="sm" 
          variant="outline-secondary" 
          style={{margin:"0 15px 5px 35px", fontSize:"10pt"}} 
          onClick={ applyFilter }
        >
          Apply Filter
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  )
}