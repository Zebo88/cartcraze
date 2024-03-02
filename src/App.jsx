import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/navbar'
import Home from './components/home';
import Account from './components/account'
import Products from './components/products';
import Cart from './components/cart'
import Login from './components/login'
import Registration from './components/registration';
import Footer from './components/footer';
import Contact from './components/contact';
import SingleProduct from './components/singleproduct';
import Checkout from './components/checkout'


function App() {
  const [token, setToken] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);
  const [singleProductId, setSingleProductId] = useState(() => {
    const storedProductId = localStorage.getItem('singleProductId');
    return storedProductId ? storedProductId : null;
  });
  const [quantity, setQuantity] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
    return storedRecentlyViewed ? JSON.parse(storedRecentlyViewed) : [];
  });
  const [cart, setCart] = useState([]);
  let cartArr = [];

  return (
    <>
      <div className='nav-container'>
        <NavigationBar
          token={token}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      </div>
      <div className='app-container'>
        <Routes>
          <Route path='/' element={<Home
              products={products}
              setProducts={setProducts}
              singleProduct={singleProduct}
              setSingleProduct={setSingleProduct}
              singleProductId={singleProductId}
              setSingleProductId={setSingleProductId}
              recentlyViewed={recentlyViewed}
              setRecentlyViewed={setRecentlyViewed}
              searchInput={searchInput}
            />}
          />
          <Route path='/products' element={<Products
              products={products}
              setProducts={setProducts}
            />}
          />
          <Route path='/products/:id' element={<SingleProduct
              token={token}
              singleProduct={singleProduct}
              setSingleProduct={setSingleProduct}
              singleProductId={singleProductId}
              setSingleProductId={setSingleProductId}
              quantity={quantity}
              setQuantity={setQuantity}
              recentlyViewed={recentlyViewed}
              setRecentlyViewed={setRecentlyViewed}
              cart={cart}
              setCart={setCart}
              cartArr={cartArr}
            />}
          />
          <Route path='/account' element={<Account
              token={token}
              setToken={setToken}
              user={user}
              setUser={setUser}
            />}
          />
          <Route path='/login' element={<Login
              token={token}
              setToken={setToken}
              user={user}
              setUser={setUser}
            />}
          />
          <Route path='/registration' element={<Registration
              token={token}
              setToken={setToken}
              user={user}
              setUser={setUser}
            />}
          />
          <Route path='/cart' element={<Cart
              quantity={quantity}
              setQuantity={setQuantity}
              cart={cart}
              setCart={setCart}
              cartArr={cartArr}
              token={token}
            />}
          />
          <Route path='/checkout' element={<Checkout
              token={token}
              cart={cart}
              setCart={setCart}
            />}
          />
          <Route path='/contact' element={<Contact/>}/>

        </Routes>
      </div>
      {/* <div className='footer-container'>
        <Footer/>
      </div> */}
    </> 
  )
}

export default App
