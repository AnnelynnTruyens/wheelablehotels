import styles from "../Forms.module.css";

interface FormInputProps {
	label: string;
	type: string;
	id: string;
	name: string;
	value: string;
	placeholder?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
	label,
	type,
	id,
	name,
	value,
	placeholder,
	onChange,
}) => {
	return (
		<div className={styles.form_input}>
			<label className={styles.label} htmlFor={id}>
				{label}
			</label>
			<input
				className={styles.input}
				type={type}
				id={id}
				name={name}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
			/>
		</div>
	);
};

export default FormInput;
