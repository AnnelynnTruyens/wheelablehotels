import { useEffect, useState } from "react";
import styles from "./Favourites.module.css";
import {
	Favourite,
	getFavouritesByUser,
} from "../../../services/FavouriteService";
import { getHotelById, Hotel } from "../../../services/HotelService";
import useStores from "../../../hooks/useStores";
import { useAuth } from "../../../contexts/AuthContext";
import { API } from "../../../services/ApiService";
import { AxiosError, AxiosResponse } from "axios";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import HotelHighlight from "../../../components/Cards/Hotels/HotelHighlight";
import NoResults from "../../../components/NoResults/NoResults";

// Type favourite with hotel
interface FavouriteWithHotel extends Favourite {
	hotel?: Hotel;
}

const Favourites = () => {
	const [favourites, setFavourites] = useState<FavouriteWithHotel[] | null>(
		null
	);
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
		};

		waitForUser();
	}, [UiStore]);

	useEffect(() => {
		if (token) {
			// Set authorization header for API
			API.interceptors.request.use((config) => {
				config.headers["Authorization"] = `Bearer ${token}`;
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

			// Get favourites by user with hotel data
			setIsLoading(true);
			getFavouritesByUser()
				.then(async ({ data }) => {
					const favouritesWithHotel: FavouriteWithHotel[] = await Promise.all(
						data.map(async (favourite: Favourite) => {
							if (favourite.userId) {
								try {
									const hotelResponse = await getHotelById(favourite.hotelId);
									return { ...favourite, hotel: hotelResponse.data };
								} catch (error) {
									console.error("Error fetching hotel details", error);
									return favourite;
								}
							} else {
								return favourite;
							}
						})
					);
					setFavourites(favouritesWithHotel);
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
		}
	}, [token, logout]);

	if (isLoading)
		return (
			<main id="main">
				<title>Favourites | Wheelable Hotels</title>
				<h1>Favourites</h1>
				<Loading />
			</main>
		);
	else if (error)
		return (
			<main id="main">
				<title>Favourites | Wheelable Hotels</title>
				<h1>Favourites</h1>
				<Error message={error.message} />
			</main>
		);
	return (
		<main id="main" className="main">
			<title>Favourites | Wheelable Hotels</title>
			<h1>Favourites</h1>
			<div className={styles.favourites}>
				{favourites && favourites.length > 0 ? (
					favourites.map((favourite: Favourite) => {
						return (
							<HotelHighlight
								key={`favourite_${favourite.hotelId}`}
								hotelName={favourite.hotel?.name}
								hotelId={favourite.hotelId}
								location={favourite.hotel?.location}
								rating={favourite.hotel?.rating}
							/>
						);
					})
				) : (
					<NoResults insert="favourites" />
				)}
			</div>
		</main>
	);
};

export default Favourites;
