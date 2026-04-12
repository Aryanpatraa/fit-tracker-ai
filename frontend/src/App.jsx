import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import MealPlanner from './pages/MealPlanner';
import ProgressTracker from './pages/ProgressTracker';
import Profile from './pages/Profile';

// Components
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      {user && <Navbar />}
      <div className={`${user ? 'ml-0 md:ml-64 p-4 md:p-8 w-full' : 'w-full'}`}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
          <Route path="/meals" element={<PrivateRoute><MealPlanner /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><ProgressTracker /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
