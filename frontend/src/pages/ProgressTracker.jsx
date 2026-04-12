import React, { useContext, useEffect, useState } from 'react';
import { ProgressContext } from '../context/ProgressContext';
import { Camera, Upload, Scale, Ruler } from 'lucide-react';
import api from '../utils/api';

const ProgressTracker = () => {
  const { progressLogs, getProgress, addProgress } = useContext(ProgressContext);
  const [showLogForm, setShowLogForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    getProgress();
  }, [getProgress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await addProgress({ weight: Number(weight), bodyFatPercentage: bodyFat ? Number(bodyFat) : null });
    
    if (res.success && photo) {
      const formData = new FormData();
      formData.append('photo', photo);
      try {
        await api.post(`/progress/${res.data._id}/photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        getProgress(); // Refresh to get the photo URL
      } catch (err) {
        console.error("Failed to upload photo", err);
      }
    }
    
    setShowLogForm(false);
    setWeight(''); setBodyFat(''); setPhoto(null);
  };

  const getImageUrl = (path) => {
    return path ? `http://localhost:5000${path}` : null;
  };

  const photos = progressLogs.filter(log => log.photoUrl);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Body Progress</h1>
          <p className="text-gray-400">Track weight, measurements, and photos</p>
        </div>
        <button 
          onClick={() => setShowLogForm(!showLogForm)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Scale size={18} /> New Log
        </button>
      </div>

      {showLogForm && (
        <div className="glass-card p-6 isolate relative">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <h2 className="text-xl font-bold text-white mb-4">Record New Metrics</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                <input type="number" required step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Body Fat % (Optional)</label>
                <input type="number" step="0.1" value={bodyFat} onChange={e => setBodyFat(e.target.value)} className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Progress Photo</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-primary hover:bg-surface-light/30 transition-colors cursor-pointer relative">
                  <input type="file" onChange={e => setPhoto(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <Camera size={32} className={photo ? 'text-primary' : 'text-gray-500'} />
                    <p className="text-sm font-medium text-gray-300">{photo ? photo.name : 'Click or drag photo here'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right pt-4">
              <button type="submit" className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-2.5 rounded-xl font-bold shadow-lg">Save Progress Log</button>
            </div>
          </form>
        </div>
      )}

      {/* Photo Gallery Grid */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><Upload size={20} className="text-secondary" /> Transformation Logs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.slice(0, 4).map((log, idx) => (
              <div key={log._id} className="relative group overflow-hidden rounded-2xl glass-card aspect-[3/4]">
                <img 
                  src={getImageUrl(log.photoUrl)} 
                  alt="Progress" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <span className="text-white font-bold text-lg">{log.weight} kg</span>
                  <span className="text-gray-300 text-sm">{new Date(log.date).toLocaleDateString()}</span>
                </div>
                {idx === 0 && <div className="absolute top-3 right-3 bg-primary text-xs font-bold px-2 py-1 rounded text-white shadow-lg">LATEST</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-xl font-bold text-white">Metrics History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-surface text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Weight</th>
                <th className="px-6 py-4">Body Fat %</th>
                <th className="px-6 py-4">Change</th>
              </tr>
            </thead>
            <tbody>
              {progressLogs.map((log, idx) => {
                const prevLog = progressLogs[idx + 1];
                const diff = prevLog ? (log.weight - prevLog.weight).toFixed(1) : 0;
                const isLoss = diff < 0;
                
                return (
                  <tr key={log._id} className="border-b border-gray-700/50 hover:bg-surface-light/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{log.weight} kg</td>
                    <td className="px-6 py-4">{log.bodyFatPercentage ? `${log.bodyFatPercentage}%` : '-'}</td>
                    <td className={`px-6 py-4 font-medium ${diff == 0 ? 'text-gray-500' : isLoss ? 'text-green-500' : 'text-red-400'}`}>
                      {diff == 0 ? '-' : `${diff > 0 ? '+' : ''}${diff} kg`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ProgressTracker;
