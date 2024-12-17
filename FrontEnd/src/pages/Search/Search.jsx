import React, { useState, useContext } from 'react'
import './Search.css'
import { StoreContext } from '../../context/StoreContext.jsx'
import FoodItem from '../../components/FoodItem/FoodItem.jsx'

const Search = () => {
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc"); // Ascending order by default
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  const { food_list } = useContext(StoreContext)

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Filter and sort the food list based on search term and price
  const filteredFoodList = food_list
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price; // Ascending order
      } else {
        return b.price - a.price; // Descending order
      }
    });

  return (
    <div className="search-container">
      {/* Search input */}
      <input 
        type="text" 
        placeholder="Search by name or description..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
        className="search-input"
      />

      {/* Sort by price button */}
      <button onClick={toggleSortOrder}>
        Sort by Price ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </button>

      {/* Display food items */}
      <div className='food-display' id='food-display'>
        <h2>Search results</h2>
        <div className="food-display-list">
          {filteredFoodList.map((item, index) =>
            category === "All" || category === item.category ? (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}

export default Search;
