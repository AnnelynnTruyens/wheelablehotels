import styles from "./HotelCard.module.css";
import Rating from "./Partials/Rating";

interface HotelCardProps {
	hotelName: string;
	location: string;
	accessibilityFeatures: string[];
}

const HotelCard: React.FC<HotelCardProps> = ({
	hotelName,
	location,
	accessibilityFeatures,
}) => {
	return (
		<div className={styles.hotel_card}>
			<img src="" alt="" className={styles.card_img} />
			<div className={styles.card_info}>
				<div className={styles.card_info_left}>
					<h2 className={styles.card_title}>{hotelName}</h2>
					<p className={styles.card_location}>{location}</p>
					<ul className={styles.card_features}>
						{accessibilityFeatures.map((feature, index) => {
							return (
								<li className={styles.card_li} key={`feature_${index}`}>
									{feature}
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
