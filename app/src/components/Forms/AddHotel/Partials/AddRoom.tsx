import { useEffect, useState } from "react";
import styles from "../../Forms.module.css";
import FormInput from "../../Partials/FormInput";
import FormTextarea from "../../Partials/FormTextarea";
import FormCheckbox from "../../Partials/FormCheckbox";
import {
	AccessibilityFeature,
	getAccessibilityFeatures,
} from "../../../../services/AccessibilityFeatureService";

interface AddRoomProps {
	roomId: string | number;
	onDataChange: (data: any) => void;
	initialData?: {
		name?: string;
		description?: string;
		accessibilityInfo?: string;
		accessibilityFeatures?: string[];
	};
}

const AddRoom: React.FC<AddRoomProps> = ({
	onDataChange,
	roomId,
	initialData,
}) => {
	const [formData, setFormData] = useState({
		name: initialData?.name || "",
		description: initialData?.description || "",
		accessibilityInfo: initialData?.accessibilityInfo || "",
		accessibilityFeatures:
			initialData?.accessibilityFeatures || ([] as string[]),
	});
	const [availableFeatures, setAvailableFeatures] = useState<
		AccessibilityFeature[]
	>([]);

	// Fetch accessibility features from API
	useEffect(() => {
		getAccessibilityFeatures().then((response) => {
			setAvailableFeatures(response.data);
		});
	}, []);

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		const updated = { ...formData, [e.target.name]: e.target.value };
		setFormData(updated);
		onDataChange(updated);
	};

	const handleAccessibilityFeatureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { value, checked } = e.target;
		const updatedFeatures = checked
			? [...formData.accessibilityFeatures, value]
			: formData.accessibilityFeatures.filter((f) => f !== value);
		const updated = { ...formData, accessibilityFeatures: updatedFeatures };
		setFormData(updated);
		onDataChange(updated);
	};

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
				required
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
					{availableFeatures.map((feature) => (
						<FormCheckbox
							key={feature._id}
							label={feature.name}
							id={`room-${roomId}-feature-${feature._id}`}
							name="accessibilityFeatures"
							value={feature._id}
							checked={formData.accessibilityFeatures.includes(feature._id)}
							onChange={handleAccessibilityFeatureChange}
						/>
					))}
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
