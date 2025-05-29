import styles from "../Forms.module.css";

const FormInput = ({
	label,
	type,
	inputId,
	placeholder,
	value,
}: {
	label: string;
	type: string;
	inputId: string;
	placeholder?: string | undefined;
	value?: string | number | undefined;
}) => {
	return (
		<div className={styles.form_input}>
			<label className={styles.label} htmlFor={inputId}>
				{label}
			</label>
			<input
				className={styles.input}
				type={type}
				value={value}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default FormInput;
