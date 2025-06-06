import styles from "../Forms.module.css";

interface FormCheckboxProps {
	label: string;
	id: string;
	name: string;
	value: string;
	placeholder?: string;
	checked?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
	label,
	id,
	name,
	value,
	placeholder,
	checked,
	onChange,
}) => {
	return (
		<div className={styles.checkbox}>
			<input
				className={styles.checkbox_input}
				type="checkbox"
				id={id}
				name={name}
				value={value}
				placeholder={placeholder}
				checked={checked}
				onChange={onChange}
			/>
			<label className={styles.checkbox_label} htmlFor={id}>
				{label}
			</label>
		</div>
	);
};

export default FormCheckbox;
