import { useEffect, useState } from "react";
import styles from "./HotelCard.module.css";
import Rating from "./Partials/Rating";
import { getImagesByHotel, Image } from "../../../services/ImageService";
import { Link } from "react-router";
import ROUTES from "../../../consts/Routes";

interface HotelCardProps {
	hotelName: string;
	hotelId: string;
	location: string | undefined;
	accessibilityFeatures: { _id: string; name: string }[];
	rating: number | undefined;
}

const HotelCard: React.FC<HotelCardProps> = ({
	hotelName,
	hotelId,
	location,
	accessibilityFeatures,
	rating,
}) => {
	const [image, setImage] = useState<Image | undefined>();

	useEffect(() => {
		getImagesByHotel({ hotelId }) // ← Pass just the ID if that's what your API expects
			.then((response) => {
				if (response.data && response.data.length > 0) {
					setImage(response.data[0]); // Set the first image
				}
			})
			.catch((error) => {
				console.error("Failed to fetch hotel image:", error);
			});
	}, [hotelId]);

	return (
		<div className={styles.hotel_card}>
			<img
				src={
					image
						? `${process.env.VITE_SERVER_URL}${image.imageUrl}`
						: "/Icon_wheelchair_blue-white.png"
				}
				alt={image ? `${image.alt}` : "No hotel image found"}
				className={styles.card_img}
			/>
			<div className={styles.card_info}>
				<div className={styles.card_info_left}>
					<Link
						to={`${ROUTES.hotelDetail.to}${hotelName}`}
						state={{ hotelId }}
						className={styles.card_link}
					>
						<h2 className={styles.card_title}>{hotelName}</h2>
					</Link>
					<p className={styles.card_location}>{location}</p>
					<ul className={styles.card_features}>
						{accessibilityFeatures.map((feature, index) => {
							return (
								<li className={styles.card_li} key={`feature_${index}`}>
									{feature.name}
								</li>
							);
						})}
					</ul>
				</div>
				{rating ? <Rating rating={rating} /> : null}
			</div>
		</div>
	);
};

export default HotelCard;
