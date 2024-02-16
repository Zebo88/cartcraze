import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CartLogo from '../images/CartLogo.jpeg'
import search from '../images/search.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function NavigationBar({ token }){

  return(
    <>
      <div className="navbar">
        <div className="navBrand">
          <img
            src={CartLogo}
            className="navLogo"
          />
          <Link className="navLink" to={`/`}><h5 className="navBrandName">CartCraze</h5></Link>
        </div>
        <div className="navFormContainer">
          <form className="navForm">
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faSearch} size="xs" style={{color: "#000000"}} className="input-search-icon"/>
                <input id="SB" type="search"  />
                <button type="submit" className="searchBtn">Search</button>
              </div>
              
            </form>
        </div>
        <div className="navLinks">
          <Link 
            className="navLink" 
            to={token ?
              `/account`
              :
              `/login`}>
            <FontAwesomeIcon icon={faUser} size="lg" style={{color: "#000000",}} />
          </Link>
          <Link className="navLink" to={`/cart`}>
            <FontAwesomeIcon icon={faShoppingCart} size="lg" style={{color: "#000000",}} className="cart-icon" />
          </Link>
        </div>
      </div>
    </>
  )
}