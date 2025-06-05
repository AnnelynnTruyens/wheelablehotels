import { useEffect, useState } from "react";
import styles from "../Forms.module.css";
import Progress from "./Partials/Progress";
import FormInput from "../Partials/FormInput";
import FormTextarea from "../Partials/FormTextarea";
import FormCheckbox from "../Partials/FormCheckbox";
import AddRoom from "./Partials/AddRoom";
import FormFileInput from "../Partials/FormFileInput";
import { getHotelById } from "../../../services/HotelService";
import Loading from "../../Loading/Loading";
import Error from "../../Error/Error";

interface AddHotelOverviewProps {
	hotelId: string;
	goToPrevious: () => void; // Callback to handle goint to previous step
	handleAddHotel: (
		name: string,
		location: string,
		contactEmail: string,
		contactPhone: string,
		accessibilityInfo: string
	) => void; // Callback to handle submitting the form
}

const AddHotelOverview: React.FC<AddHotelOverviewProps> = ({
	hotelId,
	goToPrevious,
	handleAddHotel,
}) => {
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	// State to manage the list of rooms
	const [roomIds, setRoomIds] = useState<number[]>([0]); // Start with one room
	const [roomDataList, setRoomDataList] = useState<any[]>([]); // State to store room data

	const [formData, setFormData] = useState({
		name: "",
		location: "",
		contactEmail: "",
		contactPhone: "",
		amenities: ["amenity1", "amenity2"],
		accessibilityFeatures: ["feature1", "feature2"],
		accessibilityInfo: "",
	});

	useEffect(() => {
		setIsLoading(true);
		getHotelById(hotelId)
			.then((response) => {
				setFormData({
					name: response.data.name,
					location: response.data.location || "",
					contactEmail: response.data.contactEmail || "",
					contactPhone: response.data.contactPhone || "",
					amenities: ["amenity1", "amenity2"],
					accessibilityFeatures: ["feature1", "feature2"],
					accessibilityInfo: response.data.accessibilityInfo || "",
				});
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	}, [hotelId]);

	// Function to add another room
	const addRoom = () => {
		setRoomIds((prevRoomIds) => [...prevRoomIds, prevRoomIds.length]); // Add a new room ID
	};

	// Function to remove a specific room
	const removeRoom = (roomId: number) => {
		setRoomIds((prevRoomIds) => prevRoomIds.filter((id) => id !== roomId)); // Remove the room ID
		setRoomDataList((prevDataList) =>
			prevDataList.filter((_, index) => index !== roomId)
		); // Remove the room data
	};

	// Function to handle room data change
	const handleRoomDataChange = (roomId: number, data: any) => {
		setRoomDataList((prevDataList) => {
			const newDataList = [...prevDataList];
			newDataList[roomId] = data;
			return newDataList;
		});
	};

	const [hotelFiles, setHotelFiles] = useState<FileList | null>(null);
	const [roomFiles, setRoomFiles] = useState<FileList | null>(null);

	// Function to handle change in form
	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleHotelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setHotelFiles(e.target.files);
		}
	};

	const handleRoomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setRoomFiles(e.target.files);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleAddHotel(
			formData.name,
			formData.location,
			formData.contactEmail,
			formData.contactPhone,
			formData.accessibilityInfo
		);
		// Collect data from all AddRoom components
		console.log("Submitting rooms:", roomDataList);
	};

	if (isLoading)
		return (
			<div className={styles.container_full}>
				<Progress step={5} />
				<Loading />
			</div>
		);
	else if (error)
		return (
			<div className={styles.container_full}>
				<Progress step={5} />
				<Error message={error.message} />
			</div>
		);
	else
		return (
			<div className={styles.container_full}>
				<Progress step={5} />
				<h1 className={styles.title}>Overview</h1>
				<p>Check all added info here and edit if needed.</p>

				<form method="post" className={styles.form} onSubmit={handleSubmit}>
					<h2 className={styles.subtitle}>General info</h2>
					<FormInput
						label="Name hotel"
						type="text"
						id="name"
						name="name"
						value={formData.name}
						placeholder="Brussels Plaza Hotel"
						onChange={handleChange}
						required={true}
					/>
					<FormInput
						label="Address hotel"
						type="text"
						id="location"
						name="location"
						value={formData.location}
						placeholder="Plaza 1, 1000 Brussels"
						onChange={handleChange}
						required={true}
					/>
					<FormInput
						label="Email hotel"
						type="email"
						id="contactEmail"
						name="contactEmail"
						value={formData.contactEmail}
						placeholder="example@hotel.com"
						onChange={handleChange}
						required={true}
					/>
					<FormInput
						label="Phone number hotel"
						type="tel"
						id="contactPhone"
						name="contactPhone"
						value={formData.contactPhone}
						placeholder="+32 000 00 00"
						onChange={handleChange}
						required={true}
					/>

					<fieldset>
						<legend>General amenities:</legend>
						{formData.amenities.map((amenity, index) => {
							return (
								<FormCheckbox
									key={`amenity_${index}`}
									label={amenity}
									id="amenities"
									name="amenities"
									value={amenity}
									onChange={handleChange}
								/>
							);
						})}
					</fieldset>

					<h2 className={styles.subtitle}>Accessibility info</h2>
					<fieldset>
						<legend>Accessibility features:</legend>
						{formData.accessibilityFeatures.map((feature, index) => {
							return (
								<FormCheckbox
									key={`feature_${index}`}
									label={feature}
									id="accessibilityFeatures"
									name="accessibilityFeatures"
									value={feature}
									onChange={handleChange}
								/>
							);
						})}
					</fieldset>

					<FormTextarea
						label="Accessibility info"
						id="accessibilityInfo"
						name="accessibilityInfo"
						value={formData.accessibilityInfo}
						placeholder="Add accessibility information of the room here. Give a general impression of the accessibility and add measurements if possible. Add any extra accessibility features here as well."
						onChange={handleChange}
						required={true}
					/>

					<h2 className={styles.subtitle}>Rooms</h2>
					<p>Please only add accessible rooms.</p>

					{/* Render multiple AddRoom components */}
					{roomIds.map((roomId) => (
						<div key={roomId} className={styles.roomContainer}>
							<AddRoom
								onDataChange={(data) => handleRoomDataChange(roomId, data)}
							/>
							<button
								type="button"
								className={styles.deleteButton}
								onClick={() => removeRoom(roomId)}
							>
								Delete
							</button>
						</div>
					))}

					{/* Button to add another room */}
					<button type="button" onClick={addRoom}>
						Add another room
					</button>

					<h2 className={styles.subtitle}>Photos</h2>
					<FormFileInput
						label="General"
						id="hotelImages"
						name="hotelImages"
						onChange={handleHotelFileChange}
					/>
					{hotelFiles && (
						<div>
							<p>Selected Files:</p>
							<ul>
								{Array.from(hotelFiles).map((file, index) => (
									<li key={index}>{file.name}</li>
								))}
							</ul>
						</div>
					)}
					<FormFileInput
						label="Room name"
						id="roomImages"
						name="roomImages"
						onChange={handleRoomFileChange}
					/>
					{roomFiles && (
						<div>
							<p>Selected Files:</p>
							<ul>
								{Array.from(roomFiles).map((file, index) => (
									<li key={index}>{file.name}</li>
								))}
							</ul>
						</div>
					)}

					<div className={styles.buttons}>
						<button onClick={goToPrevious}>Previous</button>
						<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		);
};

export default AddHotelOverview;
