import { Link, useNavigate } from "react-router";
import styles from "./UserDashboard.module.css";
import useStores from "../../../hooks/useStores";
import { useEffect, useState } from "react";
import ROUTES from "../../../consts/Routes";
import Loading from "../../../components/Loading/Loading";
import { useAuth } from "../../../contexts/AuthContext";
import { getHotelsByUser, Hotel } from "../../../services/HotelService";
import NoResults from "../../../components/NoResults/NoResults";
import HotelHighlight from "../../../components/Cards/Hotels/HotelHighlight";
import Error from "../../../components/Error/Error";

const UserDashboard = () => {
	const navigate = useNavigate();

	const [hotels, setHotels] = useState<Hotel[]>([]);

	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuth();
	const { UiStore } = useStores();

	// Wait for currentUser to be set
	useEffect(() => {
		const waitForUser = async () => {
			if (!UiStore.currentUser) {
				await new Promise<void>((resolve) => {
					const interval = setInterval(() => {
						if (UiStore.currentUser) {
							clearInterval(interval);
							resolve();
						}
					}, 100);
				});
			}
			setIsLoading(false);

			if (!UiStore.currentUser) {
				navigate(ROUTES.home);
			}
		};

		waitForUser();
	}, [UiStore, navigate]);

	useEffect(() => {
		if (!token) {
			return;
		}
		const userId = UiStore.currentUser?._id;
		getHotelsByUser({ userId })
			.then((response) => {
				setHotels(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	}, [token, logout]);

	// Logout function
	const handleLogout = () => {
		logout();
	};

	if (isLoading)
		return (
			<main id="main" className="main">
				<title>Dashboard | Wheelable Hotels</title>

				<Loading />
			</main>
		);
	else if (error)
		return (
			<main id="main" className="main">
				<title>Dashboard | Wheelable Hotels</title>

				<Error message={error.message} />
			</main>
		);
	else
		return (
			<main id="main" className="main">
				<title>Dashboard | Wheelable Hotels</title>
				<div className={styles.top}>
					<h1>Welcome {UiStore.currentUser?.username}!</h1>
					<button onClick={handleLogout}>Log out</button>
				</div>
				<h2>My added hotels</h2>
				<div className={styles.hotels}>
					{hotels && hotels.length > 0 ? (
						hotels.map((hotel: Hotel) => {
							return (
								<HotelHighlight
									key={`hotel_${hotel._id}`}
									hotelName={hotel.name}
									hotelId={hotel._id}
									location={hotel.location}
									rating={hotel.rating}
								/>
							);
						})
					) : (
						<NoResults insert="hotels" />
					)}
				</div>
				<Link to={ROUTES.addHotel} className="button">
					Add a new hotel
				</Link>
			</main>
		);
};

export default UserDashboard;
