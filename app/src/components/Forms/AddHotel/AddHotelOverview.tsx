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
import { Amenity, getAmenities } from "../../../services/AmenityService";
import {
	AccessibilityFeature,
	getAccessibilityFeatures,
} from "../../../services/AccessibilityFeatureService";
import {
	createRoom,
	deleteRoom,
	getRoomsByHotel,
	updateRoom,
} from "../../../services/RoomService";
import {
	createImage,
	deleteImage,
	getImagesByHotel,
	Image,
} from "../../../services/ImageService";

interface AddHotelOverviewProps {
	hotelId: string;
	goToPrevious: () => void; // Callback to handle going to previous step
	handleAddHotel: (
		name: string,
		location: string,
		contactEmail: string,
		contactPhone: string,
		accessibilityInfo: string,
		amenities: Amenity[],
		accessibilityFeatures: AccessibilityFeature[]
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
	type RoomData = {
		_id?: string;
		tempId?: string;
		name: string;
		description: string;
		accessibilityInfo: string;
		hotelId: string;
		accessibilityFeatures: AccessibilityFeature[];
		isNew?: boolean;
	};

	const [roomDataList, setRoomDataList] = useState<RoomData[]>([]);

	const [formData, setFormData] = useState({
		name: "",
		location: "",
		contactEmail: "",
		contactPhone: "",
		amenities: [] as Amenity[],
		accessibilityFeatures: [] as AccessibilityFeature[],
		accessibilityInfo: "",
	});

	const [amenities, setAmenities] = useState<Amenity[]>([]);
	const [accessibilityFeatures, setAccessibilityFeatures] = useState<
		AccessibilityFeature[]
	>([]);

	const [existingHotelImages, setExistingHotelImages] = useState<Image[]>([]);

	const [hotelFiles, setHotelFiles] = useState<FileList | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch hotel details
				const hotelResponse = await getHotelById(hotelId);

				// Extract amenities _id values
				const hotelAmenities = amenities.filter((a) =>
					(hotelResponse.data.amenities as any[]).some(
						(selected: any) => selected._id === a._id
					)
				);

				// Extract accessibilityFeatures _id values
				const hotelAccessibilityFeatures = accessibilityFeatures.filter((f) =>
					(hotelResponse.data.accessibilityFeatures as any[]).some(
						(selected: any) => selected._id === f._id
					)
				);

				setFormData({
					name: hotelResponse.data.name,
					location: hotelResponse.data.location || "",
					contactEmail: hotelResponse.data.contactEmail || "",
					contactPhone: hotelResponse.data.contactPhone || "",
					amenities: hotelAmenities,
					accessibilityFeatures: hotelAccessibilityFeatures,
					accessibilityInfo: hotelResponse.data.accessibilityInfo || "",
				});

				const roomsResponse = await getRoomsByHotel({ hotelId });
				const rooms = roomsResponse.data;
				setRoomDataList(rooms);

				// Fetch all amenities
				const amenitiesResponse = await getAmenities();
				setAmenities(amenitiesResponse.data);

				// Fetch all accessibilityFeatures
				const accessibilityFeaturesResponse = await getAccessibilityFeatures();
				setAccessibilityFeatures(accessibilityFeaturesResponse.data);

				setIsLoading(false);
			} catch (error) {
				setError(error as Error);
				setIsLoading(false);
			}
		};
		const fetchImages = async () => {
			try {
				const hotelImagesResponse = await getImagesByHotel({ hotelId });
				setExistingHotelImages(hotelImagesResponse.data);
			} catch (error) {
				console.error("Error fetching images:", error);
			}
		};

		fetchData();
		fetchImages();
	}, [hotelId]);

	// Function to add another room
	const addRoom = () => {
		setRoomDataList((prevRooms) => [
			...prevRooms,
			{
				tempId: crypto.randomUUID(),
				name: "",
				description: "",
				accessibilityInfo: "",
				hotelId,
				accessibilityFeatures: [],
				isNew: true,
			},
		]);
	};

	// Function to remove a specific room
	const removeRoom = async (roomId?: string) => {
		// Remove it from state regardless of whether it has an ID
		setRoomDataList((prev) =>
			prev.filter((room) => {
				if (room._id) return room._id !== roomId;
				// For new rooms, use reference matching instead of ID
				return roomId !== undefined;
			})
		);

		try {
			const room = roomDataList.find((r) => r._id === roomId);
			if (room && !room.isNew && room._id) {
				await deleteRoom(room._id);
			}
		} catch (err) {
			console.error("Failed to delete room:", err);
		}
	};

	// Function to handle room data change
	const handleRoomDataChange = (roomKey: string, data: any) => {
		setRoomDataList((prevDataList) =>
			prevDataList.map((room) => {
				if (room._id === roomKey || room.tempId === roomKey) {
					return { ...room, ...data };
				}
				return room;
			})
		);
	};

	// Function to handle change in form
	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		const selectedAmenity = amenities.find((a) => a._id === value);
		if (!selectedAmenity) return; // safety check

		if (checked) {
			setFormData({
				...formData,
				amenities: [...formData.amenities, selectedAmenity],
			});
		} else {
			setFormData({
				...formData,
				amenities: formData.amenities.filter((a) => a._id !== value),
			});
		}
	};

	const handleAccessibilityFeatureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { value, checked } = e.target;
		const selectedFeature = accessibilityFeatures.find((f) => f._id === value);
		if (!selectedFeature) return;

		if (checked) {
			setFormData({
				...formData,
				accessibilityFeatures: [
					...formData.accessibilityFeatures,
					selectedFeature,
				],
			});
		} else {
			setFormData({
				...formData,
				accessibilityFeatures: formData.accessibilityFeatures.filter(
					(f) => f._id !== value
				),
			});
		}
	};

	const handleHotelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setHotelFiles(e.target.files);
		}
	};

	const handleDeleteImage = async (imageId: string) => {
		try {
			await deleteImage(imageId);
			// Update state to remove the deleted image
			setExistingHotelImages((prev) =>
				prev.filter((img) => img._id !== imageId)
			);
		} catch (error) {
			console.error("Error deleting image:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await Promise.all(
				roomDataList.map((room) => {
					const roomBody = {
						name: room.name,
						description: room.description,
						accessibilityInfo: room.accessibilityInfo,
						accessibilityFeatures: room.accessibilityFeatures,
						hotelId,
					};

					if (room.isNew) {
						return createRoom(roomBody);
					} else {
						return updateRoom(room._id!, roomBody);
					}
				})
			);

			const uploadImages = async (
				files: FileList,
				meta: { hotelId: string }
			) => {
				if (!files || files.length === 0) {
					console.warn("No files to upload");
					return;
				}
				for (const file of Array.from(files)) {
					const formData = new FormData();
					formData.append("file", file);
					formData.append("name", file.name);
					formData.append("alt", file.name);
					formData.append("hotelId", meta.hotelId);
					await createImage(formData);
				}
			};

			if (hotelFiles) {
				await uploadImages(hotelFiles, { hotelId });
			}

			handleAddHotel(
				formData.name,
				formData.location,
				formData.contactEmail,
				formData.contactPhone,
				formData.accessibilityInfo,
				formData.amenities,
				formData.accessibilityFeatures
			);
		} catch (err) {
			console.error("Error submitting hotel, rooms or images:", err);
		}
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
						{amenities.map((amenity) => (
							<FormCheckbox
								key={amenity._id}
								label={amenity.name}
								id={amenity._id}
								name="amenities"
								value={amenity._id}
								checked={formData.amenities.some((a) => a._id === amenity._id)}
								onChange={handleAmenityChange}
							/>
						))}
					</fieldset>

					<h2 className={styles.subtitle}>Accessibility info</h2>
					<fieldset>
						<legend>Accessibility features:</legend>
						{accessibilityFeatures.map((feature) => {
							return (
								<FormCheckbox
									key={feature._id}
									label={feature.name}
									id={feature._id}
									name="accessibilityFeatures"
									value={feature._id}
									checked={formData.accessibilityFeatures.some(
										(f) => f._id === feature._id
									)}
									onChange={handleAccessibilityFeatureChange}
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
					{roomDataList.map((room) => (
						<div key={room._id || room.tempId} className={styles.roomContainer}>
							<AddRoom
								initialData={room}
								roomId={room._id || room.tempId!}
								onDataChange={(data) =>
									handleRoomDataChange(room._id || room.tempId!, data)
								}
							/>
							<button
								type="button"
								className={styles.deleteButton}
								onClick={() => removeRoom(room._id)}
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
					<div>
						<p>Added photos:</p>
						<div className={styles.imageGrid}>
							{existingHotelImages.map((image) => (
								<div key={image._id} className={styles.imageItem}>
									<img
										src={`${process.env.VITE_SERVER_URL}${image.imageUrl}`}
										alt={`${process.env.VITE_SERVER_URL}${image.alt}`}
									/>
									<button
										type="button"
										onClick={() => handleDeleteImage(image._id)}
									>
										Delete
									</button>
								</div>
							))}
						</div>
					</div>

					<div className={styles.buttons}>
						<button onClick={goToPrevious}>Previous</button>
						<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		);
};

export default AddHotelOverview;
