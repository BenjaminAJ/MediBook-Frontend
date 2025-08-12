import React, { useState, useRef, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../services/Userapi";

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
  name: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  medicalInfo: {
    dateOfBirth: "",
    bloodType: "",
    allergies: [""],
    medicalHistory: [""],
  },
  providerInfo: {
    specialization: "",
    clinicName: "",
    licenseNumber: "",
  },
};

// D3 Loader Component
const D3Loader: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Dynamically import d3 to avoid SSR issues
    import("d3").then((d3) => {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();
      const width = 60,
        height = 60,
        r = 20;
      const arc = d3
        .arc()
        .innerRadius(r - 6)
        .outerRadius(r)
        .startAngle(0)
        .endAngle(Math.PI * 1.5);

      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .append("path")
        .attr("d", arc as any)
        .attr("fill", "#22c55e")
        .attr("opacity", 0.8)
        .attr("id", "d3-loader-arc");

      function animate() {
        svg
          .select("#d3-loader-arc")
          .transition()
          .duration(900)
          .attrTween("transform", () =>
            d3.interpolateString("rotate(0)", "rotate(360)")
          )
          .on("end", animate);
      }
      animate();
    });
  }, []);

  return <svg ref={ref} width={60} height={60} />;
};

const Profile: React.FC = () => {
  const [form, setForm] = useState<ProfileForm>(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace with actual user ID logic as needed
  const userId = localStorage.getItem("userId") || "1";

  // Fetch user profile on mount
  useEffect(() => {
    setFetching(true);
    setError(null);
    getUserProfile(userId)
      .then((res) => {
        // Map API response to form structure if needed
        setForm({
          name: res.data.name || "",
          phone: res.data.phone || "",
          address: {
            street: res.data.address?.street || "",
            city: res.data.address?.city || "",
            state: res.data.address?.state || "",
            postalCode: res.data.address?.postalCode || "",
            country: res.data.address?.country || "",
          },
          medicalInfo: {
            dateOfBirth: res.data.medicalInfo?.dateOfBirth || "",
            bloodType: res.data.medicalInfo?.bloodType || "",
            allergies: res.data.medicalInfo?.allergies?.length
              ? res.data.medicalInfo.allergies
              : [""],
            medicalHistory: res.data.medicalInfo?.medicalHistory?.length
              ? res.data.medicalInfo.medicalHistory
              : [""],
          },
          providerInfo: {
            specialization: res.data.providerInfo?.specialization || "",
            clinicName: res.data.providerInfo?.clinicName || "",
            licenseNumber: res.data.providerInfo?.licenseNumber || "",
          },
        });
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setFetching(false));
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      setForm((f) => ({
        ...f,
        address: { ...f.address, [name.replace("address.", "")]: value },
      }));
    } else if (name.startsWith("medicalInfo.")) {
      setForm((f) => ({
        ...f,
        medicalInfo: {
          ...f.medicalInfo,
          [name.replace("medicalInfo.", "")]: value,
        },
      }));
    } else if (name.startsWith("providerInfo.")) {
      setForm((f) => ({
        ...f,
        providerInfo: {
          ...f.providerInfo,
          [name.replace("providerInfo.", "")]: value,
        },
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleArrayChange = (
    section: "allergies" | "medicalHistory",
    idx: number,
    value: string
  ) => {
    setForm((f) => ({
      ...f,
      medicalInfo: {
        ...f.medicalInfo,
        [section]: f.medicalInfo[section].map((item, i) =>
          i === idx ? value : item
        ),
      },
    }));
  };

  const handleAddArrayItem = (section: "allergies" | "medicalHistory") => {
    setForm((f) => ({
      ...f,
      medicalInfo: {
        ...f.medicalInfo,
        [section]: [...f.medicalInfo[section], ""],
      },
    }));
  };

  const handleRemoveArrayItem = (
    section: "allergies" | "medicalHistory",
    idx: number
  ) => {
    setForm((f) => ({
      ...f,
      medicalInfo: {
        ...f.medicalInfo,
        [section]: f.medicalInfo[section].filter((_, i) => i !== idx),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    updateUserProfile(userId, form)
      .then(() => {
        setIsEditing(false);
        alert("Profile saved!");
      })
      .catch(() => setError("Failed to save profile."))
      .finally(() => setLoading(false));
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <D3Loader />
      </div>
    );
  }

  return (
    <div className="w-full">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <D3Loader />
        </div>
      )}
      {error && (
        <div className="mb-4 text-red-600 font-semibold text-center">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-green-700">
            Profile Management
          </h2>
          {!isEditing && (
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              required
              disabled={!isEditing}
            />
          </div>
        </div>
        {/* Address */}
        <h3 className="text-xl font-semibold mb-2 text-green-600">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Street
            </label>
            <input
              type="text"
              name="address.street"
              value={form.address.street}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              disabled={!isEditing}
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
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              name="address.state"
              value={form.address.state}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              name="address.postalCode"
              value={form.address.postalCode}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              name="address.country"
              value={form.address.country}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              disabled={!isEditing}
            />
          </div>
        </div>
        {/* Medical Info */}
        <h3 className="text-xl font-semibold mb-2 text-green-600">
          Medical Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="medicalInfo.dateOfBirth"
              value={form.medicalInfo.dateOfBirth}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Blood Type
            </label>
            <input
              type="text"
              name="medicalInfo.bloodType"
              value={form.medicalInfo.bloodType}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              disabled={!isEditing}
            />
          </div>
        </div>
        {/* Allergies */}
        <div className="mb-8">
          <label className="block mb-1 font-medium text-gray-700">
            Allergies
          </label>
          {form.medicalInfo.allergies.map((allergy, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="text"
                value={allergy}
                onChange={(e) =>
                  handleArrayChange("allergies", idx, e.target.value)
                }
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                placeholder="Allergy"
                disabled={!isEditing}
              />
              {form.medicalInfo.allergies.length > 1 && isEditing && (
                <button
                  type="button"
                  className="ml-2 text-red-500 font-bold"
                  onClick={() => handleRemoveArrayItem("allergies", idx)}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              type="button"
              className="mt-1 text-green-600 font-semibold"
              onClick={() => handleAddArrayItem("allergies")}
            >
              + Add Allergy
            </button>
          )}
        </div>
        {/* Medical History */}
        <div className="mb-8">
          <label className="block mb-1 font-medium text-gray-700">
            Medical History
          </label>
          {form.medicalInfo.medicalHistory.map((item, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange("medicalHistory", idx, e.target.value)
                }
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                placeholder="Medical History"
                disabled={!isEditing}
              />
              {form.medicalInfo.medicalHistory.length > 1 && isEditing && (
                <button
                  type="button"
                  className="ml-2 text-red-500 font-bold"
                  onClick={() => handleRemoveArrayItem("medicalHistory", idx)}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              type="button"
              className="mt-1 text-green-600 font-semibold"
              onClick={() => handleAddArrayItem("medicalHistory")}
            >
              + Add Medical History
            </button>
          )}
        </div>
        {/* Provider Info */}
        <h3 className="text-xl font-semibold mb-2 text-green-600">
          Provider Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Specialization
            </label>
            <input
              type="text"
              name="providerInfo.specialization"
              value={form.providerInfo.specialization}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Clinic Name
            </label>
            <input
              type="text"
              name="providerInfo.clinicName"
              value={form.providerInfo.clinicName}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              License Number
            </label>
            <input
              type="text"
              name="providerInfo.licenseNumber"
              value={form.providerInfo.licenseNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              disabled={!isEditing}
            />
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-lg font-bold hover:from-green-600 hover:to-green-800 transition"
              disabled={loading}
            >
              Save Profile
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
