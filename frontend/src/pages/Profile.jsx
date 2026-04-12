import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Settings, User, Save, Target } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goals: '',
    targetCalories: '',
    targetMacros: { protein: '', carbs: '', fats: '' }
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.profile?.age || '',
        gender: user.profile?.gender || 'male',
        height: user.profile?.height || '',
        weight: user.profile?.weight || '',
        activityLevel: user.profile?.activityLevel || 'moderate',
        goals: user.profile?.goals || 'maintain',
        targetCalories: user.profile?.targetCalories || '',
        targetMacros: {
          protein: user.profile?.targetMacros?.protein || '',
          carbs: user.profile?.targetMacros?.carbs || '',
          fats: user.profile?.targetMacros?.fats || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['protein', 'carbs', 'fats'].includes(name)) {
      setFormData({
        ...formData,
        targetMacros: { ...formData.targetMacros, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(formData);
    if (res.success) {
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(res.error || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-tr from-primary to-secondary rounded-xl shadow-lg">
          <Settings size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400">Manage your account and fitness goals</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-center font-medium ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal Info */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><User size={20} className="text-primary"/> Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Goals & Targets */}
        <div className="glass-card p-6 border-t border-secondary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Target size={150} />
          </div>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10"><Target size={20} className="text-secondary"/> Fitness Goals</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Primary Goal</label>
              <select name="goals" value={formData.goals} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary">
                <option value="lose_weight">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="build_muscle">Build Muscle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Activity Level</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary">
                <option value="sedentary">Sedentary (office job)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Very Active (6-7 days/week)</option>
              </select>
            </div>
            
            <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-700/50">
              <h4 className="text-white font-medium mb-4">Target Nutrition</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Calories (kcal)</label>
                  <input type="number" name="targetCalories" value={formData.targetCalories} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Protein (g)</label>
                  <input type="number" name="protein" value={formData.targetMacros.protein} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Carbs (g)</label>
                  <input type="number" name="carbs" value={formData.targetMacros.carbs} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Fats (g)</label>
                  <input type="number" name="fats" value={formData.targetMacros.fats} onChange={handleChange} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2 transition-all">
            <Save size={20} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
