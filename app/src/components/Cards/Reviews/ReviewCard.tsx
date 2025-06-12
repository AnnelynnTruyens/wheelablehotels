import Rating from "../Hotels/Partials/Rating";
import styles from "./ReviewCard.module.css";

interface ReviewCardProps {
	username: string;
	rating: number;
	review: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
	username,
	rating,
	review,
}) => {
	return (
		<div className={styles.review}>
			<div className={styles.review_top}>
				<p className={styles.name}>{username}</p>
				<Rating rating={rating} />
			</div>
			{review ? <p className={styles.review_text}>{review}</p> : null}
		</div>
	);
};

export default ReviewCard;
