import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import các components
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import EmployeesPage from './pages/Admin/EmployeesPage/EmployeesPage';
import GuestsPage from './pages/Admin/GuestsPage/GuestsPage';
import RoomsManagementPage from './pages/Admin/RoomsManagementPage/RoomsManagementPage';
import RestaurantManagementPage from './pages/Admin/RestaurantManagementPage/RestaurantManagementPage';
import BookingsManagementPage from './pages/Admin/BookingsManagementPage/BookingsManagementPage';
import InvoicesManagementPage from './pages/Admin/InvoicesManagementPage/InvoicesManagementPage';
import SettingsPage from './pages/Admin/SettingsPage/SettingsPage';
import ReceptionistDashboard from './pages/Receptionist/ReceptionistDashboard/ReceptionistDashboard';
import CustomerDashboard from './pages/Customer/CustomerDashboard/CustomerDashboard';
import CustomerBooking from './pages/Customer/CustomerBooking/CustomerBooking';
import CustomerRooms from './pages/Customer/CustomerRooms/CustomerRooms';
import CustomerRestaurant from './pages/Customer/CustomerRestaurant/CustomerRestaurant';
import CustomerInvoice from './pages/Customer/CustomerInvoice/CustomerInvoice';
import CustomerProfile from './pages/Customer/CustomerProfile/CustomerProfile';
import BookingPage from './pages/BookingPage/BookingPage';
import CustomerPage from './pages/CustomersPage/CustomersPage';
import FoodAndBeveragePage from './pages/FoodAndBeveragePage/FoodAndBeveragePage';
import RoomstaffPage from './pages/RoomstaffPage/RoomstaffPage';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import GuestManagement from './pages/Receptionist/GuestManagement/GuestManagement';
import RoomManagement from './pages/Receptionist/RoomManagement/RoomManagement';
import RestaurantService from './pages/Receptionist/RestaurantService/RestaurantService';
import BookingManagement from './pages/Receptionist/BookingManagement/BookingManagement';
import InvoiceManagement from './pages/Receptionist/InvoiceManagement/InvoiceManagement';

// Định nghĩa routes
export const routes = [
    // Admin routes
    {
        path: '/admin/dashboard',
        page: AdminDashboard,
        roles: ['admin']
    },
    {
        path: '/admin/employees',
        page: EmployeesPage,
        roles: ['admin']
    },
    {
        path: '/admin/guests',
        page: GuestsPage,
        roles: ['admin']
    },
    {
        path: '/admin/rooms',
        page: RoomsManagementPage,
        roles: ['admin']
    },
    {
        path: '/admin/restaurant',
        page: RestaurantManagementPage,
        roles: ['admin']
    },
    {
        path: '/admin/bookings',
        page: BookingsManagementPage,
        roles: ['admin']
    },
    {
        path: '/admin/invoices',
        page: InvoicesManagementPage,
        roles: ['admin']
    },
    {
        path: '/admin/settings',
        page: SettingsPage,
        roles: ['admin']
    },
    {
        path: '/receptionist/dashboard',
        page: ReceptionistDashboard,
        roles: ['receptionist']
    },
    {
        path: '/customer/dashboard',
        page: CustomerDashboard,
        roles: ['customer']
    },
    {
        path: '/customer/booking',
        page: CustomerBooking,
        roles: ['customer']
    },
    {
        path: '/customer/rooms',
        page: CustomerRooms,
        roles: ['customer']
    },
    {
        path: '/customer/restaurant',
        page: CustomerRestaurant,
        roles: ['customer']
    },
    {
        path: '/customer/invoice',
        page: CustomerInvoice,
        roles: ['customer']
    },
    {
        path: '/customer/profile',
        page: CustomerProfile,
        roles: ['customer']
    },
    {
        path: '/booking',
        page: BookingPage,
        roles: ['admin', 'receptionist']
    },
    {
        path: '/food',
        page: FoodAndBeveragePage,
        roles: ['admin', 'receptionist', 'customer']
    },
    {
        path: '/customer',
        page: CustomerPage,
        roles: ['admin', 'receptionist']
    },
    {
        path: '/roomstaff',
        page: RoomstaffPage,
        roles: ['admin', 'receptionist']
    },
    {
        path: '/invoice',
        page: InvoiceManagement,
        roles: ['admin', 'receptionist']
    },
    {
        path: '/login',
        page: LoginPage,
        isPublic: true
    },
    {
        path: '/receptionist/guests',
        page: GuestManagement,
        roles: ['receptionist']
    },
    {
        path: '/receptionist/rooms',
        page: RoomManagement,
        roles: ['receptionist']
    },
    {
        path: '/receptionist/restaurant',
        page: RestaurantService,
        roles: ['receptionist']
    },
    {
        path: '/receptionist/bookings',
        page: BookingManagement,
        roles: ['receptionist']
    },
    {
        path: '/receptionist/invoices',
        page: InvoiceManagement,
        roles: ['receptionist']
    },
    {
        path: '*',
        page: NotFoundPage
    }
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
