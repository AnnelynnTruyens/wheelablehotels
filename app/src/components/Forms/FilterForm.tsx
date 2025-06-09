import { useEffect, useState } from "react";
import styles from "./Forms.module.css";
import {
	AccessibilityFeature,
	getAccessibilityFeatures,
} from "../../services/AccessibilityFeatureService";
import FormCheckbox from "./Partials/FormCheckbox";
import { Amenity, getAmenities } from "../../services/AmenityService";

interface FilterFormProps {
	formData: {
		amenities: string[];
		accessibilityFeatures: string[];
	};
	onFilterChange: (formData: {
		amenities: string[];
		accessibilityFeatures: string[];
	}) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
	formData,
	onFilterChange,
}) => {
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

	const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		const updatedAmenities = checked
			? [...formData.amenities, value]
			: formData.amenities.filter((amenity) => amenity !== value);

		onFilterChange({
			...formData,
			amenities: updatedAmenities,
		});
	};

	const handleAccessibilityFeatureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { value, checked } = e.target;
		const updatedFeatures = checked
			? [...formData.accessibilityFeatures, value]
			: formData.accessibilityFeatures.filter((feature) => feature !== value);

		onFilterChange({
			...formData,
			accessibilityFeatures: updatedFeatures,
		});
	};

	return (
		<div className={styles.filter_form}>
			<h2 className={styles.title_small}>Filters</h2>
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
		</div>
	);
};

export default FilterForm;
