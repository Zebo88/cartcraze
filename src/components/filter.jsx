import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { sortProducts, getAllProducts } from '../api/products.jsx'

export default function Filter({ setProducts }){
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(2000);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [lowToHigh, setLowToHigh] = useState(false);
  const [highToLow, setHighToLow] = useState(false);

  function handleCheckLowToHigh() {
    // Toggle the lowToHigh state
    setLowToHigh(prevState => !prevState);
    // Uncheck the highToLow checkbox
    setHighToLow(false);
  }

  function handleCheckHighToLow() {
  // Toggle the highToLow state
  setHighToLow(prevState => !prevState);
  // Uncheck the lowToHigh checkbox
  setLowToHigh(false);
}

async function applyFilter() {
  try {
    // Determine the sort order based on checkbox states
    const sortOrder = lowToHigh ? "ASC" : highToLow ? "DESC" : "ASC";

    // Ensure the correct price range
    let correctedMin = isNaN(min) ? 0 : min;
    let correctedMax = isNaN(max) ? 2000 : max;

    if (correctedMin > correctedMax) {
      // Swap min and max values if min is greater than max
      const temp = correctedMin;
      correctedMin = correctedMax;
      correctedMax = temp;
    }

    if (!lowToHigh && !highToLow && correctedMin === 0 && correctedMax === 2000) {
      // Send request to get all products in ASC order (default)
      const allProducts = await getAllProducts();
      // Store products in state for rerendering to homepage
      setProducts(allProducts);
    } else {
      // Send request to get filtered products
      const filteredProducts = await sortProducts(sortOrder, correctedMin, correctedMax);
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
          onChange={ () => { handleCheckLowToHigh(); setSortOrder("ASC") } }
        />
        <Form.Check
          checked={highToLow}
          type="checkbox"
          id="high-low"
          label="High to Low"
          onChange={ () => { handleCheckHighToLow(); setSortOrder("DESC") } }
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