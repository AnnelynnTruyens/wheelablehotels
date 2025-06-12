import { AccessibilityFeature } from "./AccessibilityFeatureService";
import { Amenity } from "./AmenityService";
import { API } from "./ApiService";
import { User } from "./AuthService";

export type Hotel = {
	_id: string;
	name: string;
	location?: string;
	contactEmail?: string;
	contactPhone?: string;
	accessibilityInfo?: string;
	rating?: number;
	status: string;
	amenities: Amenity[];
	accessibilityFeatures: AccessibilityFeature[];
	userId: User;
};

export type HotelBody = Omit<Hotel, "_id">;

const getHotels = () => {
	return API.get<Hotel[]>(`/hotels`);
};

const getHotelById = (id: string) => {
	return API.get<Hotel>(`/hotels/${id}`);
};

const createHotel = (hotel: HotelBody) => {
	return API.post<Hotel>(`/hotels`, hotel);
};

const updateHotel = (id: string, hotel: HotelBody) => {
	return API.patch<Hotel>(`/hotels/${id}`, hotel);
};

const deleteHotel = (id: string) => {
	return API.delete<Hotel>(`/hotels/${id}`);
};

export { getHotels, getHotelById, createHotel, updateHotel, deleteHotel };
