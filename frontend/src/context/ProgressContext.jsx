import React, { createContext, useState, useCallback } from 'react';
import api from '../utils/api';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progressLogs, setProgressLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/progress');
      setProgressLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProgress = async (progressData) => {
    try {
      const res = await api.post('/progress', progressData);
      setProgressLogs([res.data.data, ...progressLogs]);
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  };

  return (
    <ProgressContext.Provider value={{ progressLogs, loading, getProgress, addProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
