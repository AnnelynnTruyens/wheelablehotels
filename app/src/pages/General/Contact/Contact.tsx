import { useLocation } from "react-router";
import ContactForm from "../../../components/Forms/ContactForm";
import styles from "./Contact.module.css";

const Contact = () => {
	const location = useLocation();
	const hotelId = location.state?.hotelId;
	const hotelName = location.state?.hotelName;

	return (
		<main id="main" className={styles.main}>
			<title>Contact | Wheelable Hotels</title>
			<h1>Contact</h1>
			{hotelName ? <p>Hotel: {hotelName}</p> : null}
			<ContactForm hotelId={hotelId} />
		</main>
	);
};

export default Contact;
