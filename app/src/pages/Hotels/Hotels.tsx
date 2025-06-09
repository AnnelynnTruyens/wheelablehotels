import styles from "./Hotels.module.css";

import HotelCard from "../../components/Cards/Hotels/HotelCard";
import FilterForm from "../../components/Forms/FilterForm";
import SearchForm from "../../components/Forms/SearchForm";
import { useEffect, useState } from "react";
import { getHotels, Hotel } from "../../services/HotelService";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

const Hotels = () => {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

	const [searchValue, setSearchValue] = useState("");

	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	useEffect(() => {
		getHotels()
			.then((response) => {
				setHotels(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		if (hotels.length > 0) {
			const completedHotels = hotels.filter(
				(hotel) => hotel.status === "completed"
			);
			setFilteredHotels(completedHotels);
		}
	}, [hotels]);

	const handleSearchSubmit = () => {
		const query = searchValue.trim().toLowerCase();

		const results = hotels.filter((hotel) => {
			const name = hotel.name?.toLowerCase() || "";
			const location = hotel.location?.toLowerCase() || "";
			return (
				hotel.status === "completed" &&
				(name.includes(query) || location.includes(query))
			);
		});

		setFilteredHotels(results);
	};

	if (isLoading)
		return (
			<main id="main" className={styles.main}>
				<title>Hotels | Wheelable Hotels</title>
				<SearchForm
					searchValue={searchValue}
					onSearchChange={setSearchValue}
					onSearchSubmit={(e) => {
						e.preventDefault();
						handleSearchSubmit();
					}}
				/>
				<h1>Search hotels</h1>
				<div className={styles.content_flex}>
					<FilterForm />
					<Loading />
				</div>
			</main>
		);
	else if (error)
		return (
			<main id="main" className={styles.main}>
				<title>Hotels | Wheelable Hotels</title>
				<SearchForm
					searchValue={searchValue}
					onSearchChange={setSearchValue}
					onSearchSubmit={(e) => {
						e.preventDefault();
						handleSearchSubmit();
					}}
				/>
				<h1>Search hotels</h1>
				<div className={styles.content_flex}>
					<FilterForm />
					<Error message={error.message} />
				</div>
			</main>
		);
	else
		return (
			<main id="main" className={styles.main}>
				<title>Hotels | Wheelable Hotels</title>
				<SearchForm
					searchValue={searchValue}
					onSearchChange={setSearchValue}
					onSearchSubmit={(e) => {
						e.preventDefault();
						handleSearchSubmit();
					}}
				/>
				<h1>Search hotels</h1>
				<div className={styles.content_flex}>
					<FilterForm />
					<div className={styles.hotels}>
						{filteredHotels && filteredHotels.length > 0 ? (
							filteredHotels.map((hotel) => {
								return (
									<HotelCard
										key={`hotel_${hotel._id}`}
										hotelName={hotel.name}
										hotelId={hotel._id}
										location={hotel.location}
										accessibilityFeatures={hotel.accessibilityFeatures}
									/>
								);
							})
						) : (
							<p>No hotels found</p>
						)}
					</div>
				</div>
			</main>
		);
};

export default Hotels;
