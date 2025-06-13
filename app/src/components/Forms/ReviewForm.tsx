import { useEffect, useState } from "react";
import styles from "./Forms.module.css";
import { createReview } from "../../services/ReviewService";
import { useAuth } from "../../contexts/AuthContext";
import useStores from "../../hooks/useStores";
import { useNavigate } from "react-router";
import ROUTES from "../../consts/Routes";
import { API } from "../../services/ApiService";
import { AxiosError, AxiosResponse } from "axios";
import Loading from "../Loading/Loading";
import SuccessMessage from "./Partials/SuccessMessage";
import Error from "../Error/Error";
import FormTextarea from "./Partials/FormTextarea";
import RatingIcon from "./Partials/RatingIcon";

interface ReviewFormProps {
	hotelId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ hotelId }) => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		rating: 0,
		message: "",
	});

	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [isSuccess, setIsSuccess] = useState<Boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	const [hoverRating, setHoverRating] = useState(0);

	const { token, logout } = useAuth();
	const { UiStore } = useStores();

	// Wait for currentUser to be set
	useEffect(() => {
		const waitForUser = async () => {
			if (!UiStore.currentUser) {
				await new Promise<void>((resolve) => {
					const interval = setInterval(() => {
						if (UiStore.currentUser) {
							clearInterval(interval);
							resolve();
						}
					}, 100);
				});
			}
			setIsLoading(false);

			if (!UiStore.currentUser) {
				navigate(ROUTES.home);
			}
		};

		waitForUser();
	}, [UiStore, navigate]);

	// Function to handle change in review form
	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Function to handle add review
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!UiStore.currentUser) {
			return;
		}

		const reviewBody = {
			userId: UiStore.currentUser._id,
			rating: formData.rating,
			message: formData.message,
			status: "new",
			hotelId: hotelId,
		};

		API.interceptors.request.use((config) => {
			if (token) {
				config.headers["Authorization"] = `Bearer ${token}`;
			}
			return config;
		});
		API.interceptors.response.use(
			(response: AxiosResponse) => response,
			(error: AxiosError) => {
				if (error.response?.status === 401) {
					logout();
				}
				return Promise.reject(error);
			}
		);

		setIsLoading(true);
		createReview(reviewBody)
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
		return <SuccessMessage message="Review sent successfully!" />;
	else if (error) return <Error message={error.message} />;
	else
		return (
			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.form_group}>
					<fieldset className={styles.fieldset}>
						<legend className={styles.fieldset_legend}>Rating</legend>
						<div
							className={styles.rating_group}
							role="radiogroup"
							aria-label="Rating from 1 to 5"
						>
							{[1, 2, 3, 4, 5].map((value) => (
								<label key={value} className={styles.rating_label}>
									<input
										type="radio"
										name="rating"
										value={value.toString()}
										checked={formData.rating === value}
										onChange={() =>
											setFormData({
												...formData,
												rating: value,
											})
										}
										className={styles.radio_input}
										aria-label={`${value} rating${value > 1 ? "s" : ""}`}
									/>
									<span
										className={styles.rating}
										onMouseEnter={() => setHoverRating(value)}
										onMouseLeave={() => setHoverRating(0)}
									>
										<RatingIcon
											filled={value <= (hoverRating || formData.rating)}
										/>
									</span>
								</label>
							))}
						</div>
						<p className={styles.selected_rating}>
							Selected:{" "}
							{formData.rating
								? `${formData.rating} star${formData.rating > 1 ? "s" : ""}`
								: "None"}
						</p>
					</fieldset>
				</div>

				<FormTextarea
					label="Message"
					id="message"
					name="message"
					value={formData.message}
					placeholder="Your message"
					onChange={handleChange}
					required={true}
				/>
				<button type="submit">Add review</button>
			</form>
		);
};

export default ReviewForm;
