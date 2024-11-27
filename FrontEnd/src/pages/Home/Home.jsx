import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header.jsx'
import Explore from '../../components/ExploreMenu/Explore.jsx'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay.jsx'
import AppDownload from '../../components/AppDownload/AppDownload.jsx'
export const Home = () => {
  const [category, setCategory] = useState("All");    

  return (
    <div>
      <Header />
      <Explore category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  )
}

export default Home
