
const API_URL = 'https://fakestoreapi.com/products';

// Get all the products from the API
export async function getAllProducts(){
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

// Get a single product from the API
export async function getSingleProduct(productId){
  try {
    const response = await fetch(`${API_URL}/${productId}`);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Limit the results of the products to 5
export async function getLimitedProducts(){
  try {
    const response = await fetch(`${API_URL}?$limit=5`);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Sort the products in descending order
export async function getSortedProductsDesc(){
  try {
    const response = await fetch(`${API_URL}?sort=desc`);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Sort the products in acending order
export async function getSortedProductsAsc(){
  try {
    const response = await fetch(`${API_URL}?sort=asc`);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Get all the product categories
export async function getProductCategories(){
  try {
    const response = await fetch(`${API_URL}/categories`);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Get all products of a specific category
export async function getProductsOfCategory(category){
  try {
    const response = await fetch(`${API_URL}/categories/${category}`);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Add a new product
export async function addProduct(title, price, description, image, category){
  try {
    const response = await fetch(API_URL,{
      method: 'POST',
      body: JSON.stringify({
        title,
        price,
        description,
        image,
        category
      })
    });
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Update a product
export async function updateProduct(productId, title, price, description, image, category){
  try {
    const response = await fetch(`${API_URL}/${productId}`,{
      method: 'PATCH',
      body: JSON.stringify({
        title,
        price,
        description,
        image,
        category
      })
    });
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Delete a product
export async function deleteProduct(productId){
  try {
    const response = await fetch(`${API_URL}/${productId}`,{
      method: 'DELETE'
    });
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}