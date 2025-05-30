import styles from "./Register.module.css";

import RegisterForm from "../../../components/Forms/RegisterForm";

// Type register component
interface RegisterProps {
	onLogin: (token: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
	return (
		<main id="main" className={styles.main}>
			<RegisterForm onLogin={onLogin} />
		</main>
	);
};

export default Register;
