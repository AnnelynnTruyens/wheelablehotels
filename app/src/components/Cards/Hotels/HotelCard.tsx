import { useEffect, useState } from "react";
import styles from "./HotelCard.module.css";
import Rating from "./Partials/Rating";
import { getImagesByHotel, Image } from "../../../services/ImageService";

interface HotelCardProps {
	hotelName: string;
	hotelId: string;
	location: string | undefined;
	accessibilityFeatures: { _id: string; name: string }[];
}

const HotelCard: React.FC<HotelCardProps> = ({
	hotelName,
	hotelId,
	location,
	accessibilityFeatures,
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
						? `http://localhost:${process.env.PORT}${image.imageUrl}`
						: "/Icon_wheelchair_blue-white.png"
				}
				alt={
					image
						? `http://localhost:${process.env.PORT}${image.alt}`
						: "No hotel image found"
				}
				className={styles.card_img}
			/>
			<div className={styles.card_info}>
				<div className={styles.card_info_left}>
					<h2 className={styles.card_title}>{hotelName}</h2>
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
				<Rating rating={4} />
			</div>
		</div>
	);
};

export default HotelCard;
