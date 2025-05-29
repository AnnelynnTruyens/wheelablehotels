import { Link } from "react-router";
import ROUTES from "../../consts/Routes";
import styles from "./Forms.module.css";
import FormInput from "./Partials/FormInput";

const RegisterForm = () => {
	return (
		<div className={styles.container}>
			<p className={styles.title}>Join our community!</p>
			<form method="post" className={styles.form}>
				<FormInput
					label="Username"
					type="text"
					inputId="username"
					placeholder="JohnDoe"
				/>
				<FormInput
					label="Email"
					type="email"
					inputId="email"
					placeholder="john.doe@example.com"
				/>
				<FormInput label="Password" type="text" inputId="password" />
				<div className={styles.buttons}>
					<button>Register</button>
					<Link to={ROUTES.login}>I already have an account</Link>
				</div>
			</form>
		</div>
	);
};

export default RegisterForm;
