import '../styles/allFoodStore.css';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from "../lib/api";


const AllFoodStore = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/foodpartner`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch foods');
        }
        const data = await response.json();
        setFoods(data.foodItems);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchFoods();
  }, []);

  const handleEdit = (foodId) => {
    // Navigate to an edit page, passing the food ID
    console.log(`Editing food with ID: ${foodId}`);
    // navigate(`/food/edit/${foodId}`);
  };

  const handleDelete = async (foodId) => {
    // Keep a copy of previous state so we can revert on failure
    const prevFoods = foods;
    // Optimistically remove the food from the UI
    setFoods(prevFoods.filter((food) => food._id !== foodId));

    try {
      const response = await fetch(`${API_BASE_URL}/api/food/${foodId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        // If the delete fails, revert the UI change
        setFoods(prevFoods);
        throw new Error('Failed to delete food');
      }
    } catch (error) {
      console.error('Error deleting food:', error);
      setFoods(prevFoods);
    }
  };

  return (
    <div className="all-food-store-page">
      <h1 className="page-heading">Food Items in the store</h1>
      <div className="food-grid">
        {foods.map((food) => (
          <div key={food._id} className="food-card-store">
            <video className="food-video" src={food.video} autoPlay loop muted playsInline />
            <div className="food-info">
              <h3>{food.name}</h3>
              <p>${food.price}</p>
            </div>
            <div className="food-actions">
              <button className="btn-edit" onClick={() => handleEdit(food._id)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(food._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFoodStore;
