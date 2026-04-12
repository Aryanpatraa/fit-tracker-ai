import React, { createContext, useState, useCallback } from 'react';
import api from '../utils/api';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/workouts');
      setWorkouts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addWorkout = async (workoutData) => {
    try {
      const res = await api.post('/workouts', workoutData);
      setWorkouts([res.data.data, ...workouts]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  };

  return (
    <WorkoutContext.Provider value={{ workouts, loading, getWorkouts, addWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};
