import { useEffect, useState } from "react";
import AddStart from "../../components/Forms/AddHotel/AddStart";
import AddHotelInfo from "../../components/Forms/AddHotel/AddHotelInfo";
import AddRooms from "../../components/Forms/AddHotel/AddRooms";
import AddPhotos from "../../components/Forms/AddHotel/AddPhotos";
import AddHotelOverview from "../../components/Forms/AddHotel/AddHotelOverview";
import { useAuth } from "../../contexts/AuthContext";
import useStores from "../../hooks/useStores";
import { useNavigate } from "react-router";
import ROUTES from "../../consts/Routes";
import { API } from "../../services/ApiService";
import { AxiosError, AxiosResponse } from "axios";
import { createHotel, updateHotel } from "../../services/HotelService";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import { Amenity } from "../../services/AmenityService";
import { AccessibilityFeature } from "../../services/AccessibilityFeatureService";
import SuccessMessage from "../../components/Forms/Partials/SuccessMessage";

const AddHotel = () => {
	const navigate = useNavigate();

	const [step, setStep] = useState<number>(1);
	const [hotelId, setHotelId] = useState<string>("");
	const [hotelName, setHotelName] = useState<string>("");

	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();
	const [isSuccess, setIsSucces] = useState<Boolean>(false);
	const [startErrorMessage, setStartErrorMessage] = useState<string | null>(
		null
	);

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

	const goToNext = () => {
		const newStep = step + 1;
		setStep(newStep);
	};

	const goToPrevious = () => {
		const newStep = step - 1;
		setStep(newStep);
	};

	const handleFirstSubmit = (submittedHotelName: string) => {
		if (!UiStore.currentUser) {
			return;
		}
		setHotelName(submittedHotelName);

		// Type hotelBody to send with API call
		const hotelBody = {
			name: submittedHotelName,
			status: "new",
			amenities: [],
			accessibilityFeatures: [],
			userId: UiStore.currentUser,
		};

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

		setIsLoading(true);
		createHotel(hotelBody)
			.then((response) => {
				setHotelId(response.data._id);
				setIsLoading(false);
				goToNext();
			})
			.catch((error) => {
				const message =
					error.response?.data?.message ||
					"An error occurred while adding the hotel.";

				// Check for duplicate key error (MongoDB example)
				if (
					error.response?.status === 409 ||
					message.toLowerCase().includes("duplicate")
				) {
					setStartErrorMessage(
						"It seems like someone already added this hotel. If you're sure that's not the case, try adding something extra to the hotel name (like the city)."
					);
				} else {
					setStartErrorMessage(message);
				}

				setIsLoading(false);
			});
	};

	const handleSubmit = (
		location: string,
		contactEmail: string,
		contactPhone: string,
		website: string,
		accessibilityInfo: string,
		amenities: Amenity[],
		accessibilityFeatures: AccessibilityFeature[]
	) => {
		if (!UiStore.currentUser) {
			return;
		}
		//Type hotelBody to send with API call
		const hotelBody = {
			name: hotelName,
			location: location,
			contactEmail: contactEmail,
			contactPhone: contactPhone,
			website: website,
			accessibilityInfo: accessibilityInfo,
			status: "new",
			amenities: amenities,
			accessibilityFeatures: accessibilityFeatures,
			userId: UiStore.currentUser,
		};

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

		setIsLoading(true);
		updateHotel(hotelId, hotelBody)
			.then(() => {
				setIsLoading(false);
				goToNext();
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	const handleFinalSubmit = (
		hotelName: string,
		location: string,
		contactEmail: string,
		contactPhone: string,
		website: string,
		accessibilityInfo: string,
		amenities: Amenity[],
		accessibilityFeatures: AccessibilityFeature[]
	) => {
		if (!UiStore.currentUser) {
			return;
		}
		//Type hotelBody to send with API call
		const hotelBody = {
			name: hotelName,
			location: location,
			contactEmail: contactEmail,
			contactPhone: contactPhone,
			website: website,
			accessibilityInfo: accessibilityInfo,
			status: "completed",
			amenities: amenities,
			accessibilityFeatures: accessibilityFeatures,
			userId: UiStore.currentUser,
		};

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

		setIsLoading(true);
		updateHotel(hotelId, hotelBody)
			.then(() => {
				setIsSucces(true);
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	if (isLoading)
		return (
			<main id="main" className="main">
				<title>Add hotel | Wheelable Hotels</title>

				<Loading />
			</main>
		);
	else if (isSuccess)
		return (
			<main id="main" className="main">
				<title>Add hotel | Wheelable Hotels</title>

				<SuccessMessage message="Hotel added successfully. Thank you for helping us make travelling more accessible!" />
			</main>
		);
	else if (error)
		return (
			<main id="main" className="main">
				<title>Add hotel | Wheelable Hotels</title>

				<Error message={error.message} />
			</main>
		);
	else if (step === 1)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddStart
					goToNext={handleFirstSubmit}
					errorMessage={startErrorMessage || undefined}
				/>
			</main>
		);
	else if (step === 2)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddHotelInfo goToNext={handleSubmit} goToPrevious={goToPrevious} />
			</main>
		);
	else if (step === 3)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddRooms
					goToNext={goToNext}
					goToPrevious={goToPrevious}
					hotelId={hotelId}
				/>
			</main>
		);
	else if (step === 4)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddPhotos
					goToNext={goToNext}
					goToPrevious={goToPrevious}
					hotelId={hotelId}
				/>
			</main>
		);
	else if (step === 5)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddHotelOverview
					hotelId={hotelId}
					goToPrevious={goToPrevious}
					handleAddHotel={handleFinalSubmit}
				/>
			</main>
		);
	else
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>
				<h1>Add hotel</h1>
				<p>Something went wrong, try again.</p>
			</main>
		);
};

export default AddHotel;
