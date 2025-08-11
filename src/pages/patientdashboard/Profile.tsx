import React, { useState } from 'react';

type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type MedicalInfo = {
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
};

type ProviderInfo = {
  specialization: string;
  clinicName: string;
  licenseNumber: string;
};

type ProfileForm = {
  name: string;
  phone: string;
  address: Address;
  medicalInfo: MedicalInfo;
  providerInfo: ProviderInfo;
};

const initialState: ProfileForm = {
  name: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  medicalInfo: {
    dateOfBirth: '',
    bloodType: '',
    allergies: [''],
    medicalHistory: [''],
  },
  providerInfo: {
    specialization: '',
    clinicName: '',
    licenseNumber: '',
  },
};

const Profile: React.FC = () => {
  const [form, setForm] = useState<ProfileForm>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      setForm(f => ({
        ...f,
        address: { ...f.address, [name.replace('address.', '')]: value },
      }));
    } else if (name.startsWith('medicalInfo.')) {
      setForm(f => ({
        ...f,
        medicalInfo: { ...f.medicalInfo, [name.replace('medicalInfo.', '')]: value },
      }));
    } else if (name.startsWith('providerInfo.')) {
      setForm(f => ({
        ...f,
        providerInfo: { ...f.providerInfo, [name.replace('providerInfo.', '')]: value },
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleArrayChange = (
    section: 'allergies' | 'medicalHistory',
    idx: number,
    value: string
  ) => {
    setForm(f => ({
      ...f,
      medicalInfo: {
        ...f.medicalInfo,
        [section]: f.medicalInfo[section].map((item, i) => (i === idx ? value : item)),
      },
    }));
  };

  const handleAddArrayItem = (section: 'allergies' | 'medicalHistory') => {
    setForm(f => ({
      ...f,
      medicalInfo: {
        ...f.medicalInfo,
        [section]: [...f.medicalInfo[section], ''],
      },
    }));
  };

  const handleRemoveArrayItem = (section: 'allergies' | 'medicalHistory', idx: number) => {
    setForm(f => ({
      ...f,
      medicalInfo: {
        ...f.medicalInfo,
        [section]: f.medicalInfo[section].filter((_, i) => i !== idx),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save logic
    alert('Profile saved!');
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-8 text-green-700">Profile Management</h2>
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              required
            />
          </div>
        </div>
        {/* Address */}
        <h3 className="text-xl font-semibold mb-2 text-green-600">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Street</label>
            <input
              type="text"
              name="address.street"
              value={form.address.street}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">City</label>
            <input
              type="text"
              name="address.city"
              value={form.address.city}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">State</label>
            <input
              type="text"
              name="address.state"
              value={form.address.state}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              name="address.postalCode"
              value={form.address.postalCode}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="address.country"
              value={form.address.country}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
        </div>
        {/* Medical Info */}
        <h3 className="text-xl font-semibold mb-2 text-green-600">Medical Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="medicalInfo.dateOfBirth"
              value={form.medicalInfo.dateOfBirth}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Blood Type</label>
            <input
              type="text"
              name="medicalInfo.bloodType"
              value={form.medicalInfo.bloodType}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
        </div>
        {/* Allergies */}
        <div className="mb-8">
          <label className="block mb-1 font-medium text-gray-700">Allergies</label>
          {form.medicalInfo.allergies.map((allergy, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="text"
                value={allergy}
                onChange={e => handleArrayChange('allergies', idx, e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                placeholder="Allergy"
              />
              {form.medicalInfo.allergies.length > 1 && (
                <button
                  type="button"
                  className="ml-2 text-red-500 font-bold"
                  onClick={() => handleRemoveArrayItem('allergies', idx)}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-1 text-green-600 font-semibold"
            onClick={() => handleAddArrayItem('allergies')}
          >
            + Add Allergy
          </button>
        </div>
        {/* Medical History */}
        <div className="mb-8">
          <label className="block mb-1 font-medium text-gray-700">Medical History</label>
          {form.medicalInfo.medicalHistory.map((item, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="text"
                value={item}
                onChange={e => handleArrayChange('medicalHistory', idx, e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                placeholder="Medical History"
              />
              {form.medicalInfo.medicalHistory.length > 1 && (
                <button
                  type="button"
                  className="ml-2 text-red-500 font-bold"
                  onClick={() => handleRemoveArrayItem('medicalHistory', idx)}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-1 text-green-600 font-semibold"
            onClick={() => handleAddArrayItem('medicalHistory')}
          >
            + Add Medical History
          </button>
        </div>
        {/* Provider Info */}
        <h3 className="text-xl font-semibold mb-2 text-green-600">Provider Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Specialization</label>
            <input
              type="text"
              name="providerInfo.specialization"
              value={form.providerInfo.specialization}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Clinic Name</label>
            <input
              type="text"
              name="providerInfo.clinicName"
              value={form.providerInfo.clinicName}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">License Number</label>
            <input
              type="text"
              name="providerInfo.licenseNumber"
              value={form.providerInfo.licenseNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-lg font-bold hover:from-green-600 hover:to-green-800 transition"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
