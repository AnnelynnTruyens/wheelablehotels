import { API } from "./ApiService";

export type Message = {
	_id?: string;
	name: string;
	email: string;
	message: string;
	hotelId?: string;
	status: string;
};

export type MessageBody = Omit<Message, "_id">;

const getMessages = () => {
	return API.get<Message>(`/messages`);
};

const getMessageById = (id: string) => {
	return API.get<Message>(`/messages/${id}`);
};

const createMessage = (message: MessageBody) => {
	return API.post<Message>(`/messages`, message);
};

const updateMessage = (id: string, message: MessageBody) => {
	return API.patch<Message>(`/messages/${id}`, message);
};

const deleteMessage = (id: string) => {
	return API.delete<Message>(`/messages/${id}`);
};

export {
	getMessages,
	getMessageById,
	createMessage,
	updateMessage,
	deleteMessage,
};
