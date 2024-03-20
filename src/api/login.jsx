// Login
const API_URL = "https://cartcraze.onrender.com/auth/login";

// User Login Function
export async function login(username, password){
  try {
    const response = await fetch(API_URL, {
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
    console.log(result);

    return result;
  } catch (error) {
    console.log(error);
    return "Unable to login! Please try again.";
  }
}