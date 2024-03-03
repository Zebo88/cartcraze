import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';

export default function Category({ setCategory }){

  return(
    <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic" size="sm">
            Category
          </Dropdown.Toggle>

          <Dropdown.Menu>
          <Dropdown.Item onClick={() => {
                setCategory("")
              }}>
                All Categories
            </Dropdown.Item>
            <Dropdown.Item 
              // href={`/category/${category}`} //Can be used if/when I set up the backend.
              onClick={() => {
                setCategory("electronics")
              }}>
                Electronics
            </Dropdown.Item>
            <Dropdown.Item onClick={() => {
                setCategory("jewelery")
              }}>
                Jewelery
            </Dropdown.Item>
            <Dropdown.Item onClick={() => {
                setCategory("men's clothing")
              }}>
                Men's Clothing
            </Dropdown.Item>
            <Dropdown.Item onClick={() => {
                setCategory("women's clothing")
              }}>
                Women's Clothing
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
  )
}