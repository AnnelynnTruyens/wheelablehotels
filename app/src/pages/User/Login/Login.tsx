import styles from "./Login.module.css";

import LoginForm from "../../../components/Forms/LoginForm";

const Login = () => {
	return (
		<main id="main" className={styles.main}>
			<LoginForm />
		</main>
	);
};

export default Login;
