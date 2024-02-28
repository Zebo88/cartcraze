
const API_URL = 'https://fakestoreapi.com/carts';

// Get all carts
export async function getAllCarts(){
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get single cart
export async function getSingleCart(cartId){
  try {
    const response = await fetch(`${API_URL}/${cartId}`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get limited carts
export async function getLimitedCarts(){
  try {
    const response = await fetch(`${API_URL}?limit=5`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get sorted ascending carts (The default value is in ascending mode, you can use it with 'desc' or 'asc' as you want.)
export async function getSortedAscCarts(){
  try {
    const response = await fetch(`${API_URL}?sort=asc`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get sorted descending carts
export async function getSortedDescCarts(){
  try {
    const response = await fetch(`${API_URL}?sort=desc`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get carts in a date range
/* If you don't add any start date it will fetch from the beginning of time and if 
   you don't add any end date it will fetch until now. You can also use limit(Number) 
   and sort(asc|desc) as a query string to get your ideal results. */
export async function getCartsInDateRange(startDate, endDate){
  try {
    const response = await fetch(`${API_URL}?startdate=${startDate}&enddate=${endDate}`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get users' carts (ex: https://fakestoreapi.com/carts/user/2 will get all the carts for user #2)
export async function getAllCartsForUser(userId){
  try {
    const response = await fetch(`${API_URL}carts/user/${userId}`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Add a new cart
export async function addCart(userId, date, products){
  try {
    const response = await fetch(API_URL,{
      method: 'POST',
      body: JSON.stringify({
        userId,
        date,
        products
      })
    });
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Update a cart
export async function updateCart(cartId, userId, date, products){
  try {
    const response = await fetch(`${API_URL}/${cartId}`,{
      method: 'PATCH',
      body: JSON.stringify({
        userId,
        date,
        products
      })
    });
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Delete a cart
export async function deleteCart(cartId){
  try {
    const response = await fetch(`${API_URL}/${cartId}`,{
      method: 'DELETE'
    });
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}