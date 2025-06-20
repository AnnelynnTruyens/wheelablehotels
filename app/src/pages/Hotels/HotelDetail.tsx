import { useEffect, useRef, useState } from "react";
import styles from "./Hotels.module.css";
import { getHotelById, Hotel } from "../../services/HotelService";
import { Link, useLocation, useNavigate } from "react-router";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import ROUTES from "../../consts/Routes";
import NoResults from "../../components/NoResults/NoResults";
import Rating from "../../components/Cards/Hotels/Partials/Rating";
import { getImagesByHotel, Image } from "../../services/ImageService";
import { getRoomsByHotel, Room } from "../../services/RoomService";
import RoomCard from "../../components/Cards/Rooms/RoomCard";
import ReviewCard from "../../components/Cards/Reviews/ReviewCard";
import {
	createFavourite,
	deleteFavourite,
	Favourite,
	findFavouriteByHotel,
} from "../../services/FavouriteService";
import useStores from "../../hooks/useStores";
import { getReviewsByHotel, Review } from "../../services/ReviewService";
import GoBack from "../../components/Buttons/GoBack";

const HotelDetail = () => {
	const location = useLocation();
	const hotelId = location.state?.hotelId;

	const navigate = useNavigate();

	const [hotel, setHotel] = useState<Hotel | undefined>();
	const [images, setImages] = useState<Image[] | undefined>();
	const [rooms, setRooms] = useState<Room[] | undefined>();
	const [reviews, setReviews] = useState<Review[] | undefined>();

	const [favouriteData, setFavouriteData] = useState<Favourite[] | null>(null);

	const [favouriteId, setFavouriteId] = useState<string | null>(null);
	const [isFavourite, setIsFavourite] = useState<Boolean>(false);
	const [userId, setUserId] = useState<string>("");

	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null
	);
	const dialogRef = useRef<HTMLDialogElement>(null);

	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { UiStore } = useStores();

	// Type hotel and user to send with API call
	const hotelUser = {
		userId: userId,
		hotelId: hotelId,
	};

	useEffect(() => {
		getHotelById(hotelId)
			.then((response) => {
				setHotel(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});

		getImagesByHotel({ hotelId })
			.then((response) => {
				setImages(response.data);
			})
			.catch((error) => {
				console.error("Failed to fetch hotel image:", error);
			});

		getRoomsByHotel({ hotelId })
			.then((response) => {
				setRooms(response.data);
			})
			.catch((error) => {
				console.error("Failed to fetch hotel rooms:", error);
			});

		getReviewsByHotel({ hotelId })
			.then((response) => {
				setReviews(response.data);
			})
			.catch((error) => {
				console.error("Failed to fetch hotel reviews:", error);
			});

		findFavourite();
	}, [hotelId]);

	// Function to see if hotel is favourite of current user
	const findFavourite = () => {
		let filters = { hotelId: hotelId };
		findFavouriteByHotel(filters)
			.then(({ data }) => {
				setFavouriteData(data);
				const isFav = data.some(
					(favourite: Favourite) => favourite.hotelId === hotelId
				);
				setIsFavourite(isFav);
				if (isFav) {
					const fav = data.find(
						(favourite: Favourite) => favourite.hotelId === hotelId
					);
					setFavouriteId(fav?._id || null);
				}
			})
			.catch(() => {
				return;
			});
	};

	// Function to add hotel to favourites of current user
	const handleAddFavourite = () => {
		if (!hotel || !hotel._id) {
			return;
		}

		// If no current user, navigate to favourites page to see login page
		if (!UiStore.currentUser) {
			navigate(ROUTES.favourites);
		} else {
			setUserId(UiStore.currentUser._id);
		}

		// Add hotel to favourites
		setIsLoading(true);
		createFavourite(hotelUser)
			.then(() => {
				setIsFavourite(true);
				findFavourite();
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	// Function to remove hotel from favourites of current user
	const handleDeleteFavourite = () => {
		if (!hotel || !hotel._id || !favouriteData || !favouriteId) {
			return;
		}

		// If no current user, navigate to login page
		if (!UiStore.currentUser) {
			navigate(ROUTES.login);
		} else {
			setUserId(UiStore.currentUser._id);
		}

		// Remove hotel from favourites
		deleteFavourite(favouriteId)
			.then(() => {
				setIsFavourite(false);
			})
			.catch((error) => {
				setError(error);
			});
	};

	// Function to open image modal
	const openImageModal = (index: number) => {
		setSelectedImageIndex(index);
		dialogRef.current?.showModal();
		dialogRef.current?.focus();
	};

	// Function to close image modal
	const closeImageModal = () => {
		setSelectedImageIndex(null);
		dialogRef.current?.close();
	};

	// Function to show previous image in modal
	const showPrevImage = () => {
		if (images && selectedImageIndex !== null) {
			setSelectedImageIndex((prev) =>
				prev! > 0 ? prev! - 1 : images.length - 1
			);
		}
	};

	// Function to show next image in modal
	const showNextImage = () => {
		if (images && selectedImageIndex !== null) {
			setSelectedImageIndex((prev) =>
				prev! < images.length - 1 ? prev! + 1 : 0
			);
		}
	};

	// Trap focus
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeImageModal();
		};

		const dialog = dialogRef.current;
		dialog?.addEventListener("keydown", handleKeyDown);
		return () => {
			dialog?.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	// Navigate between images with arrow keys
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!dialogRef.current?.open) return;

			if (e.key === "ArrowLeft") {
				showPrevImage();
			} else if (e.key === "ArrowRight") {
				showNextImage();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [showPrevImage, showNextImage, dialogRef]);

	if (isLoading)
		return (
			<main id="main" className="main">
				<title>Hotel detail | Wheelable Hotels</title>
				<Loading />
			</main>
		);
	else if (error)
		return (
			<main id="main" className="main">
				<title>Hotel detail | Wheelable Hotels</title>
				<Error message={error.message} />
			</main>
		);
	else if (!hotel)
		return (
			<main id="main" className="main">
				<title>Hotel detail | Wheelable Hotels</title>
				<NoResults insert="hotel" />
			</main>
		);
	else
		return (
			<>
				<main id="main" className="main">
					<title>Hotel detail | Wheelable Hotels</title>
					<div className={styles.buttons}>
						<GoBack text="Go back" />
						{isFavourite ? (
							<button
								type="button"
								className={styles.favourite_btn}
								onClick={handleDeleteFavourite}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 40 40"
									className={styles.favourite_icon_filled}
								>
									<path
										d="M34.7333 7.68333C33.8821 6.83167 32.8714 6.15608 31.7589 5.69514C30.6465 5.2342 29.4541 4.99696 28.25 4.99696C27.0459 4.99696 25.8535 5.2342 24.7411 5.69514C23.6286 6.15608 22.6179 6.83167 21.7667 7.68333L20 9.45L18.2333 7.68333C16.5138 5.96385 14.1817 4.99785 11.75 4.99785C9.31827 4.99785 6.98615 5.96385 5.26666 7.68333C3.54717 9.40282 2.58118 11.7349 2.58118 14.1667C2.58118 16.5984 3.54717 18.9305 5.26666 20.65L20 35.3833L34.7333 20.65C35.585 19.7987 36.2606 18.788 36.7215 17.6756C37.1825 16.5632 37.4197 15.3708 37.4197 14.1667C37.4197 12.9625 37.1825 11.7702 36.7215 10.6577C36.2606 9.54531 35.585 8.53459 34.7333 7.68333Z"
										strokeWidth="3.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Added to favourites
							</button>
						) : (
							<button
								type="button"
								className={styles.favourite_btn}
								onClick={handleAddFavourite}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 40 40"
									className={styles.favourite_icon_empty}
								>
									<path
										d="M34.7333 7.68333C33.8821 6.83167 32.8714 6.15608 31.7589 5.69514C30.6465 5.2342 29.4541 4.99696 28.25 4.99696C27.0459 4.99696 25.8535 5.2342 24.7411 5.69514C23.6286 6.15608 22.6179 6.83167 21.7667 7.68333L20 9.45L18.2333 7.68333C16.5138 5.96385 14.1817 4.99785 11.75 4.99785C9.31827 4.99785 6.98615 5.96385 5.26666 7.68333C3.54717 9.40282 2.58118 11.7349 2.58118 14.1667C2.58118 16.5984 3.54717 18.9305 5.26666 20.65L20 35.3833L34.7333 20.65C35.585 19.7987 36.2606 18.788 36.7215 17.6756C37.1825 16.5632 37.4197 15.3708 37.4197 14.1667C37.4197 12.9625 37.1825 11.7702 36.7215 10.6577C36.2606 9.54531 35.585 8.53459 34.7333 7.68333Z"
										strokeWidth="3.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Add to favourites
							</button>
						)}
					</div>
					<section className={styles.top_section}>
						<div className={styles.top_left}>
							<h1 className={styles.title}>{hotel?.name}</h1>
							<p className={styles.username}>
								Added by{" "}
								{hotel.userId.username ? (
									<Link
										to={`${ROUTES.userProfile.to}${hotel.userId.username}`}
										state={{
											hotelId: hotel.userId._id,
											username: hotel.userId.username,
										}}
									>
										{hotel.userId.username}
									</Link>
								) : (
									"unknown"
								)}
							</p>
							<h2 className={styles.subtitle}>Accessibility</h2>
							{hotel.accessibilityFeatures &&
							hotel.accessibilityFeatures.length > 0 ? (
								<ul>
									{hotel.accessibilityFeatures.map((feature) => {
										return (
											<li key={`accessibility-feature_${feature._id}`}>
												{feature.name}
											</li>
										);
									})}
								</ul>
							) : (
								<NoResults insert="accessibility features" />
							)}
							<p>{hotel.accessibilityInfo}</p>
							<h2 className={styles.subtitle}>General amenities</h2>
							{hotel.amenities && hotel.amenities.length > 0 ? (
								<ul>
									{hotel.amenities.map((amenity) => {
										return (
											<li key={`amenity_${amenity._id}`}>{amenity.name}</li>
										);
									})}
								</ul>
							) : (
								<NoResults insert="amenities" />
							)}
						</div>
						<div className={styles.top_right}>
							<div className={styles.contact_reviews}>
								<div className={styles.contact_info}>
									<div className={styles.contact_item}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											aria-label="email icon"
										>
											<path
												d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<a href={`mailto:${hotel.contactEmail}`}>
											{hotel.contactEmail}
										</a>
									</div>
									<div className={styles.contact_item}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											aria-label="phone icon"
										>
											<g clipPath="url(#clip0_2051_1975)">
												<path
													d="M21.9999 16.92V19.92C22.0011 20.1985 21.944 20.4742 21.8324 20.7294C21.7209 20.9845 21.5572 21.2136 21.352 21.4019C21.1468 21.5901 20.9045 21.7335 20.6407 21.8227C20.3769 21.9119 20.0973 21.9451 19.8199 21.92C16.7428 21.5856 13.7869 20.5342 11.1899 18.85C8.77376 17.3147 6.72527 15.2662 5.18993 12.85C3.49991 10.2412 2.44818 7.271 2.11993 4.18001C2.09494 3.90347 2.12781 3.62477 2.21643 3.36163C2.30506 3.09849 2.4475 2.85669 2.6347 2.65163C2.82189 2.44656 3.04974 2.28271 3.30372 2.17053C3.55771 2.05834 3.83227 2.00027 4.10993 2.00001H7.10993C7.59524 1.99523 8.06572 2.16708 8.43369 2.48354C8.80166 2.79999 9.04201 3.23945 9.10993 3.72001C9.23656 4.68007 9.47138 5.62273 9.80993 6.53001C9.94448 6.88793 9.9736 7.27692 9.89384 7.65089C9.81408 8.02485 9.6288 8.36812 9.35993 8.64001L8.08993 9.91001C9.51349 12.4136 11.5864 14.4865 14.0899 15.91L15.3599 14.64C15.6318 14.3711 15.9751 14.1859 16.3491 14.1061C16.723 14.0263 17.112 14.0555 17.4699 14.19C18.3772 14.5286 19.3199 14.7634 20.2799 14.89C20.7657 14.9585 21.2093 15.2032 21.5265 15.5775C21.8436 15.9518 22.0121 16.4296 21.9999 16.92Z"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</g>
											<defs>
												<clipPath id="clip0_2051_1975">
													<rect width="24" height="24" fill="white" />
												</clipPath>
											</defs>
										</svg>
										<p>{hotel.contactPhone}</p>
									</div>
									<div className={styles.contact_item}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											aria-label="website icon"
										>
											<g clipPath="url(#clip0_2235_2264)">
												<path
													d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5013 19.2616 15.9228 15.708 16 12C15.9228 8.29203 14.5013 4.73835 12 2M12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2M2 12C2 6.47715 6.47715 2 12 2"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</g>
											<defs>
												<clipPath id="clip0_2235_2264">
													<rect width="24" height="24" fill="white" />
												</clipPath>
											</defs>
										</svg>
										<a href={hotel.website} target="_blank">
											{hotel.website}
										</a>
									</div>
								</div>
								<div className={styles.ratings}>
									<div className={styles.rating}>
										{hotel.rating ? (
											<>
												<Rating rating={hotel.rating} hotelDetail />
												<p>({hotel.rating}/5)</p>
											</>
										) : (
											<>
												<Rating rating={0} hotelDetail />
												<p>(-/5)</p>
											</>
										)}
									</div>
									<a
										href="#reviews"
										onClick={(e) => {
											e.preventDefault(); // Prevent default anchor behavior
											const el = document.getElementById("reviews");
											if (el) {
												el.setAttribute("tabIndex", "-1"); // Make it programmatically focusable
												el.focus(); // Move focus for screen readers / accessibility
												el.scrollIntoView({ behavior: "smooth" }); // Optional: scroll
											}
										}}
									>
										{reviews?.length} reviews
									</a>
								</div>
							</div>
							<div className={styles.images}>
								{images && images.length > 0 ? (
									images.map((image, index) => (
										<img
											key={`image_${image._id}`}
											src={`${process.env.VITE_SERVER_URL}${image.imageUrl}`}
											alt={image.alt || `Hotel image ${index + 1}`}
											className={styles.image}
											onClick={() => openImageModal(index)}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													openImageModal(index);
												}
											}}
										/>
									))
								) : (
									<NoResults insert="images" />
								)}
							</div>
						</div>
					</section>
					<section className={styles.room_section}>
						<h2 className={styles.subtitle}>Rooms</h2>
						{rooms && rooms.length > 0 ? (
							rooms.map((room) => {
								return (
									<RoomCard
										key={`room_${room._id}`}
										roomName={room.name}
										roomDescription={room.description}
										accessibilityFeatures={room.accessibilityFeatures}
										accessibilityInfo={room.accessibilityInfo}
									/>
								);
							})
						) : (
							<NoResults insert="rooms" />
						)}
					</section>
					<section id="reviews" className={styles.review_section}>
						<h2 className={styles.subtitle}>Reviews</h2>
						<div className={styles.rating_top}>
							<div className={styles.rating}>
								{hotel.rating ? (
									<>
										<Rating rating={hotel.rating} hotelDetail />
										<p>({hotel.rating}/5)</p>
									</>
								) : (
									<>
										<Rating rating={0} hotelDetail />
										<p>(-/5)</p>
									</>
								)}
							</div>
							<Link
								className="button"
								to={`${ROUTES.addReview.to}${hotel.name}`}
								state={{ hotelId: hotelId, hotelName: hotel.name }}
							>
								Add review
							</Link>
						</div>
						<div className={styles.reviews}>
							{reviews && reviews.length > 0 ? (
								reviews.map((review) => {
									return (
										<ReviewCard
											key={`review_${review._id}`}
											username={review.userId.username}
											rating={review.rating}
											review={review.message}
										/>
									);
								})
							) : (
								<NoResults insert="reviews" />
							)}
						</div>
						<Link
							className="button"
							to={`${ROUTES.addReview.to}${hotel.name}`}
							state={{ hotelId: hotelId, hotelName: hotel.name }}
						>
							Add review
						</Link>
					</section>
					<section>
						<h2 className={styles.subtitle}>Noticed a mistake?</h2>
						<Link
							to={ROUTES.contact}
							className="button"
							state={{ hotelId: hotelId, hotelName: hotel.name }}
						>
							Report a mistake
						</Link>
					</section>
				</main>
				<dialog
					ref={dialogRef}
					aria-modal="true"
					role="dialog"
					className={styles.imageModal}
					onClick={(e) => {
						if (e.target === dialogRef.current) closeImageModal();
					}}
				>
					{selectedImageIndex !== null && images && (
						<div className={styles.modalContent}>
							<button
								className={styles.closeButton}
								onClick={closeImageModal}
								aria-label="Close image preview"
							>
								&times;
							</button>
							<button
								className={styles.navButton}
								onClick={showPrevImage}
								aria-label="Previous image"
							>
								←
							</button>
							<img
								src={`${process.env.VITE_SERVER_URL}${images[selectedImageIndex].imageUrl}`}
								alt={images[selectedImageIndex].alt || "Preview image"}
								className={styles.modalImage}
							/>
							<button
								className={styles.navButton}
								onClick={showNextImage}
								aria-label="Next image"
							>
								→
							</button>
						</div>
					)}
				</dialog>
			</>
		);
};

export default HotelDetail;
