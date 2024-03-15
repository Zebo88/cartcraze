import { useState } from "react";



async function login(){
  const [user, setUser] = useState();
  const [cart, setCart] = useState();
  const [token, setToken] = useState();
  const loginUsername = "";

  try {
    // function to send http request to get a token
    const response = await fetch(API_Users);
    const result = await response.json();

    // Set token
    setToken(result.token);

    loginUsername = result.username; // "johnd"

    const userData = localStorage.getItem(`${loginUsername}`);

    if(!userData && loginUsername === userData.username){
      
      setUser(userData);

    }else{
      // Create user in local storage containing the correct data structure
      localStorage.setItem(`${loginUsername}`, JSON.stringify(
        { 
          username: loginUsername, 
          cart: { 
            products: [] 
          } 
        }
      ));

        // Set User state
        setUser({ 
          username: loginUsername, 
          email: loggedInUserData.email,
          name: loggedInUserData.name,
          cart: { 
            products: [] 
          } 
        });

        // Set cart state
        setCart({ cart: { products: [] } });

    }

  } catch (error) {
    
  }


  function addToCart(){
    
      // Check to see if the user is logged in
      if(user){

        // Create an updated cart containing the current cart products and a new cart item
        const updatedCart = {
          ...user.cart,
          products: [...user.cart.products, cartItem]
        };
        
        // Update the user object with the updated cart
        const updatedUser = {
          ...user,
          cart: updatedCart
        };

        // Set state to updated user
        setUser(updatedUser);

        // Update the user data in localStorage
        localStorage.setItem(user.name, JSON.stringify(updatedUser));

      }else{
        // Alert the user to login before adding items to their cart
        error.message("You need to login!")
      }

  }




}