
const API_URL = 'http://localhost:3000/api/orders';

// Function to create a new order
export async function createOrder(userId) {
  try {
    const response = await fetch(`${API_URL}/orders/${userId}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
export async function getOrdersByUserId(userId) {
  try {
    const response = await fetch(`${API_URL}/orders/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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
    const response = await fetch(`${API_URL}/orders/${orderId}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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
export async function addItemToOrder(orderId, productId, quantity) {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
export async function purchaseItems(userId) {
  try {
    const response = await fetch(`${API_URL}/orders/user/${userId}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to purchase items');
  }
}