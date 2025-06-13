import { useState } from "react";
import styles from "./Forms.module.css";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";
import FormInput from "./Partials/FormInput";
import FormTextarea from "./Partials/FormTextarea";
import { createMessage } from "../../services/MessageService";
import SuccessMessage from "./Partials/SuccessMessage";

interface ContactFormProps {
	hotelId?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ hotelId }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
		status: "new",
	});

	const { name, email, message, status } = formData;

	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [isSuccess, setIsSuccess] = useState<Boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	// Function to handle change in register form
	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Function to handle register
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
		createMessage({ name, email, message, hotelId, status })
			.then(() => {
				setIsSuccess(true);
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	if (isLoading) return <Loading />;
	else if (isSuccess)
		return (
			<SuccessMessage message="Thank you for contacting us! We will email you as soon as possible." />
		);
	else if (error) return <Error message={error.message} />;
	else
		return (
			<form onSubmit={handleSubmit} className={styles.form}>
				<FormInput
					label="Name"
					type="text"
					id="name"
					name="name"
					value={name}
					placeholder="John Doe"
					onChange={handleChange}
					required={true}
					autocomplete="name"
				/>
				<FormInput
					label="Email"
					type="email"
					id="email"
					name="email"
					value={email}
					placeholder="john.doe@example.com"
					onChange={handleChange}
					required={true}
					autocomplete="email"
				/>
				<FormTextarea
					label="Message"
					id="message"
					name="message"
					value={message}
					placeholder="Your message"
					onChange={handleChange}
					required={true}
				/>
				<button type="submit">Send message</button>
			</form>
		);
};

export default ContactForm;
