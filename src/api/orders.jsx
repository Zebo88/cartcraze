
const API_URL = 'https://cartcraze-1.onrender.com/api/orders';

// Function to create a new order
export async function createOrder(userId, token) {
  try {
    const response = await fetch(`${API_URL}/orders/${userId}/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create order');
  }
}

// Function to get orders by user ID
export async function getOrdersByUserId(userId, token) {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch orders by user ID');
  }
}

// Function to get a single order with ID for a user with ID
export async function getSingleOrderByUserId(userId, orderId) {
  try {
    const response = await fetch(`${API_URL}/${orderId}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch single order by user ID and order ID');
  }
}

// Function to add item to an order
export async function addItemToOrder(orderId, productId, quantity, token) {
  try {
    const response = await fetch(`${API_URL}/${orderId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add item to order');
  }
}

// Function to create order using items from the cart
export async function purchaseItems(userId, token) {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/purchase`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to purchase items');
  }
}