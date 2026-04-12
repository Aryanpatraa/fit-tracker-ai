import React, { useContext, useEffect, useState } from 'react';
import { MealContext } from '../context/MealContext';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Apple, Plus, Flame, Sparkles } from 'lucide-react';

const MealPlanner = () => {
  const { user } = useContext(AuthContext);
  const { meals, getMeals, addMeal } = useContext(MealContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mealType, setMealType] = useState('breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  useEffect(() => {
    getMeals();
  }, [getMeals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mealData = {
      mealType,
      foods: [{
        name: foodName,
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fats: Number(fats),
        servingSize: 1,
        servingUnit: 'serving'
      }]
    };
    const res = await addMeal(mealData);
    if (res.success) {
      setShowAddForm(false);
      // reset form
      setFoodName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
    }
  };

  // Calculate today's totals
  const todayMeals = meals.filter(m => new Date(m.date).toDateString() === new Date().toDateString());
  const todayCalories = todayMeals.reduce((acc, m) => acc + m.totalCalories, 0);
  const todayProtein = todayMeals.reduce((acc, m) => acc + m.totalProtein, 0);
  const todayCarbs = todayMeals.reduce((acc, m) => acc + m.totalCarbs, 0);
  const todayFats = todayMeals.reduce((acc, m) => acc + m.totalFats, 0);

  const targetCalories = user?.profile?.targetCalories || 2000;
  const targetProtein = user?.profile?.targetMacros?.protein || 150;
  const targetCarbs = user?.profile?.targetMacros?.carbs || 200;
  const targetFats = user?.profile?.targetMacros?.fats || 65;

  const macroData = [
    { name: 'Protein', value: todayProtein, color: '#0ea5e9' },
    { name: 'Carbs', value: todayCarbs, color: '#8b5cf6' },
    { name: 'Fats', value: todayFats, color: '#fbbf24' }
  ];

  const MacroProgressBar = ({ label, current, target, color }) => {
    const percentage = Math.min((current / target) * 100, 100) || 0;
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300 font-medium">{label}</span>
          <span className="text-gray-400">{current}g / {target}g</span>
        </div>
        <div className="h-2 w-full bg-surface-light rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Nutrition Tracker</h1>
          <p className="text-gray-400">Manage your daily intake and macros</p>
        </div>
        <button 
          className="bg-surface hover:bg-surface-light border border-secondary text-secondary hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Sparkles size={16} /> AI Suggestion
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 md:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-white">Daily Summary</h3>
            <div className="text-right">
              <span className="text-3xl font-bold text-primary">{todayCalories}</span>
              <span className="text-gray-400"> / {targetCalories} kcal</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div className="h-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={macroData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} stroke="none" dataKey="value" paddingAngle={5}>
                    {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-white tracking-widest">{Math.round((todayCalories/targetCalories)*100)}%</span>
              </div>
            </div>
            <div>
              <MacroProgressBar label="Protein" current={todayProtein} target={targetProtein} color="#0ea5e9" />
              <MacroProgressBar label="Carbs" current={todayCarbs} target={targetCarbs} color="#8b5cf6" />
              <MacroProgressBar label="Fats" current={todayFats} target={targetFats} color="#fbbf24" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Flame className="text-white" size={32} />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">Remaining</h4>
            <p className="text-3xl font-bold text-orange-400 my-1">{Math.max(targetCalories - todayCalories, 0)}</p>
            <p className="text-sm text-gray-500">calories left today</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <h2 className="text-2xl font-bold text-white">Today's Meals</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          {showAddForm ? 'Cancel' : <><Plus size={16} /> Add Food</>}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card p-6 border border-primary/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="col-span-2">
                <input type="text" placeholder="Food Name" required value={foodName} onChange={e => setFoodName(e.target.value)} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
              </div>
              <div>
                <select value={mealType} onChange={e => setMealType(e.target.value)} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary">
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <div>
                <input type="number" placeholder="Cals" required value={calories} onChange={e => setCalories(e.target.value)} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-3 gap-2 col-span-2">
                <input type="number" placeholder="P (g)" required value={protein} onChange={e => setProtein(e.target.value)} className="w-full bg-surface border border-gray-700 rounded-lg px-2 py-2 text-white outline-none focus:border-primary text-sm" />
                <input type="number" placeholder="C (g)" required value={carbs} onChange={e => setCarbs(e.target.value)} className="w-full bg-surface border border-gray-700 rounded-lg px-2 py-2 text-white outline-none focus:border-primary text-sm" />
                <input type="number" placeholder="F (g)" required value={fats} onChange={e => setFats(e.target.value)} className="w-full bg-surface border border-gray-700 rounded-lg px-2 py-2 text-white outline-none focus:border-primary text-sm" />
              </div>
            </div>
            <div className="text-right">
              <button type="submit" className="bg-secondary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Entry</button>
            </div>
          </form>
        </div>
      )}

      {/* Meal List */}
      <div className="space-y-4">
        {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
          const typeMeals = todayMeals.filter(m => m.mealType === type);
          if (typeMeals.length === 0) return null;
          
          return (
            <div key={type} className="glass-card p-5">
              <h3 className="capitalize font-bold text-lg text-white mb-3 flex items-center gap-2">
                <Apple size={18} className="text-primary" /> {type}
              </h3>
              <div className="divide-y divide-gray-700/50">
                {typeMeals.map(meal => meal.foods.map((food, fIdx) => (
                  <div key={`${meal._id}-${fIdx}`} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{food.name}</p>
                      <p className="text-xs text-gray-500">P:{food.protein}g • C:{food.carbs}g • F:{food.fats}g</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold">{food.calories} kcal</p>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MealPlanner;
