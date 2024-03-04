module.exports = {
  ...require('./user'), // adds key/values from users.js
  ...require('./cart'), // adds key/values from carts.js
  ...require('./products'), // adds key/values from products.js
  ...require('./cart_products') // adds key/values from products.js
}