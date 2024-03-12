import React from "react";
import { useNavigate, Link } from "react-router-dom";
import CartCrazeLogo from '../images/CartCrazeLogo2.jpeg'

export default function Footer(){
  const navigate = useNavigate();

  return(
    <div className="footer-items-container">
      <img src={CartCrazeLogo} alt="Cart Craze Logo" className="footer-logo" onClick={ () => { navigate('/') }}/>
      <div className="footer-links">
        <Link to={'/login'} onClick={() => { navigate('/login') }} className="footer-link">Sign In</Link>
        <Link to={'/contact'} onClick={() => { navigate('/contact') }} className="footer-link">Contact Us</Link>
      </div>
      <p className="copyright">© 2024, CartCraze.com</p>
    </div>
  )
}