import React from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Cart from './pages/Cart/Cart.jsx'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder.jsx'
import Footer from "./components/Footer/Footer.jsx"
import LoginPopup from './components/LoginPopup/LoginPopup.jsx'
import MyOrders from "./pages/MyOrders/MyOrders.jsx"
import Verify from "./pages/Verify/Verify.jsx"

export const App = () => {
  const [showLogin, setShowLogin] = React.useState(false)
  return (
    <>
      {showLogin? <LoginPopup setShowLogin={setShowLogin} />:<></>}
      <div className="App">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
