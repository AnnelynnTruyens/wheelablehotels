import { useLocation } from "react-router";
import styles from "./Hotels.module.css";
import ReviewForm from "../../components/Forms/ReviewForm";

const AddReview = () => {
	const location = useLocation();
	const hotelId = location.state?.hotelId;
	const hotelName = location.state?.hotelName;
	return (
		<main id="main" className="main">
			<h1 className={styles.review_title}>Add review</h1>
			<p className={styles.review_text}>Hotel: {hotelName}</p>
			<ReviewForm hotelId={hotelId} />
		</main>
	);
};

export default AddReview;
