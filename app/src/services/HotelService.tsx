import { API } from "./ApiService";

export type Hotel = {
	_id: string;
	name: string;
	location?: string;
	contactEmail?: string;
	contactPhone?: string;
	accessibilityInfo?: string;
	rating?: number;
	status: string;
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
