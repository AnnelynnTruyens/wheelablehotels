import { useEffect, useState } from "react";
import styles from "../Forms.module.css";
import FormInput from "../Partials/FormInput";
import Progress from "./Partials/Progress";
import FormTextarea from "../Partials/FormTextarea";
import FormCheckbox from "../Partials/FormCheckbox";
import { Amenity, getAmenities } from "../../../services/AmenityService";
import {
	AccessibilityFeature,
	getAccessibilityFeatures,
} from "../../../services/AccessibilityFeatureService";

interface AddHotelInfoProps {
	goToNext: (
		location: string,
		contactEmail: string,
		contactPhone: string,
		accessibilityInfo: string,
		amenities: string[],
		accessibilityFeatures: string[]
	) => void; // Callback to handle going to next step
	goToPrevious: () => void; // Callback to handle going to previous step
}

const AddHotelInfo: React.FC<AddHotelInfoProps> = ({
	goToNext,
	goToPrevious,
}) => {
	const [formData, setFormData] = useState({
		location: "",
		contactEmail: "",
		contactPhone: "",
		amenities: [] as string[],
		accessibilityFeatures: [] as string[],
		accessibilityInfo: "",
	});

	const [amenities, setAmenities] = useState<Amenity[]>([]);
	const [accessibilityFeatures, setAccessibilityFeatures] = useState<
		AccessibilityFeature[]
	>([]);

	useEffect(() => {
		// Fetch amenities & accessibilityFeatures from the API
		getAmenities().then((response) => {
			setAmenities(response.data);
		});
		getAccessibilityFeatures().then((response) => {
			setAccessibilityFeatures(response.data);
		});
	}, []);

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
		if (checked) {
			setFormData({
				...formData,
				amenities: [...formData.amenities, value],
			});
		} else {
			setFormData({
				...formData,
				amenities: formData.amenities.filter((amenity) => amenity != value),
			});
		}
	};

	const handleAccessibilityFeatureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { value, checked } = e.target;
		if (checked) {
			setFormData({
				...formData,
				accessibilityFeatures: [...formData.accessibilityFeatures, value],
			});
		} else {
			setFormData({
				...formData,
				accessibilityFeatures: formData.accessibilityFeatures.filter(
					(feature) => feature != value
				),
			});
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		goToNext(
			formData.location,
			formData.contactEmail,
			formData.contactPhone,
			formData.accessibilityInfo,
			formData.amenities,
			formData.accessibilityFeatures
		);
	};

	return (
		<div className={styles.container_full}>
			<Progress step={2} />
			<h1 className={styles.title}>Add hotel info</h1>

			<form method="post" className={styles.form} onSubmit={handleSubmit}>
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
					<legend className={styles.fieldset_legend}>General amenities:</legend>
					<div className={styles.checkboxes}>
						{amenities.map((amenity) => {
							return (
								<FormCheckbox
									key={amenity._id}
									label={amenity.name}
									id={amenity._id}
									name="amenities"
									value={amenity._id}
									onChange={handleAmenityChange}
								/>
							);
						})}
					</div>
				</fieldset>

				<h2 className={styles.title}>Accessibility info</h2>
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

				<div className={styles.buttons}>
					<button onClick={goToPrevious}>Previous</button>
					<button type="submit">Next</button>
				</div>
			</form>
		</div>
	);
};

export default AddHotelInfo;
