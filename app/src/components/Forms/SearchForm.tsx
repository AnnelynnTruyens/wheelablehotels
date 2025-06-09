import styles from "./Forms.module.css";
import FormInput from "./Partials/FormInput";

const SearchForm = () => {
	return (
		<form className={styles.search_form}>
			<FormInput
				label="search"
				type="search"
				id="search-hotel"
				name="search-hotel"
				placeholder="Search destination or hotel"
				value=""
				required
			/>
			<button type="submit" className={styles.search_btn}>
				Search
			</button>
		</form>
	);
};

export default SearchForm;
