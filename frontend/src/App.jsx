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
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900">
        <div className="text-center animate-pulse duration-1000">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-4 tracking-tighter drop-shadow-lg">
            Fit-Tracker
          </h1>
          <p className="text-xl md:text-2xl font-medium tracking-[0.3em] uppercase text-zinc-300">
            Get fit today
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex bg-zinc-950 min-h-screen text-gray-100">
        {user && <Navbar />}
        <div className={`${user ? 'ml-0 md:ml-64 p-4 md:p-8 w-full transition-all duration-300' : 'w-full'}`}>
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
      </div>
    </Router>
  );
}

export default App;
