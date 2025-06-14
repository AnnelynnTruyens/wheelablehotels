import { useLocation } from "react-router";
import styles from "./Profile.module.css";
import { useEffect, useState } from "react";
import { getHotelsByUser, Hotel } from "../../../services/HotelService";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import HotelHighlight from "../../../components/Cards/Hotels/HotelHighlight";
import NoResults from "../../../components/NoResults/NoResults";
import GoBack from "../../../components/Buttons/GoBack";

const Profile = () => {
	const location = useLocation();
	const userId = location.state.userId;
	const username = location.state.username;

	const [hotels, setHotels] = useState<Hotel[]>([]);

	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	useEffect(() => {
		getHotelsByUser({ userId })
			.then((response) => {
				setHotels(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	}, [userId]);

	if (isLoading)
		return (
			<main id="main" className="main">
				<title>Profile | Wheelable Hotels</title>
				<h1>{username}</h1>
				<Loading />
			</main>
		);
	else if (error)
		return (
			<main id="main" className="main">
				<title>Profile | Wheelable Hotels</title>
				<h1>{username}</h1>
				<Error message={error.message} />
			</main>
		);
	else
		return (
			<main id="main" className="main">
				<title>Profile | Wheelable Hotels</title>
				<GoBack text="Go back" />
				<h1>Hotels added by {username}</h1>
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
			</main>
		);
};

export default Profile;
