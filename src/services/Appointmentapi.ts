import api from './api';

// Types
export type Appointment = {
  id?: number;
  date: string;
  time: string;
  doctor: string;
  reason: string;
  patientId?: string;
  providerId?: string;
  status?: string;
};

// Create a new appointment
export const createAppointment = (data: Omit<Appointment, 'id'>) => {
  return api.post('/appointments', data);
};

// Get appointment by ID
export const getAppointmentById = (id: number | string) => {
  return api.get(`/appointments/${id}`);
};

// Update appointment
export const updateAppointment = (id: number | string, data: Partial<Appointment>) => {
  return api.put(`/appointments/${id}`, data);
};

// Cancel (delete) appointment
export const cancelAppointment = (id: number | string) => {
  return api.delete(`/appointments/${id}`);
};

// Get provider's appointments
export const getProviderAppointments = (providerId: string | number) => {
  return api.get(`/appointments/provider/${providerId}`);
};

// Get patient's appointments
export const getPatientAppointments = (patientId: string | number) => {
  return api.get(`/appointments/patient/${patientId}`);
};

// Get authenticated user's appointments
export const getMyAppointments = () => {
  return api.get(`/appointments/my-appointments`);
};
