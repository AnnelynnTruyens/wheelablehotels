import { Route, Routes } from "react-router";
import ROUTES from "../../consts/Routes";

import Home from "../Home/Home";
import Hotels from "../Hotels/Hotels";
import HotelDetail from "../Hotels/HotelDetail";
import Login from "../User/Login/Login";
import Register from "../User/Register/Register";
import Profile from "../User/Profile.tsx/Profile";
import Favourites from "../User/Favourites/Favourites";
import UserDashboard from "../User/UserDashboard/UserDashboard";
import AddHotel from "../Hotels/AddHotel";
import AdminDashboard from "../Admin/AdminDashboard/AdminDashboard";
import AdminHotels from "../Admin/AdminHotels/AdminHotels";
import AdminUsers from "../Admin/AdminUsers/AdminUsers";
import Contact from "../General/Contact/Contact";
import Accessibility from "../General/Accessibility/Accessibility";
import Privacy from "../General/Privacy/Privacy";
import NotFound from "../General/NotFound/NotFound";

const Authentication = () => {
	return (
		<Routes>
			<Route path={ROUTES.home} element={<Home />} />
			<Route path={ROUTES.hotelOverview} element={<Hotels />} />
			<Route path={ROUTES.hotelDetail.path} element={<HotelDetail />} />
			<Route path={ROUTES.login} element={<Login />} />
			<Route path={ROUTES.register} element={<Register />} />

			<Route path={ROUTES.userDashboard} element={<UserDashboard />} />
			<Route path={ROUTES.favourites} element={<Favourites />} />

			<Route path={ROUTES.userProfile.path} element={<Profile />} />

			<Route path={ROUTES.addHotel} element={<AddHotel />} />

			<Route path={ROUTES.adminDashboard} element={<AdminDashboard />} />
			<Route path={ROUTES.adminHotels} element={<AdminHotels />} />
			<Route path={ROUTES.adminUsers} element={<AdminUsers />} />

			<Route path={ROUTES.contact} element={<Contact />} />
			<Route path={ROUTES.accessibility} element={<Accessibility />} />
			<Route path={ROUTES.privacy} element={<Privacy />} />

			<Route path={ROUTES.notFound} element={<NotFound />} />
		</Routes>
	);
};

export default Authentication;
