import { API } from "./ApiService";
import qs from "query-string";

export type Room = {
	_id: string;
	name: string;
	description: string;
	accessibilityInfo: string;
	hotelId: string;
	accessibilityFeatures: string[];
};

export type RoomBody = Omit<Room, "_id">;

type HotelQuery = {
	hotelId?: string;
};

const getRoomsByHotel = (query: HotelQuery = {}) => {
	return API.get<Room[]>(`/rooms?${qs.stringify(query)}`);
};

const getRoomById = (id: string) => {
	return API.get<Room>(`/rooms/${id}`);
};

const createRoom = (room: RoomBody) => {
	return API.post<Room>(`/rooms`, room);
};

const updateRoom = (id: string, room: RoomBody) => {
	return API.patch<Room>(`/rooms/${id}`, room);
};

const deleteRoom = (id: string) => {
	return API.delete<Room>(`/rooms/${id}`);
};

export { getRoomsByHotel, getRoomById, createRoom, updateRoom, deleteRoom };
