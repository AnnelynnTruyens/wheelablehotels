import styles from "../Forms.module.css";

interface FormFileInputProps {
	label: string;
	id: string;
	name: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
}

const FormFileInput: React.FC<FormFileInputProps> = ({
	label,
	id,
	name,
	onChange,
	required = false,
}) => {
	return (
		<div className={styles.form_input}>
			<label className={styles.label} htmlFor={id}>
				{label}
			</label>
			<input
				className={styles.input}
				id={id}
				type="file"
				name={name}
				onChange={onChange}
				required={required}
				multiple
				accept=".jpg, .jpeg, .png"
			/>
		</div>
	);
};

export default FormFileInput;
