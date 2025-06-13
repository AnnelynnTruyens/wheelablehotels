import styles from "../Forms.module.css";

interface SuccessMessageProps {
	message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
	return <p className={styles.success}>{message}</p>;
};

export default SuccessMessage;
