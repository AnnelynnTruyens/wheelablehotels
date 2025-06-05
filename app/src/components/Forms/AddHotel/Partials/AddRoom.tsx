import { useEffect, useState } from "react";
import styles from "../../Forms.module.css";
import FormInput from "../../Partials/FormInput";
import FormTextarea from "../../Partials/FormTextarea";
import FormCheckbox from "../../Partials/FormCheckbox";

interface AddRoomProps {
	onDataChange?: (data: any) => void; // Define the onDataChange prop
}

const AddRoom: React.FC<AddRoomProps> = ({ onDataChange }) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		accessibilityFeatures: ["feature1", "feature2"],
		accessibilityInfo: "",
	});

	// Function to handle change in form
	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Notify the parent component of the data change whenever formData changes
	useEffect(() => {
		if (onDataChange) {
			onDataChange(formData);
		}
	}, [formData]);

	return (
		<div className={styles.room_container}>
			<FormInput
				label="Name room"
				type="text"
				id="name"
				name="name"
				value={formData.name}
				placeholder="Accessible room"
				onChange={handleChange}
				required={true}
			/>
			<FormTextarea
				label="Description"
				id="description"
				name="description"
				value={formData.description}
				placeholder="Add the description of the room here. Include amenities the room has such as a hair dryer or kettle."
				onChange={handleChange}
			/>
			<fieldset className={styles.fieldset}>
				<legend className={styles.fieldset_legend}>
					Accessibility features:
				</legend>
				<div className={styles.checkboxes}>
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
				</div>
			</fieldset>
			<FormTextarea
				label="Accessibility info"
				id="accessibilityInfo"
				name="accessibilityInfo"
				value={formData.accessibilityInfo}
				placeholder="Add accessibility information of the room here. Give a general impression of the accessibility and add measurements if possible. Add any extra accessibility features here as well."
				onChange={handleChange}
			/>
		</div>
	);
};

export default AddRoom;
