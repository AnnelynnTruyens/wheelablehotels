import styles from "./Hotels.module.css";

import HotelCard from "../../components/Cards/Hotels/HotelCard";
import FilterForm from "../../components/Forms/FilterForm";
import SearchForm from "../../components/Forms/SearchForm";

const Hotels = () => {
	return (
		<main id="main" className={styles.main}>
			<title>Hotels | Wheelable Hotels</title>
			<SearchForm />
			<h1>Search hotels</h1>
			<div className={styles.content_flex}>
				<FilterForm />
				<HotelCard
					hotelName="hotel name"
					location="location"
					accessibilityFeatures={["feature", "feature"]}
				/>
			</div>
		</main>
	);
};

export default Hotels;
