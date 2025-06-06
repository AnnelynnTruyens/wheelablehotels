import { API } from "./ApiService";

export type AccessibilityFeature = {
	_id: string;
	name: string;
	icon?: string;
};

const getAccessibilityFeatures = () => {
	return API.get<AccessibilityFeature[]>(`/accessibility-features`);
};

const getAccessibilityFeatureById = (id: string) => {
	return API.get<AccessibilityFeature>(`/accessibility-features/${id}`);
};

export { getAccessibilityFeatures, getAccessibilityFeatureById };
