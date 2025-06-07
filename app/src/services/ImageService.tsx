import { API } from "./ApiService";
import qs from "query-string";

export type Image = {
	_id: string;
	name: string;
	imageUrl: string;
	alt: string;
	hotelId?: string;
	roomId?: string;
};

export type ImageBody = Omit<Image, "_id">;

type HotelQuery = {
	hotelId?: string;
};

type RoomQuery = {
	roomId?: string;
};

const getImagesByHotel = (query: HotelQuery = {}) => {
	return API.get<Image[]>(`/images?${qs.stringify(query)}`);
};

const getImagesByRoom = (query: RoomQuery = {}) => {
	return API.get<Image[]>(`/images?${qs.stringify(query)}`);
};

const createImage = (formData: FormData) => {
	return API.post("/images", formData);
};

const deleteImage = (id: string) => {
	return API.delete<Image>(`/images/${id}`);
};

export { getImagesByHotel, getImagesByRoom, createImage, deleteImage };
