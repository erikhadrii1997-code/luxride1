export type UserType = 'rider' | 'driver';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  phone?: string;
  createdAt: string;
}

export interface DriverProfile {
  driverId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  photo?: string;
  personalInfo?: PersonalInfo;
  vehicleInfo?: VehicleInfo;
  bio?: string;
  updatedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  address?: string;
  emergencyContact?: string;
}

export interface VehicleInfo {
  make: string;
  licensePlate: string;
  color: string;
  year: string;
  capacity: string;
  vin?: string;
}

export type VehicleType = 'standard' | 'premium' | 'luxury' | 'xl';

export interface Vehicle {
  type: VehicleType;
  name: string;
  ratePerKm: number;
  capacity: number;
  image: string;
}

export interface Booking {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  datetime: string;
  vehicleType: VehicleType;
  vehicleName: string;
  price: number;
  status: BookingStatus;
  riderId?: string;
  driverId?: string;
  driver?: string;
  distance?: number;
  duration?: number;
  timestamp: string;
  paymentId?: string;
  archived?: boolean;
}

export type BookingStatus = 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  route: string;
  date: string;
  type: string;
  price: number;
  status: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  booking?: Booking;
}

export interface EarningsData {
  month: string;
  earnings: number;
  rides: number;
}

export interface ScheduleSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  riderName: string;
  date: string;
}

