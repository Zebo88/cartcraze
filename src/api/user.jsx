
const API_URL = 'https://fakestoreapi.com/users';

// Get all users
export async function getAllUsers(){
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get single user
export async function getSingleUser(userId){
  try {
    const response = await fetch(`${API_URL}/${userId}`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get limited users
export async function getLimitedUsers(){
  try {
    const response = await fetch(`${API_URL}?limit=5`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get sorted ascending users (The default value is in ascending mode, you can use it with 'desc' or 'asc' as you want.)
export async function getSortedAscUsers(){
  try {
    const response = await fetch(`${API_URL}?sort=asc`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Get sorted descending users
export async function getSortedDescUsers(){
  try {
    const response = await fetch(`${API_URL}?sort=desc`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

// Add a new user
export async function addUser(email, username, password, name, address, phone){
  try {
    const response = await fetch(API_URL,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email, 
        username, 
        password, 
        name, 
        address, 
        phone
      })
    });
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
    return "Unable to register! Please try again.";
  }
}

// Update a user
export async function updateUser(userId, email, username, password, name, address, phone){
  try {
    const response = await fetch(`${API_URL}/${userId}`,{
      method: 'PATCH',
      body: JSON.stringify({
        email, 
        username, 
        password, 
        name, 
        address, 
        phone
      })
    });
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Delete a user
export async function deleteUser(userId){
  try {
    const response = await fetch(`${API_URL}/${userId}`,{
      method: 'DELETE'
    });
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(error);
  }
}