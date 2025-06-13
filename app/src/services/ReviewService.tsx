import { API } from "./ApiService";
import { User } from "./AuthService";
import qs from "query-string";

export type Review = {
	_id?: string;
	message?: string;
	rating: number;
	status: string;
	userId: User;
	hotelId: string;
};

export type ReviewBody = Omit<Review, "_id">;

type HotelQuery = {
	hotelId?: string;
};

const getReviewsByHotel = (query: HotelQuery = {}) => {
	return API.get<Review[]>(`/reviews?${qs.stringify(query)}`);
};

const getReviewById = (id: string) => {
	return API.get<Review>(`/reviews/${id}`);
};

const createReview = (review: ReviewBody) => {
	return API.post<Review>(`/reviews`, review);
};

const updateReview = (id: string, review: ReviewBody) => {
	return API.patch<Review>(`/reviews/${id}`, review);
};

const deleteReview = (id: string) => {
	return API.delete<Review>(`/reviews/${id}`);
};

export {
	getReviewsByHotel,
	getReviewById,
	createReview,
	updateReview,
	deleteReview,
};
