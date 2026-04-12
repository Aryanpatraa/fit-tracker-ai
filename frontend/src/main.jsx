import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { WorkoutProvider } from './context/WorkoutContext.jsx';
import { MealProvider } from './context/MealContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <WorkoutProvider>
        <MealProvider>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </MealProvider>
      </WorkoutProvider>
    </AuthProvider>
  </React.StrictMode>,
);
