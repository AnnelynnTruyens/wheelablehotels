import { Link } from "react-router";
import styles from "../Forms.module.css";
import ROUTES from "../../../consts/Routes";
import Progress from "./Partials/Progress";
import FormInput from "../Partials/FormInput";
import React, { useState } from "react";

interface AddStartProps {
	goToNext: (name: string) => void; // Callback to handle going to next step
}

const AddStart: React.FC<AddStartProps> = ({ goToNext }) => {
	const [formData, setFormData] = useState({
		hotelName: "",
	});

	// Function to handle change in form
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		goToNext(formData.hotelName);
	};

	return (
		<div className={styles.container_full}>
			<Progress step={1} />
			<h1 className={styles.title}>Add hotel</h1>
			<form method="post" className={styles.form} onSubmit={handleSubmit}>
				<FormInput
					label="Name hotel"
					type="text"
					id="hotelName"
					name="hotelName"
					value={formData.hotelName}
					placeholder="Brussels Plaza Hotel"
					onChange={handleChange}
					required={true}
				/>
				<div className={styles.buttons}>
					<Link to={ROUTES.home}>Cancel</Link>
					<button type="submit">Next</button>
				</div>
			</form>
		</div>
	);
};

export default AddStart;
