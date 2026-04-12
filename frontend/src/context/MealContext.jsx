import React, { createContext, useState, useCallback } from 'react';
import api from '../utils/api';

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMeals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/meals');
      setMeals(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMeal = async (mealData) => {
    try {
      const res = await api.post('/meals', mealData);
      setMeals([res.data.data, ...meals]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  };

  return (
    <MealContext.Provider value={{ meals, loading, getMeals, addMeal }}>
      {children}
    </MealContext.Provider>
  );
};
