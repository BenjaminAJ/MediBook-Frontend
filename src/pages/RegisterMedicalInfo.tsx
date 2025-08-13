import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import D3Message from '../components/D3Message';
import { updateUserProfile } from '../services/Userapi';
import { useAuth } from '../context/AuthContext'; 

const RegisterMedicalInfo: React.FC = () => {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user || !user.id) {
        setMessage({ type: 'error', text: 'User not authenticated. Please log in.' });
        setLoading(false);
        return;
      }

      const medicalInfo = {
        dateOfBirth,
        bloodType,
        allergies: allergies.split(',').map(s => s.trim()).filter(s => s),
        medicalHistory: medicalHistory.split(',').map(s => s.trim()).filter(s => s),
      };
      
      // Construct the data payload as per the backend API documentation
      const dataToSend = {
        medicalInfo: medicalInfo,
      };

      await updateUserProfile(user.id, dataToSend);
      
      setMessage({ type: 'success', text: 'Medical information saved successfully!' });
      setTimeout(() => {
        navigate('/Dashboard');
      }, 1000);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to save medical information.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/Dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-200">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl">
        {/* Illustration / Side Panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-green-400 to-green-600 p-10 w-1/2">
          <img
            src="/MediBook.png"
            alt="MediBook Logo"
            className="w-24 h-24 mb-4 drop-shadow-lg"
          />
          <h2 className="text-3xl font-bold text-white mb-2">
            Almost There!
          </h2>
          <p className="text-green-50 text-lg text-center">
            Please provide your medical information to complete your profile.
          </p>
        </div>
        {/* Form Panel */}
        <div className="flex-1 p-8 md:p-12">
          <div className="mb-8 text-center md:hidden">
            <img
              src="/MediBook.png"
              alt="MediBook Logo"
              className="w-16 h-16 mx-auto mb-2"
            />
            <h2 className="text-2xl font-bold text-green-700 mb-1">
              Medical Information
            </h2>
            <p className="text-gray-500">
              Help us serve you better by providing some medical details.
            </p>
          </div>
          {message && (
            <D3Message
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Blood Type
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={bloodType}
                onChange={e => setBloodType(e.target.value)}
                placeholder="e.g., A+, O-"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Allergies (comma-separated)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
                placeholder="e.g., Penicillin, Peanuts"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Medical History (comma-separated)
              </label>
              <textarea
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                value={medicalHistory}
                onChange={e => setMedicalHistory(e.target.value)}
                placeholder="e.g., Asthma, Diabetes"
                rows={3}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Medical Info'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-gray-600 font-medium hover:underline"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterMedicalInfo;
