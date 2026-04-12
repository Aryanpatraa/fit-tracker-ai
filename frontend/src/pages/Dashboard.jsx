import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WorkoutContext } from '../context/WorkoutContext';
import { ProgressContext } from '../context/ProgressContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Flame, TrendingUp, Trophy } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { workouts, getWorkouts } = useContext(WorkoutContext);
  const { progressLogs, getProgress } = useContext(ProgressContext);

  useEffect(() => {
    getWorkouts();
    getProgress();
  }, [getWorkouts, getProgress]);

  // Mock Data for Charts if no actual data exists yet
  const weightData = progressLogs.length > 0 ? progressLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: log.weight
  })).reverse() : [
    { date: 'Mon', weight: 75 }, { date: 'Tue', weight: 74.8 }, { date: 'Wed', weight: 74.5 },
    { date: 'Thu', weight: 74.6 }, { date: 'Fri', weight: 74.2 }, { date: 'Sat', weight: 74.0 },
    { date: 'Sun', weight: 73.8 }
  ];

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className="glass-card p-6 flex items-start justify-between group hover:scale-[1.02] transition-transform">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
        <p className={`text-sm ${subtitle.startsWith('+') ? 'text-green-400' : 'text-gray-400'}`}>{subtitle}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name.split(' ')[0]}! Ready to crush your goals today?</p>
        </div>
        <div className="glass px-6 py-3 rounded-full flex items-center space-x-2">
          <Flame className="text-orange-500" size={20} />
          <span className="text-white font-medium">3 Day Streak!</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tracking-wide">
        <StatCard 
          title="Total Workouts" 
          value={workouts.length.toString()} 
          subtitle="This month" 
          icon={<Activity className="text-white" size={24} />} 
          color="from-primary to-primary-dark"
        />
        <StatCard 
          title="Current Weight" 
          value={progressLogs[0] ? `${progressLogs[0].weight} kg` : '--'} 
          subtitle="-1.2 kg from last week" 
          icon={<TrendingUp className="text-white" size={24} />} 
          color="from-secondary to-blue-600"
        />
        <StatCard 
          title="Calories Burned" 
          value="12,450" 
          subtitle="+15% vs last week" 
          icon={<Flame className="text-white" size={24} />} 
          color="from-orange-400 to-red-500"
        />
        <StatCard 
          title="Milestones" 
          value="4/5" 
          subtitle="Goal: Build Muscle" 
          icon={<Trophy className="text-white" size={24} />} 
          color="from-yellow-400 to-yellow-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weight Progress Chart */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Weight Progress</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#0ea5e9" 
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workout Activity Map */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <button className="text-primary hover:text-white text-sm font-medium transition-colors">View All</button>
          </div>
          
          <div className="flex-1 space-y-4">
            {workouts.slice(0, 4).length > 0 ? workouts.slice(0, 4).map(workout => (
              <div key={workout._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-light/50 transition-colors cursor-pointer border border-transparent hover:border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center">
                    <Activity size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{workout.name}</h4>
                    <p className="text-sm text-gray-400">{new Date(workout.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{workout.duration} min</p>
                  <p className="text-xs text-gray-500">{workout.exercises.length} Exercises</p>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Activity size={48} className="mb-4 opacity-20" />
                <p>No recent workouts found.</p>
                <p className="text-sm mt-1">Start tracking to see your activity here!</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
