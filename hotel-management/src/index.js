import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import các components
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard/ReceptionistDashboard';
import CustomerDashboard from './pages/CustomerDashboard/CustomerDashboard';
import BookingPage from './pages/BookingPage/BookingPage';
import CustomerPage from './pages/CustomersPage/CustomersPage';
import FoodAndBeveragePage from './pages/FoodAndBeveragePage/FoodAndBeveragePage';
import RoomstaffPage from './pages/RoomstaffPage/RoomstaffPage';
import InvoiceStaffPage from './pages/InvoiceStaffPage/InvoiceStaffPage';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

// Định nghĩa routes
export const routes = [
    {
        path: '/admin/dashboard',
        page: AdminDashboard,
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
        path: '/invoicestaff',
        page: InvoiceStaffPage,
        roles: ['admin', 'receptionist']
    },
    {
        path: '/login',
        page: LoginPage,
        isPublic: true
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
