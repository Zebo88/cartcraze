import React, { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import CartCrazeLogo from '../images/CartLogo.jpeg'
import cart from '../images/cart2.svg'
import person from '../images/person.svg'
import { Container } from "react-bootstrap";
import magnifyingGlass from "../images/magnifying-glass-solid.svg"

export default function NavigationBar({ token, searchInput, setSearchInput }){

  return(
    <>
      <Navbar className="py-0 nav">
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
            <Button variant="primary" id="button-addon2">
              <img src={magnifyingGlass} alt="search" className="search-icon" />
            </Button>
          </InputGroup>
          <div className="navLinks">
            <Nav.Link 
              href={token ?
                `/account`
                :
                `/login`}>
                <div className="icon-container">
                  <img src={person} alt="account" className="icon" />
                </div>
            </Nav.Link>
            <Nav.Link href="/cart">
              <div className="icon-container">
                <img src={cart} alt="cart" className="icon" />
              </div>
            </Nav.Link>
          </div>
          
        </Container>
      </Navbar>
    </>
  )
}