import { Link } from "react-router";
import styles from "./Forms.module.css";
import FormInput from "./Partials/FormInput";
import ROUTES from "../../consts/Routes";

const LoginForm = () => {
	return (
		<div className={styles.container}>
			<p className={styles.title}>Log in here!</p>
			<form method="post" className={styles.form}>
				<FormInput
					label="Username"
					type="text"
					inputId="username"
					placeholder="JohnDoe"
				/>
				<FormInput label="Password" type="text" inputId="password" />
				<div className={styles.buttons}>
					<button>Login</button>
					<Link to={ROUTES.register}>I don't have an account yet</Link>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
