# FitTracker AI - MERN Stack

A complete full-stack AI-Powered Workout Tracker & Meal Planner application built using MongoDB, Express, React, Node.js, and Tailwind CSS.

## Features

- **Authentication System:** JWT-based login, registration, and secure routes.
- **Workout Monitoring:** Custom workout logs, exercise tracking with sets/reps.
- **Nutrition & Macros Planner:** Comprehensive daily meal logging, automatic macro (Protein, Carbs, Fats) calculation, and a TDEE analyzer.
- **Progress Tracking:** Interactive charts tracking weight trends over time and a before-after comparison UI for progress photos.
- **Custom Modern UI:** Highly responsive, dark-mode themed React interface utilizing modern `Lucide Icons` and `Recharts` for stunning graphics.

## Project Structure

This repository is split into two directories:
* `backend/` - Node.js + Express API server, MongoDB models, middlewares, controllers
* `frontend/` - React frontend powered by Vite and styled with TailwindCSS 

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally (default URI `mongodb://127.0.0.1:27017/fittracker`) or set up a MongoDB Atlas cluster.

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update your `.env` file inside the `backend` folder as needed:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/fittracker
   JWT_SECRET=supersecretjwtkeythatshouldbechanged
   PORT=5000
   NODE_ENV=development
   ```
4. Seed the database with Exercises:
   ```bash
   node seed/exercises.js
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React app:
   ```bash
   npm run dev
   ```

## API Documentation

- **Auth endpoints:** 
  - `POST /api/auth/register` (Register a user)
  - `POST /api/auth/login` (Login user)
  - `GET /api/auth/me` (Get User session)
  - `PUT /api/auth/profile` (Update user info & macros)

- **Workouts endpoints:** `GET|POST /api/workouts`, `PUT|DELETE /api/workouts/:id`
- **Meals endpoints:** `GET|POST /api/meals`, `PUT|DELETE /api/meals/:id`
- **Progress endpoints:** `GET|POST /api/progress`, `PUT|DELETE /api/progress/:id` -> Use `POST /api/progress/:id/photo` with `multipart/form-data` to upload images.
