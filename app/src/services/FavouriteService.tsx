import { User } from "./AuthService";
import { API } from "./ApiService";
import qs from "query-string";
import { Hotel } from "./HotelService";

export type Favourite = {
	_id?: string;
	hotelId: string;
	hotel?: Hotel;
	userId: string;
	user?: User;
};

export type FavouriteBody = Omit<Favourite, "_id">;

type Query = {
	hotelId?: string;
};

const getFavouritesByUser = () => {
	return API.get<Favourite[]>(`/favourites`);
};

const findFavouriteByHotel = (query: Query = {}) => {
	return API.get<Favourite[]>(`/favourites?${qs.stringify(query)}`);
};

const createFavourite = (favourite: FavouriteBody) => {
	return API.post<Favourite>("/favourites", favourite);
};

const deleteFavourite = (id: string) => {
	return API.delete<Favourite>(`/favourites/${id}`);
};

export {
	getFavouritesByUser,
	findFavouriteByHotel,
	createFavourite,
	deleteFavourite,
};
