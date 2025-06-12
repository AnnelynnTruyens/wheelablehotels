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
		website: string,
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
		website: "",
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
				// Fetch all amenities and accessibilityFeatures first
				const [amenitiesResponse, accessibilityFeaturesResponse] =
					await Promise.all([getAmenities(), getAccessibilityFeatures()]);

				const allAmenities = amenitiesResponse.data;
				const allFeatures = accessibilityFeaturesResponse.data;

				setAmenities(allAmenities);
				setAccessibilityFeatures(allFeatures);

				// Then fetch hotel data (now we can match against full lists)
				const hotelResponse = await getHotelById(hotelId);

				// Match amenities and accessibility features by _id
				const hotelAmenities = allAmenities.filter((a) =>
					(hotelResponse.data.amenities as any[]).some(
						(selected: any) => selected._id === a._id
					)
				);

				const hotelAccessibilityFeatures = allFeatures.filter((f) =>
					(hotelResponse.data.accessibilityFeatures as any[]).some(
						(selected: any) => selected._id === f._id
					)
				);

				setFormData({
					name: hotelResponse.data.name,
					location: hotelResponse.data.location || "",
					contactEmail: hotelResponse.data.contactEmail || "",
					contactPhone: hotelResponse.data.contactPhone || "",
					website: hotelResponse.data.website || "",
					amenities: hotelAmenities,
					accessibilityFeatures: hotelAccessibilityFeatures,
					accessibilityInfo: hotelResponse.data.accessibilityInfo || "",
				});

				const roomsResponse = await getRoomsByHotel({ hotelId });
				setRoomDataList(roomsResponse.data);

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
				formData.website,
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

					<fieldset className={styles.fieldset}>
						<legend className={styles.fieldset_legend}>
							General amenities:
						</legend>
						<div className={styles.checkboxes}>
							{amenities.map((amenity) => (
								<FormCheckbox
									key={amenity._id}
									label={amenity.name}
									id={amenity._id}
									name="amenities"
									value={amenity._id}
									checked={formData.amenities.some(
										(a) => a._id === amenity._id
									)}
									onChange={handleAmenityChange}
								/>
							))}
						</div>
					</fieldset>

					<h2 className={styles.subtitle}>Accessibility info</h2>
					<fieldset className={styles.fieldset}>
						<legend className={styles.fieldset_legend}>
							Accessibility features:
						</legend>
						<div className={styles.checkboxes}>
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
						</div>
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
						<div
							key={room._id || room.tempId}
							className={styles.room_container}
						>
							<AddRoom
								initialData={room}
								roomId={room._id || room.tempId!}
								onDataChange={(data) =>
									handleRoomDataChange(room._id || room.tempId!, data)
								}
							/>
							<button
								type="button"
								className={styles.delete_btn}
								onClick={() => removeRoom(room._id)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
								>
									<path
										d="M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
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
						<div className={styles.image_grid}>
							{existingHotelImages.map((image) => (
								<div key={image._id} className={styles.image_item}>
									<img
										src={`${process.env.VITE_SERVER_URL}${image.imageUrl}`}
										alt={`${process.env.VITE_SERVER_URL}${image.alt}`}
									/>
									<button
										type="button"
										onClick={() => handleDeleteImage(image._id)}
										className={styles.delete_btn}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
										>
											<path
												d="M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
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
