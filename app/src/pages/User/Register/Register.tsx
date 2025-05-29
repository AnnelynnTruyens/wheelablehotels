import styles from "./Register.module.css";

import RegisterForm from "../../../components/Forms/RegisterForm";

const Register = () => {
	return (
		<main id="main" className={styles.main}>
			<RegisterForm />
		</main>
	);
};

export default Register;
