import BookingPage from "../pages/BookingPage/BookingPage";
import CustomerPage from "../pages/CustomersPage/CustomersPage";
import FoodAndBeveragePage from "../pages/FoodAndBeveragePage/FoodAndBeveragePage";
import GuestPage from "../pages/GuestPage/GuestPage";
import HomePage from "../pages/HomePage/HomePage";
import InvoicePage from "../pages/InvoicePage/InvoicePage";
import InvoiceStaffPage from "../pages/InvoiceStaffPage/InvoiceStaffPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import RoomPage from "../pages/RoomPage/RoomPage";
import RoomstaffPage from "../pages/RoomstaffPage/RoomstaffPage";
import ServicePage from "../pages/ServicePage/ServicePage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    // {
    //     path: '/rooms',
    //     page: RoomPage,
    //     isShowHeader: true
    // },
    // {
    //     path: '/guest',
    //     page: GuestPage,
    //     isShowHeader: true
    // },
    // {
    //     path: '/service',
    //     page: ServicePage,
    //     isShowHeader: true
    // },
    // {
    //     path: '/invoice',
    //     page: InvoicePage,
    //     isShowHeader: true
    // },
    {
        path: '/booking',
        page: BookingPage,
        isShowHeader: true
    },
    {
        path: '/food',
        page: FoodAndBeveragePage,
        isShowHeader: true
    },
    {
        path: '/customer',
        page: CustomerPage,
        isShowHeader: true
    },
    {
        path: '/roomstaff',
        page: RoomstaffPage,
        isShowHeader: true
    },
    {
        path: '/invoicestaff',
        page: InvoiceStaffPage,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage
    }
]