import React, { useContext, useEffect, useState } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import { Plus, Play, CheckCircle, Clock } from 'lucide-react';

const Workouts = () => {
  const { workouts, getWorkouts, addWorkout } = useContext(WorkoutContext);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState([{ name: '', sets: [{ reps: '', weight: '' }] }]);

  useEffect(() => {
    getWorkouts();
  }, [getWorkouts]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ reps: '', weight: '' }] }]);
  };

  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workoutData = { name, duration: Number(duration), exercises };
    const res = await addWorkout(workoutData);
    if (res.success) {
      setShowForm(false);
      setName('');
      setDuration('');
      setExercises([{ name: '', sets: [{ reps: '', weight: '' }] }]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Workouts</h1>
          <p className="text-gray-400">Track and manage your training sessions</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/30"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> New Workout</>}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="text-xl font-bold text-white mb-6">Create New Workout</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Workout Name</label>
                <input 
                  type="text" required 
                  className="w-full bg-surface-light border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Push Day" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Duration (minutes)</label>
                <input 
                  type="number" required 
                  className="w-full bg-surface-light border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  value={duration} onChange={e => setDuration(e.target.value)} placeholder="60" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Exercises</h3>
              {exercises.map((exc, eIdx) => (
                <div key={eIdx} className="bg-surface p-4 rounded-xl border border-gray-700">
                  <input 
                    type="text" required
                    className="w-full bg-surface-light border border-gray-600 rounded-lg px-4 py-2 text-white mb-4 min-w-[200px]"
                    placeholder="Exercise Name (e.g., Bench Press)"
                    value={exc.name}
                    onChange={(e) => {
                      const newExercises = [...exercises];
                      newExercises[eIdx].name = e.target.value;
                      setExercises(newExercises);
                    }}
                  />
                  <div className="space-y-2">
                    {exc.sets.map((set, sIdx) => (
                      <div key={sIdx} className="flex gap-4 items-center">
                        <span className="text-gray-500 font-medium w-12 text-sm">Set {sIdx + 1}</span>
                        <input type="number" placeholder="Reps" required className="w-24 bg-background border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                          value={set.reps} onChange={(e) => {
                            const newExercises = [...exercises];
                            newExercises[eIdx].sets[sIdx].reps = e.target.value;
                            setExercises(newExercises);
                          }}
                        />
                        <input type="number" placeholder="Weight (kg)" required className="w-32 bg-background border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                          value={set.weight} onChange={(e) => {
                            const newExercises = [...exercises];
                            newExercises[eIdx].sets[sIdx].weight = e.target.value;
                            setExercises(newExercises);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => handleAddSet(eIdx)} className="mt-3 text-sm text-secondary hover:text-white transition-colors">+ Add Set</button>
                </div>
              ))}
              <button type="button" onClick={handleAddExercise} className="w-full py-3 border-2 border-dashed border-gray-600 text-gray-400 hover:border-primary hover:text-primary rounded-xl transition-colors font-medium">
                + Add Another Exercise
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg">Save Workout</button>
            </div>
          </form>
        </div>
      )}

      {/* Workout History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workouts.map(workout => (
          <div key={workout._id} className="glass-card p-6 flex flex-col hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{workout.name}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                  <Clock size={14} /> {new Date(workout.date).toLocaleDateString()} • {workout.duration} min
                </p>
              </div>
              <div className="bg-surface p-2 rounded-lg text-primary"><Play fill="currentColor" size={20} /></div>
            </div>
            
            <div className="space-y-3 mt-2 flex-1">
              {workout.exercises.slice(0, 3).map((exc, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-700/50 pb-2">
                  <span className="text-gray-300 font-medium">{exc.name}</span>
                  <span className="text-gray-500">{exc.sets.length} sets</span>
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <div className="text-center text-sm text-gray-500 pt-2">+ {workout.exercises.length - 3} more exercises</div>
              )}
            </div>

            <button className="mt-6 w-full py-2.5 bg-surface hover:bg-surface-light border border-gray-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors">
              <CheckCircle size={18} className="text-green-500" />
              View Details
            </button>
          </div>
        ))}
        {workouts.length === 0 && !showForm && (
          <div className="col-span-1 lg:col-span-2 text-center py-20 text-gray-500">
            <p>No workouts recorded yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Workouts;
