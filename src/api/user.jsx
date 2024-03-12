
const API_URL = 'http://localhost:3000/api/user';


// User Login Function
export async function login(username, password){
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
    return "Unable to login! Please try again.";
  }
}

// Add a new user
export async function addUser(email, username, password, firstname, lastname, housenum, street, city, state, country, zipcode, phone){
  try {
    const response = await fetch(`${API_URL}/register`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email, 
        username, 
        password, 
        firstname, 
        lastname, 
        housenum, 
        street, 
        city, 
        state, 
        country, 
        zipcode, 
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

// Update a user with ID
export async function updateUser(token, userId, userData) {
  try {
    const response = await fetch(`${API_URL}/update/${userId}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData) // Send userData object as the body
    });
    const result = await response.json();//error comes from here

    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function logoutUser(token) {
  try {
      const response = await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });

      const data = await response.json();
      console.log(data); // Log the response data
      
      // Check if the response is successful
      if (response.ok) {
          return 'Sign Out Successful!';
      } else {
          return 'Unable to Sign Out!';
      }
  } catch (error) {
      console.error('Error logging out user:', error.message || 'Unknown error');
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
} // I will implement this if I have time.

// ADMINISTRATOR FUNCTIONS BELOW. I will implement them if I have time.

// // Get all users
// export async function getAllUsers(){
//   try {
//     const response = await fetch(API_URL);
//     const result = await response.json();

//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // Get single user
// export async function getSingleUser(userId){
//   try {
//     const response = await fetch(`${API_URL}/${userId}`);
//     const result = await response.json();

//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // Get limited users
// export async function getLimitedUsers(){
//   try {
//     const response = await fetch(`${API_URL}?limit=5`);
//     const result = await response.json();

//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // Get sorted ascending users (The default value is in ascending mode, you can use it with 'desc' or 'asc' as you want.)
// export async function getSortedAscUsers(){
//   try {
//     const response = await fetch(`${API_URL}?sort=asc`);
//     const result = await response.json();

//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // Get sorted descending users
// export async function getSortedDescUsers(){
//   try {
//     const response = await fetch(`${API_URL}?sort=desc`);
//     const result = await response.json();

//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// }