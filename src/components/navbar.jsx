import React, { useState, useEffect } from "react";
import { searchProducts } from "../api/products.jsx";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import CartCrazeLogo from '../images/CartLogo.jpeg'
import cart from '../images/cart2.svg'
import person from '../images/person.svg'
import { Container } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import magnifyingGlass from "../images/magnifying-glass-solid.svg"
import { Navigate, useNavigate } from "react-router-dom";

export default function NavigationBar({ token, searchInput, setSearchInput, setProducts }){
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();

    try {
      // Search DB for products using searchInput
      const results = await searchProducts(searchInput);

      // Set products state to results
      setProducts(results);

      // Navigate to the homepage when search is complete
      navigate('/');
      
    } catch (error) {
      console.error(error);
    }
  }

  return(
    <>
      <Navbar className="py-0 nav" bg="dark" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand href="/">
            <div className="navBrand">
              <img
                src={CartCrazeLogo}
                className="navLogo"
              />
              <h5 className="navBrandName">CartCraze</h5>
            </div>
          </Navbar.Brand>
          <InputGroup size="sm" className="navSearch">
            <Form.Control
              type="text"
              id="searchBar"
              onChange={(e) => {setSearchInput(e.target.value)}}
            />
            <Button
              variant="info"
              id="button-addon2"
              onClick={ (e) => { handleSubmit(e) }}
              tabIndex={0} // Ensure the button is focusable
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            >
              <img src={magnifyingGlass} alt="search" className="search-icon" />
            </Button>
          </InputGroup>
          <div className="navLinks">
            <Dropdown>
              <Dropdown.Toggle variant="dark" bg="dark" id="dropdown-basic">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href={token ? `/account` : `/login`}>Account</Dropdown.Item>
                <Dropdown.Item href="/login">Sign In/Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Link href="/cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
                </svg>
            </Nav.Link>
          </div>
          
        </Container>
      </Navbar>
    </>
  )
}