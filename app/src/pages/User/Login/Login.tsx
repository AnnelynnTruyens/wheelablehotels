import styles from "./Login.module.css";

import LoginForm from "../../../components/Forms/LoginForm";

interface LoginProps {
	onLogin: (token: string) => void; // Callback to handle login success
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
	return (
		<main id="main" className={styles.main}>
			<LoginForm onLogin={onLogin} />
		</main>
	);
};

export default Login;
