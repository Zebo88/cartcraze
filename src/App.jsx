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


function App() {
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);

  return (
    <>
      <div className='nav-container'>
        <NavigationBar
          token={token}
        />
      </div>
      <div className='app-container'>
        <Routes>
          <Route path='/' element={<Home
              products={products}
              setProducts={setProducts}
            />}
          />
          <Route path='/products' element={<Products
              products={products}
              setProducts={setProducts}
            />}
          />
          <Route path='/account' element={<Account
              token={token}
              setToken={setToken}
            />}
          />
          <Route path='/login' element={<Login
              token={token}
              setToken={setToken}
            />}
          />
          <Route path='/cart' element={<Cart/>}/>
        </Routes>
      </div>
    </> 
  )
}

export default App
