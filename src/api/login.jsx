// Login
const API_URL = 'postgresql://cartcraze_db_eqcv_user:Jng89PQTfX779unLvhuPC8739mEVnKQw@dpg-cs4s01q3esus73alfo7g-a.oregon-postgres.render.com/cartcraze_db_eqcv';

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