import styles from "./Hotels.module.css";

import HotelCard from "../../components/Cards/Hotels/HotelCard";
import FilterForm from "../../components/Forms/FilterForm";
import SearchForm from "../../components/Forms/SearchForm";
import { useEffect, useState } from "react";
import { getHotels, Hotel } from "../../services/HotelService";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import { useLocation } from "react-router";

const Hotels = () => {
	const location = useLocation();

	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

	const [searchValue, setSearchValue] = useState("");
	const [formData, setFormData] = useState({
		amenities: [] as string[],
		accessibilityFeatures: [] as string[],
	});

	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	// Get initial search term from URL
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const search = params.get("search");
		if (search) {
			setSearchValue(search);
		}
	}, [location.search]);

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

	useEffect(() => {
		applyFiltersAndSearch();
	}, [formData, searchValue, hotels]);

	const applyFiltersAndSearch = () => {
		const query = searchValue.trim().toLowerCase();

		const results = hotels.filter((hotel) => {
			if (hotel.status !== "completed") return false;

			// Search match
			const nameMatch = hotel.name?.toLowerCase().includes(query);
			const locationMatch = hotel.location?.toLowerCase().includes(query);
			const matchesSearch = query === "" || nameMatch || locationMatch;

			// Amenities match
			const hotelAmenityIds =
				hotel.amenities?.map((a) => (typeof a === "string" ? a : a._id)) || [];
			const matchesAmenities = formData.amenities.every((amenityId) =>
				hotelAmenityIds.includes(amenityId)
			);

			// Accessibility match
			const hotelFeatureIds =
				hotel.accessibilityFeatures?.map((f) =>
					typeof f === "string" ? f : f._id
				) || [];
			const matchesAccessibility = formData.accessibilityFeatures.every(
				(featureId) => hotelFeatureIds.includes(featureId)
			);

			return matchesSearch && matchesAmenities && matchesAccessibility;
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
						applyFiltersAndSearch();
					}}
				/>
				<h1>Search hotels</h1>
				<div className={styles.content_flex}>
					<FilterForm formData={formData} onFilterChange={setFormData} />
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
						applyFiltersAndSearch();
					}}
				/>
				<h1>Search hotels</h1>
				<div className={styles.content_flex}>
					<FilterForm formData={formData} onFilterChange={setFormData} />
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
						applyFiltersAndSearch();
					}}
				/>
				<h1>Search hotels</h1>
				<div className={styles.content_flex}>
					<FilterForm formData={formData} onFilterChange={setFormData} />
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
