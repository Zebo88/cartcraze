import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Account({ token, setToken }){
  const navigate = useNavigate();

  return(
    <div>
      <h1>Welcome to My Account</h1>
    </div>
    
  )
}