import { useNavigate } from "react-router";
import styles from "./Buttons.module.css";

interface GoBackProps {
	text: string;
}

const GoBack: React.FC<GoBackProps> = ({ text }) => {
	// Define navigate for goBack function
	const navigate = useNavigate();

	// Function to go back to previous page
	const goBack = () => {
		navigate(-1);
	};

	return (
		<button onClick={goBack} className={styles.back_link}>
			<svg className={styles.back_link_arrow} viewBox="0 0 16 16">
				<path d="M10 12L6 8L10 4" />
			</svg>
			{text}
		</button>
	);
};

export default GoBack;
