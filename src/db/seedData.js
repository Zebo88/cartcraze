// Import the database adapter functions as you write them (createUser, createProduct...)
import { createUser } from './user.js';
import { createProduct } from './products.js';
import { createCart } from './cart.js';
import { createCartProduct } from './cart_products.js';
import { createOrder, createOrderItem } from './orders.js';
import client from './client.js';

async function dropTables() {
  console.log('Dropping All Tables...');
  // drop all tables, in the correct order
  try {
    await  client.query(`
    DROP TABLE IF EXISTS order_items CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS cart_products CASCADE;
    DROP TABLE IF EXISTS carts CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS users;
  `)
  } catch (error) {
    throw error; 
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    // create all tables, in the correct order

    await  client.query(`
      CREATE TABLE users(
        user_id  SERIAL PRIMARY KEY, 
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL, 
        password VARCHAR(255) NOT NULL,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        housenum VARCHAR(255) NOT NULL,
        street VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        zipcode VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL
      );
    `)

    await  client.query(`
      CREATE TABLE products(
        product_id SERIAL PRIMARY KEY, 
        title VARCHAR(255) UNIQUE NOT NULL,
        price NUMERIC (5, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        rate NUMERIC (10, 2) NOT NULL,
        count INTEGER NOT NULL
      );
    `)

    await  client.query(`
      CREATE TABLE carts(
        cart_id SERIAL PRIMARY KEY, 
        user_id INTEGER NOT NULL REFERENCES users(user_id),
        date DATE NOT NULL
      );
    `)

    await  client.query(`
      CREATE TABLE cart_products (
        cart_product_id SERIAL PRIMARY KEY,
        cart_id INTEGER NOT NULL REFERENCES carts(cart_id),
        product_id INTEGER NOT NULL REFERENCES products(product_id),
        quantity INTEGER NOT NULL
      );
    `)

    await client.query(`
      CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id),
        order_date DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `)

    await client.query(`
      CREATE TABLE order_items (
        order_item_id SERIAL PRIMARY KEY,
        order_id INT NOT NULL REFERENCES orders(order_id),
        product_id INT NOT NULL REFERENCES products(product_id),
        quantity INT NOT NULL
      );
    `)

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  console.log('Starting to create users...');
  try {

    const usersToCreate = [
      { id: 1, email: 'john@gmail.com', username: 'johnd', password: 'm38rmF$', firstname: "john", lastname: "doe", housenum: '7682', street: 'new road', city: 'kilcoole', state: 'ID', country: 'USA', zipcode: '12926-3874', phone: "1-570-236-7033" },
      { id: 2, email: 'morrison@gmail.com', username: 'mor_2314', password: '83r5^_', firstname: "david", lastname: "morrison", housenum: '7267', street: 'Lovers Ln', city: 'kilcoole', state: 'ID', country: 'USA', zipcode: '12926-3874', phone: "1-570-236-7033" },
      { id: 3, email: 'kevin@gmail.com', username: 'kevinryan', password: 'kev02937@', firstname: "kevin", lastname: "ryan", housenum: '86', street: 'Frances Ct', city: 'Cullman', state: 'ID', country: 'USA', zipcode: '29567-1452', phone: "1-567-094-1345" },
    ]
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}
async function createInitialProducts() {
  try {
    console.log('Starting to create products...');

    const productsToCreate = [
        {
          id: 1,
          title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
          price: 109.95,
          description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
          category: "men's clothing",
          image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
          rate: 3.9,
          count: 120
      },
      {
          id: 2,
          title: "Mens Casual Premium Slim Fit T-Shirts ",
          price: 22.30,
          description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
          category: "men's clothing",
          image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
          rate: 4.1,
          count: 259
      },
      {
          id: 3,
          title: "Mens Cotton Jacket",
          price: 55.99,
          description: "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
          category: "men's clothing",
          image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
          rate: 4.7,
          count: 500
      },
      {
          id: 4,
          title: "Mens Casual Slim Fit",
          price: 15.99,
          description: "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
          category: "men's clothing",
          image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
          rate: 2.1,
          count: 430
      },
      {
          id: 5,
          title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
          price: 695.00,
          description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
          category: "jewelry",
          image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
          rate: 4.6,
          count: 400
      },
      {
          id: 6,
          title: "Solid Gold Petite Micropave ",
          price: 168.00,
          description: "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
          category: "jewelry",
          image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
          rate: 3.9,
          count: 70
      },
      {
          id: 7,
          title: "White Gold Plated Princess",
          price: 9.99,
          description: "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
          category: "jewelry",
          image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
          rate: 3,
          count: 400
      },
      {
          id: 8,
          title: "Pierced Owl Rose Gold Plated Stainless Steel Double",
          price: 10.99,
          description: "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
          category: "jewelry",
          image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
          rate: 1.9,
          count: 100
      },
      {
          id: 9,
          title: "WD 2TB Elements Portable External Hard Drive - USB 3.0 ",
          price: 64.00,
          description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
          category: "electronics",
          image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
          rate: 3.3,
          count: 203
      },
      {
          id: 10,
          title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
          price: 109.00,
          description: "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
          category: "electronics",
          image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
          rate: 2.9,
          count: 470
      },
      {
          id: 11,
          title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
          price: 109.00,
          description: "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.",
          category: "electronics",
          image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
          rate: 4.8,
          count: 319
      },
      {
          id: 12,
          title: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
          price: 114.00,
          description: "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
          category: "electronics",
          image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
          rate: 4.8,
          count: 400
      },
      {
          id: 13,
          title: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
          price: 599.00,
          description: "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz",
          category: "electronics",
          image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
          rate: 2.9,
          count: 250
      },
      {
          id: 14,
          title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ",
          price: 999.99,
          description: "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
          category: "electronics",
          image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
          rate: 2.2,
          count: 140
      },
      {
          id: 15,
          title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
          price: 56.99,
          description: "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates",
          category: "women's clothing",
          image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
          rate: 2.6,
          count: 235
      },
      {
          id: 16,
          title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
          price: 29.95,
          description: "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON",
          category: "women's clothing",
          image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
          rate: 2.9,
          count: 340
      },
      {
          id: 17,
          title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
          price: 39.99,
          description: "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
          category: "women's clothing",
          image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
          rate: 3.8,
          count: 679
      },
      {
          id: 18,
          title: "MBJ Women's Solid Short Sleeve Boat Neck V ",
          price: 9.85,
          description: "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
          category: "women's clothing",
          image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
          rate: 4.7,
          count: 130
      },
      {
          id: 19,
          title: "Opna Women's Short Sleeve Moisture",
          price: 7.95,
          description: "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort",
          category: "women's clothing",
          image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
          rate: 4.5,
          count: 146
      },
      {
          id: 20,
          title: "DANVOUY Womens T Shirt Casual Cotton Short",
          price: 12.99,
          description: "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
          category: "women's clothing",
          image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
          rate: 3.6,
          count: 145
      }
    ]
    const products = await Promise.all(productsToCreate.map(createProduct));

    console.log('products created:');
    console.log(products);

    console.log('Finished creating products!');
  } catch (error) {
    console.error('Error creating products!');
    throw error;
  }
}

async function createInitialCartsAndProducts() {
  try {
    console.log('Starting to create carts and cart products...');

    const cartsToCreate = [
      { userId: 1 },
      { userId: 2 },
      { userId: 3 }
    ];

    const carts = await Promise.all(
      cartsToCreate.map(async cart => {
        // Extract the userId from the cart object
        const { userId } = cart;
        // Call createCart function with userId
        return await createCart(userId);
      })
    );

    const cartProductsToCreate = [
      { cartId: 1, productId: 1, quantity: 4 },
      { cartId: 1, productId: 2, quantity: 1 },
      { cartId: 1, productId: 3, quantity: 6 },
      { cartId: 2, productId: 8, quantity: 1 },
      { cartId: 2, productId: 7, quantity: 2 },
      { cartId: 2, productId: 2, quantity: 4 },
      { cartId: 3, productId: 9, quantity: 4 },
      { cartId: 3, productId: 10, quantity: 2 },
      { cartId: 3, productId: 5, quantity: 1 }
    ];

    await Promise.all(cartProductsToCreate.map(cartProduct => createCartProduct(cartProduct)));

    console.log('Carts and Cart Products Created.');
    console.log('Finished creating carts and cart products.');
  } catch (error) {
    throw error;
  }
}

async function createInitialOrdersAndItems() {
  try {
    console.log('Starting to create orders and order items...');

    // Dummy orders data
    const ordersToCreate = [
      { userId: 1 },
      { userId: 2 },
      { userId: 3 }
    ];

    // Insert orders into the database
    const orders = await Promise.all(ordersToCreate.map(order => createOrder(order.userId)));

    // Dummy order items data
    const orderItemsToCreate = [
      { orderId: 1, productId: 1, quantity: 2 },
      { orderId: 1, productId: 2, quantity: 1 },
      { orderId: 2, productId: 3, quantity: 3 },
      { orderId: 2, productId: 4, quantity: 2 },
      { orderId: 3, productId: 5, quantity: 1 }
    ];

    // Insert order items into the database
    await Promise.all(orderItemsToCreate.map(orderItem => createOrderItem(orderItem)));

    console.log('Orders and Order Items Created.');
    console.log('Finished creating orders and order items.');
  } catch (error) {
    throw error;
  }
}

export async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialCartsAndProducts();
    await createInitialOrdersAndItems();
  } catch (error) {
    console.log('Error during rebuildDB')
    throw error;
  }
}

