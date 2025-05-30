import { ReactNode, useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import useStores from "../hooks/useStores";
import { API } from "../services/ApiService";
import { AxiosError, AxiosResponse } from "axios";
import { getCurrentUser } from "../services/AuthService";
import ROUTES from "../consts/Routes";
import Loading from "../components/Loading/Loading";
import Error from "../components/Error/Error";
import Header from "../components/Header/Header";
import Login from "../pages/User/Login/Login";
import Register from "../pages/User/Register/Register";
import Home from "../pages/Home/Home";
import Hotels from "../pages/Hotels/Hotels";
import HotelDetail from "../pages/Hotels/HotelDetail";
import Contact from "../pages/General/Contact/Contact";
import Accessibility from "../pages/General/Accessibility/Accessibility";
import Privacy from "../pages/General/Privacy/Privacy";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth

// Define key for saving token in localStorage
const key = "AUTH_TOKEN";

interface AuthContainerProps {
	children: ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
	const { token, onLogin, logout } = useAuth(); // Access onLogin and logout from context
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	// Import UiStore to save current user
	const { UiStore } = useStores();

	// useEffect to save changes to token in localStorage
	useEffect(() => {
		if (token) {
			localStorage.setItem(key, token);
		} else {
			localStorage.removeItem(key);
		}
	}, [token]);

	// Set authorization header for API and get current user
	useEffect(() => {
		if (token) {
			setIsLoading(true);
			API.interceptors.request.use((config) => {
				if (token) {
					config.headers["Authorization"] = `Bearer ${token}`;
				}
				return config;
			});

			API.interceptors.response.use(
				(response: AxiosResponse) => response,
				(error: AxiosError) => {
					if (error.response?.status === 401) {
						logout();
					}
					return Promise.reject(error);
				}
			);

			getCurrentUser()
				.then(({ data }) => {
					UiStore.setCurrentUser(data);
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
		}
	}, [token, UiStore, logout]);

	if (isLoading) return <Loading />;
	else if (error) return <Error message={error.message} />;
	else
		return (
			<>
				{token ? (
					children
				) : (
					<>
						<Header />
						<Routes>
							<Route path={ROUTES.home} element={<Home onLogin={onLogin} />} />
							<Route path={ROUTES.hotelOverview} element={<Hotels />} />
							<Route path={ROUTES.hotelDetail.path} element={<HotelDetail />} />
							<Route path={ROUTES.contact} element={<Contact />} />
							<Route path={ROUTES.accessibility} element={<Accessibility />} />
							<Route path={ROUTES.privacy} element={<Privacy />} />

							<Route
								path={ROUTES.login}
								element={<Login onLogin={onLogin} />}
							/>
							<Route
								path={ROUTES.register}
								element={<Register onLogin={onLogin} />}
							/>

							<Route
								path={ROUTES.addHotel}
								element={<Login onLogin={onLogin} />}
							/>

							<Route
								path={ROUTES.notFound}
								element={<Login onLogin={onLogin} />}
							/>
						</Routes>
						<Footer />
					</>
				)}
			</>
		);
};

export default AuthContainer;
