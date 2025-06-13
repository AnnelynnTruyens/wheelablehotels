import { useEffect, useState } from "react";
import styles from "./HotelCard.module.css";
import Rating from "./Partials/Rating";
import { getImagesByHotel, Image } from "../../../services/ImageService";
import { Link } from "react-router";
import ROUTES from "../../../consts/Routes";

interface HotelHighlightProps {
	hotelName: string | undefined;
	hotelId: string;
	location: string | undefined;
}

const HotelHighlight: React.FC<HotelHighlightProps> = ({
	hotelName,
	hotelId,
	location,
}) => {
	const [image, setImage] = useState<Image | undefined>();

	useEffect(() => {
		getImagesByHotel({ hotelId })
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
		<div className={styles.hotel_highlight}>
			<img
				src={
					image
						? `${process.env.VITE_SERVER_URL}${image.imageUrl}`
						: "/Icon_wheelchair_blue-white.png"
				}
				alt={image ? `${image.alt}` : "No hotel image found"}
				className={styles.highlight_img}
			/>
			<div className={styles.highlight_info}>
				<Link
					to={`${ROUTES.hotelDetail.to}${hotelName}`}
					state={{ hotelId }}
					className={styles.highlight_link}
				>
					<h2 className={styles.highlight_title}>
						{hotelName ? hotelName : "hotel name"}
					</h2>
				</Link>
				<p className={styles.highlight_location}>
					{location ? location : "location"}
				</p>
				<Rating rating={4} />
			</div>
		</div>
	);
};

export default HotelHighlight;
