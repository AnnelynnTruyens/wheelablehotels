import { FormEvent } from "react";
import styles from "./Forms.module.css";
import FormInput from "./Partials/FormInput";

interface SearchFormProps {
	searchValue: string;
	onSearchChange: (value: string) => void;
	onSearchSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
	searchValue,
	onSearchChange,
	onSearchSubmit,
}) => {
	return (
		<form className={styles.search_form} onSubmit={onSearchSubmit}>
			<FormInput
				label="search"
				type="search"
				id="search-hotel"
				name="search-hotel"
				placeholder="Search destination or hotel"
				value={searchValue}
				required={false}
				onChange={(e) => onSearchChange(e.target.value)}
			/>
			<button type="submit" className={styles.search_btn}>
				Search
			</button>
		</form>
	);
};

export default SearchForm;
