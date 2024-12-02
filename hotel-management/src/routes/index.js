import GuestPage from "../pages/GuestPage/GuestPage";
import HomePage from "../pages/HomePage/HomePage";
import InvoicePage from "../pages/InvoicePage/InvoicePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import RoomPage from "../pages/RoomPage/RoomPage";
import ServicePage from "../pages/ServicePage/ServicePage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/rooms',
        page: RoomPage,
        isShowHeader: true
    },
    {
        path: '/guest',
        page: GuestPage,
        isShowHeader: true
    },
    {
        path: '/service',
        page: ServicePage,
        isShowHeader: true
    },
    {
        path: '/invoice',
        page: InvoicePage,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage
    }
]