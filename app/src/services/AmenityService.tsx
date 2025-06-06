import { API } from "./ApiService";

export type Amenity = {
	_id: string;
	name: string;
	icon?: string;
};

const getAmenities = () => {
	return API.get<Amenity[]>(`/amenities`);
};

const getAmenityById = (id: string) => {
	return API.get<Amenity>(`/amenities/${id}`);
};

export { getAmenities, getAmenityById };
