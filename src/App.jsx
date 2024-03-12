import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/navbar'
import Home from './components/home';
import Account from './components/account'
import Cart from './components/cart'
import Login from './components/login'
import Registration from './components/registration';
import Footer from './components/footer';
import Contact from './components/contact';
import SingleProduct from './components/singleproduct';
import Checkout from './components/checkout'


function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken ? JSON.parse(storedToken) : null;
  });
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [products, setProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);
  const [singleProductId, setSingleProductId] = useState(() => {
    const storedProductId = localStorage.getItem('singleProductId');
    return storedProductId ? JSON.parse(storedProductId) : null;
  });
  const [quantity, setQuantity] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
    return storedRecentlyViewed ? JSON.parse(storedRecentlyViewed) : [];
  });
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState(() => {
    const history = localStorage.getItem('order-history');
    return history ? JSON.parse(history) : [];
  });

  return (
    <>
    <div className='app-wrapper'>
      <div className='app-container'>
        <div className='nav-container'>
          <NavigationBar
            token={token}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            setProducts={setProducts}
          />
        </div>
      
        <Routes>
          <Route path='/' element={<Home
              products={products}
              setProducts={setProducts}
              setSingleProductId={setSingleProductId}
              setRecentlyViewed={setRecentlyViewed}
            />}
          />
          <Route path='/products/:id' element={<SingleProduct
              token={token}
              setToken={setToken}
              singleProduct={singleProduct}
              setSingleProduct={setSingleProduct}
              singleProductId={singleProductId}
              setSingleProductId={setSingleProductId}
              quantity={quantity}
              setQuantity={setQuantity}
              recentlyViewed={recentlyViewed}
              setRecentlyViewed={setRecentlyViewed}
              setCart={setCart}
              setUser={setUser}
            />}
          />
          <Route path='/account' element={<Account
              token={token}
              setToken={setToken}
              user={user}
              setUser={setUser}
              orderHistory={orderHistory}
              setOrderHistory={setOrderHistory}
            />}
          />
          <Route path='/login' element={<Login
              setToken={setToken}
              setUser={setUser}
            />}
          />
          <Route path='/registration' element={<Registration
              setUser={setUser}
            />}
          />
          <Route path='/cart' element={<Cart
              cart={cart}
              setCart={setCart}
              token={token}
              setToken={setToken}
              setUser={setUser}
            />}
          />
          <Route path='/checkout' element={<Checkout
              user={user}
              token={token}
              cart={cart}
              setCart={setCart}
            />}
          />
          <Route path='/contact' element={<Contact/>}/>
        </Routes>
      
      </div>
     <div className='footer-container'>
        <Footer/>
      </div>
      </div>
    </> 
  )
}

export default App
