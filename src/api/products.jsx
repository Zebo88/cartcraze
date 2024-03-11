
const API_URL = 'http://localhost:3000/api/products';

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
    return error.message;
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
    const response = await fetch(`${API_URL}/category/${category}`);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function searchProducts(searchTerm){
  try {
    const response = await fetch(`${API_URL}/search`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        searchTerm
      })
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

// Get all products of a specific sorting direction (ascending or descending) and a price range
export async function sortProducts(direction, minPrice, maxPrice){
  try {
    const response = await fetch(`${API_URL}/sort/${direction}/min/${minPrice}/max/${maxPrice}`);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// ADMINISTRATOR FUNCTIONS BELOW. If I have time, I will implement them.

// Add a new product
// export async function addProduct(title, price, description, image, category){
//   try {
//     const response = await fetch(API_URL,{
//       method: 'POST',
//       body: JSON.stringify({
//         title,
//         price,
//         description,
//         image,
//         category
//       })
//     });
//     const result = await response.json();
    
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// }

// // Update a product
// export async function updateProduct(productId, title, price, description, image, category){
//   try {
//     const response = await fetch(`${API_URL}/${productId}`,{
//       method: 'PATCH',
//       body: JSON.stringify({
//         title,
//         price,
//         description,
//         image,
//         category
//       })
//     });
//     const result = await response.json();
    
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// }

// // Delete a product
// export async function deleteProduct(productId){
//   try {
//     const response = await fetch(`${API_URL}/${productId}`,{
//       method: 'DELETE'
//     });
//     const result = await response.json();
    
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// }